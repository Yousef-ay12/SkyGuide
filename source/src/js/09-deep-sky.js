/* ---------- deep-sky objects: what each type is, and a fact for each named object ---------- */
// [question EN, answer EN, question AR, answer AR, kids EN, kids AR]
const DSO_TYPE_INFO = {
  PN: ['What is a planetary nebula?', 'The glowing shell of gas that a dying star like the Sun throws off at the end of its life. The leftover core, a small hot white dwarf, makes the gas shine. It has nothing to do with planets: in early telescopes these round glows just looked like planets.',
       'ما السديم الكوكبي؟', 'غلاف متوهج من الغاز يقذفه نجم يحتضر، مثل الشمس، في آخر حياته. ويبقى قلبه قزمًا أبيض صغيرًا حارًّا يجعل الغاز يتوهج. ولا علاقة له بالكواكب، وإنما بدت هذه الأقراص المستديرة في التلسكوبات الأولى شبيهة بالكواكب.',
       'It is the colourful puff a star like our Sun blows out when it gets very old.', 'هو نفخة ملونة من الغاز يطلقها نجم مثل شمسنا حين يكبر في السن كثيرًا.'],
  GCl: ['What is a globular cluster?', 'A ball of hundreds of thousands, sometimes millions, of very old stars packed tightly together by gravity. Many are over 10 billion years old, almost as old as the universe. About 150 of them circle the Milky Way.',
        'ما العنقود الكروي؟', 'كرة من مئات الآلاف، وأحيانًا الملايين، من النجوم القديمة جدًّا، تجمعها الجاذبية متراصّة. كثير منها عمره أكثر من 10 مليارات سنة، أي قريب من عمر الكون. ويدور نحو 150 منها حول مجرة درب التبانة.',
        'It is like a giant ball of glitter made of very old stars.', 'هو مثل كرة عملاقة من البريق، مصنوعة من نجوم قديمة جدًّا.'],
  OCl: ['What is an open cluster?', 'A loose family of young stars that were born together from the same cloud of gas. They hold together for a few hundred million years, then slowly drift apart. Our Sun was probably born in a cluster like this.',
        'ما العنقود المفتوح؟', 'عائلة متفرقة من النجوم الشابة وُلدت معًا من سحابة الغاز نفسها. تبقى متقاربة بضع مئات من ملايين السنين ثم تتباعد ببطء. والأرجح أن شمسنا وُلدت في عنقود كهذا.',
        'It is a family of brother and sister stars that were born at the same time.', 'هو عائلة من النجوم الإخوة وُلدت كلها في الوقت نفسه.'],
  G: ['What is a galaxy?', 'A huge island of stars, gas and dust held together by gravity, with millions to trillions of stars. Our Sun is one star in the Milky Way galaxy. Every galaxy listed here is far outside the Milky Way, so its light is millions of years old.',
      'ما المجرة؟', 'جزيرة هائلة من النجوم والغاز والغبار تجمعها الجاذبية، فيها من ملايين النجوم إلى آلاف المليارات. وشمسنا نجم واحد في مجرة درب التبانة. وكل مجرة هنا تقع بعيدًا خارج درب التبانة، فضوؤها الذي نراه عمره ملايين السنين.',
      'It is a giant city of billions of stars. We live in one called the Milky Way.', 'هي مدينة عملاقة فيها مليارات النجوم، ونحن نعيش في واحدة اسمها درب التبانة.'],
  HII: ['What is an emission nebula?', 'A giant cloud of gas where new stars are being born. Hot young stars inside it make the hydrogen gas glow, mostly in red.',
        'ما سديم الانبعاث؟', 'سحابة غاز عملاقة تولد فيها نجوم جديدة. والنجوم الشابة الحارة داخلها تجعل غاز الهيدروجين يتوهج، وأغلبه باللون الأحمر.',
        'It is a glowing cloud where baby stars are born.', 'هو سحابة متوهجة تولد فيها النجوم الصغيرة.'],
  Neb: ['What is a nebula?', 'A cloud of gas and dust in space. Some glow red because hot young stars light up their gas, some shine blue because their dust reflects starlight, and many are places where new stars are being born.',
        'ما السديم؟', 'سحابة من الغاز والغبار في الفضاء. بعضها يتوهج بالأحمر لأن النجوم الشابة الحارة تضيء غازها، وبعضها يلمع بالأزرق لأن غباره يعكس ضوء النجوم، وكثير منها أماكن تولد فيها نجوم جديدة.',
        'It is a big cloud in space, and many of them are nurseries for new stars.', 'هو سحابة كبيرة في الفضاء، وكثير منها حضانة للنجوم الجديدة.'],
  'Cl+N': ['What is a cluster with a nebula?', 'A group of newborn stars still inside the cloud of gas they were born from. Their strong light makes the leftover gas glow around them.',
           'ما العنقود مع السديم؟', 'مجموعة من النجوم حديثة الولادة ما زالت داخل سحابة الغاز التي وُلدت منها. وضوؤها القوي يجعل بقية الغاز تتوهج من حولها.',
           'It is a nest of newborn stars, still wrapped in the cloud they came from.', 'هو عشّ لنجوم حديثة الولادة، ما زالت ملفوفة في السحابة التي جاءت منها.'],
  RfN: ['What is a reflection nebula?', 'A cloud of dust that does not shine by itself: it reflects the light of nearby stars, like fog lit by a car\'s headlights. It usually looks blue, for the same reason the sky is blue.',
        'ما السديم العاكس؟', 'سحابة من الغبار لا تضيء بنفسها، بل تعكس ضوء النجوم القريبة منها، كالضباب حين تضيئه مصابيح السيارة. ويبدو عادةً أزرق، للسبب نفسه الذي يجعل السماء زرقاء.',
        'It is space dust lit up by a star, like fog in a torch beam.', 'هو غبار فضائي يضيئه نجم، كالضباب في ضوء المصباح.'],
  DrkN: ['What is a dark nebula?', 'A thick cloud of cold dust and gas that blocks the light of the stars and glowing gas behind it, so it looks like a dark shape or hole in the sky. New stars may one day form inside it.',
         'ما السديم المظلم؟', 'سحابة كثيفة من الغبار والغاز البارد تحجب ضوء النجوم والغاز المتوهج خلفها، فتبدو شكلًا مظلمًا أو ثقبًا في السماء. وقد تتكون داخلها يومًا ما نجوم جديدة.',
         'It is a thick cloud of space dust that blocks the stars behind it, like a shadow.', 'هو سحابة كثيفة من الغبار الفضائي تحجب النجوم خلفها، كأنها ظل.'],
  SNR: ['What is a supernova remnant?', 'The expanding wreck of a giant star that blew up in a supernova explosion. Its shock waves keep spreading for thousands of years, and they scatter elements like iron and calcium into space, the same atoms that later end up in planets and in us.',
        'ما بقايا المستعر الأعظم؟', 'حطام نجم عملاق انفجر انفجار مستعر أعظم وما زال يتمدد. وتظل موجاته الصادمة تنتشر آلاف السنين، وتنثر في الفضاء عناصر مثل الحديد والكالسيوم، وهي الذرات نفسها التي تصير لاحقًا جزءًا من الكواكب ومنّا نحن.',
        'It is what is left after a giant star goes BOOM.', 'هو ما يبقى بعد أن ينفجر نجم عملاق انفجارًا هائلًا.'],
  '*Ass': ['What is a star group or star cloud?', 'A rich patch of stars that looks like a group from Earth. Some are crowded parts of the Milky Way seen through a gap in the dust; others are stars at different distances that only happen to line up.',
           'ما مجموعة النجوم أو سحابة النجوم؟', 'رقعة غنية بالنجوم تبدو من الأرض مجموعةً واحدة. بعضها أجزاء مزدحمة من درب التبانة نراها من فجوة في الغبار، وبعضها نجوم على أبعاد مختلفة تصادف أنها اصطفّت معًا.',
           'It is a bunch of stars that looks like a group from where we stand.', 'هي مجموعة من النجوم تبدو متجمعة من المكان الذي نقف فيه.']
};
// a fun fact for each named object: [English, Arabic]
const DSO_FACTS = {
  NGC3031: ["Named after Johann Bode, who found it in 1774 together with its neighbour, the Cigar Galaxy. Its gravity is stirring the Cigar Galaxy up.", 'سُمّيت باسم يوهان بوده الذي اكتشفها سنة 1774 مع جارتها مجرة السيجار، وجاذبيتها تثير مجرة السيجار وتضطربها.'],
  NGC5457: ['A spiral we see face-on, about 170,000 light years across: nearly twice as wide as the Milky Way.', 'مجرة حلزونية نراها من الأمام، عرضها نحو 170,000 سنة ضوئية، أي قرابة ضعف عرض درب التبانة.'],
  NGC3034: ["A 'starburst' galaxy: a close pass by Bode's Galaxy set off a burst of star birth, and it now makes new stars about ten times faster than the Milky Way.", 'مجرة «انفجار نجمي»: أثار مرور مجرة بوده قربها موجة من ولادة النجوم، فهي تصنع الآن نجومًا جديدة أسرع من درب التبانة بنحو عشر مرات.'],
  NGC3587: ['Two dark patches inside this round cloud look like the eyes of an owl, which gave it its name.', 'بقعتان مظلمتان داخل هذه السحابة المستديرة تشبهان عيني بومة، ومنهما جاء اسمه.'],
  NGC6543: ['One of the most detailed planetary nebulae known, full of rings, shells and jets. In 1864 it was the first nebula whose light was split into a spectrum, which proved that nebulae like it are made of glowing gas.', 'من أكثر السدم الكوكبية تفصيلًا، مليء بالحلقات والأغلفة والنفثات. وفي سنة 1864 كان أول سديم يُحلَّل ضوؤه إلى طيف، فأثبت ذلك أن السدم المشابهة له مصنوعة من غاز متوهج.'],
  NGC7023: ['A cloud of dust lit up by a hot young star in its middle. Its soft petals of light gave it the name of the iris flower.', 'سحابة من الغبار يضيئها نجم شاب حار في وسطها، وأعطتها بتلاتها الضوئية الناعمة اسم زهرة السوسن.'],
  NGC6205: ['Holds several hundred thousand stars. In 1974 the Arecibo radio telescope beamed a message towards it, and it will take about 25,000 years to get there.', 'يضم عدة مئات الآلاف من النجوم. وفي سنة 1974 أرسل تلسكوب أريسيبو الراديوي رسالة نحوه، وستحتاج نحو 25,000 سنة لتصل إليه.'],
  NGC6720: ['The ring is gas thrown off by a dying star, which now sits in the middle as a tiny white dwarf. Our Sun may make something similar in about 5 billion years.', 'الحلقة غاز قذفه نجم يحتضر، وهو الآن قزم أبيض صغير في وسطها. وقد تصنع شمسنا شيئًا مشابهًا بعد نحو 5 مليارات سنة.'],
  NGC7000: ["Its shape looks like the continent of North America, with even a 'Gulf of Mexico' made by a dark cloud of dust.", 'شكله يشبه قارة أمريكا الشمالية، وفيه حتى «خليج مكسيك» تصنعه سحابة مظلمة من الغبار.'],
  NGC6960: ['Part of the Cygnus Loop, the remains of a star that exploded roughly 10,000 to 20,000 years ago. The bright star 52 Cygni sits in front of it by chance.', 'جزء من حلقة الدجاجة، وهي بقايا نجم انفجر قبل نحو 10,000 إلى 20,000 سنة. والنجم اللامع 52 الدجاجة يقع أمامه مصادفةً.'],
  NGC6992: ['The eastern side of the same exploded star. Its thin glowing threads are shock waves still spreading out through space.', 'الجانب الشرقي من النجم المنفجر نفسه، وخيوطه الرقيقة المتوهجة موجات صادمة ما زالت تنتشر في الفضاء.'],
  NGC0457: ["Also called the E.T. Cluster: two bright stars look like eyes, and the other stars make a body with outstretched arms.", 'يُسمّى أيضًا عنقود «إي تي»: نجمان لامعان يشبهان عينين، وبقية النجوم تصنع جسمًا بذراعين ممدودتين.'],
  NGC0869: ['One half of the Double Cluster, two young star clusters side by side that are easy to see with binoculars and have been known since ancient times.', 'نصف العنقود المزدوج، وهما عنقودان نجميان شابان متجاوران يسهل رؤيتهما بالمنظار، ومعروفان منذ العصور القديمة.'],
  NGC0884: ['The other half of the Double Cluster. Both clusters are only about 13 to 14 million years old, very young for stars.', 'النصف الآخر من العنقود المزدوج، وعمر العنقودين نحو 13 إلى 14 مليون سنة فقط، وهو عمر صغير جدًّا للنجوم.'],
  C014: ['Two star clusters side by side, each with hundreds of stars. On a dark night they show as a fuzzy patch without a telescope.', 'عنقودان نجميان متجاوران، في كل منهما مئات النجوم، ويظهران في الليالي المظلمة بقعةً ضبابية دون تلسكوب.'],
  NGC1499: ['Its long shape looks like the US state of California. It stretches about five full Moons across the sky, but it is very faint to the eye.', 'شكله الطويل يشبه ولاية كاليفورنيا الأمريكية، ويمتد في السماء بطول نحو خمسة أقمار بدر، لكنه باهت جدًّا للعين.'],
  NGC0224: ['The farthest thing most people can see without a telescope, about 2.5 million light years away. Al-Sufi described it as a "small cloud" in 964. It is coming towards us and should merge with the Milky Way in about 4.5 billion years.', 'أبعد ما يستطيع أغلب الناس رؤيته دون تلسكوب، على بعد نحو 2.5 مليون سنة ضوئية. وصفها الصوفي بأنها «لطخة سحابية» سنة 964. وهي تقترب منا، ويُتوقع أن تندمج مع درب التبانة بعد نحو 4.5 مليارات سنة.'],
  NGC7662: ['Named for its pale blue colour and round shape in small telescopes.', 'سُمّي بهذا لونه الأزرق الباهت وشكله المستدير في التلسكوبات الصغيرة.'],
  NGC0598: ['The third-largest galaxy in our Local Group, after Andromeda and the Milky Way. On very dark nights, sharp eyes can just see it without a telescope.', 'ثالث أكبر مجرة في مجموعتنا المحلية بعد المرأة المسلسلة ودرب التبانة، وفي الليالي شديدة الظلمة تستطيع العين الحادة رؤيتها بالكاد دون تلسكوب.'],
  Mel022: ["Most people see six or seven stars, but the cluster holds more than 1,000. The blue haze around them is a dust cloud they are passing through. In Japan it is called Subaru, and the car company's logo shows its stars.", 'يرى أغلب الناس ستة نجوم أو سبعة، لكن العنقود يضم أكثر من 1,000 نجم. والضباب الأزرق حولها سحابة غبار تمر بها. وتُسمّى في اليابان «سوبارو»، وتظهر نجومها في شعار شركة السيارات.'],
  C041: ['The nearest star cluster to the Sun, about 150 light years away. It makes the V-shaped face of the Bull, but bright Aldebaran is much closer to us and not part of it.', 'أقرب عنقود نجمي إلى الشمس، على بعد نحو 150 سنة ضوئية، ويصنع وجه الثور على شكل حرف V. أما الدبران اللامع فأقرب إلينا بكثير وليس جزءًا منه.'],
  NGC1952: ['What is left of a star whose explosion was seen in 1054 and recorded by Chinese astronomers; it was bright enough to see in daylight for weeks. At its heart, a neutron star spins about 30 times a second.', 'بقايا نجم شوهد انفجاره سنة 1054 وسجّله الفلكيون الصينيون، وكان ساطعًا حتى رُئي في النهار أسابيع. وفي قلبه نجم نيوتروني يدور نحو 30 مرة في الثانية.'],
  NGC2392: ['Its shells of gas look like a face inside the furry hood of a parka.', 'أغلفة الغاز فيه تشبه وجهًا داخل قلنسوة معطف من الفرو.'],
  NGC2632: ["Also called Praesepe, the manger. Ancient Greek sky-watchers used it to forecast the weather: if it could not be seen on a clear night, rain was coming. Galileo was the first to see that it is made of many stars.", 'يُسمّى أيضًا «المذود». واستعمله راصدو السماء الإغريق القدماء للتنبؤ بالطقس: إذا لم يُرَ في ليلة صافية فالمطر قادم. وكان غاليليو أول من رأى أنه مكوّن من نجوم كثيرة.'],
  NGC4594: ['A bright core with a dark lane of dust along its edge makes it look like a wide-brimmed sombrero hat. We see it almost exactly edge-on.', 'قلب لامع وحزام مظلم من الغبار على حافته يجعلانها تشبه قبعة السومبريرو العريضة، ونراها من الجانب تقريبًا.'],
  NGC4486: ['Home of the first black hole ever photographed, in 2019. That black hole is about 6.5 billion times heavier than the Sun.', 'موطن أول ثقب أسود صُوّر في التاريخ، سنة 2019، وكتلته نحو 6.5 مليارات ضعف كتلة الشمس.'],
  NGC6475: ['Ptolemy described it around the year 130 as a cloudy patch following the sting of the Scorpion, which is why it carries his name.', 'وصفه بطليموس نحو سنة 130 بأنه بقعة سحابية تتبع إبرة العقرب، ولذلك يحمل اسمه.'],
  NGC6405: ['Its stars make the shape of a butterfly with open wings.', 'نجومه تصنع شكل فراشة فاتحة جناحيها.'],
  IC4715: ['Not a real cluster but a window through the dust, where we look thousands of light years deep into a crowded arm of the Milky Way.', 'ليس عنقودًا حقيقيًّا، بل نافذة في الغبار نطل منها آلاف السنين الضوئية في عمق ذراع مزدحمة من درب التبانة.'],
  NGC6523: ['A giant cloud where new stars are being born, split by a dark lane that looks like a lagoon. From a dark site you can see it without a telescope.', 'سحابة عملاقة تولد فيها نجوم جديدة، يقسمها حزام مظلم يشبه البحيرة، ويمكن رؤيتها من موقع مظلم دون تلسكوب.'],
  NGC7293: ["One of the closest planetary nebulae to us. Its look has earned it the nickname 'the Eye of God'.", 'من أقرب السدم الكوكبية إلينا، وأكسبه شكله لقب «عين الإله».'],
  NGC7009: ['Thin streams of gas on both sides make it look like the planet Saturn with its rings seen edge-on.', 'تيّاران رفيعان من الغاز على جانبيه يجعلانه يشبه كوكب زحل وحلقاته مرئية من الجانب.'],
  NGC1976: ['The nearest big star nursery to Earth. Four bright young stars in its middle, called the Trapezium, light up the whole cloud.', 'أقرب حضانة نجوم كبيرة إلى الأرض، وأربعة نجوم شابة لامعة في وسطها تُسمّى «شبه المنحرف» تضيء السحابة كلها.'],
  B033: ["A dark cloud of dust shaped like a horse's head, seen against glowing red gas behind it.", 'سحابة مظلمة من الغبار على شكل رأس حصان، تظهر أمام غاز أحمر متوهج خلفها.'],
  NGC1982: ['A small part of the Orion Nebula, cut off from it by a lane of dark dust. Jean-Jacques de Mairan described it before 1731.', 'جزء صغير من سديم الجبار يفصله عنه حزام من الغبار المظلم، ووصفه جان جاك دو ميران قبل سنة 1731.'],
  NGC1980: ["A young star cluster at the tip of Orion's sword, just south of the Orion Nebula, around the bright star Hatysa.", 'عنقود نجمي شاب عند طرف سيف الجبار، جنوب سديم الجبار مباشرة، حول النجم اللامع «هاتيسا».'],
  NGC2360: ['Found in 1783 by Caroline Herschel, one of the first women to discover comets and star clusters.', 'اكتشفته كارولين هرشل سنة 1783، وهي من أوائل النساء اللواتي اكتشفن المذنبات والعناقيد النجمية.'],
  NGC3372: ['About four times bigger than the Orion Nebula and far brighter. It holds Eta Carinae, a star over 100 times heavier than the Sun that briefly became one of the brightest in the sky in 1843.', 'أكبر من سديم الجبار بنحو أربع مرات وأسطع منه بكثير، وفيه نجم «إيتا القاعدة» الذي تزيد كتلته على 100 ضعف كتلة الشمس، وصار سنة 1843 لفترة قصيرة من ألمع نجوم السماء.'],
  NGC3532: ['Through a telescope its stars sparkle like coins at the bottom of a wishing well. It was among the very first pictures taken by the Hubble Space Telescope, in May 1990.', 'تتلألأ نجومه في التلسكوب كالقطع النقدية في قاع بئر الأمنيات، وكان من أوائل الصور التي التقطها تلسكوب هابل الفضائي في مايو 1990.'],
  IC2602: ['It looks like a smaller Pleiades, with the bright star Theta Carinae at its centre. You can see it without a telescope from southern skies.', 'يبدو كثريّا أصغر، وفي وسطه النجم اللامع «ثيتا القاعدة»، ويمكن رؤيته دون تلسكوب من سماء الجنوب.'],
  IC2391: ['A bright young cluster around the star Omicron Velorum. Al-Sufi described it as a "nebulous star" around 964.', 'عنقود شاب لامع حول النجم «أوميكرون الشراع»، ووصفه الصوفي نحو سنة 964 بأنه «نجم سحابي».'],
  NGC5236: ['One of the closest and brightest barred spiral galaxies. Six supernovae have been seen in it in the last hundred years or so.', 'من أقرب المجرات الحلزونية ذات القضيب وألمعها، وقد شوهدت فيها ستة مستعرات عظمى خلال نحو مئة سنة.'],
  NGC3242: ['In a small telescope it looks about the same size as the planet Jupiter, which gave it its name.', 'يبدو في التلسكوب الصغير بحجم كوكب المشتري تقريبًا، ومن هنا جاء اسمه.'],
  NGC4038: ["Two galaxies in the middle of a crash. Long streams of stars thrown out by the collision look like an insect's antennae.", 'مجرتان في منتصف تصادم، وتيارات النجوم الطويلة التي قذفها التصادم تشبه قرني استشعار حشرة.'],
  NGC4755: ['John Herschel called it "a casket of variously coloured precious stones" because of its blue-white stars and one bright orange one.', 'وصفه جون هرشل بأنه «صندوق من الأحجار الكريمة المختلفة الألوان» لنجومه الزرقاء البيضاء ونجم برتقالي لامع بينها.'],
  C099: ['The darkest patch in the southern Milky Way: a cloud of dust about 600 light years away. Aboriginal Australians see it as the head of the Emu in the Sky.', 'أشد البقع ظلمة في درب التبانة الجنوبي، وهو سحابة غبار على بعد نحو 600 سنة ضوئية، ويراه السكان الأصليون في أستراليا رأس «طائر الإيمو في السماء».'],
  NGC4609: ['It seems to sit on the edge of the Coalsack, but it is far behind the dust cloud, thousands of light years away.', 'يبدو كأنه على حافة كيس الفحم، لكنه بعيد خلف سحابة الغبار بآلاف السنين الضوئية.'],
  NGC3766: ['Its stars glitter like a string of pearls, which gave it its name.', 'تتلألأ نجومه كعقد من اللؤلؤ، ومن هنا جاء اسمه.'],
  NGC5139: ['The biggest globular cluster around the Milky Way, with about 10 million stars. It may be the leftover core of a small galaxy our galaxy swallowed. Ptolemy listed it as a single star.', 'أكبر عنقود كروي حول درب التبانة، فيه نحو 10 ملايين نجم، وقد يكون بقية قلب مجرة صغيرة ابتلعتها مجرتنا. وقد عدّه بطليموس نجمًا واحدًا.'],
  NGC5128: ['A giant galaxy with a dark lane of dust across it and huge jets blasting out from the black hole at its centre. It is one of the strongest radio sources in the sky.', 'مجرة عملاقة يعبرها حزام مظلم من الغبار، وتنطلق نفثات هائلة من الثقب الأسود في مركزها، وهي من أقوى مصادر موجات الراديو في السماء.'],
  NGC3918: ['It shines a bright blue in a telescope, a little like the planet Uranus.', 'يلمع بلون أزرق ساطع في التلسكوب، فيشبه قليلًا كوكب أورانوس.'],
  NGC5194: ['The first galaxy in which spiral arms were seen, by Lord Rosse in 1845. A smaller galaxy is pulling on the end of one of its arms.', 'أول مجرة رُئيت فيها أذرع حلزونية، رآها اللورد روس سنة 1845، ومجرة أصغر تجذب طرف إحدى أذرعها.'],
  NGC5055: ['Its many short, patchy spiral arms look like the seeds in a sunflower.', 'أذرعها الحلزونية الكثيرة القصيرة المتقطعة تشبه البذور في زهرة دوّار الشمس.'],
  NGC4826: ['A dark band of dust in front of its bright centre looks like a black eye. Strangely, the gas near its centre spins the opposite way to the gas further out.', 'حزام مظلم من الغبار أمام مركزها اللامع يشبه عينًا متورّمة سوداء. والغريب أن الغاز قرب مركزها يدور في اتجاه معاكس للغاز الأبعد عنه.'],
  NGC4254: ['A spiral galaxy with one arm stretched longer than the others, pulled by the gravity of a passing galaxy.', 'مجرة حلزونية إحدى أذرعها أطول من الأخرى، شدّتها جاذبية مجرة مارّة.'],
  'ESO056-115': ['A small galaxy that circles the Milky Way. It is so bright and close that from the south you can see it without a telescope, like a detached piece of the Milky Way.', 'مجرة صغيرة تدور حول درب التبانة، وهي ساطعة وقريبة حتى يمكن رؤيتها من الجنوب دون تلسكوب، كأنها قطعة منفصلة من درب التبانة.'],
  NGC2070: ['The biggest and brightest star nursery in our neighbourhood of galaxies. If it were as close as the Orion Nebula, it would be bright enough to cast shadows on Earth.', 'أكبر حضانة نجوم وألمعها في جوارنا من المجرات، ولو كانت قريبة كسديم الجبار لكانت ساطعة حتى تُلقي ظلالًا على الأرض.'],
  NGC1316: ['A giant galaxy that grew by swallowing smaller galaxies. It is one of the brightest radio sources in the sky.', 'مجرة عملاقة كبرت بابتلاع مجرات أصغر، وهي من ألمع مصادر موجات الراديو في السماء.'],
  'ESO356-004': ['A small, faint galaxy that circles the Milky Way. It has six globular clusters of its own.', 'مجرة صغيرة باهتة تدور حول درب التبانة، ولها ستة عناقيد كروية خاصة بها.'],
  NGC2264: ['Its stars make the outline of a Christmas tree, and the dark Cone Nebula sits at its tip.', 'نجومه ترسم شكل شجرة عيد الميلاد، ويقع سديم المخروط المظلم عند قمتها.'],
  NGC2237: ['A huge round cloud shaped like a rose. Young stars at its centre have blown a hole in the middle with their light.', 'سحابة مستديرة ضخمة على شكل وردة، والنجوم الشابة في مركزها فتحت بضوئها فجوة في وسطها.'],
  NGC6087: ['Named after S Normae, a yellow supergiant in its middle that gets brighter and fainter every 9.75 days.', 'سُمّي باسم «إس الزاوية»، وهو عملاق أصفر في وسطه يزداد سطوعه ويخفت كل 9.75 أيام.'],
  NGC0253: ['Discovered by Caroline Herschel in 1783. It is also called the Silver Coin Galaxy and is busy making new stars at a high rate.', 'اكتشفتها كارولين هرشل سنة 1783، وتُسمّى أيضًا «مجرة القطعة الفضية»، وهي تصنع نجومًا جديدة بمعدل عالٍ.'],
  NGC6705: ['Called the Wild Duck Cluster because its brightest stars make a V like a flock of flying ducks. It holds more than 2,900 stars, one of the richest open clusters known.', 'يُسمّى عنقود البط البري لأن ألمع نجومه ترسم حرف V كسرب من البط الطائر، ويضم أكثر من 2,900 نجم، فهو من أغنى العناقيد المفتوحة المعروفة.'],
  NGC3115: ['Seen edge-on, it looks like a spindle. A black hole about a billion times heavier than the Sun sits at its centre.', 'تبدو من الجانب كمِغزل، وفي مركزها ثقب أسود كتلته نحو مليار ضعف كتلة الشمس.'],
  NGC0292: ['A small galaxy that circles the Milky Way and can be seen without a telescope from the south. The pull of the Large Magellanic Cloud and the Milky Way is slowly tearing it apart.', 'مجرة صغيرة تدور حول درب التبانة ويمكن رؤيتها من الجنوب دون تلسكوب، وجاذبية سحابة ماجلان الكبرى ودرب التبانة تمزّقها ببطء.'],
  NGC0104: ['The second-brightest globular cluster after Omega Centauri, with about a million stars packed into a ball some 120 light years wide.', 'ثاني ألمع عنقود كروي بعد أوميغا القنطور، فيه نحو مليون نجم متراصّة في كرة عرضها نحو 120 سنة ضوئية.'],
  Cl399: ["Ten stars that look like an upside-down coat hanger. Al-Sufi described it in his Book of Fixed Stars in 964. It is not a real cluster: the stars are at different distances and only line up by chance.", 'عشرة نجوم تشبه علّاقة ملابس مقلوبة، وصفها الصوفي في كتابه «صور الكواكب الثابتة» سنة 964. وهي ليست عنقودًا حقيقيًّا، فنجومها على أبعاد مختلفة وتصادف أنها اصطفّت.'],
  NGC6853: ['The first planetary nebula ever found, by Charles Messier in 1764. Its shape looks like a dumbbell or an apple core.', 'أول سديم كوكبي اكتُشف، اكتشفه شارل مسييه سنة 1764، وشكله يشبه الدمبل أو لبّ التفاحة.']
};

