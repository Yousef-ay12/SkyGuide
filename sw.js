/* Sky Guide offline helper.
   Pages: newest version from the internet first; the saved copy only when offline.
   Fonts and icons: saved copy first (they rarely change), refreshed in the background.
   Deep-sky pictures: kept after you have seen them (up to 150), so they also show offline. */
const CACHE = 'skyguide-v2';
const PICS = 'skyguide-pictures-v1';   // Wikipedia photos (readable copies)
const SKY = 'skyguide-sky-v1';         // sky-survey photos (sealed copies take more room, so keep fewer)
const MAX_PICS = 150, MAX_SKY = 40;
const CORE = ['./', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  'fonts/marcellus.woff', 'fonts/crimsonpro.woff', 'fonts/crimsonpro-italic.woff', 'fonts/plexmono-400.woff', 'fonts/plexmono-500.woff', 'fonts/amiri-400.woff', 'fonts/amiri-700.woff'];
const PIC_HOSTS = /(^|\.)(astro4edu\.org|wikipedia\.org|wikimedia\.org|alasky\.cds\.unistra\.fr|archive\.stsci\.edu)$/;

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', ev => {
  ev.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== PICS && k !== SKY).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
async function trim(name, max) {
  const c = await caches.open(name), keys = await c.keys();
  for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]);
}
self.addEventListener('fetch', ev => {
  const req = ev.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // deep-sky pictures and their Wikipedia lookups: use the saved copy if there is one, otherwise fetch and keep it
  if (PIC_HOSTS.test(url.hostname)) {
    const name = /alasky|stsci/.test(url.hostname) ? SKY : PICS, max = name === SKY ? MAX_SKY : MAX_PICS;
    ev.respondWith(caches.open(name).then(c => c.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { c.put(req, res.clone()).then(() => trim(name, max)).catch(() => {}); }
      return res;
    }))));
    return;
  }
  const fonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' || /\/fonts\//.test(url.pathname);
  if (!fonts && (req.mode === 'navigate' || (url.origin === location.origin && !/\/(icons|iau)\//.test(url.pathname)))) {
    ev.respondWith(fetch(req, {cache: 'no-store'}).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? './' : req, copy)); }
      return res;
    }).catch(() => caches.match(req.mode === 'navigate' ? './' : req, {ignoreSearch: true}).then(r => r || caches.match('./'))));
    return;
  }
  if (fonts || url.origin === location.origin) {
    ev.respondWith(caches.match(req).then(hit => {
      const net = fetch(req).then(res => { if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; }).catch(() => hit);
      return hit || net;
    }));
  }
});
