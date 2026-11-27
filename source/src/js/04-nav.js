/* ---------- main navigation: three sections (Heritage & Culture, Science, AstroGuide), each with its own row of pages ---------- */
let lastCul = 'arab', lastAstro = 'astro', lastSciCon = 'Ori';
const SECTIONS = [['culture', 'Heritage & Culture', 'التراث والثقافة'], ['science', 'Science', 'العلم'], ['astro', 'AstroGuide', 'المرشد الفلكي']];
const SEC_ICON = {
  culture: '<path d="M4 19V9a8 8 0 0 1 16 0v10"/><path d="M2 19h20"/><path d="M9 19v-5a3 3 0 0 1 6 0v5"/>',
  science: '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-25 12 12)"/>',
  astro: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'};
// AstroGuide's pages, and Science's special pages (the rest of Science is the constellations)
const ASTRO_PAGES = [['astro', 'Overview', 'نظرة عامة'], ['guide', 'My night', 'ليلتي'], ['plan', 'Plan a night', 'خطّط لليلتك'], ['calendar', 'Sky calendar', 'تقويم السماء'], ['quiz', 'Quiz', 'اختبر معلوماتك'], ['learn', 'For guides', 'للمرشدين']];
const SCI_PAGES = [['SCI', 'Overview', 'نظرة عامة'], ['', 'Constellations', 'الكوكبات'], ['SOL', 'Solar System', 'المجموعة الشمسية'], ['STAR', 'Why stars shine', 'لماذا تضيء النجوم'], ['DSO', 'Deep sky', 'الأجرام العميقة'], ['COS', 'Cosmology', 'علم الكون']];
const SCI_SPECIAL = new Set(SCI_PAGES.map(x => x[0]).filter(Boolean));
const CUL_AR_SHORT = {arab: 'العرب', greek: 'الإغريق', egypt: 'مصر القديمة', china: 'الصين', japan: 'اليابان', india: 'الهند', safrica: 'جنوب أفريقيا'};
function secOf(cul) { return cul === 'science' ? 'science' : TOOL_TABS.has(cul) ? 'astro' : 'culture'; }
function tabOf(cul) { return cul === 'science' || TOOL_TABS.has(cul) ? cul : 'stories'; }
function goSection(sec) {
  // each section opens on its overview
  if (sec === 'culture') { state.con = 'CUL'; setCulture(secOf(state.cul) === 'culture' ? state.cul : lastCul); }
  else if (sec === 'science') { state.con = 'SCI'; setCulture('science'); }
  else setCulture('astro');
}
function buildNav() {
  const nav = document.getElementById('mainnav'); if (!nav) return;
  nav.innerHTML = `<div class="ntabs">${SECTIONS.map(([id, en]) => `<button type="button" class="ntab" data-sec="${id}" aria-pressed="false" style="--sc:var(--s-${id})"><svg class="n-ic" aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${SEC_ICON[id]}</svg><span class="n-t">${en}</span>${id === 'astro' ? '<span class="agbadge" id="agcount"></span>' : ''}</button>`).join('')}</div>`;
  nav.querySelectorAll('.ntab').forEach(b => b.addEventListener('click', () => { goSection(b.dataset.sec); window.scrollTo({top: 0}); }));
  const sub = document.getElementById('subnav');
  sub.addEventListener('click', ev => {
    const b = ev.target.closest('[data-go]'); if (!b) return;
    const [kind, v] = b.dataset.go.split(':');
    if (kind === 'cul') setCulture(v);
    else if (kind === 'culov') { state.con = 'CUL'; render(); }
    else if (kind === 'astro') setCulture(v);
    else if (kind === 'sci') { state.con = v || (byKey[lastSciCon] && !SCI_SPECIAL.has(lastSciCon) ? lastSciCon : 'Ori'); if (state.cul !== 'science') setCulture('science'); else { buildList(document.getElementById('q').value); render(); } }
  });
  document.querySelectorAll('[data-hlang]').forEach(b => b.addEventListener('click', () => { state.lang = b.dataset.hlang; try { localStorage.setItem('osms-lang', state.lang); } catch (e) {} buildList(document.getElementById('q').value); render(); }));
  const sb = document.getElementById('setbtn'), sp = document.getElementById('setpanel');
  sb.addEventListener('click', () => { sp.hidden = !sp.hidden; sb.setAttribute('aria-expanded', !sp.hidden); });
  document.getElementById('srchbtn').addEventListener('click', () => SEARCH.show());
  document.addEventListener('keydown', ev => { if (ev.key === '/' && !ev.ctrlKey && !ev.metaKey && !/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '') && !document.querySelector('.tour, .welcome, .gsearch')) { ev.preventDefault(); SEARCH.show(); } });
  document.getElementById('brandbtn').addEventListener('click', () => { if (typeof WELCOME !== 'undefined') WELCOME.show(); else window.scrollTo({top: 0, behavior: 'smooth'}); });
}
function subnavHTML(sec, ar) {
  const lbl = (en, a) => ar ? a : en;
  if (sec === 'culture') return `<button type="button" class="sn${state.con === 'CUL' ? ' on' : ''}" data-go="culov:" aria-pressed="${state.con === 'CUL'}" style="--cc:var(--s-culture)">${lbl('Overview', 'نظرة عامة')}</button>` + CULTURES.map(c => { const on = state.cul === c.id, has = byKey[state.con] && hasLore(state.con, c.id);
    return `<button type="button" class="sn${on ? ' on' : ''}${has ? '' : ' none'}" data-go="cul:${c.id}" aria-pressed="${on}" style="--cc:var(--c-${c.id})" title="${has ? '' : (ar ? 'لا قصة لهذه النجوم' : 'No story for these stars')}"><span class="dot"></span>${ar ? CUL_AR_SHORT[c.id] : esc(c.name)}</button>`; }).join('');
  if (sec === 'science') { const cur = SCI_SPECIAL.has(state.con) ? state.con : '';
    return SCI_PAGES.map(([k, en, a]) => `<button type="button" class="sn${cur === k ? ' on' : ''}" data-go="sci:${k}" aria-pressed="${cur === k}" style="--cc:var(--c-science)">${lbl(en, a)}</button>`).join(''); }
  return ASTRO_PAGES.map(([k, en, a]) => `<button type="button" class="sn${state.cul === k ? ' on' : ''}" data-go="astro:${k}" aria-pressed="${state.cul === k}" style="--cc:var(--s-astro)">${k === 'guide' ? '✦ ' : ''}${lbl(en, a)}</button>`).join('');
}
function qzPromo() {
  const el = document.getElementById('qzpromo'); if (!el) return;
  let gone = false; try { gone = localStorage.getItem('osms-qzpromo') === '1'; } catch (e) {}
  if (state.cul === 'quiz' && !gone) { gone = true; try { localStorage.setItem('osms-qzpromo', '1'); } catch (e) {} }
  if (gone) { el.hidden = true; el.innerHTML = ''; return; }
  const ar = state.lang === 'ar'; el.hidden = false; el.setAttribute('dir', ar ? 'rtl' : 'ltr'); el.setAttribute('lang', ar ? 'ar' : 'en');
  el.innerHTML = ar ? `<span class="qzp-ic" aria-hidden="true">?</span><span class="qzp-t"><b>اختبر معلوماتك!</b> أسئلة عن الكوكبات والنجوم والقصص والكواكب.</span><button type="button" class="qzp-go">ابدأ الاختبار</button><button type="button" class="qzp-x" aria-label="إغلاق">✕</button>`
                   : `<span class="qzp-ic" aria-hidden="true">?</span><span class="qzp-t"><b>Test your knowledge!</b> Questions about the constellations, stars, stories and planets.</span><button type="button" class="qzp-go">Take the quiz</button><button type="button" class="qzp-x" aria-label="Close">✕</button>`;
  el.querySelector('.qzp-go').onclick = () => { setCulture('quiz'); const c = document.getElementById('card'); if (c) window.scrollTo({top: Math.max(0, c.getBoundingClientRect().top + scrollY - 80)}); };
  el.querySelector('.qzp-x').onclick = () => { try { localStorage.setItem('osms-qzpromo', '1'); } catch (e) {} el.hidden = true; el.innerHTML = ''; };
}
// the page's frame (header, tabs, list) follows the chosen language too
const CHROME = {
  en: {screen: 'Screen', skins: ['Automatic', 'Light', 'Dark', 'Black', 'Sepia', 'Night red (for stargazing)'], bgl: 'Background', bgs: ['Plain', 'Starfield', 'Milky Way glow', 'Desert night', 'Twilight', 'Star-chart paper', 'Aurora', 'Nebula', 'Moonlit night', 'Constellation map', 'Arabian night', 'Dawn'], settings: 'Settings', tour: 'How to use', install: 'Install app', icon: 'Change icon', cons: 'Constellations', search: 'Search'},
  ar: {screen: 'الشاشة', skins: ['تلقائي', 'فاتح', 'داكن', 'أسود', 'بنّي فاتح', 'أحمر ليلي (للرصد)'], bgl: 'الخلفية', bgs: ['بسيطة', 'سماء مرصّعة بالنجوم', 'وهج درب التبانة', 'ليل الصحراء', 'الشفق', 'ورق خريطة النجوم', 'الشفق القطبي', 'السديم', 'ليلة مقمرة', 'خريطة الكوكبات', 'ليلة عربية', 'الفجر'], settings: 'الإعدادات', tour: 'طريقة الاستخدام', install: 'ثبّت التطبيق', icon: 'غيّر الأيقونة', cons: 'الكوكبات', search: 'البحث'}};
