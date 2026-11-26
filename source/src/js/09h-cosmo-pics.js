/* ---------- Cosmology pictures: real photographs and maps, loaded when a topic is opened ---------- */
// by topic title: ['c', a Wikimedia Commons file, ..., and a credit line where its licence asks for one], ['w', a Wikipedia article about one object, whose main picture is that object] or ['webb', ESA/Webb image id, credit],
// then the caption in English and Arabic. A picture that cannot be found is left out.
const COS_PICS = {
  'How a redshift survey works': ['c', '2dfgrs.png', 'The 2dF Galaxy Redshift Survey: each dot is a galaxy, placed by its direction and its redshift distance. Earth is at the centre.', 'مسح 2dF للانزياح نحو الأحمر: كل نقطة مجرة، وُضعت حسب اتجاهها وبعدها المقيس بالانزياح. الأرض في المركز.'],
  'Dark matter halos': ['c', 'Dark matter halo.png', 'A dark matter halo from a computer simulation. The visible galaxy would sit in the bright centre.', 'هالة من المادة المظلمة من محاكاة حاسوبية. تقع المجرة المرئية في المركز الساطع.'],
  'Dark energy, dark matter and normal matter': ['c', "Comparison of normal matter and dark matter's large scale structure (heic0701c).jpg", 'Hubble mapped where normal matter is (left) and where dark matter is (right) in the same patch of sky: the dark matter forms the frame that normal matter follows.', 'رسم هابل خريطة لمكان المادة العادية (يسارًا) والمادة المظلمة (يمينًا) في الرقعة نفسها من السماء: المادة المظلمة تصنع الهيكل الذي تتبعه المادة العادية.', 'NASA, ESA and R. Massey (Caltech)'],
  'The Local Group and the Local Volume': ['c', 'Local Group Galaxies Comparison.png', 'The galaxies of the Local Group compared by size.', 'مجرات المجموعة المحلية مقارنة بأحجامها.'],
  'The Local Bubble': ['c', 'Local bubble.jpg', 'A NASA map of the Local Bubble: the Sun sits in a hollow of thin, hot gas about 300 light-years across.', 'خريطة من ناسا للفقاعة المحلية: تقع الشمس في تجويف من غاز رقيق حار عرضه نحو 300 سنة ضوئية.'],
  'The Local Group: held together by gravity': ['w', 'Andromeda Galaxy', 'The Andromeda Galaxy, the largest member of the Local Group, 2.5 million light-years away.', 'مجرة المرأة المسلسلة، أكبر أعضاء المجموعة المحلية، على بعد 2.5 مليون سنة ضوئية.'],
  'The Local Supercluster': ['c', 'Markarian.jpg', "Markarian's Chain, a curved line of galaxies at the heart of the Virgo Cluster, the centre of our Local Supercluster.", 'سلسلة ماركاريان، صف منحنٍ من المجرات في قلب عنقود العذراء، مركز عنقودنا الفائق المحلي.'],
  'Laniakea, our home supercluster': ['w', 'Laniakea Supercluster', 'A map of Laniakea and the flow of its galaxies.', 'خريطة لانياكيا وانسياق مجراتها.'],
  'The cosmic microwave background': ['c', 'Cosmic Microwave Background (CMB).jpeg', 'The whole sky in microwaves, mapped by the Planck satellite. The colours show differences of about one part in 100,000.', 'السماء كلها بالموجات الميكروية كما رسمها قمر بلانك. تُظهر الألوان فروقًا بنحو جزء من 100 ألف.', 'ESA and the Planck Collaboration'],
  'The cosmic web': ['c', 'Map of the Cosmic Web Generated from Slime Mould Algorithm.jpg', 'A 3D map of the cosmic web (purple) traced through real galaxies with a method borrowed from slime moulds.', 'خريطة ثلاثية الأبعاد للشبكة الكونية (بالبنفسجي) رُسمت عبر مجرات حقيقية بطريقة مستوحاة من فطر الوحل.', 'NASA, ESA, J. Burchett and O. Elek (UC Santa Cruz)'],
  'Distance in an expanding universe': ['w', "Webb's First Deep Field", "Webb's First Deep Field (2022): thousands of galaxies, some seen as they were more than 13 billion years ago.", 'أول حقل عميق لتلسكوب جيمس ويب (2022): آلاف المجرات، بعضها كما كان قبل أكثر من 13 مليار سنة.'],
  'SN 1987A: the first multi-messenger detection': ['w', 'SN 1987A', 'The remains of SN 1987A, with rings of gas lit up by the explosion.', 'بقايا المستعر الأعظم SN 1987A، مع حلقات من الغاز أضاءها الانفجار.'],
  'How gravitational-wave detectors work': ['c', 'Aerial View Of LIGO Hanford.jpg', 'LIGO Hanford from the air: its two 4-km arms meet at a right angle.', 'مرصد LIGO في هانفورد من الجو: ذراعاه، طول كل منهما 4 كم، تلتقيان بزاوية قائمة.'],
  'GW170817: the first multi-messenger event with gravitational waves': ['w', 'NGC 4993', 'NGC 4993, the galaxy where the two neutron stars collided.', 'المجرة NGC 4993 حيث اصطدم النجمان النيوترونيان.'],
  'What is a galaxy?': ['w', 'Hubble Ultra-Deep Field', 'The Hubble Ultra-Deep Field: almost every speck is a galaxy, in a patch of sky smaller than a grain of sand held at arm\'s length.', 'حقل هابل فائق العمق: كل نقطة تقريبًا مجرة، في رقعة من السماء أصغر من حبة رمل تُمسك على امتداد الذراع.'],
  'Distant galaxies': ['w', 'JADES-GS-z14-0', 'One of the most distant galaxies known, seen by the James Webb Space Telescope about 300 million years after the Big Bang.', 'من أبعد المجرات المعروفة، رصدها تلسكوب جيمس ويب بعد نحو 300 مليون سنة من الانفجار العظيم.'],
  'Spirals': ['w', 'Whirlpool Galaxy', 'The Whirlpool Galaxy (M51) and its small companion.', 'مجرة الدوّامة (M51) ورفيقتها الصغيرة.'],
  'Ellipticals': ['c', 'Messier 87 Hubble WikiSky.jpg', 'M87, a giant elliptical galaxy in the Virgo Cluster.', 'M87، مجرة إهليلجية عملاقة في عنقود العذراء.'],
  'Barred spirals': ['webb', 'weic2403e', 'NASA, ESA, CSA, STScI, J. Lee (STScI), T. Williams (Oxford), PHANGS Team', 'NGC 1300, a barred spiral, by the James Webb Space Telescope.', 'NGC 1300، مجرة حلزونية ذات قضيب، بعدسة تلسكوب جيمس ويب.'],
  'Irregular galaxies': ['w', 'Large Magellanic Cloud', 'The Large Magellanic Cloud, an irregular galaxy next to the Milky Way.', 'سحابة ماجلان الكبرى، مجرة غير منتظمة بجوار درب التبانة.'],
  'Galaxy groups and rich clusters': ['w', 'Coma Cluster', 'The Coma Cluster: more than a thousand galaxies, 320 million light-years away.', 'عنقود الهلبة: أكثر من ألف مجرة على بعد 320 مليون سنة ضوئية.'],
  'What happens when galaxies group together?': ['w', 'ESO 137-001', 'ESO 137-001, a "jellyfish galaxy" losing its gas to ram pressure as it falls into a cluster.', 'ESO 137-001، «مجرة قنديل البحر»، تفقد غازها بضغط الاندفاع وهي تسقط في عنقود.'],
  'What happens after galaxies merge?': ['w', 'Antennae Galaxies', 'The Antennae Galaxies: two spirals in the middle of merging, with bursts of new stars.', 'مجرتا الهوائيات: حلزونيتان في منتصف الاندماج، مع موجات من النجوم الجديدة.'],
  'Mergers and a change of shape': ['w', "Stephan's Quintet", "Stephan's Quintet, a group of galaxies pulling on each other.", 'خماسية ستيفان، مجموعة من المجرات يجذب بعضها بعضًا.'],
  'Gravitational lenses': ['c', 'A Horseshoe Einstein Ring from Hubble.JPG', 'The Cosmic Horseshoe: a distant blue galaxy bent into a near-complete ring by the red galaxy in front of it.', '«حدوة الحصان الكونية»: مجرة زرقاء بعيدة انحنى ضوؤها في حلقة شبه كاملة بفعل المجرة الحمراء التي أمامها.'],
  'How much of the universe is made of dark matter? About 25%': ['w', 'Bullet Cluster', 'The Bullet Cluster: in the usual picture, hot gas is pink (X-rays) and most of the mass, found by lensing, is blue.', 'عنقود الرصاصة: في صورته المعروفة يظهر الغاز الحار بالوردي (أشعة سينية)، ومعظم الكتلة، كما كشفتها العدسة، بالأزرق.'],
  'How much of the universe is made of dark energy? About 70%': ['w', 'SN 1994D', 'A type Ia supernova, the kind of "standard candle" that revealed dark energy.', 'مستعر أعظم من النوع Ia، من «الشموع القياسية» التي كشفت الطاقة المظلمة.']
};
const COS_PIC = (() => {
  const cache = {};
  async function wiki(title) {
    if (title in cache) return cache[title];
    try {
      const ctl = 'AbortController' in window ? new AbortController() : null; if (ctl) setTimeout(() => ctl.abort(), 8000);
      const r = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title.replace(/ /g, '_')), ctl ? {signal: ctl.signal} : {});
      if (!r.ok) return (cache[title] = null);
      const j = await r.json(), t = j.thumbnail && j.thumbnail.source; if (!t) return (cache[title] = null);
      const file = decodeURIComponent((t.split('/').slice(-2, -1)[0] || ''));
      return (cache[title] = {small: wmStd(t), big: /\.svg/i.test(file) ? t : t.replace(/\/\d+px-/, '/960px-'), file});
    } catch (e) { return null; }
  }
  function html(title, ar) {
    const p = COS_PICS[title]; if (!p) return '';
    const cap = p[0] === 'webb' ? (ar ? p[4] : p[3]) : (ar ? p[3] : p[2]);  // webb entries carry a credit before the captions
    return `<figure class="cos-pic" data-pk="${esc(title)}"><div class="cp-box"><span class="dph">${ar ? 'تُحمَّل الصورة…' : 'Loading the picture…'}</span></div><figcaption>${esc(cap)}</figcaption></figure>`;
  }
  async function load(fig) {
    if (fig.dataset.done) return; fig.dataset.done = '1';
    const p = COS_PICS[fig.dataset.pk], box = fig.querySelector('.cp-box'), ar = state.lang === 'ar'; if (!p) return;
    const fail = () => { if (navigator.onLine === false) { const ph = box.querySelector('.dph'); if (ph) ph.textContent = ar ? 'الصورة تحتاج إلى اتصال بالإنترنت' : 'The picture needs an internet connection'; delete fig.dataset.done; } else fig.hidden = true; };
    // try each address in turn (a big size first, then smaller ones, then the original file)
    const put = (srcs, alt, credit) => { srcs = [].concat(srcs).filter(Boolean); const img = new Image(); img.alt = alt; img.decoding = 'async';
      img.onload = () => { const ph = box.querySelector('.dph'); if (ph) ph.remove(); box.prepend(img); box.classList.add('ok'); box.insertAdjacentHTML('beforeend', credit); };
      img.onerror = () => { if (srcs.length > 1) put(srcs.slice(1), alt, credit); else fail(); };
      img.src = srcs[0]; };
    const alt = (fig.querySelector('figcaption') || {}).textContent || '';
    if (p[0] === 'c') { const f = encodeURIComponent(p[1].replace(/ /g, '_')), fp = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + f;
      put([fp + '?width=960', fp + '?width=500', fp], alt, `<a class="dcr" href="https://commons.wikimedia.org/wiki/File:${f}" target="_blank" rel="noopener">${p[4] ? esc(p[4]) + ' · ' : ''}${ar ? 'المصدر والترخيص: ويكيميديا كومنز' : 'Source and licence: Wikimedia Commons'}</a>`); return; }
    if (p[0] === 'webb') { put([`https://cdn.esawebb.org/archives/images/screen/${p[1]}.jpg`], alt, `<a class="dcr wcr" href="https://esawebb.org/images/${p[1]}/" target="_blank" rel="noopener"><b>${ar ? 'تلسكوب جيمس ويب' : 'James Webb'}</b> · ${esc(p[2])} · CC BY 4.0</a>`, null); return; }
    const w = await wiki(p[1]); if (!w) return fail();
    put([w.big, w.small], alt, `<a class="dcr" href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(w.file)}" target="_blank" rel="noopener">${ar ? 'المصدر والترخيص: ويكيميديا كومنز' : 'Source and licence: Wikimedia Commons'}</a>`);
  }
  // load a topic's picture when it is opened
  document.addEventListener('toggle', ev => { const d = ev.target; if (!d.matches || !d.matches('.cosfold') || !d.open) return; d.querySelectorAll('.cos-pic').forEach(load); }, true);
  addEventListener('online', () => document.querySelectorAll('.cosfold[open] .cos-pic:not([data-done])').forEach(load));
  return {html, load};
})();
