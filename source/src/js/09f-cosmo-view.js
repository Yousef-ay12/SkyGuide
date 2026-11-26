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
  // a patch of cosmic web: clusters joined by filaments, with empty voids between
  web(ar) {
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const N = [[80, 60], [230, 40], [380, 90], [540, 50], [130, 190], [300, 210], [470, 200], [600, 170], [60, 300], [250, 320], [420, 310], [580, 300]];
    const E = [[0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [2, 6], [3, 7], [4, 5], [5, 6], [6, 7], [4, 8], [4, 9], [5, 9], [6, 10], [9, 10], [10, 11], [7, 11]];
    let s = `<svg class="cosfig" viewBox="0 0 640 340" role="img" aria-label="${ar ? 'الشبكة الكونية: عناقيد تصلها خيوط من المجرات، وبينها فراغات' : 'The cosmic web: clusters joined by filaments of galaxies, with voids between'}" dir="ltr"><rect x="0" y="0" width="640" height="340" rx="12" class="cf-sky"/>`;
    E.forEach(([a, b]) => { const [x1, y1] = N[a], [x2, y2] = N[b];
      for (let i = 0; i < 26; i++) { const t = rnd(), j = (rnd() - 0.5) * 16; const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
        s += `<circle cx="${(x1 + dx * t - dy / L * j).toFixed(1)}" cy="${(y1 + dy * t + dx / L * j).toFixed(1)}" r="${(0.9 + rnd() * 1.1).toFixed(1)}" class="cf-gx"/>`; } });
    N.forEach(([x, y]) => { for (let i = 0; i < 22; i++) { const r = rnd() * 11, a = rnd() * 6.283; s += `<circle cx="${(x + r * Math.cos(a)).toFixed(1)}" cy="${(y + r * Math.sin(a)).toFixed(1)}" r="1.4" class="cf-gx"/>`; } s += `<circle cx="${x}" cy="${y}" r="15" class="cf-halo"/>`; });
    s += `<text x="300" y="134" class="cf-lb" text-anchor="middle">${ar ? 'فراغ' : 'void'}</text><text x="300" y="262" class="cf-lb" text-anchor="middle">${ar ? 'فراغ' : 'void'}</text>`;
    s += `<text x="${N[5][0] + 20}" y="${N[5][1] + 4}" class="cf-lb">${ar ? 'عنقود' : 'cluster'}</text><text x="440" y="66" class="cf-lb">${ar ? 'خيط' : 'filament'}</text>`;
    return s + `</svg><p class="cf-cap">${ar ? 'رسم توضيحي، لا خريطة حقيقية. كل نقطة مجرة.' : 'A sketch, not a real map. Each dot is a galaxy.'}</p>`;
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
