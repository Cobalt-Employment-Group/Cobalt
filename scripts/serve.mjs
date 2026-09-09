import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const directory = path.resolve(process.argv[2] || "dist");
const port = Number(process.argv[3] || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".json": "application/json",
};
createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405).end();
    return;
  }
  try {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    if (url.pathname === "/index.html") {
      response.writeHead(301, { Location: `/${url.search}` }).end();
      return;
    }
    const pathname = decodeURIComponent(url.pathname);
    const file = path.resolve(
      directory,
      `.${pathname === "/" ? "/index.html" : pathname}`,
    );
    if (!file.startsWith(`${directory}${path.sep}`)) {
      response.writeHead(400).end();
      return;
    }
    let data,
      status = 200,
      extension = path.extname(file);
    try {
      if (!(await stat(file)).isFile()) throw new Error("not a file");
      data = await readFile(file);
    } catch {
      data = await readFile(path.join(directory, "404.html"));
      status = 404;
      extension = ".html";
    }
    response.writeHead(status, {
      "Content-Type": types[extension] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    });
    response.end(request.method === "HEAD" ? undefined : data);
  } catch {
    response.writeHead(400).end();
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`Static preview: http://127.0.0.1:${port} (${directory})`),
);
