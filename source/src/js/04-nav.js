/* ---------- main navigation: five section tabs, and a culture menu under Stories ---------- */
let lastCul = 'arab';
const NAVTABS = [['stories', 'Stories', 'القصص'], ['science', 'Science', 'العلم'], ['calendar', 'Sky calendar', 'تقويم السماء'], ['plan', 'Plan a night', 'خطّط لليلتك'], ['quiz', 'Quiz', 'اختبر معلوماتك'], ['guide', 'Saved lists', 'القوائم المحفوظة'], ['learn', 'For guides', 'للمرشدين']];
function tabOf(cul) { return cul === 'science' || TOOL_TABS.has(cul) ? cul : 'stories'; }
function buildNav() {
  const nav = document.getElementById('mainnav'); if (!nav) return;
  nav.innerHTML = `<div class="ntabs" role="tablist">${NAVTABS.map(([id, en]) => `<button type="button" role="tab" class="ntab" data-tab="${id}" aria-selected="false">${en}${id === 'guide' ? ' <span class="agbadge" id="agcount"></span>' : ''}</button>`).join('')}</div>
    <div class="nsub" id="nsub"><label for="culsel">Culture</label><select id="culsel">${CULTURES.map(c => `<option value="${c.id}">${esc(c.name)} · ${esc(c.nat)}</option>`).join('')}</select></div>`;
  nav.querySelectorAll('.ntab').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.tab;
    if (id === 'stories') { let c = tabOf(state.cul) === 'stories' ? state.cul : lastCul; if (!hasLore(state.con, c) || !byKey[state.con]) { const any = CULTURES.find(x => hasLore(state.con, x.id)); if (any) c = any.id; } setCulture(c); }
    else setCulture(id);
  }));
  nav.querySelector('#culsel').addEventListener('change', ev => setCulture(ev.target.value));
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
  en: {h1: 'One Sky, Many Stories', lede: 'Choose a culture and a group of stars, and read what that culture saw there: the story, the poem, and where it was recorded. Or open Science for the facts, and the Sky calendar for what to see tonight.', screen: 'Screen', skins: ['Automatic', 'Light', 'Dark', 'Black', 'Sepia', 'Night red (for stargazing)'], bgl: 'Background', bgs: ['Plain', 'Starfield', 'Milky Way glow', 'Desert night', 'Twilight', 'Star-chart paper', 'Aurora', 'Nebula', 'Moonlit night', 'Constellation map', 'Arabian night', 'Dawn'], tour: 'How to use', install: 'Install app', icon: 'Change icon', culture: 'Culture', cons: 'Constellations', search: 'Search'},
  ar: {h1: 'سماء واحدة، حكايات كثيرة', lede: 'اختر ثقافة ومجموعة من النجوم، واقرأ ما رآه أهلها فيها: القصة والشعر وأين دُوّنت. أو افتح «العلم» للحقائق، و«تقويم السماء» لما تستطيع رؤيته الليلة.', screen: 'الشاشة', skins: ['تلقائي', 'فاتح', 'داكن', 'أسود', 'بنّي فاتح', 'أحمر ليلي (للرصد)'], bgl: 'الخلفية', bgs: ['بسيطة', 'سماء مرصّعة بالنجوم', 'وهج درب التبانة', 'ليل الصحراء', 'الشفق', 'ورق خريطة النجوم', 'الشفق القطبي', 'السديم', 'ليلة مقمرة', 'خريطة الكوكبات', 'ليلة عربية', 'الفجر'], tour: 'طريقة الاستخدام', install: 'ثبّت التطبيق', icon: 'غيّر الأيقونة', culture: 'الثقافة', cons: 'الكوكبات', search: 'البحث'}};
