// 沖繩打包小抄 — offline service worker
// Bump CACHE version whenever you update the files, so clients refetch.
const CACHE = "okinawa-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./img/araha-parking-1-ramp.jpg",
  "./img/araha-parking-2-ramp-up.jpg",
  "./img/araha-parking-3-spot-402.jpg",
  "./img/araha-parking-4-raft.jpg",
  "./img/araha-checkin-1-keybox.jpg",
  "./img/araha-checkin-2-entrance-panel.jpg",
  "./img/araha-checkin-3-door-key.jpg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).catch(() => caches.match("./index.html"));
    })
  );
});
