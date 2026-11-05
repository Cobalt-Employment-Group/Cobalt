import { test, expect } from "@playwright/test";
import { build } from "esbuild";
import type { Event } from "@sentry/react";
import {
  resolveMonitoringConfig,
  sanitizeMonitoringEnvelope,
  sanitizeMonitoringEvent,
} from "../src/monitoring-privacy";
import type {
  MonitoringConfig,
  MonitoringEnvelope,
} from "../src/monitoring-privacy";

const origin = "https://www.cobaltemployment.com";
const asset = `${origin}/assets/monitoring-fixture123.js`;
const orgId = "4512373753249792";
const projectId = "4512376742543360";
const dsn = `https://${"a".repeat(32)}@o${orgId}.ingest.us.sentry.io/${projectId}`;
const release = `cobalt-web@${"b".repeat(40)}`;
const debugId = "11111111-2222-4333-8444-555555555555";
const config: MonitoringConfig = { dsn, release, origin };
const assets = new Set([asset]);
const canaries = [
  "visitor@example.invalid",
  "Customer free text and private organization",
  "private-authentication-link-token",
  "private-credential-value",
];

function privateEvent(): Event {
  const secret = canaries.join(" ");
  return {
    event_id: "c".repeat(32),
    message: secret,
    release: secret,
    environment: secret,
    transaction: secret,
    user: { id: secret, email: canaries[0], ip_address: "192.0.2.1" },
    request: {
      url: `${origin}/login?token=${canaries[2]}#${canaries[2]}`,
      headers: { Authorization: secret, Cookie: secret },
      cookies: { session: secret },
      data: { name: secret, message: secret },
    },
    contexts: { private: { value: secret } },
    extra: { payload: secret },
    tags: { customer: secret },
    breadcrumbs: [{ message: secret, data: { payload: secret } }],
    fingerprint: [secret],
    exception: { values: [{
      type: secret,
      value: secret,
      mechanism: { type: secret, data: { payload: secret } },
      stacktrace: { frames: [{
        filename: `${asset}?token=${canaries[2]}#${canaries[2]}`,
        abs_path: secret,
        function: secret,
        module: secret,
        vars: { payload: secret },
        context_line: secret,
        pre_context: [secret],
        post_context: [secret],
        module_metadata: { payload: secret },
        lineno: 7,
        colno: 12,
        debug_id: debugId,
      }, {
        filename: `https://thirdparty.invalid/${canaries[2]}`,
        lineno: 1,
      }, {
        filename: `${origin}/assets/customer-${canaries[2]}.js`,
        lineno: 1,
      }] },
    }] },
    debug_meta: { images: [{
      type: "sourcemap",
      code_file: `${asset}?token=${canaries[2]}`,
      debug_id: debugId,
    }, {
      type: "sourcemap",
      code_file: `https://thirdparty.invalid/${canaries[2]}`,
      debug_id: debugId,
    }] },
  };
}

