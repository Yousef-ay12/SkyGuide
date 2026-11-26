/* ---------- Save pictures for offline: downloads every deep-sky, planet and Cosmology picture once,
   into a store the offline helper (sw.js) reads first, so they show with no internet ---------- */
const PICSAVE = (() => {
  const STORE = 'skyguide-offline-pics';   // sw.js reads this store first and never trims it
  let busy = false, stop = false;
  const T = () => state.lang === 'ar' ? {
    btn: 'احفظ الصور للاستخدام دون إنترنت', title: 'حفظ الصور دون إنترنت',
    intro: n => `سيُنزَّل نحو ${n} صورة (صور السماء العميقة والكواكب وعلم الكون)، قرابة 40 إلى 60 ميغابايت. يُفضَّل استخدام شبكة Wi-Fi.`,
    go: 'ابدأ الحفظ', cancel: 'إلغاء', remove: 'احذف الصور المحفوظة', close: 'إغلاق',
    prog: (a, b) => `يُحفظ ${a} من ${b}…`, done: (a, b) => `حُفظت ${a} صورة من ${b}. ستظهر الآن دون اتصال بالإنترنت.`,
    have: n => `محفوظ الآن: ${n} صورة.`, stopped: a => `توقّف الحفظ بعد ${a} صورة. يمكنك المتابعة لاحقًا من حيث توقفت.`,
    removed: 'حُذفت الصور المحفوظة.', offline: 'أنت غير متصل بالإنترنت الآن. اتصل ثم حاول مرة أخرى.',
    nosw: 'هذا المتصفح لا يدعم حفظ الصور. جرّب بعد تثبيت Sky Guide كتطبيق، أو افتح الموقع من رابطه الأصلي.'
  } : {
    btn: 'Save pictures for offline', title: 'Save pictures for offline',
    intro: n => `About ${n} pictures will be downloaded (deep sky, planets and Cosmology), roughly 40 to 60 MB. Wi-Fi is best.`,
    go: 'Start saving', cancel: 'Cancel', remove: 'Remove saved pictures', close: 'Close',
    prog: (a, b) => `Saving ${a} of ${b}…`, done: (a, b) => `Saved ${a} of ${b} pictures. They will now show with no internet.`,
    have: n => `Saved now: ${n} pictures.`, stopped: a => `Stopped after ${a} pictures. You can carry on later from where it stopped.`,
    removed: 'The saved pictures were removed.', offline: 'You are offline right now. Connect and try again.',
    nosw: 'This browser cannot save the pictures. Try it after installing Sky Guide as an app, or open the site from its own address.'
  };
  // the same addresses the page asks for when it shows each picture (they must match exactly)
  const sumDso = t => 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(t).replace(/%2F/g, '/');
  const sumCos = t => 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(t.replace(/ /g, '_'));
  const webb = id => `https://cdn.esawebb.org/archives/images/screen/${id}.jpg`;
  function jobs() {
    const out = [], seen = new Set(), add = j => { const k = j.url; if (!seen.has(k)) { seen.add(k); out.push(j); } };
    allDsos().forEach(({d}) => { const w = DSO_WEBB[d.id], p = DSO_POS[d.id];
      if (w) add({url: webb(w[0])}); else if (p && p[3]) add({url: sumDso(p[3]), then: j => { const t = j.thumbnail && j.thumbnail.source; return t && !/\.svg/i.test(t) ? [t] : []; }}); });
    Object.keys(PL_FILE).forEach(k => add({url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(PL_FILE[k])}?width=500`}));
    Object.keys(COS_PICS).forEach(k => { const p = COS_PICS[k];
      if (p[0] === 'c') add({url: 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(p[1].replace(/ /g, '_')) + '?width=960'});
      else if (p[0] === 'webb') add({url: webb(p[1])});
      else add({url: sumCos(p[1]), then: j => { const t = j.thumbnail && j.thumbnail.source; if (!t) return []; const f = decodeURIComponent(t.split('/').slice(-2, -1)[0] || ''); return [/\.svg/i.test(f) ? t : t.replace(/\/\d+px-/, '/960px-')]; }}); });
    return out;
  }
  // a picture is fetched with CORS where the host allows it (so the page can also use it with crossOrigin), otherwise as an opaque copy
  async function grab(c, url) {
    if (await c.match(url)) return true;
    let r = null;
    try { r = await fetch(url, {mode: 'cors', cache: 'no-store'}); if (!r.ok) r = null; } catch (e) { r = null; }
    if (!r) { try { r = await fetch(url, {mode: 'no-cors', cache: 'no-store'}); } catch (e) { return false; } if (!r || (!r.ok && r.type !== 'opaque')) return false; }
    try { await c.put(url, r.clone()); } catch (e) { return false; }
    return r;
  }
  async function one(c, j) {
    const r = await grab(c, j.url); if (!r) return false;
    if (!j.then) return true;
    let data = null;
    try { data = await (r === true ? (await c.match(j.url)) : r).clone().json(); } catch (e) { return false; }
    const more = j.then(data || {}); if (!more.length) return true;
    for (const u of more) if (!(await grab(c, u))) return false;
    return true;
  }
  async function count() { try { return (await (await caches.open(STORE)).keys()).length; } catch (e) { return 0; } }
  function box() {
    let b = document.getElementById('picsave');
    if (!b) { b = document.createElement('div'); b.id = 'picsave'; b.className = 'picsave'; b.setAttribute('role', 'status'); b.setAttribute('aria-live', 'polite');
      const row = document.querySelector('#setpanel .hbrow'); (row ? row.parentNode : document.body).insertBefore(b, row ? row.nextSibling : null); }
    b.dir = state.lang === 'ar' ? 'rtl' : 'ltr'; b.hidden = false; return b;
  }
  async function open() {
    const t = T(), b = box(), list = jobs(), have = await count();
    if (busy) return;
    b.innerHTML = `<b>${esc(t.title)}</b><p>${esc(t.intro(list.length))}</p>${have ? `<p class="ps-have">${esc(t.have(have))}</p>` : ''}
      <div class="ps-bar" hidden><i></i></div><p class="ps-msg"></p>
      <div class="hbrow"><button type="button" class="tourbtn ps-go">${esc(t.go)}</button>${have ? `<button type="button" class="tourbtn ps-rm">${esc(t.remove)}</button>` : ''}<button type="button" class="tourbtn ps-x">${esc(t.close)}</button></div>`;
  }
  async function run() {
    const t = T(), b = box(), msg = b.querySelector('.ps-msg'), bar = b.querySelector('.ps-bar'), go = b.querySelector('.ps-go');
    if (!('caches' in window) || !('serviceWorker' in navigator)) { msg.textContent = t.nosw; return; }
    if (navigator.onLine === false) { msg.textContent = t.offline; return; }
    busy = true; stop = false; go.textContent = t.cancel; go.classList.replace('ps-go', 'ps-stop'); const rm = b.querySelector('.ps-rm'); if (rm) rm.hidden = true;
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
    const c = await caches.open(STORE), list = jobs(); let i = 0, ok = 0, done = 0; bar.hidden = false;
    const step = () => { msg.textContent = t.prog(done, list.length); bar.firstChild.style.width = (100 * done / list.length).toFixed(1) + '%'; };
    step();
    const worker = async () => { while (!stop && i < list.length) { const j = list[i++]; if (await one(c, j)) ok++; done++; step(); } };
    await Promise.all([worker(), worker(), worker(), worker()]);
    busy = false; const s = b.querySelector('.ps-stop'); if (s) { s.textContent = t.go; s.classList.replace('ps-stop', 'ps-go'); }
    msg.textContent = stop ? t.stopped(ok) : t.done(ok, list.length);
    if (!stop) bar.firstChild.style.width = '100%';
  }
  document.addEventListener('click', ev => {
    const e = ev.target.closest && ev.target.closest('#picsavebtn, #picsave button'); if (!e) return;
    if (e.id === 'picsavebtn') { open(); return; }
    if (e.classList.contains('ps-go')) run();
    else if (e.classList.contains('ps-stop')) stop = true;
    else if (e.classList.contains('ps-x')) { if (busy) stop = true; document.getElementById('picsave').hidden = true; }
    else if (e.classList.contains('ps-rm')) { caches.delete(STORE).then(() => { const m = document.querySelector('#picsave .ps-msg'); if (m) m.textContent = T().removed; const h = document.querySelector('#picsave .ps-have'); if (h) h.remove(); e.remove(); }); }
  });
  return {label: () => { const b = document.getElementById('picsavebtn'); if (b) b.lastChild.textContent = ' ' + T().btn; const p = document.getElementById('picsave'); if (p && !p.hidden && !busy) open(); }};
})();