Object.assign(DSO_FACTS, {
  NGC6611: ["Home of the 'Pillars of Creation', towers of gas and dust where new stars are forming, made famous by the Hubble Space Telescope in 1995.", 'موطن «أعمدة الخلق»، وهي أبراج من الغاز والغبار تتكوّن فيها نجوم جديدة، واشتهرت بصورة تلسكوب هابل الفضائي سنة 1995.'],
  NGC6618: ['Also called the Swan Nebula: one of the brightest star-forming clouds in the sky, lit up by a cluster of young, hot stars inside it.', 'يُسمّى أيضًا سديم البجعة، وهو من ألمع سحب ولادة النجوم في السماء، يضيئه عنقود من النجوم الشابة الحارة داخله.'],
  NGC6514: ["Dark lanes of dust split its glowing red cloud into three parts, which gave it its name. A blue cloud of dust lit by starlight sits right next to it.", 'أحزمة مظلمة من الغبار تقسم سحابته الحمراء المتوهجة إلى ثلاثة أجزاء، ومن هنا جاء اسمه. وبجانبه مباشرة سحابة زرقاء من الغبار يضيئها ضوء النجوم.'],
  NGC6656: ['One of the first globular clusters ever discovered, in 1665, and one of the closest ones to Earth.', 'من أوائل العناقيد الكروية التي اكتُشفت، سنة 1665، ومن أقربها إلى الأرض.'],
  M040: ['Not a nebula at all: in 1764 Messier looked here for a reported nebula, found only two stars, and listed them anyway. The two stars are not even close to each other.', 'ليس سديمًا أصلًا: بحث مسييه هنا سنة 1764 عن سديم أُبلغ عنه، فلم يجد إلا نجمين، فأدرجهما في قائمته رغم ذلك. والنجمان ليسا متقاربين في الحقيقة.'],
  NGC6994: ['A small group of four stars that Messier listed in 1780. Studies suggest they are not a real cluster, just stars that happen to line up.', 'مجموعة صغيرة من أربعة نجوم أدرجها مسييه سنة 1780، وتشير الدراسات إلى أنها ليست عنقودًا حقيقيًّا، بل نجوم تصادف أنها اصطفّت.'],
  NGC0650: ["One of the faintest objects in Messier's list. It looks like a smaller version of the Dumbbell Nebula.", 'من أبهت الأجرام في قائمة مسييه، ويبدو نسخة أصغر من سديم الدمبل.'],
  NGC5866: ["A mystery entry: Messier's notes don't give a clear position for M102, and it is usually taken to be this galaxy, seen edge-on like a thin spindle.", 'مُدخل غامض: لا تعطي ملاحظات مسييه موقعًا واضحًا للجرم M102، ويُعدّ عادةً هذه المجرة، التي تبدو من الجانب كمِغزل رفيع.'],
  NGC3556: ['A spiral galaxy seen almost edge-on, which makes it look like a surfboard.', 'مجرة حلزونية نراها من الجانب تقريبًا، فتبدو كلوح ركوب الأمواج.']
});

