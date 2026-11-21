/* ---------- Science ---------- */
const NOW = 2026;
const T = {
  en: { stars: 'Main stars', dso: 'Deep-sky objects in this constellation', planets: 'Planets around other stars', nearest: 'Nearest star', see: 'When and where to see it',
        colour: 'Type', dist: 'Distance', temp: 'Temperature', lum: 'Brightness', mag: 'Magnitude', ly: 'light years', rough: 'rough: too far to measure exactly',
        light: 'The light you see tonight left it', voy: 'Voyager 1 (17 km/s, our fastest probe leaving the Solar System)', car: 'A car at 100 km/h', lightT: 'Light',
        none: 'No planets found around it yet.', noDso: 'There are no bright galaxies, clusters or nebulae here: this patch of sky is mostly faint stars.' },
  ar: { stars: 'أبرز النجوم', dso: 'أجرام السماء العميقة في هذه الكوكبة', planets: 'كواكب حول نجوم أخرى', nearest: 'أقرب نجم', see: 'متى وأين تُرى',
        colour: 'النوع', dist: 'المسافة', temp: 'الحرارة', lum: 'شدة الإضاءة', mag: 'القدر', ly: 'سنة ضوئية', rough: 'تقريبية: أبعد من أن تُقاس بدقة',
        light: 'الضوء الذي تراه الليلة غادره', voy: 'فوياجر 1 (17 كم/ث، أسرع مسبار يغادر المجموعة الشمسية)', car: 'سيارة بسرعة 100 كم/س', lightT: 'الضوء',
        none: 'لم يُعثر حوله على كواكب حتى الآن.', noDso: 'لا توجد هنا مجرات أو عناقيد أو سُدُم لامعة، فأكثر هذه الرقعة من السماء نجوم خافتة.' }
};
const COL = { en: {O: 'blue', B: 'blue-white', A: 'white', F: 'yellow-white', G: 'yellow', K: 'orange', M: 'red'},
              ar: {O: 'أزرق', B: 'أزرق مائل إلى البياض', A: 'أبيض', F: 'أبيض مصفرّ', G: 'أصفر', K: 'برتقالي', M: 'أحمر'} };
const KIND = { en: {dwarf: 'main-sequence star', sub: 'subgiant', giant: 'giant', bright: 'bright giant', super: 'supergiant', hyper: 'hypergiant', wd: 'white dwarf', '': 'star'},
               ar: {dwarf: 'نجم من النسق الرئيسي', sub: 'دون العملاق', giant: 'عملاق', bright: 'عملاق ساطع', super: 'عملاق فائق', hyper: 'عملاق مفرط', wd: 'قزم أبيض', '': 'نجم'} };
