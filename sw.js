const VERSION = "di-catarina-v5";
const BASE = new URL("./", self.location.href);
const ASSETS = [
  "./",
  "index.html",
  "styles.css",
  "script.js",
  "manifest.json",
  "assets/images/real/cabelo-iluminado.webp",
  "assets/images/real/corte-movimento.webp",
  "assets/images/real/cachos.webp",
  "assets/images/real/fachada-2023.webp",
  "assets/images/real/sobrancelhas.webp",
  "assets/images/unha_service.webp",
  "assets/images/icon-192.png",
  "assets/images/icon-512.png",
].map((asset) => new URL(asset, BASE).href);
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                (key.startsWith("studio-di-catarina-") ||
                  key.startsWith("di-catarina-")) &&
                key !== VERSION,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (
    request.method !== "GET" ||
    url.origin !== BASE.origin ||
    !url.pathname.startsWith(BASE.pathname)
  )
    return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(VERSION);
      const cached = await cache.match(request);
      // Images are immutable for this release. HTML, scripts and styles stay fresh.
      if (/\.(webp|png)$/.test(url.pathname) && cached) return cached;
      try {
        const response = await fetch(request);
        if (
          response.ok &&
          (request.mode === "navigate" || ASSETS.includes(url.href))
        ) {
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        if (cached) return cached;
        if (request.mode === "navigate") {
          const fallback = await cache.match(new URL("index.html", BASE).href);
          if (fallback) return fallback;
        }
        return new Response("Recurso indisponível offline.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    })(),
  );
});
