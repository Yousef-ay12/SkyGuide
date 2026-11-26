/* ---------- Quiz: test your knowledge, questions made from the site's own data ---------- */
const QUIZ = (() => {
  // a Cosmology question's link opens the right part of the Cosmology page
  document.addEventListener('click', ev => { const a = ev.target.closest && ev.target.closest('[data-qpart]'); if (!a) return; COS_PART = a.dataset.qpart; try { localStorage.setItem('osms-cos', COS_PART); } catch (e) {} });
  const KINDS = [
    ['chart', 'Which constellation is this?', 'ما هذه الكوكبة؟'],
    ['starcon', 'Which constellation is the star in?', 'في أي كوكبة هذا النجم؟'],
    ['dist', 'How far away is the star?', 'كم يبعد النجم عنا؟'],
    ['size', 'How big is the star?', 'ما حجم النجم؟'],
    ['compare', 'Which star is closer, bigger or brighter?', 'أي النجمين أقرب أو أكبر أو أسطع؟'],
    ['colour', 'Star colours and heat', 'ألوان النجوم وحرارتها'],
    ['story', 'Stories and names', 'القصص والأسماء'],
    ['planet', 'Planets and the Sun', 'الكواكب والشمس'],
    ['dso', 'Deep-sky objects', 'الأجرام السماوية العميقة'],
    ['moons', 'Moons of the planets', 'أقمار الكواكب'],
    ['cosmos', 'Cosmology', 'علم الكون']];
  const COUNTS = [5, 10, 15, 20];
  const EASY_CONS = ['Ori', 'UMa', 'UMi', 'Cas', 'Cyg', 'Sco', 'Leo', 'Tau', 'Gem', 'Cru', 'Lyr', 'Aql', 'Peg', 'And', 'Per', 'Sgr', 'Boo', 'Vir', 'CMa', 'Aur', 'Cen', 'Dra', 'Her', 'Cep', 'Del', 'Aqr', 'Cnc', 'Lib', 'Ari', 'Cap', 'Psc', 'CMi'];
  const CUL_AR = {arab: 'سماء العرب', greek: 'سماء الإغريق', egypt: 'سماء مصر القديمة', china: 'سماء الصين', japan: 'سماء اليابان', india: 'سماء الهند', safrica: 'سماء جنوب أفريقيا'};
  const GREEK = /^(Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa|Lambda|Mu|Nu|Xi|Omicron|Pi|Rho|Sigma|Tau|Upsilon|Phi|Chi|Psi|Omega)\b/;
  const COLOURS = {blue: ['blue-white', 'أزرق مائل إلى البياض'], white: ['white', 'أبيض'], yellow: ['yellow', 'أصفر'], orange: ['orange', 'برتقالي'], red: ['red', 'أحمر']};
  const colourOf = cls => ({O: 'blue', B: 'blue', A: 'white', F: 'yellow', G: 'yellow', K: 'orange', M: 'red'})[cls] || null;
  // planet riddles: [answer, English, Arabic, explanation fact [body, index] or text]
  const RIDDLES = [
    ['jupiter', "Which planet is often called Earth's shield, because its gravity throws many comets away?", 'أي كوكب يُسمّى كثيرًا «درع الأرض» لأن جاذبيته تقذف كثيرًا من المذنبات بعيدًا؟', ['jupiter', 3]],
    ['venus', 'Which is the hottest planet, even though it is not the closest to the Sun?', 'ما أشد الكواكب حرارة، مع أنه ليس الأقرب إلى الشمس؟', ['venus', 0]],
    ['saturn', 'Which planet has the most known moons?', 'أي كوكب له أكبر عدد من الأقمار المعروفة؟', ['saturn', 0]],
    ['saturn', 'Which planet is so light for its size that it would float in a giant bathtub?', 'أي كوكب خفيف بالنسبة إلى حجمه حتى إنه قد يطفو في حوض ماء عملاق؟', ['saturn', 2]],
    ['uranus', 'Which planet is tipped over on its side and rolls around the Sun like a ball?', 'أي كوكب مائل على جنبه فيدور حول الشمس كأنه كرة تتدحرج؟', ['uranus', 0]],
    ['neptune', 'Which planet has the fastest winds in the Solar System?', 'أي كوكب فيه أسرع رياح في المجموعة الشمسية؟', ['neptune', 0]],
    ['mars', 'Which planet has Olympus Mons, the largest volcano known?', 'على أي كوكب يقع أوليمبوس مونس، أكبر بركان معروف؟', ['mars', 1]],
    ['mercury', 'Which is the smallest planet and the closest to the Sun?', 'ما أصغر الكواكب وأقربها إلى الشمس؟', ['mercury', 0]],
    ['venus', 'On which planet does the Sun rise in the west, because it spins backwards?', 'على أي كوكب تشرق الشمس من الغرب لأنه يدور بالعكس؟', ['venus', 1]],
    ['jupiter', 'Which planet has the shortest day, under 10 hours?', 'أي كوكب له أقصر يوم، أقل من 10 ساعات؟', ['jupiter', 'day']],
    ['uranus', 'Which was the first planet found with a telescope, in 1781?', 'ما أول كوكب اكتُشف بالتلسكوب سنة 1781؟', ['uranus', 2]],
    ['neptune', 'Which planet was found by mathematics before anyone saw it, in 1846?', 'أي كوكب اكتُشف بالحساب الرياضي قبل أن يراه أحد، سنة 1846؟', ['neptune', 1]],
    ['mars', 'Which planet looks red because its dust is full of rust?', 'أي كوكب يبدو أحمر لأن غباره مليء بالصدأ؟', ['mars', 0]],
    ['jupiter', 'Which planet has the Great Red Spot, a storm wider than Earth?', 'على أي كوكب البقعة الحمراء العظيمة، وهي إعصار أعرض من الأرض؟', ['jupiter', 1]],
    ['uranus', 'Which planet holds the record for the coldest air measured on any planet?', 'أي كوكب يحمل الرقم القياسي لأبرد هواء قيس على كوكب؟', ['uranus', 3]],
    ['mars', 'On which planet do sunsets look blue?', 'على أي كوكب تبدو أوقات الغروب زرقاء؟', ['mars', 4]],
    ['earth', 'Which is the only world we know of with liquid water on its surface and with life?', 'ما العالم الوحيد المعروف بوجود ماء سائل على سطحه وبوجود الحياة؟', ['earth', 0]],
    ['jupiter', 'Which is the largest planet?', 'ما أكبر الكواكب؟', ['jupiter', 0]],
    ['saturn', 'Which planet has huge rings of ice and rock reaching about 282,000 km out?', 'أي كوكب له حلقات ضخمة من الجليد والصخر تمتد نحو 282,000 كم؟', ['saturn', 1]],
    ['neptune', 'On which planet does one year last about 165 Earth years?', 'على أي كوكب تدوم السنة نحو 165 سنة أرضية؟', ['neptune', 2]],
    ['earth', 'Whose moon is slowly drifting away, by about 3.8 cm a year?', 'قمرُ أيِّ كوكب يبتعد عنه ببطء، نحو 3.8 سم كل سنة؟', ['earth', 2]],
    ['pluto', 'Which world was called the ninth planet until 2006?', 'أي عالم كان يُسمّى الكوكب التاسع حتى سنة 2006؟', ['pluto', 0]]];
  const DCAT = {PN: 'pn', GCl: 'gcl', OCl: 'ocl', G: 'gal', SNR: 'snr', DrkN: 'dark', HII: 'neb', Neb: 'neb', 'Cl+N': 'neb', RfN: 'neb', '*Ass': 'ass'};
  const DCAT_N = {pn: ['planetary nebula', 'سديم كوكبي', 'PN'], gcl: ['globular cluster', 'عنقود كروي', 'GCl'], ocl: ['open cluster', 'عنقود مفتوح', 'OCl'], gal: ['galaxy', 'مجرة', 'G'], snr: ['supernova remnant', 'بقايا مستعر أعظم', 'SNR'], dark: ['dark nebula', 'سديم مظلم', 'DrkN'], neb: ['nebula where stars are born', 'سديم تولد فيه النجوم', 'HII'], ass: ['star cloud or star group', 'سحابة أو مجموعة نجوم', '*Ass']};
  const PLANETS = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

  let S = {count: 10, level: 'easy', topic: 'all', best: {}};
  try { const x = JSON.parse(localStorage.getItem('osms-quiz') || 'null'); if (x && typeof x === 'object') S = Object.assign(S, x); } catch (e) {}
  const keep = () => { try { localStorage.setItem('osms-quiz', JSON.stringify({count: S.count, level: S.level, topic: S.topic, best: S.best})); } catch (e) {} };
  let G = null;   // the round being played

  const rnd = n => Math.floor(Math.random() * n);
  const pick = a => a[rnd(a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const body = id => DATA.sci.SOL.bodies.find(b => b.id === id);

  // ---- data pools ----
  let POOL = null;
  function pools() {
    if (POOL) return POOL;
    const seen = new Set(), stars = [], homes = {};
    Object.keys(DATA.sci).forEach(k => { if (k === 'SOL') return; (DATA.sci[k].parts || []).forEach(sc =>
      (sc.stars || []).forEach(s => { if (s.name) (homes[s.name] = homes[s.name] || new Set()).add(k); if (!s.name || GREEK.test(s.name) || /\d|^(HD|HR|HIP|Gliese|GJ)\b/.test(s.name) || seen.has(s.name)) return; seen.add(s.name); stars.push(Object.assign({con: k, R: starRadius(s)}, s)); })); });
    const cons = DATA.constellations.filter(c => DATA.sci[c.key] && !c.sciOnly && c.key !== 'SOL').map(c => c.key);
    const charts = Object.keys(DATA.charts).filter(k => DATA.sci[k] && /class="ln"/.test(DATA.charts[k]));
    const stories = [];
    Object.keys(DATA.lore).forEach(k => Object.keys(DATA.lore[k]).forEach(cul => { const e = DATA.lore[k][cul]; if (!CULTURES.find(c => c.id === cul)) return;
      (e.stories || []).forEach((st, i) => { const arT = e.ar && e.ar.stories && e.ar.stories[i] && e.ar.stories[i].title; stories.push({key: k, cul, en: st.title, ar: arT || null}); }); }));
    const tcount = {}; stories.forEach(x => { const t = x.en.toLowerCase(); tcount[t] = (tcount[t] || new Set()).add(x.cul); });
    const dsos = []; Object.keys(DATA.sci).forEach(k => (DATA.sci[k].parts || []).forEach(pt => (pt.dsos || []).forEach(d => { if (d.name && DSO_FACTS[d.id] && DCAT[d.type]) dsos.push(Object.assign({con: k}, d)); })));
    return (POOL = {stars, cons, charts, homes, dsos, stories: stories.filter(x => tcount[x.en.toLowerCase()].size === 1)});
  }
  const starsFor = lvl => { const s = pools().stars; return lvl === 'easy' ? s.filter(x => x.mag <= 2.1) : s; };
  const consFor = lvl => lvl === 'easy' ? EASY_CONS.filter(k => DATA.sci[k]) : pools().cons;

  // ---- names ----
  const sciPart = k => ((DATA.sci[k] || {}).parts || [{}])[0];
  const conName = (k, ar) => { const c = byKey[k] || {}, sp = sciPart(k); return ar ? (c.ar || sp.ar) : (c.latin || sp.name); };
  const starName = (s, ar) => { const a = ar && DATA.starAr && DATA.starAr[s.name]; return a ? `${esc(s.name)} <span class="qar" lang="ar">(${esc(a)})</span>` : esc(s.name); };
  const starFrom = (s, ar) => `${starName(s, ar)} <span class="qfrom">${ar ? 'من كوكبة' : 'from'} ${esc(conName(s.con, ar))}</span>`;
  const ly = (d, ar) => { const v = d < 10 ? nf(d, 1) : nf(sig(d)); return ar ? `نحو ${v} سنة ضوئية` : `about ${v} light years`; };
  const times = (R, ar) => ar ? `نحو ${nf(sig(R), R < 10 ? 1 : 0)} ضعف قطر الشمس` : `about ${nf(sig(R), R < 10 ? 1 : 0)} times wider than the Sun`;
  const planetN = (id, ar) => { const b = body(id); return ar ? b.ar : b.en; };

  // numbers spread around the true value, all different once rounded
  function spread(v, fmt, lo = 0.5, hi = 1e6) {
    const fac = shuffle([0.1, 0.25, 0.4, 2.5, 4, 10]); const out = [v], txt = new Set([fmt(v)]);
    for (const f of fac) { const x = v * f; if (x < lo || x > hi || txt.has(fmt(x))) continue; out.push(x); txt.add(fmt(x)); if (out.length === 4) break; }
    return out.length === 4 ? out : null;
  }

  // ---- question makers: each returns {q, fig?, opts:[html], ans, exp, go} ----
  const MAKE = {
    chart(lvl, ar) {
      const keys = consFor(lvl).filter(k => pools().charts.includes(k)); const k = pick(keys);
      const others = shuffle(consFor(lvl).filter(x => x !== k)).slice(0, 3);
      const opts = shuffle([k, ...others]);
      const svg = DATA.charts[k].replace(/<text[\s\S]*?<\/text>/g, '');
      const c = byKey[k] || {};
      return {q: ar ? 'ما هذه الكوكبة؟' : 'Which constellation is this?', fig: `<figure class="chart qchart">${svg}</figure>`, opts: opts.map(x => esc(conName(x, ar))), ans: opts.indexOf(k),
        exp: ar ? `هذه كوكبة ${conName(k, true)} (${esc(c.latin || sciPart(k).name)}).` : `This is ${esc(conName(k, false))}${c.gloss ? `, ${esc(c.gloss)}` : ''}.`, go: k + '-science'};
    },
    starcon(lvl, ar) {
      const s = pick(starsFor(lvl)); const others = shuffle(consFor(lvl).filter(x => !pools().homes[s.name].has(x))).slice(0, 3); const opts = shuffle([s.con, ...others]);
      return {q: ar ? `في أي كوكبة يقع النجم ${starName(s, true)}؟` : `Which constellation is ${starName(s, false)} in?`, opts: opts.map(x => esc(conName(x, ar))), ans: opts.indexOf(s.con),
        exp: ar ? `${starName(s, true)} في كوكبة ${esc(conName(s.con, true))}، ويبعد ${ly(s.dist, true)}.` : `${starName(s, false)} is in ${esc(conName(s.con, false))}, ${ly(s.dist, false)} away.`, go: s.con + '-science'};
    },
    dist(lvl, ar) {
      for (let t = 0; t < 30; t++) { const s = pick(starsFor(lvl)); if (!s.dist) continue; const vals = spread(s.dist, x => ly(x, ar), 1, 50000); if (!vals) continue;
        const opts = shuffle(vals);
        return {q: ar ? `كم يبعد النجم ${starFrom(s, true)} عنا؟` : `How far away is ${starFrom(s, false)}?`, opts: opts.map(x => ly(x, ar)), ans: opts.indexOf(s.dist),
          exp: ar ? `يبعد ${starName(s, true)} ${ly(s.dist, true)}: الضوء الذي تراه الليلة غادره قبل ${nf(sig(s.dist))} سنة تقريبًا.` : `${starName(s, false)} is ${ly(s.dist, false)} away: the light you see tonight left it about ${nf(sig(s.dist))} years ago.`, go: s.con + '-science'}; }
      return null;
    },
    size(lvl, ar) {
      for (let t = 0; t < 40; t++) { const s = pick(starsFor(lvl)); if (!s.R || s.R < 2) continue; const vals = spread(s.R, x => times(x, ar), 1.2, 3000); if (!vals) continue;
        const opts = shuffle(vals);
        return {q: ar ? `كم مرة يزيد قطر ${starFrom(s, true)} على قطر الشمس؟` : `How many times wider than the Sun is ${starFrom(s, false)}?`, opts: opts.map(x => times(x, ar)), ans: opts.indexOf(s.R),
          exp: sizeTxt(s.R, s.name, ar ? 'ar' : 'en'), go: s.con + '-science'}; }
      return null;
    },
    compare(lvl, ar) {
      const st = starsFor(lvl);
      for (let t = 0; t < 60; t++) { const a = pick(st), b = pick(st); if (a === b) continue; const m = pick(KIDS ? ['closer', 'bigger', 'hotter'] : ['closer', 'bigger', 'brighter', 'hotter']);
        let win, q, exp;
        if (m === 'closer') { if (!a.dist || !b.dist || Math.max(a.dist, b.dist) / Math.min(a.dist, b.dist) < 1.6) continue; win = a.dist < b.dist ? a : b;
          q = ar ? 'أي النجمين أقرب إلينا؟' : 'Which star is closer to us?'; exp = ar ? `${starName(a, true)}: ${ly(a.dist, true)}. ${starName(b, true)}: ${ly(b.dist, true)}.` : `${starName(a, false)}: ${ly(a.dist, false)}. ${starName(b, false)}: ${ly(b.dist, false)}.`; }
        else if (m === 'bigger') { if (!a.R || !b.R || Math.max(a.R, b.R) / Math.min(a.R, b.R) < 1.8) continue; win = a.R > b.R ? a : b;
          q = ar ? 'أي النجمين أكبر حجمًا؟' : 'Which star is bigger?'; exp = ar ? `${starName(a, true)}: ${times(a.R, true)}. ${starName(b, true)}: ${times(b.R, true)}.` : `${starName(a, false)}: ${times(a.R, false)}. ${starName(b, false)}: ${times(b.R, false)}.`; }
        else if (m === 'brighter') { if (a.mag == null || b.mag == null || Math.abs(a.mag - b.mag) < 0.8) continue; win = a.mag < b.mag ? a : b;
          q = ar ? 'أي النجمين يبدو أسطع في سمائنا؟' : 'Which star looks brighter in our sky?';
          exp = ar ? `كلما صغر رقم السطوع كان النجم أسطع: ${starName(a, true)} ${nf(a.mag, 1)}، و${starName(b, true)} ${nf(b.mag, 1)}.` : `The smaller the brightness number, the brighter the star: ${starName(a, false)} is ${nf(a.mag, 1)} and ${starName(b, false)} is ${nf(b.mag, 1)}.`; }
        else { if (!a.temp || !b.temp || Math.max(a.temp, b.temp) / Math.min(a.temp, b.temp) < 1.3) continue; win = a.temp > b.temp ? a : b;
          q = ar ? 'أي النجمين أشد حرارة؟' : 'Which star is hotter?';
          exp = ar ? `${starName(a, true)} نحو ${nf(sig(a.temp))} كلفن، و${starName(b, true)} نحو ${nf(sig(b.temp))} كلفن. النجوم الزرقاء أشد حرارة من الحمراء.` : `${starName(a, false)} is about ${nf(sig(a.temp))} K and ${starName(b, false)} about ${nf(sig(b.temp))} K. Blue stars are hotter than red ones.`; }
        return {q, opts: [starFrom(a, ar), starFrom(b, ar)], ans: win === a ? 0 : 1, exp, go: win.con + '-science', two: true}; }
      return null;
    },
    colour(lvl, ar) {
      for (let t = 0; t < 40; t++) { const s = pick(starsFor(lvl)); const c = colourOf(s.cls); if (!c || !s.temp) continue;
        const opts = shuffle([c, ...shuffle(Object.keys(COLOURS).filter(x => x !== c)).slice(0, 3)]);
        return {q: ar ? `ما لون النجم ${starFrom(s, true)}؟` : `What colour is ${starFrom(s, false)}?`, opts: opts.map(x => `<span class="qdot" style="background:${bvColour(x === 'blue' ? -0.2 : x === 'white' ? 0.05 : x === 'yellow' ? 0.65 : x === 'orange' ? 1.1 : 1.6)}"></span>${COLOURS[x][ar ? 1 : 0]}`), ans: opts.indexOf(c),
          exp: ar ? `${starName(s, true)} ${COLOURS[c][1]}، وحرارة سطحه نحو ${nf(sig(s.temp))} كلفن. الأزرق أسخن النجوم والأحمر أبردها.` : `${starName(s, false)} is ${COLOURS[c][0]}, with a surface about ${nf(sig(s.temp))} K. Blue stars are the hottest and red ones the coolest.`, go: s.con + '-science'}; }
      return null;
    },
    story(lvl, ar) {
      if (Math.random() < 0.5) {   // which culture tells this story?
        const pool = pools().stories.filter(x => (!ar || x.ar) && (lvl === 'hard' || EASY_CONS.includes(x.key)));
        const st = pick(pool.length ? pool : pools().stories.filter(x => !ar || x.ar));
        const cul = CULTURES.find(c => c.id === st.cul); const opts = shuffle([st.cul, ...shuffle(CULTURES.map(c => c.id).filter(x => x !== st.cul)).slice(0, 3)]);
        const nm = id => ar ? CUL_AR[id] : CULTURES.find(c => c.id === id).name + ' sky';
        return {q: ar ? `أي سماء تروي قصة «${esc(st.ar)}»؟` : `Which culture tells the story “${esc(st.en)}”?`, opts: opts.map(x => esc(nm(x))), ans: opts.indexOf(st.cul),
          exp: ar ? `هذه القصة من ${CUL_AR[st.cul]}، عن كوكبة ${esc(conName(st.key, true))}.` : `This story is from the ${esc(cul.name)} sky, about ${esc(conName(st.key, false))}.`, go: st.key + '-' + st.cul};
      }
      const k = pick(consFor(lvl).filter(x => byKey[x] && byKey[x].ar)); const opts = shuffle([k, ...shuffle(consFor(lvl).filter(x => x !== k && byKey[x] && byKey[x].ar)).slice(0, 3)]);
      if (ar) return {q: `ما الاسم اللاتيني لكوكبة «${esc(byKey[k].ar)}»؟`, opts: opts.map(x => `<bdi dir="ltr">${esc(byKey[x].latin)}</bdi>`), ans: opts.indexOf(k), exp: `اسمها اللاتيني ${esc(byKey[k].latin)}.`, go: k + '-science'};
      return {q: `What is ${esc(byKey[k].latin)} called in Arabic?`, opts: opts.map(x => `<span lang="ar" dir="rtl">${esc(byKey[x].ar)}</span>`), ans: opts.indexOf(k),
        exp: `${esc(byKey[k].latin)}${byKey[k].gloss ? ` (${esc(byKey[k].gloss)})` : ''} is called <span lang="ar">${esc(byKey[k].ar)}</span> in Arabic.`, go: k + '-science'};
    },
    dso(lvl, ar) {
      const all = pools().dsos, pool = lvl === 'easy' ? all.filter(d => /^M\d/.test(d.cat || '') || ['C041', 'C099', 'NGC5139', 'NGC0104', 'ESO056-115', 'NGC0292', 'NGC3372', 'NGC4755', 'NGC2070', 'NGC5128'].includes(d.id)) : all;
      const nm = d => esc(d.id === 'NGC6705' ? 'Wild Duck Cluster' : d.name), the = d => /(Nebula|Cluster|Galaxy|Galaxies|Cloud|Box|Planetary|Snowball|Coalsack|Hyades|Pleiades.*|Planetary)$/.test(d.name) || /^(Ghost|Lower|Coathanger|Small|Double)/.test(d.name) || d.id === 'NGC6705' ? 'the ' : '', cn = c => DCAT_N[c][ar ? 1 : 0], an = w => (/^[aeiou]/i.test(w) ? 'an ' : 'a ') + w;
      const why = d => { const ti = DSO_TYPE_INFO[d.type]; return esc((ti ? ti[ar ? 3 : 1].split(/(?<=[.؟!])\s/)[0] + ' ' : '') + DSO_FACTS[d.id][ar ? 1 : 0]); };
      const r = Math.random();
      if (r < 0.45) {   // what kind of object is it?
        const d = pick(pool), c = DCAT[d.type]; const opts = shuffle([c, ...shuffle(Object.keys(DCAT_N).filter(x => x !== c)).slice(0, 3)]);
        return {q: ar ? `ما نوع ${nm(d)}؟` : `What kind of object is ${the(d)}${nm(d)}?`, opts: opts.map(cn), ans: opts.indexOf(c), exp: `<b>${nm(d)}</b>: ${why(d)}`, go: d.con + '-science'};
      }
      if (r < 0.8) {   // which of these is a ...?
        for (let t = 0; t < 30; t++) { const d = pick(pool), c = DCAT[d.type]; const others = shuffle(pool.filter(x => DCAT[x.type] !== c)); const picked = [], seenC = new Set([c]);
          for (const x of others) { if (seenC.has(DCAT[x.type])) continue; seenC.add(DCAT[x.type]); picked.push(x); if (picked.length === 3) break; }
          if (picked.length < 3) continue; const opts = shuffle([d, ...picked]);
          return {q: ar ? `أيٌّ من هذه ${cn(c)}؟` : `Which of these is ${an(cn(c))}?`, opts: opts.map(nm), ans: opts.indexOf(d), exp: `<b>${nm(d)}</b>: ${why(d)}`, go: d.con + '-science'}; }
        return null;
      }
      // which description fits this type?
      const c = pick(Object.keys(DCAT_N)), code = DCAT_N[c][2], first = k => DSO_TYPE_INFO[k][ar ? 3 : 1].split(/(?<=[.؟!])\s/)[0];
      const opts = shuffle([c, ...shuffle(Object.keys(DCAT_N).filter(x => x !== c)).slice(0, 3)]);
      return {q: ar ? (c === 'neb' ? 'ما السديم الذي تولد فيه النجوم؟' : esc(DSO_TYPE_INFO[code][2])) : `What is ${an(cn(c))}?`, opts: opts.map(x => esc(first(DCAT_N[x][2]))), ans: opts.indexOf(c), exp: esc(DSO_TYPE_INFO[code][ar ? 3 : 1]), go: (all.find(d => DCAT[d.type] === c) || {con: 'Ori'}).con + '-science'};
    },
    moons(lvl, ar) {
      const all = []; Object.keys(MOONS).forEach(pid => MOONS[pid].forEach(m => all.push(Object.assign({pid}, m))));
      const pn = pid => esc(planetN(pid, ar)), mn = m => esc(ar ? m.ar : m.en), r = Math.random();
      if (r < 0.45) {   // a moon from what makes it special
        const q = pick(MOON_RIDDLES), m = all.find(x => x.en === q[0]); if (!m) return null;
        const pool = all.filter(x => x.en !== m.en && (lvl === 'hard' || x.d > 1000 || ['Phobos', 'Deimos', 'Enceladus', 'Mimas', 'Miranda'].includes(x.en)));
        const opts = shuffle([m, ...shuffle(pool).slice(0, 3)]);
        return {q: ar ? q[2] : q[1], opts: opts.map(mn), ans: opts.indexOf(m), exp: `<b>${mn(m)}</b> (${pn(m.pid)}): ${esc((ar ? m.fa : m.f)[0])}`, go: 'SOL-science'};
      }
      if (r < 0.75) {   // which planet does it go around?
        const m = pick(lvl === 'hard' ? all.filter(x => x.pid !== 'earth') : all.filter(x => x.pid !== 'earth' && (x.d > 1500 || x.pid === 'mars')));
        const opts = shuffle([m.pid, ...shuffle(['mars', 'jupiter', 'saturn', 'uranus', 'neptune'].filter(x => x !== m.pid)).slice(0, 3)]);
        return {q: ar ? `حول أي كوكب يدور القمر ${mn(m)}؟` : `Which planet does ${mn(m)} go around?`, opts: opts.map(pn), ans: opts.indexOf(m.pid), exp: ar ? `${mn(m)} قمر من أقمار ${pn(m.pid)}، ويبعد عنه ${nf(m.a)} كم.` : `${mn(m)} is a moon of ${pn(m.pid)}, ${nf(m.a)} km from it.`, go: 'SOL-science'};
      }
      // which of two moons is bigger?
      for (let t = 0; t < 30; t++) { const a = pick(all), b = pick(all); if (a === b || Math.max(a.d, b.d) / Math.min(a.d, b.d) < 1.25) continue; const win = a.d > b.d ? a : b;
        return {q: ar ? 'أي القمرين أكبر؟' : 'Which moon is bigger?', opts: [mn(a), mn(b)], ans: win === a ? 0 : 1, two: true,
          exp: ar ? `${mn(a)}: ${nf(a.d)} كم. ${mn(b)}: ${nf(b.d)} كم.` : `${mn(a)}: ${nf(a.d)} km across. ${mn(b)}: ${nf(b.d)} km across.`, go: 'SOL-science'}; }
      return null;
    },
    cosmos(lvl, ar) {
      const q = pick(COS_QUIZ.filter(x => lvl === 'hard' || !x.hard)), L = ar ? q.ar : q.en, ord = shuffle([0, 1, 2, 3]);
      return {q: esc(L[0]), opts: ord.map(i => esc(L[1][i])), ans: ord.indexOf(0), exp: esc(L[2]), go: 'COS-science', part: q.part};
    },
    planet(lvl, ar) {
      if (Math.random() < 0.08) {
        const o = ar ? ['8 ثوانٍ', '8 دقائق', '8 ساعات', '8 أيام'] : ['8 seconds', '8 minutes', '8 hours', '8 days']; const ord = shuffle([0, 1, 2, 3]);
        return {q: ar ? 'كم يستغرق ضوء الشمس ليصل إلى الأرض؟' : 'How long does sunlight take to reach Earth?', opts: ord.map(i => o[i]), ans: ord.indexOf(1), exp: esc(body('sun')['facts_' + (ar ? 'ar' : 'en')][2]), go: 'SOL-science'};
      }
      const r = pick(RIDDLES); const pool = r[0] === 'pluto' ? PLANETS.concat('pluto') : PLANETS;
      const opts = shuffle([r[0], ...shuffle(pool.filter(x => x !== r[0])).slice(0, 3)]);
      const b = body(r[3][0]); const exp = r[3][1] === 'day' ? (ar ? `يوم المشتري ${b.day_ar}.` : `A day on Jupiter lasts ${b.day_en}.`) : b['facts_' + (ar ? 'ar' : 'en')][r[3][1]];
      return {q: ar ? r[2] : r[1], opts: opts.map(x => esc(planetN(x, ar))), ans: opts.indexOf(r[0]), exp: esc(exp), go: 'SOL-science'};
    }
  };

  function makeRound() {
    const kinds = S.topic === 'all' ? KINDS.map(k => k[0]) : [S.topic], ar = state.lang === 'ar', lvl = KIDS ? 'easy' : S.level, qs = [], seen = new Set();
    let order = []; while (order.length < S.count) order = order.concat(shuffle(kinds));
    for (let i = 0, tries = 0; qs.length < S.count && tries < S.count * 20; tries++) {
      const q = MAKE[order[i % order.length]](lvl, ar); const qkey = q && q.q + (q.fig || '') + (q.two ? q.opts.slice().sort().join('|') : ''); if (!q || seen.has(qkey)) continue;
      seen.add(qkey); qs.push(q); i++;
    }
    return {qs, i: 0, score: 0, picked: null, lang: state.lang};
  }

  const TX = {
    en: {eyebrow: 'Quiz', h: 'Test your knowledge', sub: 'Questions about the constellations, the stars, the stories and the planets, made from everything in Sky Guide.', count: 'How many questions', level: 'Level', easy: 'Easy', hard: 'Hard', easyN: 'Famous stars and constellations', hardN: 'All of them', topic: 'Topic', all: 'Everything, mixed', start: 'Start the quiz', kids: 'Kids mode is on: easy questions only.', best: 'Your best', of: 'of', q: 'Question', score: 'Score', next: 'Next question', finish: 'See my score', right: 'Correct!', wrong: 'Not quite.', open: 'Open it in Sky Guide', doneH: 'Your score', again: 'Play again', change: 'Change the settings', newBest: 'New best score!', none: 'No best score yet', missed: 'Questions to look at again', perfect: 'Perfect score! Every answer was right.', quit: 'Stop the quiz'},
    ar: {eyebrow: 'اختبر معلوماتك', h: 'اختبر معلوماتك', sub: 'أسئلة عن الكوكبات والنجوم والقصص والكواكب، مأخوذة من كل ما في Sky Guide.', count: 'عدد الأسئلة', level: 'المستوى', easy: 'سهل', hard: 'صعب', easyN: 'النجوم والكوكبات المشهورة', hardN: 'كلها', topic: 'الموضوع', all: 'كل شيء، مختلط', start: 'ابدأ الاختبار', kids: 'وضع الأطفال مفعّل: أسئلة سهلة فقط.', best: 'أفضل نتيجة لك', of: 'من', q: 'السؤال', score: 'النتيجة', next: 'السؤال التالي', finish: 'اعرض نتيجتي', right: 'إجابة صحيحة!', wrong: 'ليست الإجابة الصحيحة.', open: 'افتحه في Sky Guide', doneH: 'نتيجتك', again: 'العب مرة أخرى', change: 'غيّر الإعدادات', newBest: 'أفضل نتيجة جديدة!', none: 'لا توجد نتيجة سابقة بعد', missed: 'أسئلة تستحق المراجعة', perfect: 'نتيجة كاملة! كل إجاباتك صحيحة.', quit: 'أوقف الاختبار'}};
  const bestKey = () => S.count + '-' + (KIDS ? 'easy' : S.level);

  function setupHTML(t, ar) {
    const lvl = KIDS ? 'easy' : S.level, b = S.best[bestKey()];
    let h = `<div class="qz-set">`;
    h += `<div class="qz-row"><span class="qz-l">${t.count}</span><div class="qz-seg" role="group" aria-label="${t.count}">${COUNTS.map(n => `<button type="button" data-qc="${n}" aria-pressed="${S.count === n}">${n}</button>`).join('')}</div></div>`;
    h += `<div class="qz-row"><span class="qz-l">${t.level}</span>${KIDS ? `<p class="qz-kid">🧒 ${t.kids}</p>` : `<div class="qz-seg" role="group" aria-label="${t.level}">${['easy', 'hard'].map(l => `<button type="button" data-ql="${l}" aria-pressed="${lvl === l}">${t[l]}<small>${t[l + 'N']}</small></button>`).join('')}</div>`}</div>`;
    h += `<div class="qz-row"><label class="qz-l" for="qztopic">${t.topic}</label><select id="qztopic" class="qz-sel"><option value="all"${S.topic === 'all' ? ' selected' : ''}>${t.all}</option>${KINDS.map(([id, en, a]) => `<option value="${id}"${S.topic === id ? ' selected' : ''}>${ar ? a : en}</option>`).join('')}</select></div>`;
    h += `<div class="qz-go"><button type="button" class="pbtn main qz-start" data-qa="start">${t.start}</button><span class="qz-best">${t.best}: ${b != null ? `<b>${b}</b> ${t.of} ${S.count}` : t.none}</span></div></div>`;
    return h;
  }

  function questionHTML(t, ar) {
    const Q = G.qs[G.i], n = G.qs.length, done = G.picked != null;
    let h = `<div class="qz-top"><span>${t.q} <b>${G.i + 1}</b> ${t.of} ${n}</span><span>${t.score}: <b>${G.score}</b></span><button type="button" class="qz-quit" data-qa="quit">${t.quit}</button></div>`;
    h += `<div class="qz-bar" aria-hidden="true"><span style="width:${(100 * (G.i + (done ? 1 : 0)) / n).toFixed(1)}%"></span></div>`;
    h += `<h3 class="qz-q">${Q.q}</h3>${Q.fig || ''}`;
    h += `<div class="qz-opts${Q.two ? ' two' : ''}" role="group">${Q.opts.map((o, i) => {
      const cls = !done ? '' : i === Q.ans ? ' ok' : i === G.picked ? ' no' : ' dim';
      return `<button type="button" class="qz-opt${cls}" data-qo="${i}"${done ? ' disabled' : ''}><span class="qz-k" aria-hidden="true">${'ABCD'[i]}</span><span>${o}</span>${done && i === Q.ans ? '<span class="qz-tick" aria-hidden="true">✓</span>' : done && i === G.picked ? '<span class="qz-tick" aria-hidden="true">✗</span>' : ''}</button>`; }).join('')}</div>`;
    if (done) {
      const ok = G.picked === Q.ans;
      h += `<div class="qz-exp ${ok ? 'ok' : 'no'}" role="status"><b>${ok ? t.right : t.wrong}</b> ${Q.exp}</div>`;
      h += `<div class="qz-go"><button type="button" class="pbtn main" data-qa="next">${G.i + 1 < n ? t.next : t.finish}</button><a class="pbtn" href="#${Q.go}"${Q.part ? ` data-qpart="${Q.part}"` : ''}>${t.open}</a></div>`;
    }
    return h;
  }

  function endHTML(t, ar) {
    const n = G.qs.length, k = bestKey(), prev = S.best[k];
    if (!G.saved) { G.saved = true; G.newBest = prev == null || G.score > prev; if (G.newBest) { S.best[k] = G.score; keep(); } }
    const pct = n ? G.score / n : 0;
    let h = `<div class="qz-end"><div class="qz-big">${G.score} <small>${t.of} ${n}</small></div>`;
    h += `<p>${G.score === n ? t.perfect : ''}${G.newBest && prev != null ? ` <b>${t.newBest}</b>` : ''}</p>`;
    h += `<div class="qz-bar" aria-hidden="true"><span style="width:${(100 * pct).toFixed(0)}%"></span></div>`;
    h += `<p class="qz-best">${t.best}: <b>${S.best[k]}</b> ${t.of} ${S.count}</p>`;
    const miss = G.qs.filter(q => q.got === false);
    if (miss.length) h += `<h4>${t.missed}</h4><ul class="qz-miss">${miss.map(q => `<li><span>${q.q}</span><span class="qz-ans">${q.opts[q.ans]}</span> <a href="#${q.go}">${t.open}</a></li>`).join('')}</ul>`;
    h += `<div class="qz-go"><button type="button" class="pbtn main" data-qa="again">${t.again}</button><button type="button" class="pbtn" data-qa="setup">${t.change}</button></div></div>`;
    return h;
  }

  function render() {
    const card = document.getElementById('card'), ar = state.lang === 'ar', lang = ar ? 'ar' : 'en', t = TX[lang];
    if (G && G.lang !== state.lang && G.picked == null && !G.end) G = null;   // language changed: start again in the new language
    card.style.setProperty('--cc', '#8b7cf6');
    let h = `<div class="card-head"><div><div class="eyebrow"${ar ? ' lang="ar" style="letter-spacing:0;text-transform:none;font-family:var(--f-ar);font-size:15px"' : ''}><span class="dot"></span>${t.eyebrow}</div><h2${ar ? ' lang="ar" style="font-family:var(--f-ar)"' : ''}>${t.h}</h2>${G ? '' : `<p class="gls"${ar ? ' lang="ar" dir="rtl"' : ''}>${t.sub}</p>`}</div></div>`;
    h += `<div class="sci-tools"><div class="langs" role="group" aria-label="Language">${[['en', 'English'], ['ar', 'العربية']].map(([id, l]) => `<button type="button" data-lang="${id}" aria-pressed="${lang === id}"${id === 'ar' ? ' lang="ar"' : ''}>${l}</button>`).join('')}</div>${kidBtn(ar)}</div>`;
    h += `<div class="quiz${ar ? ' rtl' : ''}" id="quiz"${ar ? ' dir="rtl" lang="ar"' : ''}>` + (!G ? setupHTML(t, ar) : G.end ? endHTML(t, ar) : questionHTML(t, ar)) + `</div>`;
    card.innerHTML = h;
    card.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => { state.lang = b.dataset.lang; try { localStorage.setItem('osms-lang', state.lang); } catch (e) {} render(); }));
    const top = () => { const e = document.getElementById('quiz'); if (e && e.getBoundingClientRect().top < 0) window.scrollTo({top: Math.max(0, e.getBoundingClientRect().top + scrollY - 80)}); };
    card.querySelectorAll('[data-qc]').forEach(b => b.addEventListener('click', () => { S.count = +b.dataset.qc; keep(); render(); }));
    card.querySelectorAll('[data-ql]').forEach(b => b.addEventListener('click', () => { S.level = b.dataset.ql; keep(); render(); }));
    const sel = card.querySelector('#qztopic'); if (sel) sel.addEventListener('change', () => { S.topic = sel.value; keep(); });
    card.querySelectorAll('[data-qo]').forEach(b => b.addEventListener('click', () => { if (!G || G.picked != null) return; G.picked = +b.dataset.qo; const Q = G.qs[G.i]; Q.got = G.picked === Q.ans; if (Q.got) G.score++; render(); const ex = document.querySelector('.qz-exp'); if (ex && ex.getBoundingClientRect().bottom > innerHeight) ex.scrollIntoView({block: 'nearest', behavior: 'smooth'}); }));
    card.querySelectorAll('[data-qa]').forEach(b => b.addEventListener('click', () => { const a = b.dataset.qa;
      if (a === 'start' || a === 'again') { G = makeRound(); }
      else if (a === 'next') { G.i++; G.picked = null; if (G.i >= G.qs.length) G.end = true; }
      else if (a === 'quit' || a === 'setup') { G = null; }
      render(); top(); }));
  }
  return {render, _make: MAKE};
})();