const DTYPE = {
  en: {G: 'galaxy', GPair: 'pair of galaxies', GTrpl: 'galaxy group', GGroup: 'galaxy group', OCl: 'open star cluster', GCl: 'globular star cluster', PN: 'planetary nebula (a dying star\'s shell)',
       HII: 'star-forming nebula', EmN: 'glowing gas cloud', Neb: 'nebula', RfN: 'reflection nebula (dust lit by stars)', SNR: 'supernova remnant', 'Cl+N': 'star cluster in a nebula', DrkN: 'dark dust cloud', '*Ass': 'loose group of stars'},
  ar: {G: 'مجرة', GPair: 'مجرتان متقاربتان', GTrpl: 'مجموعة مجرات', GGroup: 'مجموعة مجرات', OCl: 'عنقود نجمي مفتوح', GCl: 'عنقود نجمي كروي', PN: 'سديم كوكبي (غلاف نجم يحتضر)',
       HII: 'سديم تولد فيه النجوم', EmN: 'سحابة غاز متوهجة', Neb: 'سديم', RfN: 'سديم عاكس (غبار تضيئه النجوم)', SNR: 'بقايا مستعر أعظم', 'Cl+N': 'عنقود نجمي في سديم', DrkN: 'سحابة غبار مظلمة', '*Ass': 'تجمّع نجمي متباعد'}
};
const nf = (x, d = 0) => Number(x).toLocaleString('en-US', {maximumFractionDigits: d, minimumFractionDigits: 0});
function sig(x) { if (x >= 100) return Math.round(x / Math.pow(10, Math.floor(Math.log10(x)) - 1)) * Math.pow(10, Math.floor(Math.log10(x)) - 1); return x >= 10 ? Math.round(x) : Math.round(x * 10) / 10; }
function arY(n, unit = 'سنة', plural = 'سنوات') { return (Number.isInteger(n) && n >= 3 && n <= 10) ? plural : unit; }
function bigYears(y, lang) {
  const ar = lang === 'ar';
  if (ar && y >= 2 && y < 11) { const n = Math.round(y); return n === 2 ? 'سنتان' : `${n} ${arY(n)}`; }
  if (y >= 1e9) return `${nf(y / 1e9, 1)} ${ar ? 'مليار سنة' : 'billion years'}`;
  if (y >= 1e6) return `${nf(y / 1e6, 1)} ${ar ? 'مليون سنة' : 'million years'}`;
  if (y >= 1e4) return `${nf(sig(y))} ${ar ? 'سنة' : 'years'}`;
  if (y >= 2) return `${nf(Math.round(y))} ${ar ? 'سنة' : 'years'}`;
  if (y >= 1 / 12) return `${nf(y * 12, 0)} ${ar ? 'شهرًا' : 'months'}`;
  return `${nf(y * 365.25, 0)} ${ar ? 'يومًا' : 'days'}`;
}
function distTxt(ly, lang) {
  if (ly == null) return lang === 'ar' ? 'غير معروفة بدقة' : 'not known accurately';
  const v = sig(ly);
  if (lang === 'ar') return `نحو ${nf(v, 1)} ${arY(v, 'سنة ضوئية', 'سنوات ضوئية')}`;
  return `about ${nf(v, 1)} ${T[lang].ly}`;
}
function leftAt(ly, lang) {
  const ar = lang === 'ar', a = ly < 100 ? Math.round(ly) : sig(ly), y = NOW - a;
  if (ly < 2) return ar ? 'قبل نحو سنة' : 'about a year ago';
  if (y > 0) return ar ? `نحو سنة ${y}م، قبل ${nf(a)} ${arY(a)}` : `around ${y} CE, ${nf(a)} years ago`;
  if (ly < 12000) return ar ? `نحو سنة ${nf(-y)} ق.م، قبل ${nf(sig(ly))} سنة` : `around ${nf(-y)} BCE, ${nf(sig(ly))} years ago`;
  return ar ? `قبل نحو ${bigYears(ly, 'ar')}` : `about ${bigYears(ly, 'en')} ago`;
}
function bvColour(ci, cls) {
  const tab = [[-0.4, [155, 176, 255]], [-0.2, [170, 191, 255]], [0.0, [202, 215, 255]], [0.3, [248, 247, 255]], [0.6, [255, 244, 234]], [0.85, [255, 222, 170]], [1.15, [255, 200, 130]], [1.5, [255, 172, 98]], [1.9, [255, 140, 80]]];
  if (ci == null) ci = {O: -0.3, B: -0.15, A: 0.05, F: 0.4, G: 0.65, K: 1.1, M: 1.6}[cls] ?? 0.6;
  ci = Math.max(-0.4, Math.min(1.9, ci));
  for (let i = 0; i < tab.length - 1; i++) { const [a, ca] = tab[i], [b, cb] = tab[i + 1]; if (ci <= b) { const t = (ci - a) / (b - a); return `rgb(${ca.map((v, j) => Math.round(v + (cb[j] - v) * t)).join(',')})`; } }
  return 'rgb(255,140,80)';
}
function typeTxt(s, lang) {
  if (s.kind === 'wd') return KIND[lang].wd;
  const col = COL[lang][s.cls] || '';
  let k = KIND[lang][s.kind] ?? KIND[lang][''];
  if (s.kind === 'dwarf' && (s.cls === 'K' || s.cls === 'M')) k = lang === 'ar' ? 'قزم' : 'dwarf';
  if (s.kind === 'dwarf' && s.cls === 'G') k = lang === 'ar' ? 'قزم (مثل الشمس)' : 'dwarf, like the Sun';
  if (lang === 'ar') return col ? `${k.split(' (')[0]} ${col}${k.includes('(') ? ' (' + k.split(' (')[1] : ''}` : k;
  return col ? `${col} ${k}` : k;
}
function plTxt(p, lang) {
  const ar = lang === 'ar';
  const bits = [];
  if (p.mass) bits.push(p.mass >= 0.1 ? (ar ? `كتلته ${nf(p.mass, 1)} ضعف كتلة المشتري` : `${nf(p.mass, 1)} times Jupiter's mass`) : (ar ? `كتلته نحو ${nf(p.mass * 317.8, 1)} ضعف كتلة الأرض` : `about ${nf(p.mass * 317.8, 1)} times Earth's mass`));
  if (p.period) bits.push(p.period > 730 ? (ar ? `يدور حوله كل ${nf(p.period / 365.25, 1)} سنة` : `one orbit every ${nf(p.period / 365.25, 1)} years`) : (ar ? `يدور حوله كل ${nf(p.period, p.period < 10 ? 1 : 0)} يومًا` : `one orbit every ${nf(p.period, p.period < 10 ? 1 : 0)} days`));
  if (p.year) bits.push(ar ? `اكتُشف سنة ${p.year}` : `found in ${p.year}`);
  return `<b>${esc(p.name)}</b>${bits.length ? ' (' + bits.join(ar ? '، ' : ', ') + ')' : ''}`;
}
const SCOPES = [
  {lim: 6.0, en: 'Naked eye', ar: 'العين المجردة'},
  {lim: 9.5, en: 'Binoculars (7×50 or 10×50)', ar: 'منظار ثنائي (7×50 أو 10×50)'},
  {lim: 11.5, mm: 70, en: 'Small telescope (70–80 mm)', ar: 'تلسكوب صغير (70–80 مم)'},
  {lim: 12.5, mm: 100, en: '100 mm (4-inch) telescope', ar: 'تلسكوب 100 مم (4 بوصات)'},
  {lim: 13.5, mm: 150, en: '150 mm (6-inch) telescope', ar: 'تلسكوب 150 مم (6 بوصات)'},
  {lim: 14.3, mm: 200, en: '200 mm (8-inch) telescope', ar: 'تلسكوب 200 مم (8 بوصات)'},
  {lim: 15.2, mm: 300, en: '300 mm (12-inch) telescope', ar: 'تلسكوب 300 مم (12 بوصة)'},
  {lim: 99, mm: 9999, en: 'A large observatory telescope or a long-exposure camera', ar: 'تلسكوب مرصد كبير أو آلة تصوير بتعريض طويل'}
];
const scopeFor = m => SCOPES.find(s => m <= s.lim);
const scopeMM = mm => SCOPES.find(s => s.mm && s.mm >= mm) || SCOPES[SCOPES.length - 1];
const DSO_SEE = { B033: [5, 'with an H-beta filter, from a very dark site', 'مع مرشّح H-beta ومن موقع شديد الظلمة'], C099: [0, 'a dark hole in the Milky Way', 'بقعة مظلمة في درب التبانة'], NGC3372: [0, '', ''],
  IC1396: [1, 'large and faint: use low power', 'واسع وخافت: استعمل تكبيرًا منخفضًا'], C014: [0, '', ''], C041: [0, '', ''], IC2602: [0, '', ''], NGC4755: [0, 'a fuzzy star to the eye; colours show in a telescope', 'نجم ضبابي للعين، وتظهر ألوانه بالتلسكوب'],
  NGC6838: [1, '', ''], NGC2168: [0, '', ''], NGC2808: [1, '', ''], NGC6362: [1, '', ''], NGC6541: [1, '', ''], NGC1851: [1, '', ''], NGC4833: [1, '', ''],
  NGC2237: [1, 'the cluster in binoculars; the nebula needs a filter', 'العنقود بالمنظار الثنائي، أما السديم فيحتاج مرشّحًا'], 'ESO056-115': [0, '', ''], NGC0292: [0, '', ''] };