let chromeLang = null;
// list section titles follow the page language
function regionName(r) { return (state.lang === 'ar' && REGIONS_AR[r]) || REGIONS[r]; }
function applyChrome() {
  const L = state.lang === 'ar' ? 'ar' : 'en'; if (L === chromeLang) return; chromeLang = L; const t = CHROME[L], ar = L === 'ar';
  const hd = document.querySelector('header.top'); if (hd) { hd.setAttribute('dir', ar ? 'rtl' : 'ltr'); hd.setAttribute('lang', L); hd.classList.toggle('rtl', ar); }
  document.body.classList.toggle('chrome-ar', ar);
  const set = (sel, txt) => { const e = document.querySelector(sel); if (e) e.textContent = txt; };
  set('header.top h1', t.h1); set('header.top .lede', t.lede);
  const sk = document.querySelector('label.skins'); if (sk && sk.firstChild && sk.firstChild.nodeType === 3) sk.firstChild.textContent = t.screen + '\n        ';
  document.querySelectorAll('#list .grp[data-r]').forEach(g => { g.textContent = regionName(g.dataset.r); });
  document.querySelectorAll('#skin option').forEach((o, i) => { if (t.skins[i]) o.textContent = t.skins[i]; });
  const bl = document.querySelector('label[for=bgsel]'); if (bl && bl.firstChild && bl.firstChild.nodeType === 3) bl.firstChild.textContent = t.bgl + '\n        ';
  document.querySelectorAll('#bgsel option').forEach((o, i) => { if (t.bgs[i]) o.textContent = t.bgs[i]; });
  const tb = document.getElementById('tourbtn'); if (tb) { tb.lastChild.textContent = ' ' + t.tour; }
  const ib = document.getElementById('installbtn'); if (ib) { ib.lastChild.textContent = ' ' + t.install; }
  const cb = document.getElementById('iconbtn'); if (cb) { cb.lastChild.textContent = ' ' + t.icon; }
  document.querySelectorAll('.ntab').forEach(b => { const n = NAVTABS.find(x => x[0] === b.dataset.tab); if (n && b.firstChild && b.firstChild.nodeType === 3) b.firstChild.textContent = ar ? n[2] : n[1]; });
  set('#nsub label', t.culture); set('#index > summary > span:first-child', t.cons); set('.search .sect-lbl', t.search);
  const cnt = document.getElementById('count'); if (cnt && cnt.dataset[L]) cnt.textContent = cnt.dataset[L];
}
function syncNav() {
  try { qzPromo(); } catch (e) {}
  try { applyChrome(); } catch (e) {}
  const nav = document.getElementById('mainnav'); if (!nav) return;
  const tab = tabOf(state.cul); if (tab === 'stories') lastCul = state.cul;
  nav.querySelectorAll('.ntab').forEach(b => { const on = b.dataset.tab === tab; b.setAttribute('aria-selected', on); b.classList.toggle('on', on); });
  const sub = nav.querySelector('#nsub'), sel = nav.querySelector('#culsel');
  sub.hidden = tab !== 'stories';
  if (tab === 'stories') {
    sel.value = state.cul;
    [...sel.options].forEach(o => { const c = CULTURES.find(x => x.id === o.value), has = byKey[state.con] && hasLore(state.con, o.value); o.disabled = false; o.textContent = `${c.name} · ${c.nat}${has ? '' : ' (no story)'}`; });
    sub.style.setProperty('--cc', `var(--c-${state.cul})`);
  }
}

