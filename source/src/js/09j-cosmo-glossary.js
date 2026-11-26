/* ---------- Cosmology glossary: the main words in English and Arabic, with a one-line meaning in each ---------- */
const COS_GLOSSARY = [
  {en: 'Accretion', ar: 'التراكم', d: 'A galaxy or star pulling in fresh gas and growing.', da: 'جذب المجرة أو النجم غازًا جديدًا فينمو.'},
  {en: 'Active galactic nucleus (AGN)', ar: 'النواة المجرية النشطة', d: 'A galaxy\'s centre where the giant black hole is feeding and shines brightly.', da: 'مركز مجرة يتغذى فيه الثقب الأسود العملاق فيضيء بشدة.'},
  {en: 'Baryon acoustic oscillations (BAO)', ar: 'التذبذبات الصوتية الباريونية', d: 'Frozen sound waves from the early universe that left a preferred spacing between galaxies, used as a ruler.', da: 'موجات صوت متجمّدة من الكون المبكر تركت مسافة مفضّلة بين المجرات، تُستعمل كمسطرة.'},
  {en: 'Baryons', ar: 'الباريونات', d: 'Normal matter made of atoms (protons and neutrons): about 5% of the universe.', da: 'المادة العادية المصنوعة من الذرات (البروتونات والنيوترونات): نحو 5% من الكون.'},
  {en: 'Big Bang', ar: 'الانفجار العظيم', d: 'The hot, dense beginning of the universe about 13.8 billion years ago, since when space has been expanding.', da: 'البداية الحارة الكثيفة للكون قبل نحو 13.8 مليار سنة، ومنذ ذلك الحين والفضاء يتمدد.'},
  {en: 'Cosmic microwave background (CMB)', ar: 'إشعاع الخلفية الكونية الميكروي', d: 'The oldest light, released 380,000 years after the Big Bang and now faint microwaves from every direction.', da: 'أقدم ضوء، انطلق بعد 380 ألف سنة من الانفجار العظيم، وهو اليوم موجات ميكروية خافتة من كل اتجاه.'},
  {en: 'Cosmic web', ar: 'الشبكة الكونية', d: 'The pattern of filaments, walls and voids in which galaxies are arranged.', da: 'النسيج المكوّن من الخيوط والجدران والفراغات الذي تصطف فيه المجرات.'},
  {en: 'Cosmological constant (Λ)', ar: 'الثابت الكوني', d: 'The simplest form of dark energy: a fixed amount of energy in every bit of empty space.', da: 'أبسط صور الطاقة المظلمة: كمية ثابتة من الطاقة في كل جزء من الفضاء الفارغ.'},
  {en: 'Critical density', ar: 'الكثافة الحرجة', d: 'The density that makes space flat: about six hydrogen atoms in every cubic metre.', da: 'الكثافة التي تجعل الفضاء مسطحًا: نحو ست ذرات هيدروجين في كل متر مكعب.'},
  {en: 'Dark energy', ar: 'الطاقة المظلمة', d: 'The unknown something that makes the expansion of the universe speed up: about 70% of the universe.', da: 'الشيء المجهول الذي يجعل تمدد الكون يتسارع: نحو 70% من الكون.'},
  {en: 'Dark matter', ar: 'المادة المظلمة', d: 'Unseen matter that gives off no light but pulls with gravity: about a quarter of the universe.', da: 'مادة غير مرئية لا تبعث ضوءًا لكنها تجذب بجاذبيتها: نحو ربع الكون.'},
  {en: 'Einstein ring', ar: 'حلقة أينشتاين', d: 'A ring of light made when a galaxy lines up exactly behind a gravitational lens.', da: 'حلقة من الضوء تتكوّن حين تصطف مجرة تمامًا خلف عدسة جاذبية.'},
  {en: 'Filament', ar: 'الخيط المجري', d: 'A long thread of galaxies and gas that links clusters in the cosmic web.', da: 'خيط طويل من المجرات والغاز يصل بين العناقيد في الشبكة الكونية.'},
  {en: 'Gravitational lens', ar: 'عدسة الجاذبية', d: 'A mass that bends the light of things behind it, making arcs, copies or rings.', da: 'كتلة تحني ضوء ما خلفها فتصنع أقواسًا أو نسخًا أو حلقات.'},
  {en: 'Gravitational wave', ar: 'موجة الجاذبية', d: 'A ripple in space itself, made by heavy objects moving fast, that travels at the speed of light.', da: 'تموّج في الفضاء نفسه تصنعه أجرام ثقيلة تتحرك بسرعة، وينتقل بسرعة الضوء.'},
  {en: 'Halo', ar: 'الهالة', d: 'A huge, roughly round clump of dark matter in which a galaxy sits.', da: 'كتلة ضخمة مستديرة تقريبًا من المادة المظلمة تقع المجرة في داخلها.'},
  {en: 'Hubble constant (H₀)', ar: 'ثابت هابل', d: 'Today\'s expansion rate: about 70 km/s for every megaparsec of distance.', da: 'معدل التمدد اليوم: نحو 70 كم/ث لكل ميغافرسخ من المسافة.'},
  {en: 'Hubble–Lemaître law', ar: 'قانون هابل–لوميتر', d: 'The farther away a galaxy is, the faster it moves away: speed = H₀ × distance.', da: 'كلما بعدت المجرة زادت سرعة ابتعادها: السرعة = H₀ × المسافة.'},
  {en: 'Interferometer', ar: 'مقياس التداخل', d: 'An instrument that splits and recombines light to measure tiny changes in length, as LIGO does.', da: 'جهاز يقسم الضوء ثم يجمعه ليقيس تغيرات ضئيلة في الطول، كما يفعل LIGO.'},
  {en: 'Kilonova', ar: 'الكيلونوفا', d: 'The glow of new heavy elements made when two neutron stars collide.', da: 'توهج العناصر الثقيلة الجديدة التي تتكوّن حين يصطدم نجمان نيوترونيان.'},
  {en: 'Lambda-CDM (ΛCDM)', ar: 'نموذج لامبدا-CDM', d: 'The standard model of cosmology: dark energy as a cosmological constant, plus cold dark matter.', da: 'النموذج القياسي لعلم الكون: الطاقة المظلمة على هيئة ثابت كوني، مع المادة المظلمة الباردة.'},
  {en: 'Light-year', ar: 'السنة الضوئية', d: 'The distance light travels in a year: about 9.46 trillion km.', da: 'المسافة التي يقطعها الضوء في سنة: نحو 9.46 تريليون كم.'},
  {en: 'Megaparsec (Mpc)', ar: 'الميغافرسخ', d: 'A million parsecs: about 3.26 million light-years.', da: 'مليون فرسخ فلكي: نحو 3.26 مليون سنة ضوئية.'},
  {en: 'Multi-messenger astronomy', ar: 'علم الفلك متعدد الرسائل', d: 'Studying one event through several messengers together: light, neutrinos, gravitational waves or cosmic rays.', da: 'دراسة حدث واحد بعدة رسائل معًا: الضوء والنيوترينوات وموجات الجاذبية والأشعة الكونية.'},
  {en: 'Neutrino', ar: 'النيوترينو', d: 'A ghostly particle that passes through almost anything.', da: 'جسيم شبحي يعبر كل شيء تقريبًا.'},
  {en: 'Neutron star', ar: 'النجم النيوتروني', d: 'The tiny, very dense core left by some supernovae: more than the Sun\'s mass in a ball about 20 km wide.', da: 'القلب الصغير الكثيف جدًا الذي يخلّفه بعض المستعرات العظمى: كتلة أكبر من كتلة الشمس في كرة عرضها نحو 20 كم.'},
  {en: 'Power spectrum', ar: 'طيف القدرة', d: 'A way of turning a map of spots into numbers: how strong each size of ripple is.', da: 'طريقة لتحويل خريطة البقع إلى أرقام: ما قوة كل حجم من أحجام التموجات.'},
  {en: 'Quenching', ar: 'إخماد تكوّن النجوم', d: 'When a galaxy stops forming new stars.', da: 'توقف المجرة عن تكوين نجوم جديدة.'},
  {en: 'Redshift (z)', ar: 'الانزياح نحو الأحمر', d: 'The stretching of light to longer, redder waves as it crosses expanding space.', da: 'مطّ الضوء إلى موجات أطول وأكثر احمرارًا حين يعبر فضاءً يتمدد.'},
  {en: 'Reionization', ar: 'إعادة التأيّن', d: 'When the light of the first stars and galaxies split the universe\'s hydrogen apart again, finished about a billion years after the Big Bang.', da: 'حين فكّك ضوء النجوم والمجرات الأولى هيدروجين الكون من جديد، واكتمل ذلك بعد نحو مليار سنة من الانفجار العظيم.'},
  {en: 'Standard candle', ar: 'الشمعة القياسية', d: 'An object whose true brightness is known, such as a type Ia supernova, used to measure distance.', da: 'جرم سطوعه الحقيقي معروف، مثل المستعر الأعظم من النوع Ia، يُستعمل لقياس المسافة.'},
  {en: 'Standard ruler', ar: 'المسطرة القياسية', d: 'Something of known size, such as the BAO spacing, used to measure distance.', da: 'شيء معروف الحجم، مثل مسافة التذبذبات الصوتية الباريونية، يُستعمل لقياس المسافة.'},
  {en: 'Supercluster', ar: 'العنقود المجري الفائق', d: 'A huge collection of galaxy groups and clusters, such as Laniakea.', da: 'تجمّع هائل من المجموعات والعناقيد المجرية، مثل لانياكيا.'},
  {en: 'Tully–Fisher relation', ar: 'علاقة تَلي–فيشر', d: 'The faster a spiral galaxy spins, the brighter it is.', da: 'كلما دارت المجرة الحلزونية أسرع كانت أسطع.'},
  {en: 'Velocity dispersion', ar: 'تشتت السرعات', d: 'The spread of star speeds in a galaxy; measuring it gives the galaxy\'s mass.', da: 'التفاوت في سرعات النجوم داخل المجرة، وقياسه يعطي كتلة المجرة.'},
  {en: 'Void', ar: 'الفراغ الكوني', d: 'A huge region of the cosmic web with very few galaxies.', da: 'منطقة هائلة من الشبكة الكونية فيها القليل جدًا من المجرات.'}
];
function cosGlossaryHTML(ar) {
  const list = COS_GLOSSARY.slice().sort((a, b) => ar ? a.ar.replace(/^ال/, '').localeCompare(b.ar.replace(/^ال/, ''), 'ar') : a.en.localeCompare(b.en));
  return `<h3 class="cos-h">${ar ? 'المسرد' : 'Glossary'}</h3><p class="cos-in">${ar ? `${list.length} مصطلحًا من علم الكون بالعربية والإنجليزية، مع معنى كل منها في سطر واحد.` : `${list.length} Cosmology words in English and Arabic, each with its meaning in one line.`}</p>`
    + `<div class="glo">${list.map(w => `<div class="glo-row" data-w="${esc(w.en)}"><div class="glo-t"><b${ar ? ' lang="ar"' : ''}>${esc(ar ? w.ar : w.en)}</b><span ${ar ? 'lang="en" dir="ltr"' : 'lang="ar" dir="rtl"'}>${esc(ar ? w.en : w.ar)}</span></div><p>${esc(ar ? w.da : w.d)}</p></div>`).join('')}</div>`;
}
