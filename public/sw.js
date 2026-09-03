// ============================================================
// SERVICE WORKER MINIMAL
// ============================================================
// Sert uniquement à satisfaire le critère d'installabilité PWA
// (manifest + service worker). Pas de cache offline pour l'instant :
// chaque requête part simplement au réseau, comme sans SW.
// ============================================================

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
