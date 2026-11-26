/* ---------- Cosmology pictures: real photographs and maps, loaded when a topic is opened ---------- */
// by topic title: ['w', Wikipedia article whose lead picture is used] or ['webb', ESA/Webb image id, credit], then the caption in English and Arabic
const COS_PICS = {
  'The Local Group: held together by gravity': ['w', 'Andromeda Galaxy', 'The Andromeda Galaxy, the largest member of the Local Group, 2.5 million light-years away.', 'مجرة المرأة المسلسلة، أكبر أعضاء المجموعة المحلية، على بعد 2.5 مليون سنة ضوئية.'],
  'The Local Supercluster': ['w', 'Virgo Cluster', 'The heart of the Virgo Cluster, the centre of our Local Supercluster.', 'قلب عنقود العذراء، مركز عنقودنا المجري الفائق المحلي.'],
  'Laniakea, our home supercluster': ['w', 'Laniakea Supercluster', 'A map of Laniakea and the flow of its galaxies.', 'خريطة لانياكيا وانسياق مجراتها.'],
  'The cosmic microwave background': ['w', 'Cosmic microwave background', 'The whole sky in microwaves, mapped by the Planck satellite. The colours show differences of about one part in 100,000.', 'السماء كلها بالموجات الميكروية كما رسمها قمر بلانك. تُظهر الألوان فروقًا بنحو جزء من 100 ألف.'],
  'From ripples to a web: non-linear collapse': ['w', 'Millennium Run', 'The Millennium Simulation, a supercomputer model of how the cosmic web grows.', '«محاكاة الألفية»، نموذج حاسوبي عملاق لكيفية نمو الشبكة الكونية.'],
  'The cosmic web': ['w', 'Galaxy filament', 'A simulation of the large-scale structure of the universe: filaments of galaxies around empty voids.', 'محاكاة للبنية الكبرى للكون: خيوط من المجرات حول فراغات خالية.'],
  'Distance in an expanding universe': ['w', "Webb's First Deep Field", "Webb's First Deep Field (2022): thousands of galaxies, some seen as they were more than 13 billion years ago.", 'أول حقل عميق لتلسكوب جيمس ويب (2022): آلاف المجرات، بعضها كما كان قبل أكثر من 13 مليار سنة.'],
  'SN 1987A: the first multi-messenger detection': ['w', 'SN 1987A', 'The remains of SN 1987A, with rings of gas lit up by the explosion.', 'بقايا المستعر الأعظم SN 1987A، مع حلقات من الغاز أضاءها الانفجار.'],
  'How gravitational-wave detectors work': ['w', 'LIGO', 'One of the LIGO detectors: two 4-km arms meeting at a right angle.', 'أحد كاشفَي LIGO: ذراعان طول كل منهما 4 كم تلتقيان بزاوية قائمة.'],
  'GW170817: the first multi-messenger event with gravitational waves': ['w', 'NGC 4993', 'NGC 4993, the galaxy where the two neutron stars collided.', 'المجرة NGC 4993 حيث اصطدم النجمان النيوترونيان.'],
  'What is a galaxy?': ['w', 'Hubble Ultra-Deep Field', 'The Hubble Ultra-Deep Field: almost every speck is a galaxy, in a patch of sky smaller than a grain of sand held at arm\'s length.', 'حقل هابل فائق العمق: كل نقطة تقريبًا مجرة، في رقعة من السماء أصغر من حبة رمل تُمسك على امتداد الذراع.'],
  'They come in all shapes and sizes': ['w', 'Hubble sequence', 'Hubble\'s tuning fork of galaxy shapes.', 'شوكة هابل الرنانة لأشكال المجرات.'],
  'Distant galaxies': ['w', 'JADES-GS-z14-0', 'One of the most distant galaxies known, seen by the James Webb Space Telescope about 300 million years after the Big Bang.', 'من أبعد المجرات المعروفة، رصدها تلسكوب جيمس ويب بعد نحو 300 مليون سنة من الانفجار العظيم.'],
  'Spirals': ['w', 'Whirlpool Galaxy', 'The Whirlpool Galaxy (M51) and its small companion.', 'مجرة الدوّامة (M51) ورفيقتها الصغيرة.'],
  'Ellipticals': ['w', 'Messier 87', 'M87, a giant elliptical galaxy in the Virgo Cluster.', 'M87، مجرة إهليلجية عملاقة في عنقود العذراء.'],
  'Barred spirals': ['webb', 'weic2403e', 'NASA, ESA, CSA, STScI, J. Lee (STScI), T. Williams (Oxford), PHANGS Team', 'NGC 1300, a barred spiral, by the James Webb Space Telescope.', 'NGC 1300، مجرة حلزونية ذات قضيب، بعدسة تلسكوب جيمس ويب.'],
  'Irregular galaxies': ['w', 'Large Magellanic Cloud', 'The Large Magellanic Cloud, an irregular galaxy next to the Milky Way.', 'سحابة ماجلان الكبرى، مجرة غير منتظمة بجوار درب التبانة.'],
  'Galaxy groups and rich clusters': ['w', 'Coma Cluster', 'The Coma Cluster: more than a thousand galaxies, 320 million light-years away.', 'عنقود الهلبة: أكثر من ألف مجرة على بعد 320 مليون سنة ضوئية.'],
  'What happens when galaxies group together?': ['w', 'ESO 137-001', 'ESO 137-001, a "jellyfish galaxy" losing its gas to ram pressure as it falls into a cluster.', 'ESO 137-001، «مجرة قنديل البحر»، تفقد غازها بضغط الاندفاع وهي تسقط في عنقود.'],
  'What happens after galaxies merge?': ['w', 'Antennae Galaxies', 'The Antennae Galaxies: two spirals in the middle of merging, with bursts of new stars.', 'مجرتا الهوائيات: حلزونيتان في منتصف الاندماج، مع موجات من النجوم الجديدة.'],
  'Mergers and a change of shape': ['w', "Stephan's Quintet", "Stephan's Quintet, a group of galaxies pulling on each other.", 'خماسية ستيفان، مجموعة من المجرات يجذب بعضها بعضًا.'],
  'Gravitational lenses': ['w', 'Einstein ring', 'An Einstein ring: a distant galaxy bent into a near-perfect circle by a galaxy in front of it.', 'حلقة أينشتاين: مجرة بعيدة انحنى ضوؤها في دائرة شبه كاملة بفعل مجرة أمامها.'],
  'How much of the universe is made of dark matter? About 25%': ['w', 'Bullet Cluster', 'The Bullet Cluster: in the usual picture, hot gas is pink (X-rays) and most of the mass, found by lensing, is blue.', 'عنقود الرصاصة: في صورته المعروفة يظهر الغاز الحار بالوردي (أشعة سينية)، ومعظم الكتلة، كما كشفتها العدسة، بالأزرق.'],
  'How much of the universe is made of dark energy? About 70%': ['w', 'Type Ia supernova', 'A type Ia supernova, the kind of "standard candle" that revealed dark energy.', 'مستعر أعظم من النوع Ia، من «الشموع القياسية» التي كشفت الطاقة المظلمة.']
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
      return (cache[title] = {small: t, big: /\.svg/i.test(file) ? t : t.replace(/\/\d+px-/, '/960px-'), file});
    } catch (e) { return null; }
  }
  function html(title, ar) {
    const p = COS_PICS[title]; if (!p) return '';
    const cap = p[0] === 'webb' ? (ar ? p[4] : p[3]) : (ar ? p[3] : p[2]);
    return `<figure class="cos-pic" data-pk="${esc(title)}"><div class="cp-box"><span class="dph">${ar ? 'تُحمَّل الصورة…' : 'Loading the picture…'}</span></div><figcaption>${esc(cap)}</figcaption></figure>`;
  }
  async function load(fig) {
    if (fig.dataset.done) return; fig.dataset.done = '1';
    const p = COS_PICS[fig.dataset.pk], box = fig.querySelector('.cp-box'), ar = state.lang === 'ar'; if (!p) return;
    const fail = () => { const ph = box.querySelector('.dph'); if (ph) ph.textContent = navigator.onLine === false ? (ar ? 'الصورة تحتاج إلى اتصال بالإنترنت' : 'The picture needs an internet connection') : (ar ? 'الصورة غير متاحة الآن' : 'Picture not available right now'); delete fig.dataset.done; };
    const put = (src, alt, credit, fallback) => { const img = new Image(); img.alt = alt; img.decoding = 'async';
      img.onload = () => { const ph = box.querySelector('.dph'); if (ph) ph.remove(); box.prepend(img); box.classList.add('ok'); box.insertAdjacentHTML('beforeend', credit); };
      img.onerror = () => { if (fallback) put(fallback, alt, credit, null); else fail(); };
      img.src = src; };
    const alt = (fig.querySelector('figcaption') || {}).textContent || '';
    if (p[0] === 'webb') { put(`https://cdn.esawebb.org/archives/images/screen/${p[1]}.jpg`, alt, `<a class="dcr wcr" href="https://esawebb.org/images/${p[1]}/" target="_blank" rel="noopener"><b>${ar ? 'تلسكوب جيمس ويب' : 'James Webb'}</b> · ${esc(p[2])} · CC BY 4.0</a>`, null); return; }
    const w = await wiki(p[1]); if (!w) return fail();
    put(w.big, alt, `<a class="dcr" href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(w.file)}" target="_blank" rel="noopener">${ar ? 'المصدر والترخيص: ويكيميديا كومنز' : 'Source and licence: Wikimedia Commons'}</a>`, w.small);
  }
  // load a topic's picture when it is opened
  document.addEventListener('toggle', ev => { const d = ev.target; if (!d.matches || !d.matches('.cosfold') || !d.open) return; d.querySelectorAll('.cos-pic').forEach(load); }, true);
  addEventListener('online', () => document.querySelectorAll('.cosfold[open] .cos-pic:not([data-done])').forEach(load));
  return {html, load};
})();