function dsoMore(d, ar) {
  const f = DSO_FACTS[d.id], ti = DSO_TYPE_INFO[d.type]; let h = '';
  if (f) h += `<p class="dfact"><span aria-hidden="true">✦ </span>${esc(f[ar ? 1 : 0])}</p>`;
  if (ti) h += `<details class="dsod"><summary>${esc(ti[ar ? 2 : 0])}</summary><p>${esc(ti[ar ? 3 : 1])}</p>${KIDS ? `<p class="dkid">🧒 ${esc(ti[ar ? 5 : 4])}</p>` : ''}</details>`;
  return h;
}
// the deep-sky list on a constellation page: folded until tapped
function dsoFold(title, list, lang) {
  const ar = lang === 'ar', n = (list || []).length;
  if (!n) return `<span class="sci-sub">${title}</span>${dsoHTML(list || [], lang)}`;
  return `<details class="dsofold"><summary><span class="pd-ar" aria-hidden="true">▸</span><span class="df-t">${title} <span class="dn-n">· ${n}</span></span><span class="df-h" data-o="${ar ? 'اضغط لعرضها' : 'Tap to show'}" data-c="${ar ? 'اضغط لطيّها' : 'Tap to fold'}"></span></summary>${dsoHTML(list, lang)}</details>`;
}
function dsoHTML(list, lang) {
  const ar = lang === 'ar';
  if (!list.length) return `<p class="muted" style="max-width:68ch">${T[lang].noDso}</p>`;
  return `<ul class="dsos">${list.map(d => {
    const sc = dsoScope(d), ex = DSO_SEE[d.id] ? DSO_SEE[d.id][ar ? 2 : 1] : '';
    const see = sc ? `${ar ? 'لرؤيته' : 'To see it'}: ${sc[lang]}${ex ? (ar ? '، ' : ', ') + ex : ''}` : '';
    const bits = [DTYPE[lang][d.type] || d.type];
    if (d.dist) bits.push(`${ar ? 'على بعد' : ''} ${distTxt(d.dist, lang)}`.trim());
    if (see) bits.push(see);
    return `<li data-dso="${esc(d.id)}"><span class="cat">${esc(d.cat || '')}</span><div><div class="dn"><span class="dnm" dir="auto">${esc(d.name || d.cat)}</span><span class="hbtns">${AG.btn({t: 'dso', key: state.con, ref: d.id}, lang, true)}${swBtn(swDsoName(d), 6, lang)}</span></div><div class="dm">${esc(bits.join(' · '))}</div>${dsoMore(d, ar)}</div></li>`;
  }).join('')}</ul>`;
}
function partHTML(p, lang, many) {
  const t = T[lang], ar = lang === 'ar';
  let h = `<section class="sci-part">`;
  if (many) h += `<h3>${esc(ar ? p.ar : p.name)}</h3>`;
  h += `<p class="sci-intro">${ar ? `تغطي ${nf(p.area)} درجة مربعة من السماء، فهي في المرتبة ${p.rank} حجمًا بين الكوكبات الـ88${p.rank === 1 ? '، أي أكبرها' : p.rank === 88 ? '، أي أصغرها' : ''}.` : `Covers ${nf(p.area)} square degrees of sky, making it number ${p.rank} in size of the 88 constellations${p.rank === 1 ? ': the largest of all' : p.rank === 88 ? ': the smallest of all' : ''}.`}</p>`;
  h += `<div class="vis"><span class="sect-lbl">${t.see}</span><p>${esc(visTxt(p.vis, lang))}</p></div>`;
  h += moonHTML(p.vis, lang, ['Ari','Tau','Gem','Cnc','Leo','Vir','Lib','Sco','Oph','Sgr','Cap','Aqr','Psc'].includes(p.abbr));
  { const all = p.stars.concat(p.extraHosts);
    h += `<details class="dsofold starfold"><summary><span class="pd-ar" aria-hidden="true">▸</span><span class="df-t">${t.stars} <span class="dn-n">· ${all.length}</span></span><span class="df-h" data-o="${ar ? 'اضغط لعرضها' : 'Tap to show'}" data-c="${ar ? 'اضغط لطيّها' : 'Tap to fold'}"></span></summary><div class="sf-in"><div class="muted sf-intro">${ar ? 'الأدوات المذكورة هي أصغر ما يكفي من موقع مظلم بعيد عن أضواء المدن، أما داخل المدينة فتحتاج أداة أكبر.' : 'The instrument shown is the smallest that will do from a dark site away from city lights; inside a city you need something bigger.'} <details class="sf-more"><summary>${ar ? 'كيف تُحسب أوقات الرحلات؟' : 'How are the trip times worked out?'}</summary>${ar ? 'لكل نجم: كم يستغرق الوصول إليه بسرعة الضوء؛ وعلى متن مسبار «باركر الشمسي» (نحو 690 ألف كم في الساعة، أسرع مركبة صنعها الإنسان)؛ وعلى متن «فوياجر 1» (17 كم في الثانية، أسرع مسبار يغادر المجموعة الشمسية الآن)؛ وبطائرة ركاب (900 كم/س)؛ وبسيارة تسير 100 كم في الساعة بلا توقف؛ ومشيًا بسرعة 5 كم/س دون راحة.' : 'For each star: how long a trip there would take at the speed of light; on the Parker Solar Probe (about 690,000 km/h, the fastest spacecraft ever built); on Voyager 1 (17 km a second, the fastest probe now leaving the Solar System); by passenger jet (900 km/h); by car non-stop at 100 km/h; and walking at 5 km/h without a break.'}</details></div><div class="stars">${all.map(s => starCard(s, lang)).join('')}</div></div></details>`; }
  const n = p.nearest;
  if (n && !n.inList) {
    h += `<span class="sci-sub">${t.nearest}</span><p style="max-width:70ch;margin:0">${ar
      ? `أقرب نجم معروف في هذه الكوكبة هو <b><bdi>${esc(n.name)}</bdi></b>، ${esc(typeTxt(n, 'ar'))}، على بعد ${distTxt(n.dist, 'ar')}${n.mag > 6 ? `، ولرؤيته تحتاج: ${scopeFor(n.mag).ar}` : ''}. يصل ضوؤه إلينا في ${bigYears(n.dist, 'ar')}، وتحتاج فوياجر 1 إلى ${bigYears(n.dist * 17635, 'ar')} لتبلغه.`
      : `The nearest known star in this constellation is <b>${esc(n.name)}</b>, a ${esc(typeTxt(n, 'en'))} ${distTxt(n.dist, 'en')} away${n.mag > 6 ? `; to see it you need: ${scopeFor(n.mag).en.replace(/^./, c => c.toLowerCase())}` : ''}. Its light takes ${bigYears(n.dist, 'en')} to reach us; Voyager 1 would need ${bigYears(n.dist * 17635, 'en')} to get there.`}</p>`;
  }
  const P = p.planets;
  h += `<span class="sci-sub">${t.planets}</span><p style="max-width:70ch;margin:0">`;
  if (!P.count) h += ar ? 'لم يُؤكَّد حتى الآن اكتشاف كواكب حول نجوم هذه الكوكبة.' : 'No planets have been confirmed around stars in this constellation yet.';
  else {
    h += ar ? `أكّد العلماء وجود ${nf(P.count)} ${P.count === 1 ? 'كوكب' : 'كوكبًا'} حول ${nf(P.systems)} ${P.systems === 1 ? 'نجم' : 'نجمًا'} في هذه الكوكبة.` : `Astronomers have confirmed ${nf(P.count)} planet${P.count === 1 ? '' : 's'} around ${nf(P.systems)} star${P.systems === 1 ? '' : 's'} in this constellation.`;
    if (P.nearest) h += ar ? ` أقربها حول <b><bdi>${esc(P.nearest.name)}</bdi></b> على بعد ${distTxt(P.nearest.dist, 'ar')}.` : ` The closest is around <b>${esc(P.nearest.name)}</b>, ${distTxt(P.nearest.dist, 'en')} away.`;
    if (P.richest) h += ar ? ` وأكثرها كواكب نظام <b><bdi>${esc(P.richest.name)}</bdi></b> وفيه ${P.richest.n} كواكب.` : ` The busiest system is <b>${esc(P.richest.name)}</b>, with ${P.richest.n} planets.`;
    if (P.count > 400) h += ar ? ' العدد الكبير سببه أن تلسكوب كبلر الفضائي ظل يحدّق في هذه الرقعة من السماء أربع سنوات (2009–2013).' : ' The huge number is because NASA\'s Kepler space telescope stared at this patch of sky for four years (2009–2013).';
  }
  h += `</p>`;
  if (p.note) h += `<p class="vis" style="margin-top:10px">${esc(ar ? p.noteAr : p.note)}</p>`;
  h += dsoFold(t.dso, p.dsos, lang);
  return h + `</section>`;
}
const SYN = 29.530588853, NM0 = Date.UTC(2000, 0, 6, 18, 14);
function newMoonNear(t) { const k = Math.round((t - NM0) / (SYN * 864e5)); return new Date(NM0 + k * SYN * 864e5); }
function fmtDate(d, lang) { return d.toLocaleDateString(lang === 'ar' ? 'ar-u-nu-latn' : 'en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}); }
function moonHTML(v, lang, zodiac) {
  const ar = lang === 'ar', now = new Date();
  let y = now.getUTCFullYear(), target = Date.UTC(y, v.month, 15);
  if (target < now.getTime() - 20 * 864e5) target = Date.UTC(y + 1, v.month, 15);
  let nm = newMoonNear(target); if (nm.getTime() < now.getTime() - 4 * 864e5) nm = new Date(nm.getTime() + SYN * 864e5);
  const a = new Date(nm.getTime() - 7.4 * 864e5), b = new Date(nm.getTime() + 4 * 864e5), fm = new Date(nm.getTime() + (Math.abs(nm.getTime() + SYN / 2 * 864e5 - target) < Math.abs(nm.getTime() - SYN / 2 * 864e5 - target) && nm.getTime() - SYN / 2 * 864e5 < Date.now() ? 1 : (Math.abs(nm.getTime() + SYN / 2 * 864e5 - target) < Math.abs(nm.getTime() - SYN / 2 * 864e5 - target) ? 1 : -1)) * SYN / 2 * 864e5);
  const txt = ar
    ? `لرؤية الكوكبة كاملة بنجومها الخافتة اختر ليلة لا يكون فيها القمر في سماء المساء: من التربيع الأخير، مرورًا بالمحاق، إلى نحو 4 أيام بعد الهلال الجديد. أما قرب البدر فلا يظهر منها إلا ألمع نجومها. أقرب فترة مظلمة وهي في أحسن موضع: من ${fmtDate(a, 'ar')} إلى ${fmtDate(b, 'ar')} (المحاق نحو ${fmtDate(nm, 'ar')}). تجنّب أيام البدر نحو ${fmtDate(fm, 'ar')}.${zodiac ? ' والقمر يمرّ بهذه الكوكبة كل شهر، فقد يكون بين نجومها نفسها.' : ''}`
    : `To see the whole constellation, faint stars included, pick a night with no Moon in the evening sky: from last quarter, through new moon, to about 4 days after. Near full moon only its brightest stars show. Next dark window while it is well placed: ${fmtDate(a, 'en')} to ${fmtDate(b, 'en')} (new moon around ${fmtDate(nm, 'en')}). Avoid the days around the full moon of ${fmtDate(fm, 'en')}.${zodiac ? ' The Moon also passes through this constellation every month, so it can sit right among its stars.' : ''}`;
  return `<div class="vis"><span class="sect-lbl">${ar ? 'القمر' : 'Moon guide'}</span><p>${esc(txt)}</p></div>`;
}
function factTable(rows, ar) { return `<dl class="ftable">${rows.map(r => `<dt>${esc(ar ? r[1] : r[0])}</dt><dd>${esc(ar ? r[3] : r[2])}</dd>`).join('')}</dl>`; }
function planetHTML(b, lang, inFold) {
  const ar = lang === 'ar';
    const rows = [];
    if (b.au) rows.push([ar ? 'البعد عن الشمس' : 'From the Sun', `${nf(b.au, 2)} ${ar ? 'وحدة فلكية' : 'AU'} · ${nf(b.au * 149.6, 0)} ${ar ? 'مليون كم' : 'million km'}`]);
    rows.push([ar ? 'القطر' : 'Diameter', `${nf(b.d)} ${ar ? 'كم' : 'km'}${b.id !== 'earth' ? (ar ? ` (${nf(b.d / 12756, b.d / 12756 < 10 ? 2 : 0)} من قطر الأرض)` : ` (${nf(b.d / 12756, b.d / 12756 < 10 ? 2 : 0)} × Earth)`) : ''}`]);
    rows.push([ar ? 'اليوم' : 'Day', ar ? b.day_ar : b.day_en]);
    rows.push([ar ? 'السنة' : 'Year', b.year ? (b.year > 800 ? (ar ? `${nf(b.year / 365.25, 1)} سنة أرضية` : `${nf(b.year / 365.25, 1)} Earth years`) : (ar ? `${nf(b.year, 1)} يومًا` : `${nf(b.year, 1)} days`)) : (ar ? b.year_ar : b.year_en)]);
    if (b.moons != null) rows.push([ar ? 'الأقمار' : 'Moons', b.moons_plus ? (ar ? `${b.moons} على الأقل، وما زال الاكتشاف مستمرًا` : `at least ${b.moons}, and more are still being found`) : String(b.moons)]);
    rows.push([ar ? 'الحرارة' : 'Temperature', ar ? b.temp_ar : b.temp_en]);
    rows.push([ar ? 'الجاذبية' : 'Gravity', b.id === 'earth' ? (ar ? 'المرجع (1)' : '1 (for comparison)') : b.id === 'sun' ? (ar ? `${nf(b.g, 1)} ضعف جاذبية الأرض عند السطح` : `${nf(b.g, 1)} × Earth at the surface`) : (ar ? `${nf(b.g, 2)} من جاذبية الأرض: من وزنه 50 كغ على الأرض يزن هنا ${nf(50 * b.g, 0)} كغ` : `${nf(b.g, 2)} × Earth: someone who weighs 50 kg here would weigh ${nf(50 * b.g, 0)} kg`)]);
    rows.push([ar ? 'لرؤيته' : 'To see it', ar ? b.see_ar : b.see_en]);
    if (b.au) rows.push([ar ? 'رحلة من الشمس' : 'Trip from the Sun', ar ? `الضوء: ${b.au * 8.317 < 60 ? nf(b.au * 8.317, 1) + ' دقيقة' : nf(b.au * 8.317 / 60, 1) + ' ساعة'} · سيارة بسرعة 100 كم/س: ${bigYears(b.au * 149.6e6 / 100 / 8766, 'ar')}` : `light: ${b.au * 8.317 < 60 ? nf(b.au * 8.317, 1) + ' minutes' : nf(b.au * 8.317 / 60, 1) + ' hours'} · a car at 100 km/h: ${bigYears(b.au * 149.6e6 / 100 / 8766, 'en')}`]);
    let h = `<section class="planet${inFold ? ' infold' : ''}" data-planet="${b.id}" style="--pc:${b.color}">${inFold ? '' : `<h3>${inFold ? '' : `<span class="pd" aria-hidden="true"></span>${esc(ar ? b.ar : b.en)}${ar ? '' : ` <span class="arn2" lang="ar">${esc(b.ar)}</span>`}`}${AG.btn({t: 'planet', key: 'SOL', ref: b.id}, lang, true)}${b.id === 'earth' ? '' : swBtn(b.id[0].toUpperCase() + b.id.slice(1), b.id === 'sun' ? 8 : 4, lang)}</h3>`}`;
    h += `<dl class="ftable">${rows.map(r => `<dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl>`;
    if (KIDS) h += `<div class="kidbox"><span class="sect-lbl">${ar ? '🧒 للأطفال' : '🧒 For kids'}</span>${b.kid_en ? `<p style="margin:0 0 6px">${esc(ar ? b.kid_ar : b.kid_en)}</p>` : ''}<p style="margin:0">${esc(kidPlanet(b, lang))}</p></div>`;
    h += `<ul class="facts">${(ar ? b.facts_ar : b.facts_en).map(f => `<li>${esc(f)}</li>`).join('')}</ul>${moonsHTML(b.id, lang)}</section>`;
    return h;
}
function solarHTML(bodies, lang) {
  const ar = lang === 'ar';
  let h = `<p class="sci-intro">${ar ? 'الشمس وثمانية كواكب وكوكب قزم. الرسم أدناه يُظهر أحجام الكواكب بمقياس واحد، والشمس عند الحافة أكبر من أن تتسع.' : 'The Sun, the eight planets and one dwarf planet. The strip below shows the planets\' sizes to the same scale; the Sun, at the edge, is far too big to fit.'}</p>`;
  const pl = bodies.filter(b => b.id !== 'sun');
  const k = 120 / 142984, W = 820, H = 210, cy = 90;
  let x = 44, svg = `<svg class="sizes" viewBox="0 0 ${W} ${H}" role="img" aria-label="${ar ? 'أحجام الكواكب' : 'Planet sizes to scale'}" dir="ltr"><circle cx="${-1392700 * k / 2 + 30}" cy="${cy}" r="${1392700 * k / 2}" fill="#f6c453"/>`;
  pl.forEach((b, i) => { const r = Math.max(1.5, b.d * k / 2), w = Math.max(2 * r + 16, 62); x += w / 2; svg += `<circle cx="${x.toFixed(1)}" cy="${cy}" r="${r.toFixed(1)}" fill="${b.color}"/>`; svg += `<text x="${x.toFixed(1)}" y="${r > 8 ? cy + r + 20 : (i % 2 ? cy + 46 : cy + 26)}" text-anchor="middle">${esc(ar ? b.ar.split(' (')[0] : b.en.split(' (')[0])}</text>`; x += w / 2; });
  svg += `</svg>`;
  h += svg;
  const SW = 820, SH = 250, sr = 110, er = sr * 12756 / 1392700, jr = sr * 142984 / 1392700;
  h += `<svg class="sizes" viewBox="0 0 ${SW} ${SH}" role="img" aria-label="${ar ? 'الشمس كاملة مع الأرض والمشتري بالمقياس نفسه' : 'The whole Sun with Earth and Jupiter to the same scale'}" dir="ltr"><circle cx="150" cy="125" r="${sr}" fill="#f6c453"/><text x="150" y="${125 + sr + 2}" dy="12" text-anchor="middle">${ar ? 'الشمس' : 'Sun'}</text>
    <circle cx="420" cy="125" r="${jr.toFixed(1)}" fill="#d6a777"/><text x="420" y="${(125 + jr + 18).toFixed(1)}" text-anchor="middle">${ar ? 'المشتري' : 'Jupiter'}</text>
    <circle cx="540" cy="125" r="${Math.max(er, 1).toFixed(2)}" fill="#4f8fd6"/><text x="540" y="146" text-anchor="middle">${ar ? 'الأرض' : 'Earth'}</text>
    <text x="565" y="110" class="st2">${ar ? 'قطر الشمس = 109 أضعاف قطر الأرض' : 'Sun = 109 × Earth\'s width'}</text><text x="565" y="132" class="st2">${ar ? 'يتسع جوفها لنحو 1.3 مليون أرض' : 'about 1.3 million Earths fit inside'}</text><text x="565" y="154" class="st2">${ar ? 'وقطرها = 10 أضعاف المشتري' : 'and 10 × Jupiter\'s width'}</text></svg>`;
  h += `<p class="vref" style="white-space:normal;margin:0 0 10px">${ar ? 'الرسمان بمقياسين مختلفين: الأول يكبّر الكواكب، والثاني يُظهر الشمس كاملة. لو كانت الأرض بحجم حبة بازلاء، لكانت الشمس كرة قطرها نحو متر.' : 'The two drawings use different scales: the first enlarges the planets, the second shows the whole Sun. If Earth were the size of a pea, the Sun would be a ball about a metre across.'}</p>`;
  bodies.forEach(b => { h += `<details class="dsofold plfold" style="--pc:${b.color}"><summary><span class="pd-ar" aria-hidden="true">▸</span><span class="df-t"><span class="pd" aria-hidden="true"></span>${esc(ar ? b.ar : b.en)}${ar ? '' : ` <span class="arn2" lang="ar">${esc(b.ar)}</span>`}</span><span class="hbtns">${AG.btn({t: 'planet', key: 'SOL', ref: b.id}, lang, true)}${b.id === 'earth' ? '' : swBtn(b.id[0].toUpperCase() + b.id.slice(1), b.id === 'sun' ? 8 : 4, lang)}</span><span class="df-h" data-o="${ar ? 'اضغط لعرضه' : 'Tap to show'}" data-c="${ar ? 'اضغط لطيّه' : 'Tap to fold'}"></span></summary><div class="plimg" data-pid="${b.id}" data-wiki="${PL_WIKI[b.id] || ''}"><span class="dph">${ar ? 'جارٍ تحميل الصورة…' : 'Loading picture…'}</span></div>${planetHTML(b, lang, true)}</details>`; });
  h += `<p class="vref" style="white-space:normal;margin-top:14px">${linkText(ar ? 'المصادر: صحائف بيانات الكواكب من ناسا؛ أعداد الأقمار من مركز الكواكب الصغيرة التابع للاتحاد الفلكي الدولي (مارس 2026).' : 'Sources: NASA planetary fact sheets; moon counts from the IAU Minor Planet Center (March 2026).')}</p>`;
  return h;
}
/* ---------- the Deep-sky objects section: every object, grouped by kind, with a picture ---------- */
function allDsos() {
  const out = [];
  Object.keys(DATA.sci).forEach(k => (DATA.sci[k].parts || []).forEach(p => (p.dsos || []).forEach(d => { if (!out.some(x => x.d.id === d.id)) out.push({d, key: k}); })));
  return out;
}
const DSO_SKY2 = id => { const p = DSO_POS[id]; if (!p) return ''; const am = Math.max(8, Math.min(60, Math.round(p[2] * 60))); return `https://archive.stsci.edu/cgi-bin/dss_search?v=poss2ukstu_red&r=${p[0]}&d=${p[1]}&e=J2000&h=${Math.round(am * 0.75)}&w=${am}&f=gif&c=none&fov=NONE&v3=`; };
const DSO_SKY = id => { const p = DSO_POS[id]; return p ? `https://alasky.cds.unistra.fr/hips-image-services/hips2fits?hips=CDS%2FP%2FDSS2%2Fcolor&width=480&height=360&fov=${p[2]}&projection=TAN&coordsys=icrs&ra=${p[0]}&dec=${p[1]}&format=jpg` : ''; };
// "Back to the deep-sky object": tapping a constellation on a deep-sky card remembers the card,
// and the constellation page offers a button that returns straight to it (the phone's back button does the same)
const RET = (() => {
  const K = 'osms-ret';
  const get = () => { try { return JSON.parse(sessionStorage.getItem(K) || 'null'); } catch (e) { return null; } };
  const put = v => { try { v ? sessionStorage.setItem(K, JSON.stringify(v)) : sessionStorage.removeItem(K); } catch (e) {} };
  let pill = null;
  const hide = () => { if (pill) { pill.remove(); pill = null; } };
  function restore(r) {
    const go = (n) => { const a = document.querySelector(`#card .dcard[data-dso="${CSS.escape(r.id)}"]`);
      if (!a) { if (n < 20) setTimeout(() => go(n + 1), 50); return; }
      let d = a.closest('details'); while (d) { d.open = true; d = d.parentElement && d.parentElement.closest('details'); }
      requestAnimationFrame(() => { a.scrollIntoView({block: 'center', behavior: 'instant'}); a.classList.remove('flash'); void a.offsetWidth; a.classList.add('flash'); });
    };
    go(0);
  }
  function sync() {
    const r = get(); if (!r) { hide(); return; }
    const h = location.hash;
    if (h === r.from) { put(null); hide(); restore(r); return; }       // came back (button or the phone's back)
    if (h.split('-')[0] !== r.to.split('-')[0]) { put(null); hide(); return; }   // went somewhere else
    if (pill) { pill.dir = state.lang === 'ar' ? 'rtl' : 'ltr'; pill.querySelector('b').textContent = state.lang === 'ar' ? '→' : '←'; pill.querySelector('span').textContent = label(r); return; }
    pill = document.createElement('button'); pill.type = 'button'; pill.className = 'retpill'; pill.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    pill.innerHTML = `<b aria-hidden="true"></b><span></span>`; pill.querySelector('span').textContent = label(r);
    pill.querySelector('b').textContent = state.lang === 'ar' ? '→' : '←';
    pill.addEventListener('click', () => { location.hash = r.from; });
    document.body.appendChild(pill);
    if (h === r.to && !r.arrived) { r.arrived = true; put(r); const c = document.getElementById('card'); if (c) window.scrollTo({top: Math.max(0, c.getBoundingClientRect().top + scrollY - 10), behavior: 'instant'}); }
  }
  const label = r => state.lang === 'ar' ? `العودة إلى ${r.name}` : `Back to ${r.name}`;
  document.addEventListener('click', ev => { const a = ev.target.closest && ev.target.closest('.dcard .dm a[href^="#"]'); if (!a) return;
    const c = a.closest('.dcard'), n = c.querySelector('.dnm bdi'); put({id: c.dataset.dso, name: n ? n.textContent : c.dataset.dso, from: location.hash, to: a.getAttribute('href'), pushed: true}); });
  return {sync};
})();
function dsoCardHTML(o, lang) {
  const d = o.d, ar = lang === 'ar', sc = dsoScope(d), ex = DSO_SEE[d.id] ? DSO_SEE[d.id][ar ? 2 : 1] : '';
  const bits = [esc(DTYPE[lang][d.type] || d.type), `${ar ? 'في' : 'in'} <a href="#${o.key}-science">${esc(ar ? byKey[o.key].ar : byKey[o.key].latin)}</a>`];
  if (d.dist) bits.push(esc(distTxt(d.dist, lang)));
  if (sc) bits.push(esc(`${ar ? 'لرؤيته' : 'To see it'}: ${sc[lang]}${ex ? (ar ? '، ' : ', ') + ex : ''}`));
  const p = DSO_POS[d.id], f = DSO_FACTS[d.id], nm = d.name || d.cat;
  const alias = DSO_ALIAS[d.id] || [];
  const codes = [d.id, d.cat, ...alias].map(x => String(x || '').toLowerCase().replace(/\s+/g, '').replace(/^caldwell/, 'c').replace(/^([a-z]+)0+(\d)/, '$1$2'));
  const q = [d.id, d.cat, ...alias, ...codes, d.name, byKey[o.key].latin, byKey[o.key].ar, DTYPE.en[d.type], DTYPE.ar[d.type], d.type].filter(Boolean).join(' ');
  return `<article class="dcard" data-dso="${esc(d.id)}" data-q="${esc(DSOS.norm(q))}"><div class="dimg"${p ? ` data-sky="${esc(DSO_SKY(d.id))}" data-sky2="${esc(DSO_SKY2(d.id))}" data-wiki="${esc(p[3] || '')}"` : ''}><span class="dph">${ar ? 'جارٍ تحميل الصورة…' : 'Loading picture…'}</span></div>`
    + `<div class="dbody"><h4><span class="dnm"><bdi dir="ltr">${esc(nm)}</bdi>${d.name && d.cat ? ` <span class="dcat">${esc(d.cat)}</span>` : ''}</span><span class="hbtns">${AG.btn({t: 'dso', key: o.key, ref: d.id}, lang, true)}${swBtn(swDsoName(d), 6, lang)}</span></h4>`
    + `<p class="dm">${bits.join(' · ')}</p>${f ? `<p class="dfact"><span aria-hidden="true">✦ </span>${esc(f[ar ? 1 : 0])}</p>` : ''}${(() => { const ti = DSO_TYPE_INFO[d.type]; return ti ? `<details class="dsod"><summary>${esc(ti[ar ? 2 : 0])}</summary><p>${esc(ti[ar ? 3 : 1])}</p>${KIDS ? `<p class="dkid">🧒 ${esc(ti[ar ? 5 : 4])}</p>` : ''}</details>` : ''; })()}</div></article>`;
}
const DSO_CATS = [
  ['m', 'Messier catalogue', 'فهرس مسييه', "Charles Messier's famous list from the 1700s", 'قائمة شارل مسييه الشهيرة من القرن الثامن عشر'],
  ['c', 'Caldwell catalogue', 'فهرس كالدويل', "Patrick Moore's list for amateur astronomers, 1995", 'قائمة باتريك مور لهواة الفلك، 1995'],
  ['ngc', 'NGC catalogue', 'فهرس NGC', 'The New General Catalogue by J. L. E. Dreyer, 1888', 'الفهرس العام الجديد لدرير، 1888'],
  ['ic', 'IC catalogue', 'فهرس IC', "Dreyer's Index Catalogues, 1895 and 1908", 'فهارس درير الإضافية، 1895 و1908'],
  ['o', 'Other catalogues', 'فهارس أخرى', 'Melotte, Collinder, Barnard and ESO lists', 'قوائم ميلوت وكولندر وبارنارد والمرصد الأوروبي الجنوبي']];
function dsoCatOf(d) { if (/^M\d+$/.test(d.cat || '')) return 'm'; if (/^Caldwell/.test(d.cat || '')) return 'c'; if (/^NGC/.test(d.id)) return 'ngc'; if (/^IC/.test(d.id)) return 'ic'; return 'o'; }
function dsoNum(d) { const m = /(\d+)/.exec(/^M\d+$/.test(d.cat || '') || /^Caldwell/.test(d.cat || '') ? d.cat : d.id); return m ? +m[1] : 1e9; }
// "Why stars shine": the questions people ask most when they look up, with this site's own star data in the examples
function shineHTML(lang) {
  const ar = lang === 'ar';
  const star = n => { for (const k in DATA.sci) for (const p of (DATA.sci[k].parts || [])) for (const x of p.stars.concat(p.extraHosts || [])) if (x.name === n) return x; return null; };
  const fmt = (v, d = 0) => Number(v).toLocaleString('en-US', {maximumFractionDigits: d, minimumFractionDigits: d});
  const sname = n => ar && DATA.starAr[n] ? `${DATA.starAr[n]} <span class="muted" dir="ltr">(${n})</span>` : n;
  const box = (t, body, open) => `<details class="dsofold shfold"${open ? ' open' : ''}><summary><span class="pd-ar" aria-hidden="true">▸</span><span class="df-t">${t}</span><span class="df-h" data-o="${ar ? 'اضغط لعرضه' : 'Tap to show'}" data-c="${ar ? 'اضغط لطيّه' : 'Tap to fold'}"></span></summary><div class="sh-in">${body}</div></details>`;
  let h = `<p class="dsec-in">${ar ? 'كل نجم تراه في السماء شمسٌ مثل شمسنا أو أكبر منها بكثير، لكنه بعيد جدًّا. هذه إجابات أكثر الأسئلة التي يسألها الناس حين ينظرون إلى السماء ليلًا.' : 'Every star you see is a sun like ours, or far bigger, only very far away. Here are the answers to the questions people ask most when they look up at night.'}</p>`;
  // 1. why they shine
  h += box(ar ? 'لماذا تضيء النجوم؟' : 'Why do stars shine?', ar
    ? `<p>النجم كرة ضخمة من الغاز الحار، معظمها هيدروجين. يضغط وزنُه مركزَه حتى يصبح حارًّا وكثيفًا بما يكفي <b>للاندماج النووي</b>: تتحد أنوية الهيدروجين لتكوّن الهيليوم، ويتحول جزء صغير جدًّا من الكتلة إلى طاقة هائلة (معادلة أينشتاين E = mc²).</p><ul class="facts"><li>تبلغ الحرارة في قلب الشمس نحو 15 مليون درجة مئوية.</li><li>في كل ثانية تحوّل الشمس نحو 600 مليون طن من الهيدروجين إلى هيليوم، ويصير نحو 4 ملايين طن من هذه الكتلة ضوءًا وحرارة.</li><li>تحتاج هذه الطاقة إلى آلاف كثيرة من السنين لتشق طريقها من قلب الشمس إلى سطحها، ثم 8 دقائق و20 ثانية فقط لتعبر الفضاء إلينا.</li><li>كلما كان النجم أثقل كان قلبه أحرّ، فأضاء أكثر بكثير، لكنه يستهلك وقوده أسرع ويعيش عمرًا أقصر.</li></ul>`
    : `<p>A star is a huge ball of hot gas, mostly hydrogen. Its own weight squeezes its centre until it is hot and dense enough for <b>nuclear fusion</b>: hydrogen nuclei join to make helium, and a tiny bit of mass turns into a great deal of energy (Einstein's E = mc²).</p><ul class="facts"><li>The Sun's core is about 15 million °C.</li><li>Every second the Sun turns about 600 million tonnes of hydrogen into helium, and about 4 million tonnes of that mass becomes light and heat.</li><li>That energy takes many thousands of years to work its way from the core to the surface, then just 8 minutes and 20 seconds to cross space to us.</li><li>The heavier a star, the hotter its core, so it shines far more brightly, but it uses up its fuel faster and lives a shorter life.</li></ul>`);
  // 2. why some look brighter: the site's own data
  const rows = ['Sirius', 'Rigil Kentaurus', 'Rigel', 'Deneb'].map(star).filter(Boolean);
  const si = star('Sirius'), ri = star('Rigel');
  const tab = `<div class="sh-scroll"><table class="agt shtab"><thead><tr><th>${ar ? 'النجم' : 'Star'}</th><th>${ar ? 'ضوؤه الحقيقي<br><small>الشمس = 1</small>' : 'Real light<br><small>Sun = 1</small>'}</th><th>${ar ? 'بعده<br><small>سنة ضوئية</small>' : 'Distance<br><small>light years</small>'}</th><th>${ar ? 'يبدو لنا<br><small>القدر</small>' : 'Looks<br><small>magnitude</small>'}</th></tr></thead><tbody>${rows.map(x => `<tr><th>${ar && DATA.starAr[x.name] ? DATA.starAr[x.name] : x.name}</th><td>${fmt(x.lum, x.lum < 10 ? 1 : 0)}</td><td>${fmt(x.dist, x.dist < 10 ? 1 : 0)}</td><td dir="ltr">${(x.mag < 0 ? '−' : '') + Math.abs(x.mag).toFixed(2)}</td></tr>`).join('')}</tbody></table></div>`;
  const ratioL = si && ri ? Math.round(ri.lum / si.lum / 100) * 100 : 2300, ratioD = si && ri ? Math.round(ri.dist / si.dist) : 100;
  h += box(ar ? 'لماذا تبدو بعض النجوم أسطع من غيرها؟' : 'Why do some stars look brighter than others?', (ar
    ? `<p>أمران يحددان سطوع النجم في أعيننا: <b>كم يعطي من الضوء حقًّا</b>، و<b>كم يبعد عنا</b>. ينتشر الضوء كلما ابتعد، فالنجم الذي يبعد ضعف المسافة يبدو أخفت بأربع مرات، والذي يبعد عشرة أضعافها يبدو أخفت بمئة مرة.</p><p>قارن الشعرى اليمانية برجل الجبار: يعطي رجل الجبار ضوءًا أكثر من الشعرى بنحو ${fmt(ratioL)} مرة، لكنه أبعد منها بنحو ${fmt(ratioD)} مرة، فيصلنا ضوؤه أضعف بنحو ${fmt(ratioD * ratioD)} مرة. ولهذا كانت الشعرى ألمع نجم في سماء الليل مع أن رجل الجبار أقوى منها بكثير.</p>`
    : `<p>Two things decide how bright a star looks: <b>how much light it really gives out</b>, and <b>how far away it is</b>. Light spreads out as it travels, so a star twice as far away looks four times fainter, and one ten times as far looks a hundred times fainter.</p><p>Compare Sirius and Rigel: Rigel gives out about ${fmt(ratioL)} times more light than Sirius, but it is about ${fmt(ratioD)} times farther away, so its light reaches us about ${fmt(ratioD * ratioD)} times weaker. That is why Sirius is the brightest star in the night sky, even though Rigel is by far the more powerful star.</p>`)
    + tab + (ar
    ? `<p class="sh-note">يقيس الفلكيون السطوع المرئي بالقدر: كلما صغر الرقم كان النجم أسطع، وكل درجة واحدة تعني نحو 2.5 مرة، وكل خمس درجات تعني 100 مرة بالضبط. ترى العين من مكان مظلم نجومًا حتى القدر 6، وفي المدينة غالبًا حتى القدر 3 أو 4 فقط.</p>`
    : `<p class="sh-note">Astronomers measure how bright a star looks in magnitudes: the smaller the number, the brighter the star. One step is about 2.5 times, and five steps are exactly 100 times. From a dark site your eyes reach magnitude 6; in a city often only 3 or 4.</p>`));
  // 3. colours: temperatures from the site's data
  const sunT = 5778, cols = [['Betelgeuse', '#ff8f5e'], ['Arcturus', '#ffb36b'], ['Sun', '#ffe7b8'], ['Sirius', '#f2f5ff'], ['Rigel', '#d4e0ff'], ['Spica', '#aac4ff']];
  const strip = cols.map(([n, c]) => { const t = n === 'Sun' ? sunT : (star(n) || {}).temp; if (!t) return ''; const C = Math.round((t - 273) / 100) * 100;
    return `<li style="--sc:${c}"><span class="sh-dot" aria-hidden="true"></span><b>${n === 'Sun' ? (ar ? 'الشمس' : 'The Sun') : sname(n)}</b><span>${ar ? 'نحو ' : 'about '}${fmt(C)} °C</span></li>`; }).join('');
  h += box(ar ? 'لماذا تختلف ألوان النجوم؟' : 'Why are stars different colours?', (ar
    ? `<p>لون النجم يدل على <b>حرارة سطحه</b>، كما يتوهج الحديد في النار أحمر ثم أصفر ثم أبيض كلما ازداد حرارة. النجوم الأبرد حمراء أو برتقالية، والمتوسطة مثل الشمس صفراء مائلة إلى البياض، والأشد حرارة بيضاء زرقاء.</p>`
    : `<p>A star's colour shows <b>how hot its surface is</b>, just as iron in a fire glows red, then yellow, then white as it gets hotter. Cooler stars are red or orange, middling ones like the Sun yellow-white, and the hottest blue-white.</p>`)
    + `<ol class="sh-strip">${strip}</ol>` + (ar
    ? `<p class="sh-note">ألوان النجوم هادئة، فمعظمها يبدو أبيض للعين المجردة، ويظهر اللون أوضح في النجوم اللامعة وبالمنظار.</p>`
    : `<p class="sh-note">Star colours are gentle: to the naked eye most stars look white. Colour shows best in the bright stars, and through binoculars.</p>`));
  // 4. twinkling
  h += box(ar ? 'لماذا تتلألأ النجوم؟' : 'Why do stars twinkle?', ar
    ? `<p>التلألؤ يحدث في هوائنا لا في النجم. يمر ضوء النجم عبر طبقات متحركة من الهواء الدافئ والبارد تحرفه قليلًا هنا وهناك مرات كثيرة في الثانية. والنجم بعيد جدًّا حتى إنه يصلنا نقطة ضوء واحدة، فتجعله هذه الاهتزازات يرتعش، بل يومض بألوان مختلفة أحيانًا.</p><ul class="facts"><li>يكون التلألؤ أقوى قرب الأفق، لأن الضوء يقطع هناك طبقة أسمك بكثير من الهواء.</li><li>الكواكب تضيء غالبًا بثبات: فهي قريبة بما يكفي لتبدو أقراصًا صغيرة، وتلغي اهتزازات أجزاء القرص بعضها بعضًا.</li><li>نصيحة: إذا رأيت «نجمًا» لامعًا لا يتلألأ فهو على الأرجح كوكب.</li><li>في الفضاء، فوق الهواء، لا تتلألأ النجوم أبدًا.</li></ul>`
    : `<p>Twinkling happens in our air, not in the star. Starlight passes through moving layers of warm and cool air that bend it a tiny bit, this way and that, many times a second. A star is so far away that it reaches us as a single point of light, so these wobbles make it flicker, and sometimes flash different colours.</p><ul class="facts"><li>Twinkling is strongest near the horizon, where the light crosses much more air.</li><li>Planets usually shine steadily: they are close enough to look like tiny discs, and the wobbles from different parts of the disc cancel out.</li><li>A tip: if a bright "star" does not twinkle, it is probably a planet.</li><li>In space, above the air, stars do not twinkle at all.</li></ul>`);
  // 5. daytime
  h += box(ar ? 'لماذا لا نرى النجوم في النهار؟' : 'Why can\'t we see stars in the daytime?', ar
    ? `<p>النجوم موجودة دائمًا. لكن الهواء في النهار يبعثر ضوء الشمس في كل اتجاه (وهذا ما يجعل السماء زرقاء)، فتطغى السماء المضيئة على ضوء النجوم الخافت. وحين تغرب الشمس وتظلم السماء تظهر النجوم الأسطع أولًا ثم الأخفت. و«أول نجم» في المساء كثيرًا ما يكون كوكبًا مثل الزهرة أو المشتري.</p>`
    : `<p>The stars are always there. In the day, the air scatters sunlight in every direction (that is what makes the sky blue), and the bright sky drowns out the faint starlight. As the Sun sets and the sky darkens, the brightest stars appear first, then the fainter ones. The "first star" of the evening is often a planet such as Venus or Jupiter.</p>`);
  // 6. more stars in some places
  h += box(ar ? 'لماذا أرى نجومًا أكثر في بعض الأماكن؟' : 'Why do I see more stars in some places?', ar
    ? `<p>لسببين: التلوث الضوئي، وعيناك. أضواء المدن تنير السماء كما يفعل ضوء النهار، فلا يظهر إلا ألمع النجوم، أما في صحراء مظلمة فيمكنك أن ترى بضعة آلاف من النجوم في وقت واحد.</p><ul class="facts"><li>تحتاج عيناك إلى نحو 20 إلى 30 دقيقة في الظلام لتصبح أشد حساسية بكثير.</li><li>الضوء الأحمر لا يفسد تكيّف عينيك مع الظلام، ولهذا وُضعت شاشة «أحمر ليلي» في هذا الموقع.</li><li>يساعدك قسم «خطّط لليلة» على اختيار وقت ومكان مناسبين للرصد.</li></ul>`
    : `<p>Two reasons: light pollution, and your eyes. City lights brighten the sky the way daylight does, so only the brightest stars show; in a dark desert you can see a few thousand stars at once.</p><ul class="facts"><li>Your eyes need about 20 to 30 minutes in the dark to become far more sensitive.</li><li>Red light does not spoil your dark-adapted eyes, which is why this site has a Night red screen.</li><li>The Plan a night section helps you choose a good time and place to look.</li></ul>`);
  return h;
}
function dsoSectionHTML(lang) {
  const ar = lang === 'ar', all = allDsos();
  let h = `<p class="dsec-in">${ar ? `${all.length} جرمًا من أجمل ما في السماء خارج المجموعة الشمسية، مقسّمة حسب الفهرس الذي تنتمي إليه، ومنها كل أجرام فهرس مسييه الـ110. اضغط على أي فهرس لفتحه. الصورة لكل جرم صورة مشهورة من ويكيميديا كومنز (أغلبها من ناسا ووكالة الفضاء الأوروبية والمرصد الأوروبي الجنوبي) إن وُجدت، وإلا فصورة حقيقية للسماء من مسح DSS.` : `${all.length} of the finest sights beyond the Solar System, sorted by the catalogue they belong to, including all 110 Messier objects. Tap a catalogue to open it. Each picture is a famous photo from Wikimedia Commons (mostly NASA, ESA and ESO) where there is one, otherwise a real photo of that patch of sky from the DSS sky survey.`}</p>`;
  h += `<div class="dsearch" role="search"><label for="dsq" class="sect-lbl">${ar ? 'ابحث في الأجرام' : 'Search deep-sky objects'}</label><input id="dsq" type="search" autocomplete="off" spellcheck="false" placeholder="${ar ? 'مثل: M42، سديم الجبار، NGC 7000، مجرة، الجبار' : 'e.g. M42, Orion Nebula, NGC 7000, galaxy, Orion'}" dir="auto"><p class="dsq-n" aria-live="polite"></p></div>`;
  DSO_CATS.forEach(([id, en, a, sub, subAr]) => {
    const l = all.filter(o => dsoCatOf(o.d) === id).sort((x, y) => dsoNum(x.d) - dsoNum(y.d) || String(x.d.name || x.d.cat).localeCompare(String(y.d.name || y.d.cat)));
    if (!l.length) return;
    h += `<details class="dgroup" id="dg-${id}"><summary><span class="pd-ar" aria-hidden="true">▸</span><span class="dg-t">${ar ? a : en} <span class="dn-n">· ${l.length}</span></span><span class="dg-sub">${ar ? subAr : sub}</span></summary>`
      + `<div class="dgrid">${l.map(o => dsoCardHTML(o, lang)).join('')}</div></details>`;
  });
  h += `<p class="vref" style="white-space:normal">${ar ? 'الصور: صور تلسكوب جيمس ويب الفضائي حيث وُجدت (ESA/Webb وناسا ووكالة الفضاء الكندية، بترخيص CC BY 4.0، وسطر الشكر لكل صورة تحتها)؛ ويكيميديا كومنز (لكل صورة صاحبها ورخصتها، اضغط على «المصدر» تحت الصورة)؛ مسح السماء DSS الملوّن (معهد علوم تلسكوب الفضاء STScI ومرصد بالومار/معهد كاليفورنيا للتقنية) عبر خدمة hips2fits من مركز CDS في ستراسبورغ.' : 'Pictures: James Webb Space Telescope where available (ESA/Webb, NASA and CSA, CC BY 4.0; each picture\'s credit line is shown on it); Wikimedia Commons (each photo has its own author and licence: tap "Source" under it); DSS colour sky survey (STScI, Palomar Observatory/Caltech, UK Schmidt), via the CDS hips2fits service, Strasbourg.'}</p>`;
  return h;
}
// search inside the deep-sky section: names, catalogue numbers (M42, NGC 1976, C14, IC 434), constellation and type, in English or Arabic
const DSOS = (() => {
  const norm = t => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ًͯ-ٰٟ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[’'‘`]/g, '').replace(/[^a-z0-9؀-ۿ]+/g, ' ').trim();
  let saved = null;
  function run(inp) {
    const card = document.getElementById('card'), raw = norm(inp.value), groups = [...card.querySelectorAll('details.dgroup')], out = card.querySelector('.dsq-n'), ar = state.lang === 'ar';
    if (!raw) { groups.forEach(g => { g.hidden = false; g.querySelectorAll('.dcard').forEach(c => c.hidden = false); }); if (saved) { groups.forEach((g, i) => g.open = saved[i]); saved = null; } out.textContent = ''; return; }
    if (!saved) saved = groups.map(g => g.open);
    const toks = raw.split(' '), compact = raw.replace(/ /g, ''), code = /^(m|ngc|ic|c|caldwell)\s?\d+$/.test(raw) ? compact.replace(/^caldwell/, 'c').replace(/^([a-z]+)0+(\d)/, '$1$2') : null; let n = 0;
    groups.forEach(g => { let k = 0; g.querySelectorAll('.dcard').forEach(c => { const hay = c.dataset.q, hc = hay.replace(/ /g, ''); const ok = code ? hay.split(' ').includes(code) : hc.includes(compact) || toks.every(t => hay.includes(t)); c.hidden = !ok; if (ok) k++; }); g.hidden = !k; g.open = !!k; n += k; });
    out.textContent = n ? (ar ? `${n} ${n === 1 ? 'نتيجة' : n === 2 ? 'نتيجتان' : n <= 10 ? 'نتائج' : 'نتيجة'}` : `${n} found`) : (ar ? 'لا توجد نتائج. جرّب اسمًا آخر أو رقمًا مثل M31.' : 'Nothing found. Try another name or a number like M31.');
  }
  document.addEventListener('input', ev => { if (ev.target && ev.target.id === 'dsq') run(ev.target); });
  document.addEventListener('keydown', ev => { if (ev.target && ev.target.id === 'dsq' && ev.key === 'Enter') { ev.preventDefault(); ev.target.blur(); } });
  return {norm};
})();
// planet pictures (the photo at the top of each planet's Wikipedia article), loaded when its box is opened
// one chosen full-disc colour photo per body (Wikimedia Commons); if one cannot load, the photo from the body's Wikipedia article is used
const PL_FILE = {
  sun: "The Sun by the Atmospheric Imaging Assembly of NASA's Solar Dynamics Observatory - 20100819.jpg",
  mercury: 'Mercury in true color.jpg',
  venus: 'Venus-real color.jpg',
  earth: 'The Earth seen from Apollo 17.jpg',
  mars: 'OSIRIS Mars true color.jpg',
  jupiter: 'Jupiter and its shrunken Great Red Spot.jpg',
  saturn: 'Saturn during Equinox.jpg',
  uranus: 'Uranus2.jpg',
  neptune: 'Neptune Full.jpg',
  pluto: 'Pluto in True Color - High-Res.jpg',
};
const PL_WIKI = {sun: 'Sun', mercury: 'Mercury_(planet)', venus: 'Venus', earth: 'Earth', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto'};
(() => {
  async function load(box) {
    if (box.dataset.done) return; box.dataset.done = '1';
    const ar = state.lang === 'ar', ph = box.querySelector('.dph');
    const file = PL_FILE[box.dataset.pid];
    if (file && !box.dataset.tried) {
      box.dataset.tried = '1'; const img = new Image(); img.alt = (ar ? 'صورة ' : 'Picture of ') + box.dataset.wiki.replace(/_.*$/, '');
      img.onload = () => { if (ph) ph.remove(); box.classList.add('ok'); box.prepend(img);
        box.insertAdjacentHTML('beforeend', `<a class="dcr" href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}" target="_blank" rel="noopener">${ar ? 'المصدر: ويكيميديا كومنز' : 'Source: Wikimedia Commons'}</a>`); };
      img.onerror = () => { delete box.dataset.done; load(box); };
      img.src = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=500`; return;
    }
    const fail = () => { delete box.dataset.done; if (ph) ph.textContent = navigator.onLine === false ? (ar ? 'الصورة تحتاج إلى اتصال بالإنترنت' : 'The picture needs an internet connection') : (ar ? 'تعذّر تحميل الصورة' : 'The picture could not load'); };
    try {
      const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(box.dataset.wiki)}`); if (!r.ok) return fail();
      const j = await r.json(), t = j.originalimage && j.originalimage.width <= 1200 ? j.originalimage : j.thumbnail; if (!t) return fail();
      const file = decodeURIComponent((t.source.match(/\/(?:\d+px-)?([^/]+?)(?:\.png)?$/) || [])[1] || '');
      const img = new Image(); img.alt = (ar ? 'صورة ' : 'Picture of ') + (j.title || '');
      img.onload = () => { if (ph) ph.remove(); box.classList.add('ok'); box.prepend(img);
        const a = document.createElement('a'); a.className = 'dcr'; a.target = '_blank'; a.rel = 'noopener'; a.href = (j.content_urls && j.content_urls.desktop && j.content_urls.desktop.page) || '#'; a.textContent = ar ? 'المصدر: ويكيبيديا / ويكيميديا كومنز' : 'Source: Wikipedia / Wikimedia Commons'; box.appendChild(a); };
      img.onerror = fail; img.src = t.source;
    } catch (e) { fail(); }
  }
  document.addEventListener('toggle', ev => { const d = ev.target; if (!d.matches || !d.matches('.plfold') || !d.open) return; const b = d.querySelector('.plimg[data-wiki]'); if (b && b.dataset.wiki) load(b); }, true);
  addEventListener('online', () => document.querySelectorAll('.plfold[open] .plimg:not(.ok)').forEach(load));
})();
// other names for each deep-sky object (OpenNGC: Caldwell numbers, other catalogues, popular names), so the search finds them by any name
const DSO_ALIAS = {"NGC3031":["M 81","2MASX J09553318+6903549","IRAS 09514+6918","MCG +12-10-010","PGC 28630","SDSS J095533.16+690355.1","UGC 5318","Bode's Galaxy"],"NGC5457":["M 101","IRAS 14013+5435","MCG +09-23-028","PGC 50063","SDSS J140312.52+542056.2","UGC 8981"],"NGC3034":["M 82","2MASX J09555243+6940469","IRAS 09517+6954","MCG +12-10-011","PGC 28655","SDSS J095551.73+694048.6","UGC 5322","Cigar Galaxy"],"NGC3992":["M 109","2MASX J11573598+5322282","IRAS 11549+5339","MCG +09-20-044","PGC 37617","SDSS J115735.96+532228.9","UGC 6937"],"NGC3587":["M 97","IRAS 11119+5517","PN G148.4+57.0","SDSS J111447.71+550108.5","Owl Nebula"],"NGC6543":["2MASX J17583335+6637591","Caldwell 6","C 6","IRAS 17584+6638","PN G096.4+29.9","Cat's Eye Nebula"],"IC1396":["BD +56 2617","HD 206267","HIP 106886","LBN 451","LBN 452","MWSC 3539"],"NGC7160":["MWSC 3572"],"NGC7023":["Caldwell 4","C 4","IRAS 21009+6758","LBN 487","Iris Nebula"],"NGC7380":["LBN 511","MWSC 3659"],"NGC7234":["NGC 7235","MWSC 3595"],"NGC6205":["M 13","2MASX J16414163+3627407","MWSC 2445","Hercules Globular Cluster"],"NGC6341":["M 92","MWSC 2557"],"NGC6779":["M 56","MWSC 3077"],"NGC6720":["M 57","IRAS 18517+3257","PN G063.1+13.9","Ring Nebula"],"NGC6743":["MWSC 3036"],"NGC7000":["Caldwell 20","C 20","LBN 373","North America Nebula"],"NGC7092":["M 39","MWSC 3521"],"NGC6960":["Caldwell 34","C 34","LBN 191","Veil Nebula","Filamentary Nebula","Western Veil"],"NGC6992":["Caldwell 33","C 33","Eastern Veil","Network Nebula"],"NGC6913":["M 29","MWSC 3329"],"NGC0457":["Caldwell 13","C 13","MWSC 114","Owl Cluster"],"NGC7654":["M 52","MWSC 3725"],"NGC0663":["Caldwell 10","C 10","MWSC 139"],"NGC0581":["M 103","MWSC 124"],"IC1805":["LBN 654","MWSC 209"],"NGC0869":["MWSC 175","h Persei Cluster"],"NGC0884":["MWSC 184","chi Persei Cluster"],"NGC1499":["LBN 756","California Nebula"],"NGC1039":["M 34","MWSC 223"],"C014":["Double Cluster","h & chi Persei","NGC 869","NGC 884","h and chi Persei"],"NGC2099":["M 37","MWSC 689"],"NGC1960":["M 36","MWSC 594"],"NGC1912":["M 38","MWSC 557"],"NGC2281":["MWSC 989"],"NGC1857":["MWSC 505"],"IC4665":["MWSC 2689"],"NGC6633":["MWSC 2917"],"NGC6254":["M 10","MWSC 2498"],"NGC6273":["M 19","MWSC 2519"],"NGC6402":["M 14","MWSC 2643"],"NGC6838":["M 71","NGC 6839","MWSC 3200"],"NGC6709":["MWSC 3009"],"NGC6755":["MWSC 3051"],"NGC7078":["M 15","IRAS 21274+1156","MWSC 3518","PN G065.0-27.3"],"NGC0224":["M 31","2MASX J00424433+4116074","IRAS 00400+4059","MCG +07-02-016","PGC 2557","UGC 454","Andromeda Galaxy"],"NGC0752":["Caldwell 28","C 28","MWSC 151"],"NGC0221":["M 32","2MASX J00424182+4051546","IRAS 00399+4035","MCG +07-02-015","PGC 2555","UGC 452"],"NGC0205":["M 110","2MASX J00402207+4141070","IRAS 00376+4124","MCG +07-02-014","PGC 2429","UGC 426"],"NGC7662":["2MASX J23255415+4232111","Caldwell 22","C 22","IRAS 23234+4215","PN G106.5-17.6","Copeland's Blue Snowball"],"NGC0598":["M 33","2MASX J01335090+3039357","IRAS 01310+3024","MCG +05-04-069","PGC 5818","UGC 1117","Triangulum Galaxy","Triangulum Pinwheel"],"Mel022":["M 45","MWSC 305","Pleiades","M 45","Pleiades","Seven Sisters","Melotte 22"],"C041":["Cl 50","Mel 25","Hyades","Melotte 25","Collinder 50"],"NGC1952":["M 1","IRAS 05315+2158","LBN 833","Crab Nebula"],"NGC1746":["MWSC 461"],"NGC1647":["MWSC 416"],"NGC2168":["M 35","MWSC 754"],"NGC2392":["Caldwell 39","C 39","IRAS 07262+2100","PN G197.8+17.3","Eskimo Nebula"],"IC0444":["LBN 840"],"NGC2129":["MWSC 704"],"NGC2395":["MWSC 1228"],"NGC2632":["M 44","MWSC 1527","Beehive","Praesepe Cluster"],"NGC2682":["M 67","MWSC 1585"],"NGC3627":["M 66","2MASX J11201502+1259286","IRAS 11176+1315","MCG +02-29-019","PGC 34695","SDSS J112014.98+125929.4","UGC 6346"],"NGC3368":["M 96","2MASX J10464574+1149117","IRAS 10441+1205","MCG +02-28-006","PGC 32192","SDSS J104645.67+114911.8","UGC 5882"],"NGC3379":["M 105","2MASX J10474959+1234538","MCG +02-28-011","PGC 32256","UGC 5902"],"NGC3623":["M 65","2MASX J11185595+1305319","IRAS 11163+1322","MCG +02-29-018","PGC 34612","UGC 6328"],"NGC3351":["M 95","2MASX J10435773+1142129","IRAS 10413+1158","MCG +02-28-001","PGC 32007","SDSS J104357.69+114213.6","SDSS J104357.70+114213.7","UGC 5850"],"NGC4472":["M 49","2MASX J12294679+0800014","MCG +01-32-083","PGC 41220","SDSS J122946.76+080001.7","UGC 7629"],"NGC4594":["M 104","2MASX J12395949-1137230","IRAS 12373-1120","MCG -02-32-020","PGC 42407","UGCA 293","Sombrero Galaxy"],"NGC4649":["M 60","2MASS J12434000+1133099","2MASX J12434000+1133093","MCG +02-33-002","PGC 42831","SDSS J124339.97+113309.7","UGC 7898"],"NGC4406":["M 86","2MASX J12261181+1256454","MCG +02-32-046","PGC 40653","SDSS J122611.75+125646.3","UGC 7532"],"NGC4486":["M 87","2MASX J12304942+1223279","IRAS 12282+1240","MCG +02-32-105","PGC 41361","SDSS J123049.41+122328.1","UGC 7654","Virgo Galaxy"],"NGC6231":["Caldwell 76","C 76","MWSC 2481"],"NGC6475":["M 7","MWSC 2739","Ptolemy's Cluster"],"NGC6405":["M 6","MWSC 2661","Butterfly Cluster"],"NGC6121":["M 4","MWSC 2396"],"NGC6093":["M 80","MWSC 2376"],"IC4715":["M 24","Small Sgr Star Cloud"],"IC4725":["M 25","MWSC 2940"],"NGC6494":["M 23","MWSC 2757"],"NGC6523":["M 8","NGC 6533","LBN 25","Lagoon Nebula"],"NGC6531":["M 21","MWSC 2796"],"NGC7099":["M 30","MWSC 3543"],"NGC7089":["M 2","MWSC 3526"],"NGC7293":["Caldwell 63","C 63","ESO 602-022","PN G036.1-57.1","Helix Nebula"],"NGC7009":["2MASX J21041082-1121481","Caldwell 55","C 55","IRAS 21014-1133","PN G037.7-34.5","Saturn Nebula"],"NGC6981":["M 72","MWSC 3419"],"NGC0628":["M 74","2MASX J01364177+1547004","IRAS 01340+1532","MCG +03-05-011","PGC 5974","UGC 1149"],"NGC1068":["M 77","2MASX J02424077-0000478","IRAS 02401-0013","MCG +00-07-083","PGC 10266","UGC 2188"],"NGC1976":["M 42","LBN 974","MWSC 582","Great Orion Nebula","Orion Nebula"],"B033":["Horsehead Nebula","Barnard 33","IC 434"],"NGC2068":["M 78","MWSC 664"],"NGC1982":["M 43","2MASS J05353135-0516026","Mairan's Nebula"],"NGC1980":["LBN 977","MWSC 586","Lower Sword"],"NGC1300":["2MASX J03194107-1924408","ESO 547-031","ESO-LV 547-0310","IRAS 03174-1935","MCG -03-09-018","PGC 12412","UGCA 66"],"NGC1904":["M 79","MWSC 528"],"NGC2287":["M 41","MWSC 978"],"NGC2354":["MWSC 1148"],"NGC2360":["Caldwell 58","C 58","MWSC 1165","Caroline's Cluster"],"NGC2384":["MWSC 1216"],"NGC2345":["MWSC 1120"],"NGC3372":["Caldwell 92","C 92","Carina Nebula","eta Car Nebula"],"NGC3532":["Caldwell 91","C 91","MWSC 1890","Wishing Well Cluster"],"NGC2516":["Caldwell 96","C 96","MWSC 1393"],"IC2602":["Caldwell 102","C 102","MWSC 1841","tet Car Cluster"],"NGC2808":["MWSC 1636"],"NGC2422":["M 47","NGC 2478","MWSC 1278"],"NGC2477":["Caldwell 71","C 71","MWSC 1363"],"NGC2437":["M 46","MWSC 1313"],"NGC2447":["M 93","MWSC 1324"],"NGC2546":["MWSC 1447"],"IC2391":["Caldwell 85","C 85","MWSC 1529","omi Vel Cluster"],"IC2395":["MWSC 1537"],"NGC2547":["MWSC 1437"],"NGC3228":["2MASX J10212483-5143085","MWSC 1794"],"NGC2669":["MWSC 1561"],"NGC2627":["ESO 431-020","MWSC 1514"],"NGC2548":["M 48","MWSC 1454"],"NGC5236":["M 83","2MASX J13370091-2951567","ESO 444-081","ESO-LV 444-0810","IRAS 13341-2936","MCG -05-32-050","PGC 48082","UGCA 366","Southern Pinwheel Galaxy"],"NGC3242":["Caldwell 59","C 59","ESO 568-005","IRAS 10223-1823","PN G261.0+32.0","Jupiter's Ghost Nebula"],"NGC4590":["M 68","MWSC 2059"],"NGC4038":["2MASS J12015301-1852034","Caldwell 60","C 60","ESO 572-047","ESO-LV 572-0470","ESO-LV 572-0481","MCG -03-31-014","PGC 37967","UGCA 264","Antennae Galaxies"],"NGC4755":["Caldwell 94","C 94","MWSC 2072","Herschel's Jewel Box","kappa Crucis Cluster"],"C099":["Coalsack Nebula","Caldwell 99"],"NGC4609":["Caldwell 98","C 98","MWSC 2062","Coalsack Cluster"],"NGC4103":["MWSC 1997"],"NGC4349":["MWSC 2024"],"NGC3766":["Caldwell 97","C 97","MWSC 1958","Pearl Cluster"],"NGC5139":["Caldwell 80","C 80","MWSC 2120","Omega Centauri"],"NGC5128":["2MASX J13252775-4301073","Caldwell 77","C 77","ESO 270-009","ESO-LV 270-0090","IRAS 13225-4245","MCG -07-28-001","PGC 46957","Centaurus A"],"NGC3918":["ESO 170-013","IRAS 11478-5654","Blue Planetary"],"NGC4945":["2MASX J13052727-4928044","Caldwell 83","C 83","ESO 219-024","ESO-LV 219-0240","IRAS 13025-4911","PGC 45279"],"NGC5822":["MWSC 2269"],"NGC5986":["ESO 329-018","MWSC 2317"],"NGC6397":["Caldwell 86","C 86","MWSC 2662"],"NGC6362":["MWSC 2619"],"NGC6250":["MWSC 2500"],"IC4651":["MWSC 2590"],"NGC6208":["MWSC 2470"],"NGC6541":["Caldwell 78","C 78","MWSC 2813"],"NGC2997":["2MASX J09453879-3111279","ESO 434-035","ESO-LV 434-0350","MCG -05-23-012","PGC 27978","UGCA 181"],"NGC1502":["MWSC 343"],"NGC2403":["2MASX J07365139+6536091","Caldwell 7","C 7","IRAS 07321+6543","MCG +11-10-007","PGC 21396","UGC 3918"],"NGC5272":["M 3","MWSC 2152"],"NGC4736":["M 94","2MASX J12505314+4107125","IRAS 12485+4123","MCG +07-26-058","PGC 43495","UGC 7996"],"NGC5194":["M 51","2MASX J13295269+4711429","IRAS 13277+4727","MCG +08-25-012","PGC 47404","UGC 8493","Whirlpool Galaxy"],"NGC5055":["M 63","2MASX J13154932+4201454","IRAS 13135+4217","MCG +07-27-054","PGC 46153","SDSS J131549.26+420145.8","UGC 8334","Sunflower Galaxy"],"NGC4258":["M 106","2MASX J12185761+4718133","MCG +08-22-104","PGC 39600","SDSS J121857.50+471814.2","UGC 7353"],"NGC5823":["Caldwell 88","C 88","MWSC 2273"],"NGC1851":["Caldwell 73","C 73","MWSC 489"],"NGC5024":["M 53","MWSC 2094"],"NGC4826":["M 64","2MASX J12564369+2140575","IRAS 12542+2157","MCG +04-31-001","PGC 44182","UGC 8062","Black Eye Galaxy","Evil Eye Galaxy"],"NGC4382":["M 85","2MASX J12252405+1811278","MCG +03-32-029","PGC 40515","SDSS J122524.06+181127.7","UGC 7508"],"NGC4321":["M 100","2MASX J12225489+1549205","IRAS 12204+1605","MCG +03-32-015","PGC 40153","SDSS J122254.91+154920.2","UGC 7450"],"NGC4254":["M 99","2MASX J12184962+1424593","IRAS 12162+1441","MCG +03-31-099","PGC 39578","SDSS J121849.60+142459.4","UGC 7345","Coma Pinwheel","Virgo Cluster Pinwheel"],"ESO056-115":["ESO-LV 561150","IRAS 05240-6948","PGC 17223","Large Magellanic Cloud","Nubecula Major"],"NGC2070":["Caldwell 103","C 103","30 Dor Cluster","Tarantula Nebula"],"NGC1566":["2MASX J04200041-5456161","ESO 157-020","ESO-LV 157-0200","IRAS 04189-5503","PGC 14897"],"NGC1316":["2MASX J03224178-3712295","ESO 357-022","ESO-LV 357-0220","IRAS 03208-3723","MCG -06-08-005","PGC 12651","Fornax A"],"NGC1097":["2MASX J02461905-3016296","Caldwell 67","C 67","ESO 416-020","ESO-LV 416-0200","IRAS 02441-3029","MCG -05-07-024","PGC 10488","UGCA 41"],"NGC1365":["2MASX J03333645-3608263","ESO 358-017","ESO-LV 358-0170","IRAS 03317-3618","MCG -06-08-026","PGC 13179"],"ESO356-004":["ESO-LV 3560040","MCG-06-07-001","PGC 10074","PGC 10093","Fornax Dwarf Spheroidal"],"NGC7552":["IC 5294","2MASX J23161076-4235053","ESO 291-012","ESO-LV 291-0120","IRAS 23134-4251","MCG -07-47-028","PGC 70884"],"NGC1261":["2MASX J03121627-5513070","Caldwell 87","C 87","MWSC 263"],"NGC7243":["Caldwell 16","C 16","MWSC 3602"],"NGC7209":["MWSC 3585"],"NGC2264":["LBN 911","MWSC 954","Christmas Tree Cluster"],"NGC2323":["M 50","MWSC 1072"],"NGC2237":["Rosette A"],"NGC2232":["MWSC 861"],"NGC2239":["NGC 2244","Caldwell 50","C 50","MWSC 896"],"NGC4833":["Caldwell 105","C 105","MWSC 2077"],"NGC4372":["Caldwell 108","C 108","MWSC 2029"],"NGC4463":["MWSC 2042"],"NGC6087":["Caldwell 89","C 89","MWSC 2382","S Nor Cluster"],"NGC6067":["MWSC 2370"],"NGC6169":["MWSC 2424"],"NGC6167":["MWSC 2425"],"NGC6164":["ESO 226-013","TYC 8329-3343-1"],"NGC6752":["NGC 6777","Caldwell 93","C 93","MWSC 3062"],"NGC6744":["2MASX J19094609-6351271","Caldwell 101","C 101","ESO 104-042","ESO-LV 104-0420","IRAS 19051-6357","PGC 62836"],"NGC0055":["2MASX J00145360-3911478","Caldwell 72","C 72","ESO 293-050","ESO-LV 293-0500","IRAS 00125-3928","MCG -07-01-013","PGC 1014"],"NGC0300":["2MASX J00545347-3741037","Caldwell 70","C 70","ESO 295-020","ESO-LV 295-0200","IRAS 00525-3757","MCG -06-03-005","PGC 3238"],"NGC0253":["2MASX J00473313-2517196","Caldwell 65","C 65","ESO 474-029","ESO-LV 474-0290","IRAS 00450-2533","MCG -04-03-009","PGC 2789","UGCA 13","Sculptor Filament","Silver Coin"],"NGC0288":["MWSC 84"],"NGC6705":["M 11","MWSC 3008","Amas de l'Ecu de Sobieski","Wild Duck Cluster"],"NGC6694":["M 26","MWSC 2987"],"IC1287":["BD -10 4713","HD 170740","HIP 90804","LBN 75"],"NGC6664":["MWSC 2962"],"NGC3115":["2MASX J10051397-0743068","Caldwell 53","C 53","MCG -01-26-018","PGC 29265","UGCA 199","Spindle Galaxy"],"NGC6584":["MWSC 2885"],"NGC6025":["Caldwell 95","C 95","MWSC 2347"],"NGC0292":["ESO 029-021","PGC 3085","Small Magellanic Cloud"],"NGC0104":["2MASX J00240535-7204531","Caldwell 106","C 106","MWSC 38","47 Tuc Cluster"],"NGC0362":["Caldwell 104","C 104","MWSC 99"],"Cl399":["Brocchi's Cluster","Al Sufi's Cluster","Coathanger Asterism","Collinder 399","Coathanger"],"NGC6853":["M 27","2MASX J19593637+2243157","PN G060.8-03.6","Dumbbell Nebula"],"NGC6940":["MWSC 3370"],"NGC6823":["LBN 135","MWSC 3163"],"NGC6830":["MWSC 3191"],"NGC5904":["M 5","MWSC 2286"],"NGC6333":["M 9","MWSC 2567"],"NGC6218":["M 12","MWSC 2464"],"NGC6611":["M 16","LBN 67","MWSC 2886","Eagle Nebula"],"NGC6618":["M 17","LBN 60","MWSC 2896","Checkmark Nebula","Lobster Nebula","Swan Nebula","omega Nebula"],"NGC6613":["M 18","MWSC 2892"],"NGC6514":["M 20","LBN 27","MWSC 2789","Trifid Nebula"],"NGC6656":["M 22","MWSC 2961"],"NGC6626":["M 28","MWSC 2908"],"M040":["M 40","WDS J12222+5805AB"],"NGC6715":["M 54","MWSC 3023"],"NGC6809":["M 55","MWSC 3150"],"NGC4579":["M 58","2MASX J12374359+1149051","IRAS 12351+1205","MCG +02-32-160","PGC 42168","SDSS J123743.52+114905.4","UGC 7796"],"NGC4621":["M 59","2MASX J12420232+1138489","MCG +02-32-183","PGC 42628","SDSS J124202.25+113848.8","UGC 7858"],"NGC4303":["M 61","2MASX J12215494+0428249","IRAS 12194+0444","MCG +01-32-022","PGC 40001","SDSS J122154.92+042825.6","UGC 7420"],"NGC6266":["M 62","MWSC 2512"],"NGC6637":["M 69","NGC 6634","MWSC 2936"],"NGC6681":["M 70","MWSC 2981"],"NGC6994":["M 73"],"NGC6864":["M 75","2MASX J20060484-2155201","MWSC 3254"],"NGC0650":["M 76","NGC 651","2MASX J01421808+5134243","IRAS 01391+5119","PN G130.9-10.5","Barbell Nebula","Cork Nebula","Little Dumbbell Nebula"],"NGC4374":["M 84","2MASX J12250377+1253130","IRAS 12224+1309","MCG +02-32-034","PGC 40455","SDSS J122503.74+125312.8","UGC 7494"],"NGC4501":["M 88","2MASX J12315921+1425134","IRAS 12294+1441","MCG +03-32-059","PGC 41517","UGC 7675"],"NGC4552":["M 89","2MASX J12353988+1233217","MCG +02-32-149","PGC 41968","SDSS J123539.80+123322.8","UGC 7760"],"NGC4569":["M 90","2MASX J12364981+1309463","IRAS 12343+1326","MCG +02-32-155","PGC 42089","SDSS J123649.79+130946.5","UGC 7786"],"NGC4548":["M 91","2MASX J12352642+1429467","IRAS 12328+1446","MCG +03-32-075","PGC 41934","SDSS J123526.45+142946.8","UGC 7753"],"NGC4192":["M 98","2MASX J12134829+1454016","IRAS 12112+1510","MCG +03-31-079","PGC 39028","SDSS J121348.28+145401.6","UGC 7231"],"NGC5866":["2MASX J15062956+5545479","IRAS 15051+5557","MCG +09-25-017","PGC 53933","UGC 9723"],"NGC6171":["M 107","MWSC 2422"],"NGC3556":["M 108","2MASX J11113096+5540268","IRAS 11085+5556","MCG +09-18-098","PGC 34030","SDSS J111131.06+554027.4","UGC 6225"]};
// James Webb Space Telescope pictures (ESA/Webb, CC BY 4.0), each with its own credit line as ESA/Webb asks
const PHANGS = 'NASA, ESA, CSA, STScI, J. Lee (STScI), T. Williams (Oxford), PHANGS Team';
const DSO_WEBB = {
  NGC1952: ['weic2326a', 'NASA, ESA, CSA, STScI, T. Temim (Princeton University)'],
  NGC6611: ['weic2216b', 'NASA, ESA, CSA, STScI; J. DePasquale, A. Koekemoer, A. Pagan (STScI)'],
  NGC0628: ['weic2403c', PHANGS],
  NGC3034: ['weic2612a', 'NASA, ESA, CSA, A. Smercina (STScI), T. Williams (University of Manchester). Image processing: A. Pagan (STScI)'],
  NGC4594: ['weic2427a', 'NASA, ESA, CSA, STScI'],
  NGC4258: ['potm2407a', 'ESA/Webb, NASA & CSA, J. Glenn'],
  NGC5128: ['weic2615a', 'NASA, ESA, CSA, STScI. Image Processing: A. Pagan (STScI), J. Depasquale (STScI), M. Garcia Marin (ESA Office at STScI)'],
  NGC3372: ['weic2205a', 'NASA, ESA, CSA, and STScI'],
  NGC2070: ['weic2212a', 'NASA, ESA, CSA, and STScI'],
  B033: ['weic2411a', 'ESA/Webb, NASA, CSA, K. Misselt (University of Arizona) and A. Abergel (IAS/University Paris-Saclay, CNRS)'],
  NGC1300: ['weic2403e', PHANGS],
  NGC3627: ['weic2403n', PHANGS],
  NGC4303: ['weic2403p', PHANGS],
  NGC4321: ['weic2403q', PHANGS],
};
// pictures load only when a card scrolls into view: a Wikipedia photo first, the sky-survey photo if there is none
const DSO_IMG = (() => {
  document.addEventListener('click', ev => { const a = ev.target.closest && ev.target.closest('.dchips a'); if (!a) return; ev.preventDefault(); const g = document.getElementById('dg-' + a.dataset.dg); if (g) g.scrollIntoView({behavior: 'smooth', block: 'start'}); });
  const cache = {};
  async function wikiThumb(title) {
    if (!title) return null; if (title in cache) return cache[title];
    try { const ctl = 'AbortController' in window ? new AbortController() : null; if (ctl) setTimeout(() => ctl.abort(), 8000);
      const r = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title).replace(/%2F/g, '/'), ctl ? {signal: ctl.signal} : {});
      if (!r.ok) return (cache[title] = null); const j = await r.json(); const t = j.thumbnail && j.thumbnail.source;
      if (!t || /\.svg/i.test(t)) return (cache[title] = null);
      const file = decodeURIComponent((t.split('/').slice(-2, -1)[0] || ''));
      return (cache[title] = {src: t, file, page: j.content_urls && j.content_urls.desktop && j.content_urls.desktop.page});
    } catch (e) { return null; }
  }
  function show(box, src, credit, alt) {
    const img = new Image(); img.alt = alt; img.decoding = 'async'; if (/upload\.wikimedia\.org/.test(src)) img.crossOrigin = 'anonymous';
    img.onload = () => { box.querySelector('.dph') && box.querySelector('.dph').remove(); box.prepend(img); box.classList.add('ok'); box.insertAdjacentHTML('beforeend', credit); };
    img.onerror = () => {
      if (!box.dataset.tried && box.dataset.sky) { box.dataset.tried = 'sky'; show(box, box.dataset.sky, skyCredit(), alt); }
      else if (box.dataset.tried === 'sky' && box.dataset.sky2) { box.dataset.tried = 'sky2'; show(box, box.dataset.sky2, `<span class="dcr">${state.lang === 'ar' ? 'مسح DSS، STScI' : 'DSS sky survey, STScI'}</span>`, alt); }
      else { const ph = box.querySelector('.dph'); if (ph) ph.textContent = navigator.onLine === false ? (state.lang === 'ar' ? 'الصورة تحتاج إلى اتصال بالإنترنت' : 'The picture needs an internet connection') : (state.lang === 'ar' ? 'الصورة غير متاحة الآن' : 'Picture not available right now'); delete box.dataset.done; }
    };
    img.src = src;
  }
  const img404 = box => { const ph = box.querySelector('.dph'); if (ph) ph.textContent = state.lang === 'ar' ? 'الصورة غير متاحة الآن' : 'Picture not available right now'; };
  const skyCredit = () => `<span class="dcr">${state.lang === 'ar' ? 'مسح DSS2' : 'DSS2 sky survey'}</span>`;
  async function load(box) {
    if (box.dataset.done) return; box.dataset.done = '1';
    const alt = (state.lang === 'ar' ? 'صورة ' : 'Picture of ') + (box.closest('.dcard').querySelector('h4 bdi') || {}).textContent;
    // a James Webb picture first, where Webb has photographed the object
    const wb = DSO_WEBB[box.closest('.dcard').dataset.dso];
    if (wb && !box.dataset.webb) {
      box.dataset.webb = '1'; const img = new Image(); img.alt = alt + ' (James Webb Space Telescope)'; img.decoding = 'async';
      img.onload = () => { box.querySelector('.dph') && box.querySelector('.dph').remove(); box.prepend(img); box.classList.add('ok', 'webb');
        box.insertAdjacentHTML('beforeend', `<a class="dcr wcr" href="https://esawebb.org/images/${wb[0]}/" target="_blank" rel="noopener"><b>${state.lang === 'ar' ? 'تلسكوب جيمس ويب' : 'James Webb'}</b> · ${esc(wb[1])} · CC BY 4.0</a>`); };
      img.onerror = () => { delete box.dataset.done; load(box); };
      img.src = `https://cdn.esawebb.org/archives/images/screen/${wb[0]}.jpg`; return;
    }
    const w = await wikiThumb(box.dataset.wiki);
    if (w) show(box, w.src, `<a class="dcr" href="${esc(w.file ? 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(w.file) : w.page || '#')}" target="_blank" rel="noopener">${state.lang === 'ar' ? 'المصدر: ويكيميديا كومنز' : 'Source: Wikimedia Commons'}</a>`, alt);
    else if (box.dataset.sky) { box.dataset.tried = 'sky'; show(box, box.dataset.sky, skyCredit(), alt); }
    else img404(box);
  }
  let io = null;
  function watch(root) {
    const boxes = root.querySelectorAll('.dimg[data-sky]'); if (!boxes.length) return;
    if (!('IntersectionObserver' in window)) { boxes.forEach(load); return; }
    if (io) io.disconnect();
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.boundingClientRect.width > 0 && !e.target.closest('details:not([open])')) { io.unobserve(e.target); load(e.target); } }), {rootMargin: '400px 0px'});
    boxes.forEach(b => { io.observe(b); const r = b.getBoundingClientRect(); if (r.width && !b.closest('details:not([open])') && r.top < innerHeight + 400 && r.bottom > -400) load(b); });
  }
  // opening a folded catalogue starts its pictures
  document.addEventListener('toggle', ev => { const d = ev.target; if (!d.matches || !d.matches('.dgroup') || !d.open) return; d.querySelectorAll('.dimg[data-sky]').forEach(b => { if (io) { io.unobserve(b); io.observe(b); } const r = b.getBoundingClientRect(); if (r.width && r.top < innerHeight + 400) load(b); }); }, true);
  addEventListener('online', () => document.querySelectorAll('.dimg[data-done]:not(.ok)').forEach(b => { delete b.dataset.done; delete b.dataset.tried; load(b); }));
  return {watch};
})();

