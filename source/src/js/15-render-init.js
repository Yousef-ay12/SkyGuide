function render() {
  writeHash();
  setTimeout(() => RET.sync(), 0);
  { const fp = document.getElementById('feedback'); if (fp && !fp.hidden) fbRender(); }
  document.querySelector('.layout').classList.toggle('cal-mode', TOOL_TABS.has(state.cul) || (state.cul === 'science' && SCI_SPECIAL.has(state.con)) || state.con === 'CUL');
  if (state.cul === 'astro') { const card = document.getElementById('card'); card.style.setProperty('--cc', 'var(--accent)'); card.innerHTML = astroHubHTML(state.lang === 'ar' ? 'ar' : 'en'); return; }
  if (state.con === 'CUL' && secOf(state.cul) === 'culture') { const card = document.getElementById('card'); card.style.setProperty('--cc', `var(--c-${state.cul})`); card.innerHTML = culHubHTML(state.cul, state.lang === 'ar' ? 'ar' : 'en'); return; }
  if (state.cul === 'science' && state.con === 'SCI') { const card = document.getElementById('card'); card.style.setProperty('--cc', 'var(--c-science)'); card.innerHTML = sciHubHTML(state.lang === 'ar' ? 'ar' : 'en'); return; }
  if (state.cul === 'plan') { PLAN.render(); return; }
  if (state.cul === 'learn') { GUIDES.render(); return; }
  if (state.cul === 'quiz') { QUIZ.render(); return; }
  if (state.cul === 'guide') {
    const card = document.getElementById('card'), ar = state.lang === 'ar';
    card.style.setProperty('--cc', '#e9a23b');
    let h = `<div class="card-head"><div><div class="eyebrow"><span class="dot"></span>${ar ? '✦ ليلتي' : '✦ My night'}</div><h2${ar ? ' lang="ar" style="font-family:var(--f-ar)"' : ''}>${ar ? 'كل ما جمعته لليلتك' : 'Everything you gathered for your night'}</h2></div></div>`;
    h += AG.guideHTML(ar ? 'ar' : 'en');
    card.innerHTML = h;
    AG.bindGuide(card);
    return;
  }
  if (state.cul === 'calendar') {
    const card = document.getElementById('card'), ar = state.lang === 'ar';
    card.style.setProperty('--cc', 'var(--c-cal)');
    let h = `<div class="card-head"><div><div class="eyebrow"><span class="dot"></span>${ar ? 'تقويم السماء' : 'Sky calendar'}</div><h2${ar ? ' lang="ar" style="font-family:var(--f-ar)"' : ''}>${ar ? 'متى ترى النجوم والكواكب' : 'When to see the stars and planets'}</h2></div></div>`;
    h += calHTML(ar ? 'ar' : 'en');
    card.innerHTML = h;
    calBind(card);
    return;
  }
  const c = byKey[state.con], e = (DATA.lore[state.con] || {})[state.cul];
  document.getElementById('curName').textContent = c.latin;
  markList();
  const card = document.getElementById('card');
  card.style.setProperty('--cc', `var(--c-${state.cul})`);
  card.style.animation = 'none'; void card.offsetWidth; card.style.animation = '';
  let h = `<div class="card-head"><div><div class="eyebrow"><span class="dot"></span>${state.cul === 'science' ? (state.lang === 'ar' ? 'العلم' : 'Science') : state.lang === 'ar' ? CUL_AR_SKY[state.cul] : cname(state.cul) + ' sky'}</div><h2>${esc(c.latin)}</h2><div class="gls"${state.lang === 'ar' && c.glossAr ? ' lang="ar" dir="rtl" style="font-family:var(--f-ar)"' : ''}>${esc(state.lang === 'ar' && c.glossAr ? c.glossAr : c.gloss)}</div></div><div><div class="arn" lang="ar">${esc(c.ar)}</div>${!ARAB_SRC.has(state.con) ? `<div class="hb-row">${AG.btn({t: 'con', key: state.con, cul: state.cul}, state.lang)}${(() => { const k = swConName(state.con); return k ? swBtn(k.name, k.fov, state.lang === 'ar' ? 'ar' : 'en') + PSKY.btn(state.con, state.lang === 'ar' ? 'ar' : 'en') : ''; })()}${SHARE.btn(state.con + '-' + state.cul, state.cul === 'science' ? c.latin : (state.lang === 'ar' ? c.ar + ' · ' + CUL_AR_SKY[state.cul] : c.latin + ' · ' + cname(state.cul) + ' sky'), state.lang)}</div>` : ''}</div></div>`;
  h = AG.navBar(state.lang === 'af' ? 'en' : state.lang) + h;
  const L = state.lang;
  const chart = DATA.charts[state.con];
  const pos = state.cul === 'science' ? null : (POS.pos[state.con] || {})[state.cul];
  const vlang = (L === 'af' && state.cul !== 'safrica') ? 'en' : L;
  const flip = pos && pos.face === 'N' && !pos.never;
  if (chart) {
    const cap = {
      en: flip ? `Turned the way it looked from ${POS.cult[state.cul].place}: people there faced north to see it, so it appears upside down compared with a northern star map.` : 'Star chart from real star positions, oriented as seen facing south with the horizon at the bottom. Lines show the modern constellation figure.',
      ar: flip ? `مقلوبة كما كانت تُرى من ${POS.cult[state.cul].place_ar}: كان الناس هناك ينظرون نحو الشمال ليروها، فتبدو مقلوبة مقارنة بخرائط النجوم الشمالية.` : 'خريطة من مواقع النجوم الحقيقية، كما تُرى عند النظر نحو الجنوب والأفق في الأسفل. الخطوط تُظهر شكل الكوكبة الحديث.',
      af: flip ? `Gedraai soos dit van ${POS.cult[state.cul].place_af} af gelyk het: mense daar moes noord kyk om dit te sien, so dit lyk onderstebo in vergelyking met 'n noordelike sterrekaart.` : "Sterrekaart volgens werklike sterposisies, soos gesien as jy suid kyk met die horison onder. Die lyne wys die moderne vorm van die sterrebeeld."
    }[vlang];
    h += `<figure class="chart${flip ? ' flip' : ''}">${chart}<figcaption${vlang === 'ar' ? ' dir="rtl" lang="ar" class="rtl"' : ''}>${esc(cap)}</figcaption></figure>`;
  }
  if (pos) h += skyPanel(pos, vlang, c);
  // the in-card language switch: only on South African pages that have Afrikaans, which the top EN / عربي switch does not offer
  const langBtns = (opts, act = L) => opts.length < 3 ? '' : `<div class="langs" role="group" aria-label="Language">${opts.map(([id, lbl]) => `<button type="button" data-lang="${id}" aria-pressed="${act === id}"${id === 'ar' ? ' lang="ar"' : ''}>${lbl}</button>`).join('')}</div>`;
  if (state.cul === 'science') {
    const ar = L === 'ar';
    h += kidBtn();
    h += sciHTML(state.con, ar ? 'ar' : 'en');
    const others = CULTURES.filter(cu => (DATA.lore[state.con] || {})[cu.id]);
    if (others.length) h += `<div class="none-box" style="margin-top:22px"><span class="sect-lbl">${ar ? 'قصص هذه النجوم' : 'Stories about these stars'}</span><div class="links">${others.map(cu => `<button type="button" data-cul="${cu.id}" style="--cc:var(--c-${cu.id})"><span class="dot"></span>${culLbl(cu)}</button>`).join('')}</div></div>`;
  } else if (e && e.quranGroups) {
    const ar = L === 'ar';
    h += ar ? `<p class="rtl" lang="ar" dir="rtl" style="max-width:68ch;margin:0 0 6px">آيات من القرآن الكريم تتعلّق بالفلك: البروج والشمس والقمر ومنازله والكواكب والنجوم وأفلاكها، مرتّبة بحسب الموضوع. النص برواية حفص (نسخة تنزيل)، مع تعليقات موجزة من كتب التفسير.</p><div class="qbox rtl" dir="rtl" lang="ar">`
             : `<p style="max-width:68ch;margin:0 0 6px">Verses of the Quran about astronomy: the constellations, the Sun, the Moon and its stations, the planets, the stars and their orbits, grouped by theme. The Arabic is the standard Hafs reading (Tanzil edition). The English is a translation of the meaning, with short notes from the classical commentaries.</p><div class="qbox">`;
    e.quranGroups.forEach(g => {
      h += `<section class="qgroup"><h3>${esc(ar ? g.titleAr : g.title)}</h3><p>${esc(ar ? g.introAr : g.intro)}</p>`;
      g.verses.forEach(v => { h += versHTML(v, ar); });
      h += `</section>`;
    });
    h += `</div>`;
  } else if (e && e.poemGroups) {
    h += poeHTML(e, L === 'ar');
  } else if (e) {
    const hasAf = state.cul === 'safrica' && e.af;
    const opts = [['en', 'English'], ['ar', 'العربية']]; if (hasAf) opts.splice(1, 0, ['af', 'Afrikaans']);
    let lang = L; if (lang === 'af' && !hasAf) lang = 'en'; if (lang === 'ar' && !e.ar) lang = 'en';
    h += langBtns(opts, lang);
    const src = lang === 'af' ? e.af : lang === 'ar' ? e.ar : e;
    const stories = src.stories.map((s, i) => ({...s, source: e.stories[i].source}));
    const lbl = {en: 'What they saw', af: 'Wat hulle gesien het', ar: 'ماذا رأوا'}[lang];
    const srcl = {en: 'Source', af: 'Bron', ar: 'المصدر'}[lang];
    h += `<div class="lore${lang === 'ar' ? ' rtl' : ''}"${lang === 'ar' ? ' dir="rtl" lang="ar"' : lang === 'af' ? ' lang="af"' : ''} style="--srcl:'${srcl} · '">`;
    h += `<div class="seen"><span class="lbl">${lbl}</span><p>${src.seen}</p></div>`;
    stories.forEach(s => { h += `<article class="story"><h3>${esc(s.title)}</h3><p>${s.text}</p><div class="src" dir="ltr" lang="en">${srcLinks(s.source)}</div></article>`; });
    if (e.quran) { h += `<div class="qbox"><span class="sect-lbl">${lang === 'ar' ? 'في القرآن الكريم' : 'In the Quran'}</span>`; e.quran.forEach(v => { h += versHTML(v, lang === 'ar'); }); h += `</div>`; }
    h += `</div>`;
    if (e.poem && e.poem.full) {
      h += poemFold(e.poem, lang === 'ar') + poemMeaning(state.con, lang === 'ar');
    } else if (e.poem) h += poemHTML(e.poem);
    const others = CULTURES.filter(cu => cu.id !== state.cul && (DATA.lore[state.con] || {})[cu.id]);
    h += `<div class="none-box" style="margin-top:22px"><span class="sect-lbl">${state.lang === 'ar' ? 'النجوم نفسها في ثقافات أخرى' : 'The same stars, other cultures'}</span><div class="links">${others.map(cu => `<button type="button" data-cul="${cu.id}" style="--cc:var(--c-${cu.id})"><span class="dot"></span>${culLbl(cu)}</button>`).join('')}${DATA.sci[state.con] ? `<button type="button" data-cul="science" style="--cc:var(--c-science)"><span class="dot"></span>${state.lang === 'ar' ? 'علم هذه النجوم' : 'The science of these stars'}</button>` : ''}</div></div>`;
  } else if (ARAB_SRC.has(state.con)) {
    const qur = state.con === 'QUR';
    h += `<div class="none-box"><p>${state.lang === 'ar' ? (qur ? 'يجمع هذا القسم آيات القرآن الكريم عن السماء، وهو ضمن سماء العرب.' : 'يجمع هذا القسم أشعار العرب في السماء وأنواءهم، وهو ضمن سماء العرب.') : (qur ? 'This section collects verses of the Quran about the sky. It belongs to the Arab sky.' : 'This section collects Arabic poems about the sky and the Arab star calendar. It belongs to the Arab sky.')}</p><div class="links"><button type="button" data-cul="arab" style="--cc:var(--c-arab)"><span class="dot"></span>${state.lang === 'ar' ? 'افتحه في سماء العرب' : 'Open it in the Arab sky'}</button></div></div>`;
  } else {
    const others = CULTURES.filter(cu => (DATA.lore[state.con] || {})[cu.id]);
    const withCul = DATA.constellations.filter(x => (DATA.lore[x.key] || {})[state.cul]);
    const sciBtn = DATA.sci[state.con] ? `<button type="button" data-cul="science" style="--cc:var(--c-science)"><span class="dot"></span>${state.lang === 'ar' ? 'علم هذه النجوم' : 'The science of these stars'}</button>` : '';
    h += `<div class="none-box"><p>${state.lang === 'ar' ? `لم تصلنا في المصادر المستعملة هنا قصة من ${CUL_AR_SKY[state.cul] || 'هذه الثقافة'} عن هذه النجوم. فقد جمعت ثقافات كثيرة النجوم في صور مختلفة تمامًا، فربما كانت هذه الرقعة من السماء جزءًا من صورة أخرى، أو لم تكن لها حكاية.` : `No ${cname(state.cul)} story for these stars has come down to us in the sources used here. Many cultures grouped the stars into completely different shapes, so the same patch of sky may have been part of another figure, or simply had no tale.`}</p>`;
    if (others.length || sciBtn) h += `<span class="sect-lbl" style="margin-top:16px">${others.length ? (state.lang === 'ar' ? `قصص ${esc(c.ar)} عند` : `Stories for ${esc(c.latin)} from`) : (state.lang === 'ar' ? 'لا توجد لهذه الكوكبة قصة في أي ثقافة هنا، لكن يمكنك قراءة علمها' : 'No culture here has a story for this constellation, but you can read its science')}</span><div class="links">${others.map(cu => `<button type="button" data-cul="${cu.id}" style="--cc:var(--c-${cu.id})"><span class="dot"></span>${culLbl(cu)}</button>`).join('')}${sciBtn}</div>`;
    h += `<span class="sect-lbl" style="margin-top:18px">${state.lang === 'ar' ? `كوكبات لها قصص في ${CUL_AR_SKY[state.cul] || ''}` : `${cname(state.cul)} stories exist for`}</span><div class="links">${withCul.map(x => `<button type="button" data-con="${x.key}" style="--cc:var(--c-${state.cul})"><span class="dot"></span>${esc(state.lang === 'ar' ? x.ar : x.latin)}</button>`).join('')}</div></div>`;
  }
  card.innerHTML = h;
  fitEyebrow(card);
  card.querySelectorAll('[data-cul]').forEach(b => b.addEventListener('click', () => setCulture(b.dataset.cul)));
  card.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => { state.lang = b.dataset.lang; try { localStorage.setItem('osms-lang', state.lang); } catch (e) {} render(); }));
  card.querySelectorAll('[data-con]').forEach(b => b.addEventListener('click', () => { state.con = b.dataset.con; render(); }));
  AG.bindNav(card);
  if (state.cul === 'science' && state.con === 'DSO') DSO_IMG.watch(card);
}

