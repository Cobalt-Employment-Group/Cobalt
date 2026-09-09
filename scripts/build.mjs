import { build } from "vite";
import { readFile, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const testForm = process.argv.includes("--test-form");
const testEmpty = process.argv.includes("--test-empty");
if (testForm)
  process.env.VITE_FORM_ENDPOINT =
    "https://formsubmit.co/ajax/0123456789abcdef0123456789abcdef";
if (testEmpty) process.env.VITE_FORM_ENDPOINT = "";
const outDir = testForm ? ".test-dist" : testEmpty ? ".test-empty" : "dist";
const serverDir = ".site-build";
await build({ build: { outDir } });
try {
  await build({
    build: {
      ssr: "src/entry-server.tsx",
      outDir: serverDir,
      copyPublicDir: false,
    },
  });
  const { render, discoveryFiles } = await import(
    pathToFileURL(path.resolve(serverDir, "entry-server.js")).href
  );
  const template = await readFile(`${outDir}/index.html`, "utf8");
  for (const notFound of [false, true]) {
    const { head, body } = render(notFound);
    let html = template
      .replace("<!--site-head-->", head)
      .replace("<!--site-body-->", body);
    // The standalone error document works with no JavaScript or client router.
    if (notFound)
      html = html.replace(/<script\b[^>]*type="module"[^>]*><\/script>/g, "");
    if (/<!--site-(head|body)-->/.test(html))
      throw new Error("Unrendered HTML placeholder");
    await writeFile(`${outDir}/${notFound ? "404" : "index"}.html`, html);
  }
  const { robots, sitemap } = discoveryFiles();
  await writeFile(`${outDir}/robots.txt`, robots);
  await writeFile(`${outDir}/sitemap.xml`, sitemap);
  console.log(
    `Static homepage, dedicated 404, robots.txt, and sitemap.xml generated in ${outDir}.`,
  );
} finally {
  await rm(serverDir, { recursive: true, force: true });
}
