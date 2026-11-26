/* ---------- Search everything: one box in the top bar that finds constellations, stars, deep-sky objects,
   stories, planets and moons, Cosmology topics, glossary words and the site's pages ---------- */
const SEARCH = (() => {
  let idx = null, el = null, back = null, timer = 0;
  const norm = t => DSOS.norm(t);
  const G = {page: ['Pages', 'الصفحات'], con: ['Constellations', 'الكوكبات'], star: ['Stars', 'النجوم'], dso: ['Deep-sky objects', 'الأجرام العميقة'], sol: ['Planets and moons', 'الكواكب والأقمار'],
    cos: ['Cosmology', 'علم الكون'], glo: ['Glossary', 'المسرد'], story: ['Stories', 'القصص']};
  // after a page is drawn, open the folds around one thing on it and bring it into view
  function focus(sel, test) {
    let n = 0; const go = () => { const all = [...document.querySelectorAll('#card ' + sel)], t = test ? all.find(test) : all[0];
      if (!t) { if (++n < 10) setTimeout(go, 60); return; }
      let d = t.closest('details'); while (d) { d.open = true; d = d.parentElement && d.parentElement.closest('details'); }
      if (t.matches('details')) t.open = true;
      requestAnimationFrame(() => { t.scrollIntoView({block: t.getBoundingClientRect().height > innerHeight * 0.55 ? 'start' : 'center', behavior: 'instant'}); t.classList.remove('flash'); void t.offsetWidth; t.classList.add('flash'); }); };
    setTimeout(go, 30);
  }
  const open = (con, cul) => { state.con = con; setCulture(cul); window.scrollTo({top: 0}); };
  const sumText = d => (d.querySelector('summary .df-t') || {}).textContent || '';
  function build() {
    const out = [], add = (g, en, ar, subEn, subAr, hay, go) => out.push({g, en, ar, subEn, subAr, k: norm(en + ' ' + ar), hay: norm(hay || ''), go});
    // pages
    [['astro', 'AstroGuide', 'المرشد الفلكي'], ['guide', 'My night', 'ليلتي'], ['plan', 'Plan a night', 'خطّط لليلتك'], ['calendar', 'Sky calendar', 'تقويم السماء'], ['quiz', 'Quiz', 'اختبر معلوماتك'], ['learn', 'For guides', 'للمرشدين']]
      .forEach(([id, en, ar]) => add('page', en, ar, 'AstroGuide', 'المرشد الفلكي', '', () => setCulture(id)));
    [['SCI', 'Science overview', 'العلم: نظرة عامة'], ['SOL', 'Solar System', 'المجموعة الشمسية'], ['STAR', 'Why stars shine', 'لماذا تضيء النجوم'], ['DSO', 'Deep sky', 'الأجرام العميقة'], ['COS', 'Cosmology', 'علم الكون']]
      .forEach(([k, en, ar]) => add('page', en, ar, 'Science', 'العلم', '', () => open(k, 'science')));
    CULTURES.forEach(c => add('page', c.name + ' sky', CUL_AR_SKY[c.id], 'Heritage & Culture', 'التراث والثقافة', c.id, () => open('CUL', c.id)));
    // constellations, their stars and objects, and the stories told about them
    DATA.constellations.filter(c => !c.hidden && c.key !== 'QUR').forEach(c => {
      const lo = DATA.lore[c.key] || {}, curs = CULTURES.filter(x => lo[x.id]);
      add('con', c.latin, c.ar, c.gloss, c.gloss, c.key + ' ' + c.gloss, () => { const s = secOf(state.cul); open(c.key, s === 'culture' && lo[state.cul] ? state.cul : DATA.sci[c.key] ? 'science' : (curs[0] || {}).id || 'science'); });
      curs.forEach(cu => { const e = lo[cu.id], ea = e.ar || e; (e.stories || []).forEach((st, i) => { const sa = (ea.stories || [])[i] || st;
        add('story', plainText(st.title), plainText(sa.title), `${c.latin} · ${cu.name}`, `${c.ar} · ${CUL_AR_SKY[cu.id]}`, c.latin + ' ' + c.ar, () => open(c.key, cu.id)); }); });
      const sc = DATA.sci[c.key]; if (!sc || !sc.parts) return;
      sc.parts.forEach(p => {
        p.stars.forEach(s => add('star', s.name, DATA.starAr[s.name] || s.name, `${s.bayer || ''} · ${c.latin}`, `${c.ar}`, s.bayer, () => { open(c.key, 'science'); focus('.starc', x => x.dataset.star === s.name); }));
        p.dsos.forEach(d => add('dso', d.name || d.cat, d.name || d.cat, `${d.cat || ''} · ${c.latin}`, `${d.cat || ''} · ${c.ar}`, [d.id, d.cat, ...(DSO_ALIAS[d.id] || [])].join(' ') + ' ' + d.id.replace(/^([A-Z]+)0+/, '$1'), () => { open(c.key, 'science'); focus('[data-dso]', x => x.dataset.dso === d.id); }));
      });
    });
    // planets and their moons
    (DATA.sci.SOL.bodies || []).forEach(b => {
      add('sol', b.en, b.ar, 'Solar System', 'المجموعة الشمسية', b.id, () => { open('SOL', 'science'); focus('.plfold', x => !!x.querySelector(`[data-planet="${b.id}"]`)); });
      (MOONS[b.id] || []).forEach(m => add('sol', m.en, m.ar, `Moon of ${b.en}`, `قمر ${b.ar}`, b.en + ' ' + b.ar, () => { open('SOL', 'science'); focus('.moonf', x => x.closest('.plfold') && x.closest('.plfold').querySelector(`[data-planet="${b.id}"]`) && (x.querySelector('.m-n') || {}).textContent.indexOf(state.lang === 'ar' ? m.ar : m.en) === 0); }));
    });
    // Cosmology topics, and the glossary
    COS_PARTS.forEach(p => p.groups.forEach(g => g.items.forEach(it => add('cos', it.en, it.ar, p.en, p.ar, plainText(it.t) + ' ' + plainText(it.a) + ' ' + g.en + ' ' + g.ar, () => {
      COS_PART = p.id; open('COS', 'science'); focus('.cosfold', x => sumText(x) === (state.lang === 'ar' ? it.ar : it.en)); }))));
    (typeof COS_GLOSSARY !== 'undefined' ? COS_GLOSSARY : []).forEach(w => add('glo', w.en, w.ar, 'Cosmology glossary', 'مسرد علم الكون', w.d + ' ' + w.da, () => {
      COS_PART = 'glo'; open('COS', 'science'); focus('.glo-row', x => x.dataset.w === w.en); }));
    return out;
  }
  function find(q) {
    if (!idx) idx = build();
    const t = norm(q); if (!t) return [];
    const toks = t.split(' ');
    const hits = [];
    idx.forEach(e => {
      const k = e.k, all = k + ' ' + e.hay;
      if (!toks.every(x => all.includes(x))) return;
      const en = norm(e.en), ar = norm(e.ar);
      const score = en === t || ar === t ? -1 : en.startsWith(t) || ar.startsWith(t) ? 0 : k.split(' ').some(w => w.startsWith(t)) ? 0.5 : k.includes(t) ? 1 : toks.every(x => k.includes(x)) ? 2 : 3;
      hits.push({e, score});
    });
    return hits.sort((a, b) => a.score - b.score || a.e.en.length - b.e.en.length);
  }
  function draw(q) {
    const ar = state.lang === 'ar', box = el.querySelector('.gs-res'), hits = find(q);
    if (!norm(q)) { box.innerHTML = `<p class="gs-hint">${ar ? 'ابحث عن كوكبة أو نجم أو جرم أو قصة أو كوكب أو قمر أو موضوع في علم الكون. مثل: الجبار، سهيل، M31، تيتان، المادة المظلمة.' : 'Find a constellation, star, deep-sky object, story, planet, moon or Cosmology topic. For example: Orion, Canopus, M31, Titan, dark matter.'}</p>`; return; }
    if (!hits.length) { box.innerHTML = `<p class="gs-hint">${ar ? 'لا توجد نتائج. جرّب كلمة أخرى أو الاسم بالإنجليزية.' : 'Nothing found. Try another word, or the Arabic name.'}</p>`; return; }
    const by = {}; hits.forEach(h => (by[h.e.g] = by[h.e.g] || []).push(h.e));
    let html = '', n = 0; const list = [];
    // groups with the closest matches come first
    const best = g => Math.min(...hits.filter(h => h.e.g === g).map(h => h.score));
    Object.keys(G).filter(g => by[g]).sort((a, b) => best(a) - best(b)).forEach(g => { const l = by[g];
      html += `<div class="gs-g"><div class="gs-gh">${G[g][ar ? 1 : 0]} <span>${l.length}</span></div>`;
      l.slice(0, g === 'story' || g === 'cos' ? 6 : 8).forEach(e => { list.push(e); html += `<button type="button" class="gs-hit" data-i="${list.length - 1}"><b>${esc(ar ? e.ar : e.en)}</b>${ar && e.ar !== e.en && /[a-z]/i.test(e.en) ? ` <span class="gs-alt">${esc(e.en)}</span>` : !ar && e.ar && e.ar !== e.en ? ` <span class="gs-alt" lang="ar">${esc(e.ar)}</span>` : ''}<span class="gs-sub">${esc(ar ? e.subAr : e.subEn)}</span></button>`; n++; });
      if (l.length > 8) html += `<p class="gs-more">${ar ? `و${l.length - 8} أخرى، أضف كلمة لتضييق البحث` : `and ${l.length - 8} more: add a word to narrow it down`}</p>`;
      html += `</div>`; });
    box.innerHTML = html;
    box.querySelectorAll('.gs-hit').forEach(b => b.addEventListener('click', () => { const e = list[+b.dataset.i]; hide(true); e.go(); }));
  }
  function key(ev) {
    if (ev.key === 'Escape') { hide(); return; }
    if (ev.key === 'Enter' && ev.target.matches('.gs-in')) { const f = el.querySelector('.gs-hit'); if (f) f.click(); }
    if ((ev.key === 'ArrowDown' || ev.key === 'ArrowUp') && el) { const hs = [...el.querySelectorAll('.gs-hit, .gs-in')], i = hs.indexOf(document.activeElement); if (i < 0) return; ev.preventDefault(); const nx = hs[(i + (ev.key === 'ArrowDown' ? 1 : -1) + hs.length) % hs.length]; nx.focus(); }
  }
  function show() {
    if (el) return; back = document.activeElement; const ar = state.lang === 'ar';
    el = document.createElement('div'); el.className = 'gsearch'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', ar ? 'البحث' : 'Search');
    el.innerHTML = `<div class="gs-box"${ar ? ' dir="rtl" lang="ar"' : ''}><div class="gs-top"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
      <input class="gs-in" type="search" autocomplete="off" spellcheck="false" enterkeyhint="search" aria-label="${ar ? 'ابحث في الموقع كله' : 'Search the whole site'}" placeholder="${ar ? 'ابحث في الموقع كله' : 'Search the whole site'}">
      <button type="button" class="gs-x">${ar ? 'إغلاق' : 'Close'}</button></div><div class="gs-res" aria-live="polite"></div></div>`;
    document.body.appendChild(el); document.documentElement.classList.add('gs-open');
    const inp = el.querySelector('.gs-in');
    inp.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => draw(inp.value), 90); });
    el.querySelector('.gs-x').addEventListener('click', () => hide());
    el.addEventListener('click', ev => { if (ev.target === el) hide(); });
    document.addEventListener('keydown', key);
    draw(''); inp.focus();
  }
  function hide(went) {
    if (!el) return; el.remove(); el = null; document.documentElement.classList.remove('gs-open'); document.removeEventListener('keydown', key);
    if (!went && back && back.focus) back.focus({preventScroll: true});
  }
  // the words change with the language, so build the list again next time
  // jump straight to a star or deep-sky object card (used by "Tonight" on the AstroGuide page); false if it has no card
  function goTo(kind, ref) {
    const key = Object.keys(DATA.sci).find(k => (DATA.sci[k].parts || []).some(p => kind === 'star' ? p.stars.some(x => x.name === ref) : (p.dsos || []).some(x => x.id === ref)));
    if (!key) return false;
    open(key, 'science'); if (kind === 'star') focus('.starc', x => x.dataset.star === ref); else focus('[data-dso]', x => x.dataset.dso === ref);
    return true;
  }
  return {show, goTo, cosTopic: n => focus('.cosfold', x => [...document.querySelectorAll('#card .cosfold')].indexOf(x) === n)};
})();