function dsoScope(d) {
  if (DSO_SEE[d.id]) return SCOPES[DSO_SEE[d.id][0]];
  if (d.mag == null) return null;
  const adj = {G: 1.2, GPair: 1.2, GTrpl: 1.2, GGroup: 1.2, EmN: 1, HII: 0.8, Neb: 1, RfN: 1.2, SNR: 1.2, 'Cl+N': 0.5, PN: 0.3, OCl: 0, GCl: 0.3, '*Ass': 0}[d.type] ?? 0.8;
  return scopeFor(d.mag + adj);
}
function splitScope(d) {
  if (d.sep == null) return null;
  if (d.sep >= 40 && (d.dmag ?? 0) < 3) return SCOPES[1];
  let mm = 116 / d.sep; if ((d.dmag ?? 0) > 4) mm *= 2; else if ((d.dmag ?? 0) > 2) mm *= 1.5;
  return scopeMM(Math.max(70, mm));
}
function dblTxt(d, lang) {
  const ar = lang === 'ar';
  if (!d || !d.t) return ar ? 'لا يُعرف له رفيق' : 'No known companion';
  const per = d.period ? (d.period < 730 ? (ar ? `، يدوران كل ${nf(d.period, d.period < 10 ? 2 : 0)} يومًا` : `, orbit every ${nf(d.period, d.period < 10 ? 2 : 0)} days`) : (ar ? `، يدوران كل ${nf(sig(d.period / 365.25), 1)} سنة تقريبًا` : `, orbit about every ${nf(sig(d.period / 365.25), 1)} years`)) : '';
  const sc = splitScope(d);
  const sep = d.sep != null ? (ar ? `، المسافة بينهما ${nf(d.sep, 1)}″، ولفصلهما: ${sc.ar}` : `, ${nf(d.sep, 1)}″ apart; to split them: ${sc.en}`) : '';
  switch (d.t) {
    case 'binary': return (ar ? (d.ecl ? 'نعم: نجم مزدوج كسوفي، يحجب أحد النجمين الآخر فيخفت ضوؤه' : 'نعم: نجم مزدوج، نجمان أو أكثر تربطهما الجاذبية') : (d.ecl ? 'Yes: an eclipsing binary, one star passes in front of the other and the light dims' : 'Yes: a binary, two or more stars held together by gravity')) + per + sep;
    case 'visual': return (ar ? 'نعم: نجم مزدوج يمكن فصله بالتلسكوب' : 'Yes: a double star you can split with a telescope') + per + sep;
    case 'optical': return ar ? 'لا: النجوم الخافتة التي تبدو بجانبه في السماء لا ترتبط به، بل هي في الاتجاه نفسه فقط' : 'No: the faint stars next to it in the sky are not linked to it, only in the same direction';
  }
  return '';
}

