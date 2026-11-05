import { test, expect } from "@playwright/test";
import { resolveSentryBuildConfig } from "../scripts/sentry-build-config.ts";
import { checkOutput } from "../scripts/check-output.mjs";
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

// Confirmed public target IDs with a synthetic DSN key, release, and CI token.
const configured = {
  VITE_SENTRY_DSN: `https://${"a".repeat(32)}@o4512373753249792.ingest.us.sentry.io/4512376742543360`,
  VITE_SENTRY_ENVIRONMENT: "production",
  VITE_SENTRY_RELEASE: `cobalt-web@${"a".repeat(40)}`,
  SENTRY_UPLOAD_SOURCEMAPS: "true",
  SENTRY_ORG: "master-planning",
  SENTRY_ORG_ID: "4512373753249792",
  SENTRY_PROJECT: "cobalt-web",
  SENTRY_PROJECT_ID: "4512376742543360",
  SENTRY_AUTH_TOKEN: "synthetic-private-build-token",
};

test("unconfigured builds, fixture builds, and SSR never upload maps", () => {
  expect(resolveSentryBuildConfig({}, { command: "build" })).toBeUndefined();
  expect(resolveSentryBuildConfig(configured, { command: "build", fixture: true })).toBeUndefined();
  expect(resolveSentryBuildConfig(configured, { command: "build", isSsrBuild: true })).toBeUndefined();
  expect(resolveSentryBuildConfig(configured, { command: "serve" })).toBeUndefined();
});

