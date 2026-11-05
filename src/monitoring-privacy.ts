import { SDK_VERSION } from "@sentry/react";
import type { BrowserOptions, ErrorEvent, Event, StackFrame } from "@sentry/react";

export type MonitoringEnvironment = {
  readonly PROD?: boolean;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_ENVIRONMENT?: string;
  readonly VITE_SENTRY_RELEASE?: string;
};

export type MonitoringConfig = {
  dsn: string;
  release: string;
  origin: "https://www.cobaltemployment.com";
};

type Transport = ReturnType<NonNullable<BrowserOptions["transport"]>>;
export type MonitoringEnvelope = Parameters<Transport["send"]>[0];

const productionOrigin = "https://www.cobaltemployment.com";
// Verified shared Master Planning organization and its Cobalt web project.
// The public key may rotate; organization, region, and project must not drift.
const dsnPattern = /^https:\/\/[a-f0-9]{32}@o4512373753249792\.ingest\.us\.sentry\.io\/4512376742543360$/;
const releasePattern = /^cobalt-web@[a-f0-9]{7,40}$/;
const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const eventIdPattern = /^[a-f0-9]{32}$/;

// Configuration is opt-in. A production Vite build alone must never activate previews.
export function resolveMonitoringConfig(
  environment: MonitoringEnvironment,
  pageUrl: string,
): MonitoringConfig | null {
  if (
    environment.PROD !== true ||
    environment.VITE_SENTRY_ENVIRONMENT !== "production" ||
    !dsnPattern.test(environment.VITE_SENTRY_DSN ?? "") ||
    !releasePattern.test(environment.VITE_SENTRY_RELEASE ?? "")
  ) return null;
  try {
    const page = new URL(pageUrl);
    if (
      page.origin !== productionOrigin || page.username || page.password ||
      !["/", "/index.html"].includes(page.pathname)
    )
      return null;
    return {
      dsn: environment.VITE_SENTRY_DSN!,
      release: environment.VITE_SENTRY_RELEASE!,
      origin: productionOrigin,
    };
  } catch {
    return null;
  }
}

// Only deployed, loaded application modules can identify an application stack.
// Paths supplied by visitors, third-party scripts, and inline/eval code are excluded.
export function safeAssetUrl(value: unknown, config: MonitoringConfig): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value, config.origin);
    if (
      url.origin !== config.origin || url.username || url.password ||
      !/^\/assets\/[A-Za-z0-9_-]+-[A-Za-z0-9_-]{8,}\.js$/.test(url.pathname)
    ) return null;
    return `${config.origin}${url.pathname}`;
  } catch {
    return null;
  }
}

function safePosition(value: unknown): number | undefined {
  return typeof value === "number" && Number.isSafeInteger(value) &&
    value > 0 && value < 100_000_000 ? value : undefined;
}

function safeFrame(
  frame: StackFrame,
  config: MonitoringConfig,
  assets: ReadonlySet<string>,
): StackFrame | null {
  const filename = safeAssetUrl(frame.filename, config);
  if (!filename || !assets.has(filename)) return null;
  const lineno = safePosition(frame.lineno);
  const colno = safePosition(frame.colno);
  if (!lineno) return null;
  return {
    filename,
    lineno,
    ...(colno && { colno }),
    in_app: true,
    ...(frame.debug_id && uuidPattern.test(frame.debug_id) && {
      debug_id: frame.debug_id,
    }),
  };
}

// Reconstruct an event rather than redacting keys: free text can contain customer
// information without matching any credential or personal-data pattern.
export function sanitizeMonitoringEvent(
  event: Event,
  config: MonitoringConfig,
  assets: ReadonlySet<string>,
): ErrorEvent | null {
  if (event.type !== undefined || !eventIdPattern.test(event.event_id ?? ""))
    return null;
  const frames = (event.exception?.values ?? []).flatMap((exception) =>
    (exception.stacktrace?.frames ?? []).flatMap((frame) => {
      const safe = safeFrame(frame, config, assets);
      return safe ? [safe] : [];
    }),
  ).slice(-40);
  if (!frames.length) return null;
  const frameFiles = new Set(frames.map((frame) => frame.filename));
  const images = (event.debug_meta?.images ?? []).flatMap((image) => {
    const codeFile = safeAssetUrl(image.code_file, config);
    return image.type === "sourcemap" && codeFile && frameFiles.has(codeFile) &&
      uuidPattern.test(image.debug_id) ? [{
        type: "sourcemap" as const,
        code_file: codeFile,
        debug_id: image.debug_id,
      }] : [];
  }).slice(0, 40);
  return {
    type: undefined,
    event_id: event.event_id,
    timestamp: Date.now() / 1000,
    platform: "javascript",
    level: "error",
    environment: "production",
    release: config.release,
    sdk: {
      name: "sentry.javascript.react",
      version: SDK_VERSION,
      settings: { infer_ip: "never" },
    },
    exception: { values: [{
      type: "Error",
      value: "Cobalt application error",
      stacktrace: { frames },
    }] },
    ...(images.length && { debug_meta: { images } }),
  };
}

// The SDK adds envelope metadata after beforeSend. Enforce the same allowlist at
// the final transport boundary, including when future code tries other item types.
export function sanitizeMonitoringEnvelope(
  envelope: MonitoringEnvelope,
  config: MonitoringConfig,
  assets: ReadonlySet<string>,
): MonitoringEnvelope | null {
  for (const [header, payload] of envelope[1]) {
    if (header.type !== "event" || !payload || typeof payload !== "object")
      continue;
    const event = sanitizeMonitoringEvent(payload as Event, config, assets);
    if (event) return [{
      event_id: event.event_id!,
      sent_at: new Date().toISOString(),
      sdk: { name: "sentry.javascript.react", version: SDK_VERSION },
    }, [[{ type: "event" }, event]]];
  }
  return null;
}
