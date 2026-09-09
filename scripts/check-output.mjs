import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export async function checkOutput(directory = "dist") {
  const failures = [];
  const patterns = [
    [
      "recipient address",
      /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+/,
    ],
    ["public telephone", /(?:\+1[ .-]?)?\(?[2-9]\d{2}\)?[ .-]\d{3}[ .-]\d{4}/],
    ["AWS credential", /(?:AKIA|ASIA)[A-Z0-9]{16}/],
    ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
    [
      "provider credential",
      /(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|sk_(?:live|test)_[A-Za-z0-9]{16,})/,
    ],
    [
      "JWT credential",
      /eyJ[A-Za-z0-9_-]{12,}\.eyJ[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}/,
    ],
    ["removed browser credential interface", /VITE_FORM_KEY|access_key/],
    ["retired form provider", new RegExp(["form", "spree"].join(""), "i")],
    ["unverified classification", /541611|\bnaics\b/i],
    [
      "excluded registration information",
      /south kingsbridge|registered[ -]agent/i,
    ],
    [
      "external sales copy",
      /request a consultation|you direct the work|we handle employment|staffing and employment services firm|worksite employer of record|assigned personnel|PEO partner/i,
    ],
  ];
  async function walk(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) {
        await walk(file);
        continue;
      }
      if (entry.name.endsWith(".map"))
        failures.push(`${file}: browser source map`);
      if (!/\.(?:html|js|json|txt|xml|css)$/.test(entry.name)) continue;
      const text = await readFile(file, "utf8");
      for (const [label, regex] of patterns)
        if (regex.test(text)) failures.push(`${file}: ${label}`);
      for (const match of text.matchAll(/https?:\/\/formsubmit\.co[^\s"'<>\\]*/gi)) {
        if (
          !/^https:\/\/formsubmit\.co\/(?:documentation|privacy)$/.test(match[0]) &&
          !/^https:\/\/formsubmit\.co\/ajax\/[A-Za-z0-9_-]{16,128}$/.test(match[0])
        ) failures.push(`${file}: unsafe form endpoint (value redacted)`);
      }
      // Compare secret-capable environment values without ever printing their values.
      for (const [name, value] of Object.entries(process.env)) {
        if (
          !name.startsWith("VITE_") &&
          /SECRET|TOKEN|PASSWORD|PRIVATE_KEY|API_KEY/.test(name) &&
          value &&
          value.length >= 12 &&
          text.includes(value)
        ) {
          failures.push(
            `${file}: private environment value detected (value redacted)`,
          );
        }
      }
    }
  }
  await walk(directory);
  if (failures.length) throw new Error(failures.join("\n"));
  return "Built HTML, JavaScript, CSS, and discovery files passed the targeted privacy, credential, and copy scan. No values logged.";
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve("scripts/check-output.mjs")
) {
  console.log(await checkOutput(process.argv[2] || "dist"));
}
