/* Retired. CURE Jobs now lives at /jobs/ with its own service worker.
   This replacement removes the old site wide worker from devices that installed it,
   so it no longer captures /Student-Resource-Portal/. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith("cure-jobs")).map(k => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: "window" });
    clients.forEach(c => c.navigate(c.url));
  })());
});
