// ADAPT offline cache. Bump VERSION on every release so phones pick up the new files.
const VERSION = "adapt-v44";
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png",
  "img/journey.jpg","img/mountain-start.jpg","img/mountain-10.jpg","img/mountain-11.jpg","img/five-movements.jpg","img/continuum.jpg","img/before-after.jpg",
  "img/step1.jpg","img/step2.jpg","img/step3.jpg","img/step4.jpg","img/step5.jpg",
  "img/psfs-scale.jpg","img/ex-wall-1.jpg","img/ex-load.jpg",
  "fonts/archivo-latin-600-normal.woff2","fonts/archivo-latin-800-normal.woff2","fonts/source-sans-3-latin-400-normal.woff2","fonts/source-sans-3-latin-600-normal.woff2","fonts/source-sans-3-latin-700-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  if (req.mode === "navigate") { // network first for the page, fall back to cache offline
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put("index.html", c)); return r; }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { // cache other files as they load
    if (r.ok || r.type === "opaque") { const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); }
    return r; }).catch(() => hit)));
});
