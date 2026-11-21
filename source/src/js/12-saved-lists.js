/* ---------- AstroGuide: saved lists of constellations, stars, objects and planets ---------- */
const AG = (() => {
  let S = {lists: [], active: null};
  const uid = () => Math.random().toString(36).slice(2, 9);
  function load() {
    try { const v = JSON.parse(localStorage.getItem('osms-ag') || 'null'); if (v && Array.isArray(v.lists)) S = v; } catch (e) {}
    if (!S.lists.length) S.lists = [{id: uid(), name: '', items: []}];
    if (!S.lists.find(l => l.id === S.active)) S.active = S.lists[0].id;
  }
  function save() { try { localStorage.setItem('osms-ag', JSON.stringify(S)); } catch (e) {} updateCount(); }
  const idOf = it => [it.t, it.key, it.ref || '', it.t === 'con' ? it.cul : ''].join('|');
  const listName = (l, ar) => l.name || (ar ? 'قائمتي' : 'My list');
  const active = () => S.lists.find(l => l.id === S.active) || S.lists[0];
  const inList = (l, it) => l.items.some(x => idOf(x) === idOf(it));
  const savedAnywhere = it => S.lists.some(l => inList(l, it));
  function toggle(l, it) {
    const i = l.items.findIndex(x => idOf(x) === idOf(it));
    if (i >= 0) { l.items.splice(i, 1); save(); return false; }
    l.items.push({...it, note: ''}); save(); return true;
  }
  function total() { return S.lists.reduce((n, l) => n + l.items.length, 0); }
  function updateCount() { const el = document.getElementById('agcount'); if (el) el.textContent = total() ? String(total()) : ''; }

  // ---- what an item is ----
  function findStar(key, name) {
    const sc = DATA.sci[key]; if (!sc || !sc.parts) return null;
    for (const p of sc.parts) for (const s of p.stars.concat(p.extraHosts, [p.nearest])) if (s && s.name === name) return s;
    return null;
  }
  function findDso(key, id) {
    const sc = DATA.sci[key]; if (!sc) return null;
    const lists = sc.parts ? sc.parts.map(p => p.dsos) : [sc.dsos || []];
    for (const l of lists) for (const d of l) if (d.id === id) return d;
    return null;
  }
  const TYPES = {con: ['Constellation', 'كوكبة'], star: ['Star', 'نجم'], dso: ['Deep sky', 'جرم سماوي عميق'], planet: ['Planet', 'كوكب'], pat: ['Pattern', 'شكل نجمي']};
  function info(it, lang) {
    const ar = lang === 'ar';
    if (it.t === 'con') {
      const c = byKey[it.key]; if (!c) return null;
      const where = it.cul === 'science' ? (ar ? 'العلم' : 'Science') : CULTURES.find(x => x.id === it.cul) ? (ar ? '' : cname(it.cul) + ' sky') : '';
      return {title: ar ? c.ar : c.latin, sub: ar ? c.latin : c.ar, color: `var(--c-${it.cul === 'science' ? 'science' : it.cul})`, type: TYPES.con[ar ? 1 : 0] + (where ? ' · ' + where : (ar && it.cul !== 'science' ? ' · ' + (CULTURES.find(x => x.id === it.cul) || {nat: ''}).nat : ''))};
    }
    if (it.t === 'star') {
      const s = findStar(it.key, it.ref); if (!s) return null;
      return {title: s.name, sub: DATA.starAr[s.name] || '', color: bvColour(s.ci, s.cls), type: TYPES.star[ar ? 1 : 0] + ' · ' + (ar ? (byKey[it.key] || {}).ar : (byKey[it.key] || {}).latin), star: s};
    }
    if (it.t === 'dso') {
      const d = findDso(it.key, it.ref); if (!d) return null;
      return {title: d.name || d.cat, sub: d.cat && d.name ? d.cat : '', color: '#85B7EB', type: (DTYPE[lang][d.type] || TYPES.dso[ar ? 1 : 0]) + ' · ' + (ar ? (byKey[it.key] || {}).ar : (byKey[it.key] || {}).latin)};
    }
    if (it.t === 'planet') {
      const b = DATA.sci.SOL.bodies.find(x => x.id === it.ref); if (!b) return null;
      return {title: ar ? b.ar : b.en, sub: ar ? '' : b.ar, color: b.color, type: b.id === 'sun' ? (ar ? 'نجم' : 'Star') : TYPES.planet[ar ? 1 : 0]};
    }
    if (it.t === 'pat') {
      const p = CALP.patterns.find(x => x.id === it.ref); if (!p) return null;
      return {title: ar ? p.nameAr : p.name, sub: ar ? '' : p.nameAr, color: 'var(--c-cal)', type: TYPES.pat[ar ? 1 : 0] + ' · ' + CULT_LBL[p.culture][ar ? 1 : 0]};
    }
    return null;
  }

  // ---- save buttons and the list chooser ----
  function btn(it, lang, small) {
    const on = savedAnywhere(it), ar = lang === 'ar';
    return `<button type="button" class="agsave${small ? ' sm' : ''}" data-ag="${esc(JSON.stringify(it))}" aria-pressed="${on}" title="${ar ? 'احفظ في قوائمك' : 'Save to your lists'}">${on ? '★' : '☆'}${small ? '' : ` <span>${on ? (ar ? 'محفوظ' : 'Saved') : (ar ? 'احفظ' : 'Save')}</span>`}</button>`;
  }
  function refreshButtons() {
    document.querySelectorAll('.agsave').forEach(b => {
      const it = JSON.parse(b.dataset.ag), on = savedAnywhere(it), ar = state.lang === 'ar';
      b.setAttribute('aria-pressed', on); b.firstChild.textContent = on ? '★' : '☆';
      const sp = b.querySelector('span'); if (sp) sp.textContent = on ? (ar ? 'محفوظ' : 'Saved') : (ar ? 'احفظ' : 'Save');
    });
  }
  function toast(msg) {
    let t = document.getElementById('agtoast');
    if (!t) { t = document.createElement('div'); t.id = 'agtoast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 1800);
  }
  function closeMenu() { const m = document.getElementById('agmenu'); if (m) m.remove(); }
  function menu(b) {
    const it = JSON.parse(b.dataset.ag), ar = state.lang === 'ar';
    closeMenu();
    if (S.lists.length === 1) {
      const l = S.lists[0], on = toggle(l, it); refreshButtons();
      toast(on ? (ar ? `حُفظ في «${listName(l, true)}»` : `Saved to ${listName(l, false)}`) : (ar ? 'أُزيل من القائمة' : 'Removed from your list'));
      return;
    }
    const m = document.createElement('div'); m.id = 'agmenu'; m.setAttribute('role', 'menu'); if (ar) { m.dir = 'rtl'; m.lang = 'ar'; }
    m.innerHTML = `<div class="agm-h">${ar ? 'احفظ في' : 'Save to'}</div>` + S.lists.map(l => `<button type="button" role="menuitemcheckbox" aria-checked="${inList(l, it)}" data-l="${l.id}"><span class="ck">${inList(l, it) ? '✓' : ''}</span>${esc(listName(l, ar))} <span class="n">${l.items.length}</span></button>`).join('')
      + `<button type="button" data-new="1"><span class="ck">+</span>${ar ? 'قائمة جديدة' : 'New list'}</button>`;
    document.body.appendChild(m);
    const r = b.getBoundingClientRect();
    m.style.top = (r.bottom + scrollY + 6) + 'px';
    m.style.left = Math.max(8, Math.min(innerWidth - m.offsetWidth - 8, r.left + scrollX)) + 'px';
    m.querySelectorAll('[data-l]').forEach(x => x.addEventListener('click', ev => {
      ev.stopPropagation(); const l = S.lists.find(y => y.id === x.dataset.l), on = toggle(l, it);
      x.setAttribute('aria-checked', on); x.querySelector('.ck').textContent = on ? '✓' : ''; x.querySelector('.n').textContent = l.items.length; refreshButtons();
    }));
    m.querySelector('[data-new]').addEventListener('click', ev => {
      ev.stopPropagation(); const name = prompt(ar ? 'اسم القائمة الجديدة' : 'Name for the new list', ar ? 'جولة الليلة' : "Tonight's tour");
      if (name === null) return; const l = {id: uid(), name: name.trim().slice(0, 40), items: []}; S.lists.push(l); toggle(l, it); refreshButtons(); closeMenu();
      toast(ar ? `حُفظ في «${listName(l, true)}»` : `Saved to ${listName(l, false)}`);
    });
    m.querySelector('button').focus();
  }
  document.addEventListener('click', ev => {
    const b = ev.target.closest('.agsave'); if (b) { ev.preventDefault(); ev.stopPropagation(); menu(b); return; }
    if (!ev.target.closest('#agmenu')) closeMenu();
  });
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape') closeMenu(); });

  // ---- opening an item, and the presenting bar ----
  function open(it, listId, i) {
    state.agNav = listId ? {list: listId, i} : null;
    if (it.t === 'con') { state.focus = null; state.con = it.key; setCulture(it.cul); }
    else if (it.t === 'planet') { state.focus = `[data-planet="${it.ref}"]`; state.con = 'SOL'; setCulture('science'); }
    else { state.focus = it.t === 'star' ? `[data-star="${CSS.escape(it.ref)}"]` : it.t === 'dso' ? `[data-dso="${CSS.escape(it.ref)}"]` : null; state.con = it.key; setCulture('science'); }
    window.scrollTo({top: document.getElementById('card').getBoundingClientRect().top + scrollY - 10, behavior: 'smooth'});
  }
  function navBar(lang) {
    const n = state.agNav; if (!n) return '';
    const l = S.lists.find(x => x.id === n.list); if (!l || !l.items[n.i]) { state.agNav = null; return ''; }
    const ar = lang === 'ar', inf = info(l.items[n.i], lang) || {title: '?'};
    const note = l.items[n.i].note;
    return `<div class="agnav"${ar ? ' dir="rtl" lang="ar"' : ''}><button type="button" data-agnav="prev"${n.i === 0 ? ' aria-disabled="true"' : ''}>${ar ? '→ السابق' : '← Previous'}</button><span class="agpos">${n.i + 1} ${ar ? 'من' : 'of'} ${l.items.length} · <b>${esc(inf.title)}</b> <span class="vref">${esc(listName(l, ar))}</span></span><button type="button" data-agnav="next"${n.i === l.items.length - 1 ? ' aria-disabled="true"' : ''}>${ar ? 'التالي ←' : 'Next →'}</button><button type="button" data-agnav="list">${ar ? 'القائمة' : 'Back to list'}</button><button type="button" data-agnav="close" aria-label="${ar ? 'إغلاق' : 'Close'}">✕</button>${note ? `<p class="agnote-show">${esc(note)}</p>` : ''}</div>`;
  }
  function bindNav(card) {
    card.querySelectorAll('[data-agnav]').forEach(b => b.addEventListener('click', () => {
      const n = state.agNav, l = n && S.lists.find(x => x.id === n.list); if (!l) return;
      const a = b.dataset.agnav;
      if (a === 'prev' && n.i > 0) open(l.items[n.i - 1], l.id, n.i - 1);
      else if (a === 'next' && n.i < l.items.length - 1) open(l.items[n.i + 1], l.id, n.i + 1);
      else if (a === 'list') { S.active = l.id; save(); state.agNav = null; setCulture('guide'); }
      else if (a === 'close') { state.agNav = null; render(); }
    }));
    if (state.focus) {
      const el = card.querySelector(state.focus); state.focus = null;
      if (el) { let d = el.closest('details'); while (d) { d.open = true; d = d.parentElement && d.parentElement.closest('details'); } }
      if (el) setTimeout(() => { el.scrollIntoView({behavior: 'smooth', block: 'center'}); el.classList.add('agflash'); setTimeout(() => el.classList.remove('agflash'), 1600); }, 60);
    }
  }


  // ---- the full details of an item, shown inside AstroGuide ----
  function withCon(key, f) { const o = state.con; state.con = key; try { return f(); } finally { state.con = o; } }
  function chartFig(key, flip) { const ch = DATA.charts[key]; return ch ? `<figure class="chart${flip ? ' flip' : ''}">${ch}</figure>` : ''; }
  function loreHTML(key, cul, lang) {
    const e = (DATA.lore[key] || {})[cul]; if (!e) return '';
    const L = lang === 'ar' && e.ar ? 'ar' : 'en', src = L === 'ar' ? e.ar : e, ar = L === 'ar';
    const pos = (POS.pos[key] || {})[cul];
    let h = '';
    if (pos) { const oc = state.cul; state.cul = cul; try { h = skyPanel(pos, L, byKey[key]); } finally { state.cul = oc; } }
    h += `<div class="lore${ar ? ' rtl' : ''}"${ar ? ' dir="rtl" lang="ar"' : ' dir="ltr" lang="en"'} style="--srcl:'${ar ? 'المصدر' : 'Source'} · '">`;
    h += `<div class="seen"><span class="lbl">${ar ? 'ماذا رأوا' : 'What they saw'}</span><p>${src.seen}</p></div>`;
    src.stories.forEach((st, i) => { h += `<article class="story"><h3>${esc(st.title)}</h3><p>${st.text}</p><div class="src" dir="ltr" lang="en">${srcLinks(e.stories[i].source)}</div></article>`; });
    if (e.quran) { h += `<div class="qbox"><span class="sect-lbl">${ar ? 'في القرآن الكريم' : 'In the Quran'}</span>`; e.quran.forEach(v => { h += versHTML(v, ar); }); h += `</div>`; }
    h += `</div>`;
    if (e.poem && e.poem.full) h += poemFold(e.poem, ar);
    else if (e.poem) h += poemHTML(e.poem);
    return h;
  }
  function patHTML(it, lang) {
    const p = CALP.patterns.find(x => x.id === it.ref); if (!p) return '';
    calInit(); const ar = lang === 'ar', st = CAL.st, pl = placeObj();
    const now = new Date(Date.now() + pl.tz * 36e5);
    let Y = now.getUTCFullYear(), M = now.getUTCMonth(), D = now.getUTCDate();
    if (st.month) { [Y, M] = st.month.split('-').map(Number); D = st.day || 15; }
    const S2 = {lat: pl.lat, lon: pl.lon, tz: pl.tz, bortle: st.bortle, sqm: st.sqm, tourStart: st.tourStart, tourEnd: st.tourEnd, k: st.k, guestPenalty: st.guestPenalty, passMargin: st.passMargin, stackMargins: st.stackMargins, minCoreAlt: st.minCoreAlt};
    const R = VIS.rankPatterns([p], S2, Y, M, D, CALP.stars);
    const day = fmtD(Date.UTC(Y, M, D), lang, {weekday: 'long', day: 'numeric', month: 'long'});
    let h = chartFig(it.key);
    h += `<p class="muted" style="margin:0 0 10px">${ar ? `من ${esc(pl.ar)}، ${day}، من ${st.tourStart} إلى ${st.tourEnd}. (غيّر المكان والليلة من تقويم السماء.)` : `From ${esc(pl.en)}, ${day}, ${st.tourStart} to ${st.tourEnd}. (Change the place and night in the Sky calendar.)`}</p>`;
    return h + `<div class="tpl-list">${R.results[0] ? tourRow(R.results[0], p, lang, pl) : ''}</div>`;
  }
  function detailHTML(it, lang) {
    const ar = lang === 'ar';
    try {
      if (it.t === 'con') {
        if (it.cul === 'science') return chartFig(it.key) + withCon(it.key, () => sciHTML(it.key, lang));
        const pos = (POS.pos[it.key] || {})[it.cul];
        return chartFig(it.key, pos && pos.face === 'N' && !pos.never) + loreHTML(it.key, it.cul, lang);
      }
      if (it.t === 'star') { const s = findStar(it.key, it.ref); return s ? `<div class="stars agone">${withCon(it.key, () => starCard(s, lang))}</div>` : ''; }
      if (it.t === 'dso') { const d = findDso(it.key, it.ref); return d ? withCon(it.key, () => dsoHTML([d], lang)) : ''; }
      if (it.t === 'planet') { const b = DATA.sci.SOL.bodies.find(x => x.id === it.ref); return b ? planetHTML(b, lang) : ''; }
      if (it.t === 'pat') return patHTML(it, lang);
    } catch (e) { console.error(e); }
    return `<p class="muted">${ar ? 'لا تتوفر تفاصيل لهذا العنصر.' : 'No details are available for this item.'}</p>`;
  }

  // ---- presenting a list, inside AstroGuide ----
  let pres = null;
  function presHTML(lang) {
    const ar = lang === 'ar', l = pres && S.lists.find(x => x.id === pres.list);
    if (!l || !l.items[pres.i]) { pres = null; return null; }
    const i = pres.i, it = l.items[i], inf = info(it, lang) || {title: it.ref || it.key, sub: '', color: 'var(--line)', type: ''}, n = l.items.length;
    const nav = cls => `<div class="agnav ${cls}"><button type="button" data-apres="prev"${i === 0 ? ' aria-disabled="true"' : ''}>${ar ? '→ السابق' : '← Previous'}</button><span class="agpos">${i + 1} ${ar ? 'من' : 'of'} ${n} · <b>${esc(inf.title)}</b> <span class="vref">${esc(listName(l, ar))}</span></span><button type="button" data-apres="next"${i === n - 1 ? ' aria-disabled="true"' : ''}>${ar ? 'التالي ←' : 'Next →'}</button><button type="button" data-apres="list">${ar ? 'القائمة' : 'Back to list'}</button></div>`;
    let h = `<div class="agpres" id="agpres">`;
    h += `<div class="agph"><span class="agdot" style="background:${inf.color}"></span><div><h3><bdi>${esc(inf.title)}</bdi>${inf.sub ? ` <span class="agsub" ${/[؀-ۿ]/.test(inf.sub) ? 'lang="ar"' : ''}>${esc(inf.sub)}</span>` : ''}</h3><span class="agtype">${esc(inf.type)}</span></div></div>`;
    h += `<textarea class="agnote" data-anote="${i}" rows="1" placeholder="${ar ? 'ملاحظاتك للحديث…' : 'Your talking points…'}">${esc(it.note || '')}</textarea>`;
    h += `<div class="agdet">${detailHTML(it, lang)}</div>`;
    h += `<div class="agdfoot"><button type="button" data-aopen="${i}">${ar ? 'افتح صفحته' : 'Open its page'}</button></div>` + nav('stk') + `</div>`;
    return h;
  }
  function presTop() { const e = document.getElementById('agpres') || document.getElementById('card'); if (e) window.scrollTo({top: Math.max(0, e.getBoundingClientRect().top + scrollY - 8)}); }
  function presGo(d) {
    const l = pres && S.lists.find(x => x.id === pres.list); if (!l) return;
    const j = pres.i + d; if (j < 0 || j >= l.items.length) return;
    pres.i = j; render(); presTop();
  }
  document.addEventListener('keydown', ev => {
    if (!pres || state.cul !== 'guide' || /INPUT|TEXTAREA|SELECT/.test(ev.target.tagName) || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    const rtl = state.lang === 'ar';
    if (ev.key === 'ArrowRight') { ev.preventDefault(); presGo(rtl ? -1 : 1); }
    else if (ev.key === 'ArrowLeft') { ev.preventDefault(); presGo(rtl ? 1 : -1); }
  });

  // ---- comparison ----
  function compareHTML(items, lang) {
    const ar = lang === 'ar', stars = items.map(it => ({it, s: findStar(it.key, it.ref)})).filter(x => x.s);
    if (stars.length < 2) return '';
    const R = stars.map(x => starRadius(x.s) || 1), max = Math.max(...R, 1);
    const W = 640, H = 170, sc = 70 / max;
    let x = 20, svg = `<svg class="sizes" viewBox="0 0 ${W} ${H}" role="img" aria-label="${ar ? 'مقارنة الأحجام بالمقياس نفسه' : 'Sizes compared to the same scale'}" dir="ltr">`;
    stars.forEach((st, i) => { const r = Math.max(1.5, R[i] * sc), w = Math.max(2 * r + 24, 110); x += w / 2; svg += `<circle cx="${x.toFixed(1)}" cy="80" r="${r.toFixed(1)}" fill="${bvColour(st.s.ci, st.s.cls)}"/><text x="${x.toFixed(1)}" y="${Math.min(H - 6, 80 + r + 18).toFixed(1)}" text-anchor="middle">${esc(st.s.name)}</text>`; x += w / 2; });
    const rs = Math.max(1.2, sc); x += 40; svg += `<circle cx="${Math.min(W - 30, x)}" cy="80" r="${rs.toFixed(1)}" fill="#f6c453"/><text x="${Math.min(W - 30, x)}" y="${(80 + rs + 18).toFixed(1)}" text-anchor="middle">${ar ? 'الشمس' : 'Sun'}</text></svg>`;
    const rows = [
      [ar ? 'الكوكبة' : 'Constellation', st => esc(ar ? byKey[st.it.key].ar : byKey[st.it.key].latin)],
      [ar ? 'النوع' : 'Type', st => esc(typeTxt(st.s, lang))],
      [ar ? 'المسافة' : 'Distance', st => distTxt(st.s.dist, lang)],
      [ar ? 'الحرارة' : 'Temperature', st => st.s.temp ? (ar ? `نحو ${nf(st.s.temp)} كلفن` : `about ${nf(st.s.temp)} K`) : '—'],
      [ar ? 'الحجم' : 'Size', st => { const r = starRadius(st.s); return r ? (ar ? `${nf(sig(r), 1)} ضعف الشمس` : `${nf(sig(r), 1)} × the Sun`) : '—'; }],
      [ar ? 'شدة الإضاءة' : 'Brightness', st => st.s.lum ? (ar ? `${nf(sig(st.s.lum), 1)} ضعف الشمس` : `${nf(sig(st.s.lum), 1)} × the Sun`) : '—'],
      [ar ? 'القدر' : 'Magnitude', st => `<bdi dir="ltr">${st.s.mag.toFixed(1)}</bdi>`],
      [ar ? 'مزدوج؟' : 'Double?', st => esc(dblTxt(st.s.dbl, lang).split(/[:،,]/)[0])],
      [ar ? 'لرؤيته' : 'To see it', st => esc(scopeFor(st.s.mag)[lang])],
      [ar ? 'غادره الضوء' : 'Light left it', st => st.s.dist ? leftAt(st.s.dist, lang) : '—']];
    return `<section class="agcmp"><h3>${ar ? 'مقارنة النجوم' : 'Star comparison'}</h3>${svg}<div class="agtw"><table class="agt"><thead><tr><th></th>${stars.map(st => `<th><span class="sw" style="--sc:${bvColour(st.s.ci, st.s.cls)}"></span> ${esc(st.s.name)}</th>`).join('')}</tr></thead><tbody>${rows.map(([lab, f]) => `<tr><th>${lab}</th>${stars.map(st => `<td>${f(st)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="vref" style="white-space:normal">${ar ? 'الرسم بمقياس واحد للنجوم والشمس.' : 'The drawing shows the stars and the Sun at one scale.'}</p></section>`;
  }

  // ---- the AstroGuide page ----
  let cmp = new Set(), renaming = false, confirmDel = false, openSet = new Set();
  function guideHTML(lang) {
    const ar = lang === 'ar', l = active();
    let h = `<div class="agw${ar ? ' rtl' : ''}"${ar ? ' dir="rtl" lang="ar"' : ''}>`;
    if (pres) { const x = presHTML(lang); if (x) return h + x + `</div>`; }
    h += `<p class="muted" style="max-width:70ch">${ar ? 'احفظ الكوكبات والنجوم والأجرام والكواكب بزر ☆ احفظ في أي صفحة، ورتّبها في قوائم لجولاتك ومحاضراتك، وأضف ملاحظاتك، وتنقّل بينها بسهولة.' : 'Save constellations, stars, deep-sky objects and planets with the ☆ Save button on any page. Arrange them in lists for your tours and talks, add your notes, and move between them freely.'}</p>`;
    h += `<div class="aglists" role="tablist">${S.lists.map(x => `<button type="button" role="tab" class="aglist" data-al="${x.id}" aria-selected="${x.id === l.id}">${esc(listName(x, ar))} <span class="n">${x.items.length}</span></button>`).join('')}<button type="button" class="aglist add" data-anew="1">+ ${ar ? 'قائمة جديدة' : 'New list'}</button></div>`;
    h += `<div class="agbar">`;
    if (renaming) h += `<input id="agname" type="text" maxlength="40" value="${esc(l.name)}" placeholder="${ar ? 'اسم القائمة' : 'List name'}"><button type="button" data-aact="rsave">${ar ? 'حفظ' : 'Save name'}</button>`;
    else h += `<button type="button" data-aact="rename">${ar ? 'إعادة التسمية' : 'Rename'}</button>`;
    h += `<button type="button" data-aact="copy">${ar ? 'انسخ رابط القائمة' : 'Copy list link'}</button>`;
    if (S.lists.length > 1 || l.items.length) h += `<button type="button" data-aact="del" class="${confirmDel ? 'danger' : ''}">${confirmDel ? (ar ? 'اضغط مجددًا للحذف' : 'Tap again to delete') : (ar ? 'حذف القائمة' : 'Delete list')}</button>`;
    h += `</div>`;
    if (!l.items.length) {
      h += `<div class="agempty"><p><b>${ar ? 'القائمة فارغة' : 'This list is empty'}</b></p><p>${ar ? 'افتح أي كوكبة أو نجم أو كوكب واضغط ☆ احفظ ليظهر هنا.' : 'Open any constellation, star or planet and tap ☆ Save to add it here.'}</p></div>`;
    } else {
      h += `<ol class="agitems">${l.items.map((it, i) => {
        const inf = info(it, lang) || {title: it.ref || it.key, sub: '', color: 'var(--line)', type: ''};
        return `<li class="agi"><div class="agrow"><span class="agn">${i + 1}</span><span class="agdot" style="background:${inf.color}"></span>
          <button type="button" class="agtitle" data-adet="${i}" aria-expanded="${openSet.has(idOf(it))}"><b>${esc(inf.title)}</b>${inf.sub ? ` <span class="agsub" ${/[؀-ۿ]/.test(inf.sub) ? 'lang="ar"' : ''}>${esc(inf.sub)}</span>` : ''}<span class="agtype">${esc(inf.type)}</span></button>
          <span class="agctl">${it.t === 'star' ? `<label class="agck" title="${ar ? 'للمقارنة' : 'Compare'}"><input type="checkbox" data-acmp="${i}"${cmp.has(idOf(it)) ? ' checked' : ''}> ${ar ? 'قارن' : 'Compare'}</label>` : ''}
          <button type="button" data-aup="${i}" aria-label="${ar ? 'إلى الأعلى' : 'Move up'}"${i === 0 ? ' aria-disabled="true"' : ''}>↑</button><button type="button" data-adown="${i}" aria-label="${ar ? 'إلى الأسفل' : 'Move down'}"${i === l.items.length - 1 ? ' aria-disabled="true"' : ''}>↓</button><button type="button" data-arm="${i}" aria-label="${ar ? 'إزالة' : 'Remove'}">✕</button></span></div>
          <textarea class="agnote" data-anote="${i}" rows="1" placeholder="${ar ? 'ملاحظاتك للحديث…' : 'Your talking points…'}">${esc(it.note || '')}</textarea>
          <button type="button" class="agmore" data-adet="${i}" aria-expanded="${openSet.has(idOf(it))}">${openSet.has(idOf(it)) ? (ar ? 'إخفاء التفاصيل ▴' : 'Hide details ▴') : (ar ? 'عرض التفاصيل ▾' : 'Show details ▾')}</button>
          ${openSet.has(idOf(it)) ? `<div class="agdet">${detailHTML(it, lang)}<div class="agdfoot"><button type="button" data-apresent="${i}">${ar ? 'اعرض من هنا' : 'Present from here'}</button><button type="button" data-aopen="${i}">${ar ? 'افتح صفحته' : 'Open its page'}</button><button type="button" data-adet="${i}">${ar ? 'إخفاء التفاصيل ▴' : 'Hide details ▴'}</button></div></div>` : ''}</li>`;
      }).join('')}</ol>`;
      const nc = l.items.filter(it => it.t === 'star' && cmp.has(idOf(it)));
      h += `<div class="agbar"><button type="button" data-aact="start" class="agstart">${ar ? 'ابدأ العرض من الأول' : 'Start presenting from item 1'}</button>${l.items.some(it => it.t === 'star') ? `<span class="muted" style="font-size:15px">${nc.length >= 2 ? (ar ? `المقارنة: ${nc.length} نجوم` : `Comparing ${nc.length} stars`) : (ar ? 'اختر نجمين أو أكثر بخانة «قارن» لمقارنتها.' : 'Tick Compare on two or more stars to compare them.')}</span>` : ''}</div>`;
      if (nc.length >= 2) h += compareHTML(nc, lang);
    }
    h += `<p class="vref" style="white-space:normal;margin-top:16px">${ar ? 'تُحفظ قوائمك في هذا المتصفح على جهازك فقط. لنقلها إلى جهاز آخر استعمل «انسخ رابط القائمة» وافتح الرابط هناك.' : 'Your lists are kept in this browser on this device only. To move a list to another device, use Copy list link and open the link there.'}</p>`;
    return h + `</div>`;
  }
  function shareLink(l) {
    const data = {n: l.name, i: l.items.map(({t, key, ref, cul, note}) => ({t, key, ref, cul, note}))};
    const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(data)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return location.href.split('#')[0] + '#ag=' + b64;
  }
  function importFromHash() {
    const h = location.hash; if (!h.startsWith('#ag=')) return false;
    try {
      let b = h.slice(4).replace(/-/g, '+').replace(/_/g, '/'); while (b.length % 4) b += '=';
      const d = JSON.parse(decodeURIComponent(escape(atob(b))));
      const items = (d.i || []).filter(it => it && TYPES[it.t] && typeof it.key === 'string').slice(0, 200).map(it => ({t: it.t, key: it.key, ref: it.ref || '', cul: it.cul || '', note: String(it.note || '').slice(0, 2000)}));
      const l = {id: uid(), name: (String(d.n || '').slice(0, 40) || (state.lang === 'ar' ? 'قائمتي' : 'My list')) + (state.lang === 'ar' ? ' (مشاركة)' : ' (shared)'), items};
      S.lists.push(l); S.active = l.id; save(); state.cul = 'guide';
      try { history.replaceState(null, '', '#guide'); } catch (e) {}
      return true;
    } catch (e) { return false; }
  }
  function bindGuide(card) {
    const l = active(), ar = state.lang === 'ar', re = () => render();
    card.querySelectorAll('[data-al]').forEach(b => b.addEventListener('click', () => { S.active = b.dataset.al; cmp.clear(); openSet.clear(); pres = null; renaming = false; confirmDel = false; save(); re(); }));
    const nb = card.querySelector('[data-anew]'); if (nb) nb.addEventListener('click', () => { const name = prompt(ar ? 'اسم القائمة الجديدة' : 'Name for the new list', ar ? 'جولة الليلة' : "Tonight's tour"); if (name === null) return; const x = {id: uid(), name: name.trim().slice(0, 40), items: []}; S.lists.push(x); S.active = x.id; save(); re(); });
    card.querySelectorAll('[data-aact]').forEach(b => b.addEventListener('click', () => {
      const a = b.dataset.aact;
      if (a === 'rename') { renaming = true; re(); const i = document.getElementById('agname'); if (i) i.focus(); }
      else if (a === 'rsave') { l.name = (document.getElementById('agname').value || '').trim().slice(0, 40); renaming = false; save(); re(); }
      else if (a === 'del') { if (!confirmDel) { confirmDel = true; re(); return; } confirmDel = false; S.lists = S.lists.filter(x => x.id !== l.id); if (!S.lists.length) S.lists = [{id: uid(), name: '', items: []}]; S.active = S.lists[0].id; save(); re(); }
      else if (a === 'copy') { const link = shareLink(l); (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(link) : Promise.reject()).then(() => toast(ar ? 'نُسخ الرابط' : 'Link copied'), () => { prompt(ar ? 'انسخ هذا الرابط' : 'Copy this link', link); }); }
      else if (a === 'start' && l.items.length) { pres = {list: l.id, i: 0}; re(); presTop(); }
    }));
    const ni = document.getElementById('agname'); if (ni) ni.addEventListener('keydown', ev => { if (ev.key === 'Enter') { l.name = ni.value.trim().slice(0, 40); renaming = false; save(); re(); } });
    card.querySelectorAll('[data-aopen]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.aopen; pres = null; open(l.items[i], l.id, i); }));
    card.querySelectorAll('[data-adet]').forEach(b => b.addEventListener('click', () => { const it = l.items[+b.dataset.adet], id = idOf(it), was = openSet.has(id); if (was) openSet.delete(id); else openSet.add(id); re(); const li = card.querySelectorAll('.agi')[+b.dataset.adet]; if (li && was && li.getBoundingClientRect().top < 0) li.scrollIntoView({block: 'start'}); }));
    card.querySelectorAll('[data-apresent]').forEach(b => b.addEventListener('click', () => { pres = {list: l.id, i: +b.dataset.apresent}; re(); presTop(); }));
    card.querySelectorAll('[data-apres]').forEach(b => b.addEventListener('click', () => { const a = b.dataset.apres; if (a === 'prev') presGo(-1); else if (a === 'next') presGo(1); else { const i = pres ? pres.i : 0; pres = null; re(); const li = card.querySelectorAll('.agi')[i]; if (li) li.scrollIntoView({block: 'center'}); } }));
    const mv = (i, d) => { const j = i + d; if (j < 0 || j >= l.items.length) return; [l.items[i], l.items[j]] = [l.items[j], l.items[i]]; save(); re(); };
    card.querySelectorAll('[data-aup]').forEach(b => b.addEventListener('click', () => mv(+b.dataset.aup, -1)));
    card.querySelectorAll('[data-adown]').forEach(b => b.addEventListener('click', () => mv(+b.dataset.adown, 1)));
    card.querySelectorAll('[data-arm]').forEach(b => b.addEventListener('click', () => { openSet.delete(idOf(l.items[+b.dataset.arm])); l.items.splice(+b.dataset.arm, 1); save(); re(); }));
    card.querySelectorAll('[data-acmp]').forEach(c => c.addEventListener('change', () => { const id = idOf(l.items[+c.dataset.acmp]); if (c.checked) cmp.add(id); else cmp.delete(id); re(); }));
    card.querySelectorAll('[data-anote]').forEach(t => {
      const fit = () => { t.style.height = 'auto'; t.style.height = (t.scrollHeight + 2) + 'px'; }; fit();
      t.addEventListener('input', () => { l.items[+t.dataset.anote].note = t.value.slice(0, 2000); fit(); clearTimeout(t._h); t._h = setTimeout(save, 300); });
    });
  }
  load();
  function newList(name, items) { const l = {id: uid(), name: String(name).slice(0, 60), items: items.slice()}; S.lists.push(l); S.active = l.id; save(); return l; }
  return {btn, info, guideHTML, bindGuide, navBar, bindNav, updateCount, importFromHash, total, detail: detailHTML, lore: loreHTML, chart: chartFig, newList};
})();


