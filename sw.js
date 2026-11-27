/* Sky Guide offline helper (made by build.py).
   When the app is installed it saves every file it needs, so all tabs work with no internet.
   The page itself: newest version from the internet first (waits up to 3 seconds), the saved copy when offline.
   Code, styling and data files have a fingerprint in their name, so the saved copy is used straight away.
   Pictures: kept after you have seen them (up to 300), so they also show offline;
   "Save pictures for offline" in Settings stores all of them in a separate store that is never trimmed. */
const VERSION = '5ee82c7d';
const CACHE = 'skyguide-' + VERSION;
const PICS = 'skyguide-pictures-v2';   // Wikipedia and Webb photos
const SKY = 'skyguide-sky-v1';         // sky-survey photos (take more room, so keep fewer)
const SAVED = 'skyguide-offline-pics-v2'; // pictures saved with "Save pictures for offline" (never trimmed)
const MAX_PICS = 300, MAX_SKY = 40;
const FILES = [
 "./",
 "assets/site.f0e083b4.css",
 "assets/stories.57e18de0.js",
 "assets/sky.0de37187.js",
 "assets/app.247646a9.js",
 "assets/pointsky.c0c03ef6.js",
 "manifest-arch.webmanifest",
 "manifest-astrolabe.webmanifest",
 "manifest-compass.webmanifest",
 "manifest-crescent.webmanifest",
 "manifest-desert.webmanifest",
 "manifest-dipper.webmanifest",
 "manifest-dome.webmanifest",
 "manifest-eclipse.webmanifest",
 "manifest-galaxy.webmanifest",
 "manifest-globe.webmanifest",
 "manifest-leo.webmanifest",
 "manifest-orbit.webmanifest",
 "manifest-planet.webmanifest",
 "manifest-pleiades.webmanifest",
 "manifest-rose.webmanifest",
 "manifest-starline.webmanifest",
 "manifest-telescope.webmanifest",
 "manifest.webmanifest",
 "icons/apple-touch-icon.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/maskable-512.png",
 "fonts/amiri-400.woff",
 "fonts/amiri-700.woff",
 "fonts/crimsonpro-italic.woff",
 "fonts/crimsonpro.woff",
 "fonts/marcellus.woff",
 "fonts/plexmono-400.woff",
 "fonts/plexmono-500.woff",
 "fonts/tiro-sanskrit.woff"
];
const PIC_HOSTS = /(^|\.)(esawebb\.org|wikipedia\.org|wikimedia\.org|alasky\.cds\.unistra\.fr|archive\.stsci\.edu)$/;

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', ev => {
  ev.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== PICS && k !== SKY && k !== SAVED).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
async function trim(name, max) {
  const c = await caches.open(name), keys = await c.keys();
  for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]);
}
// Wikipedia and Wikimedia answer with CORS, so the real status is visible and a refused picture (for example error 429) is never kept;
// other hosts are kept as they come
const CORS_HOSTS = /(^|\.)(wikipedia\.org|wikimedia\.org)$/;
function keepPicture(req, name, max) {
  const keep = (c, res) => { c.put(req, res.clone()).then(() => trim(name, max)).catch(() => {}); return res; };
  return caches.open(name).then(c => c.match(req).then(hit => {
    if (hit) return hit;
    if (CORS_HOSTS.test(new URL(req.url).hostname)) return fetch(req.url, {mode: 'cors', credentials: 'omit'}).then(res => res.ok ? keep(c, res) : res, () => fetch(req));
    return fetch(req).then(res => (res.ok || res.type === 'opaque') ? keep(c, res) : res);
  }));
}
function page(req) {
  const saved = () => caches.match('./').then(r => r || caches.match(req, {ignoreSearch: true}));
  const net = fetch(req, {cache: 'no-store'}).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./', copy)); }
    return res;
  });
  const slow = new Promise(r => setTimeout(r, 3000)).then(saved);
  return Promise.race([net.catch(saved), slow.then(r => r || net)]).then(r => r || net);
}
function savedFirst(req) {
  return caches.match(req, {ignoreSearch: true}).then(hit => {
    const net = fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; });
    if (hit) { if (!/\/assets\//.test(req.url)) net.catch(() => {}); return hit; }
    return net;
  });
}
self.addEventListener('fetch', ev => {
  const req = ev.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (PIC_HOSTS.test(url.hostname)) {
    if (req.cache === 'no-store') return;   // the "Save pictures" download stores its own copies
    const sky = /alasky|stsci/.test(url.hostname);
    ev.respondWith(caches.open(SAVED).then(c => c.match(req)).then(hit => hit || keepPicture(req, sky ? SKY : PICS, sky ? MAX_SKY : MAX_PICS)));
    return;
  }
  if (req.mode === 'navigate') { ev.respondWith(page(req)); return; }
  if (url.origin === location.origin || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') ev.respondWith(savedFirst(req));
});
