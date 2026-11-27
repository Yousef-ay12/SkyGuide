/* ---------- Plan a night: a guided path (place and night -> pick -> science / stories) ---------- */
const PLAN = (() => {
  const RAD = Math.PI / 180;
  let P = {step: 1, order: 'sci', picks: [], cur: 0, cul: null, done: false};
  try { const x = JSON.parse(localStorage.getItem('osms-plan') || 'null'); if (x && typeof x === 'object') P = Object.assign(P, x, {done: false}); } catch (e) {}
  const keep = () => { try { localStorage.setItem('osms-plan', JSON.stringify(P)); } catch (e) {} };
  const TX = {
    en: {eyebrow: 'Plan a night', title: 'Step by step', s1: 'Place and night', s2: 'Pick', sci: 'Science', sto: 'Stories', back: 'Back', next: 'Next', finish: 'Finish',
         place: 'Place', date: 'Date', from: 'Tour starts', to: 'Tour ends', sky: 'Sky darkness', order: 'Show first', sciFirst: 'Science first', stoFirst: 'Stories first',
         moon: 'Moon', lit: 'lit', up: 'up during your tour', down: 'below the horizon during your tour', sunset: 'Sunset',
         pickIntro: 'These are above the horizon during your tour. Tap one or more, then press Next.', easy: 'easy for guests', cons: 'Constellations', planets: 'Planets',
         other: 'Something else? Add any constellation', choose: 'Choose…', none: 'Pick at least one thing to continue.', nothingUp: 'Nothing listed: try another time or date.',
         noStory: 'Planets have no constellation stories here. Press Next to continue.', storyFor: 'Choose a culture', of: 'of',
         doneT: 'All done', doneP: 'You have looked at everything you picked for this night.', saveAll: 'Save this night as a list', saved: 'Saved as a new list.', again: 'Plan another night', openAG: 'Open My night',
         hintCert: 'Set from this certified dark-sky place.', hintEst: 'Estimated from the size of the city; change it if you will be somewhere darker.', hintOwn: 'Your own choice.', nextPick: 'Next: ', leave: 'You can leave the steps at any time with the tabs above; your choices are kept.'},
    ar: {eyebrow: 'خطّط لليلتك', title: 'خطوة بخطوة', s1: 'المكان والليلة', s2: 'اختر', sci: 'العلم', sto: 'القصص', back: 'السابق', next: 'التالي', finish: 'إنهاء',
         place: 'المكان', date: 'التاريخ', from: 'بداية الجولة', to: 'نهاية الجولة', sky: 'ظلمة السماء', order: 'اعرض أولًا', sciFirst: 'العلم أولًا', stoFirst: 'القصص أولًا',
         moon: 'القمر', lit: 'مضاء', up: 'فوق الأفق في أثناء جولتك', down: 'تحت الأفق في أثناء جولتك', sunset: 'الغروب',
         pickIntro: 'هذه فوق الأفق في أثناء جولتك. اختر واحدًا أو أكثر، ثم اضغط «التالي».', easy: 'سهل على الزوار', cons: 'الكوكبات', planets: 'الكواكب',
         other: 'شيء آخر؟ أضف أي كوكبة', choose: 'اختر…', none: 'اختر شيئًا واحدًا على الأقل للمتابعة.', nothingUp: 'لا شيء هنا: جرّب وقتًا أو تاريخًا آخر.',
         noStory: 'لا توجد هنا قصص كوكبات للكواكب. اضغط «التالي» للمتابعة.', storyFor: 'اختر ثقافة', of: 'من',
         doneT: 'انتهيت', doneP: 'اطّلعت على كل ما اخترته لهذه الليلة.', saveAll: 'احفظ هذه الليلة قائمةً', saved: 'حُفظت قائمةً جديدة.', again: 'خطّط لليلة أخرى', openAG: 'افتح ليلتي',
         hintCert: 'مأخوذة من هذا الموقع المعتمد للسماء المظلمة.', hintEst: 'تقدير بحسب حجم المدينة؛ غيّرها إن كنت ستذهب إلى مكان أظلم.', hintOwn: 'اختيارك أنت.', nextPick: 'التالي: ', leave: 'يمكنك ترك الخطوات في أي وقت من الأزرار في الأعلى، وتبقى اختياراتك محفوظة.'}
  };
  const hm = s => { const [h, m] = String(s || '0:0').split(':').map(Number); return h + (m || 0) / 60; };
  function night() {
    calInit(); const st = CAL.st, pl = placeObj();
    const now = new Date(Date.now() + pl.tz * 36e5);
    let Y = now.getUTCFullYear(), M = now.getUTCMonth(), D = now.getUTCDate();
    if (st.month) { [Y, M] = st.month.split('-').map(Number); D = st.day || D; }
    const a = hm(st.tourStart), b0 = hm(st.tourEnd), b = b0 <= a ? b0 + 24 : b0;
    return {st, pl, Y, M, D, t0: localUTC(Y, M, D, a, pl.tz), t1: localUTC(Y, M, D, b, pl.tz)};
  }
  function whatsUp(N) {
    const tot = {}, up = {}, times = [N.t0, (N.t0 + N.t1) / 2, N.t1];
    for (let dec = -88; dec <= 88; dec += 3) {
      const step = Math.min(30, 1.5 / Math.max(0.05, Math.cos(dec * RAD)));
      for (let ra = 0; ra < 360; ra += step) {
        const c = conAt(ra, dec); if (!c || !CAL.iau[c.ab]) continue;
        const k = CAL.iau[c.ab].key; tot[k] = (tot[k] || 0) + 1;
        if (times.some(t => SKY.altaz(ra, dec, t, N.pl.lat, N.pl.lon).alt > 20)) up[k] = (up[k] || 0) + 1;
      }
    }
    let easy = new Set();
    try {
      const st = N.st, S2 = {lat: N.pl.lat, lon: N.pl.lon, tz: N.pl.tz, bortle: st.bortle, sqm: st.sqm, tourStart: st.tourStart, tourEnd: st.tourEnd, k: st.k, guestPenalty: st.guestPenalty, passMargin: st.passMargin, stackMargins: st.stackMargins, minCoreAlt: st.minCoreAlt};
      const byId = Object.fromEntries(CALP.patterns.map(x => [x.id, x]));
      VIS.rankPatterns(CALP.patterns, S2, N.Y, N.M, N.D, CALP.stars).results.forEach(r => { if (r.pass) { const pt = byId[r.id]; if (pt && CAL.iau[pt.refCon]) easy.add(CAL.iau[pt.refCon].key); } });
    } catch (e) {}
    const cons = Object.keys(up).filter(k => up[k] / tot[k] >= 0.5 && byKey[k]).map(k => ({k, f: up[k] / tot[k], easy: easy.has(k)}))
      .sort((a, b) => (b.easy - a.easy) || (b.f - a.f) || byKey[a.k].latin.localeCompare(byKey[b.k].latin));
    const tDay = localUTC(N.Y, N.M, N.D, 21, N.pl.tz);
    const times2 = [N.t0, (N.t0 + N.t1) / 2, N.t1];
    const pls = PLANETS.map(p => planetInfo(p, tDay, N.pl, 'en')).filter(I => I.where !== 'close' && times2.some(t => { const q = SKY.planet(I.p, t); return SKY.altaz(q.ra, q.dec, t, N.pl.lat, N.pl.lon).alt > 10; }));
    return {cons, pls};
  }
  const pickId = x => x.t + ':' + (x.key || x.ref);
  let whatsUpKeys = new Set();   // constellations above the horizon during the tour (set when the Pick step is drawn)
  function pickName(x, ar) { if (x.t === 'planet') { const b = DATA.sci.SOL.bodies.find(y => y.id === x.ref); return b ? (ar ? b.ar : b.en) : x.ref; } const c = byKey[x.key]; return c ? (ar ? c.ar : c.latin) : x.key; }
  function stepsOrder() { return P.order === 'sto' ? ['sto', 'sci'] : ['sci', 'sto']; }
  function stepBar(t, ar) {
    const o = stepsOrder(), lbl = [t.s1, t.s2, t[o[0]], t[o[1]]];
    return `<ol class="psteps">${lbl.map((l, i) => { const n = i + 1, cls = P.done ? 'done' : n === P.step ? 'on' : n < P.step ? 'done' : ''; const can = !P.done ? n < P.step || (n <= 2) || P.picks.length : true;
      return `<li class="${cls}"><button type="button" data-pstep="${n}"${can ? '' : ' disabled'}${n === P.step && !P.done ? ' aria-current="step"' : ''}><span class="pn">${n}</span>${esc(l)}</button></li>`; }).join('')}</ol>`;
  }
  function step1(t, ar, N) {
    const regions = [...new Set(CALD.places.map(p => p.r))], st = N.st;
    const dv = `${N.Y}-${String(N.M + 1).padStart(2, '0')}-${String(N.D).padStart(2, '0')}`;
    const BN = ar ? ['', 'موقع مظلم ممتاز', 'موقع مظلم حقًا', 'سماء ريفية', 'حافة الريف والضواحي', 'ضواحي', 'ضواحي ساطعة', 'حافة الضواحي والمدينة', 'مدينة', 'وسط المدينة'] : ['', 'excellent dark site', 'truly dark site', 'rural sky', 'rural/suburban edge', 'suburban', 'bright suburban', 'suburban/urban edge', 'city', 'inner city'];
    let h = `<div class="pform">`;
    h += `<label>${t.place}<select data-p="place">${regions.map(r => `<optgroup label="${esc(ar ? CALD.regionsAr[r] : r)}">${CALD.places.filter(x => x.r === r).map(x => `<option value="${esc(x.en)}"${x.en === st.place ? ' selected' : ''}>${esc(ar ? x.ar : x.en)}</option>`).join('')}</optgroup>`).join('')}</select></label>`;
    h += `<label>${t.date}<input type="date" data-p="date" value="${dv}"></label>`;
    h += `<label>${t.from}<input type="time" data-p="from" value="${esc(st.tourStart)}"></label>`;
    h += `<label>${t.to}<input type="time" data-p="to" value="${esc(st.tourEnd)}"></label>`;
    const PO = CALD.places.find(x => x.en === st.place) || {};
    const hint = +st.bortle === +(PO.bortle || 0) ? t.hintCert : +st.bortle === +(PO.bortle_est || 0) ? t.hintEst : t.hintOwn;
    h += `<label>${t.sky}<select data-p="bortle">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(b => `<option value="${b}"${+st.bortle === b ? ' selected' : ''}>${b} · ${BN[b]}</option>`).join('')}</select><span class="phint">${hint}</span></label>`;
    h += `<fieldset class="porder"><legend>${t.order}</legend>${[['sci', t.sciFirst], ['sto', t.stoFirst]].map(([v, l]) => `<label class="pradio"><input type="radio" name="porder" value="${v}"${P.order === v ? ' checked' : ''}> ${l}</label>`).join('')}</fieldset></div>`;
    const tm = (N.t0 + N.t1) / 2, m = SKY.moon(tm), malt = SKY.altaz(m.ra, m.dec, tm, N.pl.lat, N.pl.lon).alt, se = sunEvents(N.Y, N.M, N.D, N.pl);
    const hh = x => { const d = new Date(x + N.pl.tz * 36e5); return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0'); };
    h += `<div class="pnight">${moonIcon(m.illum, m.waxing, N.pl.lat < 0, 34)}<div><b>${fmtD(Date.UTC(N.Y, N.M, N.D), ar ? 'ar' : 'en', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}</b> · ${esc(ar ? N.pl.ar : N.pl.en)}<br>`;
    h += `${t.moon}: ${Math.round(m.illum * 100)}% ${t.lit}${ar ? '، ' : ', '}${malt > 0 ? t.up : t.down}${se.set ? ` · ${t.sunset} ${hh(se.set)}` : ''}</div></div>`;
    h += WX.box(N.pl, N.Y, N.M, N.D, 'mini');
    return h;
  }
  // connected stories (data in STORY_LINKS)
  const LT = {
    en: {h: 'Connected stories tonight', intro: 'Constellations whose stories belong together. Tap one to pick the ones that are up.', all: 'All cultures', pick: 'Pick these', picked: 'Picked',
         below: 'below the horizon', apart: n => `${n} is below the horizon tonight: in the story, they can never meet.`, down: (n, many) => `${n} ${many ? 'are' : 'is'} below the horizon tonight, but you can still tell ${many ? 'their' : 'its'} part of the story.`,
         more: n => `Show all ${n}`, less: 'Show fewer', con: 'Connected story', next: n => `This story continues in ${n}.`, inPlan: 'in your plan', notPlan: 'not in your plan'},
    ar: {h: 'قصص مترابطة الليلة', intro: 'كوكبات تجمعها قصة واحدة. اضغط على إحداها لاختيار ما هو فوق الأفق منها.', all: 'كل الثقافات', pick: 'اختر هذه', picked: 'تم الاختيار',
         below: 'تحت الأفق', apart: n => `${n} تحت الأفق الليلة: في القصة لا يلتقيان أبدًا.`, down: n => `${n} تحت الأفق الليلة، وما زال بإمكانك أن تروي هذا الجزء من القصة.`,
         more: n => `اعرض الكل (${n})`, less: 'اعرض أقل', con: 'قصة مترابطة', next: n => `تكمل القصة في ${n}.`, inPlan: 'في خطتك', notPlan: 'خارج خطتك'}
  };
  const conName = (k, ar) => byKey[k] ? (ar ? byKey[k].ar : byKey[k].latin) : k;
  const listNames = (ks, ar) => ks.map(k => conName(k, ar)).join(ar ? ' و' : ' and ');
  function linksBox(ar, W, on) {
    const L = LT[ar ? 'ar' : 'en'], up = new Set(W.cons.map(c => c.k));
    const groups = STORY_LINKS.filter(g => g.keys.some(k => up.has(k)));
    if (!groups.length) return '';
    const order = CULTURES.map(c => c.id), culs = CULTURES.filter(c => groups.some(g => g.cul === c.id));
    const f = culs.some(c => c.id === P.lcul) ? P.lcul : 'all';
    const shown = groups.filter(g => f === 'all' || g.cul === f).sort((a, b) => b.keys.filter(k => up.has(k)).length - a.keys.filter(k => up.has(k)).length || order.indexOf(a.cul) - order.indexOf(b.cul));
    let h = `<details class="dsofold plinks"${P.lopen ? ' open' : ''}><summary><span class="pd-ar" aria-hidden="true">▸</span><span class="df-t">${L.h} <span class="plk-cnt">(${groups.length})</span></span><span class="df-h" data-o="${ar ? 'اضغط لعرضها' : 'Tap to show'}" data-c="${ar ? 'اضغط لطيّها' : 'Tap to fold'}"></span></summary><div class="plk-in"><p class="muted">${L.intro}</p>`;
    h += `<div class="ppicks plf">${[['all', L.all], ...culs.map(c => [c.id, culLbl(c)])].map(([id, l]) => `<button type="button" class="ppick" data-lcul="${id}" aria-pressed="${id === f}"${id === 'all' ? '' : ` style="--cc:var(--c-${id})"`}>${esc(l)}</button>`).join('')}</div><div class="plcards">`;
    const cut = f === 'all' && !P.lmore && shown.length > 6;
    (cut ? shown.slice(0, 6) : shown).forEach(g => {
      const T2 = ar ? g.ar : g.en, vis = g.keys.filter(k => up.has(k)), dn = g.keys.filter(k => !up.has(k)), cu = CULTURES.find(c => c.id === g.cul);
      const all = vis.length && vis.every(k => on.has('con:' + k));
      h += `<article class="plk" style="--cc:var(--c-${g.cul})"><div class="plk-c"><span class="dot"></span>${esc(culLbl(cu))}</div><h4>${esc(T2[0])}</h4><p>${esc(T2[1])}</p>`;
      h += `<p class="plk-m">${g.keys.map(k => up.has(k) ? `<b>${esc(conName(k, ar))}</b>` : `<span class="plk-d">${esc(conName(k, ar))} (${L.below})</span>`).join(ar ? '، ' : ', ')}</p>`;
      if (dn.length) h += `<p class="plk-n">${esc((g.apart ? L.apart : L.down)(listNames(dn, ar), dn.length > 1))}</p>`;
      h += `<button type="button" class="ppick" data-link="${g.id}" aria-pressed="${!!all}">${all ? L.picked : L.pick}</button></article>`;
    });
    h += `</div>`;
    if (f === 'all' && shown.length > 6) h += `<button type="button" class="pbtn plmore" data-lmore>${P.lmore ? L.less : L.more(shown.length)}</button>`;
    return h + `</div></details>`;
  }
  function linksNote(x, cul, ar) {
    const L = LT[ar ? 'ar' : 'en'], gs = STORY_LINKS.filter(g => g.cul === cul && g.keys.includes(x.key));
    if (!gs.length) return '';
    const nx = P.picks[P.cur + 1], inPlan = new Set(P.picks.map(pickId));
    return gs.map(g => {
      const T2 = ar ? g.ar : g.en, others = g.keys.filter(k => k !== x.key);
      const cont = nx && nx.t === 'con' && others.includes(nx.key) ? ` <b>${esc(L.next(conName(nx.key, ar)))}</b>` : '';
      return `<div class="plk plk-s" style="--cc:var(--c-${cul})"><h4>${L.con}: ${esc(T2[0])}</h4><p>${esc(T2[1])}${cont}</p><p class="plk-m">${others.map(k => `${esc(conName(k, ar))} <span class="plk-d">(${inPlan.has('con:' + k) ? L.inPlan : L.notPlan})</span>`).join(ar ? '، ' : ', ')}</p></div>`;
    }).join('');
  }
  function step2(t, ar, N) {
    const W = whatsUp(N), on = new Set(P.picks.map(pickId));
    whatsUpKeys = new Set(W.cons.map(c => c.k));
    let h = `<p class="muted">${t.pickIntro}</p>`;
    const fromNight = AG.plannable().filter(x => !on.has(pickId(x)));
    if (fromNight.length) h += `<p class="pfromn"><button type="button" class="pbtn" data-pnight>${ar ? `+ أضف من «ليلتي» (${fromNight.length})` : `+ Add from My night (${fromNight.length})`}</button></p>`;
    h += linksBox(ar, W, on);
    h += `<h3 class="psub">${t.cons}</h3><div class="ppicks">${W.cons.length ? W.cons.map(c => { const x = {t: 'con', key: c.k}, id = pickId(x);
      return `<button type="button" class="ppick" data-pick='${JSON.stringify(x)}' aria-pressed="${on.has(id)}">${esc(ar ? byKey[c.k].ar : byKey[c.k].latin)}${ar ? '' : ` <span lang="ar">${esc(byKey[c.k].ar)}</span>`}${c.easy ? `<span class="peasy">${t.easy}</span>` : ''}</button>`; }).join('') : `<p class="muted">${t.nothingUp}</p>`}</div>`;
    if (W.pls.length) h += `<h3 class="psub">${t.planets}</h3><div class="ppicks">${W.pls.map(I => { const x = {t: 'planet', ref: I.p}, id = pickId(x); return `<button type="button" class="ppick" data-pick='${JSON.stringify(x)}' aria-pressed="${on.has(id)}">${esc(pickName(x, ar))}</button>`; }).join('')}</div>`;
    const all = DATA.constellations.filter(c => DATA.sci[c.key] && DATA.sci[c.key].parts && !ARAB_SRC.has(c.key)).sort((a, b) => a.latin.localeCompare(b.latin));
    h += `<label class="pother">${t.other}<select data-p="other"><option value="">${t.choose}</option>${all.map(c => `<option value="${c.key}">${esc(ar ? c.ar + ' · ' + c.latin : c.latin)}</option>`).join('')}</select></label>`;
    const notUp = x => x.t === 'con' ? !W.cons.some(c => c.k === x.key) : !W.pls.some(I => I.p === x.ref);
    if (P.picks.some(notUp)) h += `<div class="ppicks">${P.picks.filter(notUp).map(x => `<button type="button" class="ppick" data-pick='${JSON.stringify(x)}' aria-pressed="true">${esc(pickName(x, ar))}</button>`).join('')}</div>`;
    return h;
  }
  function pickBar(t, ar) {
    if (P.picks.length < 2) return '';
    return `<div class="ppicks pcur">${P.picks.map((x, i) => `<button type="button" class="ppick" data-pcur="${i}" aria-pressed="${i === P.cur}">${esc(pickName(x, ar))}</button>`).join('')}</div>`;
  }
  function head(x, ar, lang) {
    const name = pickName(x, ar), sub = x.t === 'con' ? (ar ? byKey[x.key].latin : byKey[x.key].ar) : '';
    let sw = '';
    if (x.t === 'con') { const k = swConName(x.key); if (k) sw = swBtn(k.name, k.fov, lang); }
    else sw = swBtn(x.ref[0].toUpperCase() + x.ref.slice(1), 4, lang);
    return `<div class="phead"><h3>${esc(name)}${sub ? ` <span class="arn2"${ar ? '' : ' lang="ar"'}>${esc(sub)}</span>` : ''}</h3><div>${AG.btn(x.t === 'con' ? {t: 'con', key: x.key, cul: 'science'} : {t: 'planet', key: 'SOL', ref: x.ref}, lang, true)}${sw}</div></div>`;
  }
  function sciView(x, lang) {
    if (x.t === 'planet') { const b = DATA.sci.SOL.bodies.find(y => y.id === x.ref); return b ? planetHTML(b, lang) : ''; }
    const o = state.con; state.con = x.key; try { return AG.chart(x.key) + sciHTML(x.key, lang); } finally { state.con = o; }
  }
  function stoView(x, t, ar, lang) {
    if (x.t !== 'con') return `<p class="muted">${t.noStory}</p>`;
    const lo = DATA.lore[x.key] || {}, avail = CULTURES.filter(c => lo[c.id]);
    if (!avail.length) return `<p class="muted">${ar ? 'لا توجد قصص لهذه الكوكبة في الثقافات السبع هنا.' : 'There are no stories for this constellation in the seven cultures here.'}</p>`;
    const pref = x.cul || P.cul, cul = avail.some(c => c.id === pref) ? pref : avail[0].id;
    let h = `<p class="psub2">${t.storyFor}</p><div class="ppicks">${avail.map(c => `<button type="button" class="ppick" data-pcul="${c.id}" aria-pressed="${c.id === cul}" style="--cc:var(--c-${c.id})">${esc(c.name)} <span lang="${c.natLang || 'ar'}">${esc(c.nat)}</span></button>`).join('')}</div>`;
    h += linksNote(x, cul, ar);
    const pos = (POS.pos[x.key] || {})[cul];
    h += `<div class="pstory" style="--cc:var(--c-${cul})"><div style="text-align:end">${AG.btn({t: 'con', key: x.key, cul}, lang, true)}</div>${AG.chart(x.key, pos && pos.face === 'N' && !pos.never)}${AG.lore(x.key, cul, lang)}</div>`;
    return h;
  }
  function render() {
    const card = document.getElementById('card'), ar = state.lang === 'ar', lang = ar ? 'ar' : 'en', t = TX[lang];
    card.style.setProperty('--cc', 'var(--c-cal)');
    const N = night();
    let h = `<div class="card-head"><div><div class="eyebrow"${ar ? ' lang="ar" style="letter-spacing:0;text-transform:none;font-family:var(--f-ar);font-size:15px"' : ''}><span class="dot"></span>${t.eyebrow}</div><h2${ar ? ' lang="ar" style="font-family:var(--f-ar)"' : ''}>${t.title}</h2></div></div>`;
    if (!P.done && P.step >= 3 && stepsOrder()[P.step - 3] === 'sci') h += kidBtn();
    h += `<div class="plan${ar ? ' rtl' : ''}" id="plan"${ar ? ' dir="rtl" lang="ar"' : ''}>` + stepBar(t, ar);
    if (P.done) {
      h += `<div class="pdone"><h3>${t.doneT}</h3><p>${t.doneP}</p><div class="pbtns"><button type="button" class="pbtn main" data-pact="save">${t.saveAll}</button><button type="button" class="pbtn" data-pact="again">${t.again}</button></div><p class="pmsg" role="status"></p></div>`;
    } else if (P.step === 1) h += step1(t, ar, N);
    else if (P.step === 2) h += step2(t, ar, N);
    else {
      if (!P.picks.length) { P.step = 2; return render(); }
      P.cur = Math.min(P.cur, P.picks.length - 1);
      const x = P.picks[P.cur], kind = stepsOrder()[P.step - 3];
      h += pickBar(t, ar) + head(x, ar, lang) + `<div class="pbody">${kind === 'sci' ? sciView(x, lang) : stoView(x, t, ar, lang)}</div>`;
    }
    if (!P.done) {
      const last = P.step === 4 && P.cur === P.picks.length - 1, more = P.step === 4 && P.cur < P.picks.length - 1;
      h += `<div class="pnav"><button type="button" class="pbtn" data-pact="back"${P.step === 1 ? ' disabled' : ''}>${ar ? '→ ' : '← '}${t.back}</button><span class="pmsg" role="status"></span>`;
      h += `<button type="button" class="pbtn main" data-pact="next">${last ? t.finish : more ? t.nextPick + esc(pickName(P.picks[P.cur + 1], ar)) : t.next}${ar ? ' ←' : ' →'}</button></div>`;
      if (P.step === 1) h += `<p class="muted ptip">${t.leave}</p>`;
    }
    h += `</div>`;
    card.innerHTML = h;
    bind(card, t);
  }
  const PLANrender = () => { keep(); render(); };
  const top = () => { const e = document.getElementById('plan'); if (e) window.scrollTo({top: Math.max(0, e.getBoundingClientRect().top + scrollY - 70)}); };
  function bind(card, t) {
    const st = CAL.st;
    card.querySelectorAll('[data-p]').forEach(el => el.addEventListener('change', () => {
      const k = el.dataset.p, v = el.value;
      if (k === 'place') { st.place = v; const P = CALD.places.find(x => x.en === v); if (P && (P.bortle || P.bortle_est)) { st.bortle = P.bortle || P.bortle_est; st.sqm = ''; } }
      else if (k === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(v)) { const [y, m, d] = v.split('-').map(Number); st.month = y + '-' + (m - 1); st.day = d; }
      else if (k === 'from' && v) st.tourStart = v; else if (k === 'to' && v) st.tourEnd = v;
      else if (k === 'bortle') { st.bortle = +v; st.sqm = ''; }
      else if (k === 'other' && v) { if (!P.picks.some(x => x.t === 'con' && x.key === v)) P.picks.push({t: 'con', key: v}); }
      calSave(); PLANrender();
    }));
    card.querySelectorAll('input[name=porder]').forEach(r => r.addEventListener('change', () => { P.order = r.value; keep(); }));
    const pn = card.querySelector('[data-pnight]'); if (pn) pn.addEventListener('click', () => { const have = new Set(P.picks.map(pickId)); AG.plannable().forEach(x => { if (!have.has(pickId(x))) P.picks.push(x); }); P.cur = 0; keep(); PLANrender(); });
    card.querySelectorAll('[data-pick]').forEach(b => b.addEventListener('click', () => {
      const x = JSON.parse(b.dataset.pick), id = pickId(x), i = P.picks.findIndex(y => pickId(y) === id);
      if (i >= 0) P.picks.splice(i, 1); else P.picks.push(x);
      b.setAttribute('aria-pressed', i < 0); P.cur = 0; keep();
      const m = card.querySelector('.pnav .pmsg'); if (m) m.textContent = '';
    }));
    card.querySelectorAll('[data-pcur]').forEach(b => b.addEventListener('click', () => { P.cur = +b.dataset.pcur; PLANrender(); top(); }));
    card.querySelectorAll('[data-pcul]').forEach(b => b.addEventListener('click', () => { P.cul = b.dataset.pcul; if (P.picks[P.cur]) P.picks[P.cur].cul = P.cul; PLANrender(); }));
    card.querySelectorAll('[data-lcul]').forEach(b => b.addEventListener('click', () => { P.lcul = b.dataset.lcul; PLANrender(); }));
    card.querySelectorAll('details.plinks').forEach(d => d.addEventListener('toggle', () => { P.lopen = d.open; keep(); }));
    card.querySelectorAll('[data-lmore]').forEach(b => b.addEventListener('click', () => { P.lmore = !P.lmore; PLANrender(); }));
    card.querySelectorAll('[data-link]').forEach(b => b.addEventListener('click', () => {
      const g = STORY_LINKS.find(x => x.id === b.dataset.link); if (!g) return;
      const vis = g.keys.filter(k => whatsUpKeys.has(k));
      const have = k => P.picks.findIndex(x => x.t === 'con' && x.key === k);
      if (vis.length && vis.every(k => have(k) >= 0)) vis.forEach(k => P.picks.splice(have(k), 1));
      else vis.forEach(k => { const i = have(k); if (i >= 0) P.picks[i].cul = g.cul; else P.picks.push({t: 'con', key: k, cul: g.cul}); });
      P.cur = 0; PLANrender();
    }));
    card.querySelectorAll('[data-pstep]').forEach(b => b.addEventListener('click', () => { const n = +b.dataset.pstep; if (n >= 3 && !P.picks.length) return; P.done = false; P.step = n; PLANrender(); top(); }));
    card.querySelectorAll('[data-pact]').forEach(b => b.addEventListener('click', () => {
      const a = b.dataset.pact;
      if (a === 'next') {
        if (P.step === 2 && !P.picks.length) { const m = card.querySelector('.pnav .pmsg'); if (m) m.textContent = t.none; return; }
        if (P.step < 4) P.step++;
        else if (P.cur < P.picks.length - 1) { P.cur++; P.step = 3; }
        else P.done = true;
      } else if (a === 'back') {
        if (P.step > 3 || (P.step === 3 && P.cur === 0) || P.step <= 2) P.step = Math.max(1, P.step - 1);
        else { P.cur--; P.step = 4; }
      } else if (a === 'again') { P = {step: 1, order: P.order, picks: [], cur: 0, cul: P.cul, done: false}; }
      else if (a === 'save') {
        const N = night(), ar = state.lang === 'ar';
        const name = (ar ? 'ليلة ' : 'Night of ') + fmtD(Date.UTC(N.Y, N.M, N.D), ar ? 'ar' : 'en', {day: 'numeric', month: 'short'}) + ' · ' + (ar ? N.pl.ar : N.pl.en);
        AG.newList(name, P.picks.map(x => x.t === 'con' ? {t: 'con', key: x.key, cul: 'science'} : {t: 'planet', key: 'SOL', ref: x.ref}));
        const m = card.querySelector('.pdone .pmsg'); if (m) m.innerHTML = `${t.saved} <button type="button" class="pbtn" data-goag>${t.openAG}</button>`;
        const g = card.querySelector('[data-goag]'); if (g) g.addEventListener('click', () => setCulture('guide'));
        return;
      }
      PLANrender(); top();
    }));
  }
  // My night feeds the planner: replace the picks with the list's (from My night), or fill empty picks when the planner opens
  function seed(items) { P.picks = items.slice(); P.cur = 0; P.done = false; P.step = 2; keep(); }
  function enter() { if (!P.picks.length) { const it = AG.plannable(); if (it.length) { P.picks = it; P.cur = 0; keep(); } } }
  return {render, seed, enter};
})();