let chromeLang = null;
// list section titles follow the page language
function regionName(r) { return (state.lang === 'ar' && REGIONS_AR[r]) || REGIONS[r]; }
function applyChrome() {
  const L = state.lang === 'ar' ? 'ar' : 'en'; if (L === chromeLang) return; chromeLang = L; const t = CHROME[L], ar = L === 'ar';
  const hd = document.querySelector('header.top'); if (hd) { hd.setAttribute('dir', ar ? 'rtl' : 'ltr'); hd.setAttribute('lang', L); hd.classList.toggle('rtl', ar); }
  document.body.classList.toggle('chrome-ar', ar);
  const set = (sel, txt) => { const e = document.querySelector(sel); if (e) e.textContent = txt; };
  const sk = document.querySelector('label.skins'); if (sk && sk.firstChild && sk.firstChild.nodeType === 3) sk.firstChild.textContent = t.screen + '\n        ';
  document.querySelectorAll('#list .grp[data-r]').forEach(g => { g.textContent = regionName(g.dataset.r); });
  document.querySelectorAll('#skin option').forEach((o, i) => { if (t.skins[i]) o.textContent = t.skins[i]; });
  const bl = document.querySelector('label[for=bgsel]'); if (bl && bl.firstChild && bl.firstChild.nodeType === 3) bl.firstChild.textContent = t.bgl + '\n        ';
  document.querySelectorAll('#bgsel option').forEach((o, i) => { if (t.bgs[i]) o.textContent = t.bgs[i]; });
  const tb = document.getElementById('tourbtn'); if (tb) { tb.lastChild.textContent = ' ' + t.tour; }
  const ib = document.getElementById('installbtn'); if (ib) { ib.lastChild.textContent = ' ' + t.install; }
  const cb = document.getElementById('iconbtn'); if (cb) { cb.lastChild.textContent = ' ' + t.icon; }
  try { PICSAVE.label(); } catch (e) {}
  document.querySelectorAll('.ntab').forEach(b => { const n = SECTIONS.find(x => x[0] === b.dataset.sec), tx = b.querySelector('.n-t'); if (n && tx) tx.textContent = ar ? n[2] : n[1]; });
  set('#setbtn .setlbl', t.settings); set('#srchbtn .setlbl', ar ? 'بحث' : 'Search'); const sbn = document.getElementById('srchbtn'); if (sbn) sbn.setAttribute('aria-label', ar ? 'ابحث في الموقع كله' : 'Search the whole site'); const hd2 = document.getElementById('setpanel'); if (hd2) { hd2.setAttribute('dir', ar ? 'rtl' : 'ltr'); hd2.classList.toggle('rtl', ar); } set('#index > summary > span:first-child', t.cons); set('.search .sect-lbl', t.search);
  const cnt = document.getElementById('count'); if (cnt && cnt.dataset[L]) cnt.textContent = cnt.dataset[L];
}
function syncNav() {
  try { qzPromo(); } catch (e) {}
  try { applyChrome(); } catch (e) {}
  const nav = document.getElementById('mainnav'); if (!nav) return;
  const sec = secOf(state.cul), ar = state.lang === 'ar';
  if (sec === 'culture') lastCul = state.cul; else if (sec === 'astro') lastAstro = state.cul;
  if (byKey[state.con] && !SCI_SPECIAL.has(state.con) && !byKey[state.con].hidden && !ARAB_SRC.has(state.con)) lastSciCon = state.con;
  document.documentElement.dataset.sec = sec;
  nav.querySelectorAll('.ntab').forEach(b => { const on = b.dataset.sec === sec; b.setAttribute('aria-pressed', on); b.classList.toggle('on', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  const sub = document.getElementById('subnav'); sub.innerHTML = `<div class="sn-row">${subnavHTML(sec, ar)}</div>`; sub.dataset.sec = sec;
  sub.setAttribute('dir', ar ? 'rtl' : 'ltr');
  const on = sub.querySelector('.sn.on'); if (on && on.scrollIntoView) { const r = sub.querySelector('.sn-row'); if (r.scrollWidth > r.clientWidth) on.scrollIntoView({block: 'nearest', inline: 'center'}); }
  document.querySelectorAll('[data-hlang]').forEach(b => b.setAttribute('aria-pressed', (ar ? 'ar' : 'en') === b.dataset.hlang));
}

function buildList(filter = '') {
  if (TOOL_TABS.has(state.cul)) return;
  const list = document.getElementById('list'); list.innerHTML = '';
  const f = filter.trim().toLowerCase();
  let shown = 0;
  Object.keys(REGIONS).forEach(r => {
    // in Science the Solar System, Why stars shine, Deep sky and Cosmology are tabs at the top, so the list leaves them out
    const items = DATA.constellations.filter(c => c.region === r && !c.hidden && inList(c.key, state.cul) && !(state.cul === 'science' && SCI_SPECIAL.has(c.key)) && (!f || (c.latin + ' ' + c.gloss + ' ' + c.ar + ' ' + c.key).toLowerCase().includes(f) || searchLore(c.key, f)));
    if (!items.length) return;
    const g = document.createElement('div'); g.className = 'grp'; g.dataset.r = r; g.textContent = regionName(r); list.appendChild(g);
    items.forEach(c => {
      shown++;
      const b = document.createElement('button'); b.type = 'button'; b.className = 'item'; b.dataset.key = c.key; b.setAttribute('role', 'listitem');
      const lo = DATA.lore[c.key] || {};
      const anyLore = CULTURES.some(cu => lo[cu.id]);
      const dots = !anyLore ? '' : CULTURES.map(cu => `<i class="${lo[cu.id] ? 'on' : ''}" style="--cc:var(--c-${cu.id})" title="${cu.name}${lo[cu.id] ? '' : ': no story'}"></i>`).join('');
      b.innerHTML = `<span class="nm">${esc(c.latin)}</span><span class="ar" lang="ar">${esc(c.ar)}</span><span class="gl">${esc(c.gloss)}</span><span class="ns"></span><span class="dots" aria-hidden="true">${dots}</span>`;
      b.addEventListener('click', () => { state.con = c.key; render(); if (matchMedia('(max-width: 860px)').matches) { document.getElementById('index').open = false; document.getElementById('card').scrollIntoView({behavior: 'smooth', block: 'start'}); } });
      list.appendChild(b);
    });
  });
  const note = document.createElement('p'); note.className = 'list-note'; const n = list.querySelectorAll('.item:not([data-key="QUR"]):not([data-key="POE"])').length; note.textContent = state.cul === 'science' ? (f ? `${n} matches` : (state.lang === 'ar' ? 'كل الكوكبات الـ88، ومعها درب التبانة وسحابتا ماجلان' : 'All 88 constellations, plus the Milky Way and the Magellanic Clouds')) : (f ? (state.lang === 'ar' ? `النتائج: ${n}` : `${n} matches`) : state.lang === 'ar' ? `الكوكبات التي لها قصص في ${CUL_AR_SKY[state.cul] || ''}: ${n}. كل الكوكبات الـ88 في قسم العلم.` : `${n} constellations with ${cname(state.cul)} stories. All 88 are in Science.`); list.prepend(note);
  if (!shown) list.innerHTML = state.cul === 'science' ? `<p class="empty-search">Nothing matches that search. Try a star name such as Sirius or Betelgeuse, or an object such as Orion Nebula.</p>` : `<p class="empty-search">No ${cname(state.cul)} story matches that search. Try a star name such as Sirius, or an Arabic name such as سهيل.</p>`;
  markList();
}
function searchLore(key, f) {
  const lo = DATA.lore[key] || {};
  const sc = DATA.sci[key];
  if (sc && sc.parts && sc.parts.some(p => p.stars.concat(p.extraHosts).some(x => (x.name + ' ' + x.bayer + ' ' + (DATA.starAr[x.name] || '')).toLowerCase().includes(f)) || p.dsos.some(d => (d.cat + ' ' + d.name).toLowerCase().includes(f)))) return true;
  if (state.cul === 'science') return false;
  return Object.values(lo).some(e => (e.seen + ' ' + e.stories.map(s => s.title + ' ' + s.text).join(' ')).toLowerCase().includes(f));
}
function hasLore(con, cul) { if (TOOL_TABS.has(cul)) return true; if (con === 'CUL') return cul !== 'science'; return cul === 'science' ? !!DATA.sci[con] : !!(DATA.lore[con] || {})[cul]; }
// which entries a culture's list shows: everything, except sections that belong to one place
function inList(con, cul) { if (cul === 'science') return !!DATA.sci[con]; if (con === 'SOL' || SCI_SPECIAL.has(con)) return false; if (ARAB_SRC.has(con)) return cul === 'arab'; return hasLore(con, cul); }   /* a culture lists only its own stories; all 88 are in Science */
function firstFor(cul) { const c = DATA.constellations.find(x => !ARAB_SRC.has(x.key) && hasLore(x.key, cul)); return c ? c.key : 'Ori'; }
function setCulture(id) {
  const wasCal = TOOL_TABS.has(state.cul);
  if (id === 'plan' && state.cul !== 'plan') try { PLAN.enter(); } catch (e) {}
  state.cul = id;
  if (TOOL_TABS.has(id)) { render(); return; }
  if (wasCal && !byKey[state.con]) state.con = 'Ori';
  if (!inList(state.con, id)) state.con = firstFor(id);
  buildList(document.getElementById('q').value);
  render();
}
function markList() {
  document.querySelectorAll('.item').forEach(b => {
    b.setAttribute('aria-current', b.dataset.key === state.con ? 'true' : 'false');
    const no = !hasLore(b.dataset.key, state.cul); b.classList.toggle('dim', no);
    const ns = b.querySelector('.ns'); if (ns) ns.textContent = no ? (state.lang === 'ar' ? `لا قصة في ${CUL_AR_SKY[state.cul] || ''}` : `No ${cname(state.cul)} story`) : '';
  });
}

// The Urjuza in full: folded until tapped, with a Fold button at the end too
function poemFold(p, ar) {
  const n = p.full.length, open = ar ? `اضغط لعرضها` : 'Tap to show', close = ar ? 'اضغط لطيّها' : 'Tap to fold';
  return `<details class="poemd"${ar ? ' dir="rtl" lang="ar"' : ''}><summary><span class="pd-ar" aria-hidden="true">▸</span><span class="pd-t">${ar ? `الأرجوزة كاملة · ${n} بيتًا` : `The Urjuza in full · ${n} couplets`}</span><span class="pd-h" data-o="${open}" data-c="${close}"></span></summary>`
    + `<section class="full" dir="ltr"><ol>${p.full.map(b => `<li><div class="bayt" lang="ar">${b.a.map(x => `<span>${esc(x)}</span>`).join('')}</div><p class="en">${esc(b.e)}</p></li>`).join('')}</ol><div class="by">${srcLinks(p.by)}</div>`
    + `<button type="button" class="pbtn pd-fold" onclick="const d=this.closest('details');d.open=false;d.scrollIntoView({block:'nearest'})">▴ ${ar ? 'اطوِ الأرجوزة' : 'Fold the Urjuza'}</button></section></details>`;
}
// under the Urjuza: what its couplets say, in plain words
function poemMeaning(key, ar) {
  const m = POEM_MEANING[key]; if (!m) return '';
  return `<div class="poem-mean"${ar ? ' dir="rtl" lang="ar"' : ' dir="ltr" lang="en"'}><span class="sect-lbl">${ar ? 'معنى الأبيات' : 'What the poem says'}</span><p>${esc(m[ar ? 1 : 0])}</p></div>`;
}
function poemHTML(p) {
  let orig;
  if (p.lang === 'ar') orig = p.orig.split('\n').map(l => `<div class="bayt">${l.split(' ۞ ').map(h => `<span>${esc(h)}</span>`).join('')}</div>`).join('');
  else orig = esc(p.orig);
  return `<section class="poem"><span class="sect-lbl">Poem</span><div class="orig" lang="${p.lang}">${orig}</div><p class="trans">${esc(p.trans)}</p><div class="by">${srcLinks(p.by)}</div></section>`;
}

const MONTHS = {
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
  af: ['Januarie','Februarie','Maart','April','Mei','Junie','Julie','Augustus','September','Oktober','November','Desember']
};
function gauge(pos, lang) {
  const R = 62, cx = 12, cy = 74, a = Math.max(-12, Math.min(90, pos.alt)) * Math.PI / 180;
  const x = cx + R * Math.cos(a), y = cy - R * Math.sin(a);
  const dir = {en: pos.face === 'S' ? 'South' : 'North', ar: pos.face === 'S' ? 'الجنوب' : 'الشمال', af: pos.face === 'S' ? 'Suid' : 'Noord'}[lang];
  const up = {en: 'Overhead', ar: 'سمت الرأس', af: 'Bo-kop'}[lang];
  return `<svg class="gauge" dir="ltr" viewBox="0 0 150 92" role="img" aria-label="${pos.alt} degrees above the horizon">
    <path d="M${cx} ${cy - R} A${R} ${R} 0 0 1 ${cx + R} ${cy}" class="g-arc"/>
    <line x1="0" y1="${cy}" x2="150" y2="${cy}" class="g-hz"/>
    <line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="g-ray"/>
    <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" class="g-dot${pos.never ? ' g-never' : ''}"/>
    <text x="${cx + 3}" y="${cy - R - 3}" class="g-tx">${up}</text>
    <text x="146" y="${cy + 14}" text-anchor="end" class="g-tx">${dir} →</text>
    <text x="${(x + 8).toFixed(1)}" y="${(y + (pos.alt > 70 ? 14 : -6)).toFixed(1)}" class="g-num">${pos.alt}°</text>
  </svg>`;
}
function skyPanel(pos, lang, c) {
  const cu = POS.cult[state.cul];
  const name = c.latin, m = MONTHS[lang][pos.month];
  let t;
  if (lang === 'ar') {
    const hz = pos.face === 'S' ? 'الجنوبي' : 'الشمالي';
    t = `كما تُرى من ${cu.place_ar}، ${cu.era_ar}. `;
    if (pos.never) t += `لم يكن مركز هذه الكوكبة يطلع فوق الأفق هناك قط (كان أعلى ارتفاع له نحو ${pos.alt}°)، فلم يكن أهل هذه الثقافة يرونها من بلادهم.`;
    else { t += pos.alt > 80 ? 'في أعلى ارتفاعها كانت تمرّ تقريبًا فوق الرأس مباشرة. ' : `في أعلى ارتفاعها كان مركزها على نحو ${pos.alt}° فوق الأفق ${hz} (90° تعني فوق الرأس مباشرة). `;
      t += pos.circ ? 'ولم تكن تغيب أبدًا، بل تدور حول القطب الليل كله.' : `وأفضل وقت لرؤيتها في السماء نحو التاسعة مساءً في شهر ${m}.`;
      if (pos.alt < 15) t += ' وكانت منخفضة قرب الأفق، لا تُرى إلا في الليالي الصافية.'; }
  } else if (lang === 'af') {
    const hz = pos.face === 'S' ? 'suidelike' : 'noordelike';
    t = `Soos gesien vanaf ${cu.place_af}, ${cu.era_af || cu.era}. `;
    if (pos.never) t += `Die middel van hierdie sterrebeeld het nooit daar bo die horison opgekom nie (op sy hoogste sowat ${pos.alt}°), so hierdie kultuur kon dit nie van hul tuiste af sien nie.`;
    else { t += pos.alt > 80 ? 'Op sy hoogste het dit amper reg bo jou kop verbygegaan. ' : `Op sy hoogste was die middel van ${name} sowat ${pos.alt}° bo die ${hz} horison (90° is reg bo jou kop). `;
      t += pos.circ ? 'Dit het nooit ondergegaan nie, maar die hele nag om die pool gedraai.' : `Dit was die beste sigbaar omstreeks 21:00 in ${m}.`;
      if (pos.alt < 15) t += ' Dit was laag op die horison en net op helder nagte sigbaar.'; }
  } else {
    const hz = pos.face === 'S' ? 'southern' : 'northern';
    t = `Seen from ${cu.place}, ${cu.era}. `;
    if (pos.never) t += `The centre of ${name} never rose above the horizon there (its highest point was about ${pos.alt}°), so this culture could not see it from home.`;
    else { t += pos.alt > 80 ? `At its highest, ${name} passed almost straight overhead. ` : `At its highest, the centre of ${name} stood about ${pos.alt}° above the ${hz} horizon (90° is straight overhead). `;
      t += pos.circ ? 'It never set: it circled the pole all night.' : `It was best placed around 9 pm in ${m}.`;
      if (pos.alt < 15) t += ' It stayed low near the horizon and was only seen on clear nights.'; }
  }
  const lbl = {en: 'In their sky', ar: 'في سمائهم', af: 'In hulle hemel'}[lang];
  const rtl = lang === 'ar';
  return `<div class="skypos"${rtl ? ' dir="rtl" lang="ar"' : ''}>${gauge(pos, lang)}<div${rtl ? ' class="rtl"' : ''}><span class="sect-lbl">${lbl}</span><p>${esc(t)}</p></div></div>`;
}

function versHTML(v, ar) {
  if (ar) return `<div class="verse"><div class="ar" lang="ar">﴿${esc(v.ar)}﴾ <span class="ref">${v.ref}</span></div>${v.noteAr ? `<p class="note">${esc(v.noteAr)}</p>` : ''}</div>`;
  return `<div class="verse"><div class="ar" lang="ar">﴿${esc(v.ar)}﴾ <span class="ref">${v.ref}</span></div><p class="en">${esc(v.en)} <span class="vref">Quran ${v.ref}</span></p>${v.note ? `<p class="note">${esc(v.note)}</p>` : ''}</div>`;
}

