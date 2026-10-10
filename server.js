const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const root = __dirname;
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
};
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const segments = pathname.split("/").filter(Boolean);
    if (
      segments.some(
        (segment) => segment.startsWith(".") && segment !== ".well-known",
      )
    ) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    const target = path.resolve(
      root,
      "." + pathname,
      pathname.endsWith("/") ? "index.html" : "",
    );
    const relative = path.relative(root, target);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405, { Allow: "GET, HEAD" });
      return res.end();
    }
    const data = await fs.readFile(target);
    res.writeHead(200, {
      "Content-Type": pathname.endsWith("/manifest.json")
        ? "application/manifest+json"
        : mime[path.extname(target)] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    });
    res.end(req.method === "HEAD" ? undefined : data);
  } catch (error) {
    const status = ["ENOENT", "ENOTDIR", "EISDIR"].includes(error.code)
      ? 404
      : error instanceof URIError
        ? 400
        : 500;
    res.writeHead(status);
    res.end(http.STATUS_CODES[status]);
  }
});
server.listen(port, host, () =>
  console.log(`Studio Di Catarina: http://${host}:${port}`),
);
server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