test("monitoring requires an explicit production configuration on the canonical host", () => {
  const environment = {
    PROD: true,
    VITE_SENTRY_DSN: dsn,
    VITE_SENTRY_ENVIRONMENT: "production",
    VITE_SENTRY_RELEASE: release,
  };
  expect(resolveMonitoringConfig(environment, `${origin}/?token=private`)).toEqual(config);
  const rotatedDsn = dsn.replace("a".repeat(32), "d".repeat(32));
  expect(resolveMonitoringConfig({ ...environment, VITE_SENTRY_DSN: rotatedDsn }, origin))
    .toEqual({ ...config, dsn: rotatedDsn });
  for (const page of [
    "http://www.cobaltemployment.com/",
    "https://cobaltemployment.com/",
    "https://main.d22dxgvoxraolf.amplifyapp.com/",
    "http://127.0.0.1:4173/",
    "https://www.cobaltemployment.com.evil.invalid/",
    "https://www.cobaltemployment.com:444/",
    "https://www.cobaltemployment.com/customer-private-path",
    "https://www.cobaltemployment.com/404.html",
    "https://user:password@www.cobaltemployment.com/",
  ]) expect(resolveMonitoringConfig(environment, page)).toBeNull();
  for (const override of [
    { PROD: false },
    { VITE_SENTRY_DSN: "" },
    { VITE_SENTRY_DSN: dsn.replace("https:", "http:") },
    { VITE_SENTRY_DSN: `${dsn}?token=private` },
    { VITE_SENTRY_DSN: dsn.replace("sentry.io", "sentry.io.evil.invalid") },
    { VITE_SENTRY_DSN: dsn.replace("@", ":private@") },
    { VITE_SENTRY_DSN: dsn.replace(orgId, "123") },
    { VITE_SENTRY_DSN: dsn.replace(projectId, "456") },
    { VITE_SENTRY_DSN: dsn.replace(".ingest.us.", ".ingest.de.") },
    { VITE_SENTRY_DSN: dsn.replace(".ingest.us.", ".ingest.") },
    { VITE_SENTRY_ENVIRONMENT: "preview" },
    { VITE_SENTRY_RELEASE: "" },
    { VITE_SENTRY_RELEASE: "cobalt-web@visitor@example.invalid" },
  ]) expect(resolveMonitoringConfig({ ...environment, ...override }, origin)).toBeNull();
});

test("error privacy preserves loaded application stack positions and debug IDs only", () => {
  const safe = sanitizeMonitoringEvent(privateEvent(), config, assets);
  expect(safe).not.toBeNull();
  const serialized = JSON.stringify(safe);
  for (const canary of canaries) expect(serialized.includes(canary)).toBe(false);
  expect(serialized).not.toContain("192.0.2.1");
  expect(safe?.exception?.values).toEqual([{
    type: "Error",
    value: "Cobalt application error",
    stacktrace: { frames: [{ filename: asset, lineno: 7, colno: 12, in_app: true, debug_id: debugId }] },
  }]);
  expect(safe?.debug_meta?.images).toEqual([{
    type: "sourcemap", code_file: asset, debug_id: debugId,
  }]);
  expect(safe?.sdk?.settings?.infer_ip).toBe("never");
  for (const field of ["request", "user", "contexts", "extra", "tags", "breadcrumbs", "message", "transaction", "fingerprint"])
    expect(safe).not.toHaveProperty(field);
  expect(sanitizeMonitoringEvent({ ...privateEvent(), type: "transaction" }, config, assets)).toBeNull();
  expect(sanitizeMonitoringEvent({ ...privateEvent(), exception: undefined }, config, assets)).toBeNull();
  expect(sanitizeMonitoringEvent(privateEvent(), config, new Set())).toBeNull();
});

test("transport rejects attachments, sessions, replay, logs, traces, and private envelope metadata", () => {
  const secret = canaries.join(" ");
  const unsafe = [{ trace: { transaction: secret }, private: secret }, [
    [{ type: "attachment", filename: secret }, secret],
    [{ type: "session" }, { user: secret }],
    [{ type: "replay_recording" }, secret],
    [{ type: "log" }, { message: secret }],
    [{ type: "span" }, { name: secret }],
    [{ type: "event", private: secret }, privateEvent()],
  ]] as unknown as MonitoringEnvelope;
  const safe = sanitizeMonitoringEnvelope(unsafe, config, assets);
  expect(safe?.[1]).toHaveLength(1);
  expect(safe?.[1][0][0]).toEqual({ type: "event" });
  expect(Object.keys(safe?.[0] ?? {}).sort()).toEqual(["event_id", "sdk", "sent_at"]);
  for (const canary of canaries) expect(JSON.stringify(safe).includes(canary)).toBe(false);
  expect(sanitizeMonitoringEnvelope([{}, []] as unknown as MonitoringEnvelope, config, assets)).toBeNull();
});