function applySkin(v) {
  if (v) document.documentElement.setAttribute('data-skin', v); else document.documentElement.removeAttribute('data-skin');
}
function init() {
  // the dark night-sky look is the default; anyone who picked a screen colour keeps it
  let sk = 'dark'; try { const v = localStorage.getItem('osms-skin'); if (v !== null) sk = v; } catch (e) {}
  applySkin(sk); const sel = document.getElementById('skin'); sel.value = sk;
  const skLbl = document.querySelector('label[for=skin]'), syncSk = () => { skLbl.hidden = !!document.documentElement.getAttribute('data-bg') && sel.value !== 'red'; };
  sel.addEventListener('change', () => { applySkin(sel.value); try { localStorage.setItem('osms-skin', sel.value); } catch (e) {} syncSk(); });
  let bg = ''; try { bg = localStorage.getItem('osms-bg') || ''; } catch (e) {}
  const bgs = document.getElementById('bgsel'), applyBg = v => { if (v) document.documentElement.setAttribute('data-bg', v); else document.documentElement.removeAttribute('data-bg'); };
  if (![...bgs.options].some(o => o.value === bg)) bg = ''; applyBg(bg); bgs.value = bg; syncSk();
  bgs.addEventListener('change', () => { applyBg(bgs.value); try { localStorage.setItem('osms-bg', bgs.value); } catch (e) {} syncSk(); });
  // no link to a page: open where this person left off last time
  const hadHash = location.hash.length > 1;
  if (!hadHash) { try { const l = localStorage.getItem('osms-last'); if (l && l[0] === '#') history.replaceState(null, '', l); } catch (e) {} }
  if (!AG.importFromHash()) readHash();
  if (!hasLore(state.con, state.cul)) state.con = firstFor(state.cul);
  buildNav();
  setTimeout(() => { try { TOUR.note(); } catch (e) {} try { APP.iosTip(); } catch (e) {} }, 1200);
  AG.updateCount();
  buildList();
  const total = Object.values(DATA.lore).reduce((n, v) => n + Object.keys(v).length, 0);
  const cnt = document.getElementById('count'); cnt.dataset.en = `88 constellations · ${CULTURES.length} cultures · ${total} stories · science`; cnt.dataset.ar = `88 كوكبة · ${CULTURES.length} ثقافات · ${total} قصة · علوم`; cnt.textContent = cnt.dataset[state.lang === 'ar' ? 'ar' : 'en']; chromeLang = null; applyChrome();
  document.getElementById('q').addEventListener('input', ev => buildList(ev.target.value));
  if (matchMedia('(max-width: 860px)').matches) document.getElementById('index').open = false;
  window.addEventListener('hashchange', () => { if (AG.importFromHash()) { render(); return; } if (readHash()) { if (!hasLore(state.con, state.cul)) state.con = firstFor(state.cul); buildList(document.getElementById('q').value); render(); } });
  render();
  WELCOME.first(hadHash);
}
init();
