/* Retires the old portal app helper at this address: clears what it stored and removes itself. */
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil((async () => {
  try { for (const k of await caches.keys()) await caches.delete(k); } catch (err) {}
  await self.registration.unregister();
  for (const c of await self.clients.matchAll({ type: "window" })) c.navigate("https://cure-portal.pages.dev/");
})()));
