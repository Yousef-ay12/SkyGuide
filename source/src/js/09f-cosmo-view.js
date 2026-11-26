/* ---------- Cosmology page: four parts, each a set of folding topics, with drawings ---------- */
let COS_PART = 'lss';
try { const v = localStorage.getItem('osms-cos'); if (v) COS_PART = v; } catch (e) {}
const COS_FIG = {
  // our address in the universe: each step is 10 to 100 times bigger than the last
  ladder(ar) {
    const rows = [[3, 'Local Bubble', 'الفقاعة المحلية', '1,000'], [5, 'Milky Way', 'درب التبانة', '100,000'], [7, 'Local Group', 'المجموعة المحلية', '10 million'], [7.54, 'Local Volume', 'الحجم المحلي', '35 million'], [8.04, 'Local Supercluster', 'العنقود الفائق المحلي', '110 million'], [8.72, 'Laniakea', 'لانياكيا', '520 million']];
    const mil = {'10 million': '10 ملايين', '35 million': '35 مليون', '110 million': '110 ملايين', '520 million': '520 مليون', '1,000': '1000', '100,000': '100 ألف'};
    const W = 640, x0 = 18, x1 = 600, sx = v => x0 + (v - 2.6) / (9 - 2.6) * (x1 - x0);
    let s = `<svg class="cosfig" viewBox="0 0 ${W} 250" role="img" aria-label="${ar ? 'أحجام البنى من الفقاعة المحلية إلى لانياكيا، بمقياس لوغاريتمي' : 'Sizes from the Local Bubble to Laniakea, on a scale where each step is ten times bigger'}" dir="ltr">`;
    rows.forEach(([v, en, a, n], i) => { const y = 14 + i * 36, w = sx(v) - x0;
      s += `<text x="${x0}" y="${y + 10}" class="cf-t">${ar ? a : en} · ${ar ? mil[n] + ' سنة ضوئية' : n + ' light-years'}</text><rect x="${x0}" y="${y + 15}" width="${w.toFixed(1)}" height="10" rx="5" class="cf-bar" style="opacity:${(0.45 + i * 0.1).toFixed(2)}"/>`; });
    [3, 4, 5, 6, 7, 8, 9].forEach(v => { s += `<line x1="${sx(v).toFixed(1)}" y1="236" x2="${sx(v).toFixed(1)}" y2="242" class="cf-ax"/><text x="${sx(v).toFixed(1)}" y="250" text-anchor="middle" class="cf-s">10${['³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'][v - 3]}</text>`; });
    return s + `<line x1="${x0}" y1="236" x2="${x1}" y2="236" class="cf-ax"/></svg><p class="cf-cap">${ar ? 'كل خطوة على المحور أكبر بعشر مرات من سابقتها (بالسنوات الضوئية).' : 'Each step along the axis is ten times bigger than the last (in light-years).'}</p>`;
  },
  pie(ar) {
    const parts = [[68, ar ? 'طاقة مظلمة' : 'dark energy', 'cf-de'], [27, ar ? 'مادة مظلمة' : 'dark matter', 'cf-dm'], [5, ar ? 'مادة عادية' : 'normal matter', 'cf-nm']];
    let x = 0, s = `<svg class="cosfig" viewBox="0 0 640 92" role="img" aria-label="${ar ? '68% طاقة مظلمة، 27% مادة مظلمة، 5% مادة عادية' : '68% dark energy, 27% dark matter, 5% normal matter'}" dir="ltr">`;
    parts.forEach(([p, l, c]) => { const w = p * 6.2; s += `<rect x="${(10 + x).toFixed(1)}" y="12" width="${w.toFixed(1)}" height="30" class="${c}"/>`; x += w; });
    s += `<text x="12" y="66" class="cf-t">68% ${parts[0][1]}</text><text x="${(10 + 68 * 6.2 + 4).toFixed(1)}" y="66" class="cf-t">27% ${parts[1][1]}</text><text x="630" y="86" text-anchor="end" class="cf-t">5% ${parts[2][1]}</text>`;
    return s + `</svg>`;
  },
  // an L-shaped laser interferometer
  ifo(ar) {
    const T = ar ? {laser: 'ليزر', split: 'مقسّم الشعاع', m: 'مرآة', det: 'الكاشف', arm: 'ذراع 4 كم'} : {laser: 'laser', split: 'beam splitter', m: 'mirror', det: 'detector', arm: '4 km arm'};
    return `<svg class="cosfig" viewBox="0 0 640 300" role="img" aria-label="${ar ? 'مقياس تداخل ليزري على شكل L' : 'An L-shaped laser interferometer'}" dir="ltr">
      <rect x="30" y="220" width="70" height="34" rx="6" class="cf-box"/><text x="65" y="242" text-anchor="middle" class="cf-t">${T.laser}</text>
      <line x1="100" y1="237" x2="170" y2="237" class="cf-beam"/><rect x="160" y="222" width="22" height="30" transform="rotate(45 171 237)" class="cf-split"/><text x="150" y="214" text-anchor="end" class="cf-s">${T.split}</text>
      <line x1="182" y1="237" x2="580" y2="237" class="cf-beam"/><line x1="171" y1="226" x2="171" y2="40" class="cf-beam"/>
      <rect x="582" y="215" width="10" height="44" class="cf-mir"/><text x="587" y="205" text-anchor="middle" class="cf-s">${T.m}</text>
      <rect x="149" y="28" width="44" height="10" class="cf-mir"/><text x="205" y="36" class="cf-s">${T.m}</text>
      <text x="380" y="228" text-anchor="middle" class="cf-s">${T.arm}</text><text x="160" y="140" text-anchor="end" class="cf-s">${T.arm}</text>
      <line x1="171" y1="248" x2="171" y2="262" class="cf-beam"/><rect x="138" y="262" width="66" height="26" rx="6" class="cf-box"/><text x="171" y="280" text-anchor="middle" class="cf-t">${T.det}</text>
      <path d="M470 120 q 20 -20 40 0 t 40 0" class="cf-wave"/><path d="M470 140 q 20 -20 40 0 t 40 0" class="cf-wave"/><text x="510" y="100" text-anchor="middle" class="cf-s">${ar ? 'موجة جاذبية' : 'gravitational wave'}</text>
    </svg><p class="cf-cap">${ar ? 'حين تمر موجة يطول أحد الذراعين ويقصر الآخر، فيرتعش الضوء عند الكاشف.' : 'A passing wave makes one arm longer and the other shorter, so the light at the detector flickers.'}</p>`;
  },
  // the three stages of a disk galaxy's birth
  disk(ar) {
    const L = ar ? ['1. سحابة حارة تدور ببطء', '2. انهيار على محور الدوران', '3. قرص بارد أُسّي'] : ['1. hot, slowly spinning cloud', '2. collapse along the spin axis', '3. cold exponential disk'];
    return `<svg class="cosfig" viewBox="0 0 640 210" role="img" aria-label="${L.join('، ')}" dir="ltr"><defs><radialGradient id="cf-g1"><stop offset="0" class="cf-st-hot"/><stop offset="1" class="cf-st-hot" stop-opacity="0.15"/></radialGradient><radialGradient id="cf-g3"><stop offset="0" class="cf-st-cold"/><stop offset="0.35" class="cf-st-cold" stop-opacity="0.55"/><stop offset="1" class="cf-st-cold" stop-opacity="0"/></radialGradient></defs>
      <circle cx="105" cy="92" r="70" fill="url(#cf-g1)"/><path d="M60 40 a 70 20 0 0 1 90 0" class="cf-spin"/><text x="105" y="196" text-anchor="middle" class="cf-t">${L[0]}</text>
      <ellipse cx="320" cy="92" rx="72" ry="40" fill="url(#cf-g1)"/><line x1="320" y1="18" x2="320" y2="48" class="cf-arr"/><line x1="320" y1="166" x2="320" y2="136" class="cf-arr"/><path d="M314 42 l6 8 l6 -8 M314 142 l6 -8 l6 8" class="cf-arr"/><text x="320" y="196" text-anchor="middle" class="cf-t">${L[1]}</text>
      <ellipse cx="535" cy="92" rx="88" ry="12" fill="url(#cf-g3)"/><ellipse cx="535" cy="92" rx="18" ry="8" class="cf-core"/><text x="535" y="196" text-anchor="middle" class="cf-t">${L[2]}</text>
    </svg>`;
  },
  // Hubble's tuning fork
  fork(ar) {
    const el = (cx, rx, ry, l) => `<ellipse cx="${cx}" cy="110" rx="${rx}" ry="${ry}" class="cf-ell"/><text x="${cx}" y="150" text-anchor="middle" class="cf-s">${l}</text>`;
    const sp = (cx, cy, l, bar, tight) => { const k = tight; let p = `M${cx} ${cy}`; for (let a = 0; a < 9.5; a += 0.35) { const r = 3 + a * k; p += ` L${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a) * 0.6).toFixed(1)}`; } let q = `M${cx} ${cy}`; for (let a = 0; a < 9.5; a += 0.35) { const r = 3 + a * k; q += ` L${(cx - r * Math.cos(a)).toFixed(1)} ${(cy - r * Math.sin(a) * 0.6).toFixed(1)}`; }
      return `${bar ? `<line x1="${cx - 12}" y1="${cy}" x2="${cx + 12}" y2="${cy}" class="cf-barl"/>` : `<circle cx="${cx}" cy="${cy}" r="5" class="cf-core"/>`}<path d="${p}" class="cf-arm"/><path d="${q}" class="cf-arm"/><text x="${cx}" y="${cy + 34}" text-anchor="middle" class="cf-s">${l}</text>`; };
    return `<svg class="cosfig" viewBox="0 0 640 230" role="img" aria-label="${ar ? 'شوكة هابل الرنانة لتصنيف المجرات' : 'Hubble\'s tuning fork of galaxy shapes'}" dir="ltr">
      <path d="M262 110 L320 110 M320 110 L360 52 L620 52 M320 110 L360 168 L620 168" class="cf-ax"/>
      ${el(40, 22, 22, 'E0')}${el(110, 24, 15, 'E3')}${el(178, 26, 8, 'E7')}<ellipse cx="250" cy="110" rx="26" ry="7" class="cf-ell"/><circle cx="250" cy="110" r="5" class="cf-core"/><text x="250" y="150" text-anchor="middle" class="cf-s">S0</text>
      ${sp(410, 50, 'Sa', false, 1.2)}${sp(490, 50, 'Sb', false, 1.8)}${sp(570, 50, 'Sc', false, 2.4)}
      ${sp(410, 170, 'SBa', true, 1.2)}${sp(490, 170, 'SBb', true, 1.8)}${sp(570, 170, 'SBc', true, 2.4)}
      <text x="110" y="200" text-anchor="middle" class="cf-t">${ar ? 'إهليلجية' : 'ellipticals'}</text><text x="250" y="200" text-anchor="middle" class="cf-t">${ar ? 'عدسية' : 'lenticular'}</text><text x="630" y="20" text-anchor="end" class="cf-t">${ar ? 'حلزونية' : 'spirals'}</text><text x="630" y="225" text-anchor="end" class="cf-t">${ar ? 'حلزونية ذات قضيب' : 'barred spirals'}</text>
    </svg>`;
  },
  merge(ar) {
    const L = ar ? ['1. قرصان غنيان بالغاز', '2. استرخاء عنيف', '3. مجرة إهليلجية'] : ['1. gas-rich disks', '2. violent relaxation', '3. elliptical galaxy'];
    return `<svg class="cosfig" viewBox="0 0 640 200" role="img" aria-label="${L.join('، ')}" dir="ltr">
      <ellipse cx="70" cy="80" rx="36" ry="12" transform="rotate(-25 70 80)" class="cf-disk"/><ellipse cx="145" cy="105" rx="34" ry="11" transform="rotate(30 145 105)" class="cf-disk"/><path d="M40 98 q -20 40 20 70 M175 85 q 30 -40 -5 -70" class="cf-tail"/><text x="105" y="190" text-anchor="middle" class="cf-t">${L[0]}</text>
      <path d="M290 70 q 40 -40 70 0 q 30 30 -10 55 q -40 25 -65 -5 q -20 -25 5 -50 z" class="cf-disk"/><path d="M285 120 q -25 30 5 55 M360 60 q 25 -20 10 -45" class="cf-tail"/><text x="320" y="190" text-anchor="middle" class="cf-t">${L[1]}</text>
      <ellipse cx="535" cy="95" rx="60" ry="42" class="cf-ellg"/><ellipse cx="535" cy="95" rx="22" ry="15" class="cf-core"/><text x="535" y="190" text-anchor="middle" class="cf-t">${L[2]}</text>
    </svg>`;
  },
  lens(ar) {
    const T = ar ? {src: 'مجرة بعيدة', lens: 'عنقود (العدسة)', obs: 'الأرض', img: 'صور مزاحة'} : {src: 'distant galaxy', lens: 'cluster (the lens)', obs: 'Earth', img: 'shifted images'};
    return `<svg class="cosfig" viewBox="0 0 640 230" role="img" aria-label="${ar ? 'عدسة الجاذبية: العنقود يحني ضوء مجرة خلفه' : 'A gravitational lens: a cluster bends the light of a galaxy behind it'}" dir="ltr">
      <ellipse cx="40" cy="115" rx="14" ry="8" class="cf-disk"/><text x="40" y="150" text-anchor="middle" class="cf-s">${T.src}</text>
      <circle cx="300" cy="115" r="34" class="cf-halo2"/><circle cx="292" cy="108" r="4" class="cf-gx"/><circle cx="308" cy="120" r="5" class="cf-gx"/><circle cx="300" cy="104" r="3" class="cf-gx"/><text x="300" y="172" text-anchor="middle" class="cf-s">${T.lens}</text>
      <path d="M54 113 Q 300 20 600 112" class="cf-ray"/><path d="M54 117 Q 300 210 600 118" class="cf-ray"/>
      <circle cx="606" cy="115" r="9" class="cf-earth"/><text x="606" y="146" text-anchor="middle" class="cf-s">${T.obs}</text>
      <path d="M600 112 L 330 52" class="cf-dash"/><path d="M600 118 L 330 178" class="cf-dash"/><ellipse cx="322" cy="50" rx="13" ry="5" transform="rotate(-12 322 50)" class="cf-disk"/><ellipse cx="322" cy="180" rx="13" ry="5" transform="rotate(12 322 180)" class="cf-disk"/><text x="356" y="30" class="cf-s">${T.img}</text>
    </svg>`;
  },
  shape(ar) {
    const T = ar ? ['مغلق: الزوايا > 180°', 'مفتوح: الزوايا < 180°', 'مسطح: الزوايا = 180°'] : ['closed: angles > 180°', 'open: angles < 180°', 'flat: angles = 180°'];
    return `<svg class="cosfig" viewBox="0 0 640 200" role="img" aria-label="${T.join('، ')}" dir="ltr">
      <circle cx="105" cy="85" r="62" class="cf-surf"/><path d="M75 55 Q 105 40 140 58 Q 140 100 110 118 Q 80 96 75 55 Z" class="cf-tri"/><text x="105" y="185" text-anchor="middle" class="cf-t">${T[0]}</text>
      <path d="M250 60 Q 320 110 390 60 L 390 110 Q 320 160 250 110 Z" class="cf-surf"/><path d="M270 80 Q 320 95 365 78 Q 335 100 320 128 Q 300 100 270 80 Z" class="cf-tri"/><text x="320" y="185" text-anchor="middle" class="cf-t">${T[1]}</text>
      <path d="M470 120 L 510 55 L 620 55 L 580 120 Z" class="cf-surf"/><path d="M505 108 L 545 64 L 575 108 Z" class="cf-tri"/><text x="545" y="185" text-anchor="middle" class="cf-t">${T[2]}</text>
    </svg><p class="cf-cap">${ar ? 'القياسات تقول إن كوننا مسطح.' : 'Measurements say our universe is flat.'}</p>`;
  },
  // Lambda-CDM: the history of the universe as a widening shape, from the Big Bang to today's speeding-up expansion
  lcdm(ar) {
    let seed = 5; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const st = ar ? ['الانفجار العظيم', 'الخلفية الميكروية', 'أول النجوم', 'المجرات', 'تسارع التمدد'] : ['Big Bang', 'Microwave glow', 'First stars', 'Galaxies', 'Speeding up'];
    const xs = [30, 150, 290, 430, 590], half = x => 8 + Math.pow((x - 20) / 600, 0.6) * 118 + (x > 470 ? (x - 470) * 0.25 : 0);
    let top = '', bot = ''; for (let x = 20; x <= 620; x += 10) { top += (x === 20 ? 'M' : ' L') + x + ' ' + (170 - half(x)).toFixed(1); bot = ' L' + x + ' ' + (170 + half(x)).toFixed(1) + bot; }
    let s = `<svg class="cosfig cfz" viewBox="0 0 640 360" role="img" aria-label="${ar ? 'تاريخ الكون في النموذج القياسي، من الانفجار العظيم إلى التمدد المتسارع اليوم' : 'The history of the universe in the standard model, from the Big Bang to today\'s speeding-up expansion'}" dir="ltr"><rect x="0" y="0" width="640" height="360" rx="12" class="cf-sky"/>`;
    s += `<path d="${top}${bot} Z" class="cf-halo"/>`;
    for (let i = 0; i < 70; i++) { const x = 300 + rnd() * 310, h = half(x) * 0.9; s += `<circle cx="${x.toFixed(1)}" cy="${(170 + (rnd() * 2 - 1) * h).toFixed(1)}" r="${(0.9 + rnd() * 1.3).toFixed(1)}" class="cf-gx"/>`; }
    for (let i = 0; i < 40; i++) { const x = 130 + rnd() * 40, h = half(x) * 0.95; s += `<circle cx="${x.toFixed(1)}" cy="${(170 + (rnd() * 2 - 1) * h).toFixed(1)}" r="1.8" class="${i % 2 ? 'cf-dm' : 'cf-nm'}" opacity=".7"/>`; }
    s += `<circle cx="22" cy="170" r="6" class="cf-nm"/>`;
    xs.forEach((x, i) => { const up = i % 2 === 0; s += `<line x1="${x}" y1="${up ? 34 : 306}" x2="${x}" y2="${(170 + (up ? -1 : 1) * (half(x) + 2)).toFixed(1)}" class="cf-ax" stroke-dasharray="2 4"/><text x="${x}" y="${up ? 26 : 324}" text-anchor="${i === 0 ? 'start' : i === 4 ? 'end' : 'middle'}" class="cf-t">${st[i]}</text>`; });
    s += `<line x1="20" y1="345" x2="612" y2="345" class="cf-ax"/><path d="M620 345 l-9 -5 v10 z" class="cf-nm"/>`;
    return s + `</svg><p class="cf-cap">${ar ? 'رسم توضيحي لـ13.8 مليار سنة من اليسار إلى اليمين: اتساع الشكل يمثّل حجم الكون. التمدد تباطأ أولًا بالجاذبية، ثم بدأ يتسارع قبل نحو 5 مليارات سنة بسبب الطاقة المظلمة.' : 'A sketch of 13.8 billion years, from left to right: the width stands for the size of the universe. Gravity slowed the expansion at first; about 5 billion years ago dark energy made it speed up.'}</p>`;
  },
  // baryon acoustic oscillations: a faint ring of extra galaxies about 490 million light-years from any galaxy
  bao(ar) {
    let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const cx = 320, cy = 175, R = 120;
    let s = `<svg class="cosfig cfz" viewBox="0 0 640 350" role="img" aria-label="${ar ? 'حلقة باهتة من المجرات حول مجرة، قطرها نحو 490 مليون سنة ضوئية' : 'A faint ring of galaxies around a galaxy, about 490 million light-years out'}" dir="ltr"><rect x="0" y="0" width="640" height="350" rx="12" class="cf-sky"/>`;
    for (let i = 0; i < 260; i++) s += `<circle cx="${(10 + rnd() * 620).toFixed(1)}" cy="${(10 + rnd() * 330).toFixed(1)}" r="${(0.8 + rnd()).toFixed(1)}" class="cf-gx" opacity=".55"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" class="cf-halo2" style="fill:none"/>`;
    for (let i = 0; i < 70; i++) { const a = rnd() * 6.283, d = R + (rnd() - 0.5) * 16; s += `<circle cx="${(cx + Math.cos(a) * d).toFixed(1)}" cy="${(cy + Math.sin(a) * d).toFixed(1)}" r="${(1.6 + rnd() * 1.2).toFixed(1)}" class="cf-nm"/>`; }
    s += `<circle cx="${cx}" cy="${cy}" r="6" class="cf-nm"/><line x1="${cx}" y1="${cy}" x2="${cx + R}" y2="${cy}" class="cf-ax"/><text x="${cx + R / 2}" y="${cy - 8}" text-anchor="middle" class="cf-t">${ar ? '490 مليون سنة ضوئية' : '490 million light-years'}</text>`;
    return s + `</svg><p class="cf-cap">${ar ? 'رسم توضيحي، والحلقة مبالغ فيها كثيرًا: في السماء الحقيقية لا تظهر إلا بقياس ملايين المجرات.' : 'A sketch, with the ring greatly exaggerated: in the real sky it only shows up when millions of galaxies are measured.'}</p>`;
  },
  // from ripples to a web: nearly smooth matter, then clumps, then filaments and voids
  ripples(ar) {
    let seed = 9; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const T = ar ? ['شبه متجانس', 'تنمو التكتلات', 'الشبكة الكونية'] : ['Almost smooth', 'Clumps grow', 'The cosmic web'];
    const K = [[40, 60], [150, 45], [100, 150], [35, 230], [160, 250], [110, 300]];
    let s = `<svg class="cosfig cfz" viewBox="0 0 640 380" role="img" aria-label="${ar ? 'ثلاث مراحل: مادة شبه متجانسة، ثم تكتلات، ثم شبكة من الخيوط والفراغات' : 'Three stages: almost smooth matter, then clumps, then a web of filaments and voids'}" dir="ltr">`;
    [0, 1, 2].forEach(k => { const x0 = 10 + k * 210;
      s += `<rect x="${x0}" y="10" width="200" height="330" rx="12" class="cf-sky"/><text x="${x0 + 100}" y="366" text-anchor="middle" class="cf-s">${T[k]}</text>`;
      const P = K.map(([x, y]) => [x0 + 10 + x, 10 + y]);
      if (k === 2) [[0, 1], [0, 2], [1, 2], [2, 3], [2, 4], [3, 4], [4, 5], [3, 5]].forEach(([a, b]) => { const [x1, y1] = P[a], [x2, y2] = P[b];
        for (let i = 0; i < 22; i++) { const t = rnd(), j = (rnd() - 0.5) * 8; s += `<circle cx="${(x1 + (x2 - x1) * t + j).toFixed(1)}" cy="${(y1 + (y2 - y1) * t + j).toFixed(1)}" r="1.1" class="cf-gx"/>`; } });
      for (let i = 0; i < 240; i++) { let x, y;
        if (k === 0) { x = x0 + 8 + rnd() * 184; y = 18 + rnd() * 314; }
        else { const n = P[i % 6], sp = k === 1 ? 30 : 12; x = n[0] + (rnd() - 0.5) * sp * 2; y = n[1] + (rnd() - 0.5) * sp * 2; }
        s += `<circle cx="${Math.min(x0 + 196, Math.max(x0 + 4, x)).toFixed(1)}" cy="${Math.min(336, Math.max(14, y)).toFixed(1)}" r="1" class="cf-gx" opacity="${k === 0 ? 0.6 : 0.85}"/>`; }
      if (k === 2) P.forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="13" class="cf-halo"/>`; });
      if (k < 2) s += `<text x="${x0 + 205}" y="180" text-anchor="middle" class="cf-t">›</text>`; });
    return s + `</svg><p class="cf-cap">${ar ? 'رسم توضيحي: الجاذبية تجعل المناطق الأكثف قليلًا تجذب مادة أكثر، فتتحول التموجات الصغيرة إلى عناقيد وخيوط وفراغات.' : 'A sketch: gravity lets slightly denser places pull in more matter, so tiny ripples become clusters, filaments and voids.'}</p>`;
  },
  // redshift: light from a far galaxy is stretched on its way, so it arrives redder
  redshift(ar) {
    let p = 'M548 140'; for (let x = 548; x >= 86; x -= 2) { const t = (548 - x) / 462, lam = 22 + t * 52; p += ` L${x} ${(140 + Math.sin((548 - x) / lam * 6.283) * (22 - t * 6)).toFixed(1)}`; }
    let s = `<svg class="cosfig cfz" viewBox="0 0 640 270" role="img" aria-label="${ar ? 'موجة ضوء تتمدد وتحمرّ في طريقها من مجرة بعيدة' : 'A light wave stretching and turning redder on its way from a far galaxy'}" dir="ltr"><defs><linearGradient id="cfrs" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#e2553f"/><stop offset=".45" stop-color="#e6c26a"/><stop offset="1" stop-color="#6f9bff"/></linearGradient></defs><rect x="0" y="0" width="640" height="270" rx="12" class="cf-sky"/>`;
    s += `<ellipse cx="575" cy="140" rx="30" ry="12" class="cf-gx"/><circle cx="50" cy="140" r="12" class="cf-nm"/><path d="${p}" fill="none" stroke="url(#cfrs)" stroke-width="3"/>`;
    s += `<text x="575" y="180" text-anchor="middle" class="cf-t">${ar ? 'مجرة بعيدة' : 'far galaxy'}</text><text x="50" y="180" text-anchor="middle" class="cf-t">${ar ? 'نحن' : 'us'}</text>`;
    s += `<text x="320" y="70" text-anchor="middle" class="cf-s">${ar ? 'يتمدد الفضاء أثناء رحلة الضوء، فتطول موجته ويحمرّ لونه' : 'space stretches while the light travels, so its waves get longer and redder'}</text>`;
    s += `<line x1="60" y1="225" x2="580" y2="225" class="cf-ax"/><path d="M580 225 l-8 -5 v10 z" class="cf-nm"/><text x="320" y="250" text-anchor="middle" class="cf-t">${ar ? 'كلما بعدت المجرة، ابتعدت عنا أسرع وازداد احمرار ضوئها' : 'the farther the galaxy, the faster it moves away and the redder its light'}</text>`;
    return s + `</svg>`;
  },
  // turning a map into numbers: a spotty map is broken into spots of each size, giving the power spectrum's row of peaks
  powerspec(ar) {
    let seed = 13; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    let s = `<svg class="cosfig cfz" viewBox="0 0 640 330" role="img" aria-label="${ar ? 'خريطة مبقعة تتحول إلى منحنى فيه صف من القمم: طيف القدرة' : 'A spotty map turned into a curve with a row of peaks: the power spectrum'}" dir="ltr">`;
    s += `<rect x="10" y="10" width="220" height="250" rx="12" class="cf-sky"/>`;
    for (let i = 0; i < 150; i++) s += `<circle cx="${(22 + rnd() * 196).toFixed(1)}" cy="${(22 + rnd() * 226).toFixed(1)}" r="${(3 + rnd() * 9).toFixed(1)}" class="${rnd() < 0.5 ? 'cf-dm' : 'cf-nm'}" opacity=".45"/>`;
    s += `<text x="120" y="290" text-anchor="middle" class="cf-t">${ar ? 'الخريطة' : 'the map'}</text><text x="252" y="140" text-anchor="middle" class="cf-t">›</text>`;
    const X0 = 290, X1 = 625, Y0 = 250, H = 210; let d = '';
    for (let i = 0; i <= 160; i++) { const x = i / 160, y = Math.exp(-2.1 * x) * Math.pow(Math.cos(Math.PI * (x * 3.4 - 0.5)), 2) * 0.92 + 0.08 * Math.exp(-3 * x);
      d += (i ? ' L' : 'M') + (X0 + x * (X1 - X0)).toFixed(1) + ' ' + (Y0 - y * H).toFixed(1); }
    s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" class="cf-ax"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="20" class="cf-ax"/><path d="${d}" fill="none" stroke-width="3" class="cf-wave"/>`;
    s += `<text x="${X0 + 8}" y="34" class="cf-s">${ar ? 'قوة البقع' : 'how strong'}</text><text x="${X1}" y="${Y0 + 22}" text-anchor="end" class="cf-s">${ar ? 'بقع أصغر →' : 'smaller spots →'}</text>`;
    s += `<text x="${(X0 + X1) / 2}" y="290" text-anchor="middle" class="cf-t">${ar ? 'طيف القدرة' : 'the power spectrum'}</text>`;
    return s + `</svg><p class="cf-cap">${ar ? 'رسم توضيحي: تُحلَّل الخريطة إلى بقع من كل حجم، وتُقاس قوة كل حجم. موضع القمم وارتفاعها يكشفان مكونات الكون وشكل الفضاء.' : 'A sketch: the map is broken into spots of each size, and how strong each size is gets measured. Where the peaks sit and how tall they are tell us what the universe is made of and the shape of space.'}</p>`;
  },
  // gravity against expansion: space carries everything apart, but a dense region pulls itself together
  gravity(ar) {
    const head = (x, y, a, c) => { const p = (r, t) => `${(x + Math.cos(a + t) * r).toFixed(1)},${(y + Math.sin(a + t) * r).toFixed(1)}`; return `<polygon points="${p(6, 0)} ${p(6, 2.5)} ${p(6, -2.5)}" class="${c}"/>`; };
    let seed = 21; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const cx = 320, cy = 160;
    let s = `<svg class="cosfig cfz" viewBox="0 0 640 330" role="img" aria-label="${ar ? 'الفضاء يتمدد حول منطقة كثيفة تنهار على نفسها' : 'Space expanding around a dense region that collapses on itself'}" dir="ltr"><rect x="0" y="0" width="640" height="300" rx="12" class="cf-sky"/>`;
    for (let i = 0; i < 26; i++) { const a = rnd() * 6.283, r = 160 + rnd() * 130, x = cx + Math.cos(a) * r * 1.15, y = cy + Math.sin(a) * r * 0.55;
      if (x < 20 || x > 620 || y < 18 || y > 282) continue;
      const ex = x + Math.cos(a) * 22, ey = y + Math.sin(a) * 11;
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.2" class="cf-gx"/><line x1="${(x + Math.cos(a) * 5).toFixed(1)}" y1="${(y + Math.sin(a) * 3).toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" class="cf-ax"/>` + head(ex, ey, Math.atan2(ey - y, ex - x), 'cf-mir'); }
    s += `<circle cx="${cx}" cy="${cy}" r="78" class="cf-halo2" style="fill:none"/>`;
    for (let i = 0; i < 60; i++) { const a = rnd() * 6.283, r = Math.pow(rnd(), 1.8) * 40; s += `<circle cx="${(cx + Math.cos(a) * r).toFixed(1)}" cy="${(cy + Math.sin(a) * r).toFixed(1)}" r="${(1.2 + rnd() * 1.4).toFixed(1)}" class="cf-nm"/>`; }
    for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283 + 0.3, x1 = cx + Math.cos(a) * 74, y1 = cy + Math.sin(a) * 74, x2 = cx + Math.cos(a) * 52, y2 = cy + Math.sin(a) * 52;
      s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke-width="2.5" class="cf-wave"/>` + head(x2, y2, a + Math.PI, 'cf-dm'); }
    s += `<text x="${cx}" y="322" text-anchor="middle" class="cf-t">${ar ? 'في الداخل تغلب الجاذبية، وفي الخارج يغلب التمدد' : 'gravity wins inside, expansion wins outside'}</text>`;
    return s + `</svg><p class="cf-cap">${ar ? 'رسم توضيحي: المنطقة الأكثف قليلًا تجذب المادة إليها حتى تتوقف عن التمدد وتنهار إلى مجرة أو عنقود، بينما يباعد التمدد ما حولها.' : 'A sketch: a slightly denser region pulls matter in until it stops expanding and collapses into a galaxy or cluster, while the expansion carries everything around it apart.'}</p>`;
  }
};
function cosHTML(lang) {
  const ar = lang === 'ar', glo = COS_PART === 'glo', part = COS_PARTS.find(p => p.id === COS_PART) || COS_PARTS[0];
  const fold = (t, body) => `<details class="dsofold cosfold"><summary><span class="pd-ar" aria-hidden="true">▸</span><span class="df-t">${t}</span><span class="df-h" data-o="${ar ? 'اضغط لعرضه' : 'Tap to show'}" data-c="${ar ? 'اضغط لطيّه' : 'Tap to fold'}"></span></summary><div class="cos-b">${body}</div></details>`;
  let h = `<p class="dsec-in">${ar ? 'علم الكون يدرس الكون كله: كيف بدأ، ومِمّ يتكوّن، وكيف نشأت المجرات والبنى الكبرى، وإلى أين يمضي. اختر جزءًا، ثم اضغط أي موضوع لفتحه.' : 'Cosmology studies the universe as a whole: how it began, what it is made of, how galaxies and the largest structures formed, and where it is heading. Choose a part, then tap any topic to open it.'}</p>`;
  h += `<div class="cos-parts" role="group" aria-label="${ar ? 'أجزاء علم الكون' : 'Parts of cosmology'}">${COS_PARTS.map((p, i) => `<button type="button" class="sn${p.id === part.id ? ' on' : ''}" data-cospart="${p.id}" aria-pressed="${p.id === part.id}" style="--cc:var(--c-science)"><span class="cos-n">${i + 1}</span>${ar ? p.ar : p.en}</button>`).join('')}<button type="button" class="sn${glo ? ' on' : ''}" data-cospart="glo" aria-pressed="${glo}" style="--cc:var(--c-science)"><span class="cos-n">Aa</span>${ar ? 'المسرد' : 'Glossary'}</button></div>`;
  if (glo) return h + cosGlossaryHTML(ar) + `<p class="cos-next"><button type="button" class="pbtn" data-cospart="${COS_PARTS[0].id}">${ar ? `ابدأ من: ${COS_PARTS[0].ar} ←` : `Start with: ${COS_PARTS[0].en} →`}</button></p>`;
  let nTopic = 0;
  h += `<h3 class="cos-h">${ar ? part.ar : part.en}</h3><p class="cos-in">${ar ? part.intro[1] : part.intro[0]}</p>`;
  part.groups.forEach(g => {
    h += `<h4 class="cos-g">${ar ? g.ar : g.en}</h4>`;
    if (g.fig && COS_FIG[g.fig]) h += `<figure class="cos-fig">${COS_FIG[g.fig](ar)}</figure>`;
    g.items.forEach(it => {
      let body = COS_PIC.html(it.en, ar) + (ar ? it.a : it.t);
      if (it.fig && COS_FIG[it.fig]) body += `<figure class="cos-fig">${COS_FIG[it.fig](ar)}</figure>`;
      if (it.ex) { const ex = it.ex.map(([k, id]) => { const x = {t: 'dso', key: k, ref: id}, inf = AG.info(x, lang); return inf ? `<span class="cos-ex"><button type="button" class="cos-exn" data-con="${k}">${esc(inf.title)}${inf.sub ? ` <span class="muted">${esc(inf.sub)}</span>` : ''}</button>${AG.btn(x, lang, true)}</span>` : ''; }).join('');
        if (ex) body += `<div class="cos-exs"><span class="sect-lbl">${ar ? 'ابحث عنها في السماء' : 'Find them in the sky'}</span>${ex}</div>`; }
      body += `<p class="cos-share">${SHARE.btn('COS-science/' + part.id + '/' + (nTopic++), ar ? it.ar : it.en, lang)}</p>`;
      h += fold(ar ? it.ar : it.en, body);
    });
  });
  const i = COS_PARTS.indexOf(part), nx = COS_PARTS[i + 1];
  h += `<p class="cos-next"><button type="button" class="pbtn" data-cospart="${nx ? nx.id : 'glo'}">${nx ? (ar ? `التالي: ${nx.ar} ←` : `Next: ${nx.en} →`) : (ar ? 'التالي: المسرد ←' : 'Next: the glossary →')}</button></p>`;
  h += `<p class="vref" style="white-space:normal;margin-top:18px">${ar ? 'المصادر: نتائج قمر بلانك (2018)؛ ناسا وESA؛ تعاون LIGO وVirgo وKAGRA؛ مسح DESI؛ Tully وآخرون، Nature (2014)؛ Zucker وآخرون، Nature (2022). الأرقام مقرّبة.' : 'Sources: Planck 2018 results; NASA and ESA; the LIGO, Virgo and KAGRA collaborations; the DESI survey; Tully et al., Nature (2014); Zucker et al., Nature (2022). Figures are rounded.'}</p>`;
  return h;
}
document.addEventListener('click', ev => {
  const b = ev.target.closest && ev.target.closest('[data-cospart]'); if (!b) return;
  COS_PART = b.dataset.cospart; try { localStorage.setItem('osms-cos', COS_PART); } catch (e) {}
  render();
  const t = document.querySelector('.cos-parts'); if (t) t.scrollIntoView({block: 'start', behavior: 'smooth'});
});
