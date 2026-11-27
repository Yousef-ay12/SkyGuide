/* ---------- TRIAL: on iPhone and iPad, try to open the Stellarium Mobile app first ----------
   Stellarium Mobile publishes no link format, so SW_APP is a guess. If the app does not open, a note offers the website.
   The page #applinktest lists other guesses to tap one by one. Remove this file if none of them works. */
const SW_APP = 'stellarium://';
const SW_STORE = 'https://apps.apple.com/app/id1458716890';   // Stellarium Mobile on the App Store
const SW_GUESSES = ['stellarium://', 'stellarium-mobile://', 'stellariummobile://', 'stellariumplus://', 'stellarium-plus://', 'noctua://', 'noctuasoftware://', 'com.noctuasoftware.stellarium://', 'com.noctuasoftware.stellarium-free://', 'stellarium-web://'];
const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

function swAppNote(web) {
  const ar = state.lang === 'ar';
  document.querySelectorAll('.swapp-note').forEach(n => n.remove());
  const n = document.createElement('div'); n.className = 'swapp-note'; n.setAttribute('role', 'status');
  if (ar) n.dir = 'rtl';
  n.innerHTML = `<span>${ar ? 'لم يُفتح تطبيق Stellarium.' : 'The Stellarium app did not open.'}</span><a href="${esc(web)}" target="_blank" rel="noopener">${ar ? 'افتح الموقع' : 'Open the website'}</a><a href="${SW_STORE}" target="_blank" rel="noopener">${ar ? 'حمّل التطبيق' : 'Get the app'}</a><button type="button" aria-label="${ar ? 'إغلاق' : 'Close'}">×</button>`;
  n.querySelectorAll('a').forEach(x => x.addEventListener('click', () => n.remove()));
  n.querySelector('button').addEventListener('click', () => n.remove());
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 12000);
}
// after the link is worked out (10-stellarium.js runs first): on iPhone, try the app; if this page is still showing a moment later, the app did not open
document.addEventListener('click', ev => {
  if (!IS_IOS || ev.defaultPrevented) return;
  const a = ev.target.closest && ev.target.closest('a.swbtn'); if (!a) return;
  ev.preventDefault();
  const web = a.href; let left = false;
  const gone = () => { left = true; };
  document.addEventListener('visibilitychange', gone, {once: true}); addEventListener('pagehide', gone, {once: true});
  location.href = SW_APP;
  setTimeout(() => { document.removeEventListener('visibilitychange', gone); if (!left && !document.hidden) swAppNote(web); }, 1600);
});

// #applinktest: one button per guess, to find which one (if any) opens the app
// the site rewrites the address once it loads, so the test address is read now, and from the hashchange itself
let SW_TEST = location.hash === '#applinktest';
function swAppTest() {
  if (!SW_TEST || document.getElementById('swtest')) return;
  SW_TEST = false;
  const d = document.createElement('div'); d.id = 'swtest'; d.className = 'swtest';
  d.innerHTML = `<div class="swt-box"><h2>Stellarium app link test</h2><p>Tap each button. If the Stellarium app opens, note which one. Safari shows an error for the ones that do not work: tap OK and try the next.</p>${SW_GUESSES.map(s => `<a class="pbtn" href="${s}">${s}</a>`).join('')}<p class="muted">This device: ${IS_IOS ? 'iPhone or iPad' : 'not an iPhone or iPad'}</p><button type="button" class="pbtn" id="swtclose">Close</button></div>`;
  document.body.appendChild(d);
  d.querySelector('#swtclose').addEventListener('click', () => d.remove());
}
addEventListener('hashchange', ev => { if (/#applinktest$/.test(ev.newURL)) { SW_TEST = true; swAppTest(); } }); addEventListener('load', swAppTest);
