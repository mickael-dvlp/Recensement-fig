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

// Handler présent mais volontairement vide : ne PAS appeler respondWith() ici.
// Rejouer event.request via fetch() (notamment les requêtes de navigation) casse
// des requêtes légitimes ("Failed to fetch") — le critère d'installabilité PWA
// exige seulement la présence du handler, pas qu'il intercepte quoi que ce soit.
self.addEventListener("fetch", () => {});
