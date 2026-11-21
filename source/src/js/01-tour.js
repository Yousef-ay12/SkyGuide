/* ---------- Guide: a step-by-step tour of the interface ---------- */
const TOUR = (() => {
  const STEPS = [
    {sel: '.ntabs', en: ['The sections', 'Stories, Science, Sky calendar, Plan a night, Quiz, Saved lists and For guides. Tap a tab to switch between them. On a phone, swipe the tabs to see them all.'], ar: ['الأقسام', 'القصص، والعلم، وتقويم السماء، وخطّط لليلتك، واختبر معلوماتك، والقوائم المحفوظة، وللمرشدين. اضغط على أي قسم للانتقال إليه، وفي الهاتف اسحب الأقسام لترى جميعها.']},
    {sel: '#nsub', prep: 'story', en: ['Choose a culture', 'Pick whose stories to read: Arab, Greek, Chinese and the others. Cultures without a story for this constellation are greyed out.'], ar: ['اختر ثقافة', 'اختر قصص مَن تريد أن تقرأ: العرب أو الإغريق أو الصين وغيرهم. الثقافات التي ليس لها قصة لهذه الكوكبة تظهر باهتة.']},
    {sel: '#index', prep: 'story', en: ['The constellations', 'Every constellation, grouped by part of the sky. The coloured dots show which cultures have a story for it.'], ar: ['الكوكبات', 'كل الكوكبات مرتبة بحسب مناطق السماء، وتدل النقاط الملونة على الثقافات التي لها قصة عنها.']},
    {sel: '.search', prep: 'story', en: ['Search', 'Type an English or Arabic name, or a star such as Sirius or سهيل.'], ar: ['البحث', 'اكتب اسمًا بالعربية أو الإنجليزية، أو اسم نجم مثل سهيل أو Sirius.']},
    {sel: '#card .chart', prep: 'story', en: ['The star chart', 'Drawn from real star positions, with the figure this culture saw in the stars.'], ar: ['خريطة النجوم', 'مرسومة من مواقع النجوم الحقيقية، مع الشكل الذي رأته هذه الثقافة في النجوم.']},
    {sel: '#card .langs', prep: 'story', en: ['Language', 'Read in English or Arabic. The Southern African stories are in Afrikaans too.'], ar: ['اللغة', 'اقرأ بالعربية أو الإنجليزية، وقصص جنوب أفريقيا متوفرة بالأفريكانية أيضًا.']},
    {sel: '#card .story', prep: 'story', en: ['The stories', 'Each story, with its source underneath. Tap a source to open it.'], ar: ['القصص', 'كل قصة ومصدرها تحتها، واضغط على المصدر لفتحه.']},
    {sel: '#card .card-head .agsave', prep: 'story', en: ['Save', 'Save this constellation, or any star, object or planet, to your Saved lists to come back to later.'], ar: ['احفظ', 'احفظ هذه الكوكبة، أو أي نجم أو جرم أو كوكب، في قوائمك المحفوظة للرجوع إليها لاحقًا.']},
    {sel: '#card .card-head .swbtn', prep: 'story', en: ['View in Stellarium Web', 'See the real sky at this constellation, from the place and night you chose.'], ar: ['اعرضه في Stellarium Web', 'شاهد السماء الحقيقية عند هذه الكوكبة، من المكان والليلة اللذين اخترتهما.']},
    {sel: '.ntab[data-tab=science]', en: ['Science', 'Facts for all 88 constellations and the Solar System: stars, distances and planets. After The Solar System comes Why stars shine, and at the end of the list Deep-sky objects has 232 nebulae, star clusters and galaxies with pictures, sorted by catalogue.'], ar: ['العلم', 'حقائق عن الكوكبات الثماني والثمانين والمجموعة الشمسية: النجوم والمسافات والكواكب. وبعد «المجموعة الشمسية» صفحة «لماذا تضيء النجوم؟»، وفي آخر القائمة قسم «الأجرام السماوية العميقة»، وفيه 232 سديمًا وعنقودًا ومجرة مع صورها، مرتبة حسب الفهارس.']},
    {sel: '.ntab[data-tab=calendar]', en: ['Sky calendar', 'What you can see from your place this month, the planets, the Moon, and a tour planner for guides.'], ar: ['تقويم السماء', 'ما تستطيع رؤيته من مكانك هذا الشهر، والكواكب، والقمر، ومخطط الجولات للمرشدين.']},
    {sel: '.ntab[data-tab=plan]', en: ['Plan a night', 'A step-by-step planner: choose a place and night, pick what is up, then read the science and the stories.'], ar: ['خطّط لليلتك', 'مخطط خطوة بخطوة: اختر المكان والليلة، ثم ما يظهر في السماء، ثم اقرأ العلم والقصص.']},
    {sel: '.ntab[data-tab=quiz]', en: ['Quiz', 'Test your knowledge: which constellation is this, how far and how big are the stars, the stories and the planets. Pick 5 to 20 questions.'], ar: ['اختبر معلوماتك', 'اختبر معلوماتك: ما هذه الكوكبة، وكم تبعد النجوم وما حجمها، والقصص والكواكب. اختر من 5 إلى 20 سؤالًا.']},
    {sel: '.ntab[data-tab=guide]', en: ['Saved lists', 'Everything you saved, in your own lists with notes. Compare stars and present a list one item at a time.'], ar: ['القوائم المحفوظة', 'كل ما حفظته في قوائمك مع ملاحظاتك، وقارن بين النجوم واعرض القائمة عنصرًا بعد عنصر.']},
    {sel: '.ntab[data-tab=learn]', en: ['For guides', 'A guide\'s toolkit: Communication 101 (how to talk about the sky so people listen and remember) and Astronomy equipment (every kind of telescope, cameras and smart telescopes).'], ar: ['للمرشدين', 'أدوات المرشد: «أساسيات التواصل» (كيف تتحدث عن السماء فيُصغي الناس ويتذكرون)، و«معدات الرصد الفلكي» (كل أنواع التلسكوبات والكاميرات والتلسكوبات الذكية).']},
    {sel: '#installbtn', en: ['Install app', 'Add Sky Guide to your home screen. You choose its icon first, then it opens like an app and works offline. On a computer this button appears when your browser can install it.'], ar: ['ثبّت التطبيق', 'أضف Sky Guide إلى شاشتك الرئيسية. تختار أيقونته أولًا، ثم يفتح مثل التطبيق ويعمل دون إنترنت. وعلى الحاسوب يظهر هذا الزر عندما يستطيع متصفحك تثبيته.']},
    {sel: '.skins', en: ['Background and screen', 'Background: 12 looks, from starry skies, aurora and nebula to desert night, dawn and star-chart paper. Choose Plain to show the Screen menu: light, dark and more. Use Night red outside: it keeps your eyes used to the dark.'], ar: ['الخلفية والشاشة', 'الخلفية: 12 شكلًا، من السماء المرصّعة بالنجوم والشفق القطبي والسديم إلى ليل الصحراء والفجر وورق خريطة النجوم. اختر «بسيطة» لتظهر قائمة الشاشة: فاتح أو داكن وغيرهما. استخدم «الأحمر الليلي» في الخارج، فهو يحافظ على تكيّف عينيك مع الظلام.']},
    {sel: '.srcrow', en: ['Sources, Credits, Feedback and Privacy', 'Where everything comes from, who made the site, a form to send your comments, and what the site does with your data.'], ar: ['المصادر والإعداد والملاحظات والخصوصية', 'مصادر كل ما في الموقع، ومن أعدّه، ونموذج لإرسال ملاحظاتك، وما يفعله الموقع ببياناتك.']},
  ];
  const UI = {en: {next: 'Next', back: 'Back', skip: 'Close', done: 'Finish', of: 'of', title: 'How to use'}, ar: {next: 'التالي', back: 'السابق', skip: 'إغلاق', done: 'إنهاء', of: 'من', title: 'طريقة الاستخدام'}};
  let i = 0, saved = null, root = null, hole = null, tip = null;
  const lang = () => state.lang === 'ar' ? 'ar' : 'en';
  function prep(st) {
    if (st.prep === 'story') {
      if (tabOf(state.cul) !== 'stories' || !byKey[state.con] || state.con === 'QUR' || !hasLore(state.con, state.cul)) { state.con = 'Ori'; setCulture(lastCul && hasLore('Ori', lastCul) ? lastCul : 'arab'); }
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
  function show(n) {
    i = Math.max(0, Math.min(STEPS.length - 1, n));
    const st = STEPS[i]; prep(st);
    const el = target(st);
    if (el) el.scrollIntoView({block: innerWidth < 640 || el.getBoundingClientRect().height > innerHeight * 0.5 ? 'start' : 'center', behavior: 'instant'});
    if (el && innerWidth >= 640 && el.getBoundingClientRect().height > innerHeight * 0.5) window.scrollBy(0, -20);
    if (el && innerWidth < 640) window.scrollBy(0, -16);
    requestAnimationFrame(() => { place(); setTimeout(place, 60); });
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
    if (seen || document.getElementById('tournote')) return;
    const ar = lang() === 'ar', n = document.createElement('div'); n.id = 'tournote'; n.className = 'tournote'; n.setAttribute('role', 'status'); n.setAttribute('dir', ar ? 'rtl' : 'ltr');
    n.innerHTML = ar ? `<b>جديد هنا؟</b><span>جولة قصيرة تعرّفك على الموقع.</span><div><button type="button" data-n="go" class="main">ابدأ الجولة</button><button type="button" data-n="no">لا، شكرًا</button></div>`
                     : `<b>New here?</b><span>Take a quick tour of how Sky Guide works.</span><div><button type="button" data-n="go" class="main">Start the tour</button><button type="button" data-n="no">No thanks</button></div>`;
    n.addEventListener('click', ev => { const b = ev.target.closest('[data-n]'); if (!b) return; try { localStorage.setItem('osms-tour', 'seen'); } catch (e) {} n.remove(); if (b.dataset.n === 'go') start(); });
    document.body.appendChild(n);
  }
  document.addEventListener('click', ev => { if (ev.target.closest && ev.target.closest('#tourbtn')) start(); });
  return {start, end, note};
})();

