// Replaces VuePress's worker at the same URL so a previously installed copy
// cannot keep serving stale pages. New pages never register a worker.
self.addEventListener('install', (event) => event.waitUntil(self.skipWaiting()))
self.addEventListener('activate', (event) =>
  event.waitUntil(
    (async () => {
      const prefix = 'workbox-precache-v2-'
      const names = await caches.keys()
      await Promise.all(
        names
          .filter((name) => name === `${prefix}${self.registration.scope}`)
          .map((name) => caches.delete(name)),
      )
      await self.clients.claim()
      await self.registration.unregister()
    })(),
  ),
)