// Star size from luminosity and temperature: R/R_sun = sqrt(L_bol) · (5772 K / T)².
// L_bol from the catalogue's visual luminosity with Torres (2010, AJ 140, 1158) bolometric corrections (after Flower 1996).
function bcV(T) {
  const x = Math.log10(T); let c;
  if (x < 3.70) c = [-0.190537291496456e5, 0.155144866764412e5, -0.421278819301717e4, 0.381476328422343e3];
  else if (x < 3.90) c = [-0.370510203809015e5, 0.385672629965804e5, -0.150651486316025e5, 0.261724637119416e4, -0.170623810323864e3];
  else c = [-0.118115450538963e6, 0.137145973583929e6, -0.636233812100225e5, 0.147412923562646e5, -0.170587278406872e4, 0.788731721804990e2];
  return c.reduce((a, k, i) => a + k * Math.pow(x, i), 0);
}
const BC_SUN = bcV(5772);
function starRadius(s) {
  if (!s.lum || !s.temp || s.kind === 'wd') return null;
  return Math.sqrt(s.lum * Math.pow(10, -0.4 * (bcV(s.temp) - BC_SUN))) * Math.pow(5772 / s.temp, 2);
}
const ORBITS = [['mercury', 0.39], ['venus', 0.72], ['earth', 1.0], ['mars', 1.52], ['jupiter', 5.2], ['saturn', 9.54]];
function planetName(id, lang) { const b = DATA.sci.SOL.bodies.find(x => x.id === id); return lang === 'ar' ? b.ar : b.en; }
function sizeSVG(R, colour, lang) {
  const ar = lang === 'ar', W = 280, H = 112, big = Math.max(R, 1), sc = 46 / big;
  const rs = Math.max(1.2, sc * R), ru = Math.max(1.2, sc);
  const cx1 = 16 + rs, cx2 = Math.min(W - 40, cx1 + rs + 34 + ru);
  return `<svg class="szs" viewBox="0 0 ${W} ${H}" role="img" aria-label="${ar ? 'مقارنة الحجم بالشمس' : 'Size compared with the Sun'}" dir="ltr">
    <circle cx="${cx1.toFixed(1)}" cy="54" r="${rs.toFixed(1)}" fill="${colour}"/>
    <circle cx="${cx2.toFixed(1)}" cy="54" r="${ru.toFixed(1)}" fill="#f6c453"/>
    <text x="${cx2.toFixed(1)}" y="${(54 + ru + 15).toFixed(1)}" text-anchor="middle">${ar ? 'الشمس' : 'Sun'}</text></svg>`;
}
function sizeTxt(R, name, lang) {
  const ar = lang === 'ar', au = R / 215;
  const eaten = ORBITS.filter(([, a]) => a < au).map(([id]) => planetName(id, lang));
  let t;
  if (R >= 1.6) t = ar ? `قطره نحو ${nf(sig(R), 1)} ضعف قطر الشمس، ويتسع لنحو ${nf(sig(R * R * R), 0)} شمسًا.` : `About ${nf(sig(R), 1)} times wider than the Sun; about ${nf(sig(R * R * R), 0)} Suns would fit inside it.`;
  else if (R >= 0.75) t = ar ? 'بحجم الشمس تقريبًا.' : 'About the same size as the Sun.';
  else t = ar ? `أصغر من الشمس: قطره نحو ${nf(R * 100, 0)}% من قطرها.` : `Smaller than the Sun: about ${nf(R * 100, 0)}% of its width.`;
  if (eaten.length) t += ar ? ` لو حلّ مكان الشمس لابتلع مدارات ${eaten.join(' و')}.` : ` If it took the Sun's place, it would swallow the orbits of ${eaten.length > 1 ? eaten.slice(0, -1).join(', ') + ' and ' + eaten.slice(-1) : eaten[0]}.`;
  return t;
}
let KIDS = false;
// the kids switch, also shown on Plan a night and the Quiz
function kidBtn(ar) { return `<button type="button" class="kidbtn" data-kid aria-pressed="${KIDS}">${ar ? '🧒 للأطفال' : '🧒 For kids'}</button>`; }
document.addEventListener('click', ev => { const b = ev.target.closest && ev.target.closest('[data-kid]'); if (!b) return; KIDS = !KIDS; try { localStorage.setItem('osms-kids', KIDS ? '1' : '0'); } catch (e) {} render(); });
try { KIDS = localStorage.getItem('osms-kids') === '1'; } catch (e) {}
function kidStar(s, lang) {
  const ar = lang === 'ar', R = starRadius(s), out = [];
  if (R) {
    const au = R / 215, eaten = ORBITS.filter(([, a]) => a < au).map(([id]) => planetName(id, lang));
    if (eaten.length) out.push(ar ? `${s.name} عملاق حقًا! لو وضعناه مكان شمسنا لابتلع ${eaten.join(' و')}.` : `${s.name} is truly gigantic! If we put it where our Sun is, it would swallow ${eaten.length > 1 ? eaten.slice(0, -1).join(', ') + ' and ' + eaten.slice(-1) : eaten[0]}.`);
    else if (R >= 1.6) out.push(ar ? `لو كانت الشمس كرة تنس، لكان ${s.name} كرة قطرها ${R >= 20 ? nf(sig(R * 6.7 / 100), 1) + ' متر' : nf(Math.round(R * 6.7)) + ' سم'} تقريبًا.` : `If the Sun were a tennis ball, ${s.name} would be a ball about ${R >= 15 ? nf(sig(R * 6.7 / 100), 1) + ' metres' : nf(Math.round(R * 6.7)) + ' cm'} across.`);
    else if (R >= 0.75) out.push(ar ? `${s.name} بحجم شمسنا تقريبًا، فهو مثل أخ لها.` : `${s.name} is about the same size as our Sun, like a twin brother.`);
    else out.push(ar ? `${s.name} أصغر من شمسنا.` : `${s.name} is smaller than our Sun.`);
  }
  if (s.cls && 'OBAFGKM'.includes(s.cls)) {
    const hot = 'OBA'.includes(s.cls), cool = 'KM'.includes(s.cls);
    out.push(ar ? `لون النجم يخبرك بحرارته: الأزرق أشدّها حرارة والأحمر أبردها، كما أن لهب الغاز الأزرق أسخن من لهب الشمعة البرتقالي. ${hot ? 'هذا النجم مائل إلى الزرقة أو البياض، فهو أسخن من الشمس.' : cool ? 'هذا النجم برتقالي أو أحمر، فهو أبرد من الشمس.' : 'وهذا النجم مائل إلى الصفرة مثل الشمس.'}`
      : `A star's colour tells you how hot it is: blue stars are the hottest and red ones the coolest, just as a blue gas flame is hotter than an orange candle flame. ${hot ? 'This one is bluish-white, so it is hotter than the Sun.' : cool ? 'This one is orange or red, so it is cooler than the Sun.' : 'This one is yellowish, like the Sun.'}`);
  }
  if (s.dist) {
    const y = Math.round(NOW - (s.dist < 100 ? Math.round(s.dist) : sig(s.dist)));
    const when = s.dist < 12 ? (ar ? 'منذ سنوات قليلة فقط' : 'only a few years ago') : s.dist < 90 ? (ar ? `نحو سنة ${y}، ربما حين كان أجدادك صغارًا` : `around ${y}, maybe when your grandparents were children`) : y > 0 ? (ar ? `نحو سنة ${y}، قبل أن يولد أجداد أجدادك` : `around the year ${y}, long before your great-great-grandparents were born`) : (ar ? `قبل أكثر من ${nf(sig(s.dist))} سنة` : `more than ${nf(sig(s.dist))} years ago, in ancient times`);
    out.push(ar ? `الضوء أسرع شيء في الكون: يدور حول الأرض 7 مرات في ثانية واحدة. ومع ذلك فالضوء الذي تراه الليلة من ${s.name} خرج منه ${when}.` : `Light is the fastest thing in the universe: it could whizz around the Earth 7 times in one second. Even so, the light you see tonight from ${s.name} left it ${when}.`);
  }
  if (s.dbl && (s.dbl.t === 'binary' || s.dbl.t === 'visual')) out.push(ar ? `${s.name} ليس نجمًا واحدًا، بل نجمان أو أكثر يدور أحدهما حول الآخر كراقصَين يمسكان بأيدي بعضهما.` : `${s.name} is not just one star but two or more, spinning around each other like dancers holding hands.`);
  if (s.planets && s.planets.length) out.push(ar ? `يدور حول ${s.name} كوكب، كما تدور الأرض حول الشمس!` : `A planet goes around ${s.name}, just like Earth goes around the Sun!`);
  return out;
}
const KID_WORDS = {
  en: [['Light year', 'How far light travels in one year: about 9.5 million million km. It measures distance, not time.'],
       ['Magnitude', 'A brightness score. Smaller numbers are brighter: Sirius is −1.5, and the faintest stars you can see with your eyes are about 6.'],
       ['Kelvin (K)', 'A temperature scale scientists use. Take away 273 to get °C. The Sun\'s surface is about 5,800 K.'],
       ['Giant and dwarf', 'Words for big and small stars. Our Sun is a yellow dwarf. A supergiant can be hundreds of times wider than the Sun.'],
       ['Double star', 'Two stars that go around each other, held together by gravity.'],
       ['Nebula', 'A giant cloud of gas and dust in space. New stars are born inside some of them.'],
       ['Star cluster', 'A family of stars that were born together and travel together.'],
       ['Galaxy', 'A huge city of billions of stars. We live in one called the Milky Way.'],
       ['Constellation', 'A group of stars that people long ago joined with imaginary lines to make a picture.']],
  ar: [['السنة الضوئية', 'المسافة التي يقطعها الضوء في سنة: نحو 9.5 مليون مليون كيلومتر. هي مقياس للمسافة لا للزمن.'],
       ['القدر', 'درجة لمعان النجم. الرقم الأصغر يعني لمعانًا أكبر: الشعرى −1.5، وأخفت النجوم التي تراها عيناك نحو 6.'],
       ['الكلفن', 'مقياس حرارة يستعمله العلماء. اطرح 273 لتحصل على الدرجات المئوية. حرارة سطح الشمس نحو 5800 كلفن.'],
       ['العملاق والقزم', 'كلمتان للنجوم الكبيرة والصغيرة. شمسنا قزم أصفر، والعملاق الفائق قد يكون أعرض من الشمس مئات المرات.'],
       ['النجم المزدوج', 'نجمان يدور أحدهما حول الآخر، تربطهما الجاذبية.'],
       ['السديم', 'سحابة هائلة من الغاز والغبار في الفضاء، تولد في بعضها نجوم جديدة.'],
       ['العنقود النجمي', 'عائلة من النجوم وُلدت معًا وتسير معًا.'],
       ['المجرة', 'مدينة هائلة فيها مليارات النجوم، ونحن نعيش في مجرة اسمها درب التبانة.'],
       ['الكوكبة', 'مجموعة نجوم وصلها الناس قديمًا بخطوط خيالية لتكوّن صورة.']]
};
function kidWordsHTML(lang) {
  return `<details class="kidw" open><summary>${lang === 'ar' ? '🧒 كلمات علمية بلغة بسيطة' : '🧒 Science words made simple'}</summary><dl class="ftable">${KID_WORDS[lang].map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl></details>`;
}
const KID_OBJ = [[1.2, 'a grain of sand', 'حبة رمل'], [2.5, 'a grain of rice', 'حبة أرز'], [4, 'a peppercorn', 'حبة فلفل أسود'], [6, 'a lentil', 'حبة عدس'], [11, 'a pea', 'حبة بازلاء'], [30, 'a grape', 'حبة عنب'], [45, 'a ping-pong ball', 'كرة تنس طاولة'], [95, 'an orange', 'برتقالة'], [140, 'a grapefruit', 'ليمونة هندية (جريب فروت)']];
function kidPlanet(b, lang) {
  if (b.id === 'sun' || !b.au) return lang === 'ar' ? 'تخيّل الشمس كرة كبيرة قطرها متر واحد؛ الكواكب في هذا المقياس مكتوبة تحت كل كوكب.' : 'Imagine the Sun as a big ball 1 metre wide. Under each planet you can see how big it would be, and how far away, at that size.';
  const mm = b.d / 1392700 * 1000, o = KID_OBJ.find(x => mm <= x[0]) || KID_OBJ[KID_OBJ.length - 1];
  const m = b.au * 107.4, dist = m >= 1000 ? (lang === 'ar' ? `${nf(m / 1000, 1)} كم` : `${nf(m / 1000, 1)} km`) : (lang === 'ar' ? `${nf(Math.round(m))} مترًا` : `${nf(Math.round(m))} metres`);
  return lang === 'ar' ? `لو كانت الشمس كرة قطرها متر، لكان ${b.ar.split(' (')[0]} بحجم ${o[2]} (${nf(mm, 1)} مم) على بعد ${dist} منها.` : `If the Sun were a ball 1 metre wide, ${b.en.split(' (')[0]} would be the size of ${o[1]} (${nf(mm, 1)} mm), ${dist} away.`;
}
function starCard(s, lang) {
  const t = T[lang], ar = lang === 'ar';
  const arName = DATA.starAr[s.name];
  let alt = [];
  if (s.bayer) alt.push(`<span dir="ltr">${esc(s.bayer)}</span>`);
  if (arName) alt.push(`<span class="arn2" lang="ar">${esc(arName)}</span>`);
  let h = `<article class="starc" data-star="${esc(s.name)}" style="--sc:${bvColour(s.ci, s.cls)}"><h4><span class="sw" aria-hidden="true"></span><bdi>${esc(s.name)}</bdi>${AG.btn({t: 'star', key: state.con, ref: s.name}, lang, true)}${swBtn(swStarName(s, ((DATA.sci[state.con] || {}).parts || [{}])[0].abbr), 20, lang)}</h4><div class="alt">${alt.join(' · ') || '&nbsp;'}</div>`;
  if (KIDS) { const k = kidStar(s, lang); if (k.length) h += `<div class="kidbox"><span class="sect-lbl">${ar ? '🧒 للأطفال' : '🧒 For kids'}</span><ul>${k.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`; }
  h += `<dl>`;
  h += `<dt>${t.colour}</dt><dd>${esc(typeTxt(s, lang))} <span class="vref" dir="ltr">${esc(s.spect)}</span></dd>`;
  h += `<dt>${t.dist}</dt><dd>${distTxt(s.dist, lang)}${s.far ? ` <span class="vref" style="white-space:normal">(${t.rough})</span>` : ''}</dd>`;
  if (s.temp) h += `<dt>${t.temp}</dt><dd>${ar ? `نحو ${nf(s.temp)} كلفن (${nf(Math.round((s.temp - 273) / 100) * 100)} °م)` : `about ${nf(s.temp)} K (${nf(Math.round((s.temp - 273) / 100) * 100)} °C)`}${s.temp < 5000 ? (ar ? '، أبرد من الشمس' : ', cooler than the Sun') : s.temp > 6500 ? (ar ? '، أسخن من الشمس' : ', hotter than the Sun') : ''}</dd>`;
  if (s.lum) h += `<dt>${t.lum}</dt><dd>${s.lum >= 1.5 ? (ar ? `أسطع من الشمس ${nf(sig(s.lum), 1)} مرة` : `${nf(sig(s.lum), 1)} times brighter than the Sun`) : s.lum <= 0.7 ? (ar ? `${nf(s.lum * 100, s.lum < 0.01 ? 2 : 0)}% من ضوء الشمس` : `${nf(s.lum * 100, s.lum < 0.01 ? 2 : 0)}% of the Sun's light`) : (ar ? 'قريب من ضوء الشمس' : 'about as bright as the Sun')}</dd>`;
  h += `<dt>${ar ? 'مزدوج؟' : 'Double?'}</dt><dd>${esc(dblTxt(s.dbl, lang))}</dd>`;
  h += `<dt>${t.mag}</dt><dd><bdi dir="ltr">${(Math.abs(s.mag) < 0.05 ? 0 : s.mag).toFixed(1)}</bdi></dd>`;
  const Rs = starRadius(s);
  if (Rs) h += `<dt>${ar ? 'الحجم' : 'Size'}</dt><dd>${esc(sizeTxt(Rs, s.name, lang))}</dd>`;
  h += `<dt>${ar ? 'لرؤيته' : 'To see it'}</dt><dd>${esc(scopeFor(s.mag)[lang])}</dd></dl>`;
  if (Rs) h += `<figure class="szf">${sizeSVG(Rs, bvColour(s.ci, s.cls), lang)}<figcaption>${ar ? `رسم بالمقياس: ${esc(s.name)} والشمس${Rs > 46 ? '، وهي هنا نقطة صغيرة' : ''}` : `Drawn to scale: ${esc(s.name)} and the Sun${Rs > 46 ? ' (the Sun is just a dot here)' : ''}`}</figcaption></figure>`;
  if (s.dbl && s.dbl.note) h += `<div class="pl" style="background:var(--sel)">${esc(ar ? s.dbl.noteAr : s.dbl.note)}</div>`;
  if (s.dist) {
    h += `<div class="trip">${t.light}: <b>${leftAt(s.dist, lang)}</b>.<dl style="margin-top:6px"><dt>${ar ? 'بسرعة الضوء' : 'At light speed'}</dt><dd>${bigYears(s.dist < 100 ? Math.round(s.dist) : sig(s.dist), lang)}</dd><dt>${ar ? 'باركر الشمسي' : 'Parker Solar Probe'}</dt><dd>${bigYears(s.dist * 1561, lang)}</dd><dt>${ar ? 'فوياجر 1' : 'Voyager 1'}</dt><dd>${bigYears(s.dist * 17635, lang)}</dd><dt>${ar ? 'بطائرة ركاب' : 'By jet plane'}</dt><dd>${bigYears(s.dist * 1.1993e6, lang)}</dd><dt>${ar ? 'بالسيارة' : 'By car'}</dt><dd>${bigYears(s.dist * 1.0793e7, lang)}</dd><dt>${ar ? 'مشيًا' : 'Walking'}</dt><dd>${bigYears(s.dist * 2.1586e8, lang)}</dd></dl>${s.dist * 17635 > 80 ? `<p class="vref" style="white-space:normal;margin:4px 0 0">${ar ? `على متن فوياجر 1 تحتاج الرحلة نحو ${nf(sig(s.dist * 17635 / 80))} عمرًا بشريًا متتاليًا (80 سنة لكل عمر).` : `On Voyager 1 that is about ${nf(sig(s.dist * 17635 / 80))} human lifetimes of 80 years, one after another.`}</p>` : ''}</div>`;
  }
  if (s.planets && s.planets.length) h += `<div class="pl">${ar ? (s.planets.length === 1 ? 'له كوكب معروف' : `له ${s.planets.length} كواكب معروفة`) : (s.planets.length === 1 ? 'Has a known planet' : `Has ${s.planets.length} known planets`)}: ${s.planets.map(p => plTxt(p, lang)).join(ar ? '؛ ' : '; ')}.</div>`;
  else h += `<div class="pl" style="background:transparent;padding:6px 0 0">${t.none}</div>`;
  return h + `</article>`;
}
function latTxt(l, ar) { return l === 0 ? (ar ? 'خط الاستواء' : 'the equator') : `${Math.abs(l)}°${l > 0 ? (ar ? ' شمالًا' : 'N') : (ar ? ' جنوبًا' : 'S')}`; }
function visTxt(v, lang) {
  const ar = lang === 'ar', m = MONTHS[lang][v.month];
  const n = Math.min(90, 90 + v.dmin), s = Math.max(-90, v.dmax - 90);
  let where;
  if (n >= 90) where = ar ? `ويمكن رؤيتها كاملة من كل مكان شمال ${latTxt(s, true)}` : `The whole of it can be seen from anywhere north of ${latTxt(s)}`;
  else if (s <= -90) where = ar ? `ويمكن رؤيتها كاملة من كل مكان جنوب ${latTxt(n, true)}` : `The whole of it can be seen from anywhere south of ${latTxt(n)}`;
  else where = ar ? `ويمكن رؤيتها كاملة من أي مكان بين ${latTxt(n, true)} و${latTxt(s, true)}` : `The whole of it can be seen from anywhere between ${latTxt(n)} and ${latTxt(s)}`;
  const P = placeObj(), jhb = P.lat, alt = Math.round(90 - Math.abs(jhb - v.dec)), pn = ar ? P.ar : P.en;
  const jtxt = alt < 0 ? (ar ? `ولا يطلع مركزها أبدًا فوق أفق ${pn}.` : `From ${pn} its centre never rises.`)
    : (ar ? `ومن ${pn} يرتفع مركزها حتى نحو ${alt}° فوق الأفق ${v.dec < jhb ? 'الجنوبي' : 'الشمالي'}${alt > 85 ? ' (فوق الرأس تقريبًا)' : ''}.` : `From ${pn} its centre climbs to about ${alt}° above the ${v.dec < jhb ? 'southern' : 'northern'} horizon${alt > 85 ? ' (almost overhead)' : ''}.`)
    + (ar ? ' (يمكنك تغيير المكان من تقويم السماء.)' : ' (Change the place in the Sky calendar.)');
  return ar ? `أفضل وقت لرؤيتها نحو التاسعة مساءً في شهر ${m}. ${where}. ${jtxt}` : `Best placed around 9 pm in ${m}. ${where}. ${jtxt}`;
}
