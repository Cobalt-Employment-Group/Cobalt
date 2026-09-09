import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolveContactConfig } from "./src/site";

export default defineConfig(({ mode }) => {
  const environment = {
    ...loadEnv(mode, process.cwd(), "VITE_"),
    ...process.env,
  };
  const unsupported = Object.keys(environment).filter(
    (key) =>
      key.startsWith("VITE_") &&
      key !== "VITE_FORM_ENDPOINT" &&
      environment[key],
  );
  if (unsupported.length)
    throw new Error(
      `Unsupported public build variables: ${unsupported.join(", ")}. Remove them; secrets belong server-side. Values intentionally not logged.`,
    );
  const endpoint = environment.VITE_FORM_ENDPOINT || "";
  resolveContactConfig(endpoint);
  return { plugins: [react()], appType: "mpa", build: { sourcemap: false } };
});
