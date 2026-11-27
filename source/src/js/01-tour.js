/* ---------- Guide: a step-by-step tour of the interface ---------- */
const TOUR = (() => {
  const STEPS = [
    {sel: '.ntabs', en: ['Three sections', 'Heritage & Culture for the star stories of seven cultures, Science for the facts, and AstroGuide for planning a night. On a phone they are in the bar at the bottom.'], ar: ['ثلاثة أقسام', '«التراث والثقافة» لقصص النجوم في سبع ثقافات، و«العلم» للحقائق، و«المرشد الفلكي» لتخطيط ليلة الرصد. وفي الهاتف تجدها في الشريط أسفل الشاشة.']},
    {sel: '#subnav', prep: 'story', en: ['Choose a culture', 'Pick whose stories to read: Arab, Greek, Chinese and the others. Cultures without a story for this constellation are greyed out.'], ar: ['اختر ثقافة', 'اختر قصص مَن تريد أن تقرأ: العرب أو الإغريق أو الصين وغيرهم. الثقافات التي ليس لها قصة لهذه الكوكبة رمادية.']},
    {sel: '#index', prep: 'story', en: ['The constellations', 'Every constellation, grouped by part of the sky. The coloured dots show which cultures have a story for it.'], ar: ['الكوكبات', 'كل الكوكبات مرتبة بحسب مناطق السماء، وتدل النقاط الملونة على الثقافات التي لها قصة عنها.']},
    {sel: '.search', prep: 'story', en: ['Search', 'Type an English or Arabic name, or a star such as Sirius or سهيل.'], ar: ['البحث', 'اكتب اسمًا بالعربية أو الإنجليزية، أو اسم نجم مثل سهيل أو Sirius.']},
    {sel: '#card .chart', prep: 'story', en: ['The star chart', 'Drawn from real star positions, with the figure this culture saw in the stars.'], ar: ['خريطة النجوم', 'مرسومة من مواقع النجوم الحقيقية، مع الشكل الذي رأته هذه الثقافة في النجوم.']},
    {sel: '#card .langs', prep: 'story', en: ['Language', 'Read in English or Arabic. The Southern African stories are in Afrikaans too.'], ar: ['اللغة', 'اقرأ بالعربية أو الإنجليزية، وقصص جنوب أفريقيا متوفرة بالأفريكانية أيضًا.']},
    {sel: '#card .story', prep: 'story', en: ['The stories', 'Each story, with its source underneath. Tap a source to open it.'], ar: ['القصص', 'كل قصة ومصدرها تحتها، واضغط على المصدر لفتحه.']},
    {sel: '#card .card-head .agsave', prep: 'story', en: ['Add to My night', 'Add this constellation, or any star, object or planet, to My night. Everything you add gathers in AstroGuide, ready for Plan a night.'], ar: ['أضف إلى ليلتي', 'أضف هذه الكوكبة، أو أي نجم أو جرم أو كوكب، إلى «ليلتي». كل ما تضيفه يجتمع في «المرشد الفلكي» جاهزًا لـ«خطّط لليلتك».']},
    {sel: '#card .card-head .swbtn', prep: 'story', en: ['View in Stellarium Web', 'See the real sky at this constellation, from the place and night you chose.'], ar: ['اعرضه في Stellarium Web', 'شاهد السماء الحقيقية عند هذه الكوكبة، من المكان والليلة اللذين اخترتهما.']},
    {sel: '.ntab[data-sec=science]', en: ['Science', 'Its pages: Constellations, with facts for all 88 and their stars; the Solar System, with every planet and its main moons; Why stars shine; Deep sky, with 232 nebulae, star clusters and galaxies with pictures; and Cosmology: the structure of the universe, gravitational waves, how galaxies live, and dark matter and dark energy.'], ar: ['العلم', 'صفحاته: «الكوكبات» بحقائق الثماني والثمانين كلها ونجومها؛ و«المجموعة الشمسية» بكل كوكب وأقماره الرئيسة؛ و«لماذا تضيء النجوم»؛ و«الأجرام العميقة» وفيها 232 سديمًا وعنقودًا ومجرة مع صورها؛ و«علم الكون»: بنية الكون، وموجات الجاذبية، وحياة المجرات، والمادة المظلمة والطاقة المظلمة.']},
    {sel: '#subnav', prep: 'astro', en: ['AstroGuide', 'My night, with everything you added; Plan a night, a step-by-step planner; the Sky calendar, with what you can see this month, the planets and the Moon; the Quiz; and For guides, a guide\'s toolkit on communication and equipment.'], ar: ['المرشد الفلكي', '«ليلتي» وفيها كل ما أضفته؛ و«خطّط لليلتك» خطوة بخطوة؛ و«تقويم السماء» بما تستطيع رؤيته هذا الشهر والكواكب والقمر؛ و«اختبر معلوماتك»؛ و«للمرشدين» وفيه أدوات المرشد في التواصل والمعدّات.']},
    {sel: '#srchbtn', en: ['Search', 'Find anything on the site: a constellation, star, galaxy, planet or moon, a story, a Cosmology topic or a glossary word, in English or Arabic. On a computer, press / to open it.'], ar: ['البحث', 'ابحث عن أي شيء في الموقع: كوكبة أو نجم أو مجرة أو كوكب أو قمر، أو قصة، أو موضوع في علم الكون، أو كلمة في المسرد، بالعربية أو الإنجليزية. على الحاسوب اضغط / لفتحه.']},
    {sel: '#setbtn', en: ['Settings', 'Background: 12 looks, from starry skies to desert night and star-chart paper. Choose Plain to show the Screen menu: light, dark and more; use Night red outside to keep your eyes used to the dark. Here too: this tour, Install app to add Sky Guide to your home screen so it works offline, and Save pictures for offline to keep every photo on your device.'], ar: ['الإعدادات', 'الخلفية: 12 شكلًا، من السماء المرصّعة بالنجوم إلى ليل الصحراء وورق خريطة النجوم. اختر «بسيطة» لتظهر قائمة الشاشة: فاتح وداكن وغيرهما، واستعمل «الأحمر الليلي» في الخارج ليبقى نظرك معتادًا على الظلام. وهنا أيضًا هذه الجولة، و«ثبّت التطبيق» لإضافة Sky Guide إلى شاشتك الرئيسية فيعمل دون إنترنت، و«احفظ الصور» لتبقى كل الصور على جهازك.']},
    {sel: '.srcrow', en: ['Sources, Credits, Feedback and Privacy', 'Where everything comes from, who made the site, a form to send your comments, and what the site does with your data.'], ar: ['المصادر والإعداد والملاحظات والخصوصية', 'مصادر كل ما في الموقع، ومن أعدّه، ونموذج لإرسال ملاحظاتك، وما يفعله الموقع ببياناتك.']},
  ];
  const UI = {en: {next: 'Next', back: 'Back', skip: 'Close', done: 'Finish', of: 'of', title: 'How to use'}, ar: {next: 'التالي', back: 'السابق', skip: 'إغلاق', done: 'إنهاء', of: 'من', title: 'طريقة الاستخدام'}};
  let i = 0, saved = null, root = null, hole = null, tip = null;
  const lang = () => state.lang === 'ar' ? 'ar' : 'en';
  function prep(st) {
    if (st.prep === 'astro' && secOf(state.cul) !== 'astro') setCulture(lastAstro || 'plan');
    if (st.prep === 'story') {
      if (tabOf(state.cul) !== 'stories' || !byKey[state.con] || byKey[state.con].hidden || ARAB_SRC.has(state.con) || !hasLore(state.con, state.cul)) { state.con = 'Ori'; setCulture(lastCul && hasLore('Ori', lastCul) ? lastCul : 'arab'); }
      if (window.matchMedia('(max-width: 900px)').matches) { const ix = document.getElementById('index'); if (ix && !ix.open && st.sel === '#index') ix.open = true; }
    }
  }
  function target(st) { const el = document.querySelector(st.sel); if (!el) return null; const r = el.getBoundingClientRect(); return r.width || r.height ? el : null; }
  function place() {
    if (!root) return;
    const st = STEPS[i], el = target(st), L = UI[lang()], T = st[lang()], phone = innerWidth < 640;
    tip.querySelector('.tt-n').textContent = `${i + 1} ${L.of} ${STEPS.length}`;
    tip.querySelector('.tt-h').textContent = T[0]; tip.querySelector('.tt-b').textContent = T[1];
    tip.querySelector('[data-t=back]').disabled = i === 0;
    tip.querySelector('[data-t=back]').textContent = (lang() === 'ar' ? '→ ' : '← ') + L.back;
    tip.querySelector('[data-t=next]').textContent = i === STEPS.length - 1 ? L.done : L.next + (lang() === 'ar' ? ' ←' : ' →');
    tip.querySelector('[data-t=close]').textContent = L.skip;
    tip.setAttribute('dir', lang() === 'ar' ? 'rtl' : 'ltr'); tip.setAttribute('lang', lang());
    if (!el) { hole.style.display = 'none'; if (phone) { tip.classList.remove('center', 'top'); tip.classList.add('sheet'); tip.style.left = tip.style.top = ''; } else tip.classList.add('center'); return; }
    hole.style.display = ''; tip.classList.remove('center');
    const r0 = el.getBoundingClientRect(), pad = 6, maxH = innerHeight * (phone ? 0.42 : 0.5);
    const r = {left: r0.left, right: r0.right, width: r0.width, top: r0.top, height: Math.min(r0.height, maxH)}; r.bottom = r.top + r.height;
    Object.assign(hole.style, {left: (r.left - pad) + 'px', top: (r.top - pad) + 'px', width: (r.width + 2 * pad) + 'px', height: (r.height + 2 * pad) + 'px'});
    tip.classList.toggle('sheet', phone);
    if (phone) { tip.style.left = tip.style.top = ''; tip.classList.toggle('top', r.bottom + pad > innerHeight - tip.offsetHeight - 16); return; }
    const tw = Math.min(360, innerWidth - 24), th = tip.offsetHeight || 170;
    let top = r.bottom + 14; if (top + th > innerHeight - 10) top = Math.max(10, r.top - th - 14);
    let left = Math.min(Math.max(12, r.left), innerWidth - tw - 12);
    Object.assign(tip.style, {left: left + 'px', top: top + 'px', width: tw + 'px'});
  }
  // scroll so the part being explained sits in the free space between the top bar and the tip (or the bottom bar)
  function reveal(el) {
    if (!el || el.closest('header.top, .mainnav')) return;
    const r = el.getBoundingClientRect(), hd = document.querySelector('header.top'), phone = innerWidth < 640;
    const top = (hd ? hd.getBoundingClientRect().bottom : 0) + 10;
    let bottom = innerHeight - 10;
    if (phone && tip && tip.classList.contains('sheet') && !tip.classList.contains('top')) bottom = Math.min(bottom, tip.getBoundingClientRect().top - 10);
    else { const nav = document.querySelector('.mainnav'); if (nav && getComputedStyle(nav).position === 'fixed') bottom = Math.min(bottom, nav.getBoundingClientRect().top - 10); }
    const room = Math.max(80, bottom - top);
    if (r.top >= top && r.top + Math.min(r.height, room) <= bottom) return;
    const want = r.height >= room ? top : top + (room - r.height) / 2;
    window.scrollTo(0, Math.max(0, scrollY + r.top - want));
  }
  let seq = 0;
  function show(n) {
    i = Math.max(0, Math.min(STEPS.length - 1, n));
    const st = STEPS[i]; prep(st);
    const el = target(st), my = ++seq;
    place(); reveal(el);
    // the page can still move as pictures and fonts arrive, so check again a moment later
    const again = () => { if (my !== seq || !root) return; const e = target(st); reveal(e); place(); };
    requestAnimationFrame(() => { place(); reveal(target(st)); place(); });
    setTimeout(again, 250); setTimeout(again, 800);
    const b = tip.querySelector('[data-t=next]'); if (b) b.focus({preventScroll: true});
  }
  function start() {
    if (root) return;
    saved = {cul: state.cul, con: state.con, y: scrollY};
    root = document.createElement('div'); root.className = 'tour'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', UI[lang()].title);
    root.innerHTML = `<div class="tt-hole"></div><div class="tt-tip"><div class="tt-n"></div><h3 class="tt-h"></h3><p class="tt-b"></p><div class="tt-bar"><button type="button" data-t="close" class="tt-link"></button><span></span><button type="button" data-t="back"></button><button type="button" data-t="next" class="main"></button></div></div>`;
    document.body.appendChild(root); hole = root.querySelector('.tt-hole'); tip = root.querySelector('.tt-tip');
    root.addEventListener('click', ev => { const b = ev.target.closest('[data-t]'); if (!b) return; const a = b.dataset.t;
      if (a === 'next') { if (i === STEPS.length - 1) end(); else show(i + 1); } else if (a === 'back') show(i - 1); else end(); });
    addEventListener('resize', place); addEventListener('scroll', place, {passive: true}); document.addEventListener('keydown', key);
    try { localStorage.setItem('osms-tour', 'seen'); } catch (e) {}
    const n = document.getElementById('tournote'); if (n) n.remove();
    show(0);
  }
  function key(ev) { if (!root) return; if (ev.key === 'Escape') end(); else if (ev.key === 'ArrowRight') show(i + (lang() === 'ar' ? -1 : 1)); else if (ev.key === 'ArrowLeft') show(i + (lang() === 'ar' ? 1 : -1)); }
  function end() {
    if (!root) return; root.remove(); root = null;
    removeEventListener('resize', place); removeEventListener('scroll', place); document.removeEventListener('keydown', key);
    if (saved) { if (saved.cul !== state.cul || saved.con !== state.con) { state.con = saved.con; setCulture(saved.cul); } window.scrollTo(0, saved.y); }
    const b = document.getElementById('tourbtn'); if (b) b.focus({preventScroll: true});
  }
  function note() {
    let seen = false; try { seen = !!localStorage.getItem('osms-tour'); } catch (e) { seen = true; }
    if (seen || document.getElementById('tournote') || (typeof WELCOME !== 'undefined' && WELCOME.open())) return;
    const ar = lang() === 'ar', n = document.createElement('div'); n.id = 'tournote'; n.className = 'tournote'; n.setAttribute('role', 'status'); n.setAttribute('dir', ar ? 'rtl' : 'ltr');
    n.innerHTML = ar ? `<b>جديد هنا؟</b><span>جولة قصيرة تعرّفك على الموقع.</span><div><button type="button" data-n="go" class="main">ابدأ الجولة</button><button type="button" data-n="no">لا، شكرًا</button></div>`
                     : `<b>New here?</b><span>Take a quick tour of how Sky Guide works.</span><div><button type="button" data-n="go" class="main">Start the tour</button><button type="button" data-n="no">No thanks</button></div>`;
    n.addEventListener('click', ev => { const b = ev.target.closest('[data-n]'); if (!b) return; try { localStorage.setItem('osms-tour', 'seen'); } catch (e) {} n.remove(); if (b.dataset.n === 'go') start(); });
    document.body.appendChild(n);
  }
  document.addEventListener('click', ev => { if (ev.target.closest && ev.target.closest('#tourbtn')) start(); });
  return {start, end, note};
})();