function sciHTML(key, lang) {
  const sc = DATA.sci[key], ar = lang === 'ar';
  let h = `<div class="sci${ar ? ' rtl' : ''}"${ar ? ' dir="rtl" lang="ar"' : ''}>`;
  if (KIDS) h += kidWordsHTML(lang);
  if (sc.special === 'sol') h += solarHTML(sc.bodies, lang);
  else if (sc.special === 'dso') h += dsoSectionHTML(lang);
  else if (sc.special === 'shine') h += shineHTML(lang);
  else if (sc.special === 'cos') h += cosHTML(lang);
  else if (sc.special) {
    h += factTable(sc.facts, ar) + `<ul class="facts">${(ar ? sc.ar : sc.en).map(f => `<li>${esc(f)}</li>`).join('')}</ul>`;
    if (sc.dsos) h += dsoFold(T[lang].dso.split(' في ')[0].replace(' in this constellation', ''), sc.dsos, lang);
  } else sc.parts.forEach(p => { h += partHTML(p, lang, sc.parts.length > 1); });
  if (sc.special !== 'cos') h += `<p class="vref" style="white-space:normal;margin-top:18px">${linkText(ar ? 'المصادر: فهرس نجوم HYG 4.1 (هيباركوس وغيره) للمسافات والأنواع؛ OpenNGC لأجرام السماء العميقة؛ أرشيف ناسا للكواكب الخارجية (نسخة أكتوبر 2026) للكواكب. الحرارة مقدّرة من الطيف، والمسافات تقريبية.' : 'Sources: HYG star catalogue 4.1 (Hipparcos and others) for distances and types; OpenNGC for deep-sky objects; NASA Exoplanet Archive (October 2026 copy) for planets. Temperatures are estimated from each star\'s spectrum, and distances are approximate.')}</p>`;
  return h + `</div>`;
}