function buildCultures() {
  const fs = document.getElementById('cultures');
  CULTURES.forEach(c => {
    const d = document.createElement('div'); d.className = 'chip'; d.style.setProperty('--cc', `var(--c-${c.id})`);
    d.innerHTML = `<input type="radio" name="cul" id="cul-${c.id}" value="${c.id}"><label for="cul-${c.id}"><span class="dot"></span>${c.name} <span class="nat"${c.natLang ? ` lang="${c.natLang}"` : ''}>${c.nat}</span></label>`;
    d.querySelector('input').addEventListener('change', () => setCulture(c.id));
    fs.appendChild(d);
  });
  const sep = document.createElement('span'); sep.className = 'chip-sep'; sep.setAttribute('aria-hidden', 'true'); fs.appendChild(sep);
  const d = document.createElement('div'); d.className = 'chip sci'; d.style.setProperty('--cc', 'var(--c-science)');
  d.innerHTML = `<input type="radio" name="cul" id="cul-science" value="science"><label for="cul-science"><span class="dot"></span>Science <span class="nat" lang="ar">العلم</span></label>`;
  d.querySelector('input').addEventListener('change', () => setCulture('science'));
  fs.appendChild(d);
  const d2 = document.createElement('div'); d2.className = 'chip sci'; d2.style.setProperty('--cc', 'var(--c-cal)');
  d2.innerHTML = `<input type="radio" name="cul" id="cul-calendar" value="calendar"><label for="cul-calendar"><span class="dot"></span>Sky calendar <span class="nat" lang="ar">تقويم السماء</span></label>`;
  d2.querySelector('input').addEventListener('change', () => setCulture('calendar'));
  fs.appendChild(d2);
  const d3 = document.createElement('div'); d3.className = 'chip sci'; d3.style.setProperty('--cc', '#e9a23b');
  d3.innerHTML = `<input type="radio" name="cul" id="cul-guide" value="guide"><label for="cul-guide"><span class="dot"></span>★ Saved lists <span class="agbadge" id="agcount-old"></span></label>`;
  d3.querySelector('input').addEventListener('change', () => setCulture('guide'));
  fs.appendChild(d3);
  const d4 = document.createElement('div'); d4.className = 'chip sci plan'; d4.style.setProperty('--cc', 'var(--c-cal)');
  d4.innerHTML = `<input type="radio" name="cul" id="cul-plan" value="plan"><label for="cul-plan"><span class="dot"></span>Plan a night, step by step <span class="nat" lang="ar">خطّط لليلتك خطوة بخطوة</span></label>`;
  d4.querySelector('input').addEventListener('change', () => setCulture('plan'));
  fs.appendChild(d4);
  const d5 = document.createElement('div'); d5.className = 'chip sci'; d5.style.setProperty('--cc', '#8b7cf6');
  d5.innerHTML = `<input type="radio" name="cul" id="cul-quiz" value="quiz"><label for="cul-quiz"><span class="dot"></span>Quiz <span class="nat" lang="ar">اختبر معلوماتك</span></label>`;
  d5.querySelector('input').addEventListener('change', () => setCulture('quiz'));
  fs.appendChild(d5);
}

function buildList(filter = '') {
  if (TOOL_TABS.has(state.cul)) return;
  const list = document.getElementById('list'); list.innerHTML = '';
  const f = filter.trim().toLowerCase();
  let shown = 0;
  Object.keys(REGIONS).forEach(r => {
    const items = DATA.constellations.filter(c => c.region === r && inList(c.key, state.cul) && (!f || (c.latin + ' ' + c.gloss + ' ' + c.ar + ' ' + c.key).toLowerCase().includes(f) || searchLore(c.key, f)));
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
  const note = document.createElement('p'); note.className = 'list-note'; const n = list.querySelectorAll('.item:not([data-key="QUR"])').length; note.textContent = state.cul === 'science' ? (f ? `${n} matches` : (state.lang === 'ar' ? 'كل الكوكبات الـ88، ومعها درب التبانة وسحابتا ماجلان والمجموعة الشمسية' : 'All 88 constellations, plus the Milky Way, the Magellanic Clouds and the Solar System')) : (state.lang === 'ar' ? `كل الكوكبات الـ88؛ لـ${[...list.querySelectorAll('.item')].filter(x => x.dataset.key !== 'QUR' && hasLore(x.dataset.key, state.cul)).length} منها قصص في ${CUL_AR_SKY[state.cul] || ''}، والباقي باهت` : `All 88 constellations; ${[...list.querySelectorAll('.item')].filter(x => x.dataset.key !== 'QUR' && hasLore(x.dataset.key, state.cul)).length} have ${cname(state.cul)} stories, the others are dimmed`); list.prepend(note);
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
function hasLore(con, cul) { if (TOOL_TABS.has(cul)) return true; return cul === 'science' ? !!DATA.sci[con] : !!(DATA.lore[con] || {})[cul]; }
// which entries a culture's list shows: everything, except sections that belong to one place
function inList(con, cul) { if (cul === 'science') return !!DATA.sci[con]; if (con === 'SOL' || con === 'DSO' || con === 'STAR') return false; if (con === 'QUR') return cul === 'arab'; return !!byKey[con]; }
function firstFor(cul) { const c = DATA.constellations.find(x => x.key !== 'QUR' && hasLore(x.key, cul)); return c ? c.key : 'Ori'; }
function setCulture(id) {
  const wasCal = TOOL_TABS.has(state.cul);
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

