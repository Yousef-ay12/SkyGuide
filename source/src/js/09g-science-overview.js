/* ---------- Science overview: the door into Science (Cosmology first, the other pages, and what is up tonight) ---------- */
const SCI_HUB = [
  ['', 'Stars and constellations', 'النجوم والكوكبات', 'All 88 constellations: their stars, distances and objects', 'الكوكبات الثماني والثمانون كلها: نجومها ومسافاتها وأجرامها', '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>', '#f4d58d'],
  ['SOL', 'Solar System', 'المجموعة الشمسية', 'The Sun, the planets and their main moons', 'الشمس والكواكب وأقمارها الرئيسة', '<circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(-15 12 12)"/>', '#e8a35a'],
  ['DSO', 'Deep sky', 'الأجرام العميقة', '232 nebulae, star clusters and galaxies', '232 سديمًا وعنقودًا ومجرة', '<ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(-20 12 12)"/><circle cx="12" cy="12" r="1.6"/>', '#c7a2f0'],
  ['STAR', 'Why stars shine', 'لماذا تضيء النجوم', 'Brightness, colour and twinkling', 'السطوع واللون والتلألؤ', '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>', '#f0c46a']
];
function sciHubHTML(lang) {
  const ar = lang === 'ar', L = (en, a) => ar ? a : en;
  const ic = (p, c) => `<span class="hub-ic" style="--hc:${c}"><svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg></span>`;
  let h = `<div class="hub${ar ? ' rtl' : ''}"${ar ? ' dir="rtl" lang="ar"' : ''}>`;
  h += `<div class="hub-top"><div><div class="eyebrow" style="--cc:var(--c-science)"><span class="dot"></span>${L('Science', 'العلم')}</div><h2>${L('Science', 'العلم')}${ar ? '' : ' <span class="arn2" lang="ar">العلم</span>'}</h2><p class="muted">${L('What the night sky is really made of', 'ممّ تتكوّن سماء الليل حقًّا')}</p></div></div>`;
  // Cosmology first, as the new part
  h += `<button type="button" class="hub-feat" data-hub="COS"><svg class="hub-rings" aria-hidden="true" viewBox="0 0 150 150"><circle cx="75" cy="75" r="20"/><circle cx="75" cy="75" r="38"/><circle cx="75" cy="75" r="56"/><circle cx="75" cy="75" r="72"/></svg>
    <span class="hub-new">${L('NEW', 'جديد')}</span><span class="hub-ft"><b>${L('Cosmology', 'علم الكون')}</b>${ar ? '' : '<span lang="ar">علم الكون</span>'}</span>
    <span class="hub-fd">${L('The structure of the universe, gravitational waves, how galaxies form and live, and dark matter and dark energy.', 'بنية الكون، وموجات الجاذبية، وكيف تتكوّن المجرات وتعيش، والمادة المظلمة والطاقة المظلمة.')}</span>
    <span class="hub-parts">${COS_PARTS.map(p => `<span>${ar ? p.ar : p.en}</span>`).join('')}</span></button>`;
  h += `<div class="hub-grid">${SCI_HUB.map(([k, en, a, den, dar, p, c]) => `<button type="button" class="hub-card" data-hub="${k}">${ic(p, c)}<b>${L(en, a)}</b><span>${L(den, dar)}</span></button>`).join('')}</div>`;
  h += upTonightHTML(lang);
  return h + `</div>`;
}
// what is up tonight: bright planets above the horizon this evening, and the constellations at their best this month
function upTonightHTML(lang) {
  const ar = lang === 'ar';
  let pl, M, items = [];
  try {
    calInit(); pl = placeObj();
    const now = Date.now(), d = new Date(now + pl.tz * 36e5); M = d.getUTCMonth();
    const dirs = ar ? ['الشمال', 'الشمال الشرقي', 'الشرق', 'الجنوب الشرقي', 'الجنوب', 'الجنوب الغربي', 'الغرب', 'الشمال الغربي'] : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const dir = az => dirs[Math.round((((az % 360) + 360) % 360) / 45) % 8];
    const W = {evening: ['Evening', 'مساءً'], morning: ['Before dawn', 'قبل الفجر'], allnight: ['All night', 'طوال الليل']};
    PLANETS.forEach(p => { const I = planetInfo(p, now, pl, lang); if (I.where === 'close' || !I.when || !W[I.where]) return; const b = DATA.sci.SOL.bodies.find(x => x.id === p); if (!b) return;
      items.push({name: ar ? b.ar : b.en, line: `${W[I.where][ar ? 1 : 0]} · ${dir(I.when.az)} · ${Math.round(I.when.alt)}°`, color: b.color, it: {t: 'planet', key: 'SOL', ref: p}, go: 'SOL', mag: I.q.mag}); });
    items.sort((a, b) => (a.mag || 0) - (b.mag || 0));
    Object.values(CAL.iau).filter(v => v.vis.month === M && byKey[v.key]).map(v => ({v, alt: Math.round(90 - Math.abs(pl.lat - v.vis.dec))})).filter(x => x.alt > 25).sort((a, b) => b.alt - a.alt).slice(0, 4)
      .forEach(({v, alt}) => items.push({name: ar ? byKey[v.key].ar : byKey[v.key].latin, line: ar ? `أعلى ارتفاع نحو 9 مساءً · ${alt}°` : `Highest about 9 pm · ${alt}°`, color: 'var(--c-science)', it: {t: 'con', key: v.key, cul: 'science'}, go: v.key}));
  } catch (e) { items = []; }
  if (!items.length) return '';
  return `<div class="hub-up"><div class="hub-uph"><span class="sect-lbl">${ar ? 'في السماء الليلة · أضفه إلى ليلتك' : 'Up tonight · add to your night'}</span><span class="vref">${esc(ar ? (pl.ar || pl.en) : pl.en)}</span></div>
    <div class="hub-uprow">${items.map(x => `<div class="hub-upc"><button type="button" class="hub-upn" data-hub="${x.go}"><span class="dot" style="background:${x.color}"></span><b>${esc(x.name)}</b></button><span class="hub-upl">${esc(x.line)}</span>${AG.btn(x.it, lang)}</div>`).join('')}</div></div>`;
}
document.addEventListener('click', ev => {
  const b = ev.target.closest && ev.target.closest('[data-hub]'); if (!b) return;
  const k = b.dataset.hub;
  state.con = k || (byKey[lastSciCon] && !SCI_SPECIAL.has(lastSciCon) ? lastSciCon : 'Ori');
  buildList(document.getElementById('q').value); render(); window.scrollTo({top: 0});
});
