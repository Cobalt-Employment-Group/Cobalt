import type { SentryVitePluginOptions } from "@sentry/vite-plugin";

type Environment = Record<string, string | undefined>;

export const publicSentryVariables = [
  "VITE_SENTRY_DSN",
  "VITE_SENTRY_ENVIRONMENT",
  "VITE_SENTRY_RELEASE",
] as const;

const dsnPattern =
  /^https:\/\/[a-f0-9]{32}@o([0-9]+)\.ingest\.us\.sentry\.io\/([0-9]+)$/;

// Confirmed in Sentry; never derive the destination from mutually matching but
// unapproved CI inputs, which could silently send Cobalt artifacts elsewhere.
const target = {
  org: "master-planning",
  orgId: "4512373753249792",
  project: "cobalt-web",
  projectId: "4512376742543360",
} as const;

function reject(message: string): never {
  throw new Error(`${message} Values intentionally not logged.`);
}

// This validates targeting, not token authorization. CI must receive a dedicated
// Cobalt artifact credential; never a personal or organization-admin token.
export function resolveSentryBuildConfig(
  environment: Environment,
  { command, isSsrBuild = false, fixture = false }: {
    command: string;
    isSsrBuild?: boolean;
    fixture?: boolean;
  },
): SentryVitePluginOptions | undefined {
  if (fixture || isSsrBuild) return undefined;
  const configured = publicSentryVariables.some((key) => environment[key]);
  if (!configured) return undefined;

  const match = dsnPattern.exec(environment.VITE_SENTRY_DSN || "");
  if (
    !match ||
    match[1] !== target.orgId ||
    match[2] !== target.projectId ||
    environment.VITE_SENTRY_ENVIRONMENT !== "production" ||
    !/^cobalt-web@[a-f0-9]{7,40}$/.test(environment.VITE_SENTRY_RELEASE || "")
  ) {
    reject("Sentry requires a valid project DSN, production environment, and cobalt-web Git release.");
  }
  // Development never uploads maps or needs CI credentials. The browser SDK is
  // independently gated on a production build and the canonical HTTPS host.
  if (command !== "build") return undefined;
  if (
    environment.SENTRY_UPLOAD_SOURCEMAPS !== "true" ||
    environment.SENTRY_ORG !== target.org ||
    environment.SENTRY_PROJECT !== target.project ||
    environment.SENTRY_ORG_ID !== target.orgId ||
    environment.SENTRY_PROJECT_ID !== target.projectId ||
    !environment.SENTRY_AUTH_TOKEN ||
    environment.SENTRY_AUTH_TOKEN.trim() !== environment.SENTRY_AUTH_TOKEN ||
    (environment.SENTRY_URL && environment.SENTRY_URL !== "https://sentry.io/")
  ) {
    reject("Monitored production builds require explicit private source-map upload, confirmed organization/project IDs matching the DSN, and a dedicated CI token.");
  }

  return {
    org: target.org,
    project: target.project,
    authToken: environment.SENTRY_AUTH_TOKEN,
    url: "https://sentry.io/",
    telemetry: false,
    silent: true,
    debug: false,
    release: {
      name: environment.VITE_SENTRY_RELEASE,
      inject: false,
      create: true,
      finalize: true,
      setCommits: false,
      deploy: false,
    },
    sourcemaps: {
      assets: "./dist/assets/**",
      filesToDeleteAfterUpload: "./dist/**/*.map",
    },
    errorHandler: () => {
      // Do not log an upstream response, token, payload, or underlying error.
      reject("Private Sentry source-map upload failed; deployment blocked.");
    },
  };
}
