import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { resolveContactConfig } from "./src/site";
import { publicSentryVariables, resolveSentryBuildConfig } from "./scripts/sentry-build-config";

export default defineConfig(({ mode, command, isSsrBuild }) => {
  const environment = {
    ...loadEnv(mode, process.cwd(), "VITE_"),
    ...process.env,
  };
  const fixture = process.env.COBALT_BUILD_FIXTURE === "true";
  if (fixture) {
    for (const key of publicSentryVariables) environment[key] = "";
  }
  const allowedPublicVariables = new Set<string>([
    "VITE_FORM_ENDPOINT",
    ...publicSentryVariables,
  ]);
  const unsupported = Object.keys(environment).filter(
    (key) =>
      key.startsWith("VITE_") &&
      !allowedPublicVariables.has(key) &&
      environment[key],
  );
  if (unsupported.length)
    throw new Error(
      `Unsupported public build variables: ${unsupported.join(", ")}. Remove them; secrets belong server-side. Values intentionally not logged.`,
    );
  const endpoint = environment.VITE_FORM_ENDPOINT || "";
  resolveContactConfig(endpoint);
  const sentry = resolveSentryBuildConfig(environment, { command, isSsrBuild, fixture });
  const artifactPolicy: Plugin = {
    name: "cobalt-private-source-map-policy",
    configResolved(config) {
      if (
        sentry &&
        (path.resolve(config.root, config.build.outDir) !== path.resolve(process.cwd(), "dist") ||
          config.build.sourcemap !== "hidden" ||
          process.env.NODE_ENV === "development")
      ) {
        throw new Error("Monitored builds require the production dist pipeline with hidden private source maps. Values intentionally not logged.");
      }
    },
  };
  return {
    plugins: [react(), artifactPolicy, ...(sentry ? sentryVitePlugin(sentry) : [])],
    appType: "mpa",
    // The plugin deletes hidden maps after upload, including upload failures.
    // The build wrapper and output scanner also enforce map-free artifacts.
    build: { sourcemap: sentry ? "hidden" : false },
    define: fixture
      ? Object.fromEntries(publicSentryVariables.map((key) => [`import.meta.env.${key}`, '""']))
      : undefined,
  };
});