test("real browser SDK sends only the scrubbed event without cookies, referrer, or attachments", async ({ page, context }) => {
  // Disposable in-memory module: this test fixture never enters the site's build,
  // and has no effect on a deployed app or a real Sentry project.
  const fixtureSource = `
    import { initializeMonitoring } from "./src/monitoring";
    import { captureEvent, flush } from "@sentry/react";
    initializeMonitoring();
    document.querySelector("#send").addEventListener("click", async () => {
      captureEvent(${JSON.stringify(privateEvent())}, {
        attachments: [{filename: ${JSON.stringify(canaries[0])}, data: ${JSON.stringify(canaries.join(" "))}}],
      });
      await flush(2000);
      document.querySelector("#send").textContent = "Fixture complete";
    });
    document.querySelector("#uncaught").addEventListener("click", () => {
      throw new Error(${JSON.stringify(canaries.join(" "))});
    });
  `;
  const bundled = await build({
    stdin: { contents: fixtureSource, resolveDir: process.cwd(), loader: "ts" },
    bundle: true,
    write: false,
    format: "esm",
    platform: "browser",
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
      "import.meta.env": JSON.stringify({
        PROD: true,
        VITE_SENTRY_DSN: dsn,
        VITE_SENTRY_ENVIRONMENT: "production",
        VITE_SENTRY_RELEASE: release,
      }),
    },
  });
  const outbound: { body: string; headers: Record<string, string> }[] = [];
  const unexpected: string[] = [];
  const sdkWarnings: string[] = [];
  page.on("console", (message) => {
    if (
      ["warning", "error"].includes(message.type()) &&
      /^(?:\[Sentry\]|Sentry Logger)/.test(message.text())
    ) sdkWarnings.push(message.text());
  });
  await context.addCookies([{ name: "customer_session", value: canaries[2], url: origin }]);
  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === origin && url.pathname === "/") {
      await route.fulfill({
        contentType: "text/html",
        body: '<button id="send">Emit fixture event</button><button id="uncaught">Emit isolated uncaught error</button><script type="module" src="/assets/monitoring-fixture123.js"></script>',
      });
    } else if (request.url() === asset) {
      await route.fulfill({ contentType: "application/javascript", body: bundled.outputFiles[0].text });
    } else if (url.hostname === `o${orgId}.ingest.us.sentry.io` && url.pathname === `/api/${projectId}/envelope/`) {
      outbound.push({ body: request.postData() ?? "", headers: await request.allHeaders() });
      await route.fulfill({
        contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": origin },
        body: "{}",
      });
    } else {
      unexpected.push(`${url.origin}${url.pathname}`);
      await route.abort("blockedbyclient");
    }
  });
  await page.goto(`${origin}/?token=${canaries[2]}#${canaries[2]}`);
  await page.getByRole("button", { name: "Emit fixture event" }).click();
  await expect(page.getByRole("button", { name: "Fixture complete" })).toBeVisible();
  expect(outbound).toHaveLength(1);
  await page.getByRole("button", { name: "Emit isolated uncaught error" }).click();
  await expect.poll(() => outbound.length).toBe(2);
  expect(unexpected).toEqual([]);
  for (const request of outbound) {
    for (const canary of canaries) expect(request.body.includes(canary)).toBe(false);
    expect(request.headers).not.toHaveProperty("cookie");
    expect(request.headers).not.toHaveProperty("authorization");
    expect(request.headers).not.toHaveProperty("referer");
  }
  const lines = outbound[0].body.split("\n");
  expect(lines).toHaveLength(3);
  expect(JSON.parse(lines[1])).toEqual({ type: "event" });
  const received = JSON.parse(lines[2]);
  expect(received.sdk.settings.infer_ip).toBe("never");
  expect(received.environment).toBe("production");
  expect(received.release).toBe(release);
  expect(received.debug_meta.images[0].debug_id).toBe(debugId);
  const uncaught = JSON.parse(outbound[1].body.split("\n")[2]);
  expect(uncaught.exception.values[0].value).toBe("Cobalt application error");
  expect(uncaught.exception.values[0].stacktrace.frames.length).toBeGreaterThan(0);
  expect(uncaught.exception.values[0].stacktrace.frames.every((frame: { filename: string }) => frame.filename === asset)).toBe(true);
  expect(sdkWarnings).toEqual([]);
});
