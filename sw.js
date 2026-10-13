/* CURE Jobs offline support. Raise VERSION whenever app files change. */
const VERSION = "cure-jobs-v6";
const SHELL = ["./","index.html","app.css","app.js","config.js","jszip.min.js","manifest.webmanifest",
  "icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png","icons/favicon-32.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;            /* job links, fonts, APIs: network as usual */
  const ext = url.pathname.split("/").pop();
  if (url.pathname.endsWith("/") || /\.(html|js|css|json|webmanifest)$/.test(ext)) { /* pages, code and listings: newest first, saved copy offline */
    e.respondWith(fetch(req, {cache: "no-cache"}).then(r => { const c = r.clone(); caches.open(VERSION).then(k => k.put(req, c)); return r; }).catch(() => caches.match(req, {ignoreSearch: true})));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const c = r.clone(); caches.open(VERSION).then(k => k.put(req, c)); return r; })));
});
