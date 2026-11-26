/* ---------- The main moons of each planet: size, orbit, discovery, what makes it special, and how to see it ---------- */
// d: mean diameter (km), a: average distance from the planet's centre (km), p: one orbit (days), by/byAr: discoverer, yr: year, see: how to see it (key of MOON_SEE)
// Figures: NASA/JPL Solar System Dynamics (planetary satellite physical and orbital parameters) and NASA Science, Moons of the Solar System.
const MOON_SEE = {
  eye: ['With the naked eye.', 'بالعين المجردة.'],
  bino: ['Binoculars: a tiny star beside Jupiter. The four Galilean moons change places from night to night.', 'بالمنظار المزدوج: نجم صغير بجانب المشتري. تتبدّل أماكن الأقمار الأربعة من ليلة إلى أخرى.'],
  small: ['A small telescope (about 60 to 80 mm) shows it as a star-like point near Saturn.', 'يُظهره مقراب صغير (نحو 60 إلى 80 مم) نقطةً تشبه النجم قرب زحل.'],
  med: ['A telescope of about 100 to 150 mm, on a dark night.', 'مقراب بقطر نحو 100 إلى 150 مم في ليلة مظلمة.'],
  big: ['A telescope of 200 mm or more, a dark sky and a good map of where to look.', 'مقراب بقطر 200 مم أو أكثر، وسماء مظلمة، وخريطة جيدة لمكانه.'],
  mars: ['Very hard: a large telescope near Mars\'s closest approach, with the glare of Mars hidden.', 'صعب جدًا: مقراب كبير حين يكون المريخ في أقرب نقطة منا، مع حجب وهج المريخ.'],
  pro: ['Too faint for most backyard telescopes: it shows up in long photographs with large telescopes.', 'أخفت من أن تُظهره معظم مقاريب الهواة؛ يظهر في الصور طويلة التعريض بالمقاريب الكبيرة.']
};
const MOONS = {
  earth: [
    {en: 'The Moon', ar: 'القمر', d: 3474, a: 384400, p: 27.32, by: 'Known since prehistory', byAr: 'معروف منذ عصور ما قبل التاريخ', see: 'eye',
     f: ['It always shows us the same face, because it turns once on its axis in exactly the time it takes to go around Earth.', 'It probably formed about 4.5 billion years ago from the debris of a giant collision between the young Earth and a Mars-sized body.', 'It drifts about 3.8 cm farther from Earth every year, measured by bouncing lasers off mirrors left by the Apollo astronauts.'],
     fa: ['يُرينا دائمًا الوجه نفسه، لأنه يدور حول محوره مرة واحدة في المدة نفسها التي يدور فيها حول الأرض.', 'تكوّن على الأرجح قبل نحو 4.5 مليار سنة من حطام اصطدام عملاق بين الأرض الفتية وجرم بحجم المريخ.', 'يبتعد عن الأرض نحو 3.8 سم كل سنة، وقد قيس ذلك بإطلاق أشعة الليزر نحو مرايا تركها رواد أبولو.']}
  ],
  mars: [
    {en: 'Phobos', ar: 'فوبوس', d: 22.2, a: 9376, p: 0.319, by: 'Asaph Hall', byAr: 'أساف هول', yr: 1877, see: 'mars',
     f: ['A lumpy, cratered rock about 27 by 18 km, possibly a captured asteroid or debris from an old impact on Mars.', 'It circles Mars three times a day, faster than Mars turns, so from Mars it rises in the west and sets in the east.', 'It is slowly spiralling inward; in tens of millions of years it will break apart or crash into Mars.'],
     fa: ['صخرة غير منتظمة مليئة بالفوهات، أبعادها نحو 27 × 18 كم، وربما كان كويكبًا أسره المريخ أو حطامًا من اصطدام قديم به.', 'يدور حول المريخ ثلاث مرات في اليوم، أسرع من دوران المريخ نفسه، فيُرى من المريخ طالعًا من الغرب وغاربًا في الشرق.', 'يقترب من المريخ ببطء، وبعد عشرات الملايين من السنين سيتفتت أو يصطدم به.']},
    {en: 'Deimos', ar: 'ديموس', d: 12.4, a: 23463, p: 1.263, by: 'Asaph Hall', byAr: 'أساف هول', yr: 1877, see: 'mars',
     f: ['One of the smallest moons known, about 15 by 11 km, with a surface smoothed by a thick layer of dust.', 'Phobos and Deimos are named after the sons of Ares, the Greek god of war: Fear and Dread.'],
     fa: ['من أصغر الأقمار المعروفة، أبعاده نحو 15 × 11 كم، وسطحه أملس تغطيه طبقة سميكة من الغبار.', 'سُمّي فوبوس وديموس على ابنَي آريس إله الحرب عند الإغريق: الخوف والرعب.']}
  ],
  jupiter: [
    {en: 'Io', ar: 'آيو', d: 3643, a: 421700, p: 1.769, by: 'Galileo Galilei', byAr: 'غاليليو غاليلي', yr: 1610, see: 'bino',
     f: ['The most volcanic world in the Solar System, with about 400 active volcanoes; some throw lava fountains tens of kilometres high.', 'Its heat comes from tides: Jupiter\'s gravity squeezes Io again and again as Europa and Ganymede tug it along its slightly oval orbit.'],
     fa: ['أكثر عوالم المجموعة الشمسية نشاطًا بركانيًا، فيه نحو 400 بركان نشط، يقذف بعضها نوافير من الحمم بارتفاع عشرات الكيلومترات.', 'تأتي حرارته من المدّ والجزر: جاذبية المشتري تعصره مرة بعد مرة بينما يشدّه أوروبا وغانيميد على مداره البيضاوي قليلًا.']},
    {en: 'Europa', ar: 'أوروبا', d: 3122, a: 671100, p: 3.551, by: 'Galileo Galilei', byAr: 'غاليليو غاليلي', yr: 1610, see: 'bino',
     f: ['Under its cracked shell of ice lies a salty ocean that may hold about twice as much water as all of Earth\'s oceans.', 'It is one of the best places to look for life beyond Earth. NASA\'s Europa Clipper, launched in 2024, is on its way to study it.'],
     fa: ['تحت قشرته الجليدية المتشققة محيط مالح قد يحوي نحو ضعف ماء محيطات الأرض كلها.', 'من أفضل الأماكن للبحث عن حياة خارج الأرض، والمسبار «يوروبا كليبر» التابع لناسا، الذي أُطلق عام 2024، في طريقه لدراسته.']},
    {en: 'Ganymede', ar: 'غانيميد', d: 5268, a: 1070400, p: 7.155, by: 'Galileo Galilei', byAr: 'غاليليو غاليلي', yr: 1610, see: 'bino',
     f: ['The largest moon in the Solar System: wider than the planet Mercury.', 'The only moon known to make its own magnetic field, and it probably hides a salty ocean deep under its ice.'],
     fa: ['أكبر قمر في المجموعة الشمسية، وقطره أكبر من قطر كوكب عطارد.', 'القمر الوحيد المعروف بأن له مجالًا مغناطيسيًا خاصًا به، ويُرجَّح أن تحت جليده محيطًا مالحًا عميقًا.']},
    {en: 'Callisto', ar: 'كاليستو', d: 4821, a: 1882700, p: 16.69, by: 'Galileo Galilei', byAr: 'غاليليو غاليلي', yr: 1610, see: 'bino',
     f: ['One of the most heavily cratered surfaces known: about 4 billion years old and barely changed since.', 'Galileo\'s discovery of these four moons in 1610 showed that not everything in the sky goes around the Earth.'],
     fa: ['سطحه من أكثر الأسطح المعروفة امتلاءً بالفوهات، وعمره نحو 4 مليارات سنة ولم يتغير منذ ذلك الحين إلا قليلًا.', 'اكتشاف غاليليو لهذه الأقمار الأربعة عام 1610 أثبت أن ليس كل ما في السماء يدور حول الأرض.']}
  ],
  saturn: [
    {en: 'Titan', ar: 'تيتان', d: 5150, a: 1221870, p: 15.95, by: 'Christiaan Huygens', byAr: 'كريستيان هوغنز', yr: 1655, see: 'small',
     f: ['The only moon with a thick atmosphere, mostly nitrogen like Earth\'s, and denser than ours.', 'It has rain, rivers, lakes and seas, but they are liquid methane and ethane at about −180 °C.', 'The Huygens probe landed on it in 2005, and NASA\'s Dragonfly helicopter is due to fly there in the 2030s.'],
     fa: ['القمر الوحيد الذي له غلاف جوي كثيف، معظمه من النيتروجين مثل غلاف الأرض، وأكثف منه.', 'فيه مطر وأنهار وبحيرات وبحار، لكنها من الميثان والإيثان السائلين عند نحو −180 °م.', 'هبط عليه المسبار «هويغنز» عام 2005، ومن المقرر أن تطير فوقه مروحية «دراغون فلاي» التابعة لناسا في ثلاثينيات هذا القرن.']},
    {en: 'Enceladus', ar: 'إنسيلادوس', d: 504, a: 237950, p: 1.370, by: 'William Herschel', byAr: 'ويليام هيرشل', yr: 1789, see: 'big',
     f: ['Geysers at its south pole spray water vapour and ice grains into space from an ocean under the ice.', 'Its fresh snow makes it one of the most reflective objects in the Solar System, and its spray feeds Saturn\'s faint E ring.'],
     fa: ['ينفث من قطبه الجنوبي ينابيع حارة من بخار الماء وحبيبات الجليد إلى الفضاء، مصدرها محيط تحت الجليد.', 'ثلجه الحديث يجعله من أكثر الأجرام عكسًا للضوء في المجموعة الشمسية، ورذاذه يغذّي حلقة زحل الخافتة E.']},
    {en: 'Mimas', ar: 'ميماس', d: 396, a: 185540, p: 0.942, by: 'William Herschel', byAr: 'ويليام هيرشل', yr: 1789, see: 'pro',
     f: ['The giant crater Herschel, about 130 km wide, covers a third of its width and makes it look like a huge eye.', 'Its gravity clears the Cassini Division, the dark gap between Saturn\'s two brightest rings.'],
     fa: ['فوهة «هيرشل» العملاقة، بعرض نحو 130 كم، تغطي ثلث عرضه وتجعله يبدو كعين ضخمة.', 'جاذبيته تُفرغ «فجوة كاسيني»، الفاصل المظلم بين أسطع حلقتين لزحل.']},
    {en: 'Rhea', ar: 'ريا', d: 1527, a: 527070, p: 4.518, by: 'Giovanni Domenico Cassini', byAr: 'جيوفاني دومينيكو كاسيني', yr: 1672, see: 'med',
     f: ['Saturn\'s second-largest moon: a cold ball of ice with a little rock, covered in craters.', 'It is bright enough to be the easiest of Saturn\'s moons after Titan.'],
     fa: ['ثاني أكبر أقمار زحل: كرة باردة من الجليد مع قليل من الصخر، تغطيها الفوهات.', 'ساطع بما يكفي ليكون أسهل أقمار زحل رؤيةً بعد تيتان.']},
    {en: 'Iapetus', ar: 'يابيتوس', d: 1469, a: 3560820, p: 79.32, by: 'Giovanni Domenico Cassini', byAr: 'جيوفاني دومينيكو كاسيني', yr: 1671, see: 'med',
     f: ['It has two faces: the side that leads in its orbit is as dark as coal, the other as bright as snow.', 'Cassini noticed in 1671 that he could only see it on one side of Saturn: the bright side faces us when it is west of the planet.', 'A ridge up to about 20 km high runs around much of its equator, like the seam of a walnut.'],
     fa: ['له وجهان: الجانب المتقدم في مداره داكن كالفحم، والآخر ساطع كالثلج.', 'لاحظ كاسيني عام 1671 أنه لا يراه إلا على جانب واحد من زحل: فالوجه الساطع يواجهنا حين يكون غرب الكوكب.', 'تمتد حول معظم خط استوائه سلسلة مرتفعات يصل ارتفاعها إلى نحو 20 كم، كأنها خياطة حبة جوز.']}
  ],
  uranus: [
    {en: 'Miranda', ar: 'ميراندا', d: 471, a: 129390, p: 1.413, by: 'Gerard Kuiper', byAr: 'جيرارد كايبر', yr: 1948, see: 'pro',
     f: ['A patchwork of grooves, ridges and smooth plains, as if pieced together from different worlds.', 'Its cliff Verona Rupes is about 20 km deep, the tallest cliff known in the Solar System.'],
     fa: ['سطحه رقع من الأخاديد والحواف والسهول الملساء، كأنه رُكّب من عوالم مختلفة.', 'جرفه «فيرونا روبس» بعمق نحو 20 كم، وهو أعلى جرف معروف في المجموعة الشمسية.']},
    {en: 'Ariel', ar: 'آرييل', d: 1158, a: 190900, p: 2.520, by: 'William Lassell', byAr: 'ويليام لاسيل', yr: 1851, see: 'pro',
     f: ['The brightest of Uranus\'s moons, with the youngest-looking surface, cut by long valleys.'],
     fa: ['أسطع أقمار أورانوس، وسطحه أحدثها مظهرًا، تقطعه أودية طويلة.']},
    {en: 'Umbriel', ar: 'أمبرييل', d: 1169, a: 266000, p: 4.144, by: 'William Lassell', byAr: 'ويليام لاسيل', yr: 1851, see: 'pro',
     f: ['The darkest of Uranus\'s large moons, with an old cratered surface and one bright ring on the crater Wunda.'],
     fa: ['أشدّ أقمار أورانوس الكبيرة قتامة، سطحه قديم مليء بالفوهات، وعليه حلقة ساطعة واحدة في فوهة «وندا».']},
    {en: 'Titania', ar: 'تيتانيا', d: 1577, a: 436300, p: 8.706, by: 'William Herschel', byAr: 'ويليام هيرشل', yr: 1787, see: 'big',
     f: ['The largest moon of Uranus, an icy world split by huge canyons.', 'Uranus\'s moons are named after characters from Shakespeare and Alexander Pope, not from mythology.'],
     fa: ['أكبر أقمار أورانوس، عالم جليدي تشقّه أخاديد ضخمة.', 'أقمار أورانوس سُمّيت بأسماء شخصيات من مسرحيات شكسبير وشعر ألكسندر بوب، لا من الأساطير.']},
    {en: 'Oberon', ar: 'أوبيرون', d: 1523, a: 583500, p: 13.46, by: 'William Herschel', byAr: 'ويليام هيرشل', yr: 1787, see: 'big',
     f: ['The outermost of Uranus\'s five large moons, old and heavily cratered.', 'Like Uranus itself, its moons are tipped on their side, so they circle the planet like a bull\'s-eye seen from Earth at times.'],
     fa: ['أبعد أقمار أورانوس الخمسة الكبيرة، قديم ومليء بالفوهات.', 'مثل أورانوس نفسه، أقماره مائلة على جانبها، فتبدو من الأرض أحيانًا تدور حوله كدوائر هدف الرماية.']}
  ],
  neptune: [
    {en: 'Triton', ar: 'تريتون', d: 2707, a: 354760, p: 5.877, by: 'William Lassell', byAr: 'ويليام لاسيل', yr: 1846, see: 'big',
     f: ['It goes around Neptune backwards, against the planet\'s spin, so it was probably a dwarf planet from the Kuiper Belt captured by Neptune.', 'Voyager 2 saw geysers of nitrogen on it in 1989. Its surface, at about −235 °C, is one of the coldest ever measured.', 'Lassell found it only 17 days after Neptune itself was discovered.'],
     fa: ['يدور حول نبتون بالعكس، خلاف اتجاه دوران الكوكب، فهو على الأرجح كوكب قزم من حزام كايبر أسره نبتون.', 'رصد «فوياجر 2» عام 1989 ينابيع من النيتروجين عليه، وسطحه عند نحو −235 °م من أبرد الأسطح التي قيست.', 'اكتشفه لاسيل بعد 17 يومًا فقط من اكتشاف نبتون نفسه.']}
  ]
};
function moonsHTML(pid, lang) {
  const list = MOONS[pid]; if (!list) return '';
  const ar = lang === 'ar', big = 5268;
  const per = p => p < 1 ? (ar ? `${nf(p * 24, 1)} ساعة` : `${nf(p * 24, 1)} hours`) : (ar ? `${nf(p, 2)} يومًا` : `${nf(p, 2)} days`);
  const size = m => ar ? `${nf(m.d, m.d < 100 ? 1 : 0)} كم${m.en !== 'The Moon' ? ` (${m.d > 1000 ? nf(m.d / 3474, 2) + ' من قطر القمر' : 'أصغر كثيرًا من القمر'})` : ''}` : `${nf(m.d, m.d < 100 ? 1 : 0)} km${m.en !== 'The Moon' ? ` (${m.d > 1000 ? nf(m.d / 3474, 2) + ' × our Moon' : 'far smaller than our Moon'})` : ''}`;
  let h = `<div class="moons"><span class="sect-lbl">${pid === 'earth' ? (ar ? 'قمر الأرض' : 'Earth\'s moon') : (ar ? 'الأقمار الرئيسة' : 'Main moons')}</span>`;
  h += list.map(m => {
    const r = Math.max(2, 13 * Math.sqrt(m.d / big)).toFixed(1);
    const rows = [[ar ? 'القطر' : 'Size', size(m)], [ar ? 'البعد عن الكوكب' : 'Distance from the planet', `${nf(m.a)} ${ar ? 'كم' : 'km'}`], [ar ? 'دورة واحدة' : 'One orbit', per(m.p)],
      [ar ? 'الاكتشاف' : 'Discovered', m.yr ? `${ar ? m.byAr : m.by}, ${m.yr}` : (ar ? m.byAr : m.by)], [ar ? 'لرؤيته' : 'To see it', MOON_SEE[m.see][ar ? 1 : 0]]];
    return `<details class="moonf"><summary><svg class="mdot" aria-hidden="true" width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="${r}"/></svg><span class="m-n">${esc(ar ? m.ar : m.en)}${ar ? '' : ` <span lang="ar">${esc(m.ar)}</span>`}</span><span class="m-s">${nf(m.d, m.d < 100 ? 1 : 0)} ${ar ? 'كم' : 'km'}</span><span class="m-ar" aria-hidden="true">▸</span></summary>`
      + `<div class="m-in"><dl class="ftable">${rows.map(x => `<dt>${esc(x[0])}</dt><dd>${esc(x[1])}</dd>`).join('')}</dl><ul class="facts">${(ar ? m.fa : m.f).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></details>`;
  }).join('');
  return h + `</div>`;
}
