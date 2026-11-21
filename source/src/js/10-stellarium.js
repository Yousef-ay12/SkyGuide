/* ---------- View in Stellarium Web: opens stellarium-web.org at the object, from the Sky calendar's place and night ---------- */
const SW_GREEK = {alpha: 'alf', beta: 'bet', gamma: 'gam', delta: 'del', epsilon: 'eps', zeta: 'zet', eta: 'eta', theta: 'tet', iota: 'iot', kappa: 'kap', lambda: 'lam', mu: 'mu', nu: 'nu', xi: 'ksi', omicron: 'omi', pi: 'pi', rho: 'rho', sigma: 'sig', tau: 'tau', upsilon: 'ups', phi: 'phi', chi: 'chi', psi: 'psi', omega: 'ome'};
function swStarName(s, abbr) {
  // a proper name ("Betelgeuse") works as it is; a Bayer name ("Delta Velorum") becomes Stellarium's short form ("del Vel")
  const m = /^([A-Za-z]+)([¹²³\d]?)\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?$/.exec(s.name || '');
  if (m && SW_GREEK[m[1].toLowerCase()] && abbr) return SW_GREEK[m[1].toLowerCase()] + ({'¹': '1', '²': '2', '³': '3'}[m[2]] || m[2] || '') + ' ' + abbr;
  return s.name;
}
function swDsoName(d) { const c = String(d.cat || d.id || ''); const m = /^(M|NGC|IC|Mel|Cr)\s*(\d+)$/i.exec(c) || /^(M|NGC|IC|Mel|Cr)\s*(\d+)$/i.exec(String(d.id || '')); return m ? m[1].toUpperCase().replace('MEL', 'Mel').replace('CR', 'Cr') + ' ' + m[2] : (d.name || c); }
function swConName(key) {
  const sc = DATA.sci && DATA.sci[key], pt = sc && sc.parts && sc.parts[0];
  if (!pt || !pt.stars || !pt.stars.length) return null;
  const c = byKey[key];
  return {name: c ? c.latin : pt.name, fov: Math.max(25, Math.min(90, Math.round(Math.sqrt(pt.area || 400) * 1.8)))};
}
function swHref(name, fov, tUTC) {
  const pl = placeObj(), st = CAL.st;
  let t = tUTC;
  if (!t) {
    const now = new Date(Date.now() + pl.tz * 36e5);
    let Y = now.getUTCFullYear(), M = now.getUTCMonth(), D = now.getUTCDate();
    if (st.month) { [Y, M] = st.month.split('-').map(Number); D = st.day || 15; }
    const [h, m] = String(st.tourStart || '20:00').split(':').map(Number);
    t = Date.UTC(Y, M, D + (h < 12 ? 1 : 0), h, m || 0) - pl.tz * 36e5;
  }
  const date = new Date(t).toISOString().replace(/\.\d+Z$/, 'Z');
  return 'https://stellarium-web.org/skysource/' + encodeURIComponent(name) + '?fov=' + (fov || 30).toFixed(2) + '&date=' + date + '&lat=' + pl.lat.toFixed(2) + '&lng=' + pl.lon.toFixed(2) + '&elev=0';
}
// On phones the long culture label (e.g. SOUTHERN AFRICAN SKY) runs across the box so the Arabic name and buttons stay on the right;
// if it would touch the Arabic name, fall back to the normal layout.
function fitEyebrow(card) {
  const head = card.querySelector('.card-head'); if (!head) return; head.classList.remove('ebwide');
  const eb = head.querySelector('.eyebrow'), arn = head.querySelector('.arn'); if (!eb || !arn) return;
  const r1 = document.createRange(); r1.selectNodeContents(eb); const r2 = document.createRange(); r2.selectNodeContents(arn);
  const e = r1.getBoundingClientRect(), a = r2.getBoundingClientRect();
  if (e.right > a.left - 8 && e.bottom > a.top && e.top < a.bottom) head.classList.add('ebwide');
}
addEventListener('resize', () => { const c = document.getElementById('card'); if (c) fitEyebrow(c); });
function swBtn(name, fov, lang, tUTC) {
  if (!name) return '';
  const ar = lang === 'ar', tip = ar ? 'يفتح موقع Stellarium Web في نافذة جديدة، ويعرض السماء من المكان والليلة المختارين في تقويم السماء.' : 'Opens Stellarium Web in a new tab, showing the sky from the place and night chosen in the Sky calendar.';
  let href = 'https://stellarium-web.org/';
  try { href = swHref(name, fov || 30, tUTC || 0); } catch (e) {}
  return `<a class="swbtn" href="${esc(href)}" target="_blank" rel="noopener" data-sw="${esc(name)}" data-swf="${fov || 30}"${tUTC ? ` data-swt="${tUTC}"` : ''} title="${esc(tip)}" aria-label="${ar ? 'اعرضه في Stellarium Web' : 'View in Stellarium Web'}"${ar ? ' dir="rtl" lang="ar"' : ''}>${ar ? '<span class="swl">اعرضه في </span><bdi dir="ltr">Stellarium<span class="swl"> Web</span></bdi>' : '<span class="swl">View in </span>Stellarium<span class="swl"> Web</span>'}</a>`;
}
// work out the link at the moment of the click, so it always uses the current place and night
['click', 'auxclick', 'contextmenu', 'focusin'].forEach(evn => document.addEventListener(evn, ev => {
  const a = ev.target.closest && ev.target.closest('a.swbtn'); if (!a) return;
  if (navigator.onLine === false) { ev.preventDefault(); APP.toast(state.lang === 'ar' ? 'يحتاج Stellarium Web إلى اتصال بالإنترنت. حاول مرة أخرى عندما تكون متصلًا.' : 'Stellarium Web needs an internet connection. Try again when you are online.'); return; }
  try { a.href = swHref(a.dataset.sw, +a.dataset.swf, a.dataset.swt ? +a.dataset.swt : 0); } catch (e) {}
}, true));


