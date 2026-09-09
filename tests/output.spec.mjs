import { test, expect } from "@playwright/test";
import { checkOutput } from "../scripts/check-output.mjs";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { resolveContactConfig } from "../src/site.ts";

test("final production output passes the targeted credential and privacy scan", async () => {
  expect(await checkOutput()).toContain("passed");
});

test("credential scan detects prohibited output without printing its values", async () => {
  const folder = await mkdtemp(path.join(os.tmpdir(), "cobalt-scan-"));
  const canary = `AKIA${"Z".repeat(16)}`;
  try {
    await writeFile(
      path.join(folder, "bundle.js"),
      `const unsafe = '${canary}';`,
    );
    await expect(checkOutput(folder)).rejects.toThrow("AWS credential");
    try {
      await checkOutput(folder);
    } catch (error) {
      expect(error.message).not.toContain(canary);
    }
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

// Synthetic rejection data only. No owner recipient or credential is read.
const fakeToken = "0123456789abcdef0123456789abcdef";
const endpoint = `https://formsubmit.co/ajax/${fakeToken}`;
const syntheticAddress = ["recipient", "example.invalid"].join("@");
const retiredHost = ["form", "spree", ".io"].join("");
const rejectedEndpoints = [
  ["raw recipient", `https://formsubmit.co/ajax/${syntheticAddress}`],
  ["encoded recipient", `https://formsubmit.co/ajax/${encodeURIComponent(syntheticAddress)}`],
  ["double-encoded recipient", `https://formsubmit.co/ajax/${encodeURIComponent(encodeURIComponent(syntheticAddress))}`],
  ["encoded letters", `https://formsubmit.co/ajax/%72ecipient%40example%2einvalid`],
  ["recipient route", `https://formsubmit.co/${syntheticAddress}`],
  ["retired provider", `https://${retiredHost}/f/${fakeToken}`],
  ["other API provider", "https://api.web3forms.com/submit"],
  ["other hosted form", `https://getform.io/f/${fakeToken}`],
  ["archive route", `https://formsubmit.co/api/get-submissions/${fakeToken}`],
  ["API key route", `https://formsubmit.co/api/get-apikey/${fakeToken}`],
  ["HTTP", endpoint.replace("https:", "http:")],
  ["protocol relative", endpoint.replace("https:", "")],
  ["username", endpoint.replace("//", "//private-canary-value@")],
  ["password", endpoint.replace("//", "//user:private-canary-value@")],
  ["query", `${endpoint}?token=private-canary-value`],
  ["fragment", `${endpoint}#private-canary-value`],
  ["lookalike host", endpoint.replace(".co/", ".co.evil.invalid/")],
  ["subdomain", endpoint.replace("//", "//www.")],
  ["explicit port", endpoint.replace(".co/", ".co:443/")],
  ["missing token", "https://formsubmit.co/ajax/"],
  ["short token", "https://formsubmit.co/ajax/short"],
  ["overlong token", `https://formsubmit.co/ajax/${"a".repeat(129)}`],
  ["whitespace only", "   "],
  ["leading space", ` ${endpoint}`],
  ["trailing newline", `${endpoint}\n`],
  ["internal space", `${endpoint} token`],
  ["extra segment", `${endpoint}/extra`],
  ["trailing slash", `${endpoint}/`],
  ["dot in token", `${endpoint}.`],
  ["traversal", `https://formsubmit.co/ajax/../${fakeToken}`],
  ["encoded slash", `${endpoint}%2Fextra`],
  ["backslash", `${endpoint}\\extra`],
  ["wrong path case", endpoint.replace("/ajax/", "/AJAX/")],
];

test("only anonymous AJAX aliases enable the contact configuration", () => {
  expect(resolveContactConfig()).toEqual({ enabled: false, endpoint: "" });
  expect(resolveContactConfig("")).toEqual({ enabled: false, endpoint: "" });
  for (const token of [fakeToken, "A_b-Cd9_".repeat(2), "a".repeat(128)]) {
    const configured = resolveContactConfig(`https://formsubmit.co/ajax/${token}`);
    expect(configured).toMatchObject({
      enabled: true,
      provider: "FormSubmit",
      documentationUrl: "https://formsubmit.co/documentation",
      privacyUrl: "https://formsubmit.co/privacy",
    });
  }
  for (const [label, value] of rejectedEndpoints) {
    let rejected = false;
    try { resolveContactConfig(value); }
    catch (error) {
      rejected = true;
      expect(error.message.includes("Value intentionally not logged"), label).toBe(true);
      expect(error.message.includes(value), label).toBe(false);
    }
    expect(rejected, label).toBe(true);
  }
});

test("build refuses unsafe endpoints and unsupported public variables without logging values", () => {
  const cases = rejectedEndpoints.map(([label, value]) => [label, { VITE_FORM_ENDPOINT: value }]);
  cases.push(
    ["legacy browser key", { VITE_FORM_KEY: "private-canary-value" }],
    ["unsupported token variable", { VITE_API_TOKEN: "private-canary-value" }],
  );
  for (const [label, values] of cases) {
    const result = spawnSync(
      process.execPath,
      ["node_modules/vite/bin/vite.js", "build"],
      {
        env: { ...process.env, VITE_FORM_ENDPOINT: "", ...values },
        encoding: "utf8",
      },
    );
    const output = `${result.stderr}${result.stdout}`;
    expect(result.status !== 0, label).toBe(true);
    expect(output.includes("Value"), label).toBe(true);
    // Boolean assertions prevent test failure output from exposing rejected input.
    expect(output.includes("private-canary-value"), label).toBe(false);
    if (values.VITE_FORM_ENDPOINT?.trim())
      expect(output.includes(values.VITE_FORM_ENDPOINT), label).toBe(false);
  }
});

test("output scan permits anonymous aliases and rejects unsafe provider output with redacted diagnostics", async () => {
  const folder = await mkdtemp(path.join(os.tmpdir(), "cobalt-provider-scan-"));
  try {
    await writeFile(path.join(folder, "bundle.js"), `const endpoint = "${endpoint}";`);
    expect(await checkOutput(folder)).toContain("passed");
    for (const value of [
      `https://${retiredHost}/f/${fakeToken}`,
      `https://formsubmit.co/ajax/${encodeURIComponent(syntheticAddress)}`,
      `https://formsubmit.co/${syntheticAddress}`,
      `https://formsubmit.co/api/get-submissions/${fakeToken}`,
      `${endpoint}?token=private-canary-value`,
    ]) {
      await writeFile(path.join(folder, "bundle.js"), `const endpoint = "${value}";`);
      let rejected = false;
      try { await checkOutput(folder); }
      catch (error) {
        rejected = true;
        expect(error.message.includes(value)).toBe(false);
        expect(error.message.includes(syntheticAddress)).toBe(false);
      }
      expect(rejected).toBe(true);
    }
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});