test("production map upload is fixed to the confirmed Cobalt project", () => {
  const options = resolveSentryBuildConfig(configured, { command: "build" });
  expect(options).toMatchObject({
    org: configured.SENTRY_ORG,
    project: "cobalt-web",
    url: "https://sentry.io/",
    telemetry: false,
    silent: true,
    debug: false,
    release: {
      name: configured.VITE_SENTRY_RELEASE,
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
  });
});

test("invalid or partial monitoring configuration blocks builds without echoing values", () => {
  const cases = [
    { VITE_SENTRY_DSN: "synthetic-private-build-token" },
    { VITE_SENTRY_ENVIRONMENT: "staging" },
    { VITE_SENTRY_RELEASE: "customer-sensitive-release" },
    { SENTRY_UPLOAD_SOURCEMAPS: "" },
    { SENTRY_ORG: "" },
    { SENTRY_ORG: "synthetic.private.invalid" },
    { SENTRY_ORG: "another-valid-slug" },
    { SENTRY_ORG_ID: "654321" },
    { SENTRY_PROJECT: "another-repo" },
    { SENTRY_PROJECT_ID: "210987" },
    { SENTRY_AUTH_TOKEN: "" },
    { SENTRY_AUTH_TOKEN: " synthetic-private-build-token" },
    { SENTRY_URL: "https://another-collector.invalid/" },
    { VITE_SENTRY_DSN: `${configured.VITE_SENTRY_DSN}?credential=synthetic-private-build-token` },
    { VITE_SENTRY_DSN: configured.VITE_SENTRY_DSN.replace("ingest.us", "ingest.de") },
    { VITE_SENTRY_DSN: configured.VITE_SENTRY_DSN.replace("ingest.us", "ingest") },
    {
      VITE_SENTRY_DSN: configured.VITE_SENTRY_DSN.replace("4512373753249792", "123456"),
      SENTRY_ORG_ID: "123456",
    },
    {
      VITE_SENTRY_DSN: configured.VITE_SENTRY_DSN.replace("4512376742543360", "789012"),
      SENTRY_PROJECT_ID: "789012",
    },
  ];
  for (const overrides of cases) {
    let failure;
    try {
      resolveSentryBuildConfig({ ...configured, ...overrides }, { command: "build" });
    } catch (error) {
      failure = error;
    }
    expect(failure).toBeInstanceOf(Error);
    expect(failure.message).toContain("Values intentionally not logged");
    for (const value of Object.values(overrides).filter((value) => value.length >= 8)) {
      expect(failure.message.includes(value)).toBe(false);
    }
  }
});

test("source-map upload failure blocks deployment without upstream data", () => {
  const options = resolveSentryBuildConfig(configured, { command: "build" });
  let failure;
  try {
    options.errorHandler(new Error("synthetic-private-build-token sensitive upstream response"));
  } catch (error) {
    failure = error;
  }
  expect(failure.message).toContain("deployment blocked");
  expect(failure.message).not.toContain("synthetic-private-build-token");
  expect(failure.message).not.toContain("upstream response");
});

test("output scanner exempts only the exact configured public DSN and retains email protection", async () => {
  const folder = await mkdtemp(path.join(os.tmpdir(), "cobalt-sentry-scan-"));
  try {
    const options = { publicSentryDsn: configured.VITE_SENTRY_DSN };
    await writeFile(path.join(folder, "bundle.js"), JSON.stringify(configured.VITE_SENTRY_DSN));
    expect(await checkOutput(folder, options)).toContain("passed");
    await expect(checkOutput(folder, { publicSentryDsn: "" })).rejects.toThrow("recipient address");
    await writeFile(path.join(folder, "bundle.js"), JSON.stringify([
      configured.VITE_SENTRY_DSN,
      "private-recipient@example.invalid",
    ]));
    await expect(checkOutput(folder, options)).rejects.toThrow("recipient address");
    await writeFile(path.join(folder, "bundle.js"), JSON.stringify(configured.VITE_SENTRY_DSN.replace("4512376742543360", "789013")));
    await expect(checkOutput(folder, options)).rejects.toThrow("recipient address");
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test("enabled browser bundle supports private debug maps and still passes the artifact privacy scan", async () => {
  const folder = await mkdtemp(path.join(os.tmpdir(), "cobalt-sentry-build-"));
  try {
    const { build } = await import("vite");
    const { default: react } = await import("@vitejs/plugin-react");
    const { sentryVitePlugin } = await import("@sentry/vite-plugin");
    // Exercise the real SDK and debug-ID injection entirely offline. Upload is
    // disabled for this disposable artifact, and no real token is supplied.
    await build({
      configFile: false,
      logLevel: "silent",
      publicDir: false,
      plugins: [react(), ...sentryVitePlugin({
        telemetry: false,
        silent: true,
        authToken: "",
        sourcemaps: { disable: "disable-upload" },
        release: {
          name: configured.VITE_SENTRY_RELEASE,
          inject: false,
          create: false,
          finalize: false,
          setCommits: false,
          deploy: false,
        },
      })],
      define: Object.fromEntries(Object.entries(configured)
        .filter(([key]) => key.startsWith("VITE_"))
        .concat([["VITE_FORM_ENDPOINT", ""]])
        .map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)])),
      build: { outDir: folder, emptyOutDir: true, sourcemap: "hidden" },
    });
    const names = await readdir(path.join(folder, "assets"));
    const maps = names.filter((name) => name.endsWith(".js.map"));
    expect(maps.length).toBeGreaterThan(0);
    for (const name of maps) {
      const map = JSON.parse(await readFile(path.join(folder, "assets", name), "utf8"));
      expect(map.debug_id).toMatch(/^[a-f0-9-]{36}$/);
      expect(map.sources.some((source) => source.includes("monitoring"))).toBe(true);
      const bundle = await readFile(path.join(folder, "assets", name.slice(0, -4)), "utf8");
      expect(bundle).toContain(map.debug_id);
      expect(bundle).toContain(configured.VITE_SENTRY_DSN);
      expect(bundle).not.toContain("sourceMappingURL=");
      await rm(path.join(folder, "assets", name));
    }
    expect(await checkOutput(folder, { publicSentryDsn: configured.VITE_SENTRY_DSN })).toContain("passed");
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});
