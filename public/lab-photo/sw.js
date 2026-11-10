// Lab Photo — offline support. Bump VERSION whenever any app file changes.
const VERSION = "lab-photo-v2";
const FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("lab-photo-") && k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  // The page itself: open the saved copy right away (so a slow or blocked Wi-Fi can't stall it),
  // and fetch a fresh copy in the background for next time.
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      const cache = await caches.open(VERSION);
      const saved = await cache.match("./index.html");
      const fresh = fetch(req, { cache: "no-store" }).then(res => {
        if (res.ok) cache.put("./index.html", res.clone());
        return res;
      });
      if (saved) { e.waitUntil(fresh.catch(() => {})); return saved; }
      return fresh;
    })());
    return;
  }
  // Everything else (icons, barcode reader): saved copy first, network if missing.
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
