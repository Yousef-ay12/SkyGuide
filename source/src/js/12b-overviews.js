/* ---------- Overview pages for Heritage & Culture and AstroGuide (Science has its own in 09g-science-overview.js) ---------- */
const plainText = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const cutText = (s, n) => s.length > n ? s.slice(0, s.lastIndexOf(' ', n) > n * 0.6 ? s.lastIndexOf(' ', n) : n) + '…' : s;
function culHubHTML(cul, lang) {
  const ar = lang === 'ar', cu = CULTURES.find(c => c.id === cul) || CULTURES[0];
  const sky = ar ? CUL_AR_SKY[cu.id] : cname(cu.id) + ' sky';
  const keys = DATA.constellations.filter(c => !c.hidden && !ARAB_SRC.has(c.key) && (DATA.lore[c.key] || {})[cu.id]).map(c => c.key);
  const ent = k => { const e = DATA.lore[k][cu.id]; return ar && e.ar ? e.ar : e; };
  const story = k => { const e = ent(k); return {title: plainText((e.stories && e.stories[0] || {}).title), seen: plainText(e.seen)}; };
  // the featured story: one of this culture's constellations well placed this month
  let feat = keys[0];
  try { calInit(); const pl = placeObj(), M = new Date(Date.now() + pl.tz * 36e5).getUTCMonth();
    const best = Object.values(CAL.iau).filter(v => v.vis.month === M && keys.includes(v.key)).map(v => ({k: v.key, alt: 90 - Math.abs(pl.lat - v.vis.dec)})).sort((a, b) => b.alt - a.alt);
    if (best.length && best[0].alt > 20) feat = best[0].k; } catch (e) {}
  let h = `<div class="hub${ar ? ' rtl' : ''}"${ar ? ' dir="rtl" lang="ar"' : ''} style="--cc:var(--c-${cu.id})">`;
  h += `<div class="hub-top"><div class="eyebrow"><span class="dot"></span>${ar ? 'التراث والثقافة' : 'Heritage & Culture'}</div><h2>${esc(sky)}</h2><p class="muted">${ar ? `كيف قرأ الناس حول العالم النجوم نفسها. ${keys.length} كوكبة لها قصص في ${CUL_AR_SKY[cu.id]}.` : `How people across the world read the same stars. ${keys.length} constellations have ${cname(cu.id)} stories.`}</p></div>`;
  if (feat) {
    const c = byKey[feat], s = story(feat);
    h += `<div class="cul-feat"><div class="cf-chart chart">${DATA.charts[feat] || ''}<span class="cf-tag">${ar ? `${esc(CUL_AR_SKY[cu.id])} · في السماء هذا الشهر` : `${esc(cname(cu.id)).toUpperCase()} SKY · UP THIS MONTH`}</span></div>
      <div class="cf-body"><div class="cf-ttl"><b>${esc(ar ? c.ar : c.latin)}</b><span lang="${ar ? 'en' : 'ar'}">${esc(ar ? c.latin : c.ar)}</span></div>${s.title ? `<p class="cf-st">${esc(s.title)}</p>` : ''}<p class="cf-seen">${esc(cutText(s.seen, 190))}</p>
      <div class="cf-acts"><button type="button" class="pbtn main" data-ocon="${feat}">${ar ? 'اقرأ القصة' : 'Read the story'}</button>${AG.btn({t: 'con', key: feat, cul: cu.id}, lang)}</div></div></div>`;
  }
  h += `<h3 class="hub-h">${ar ? `قصص ${esc(CUL_AR_SKY[cu.id])}` : `Stories of the ${esc(cname(cu.id))} sky`}</h3><div class="cul-grid">`;
  if (cu.id === 'arab' && (DATA.lore.QUR || {}).arab) h += `<div class="cul-card cul-qur"><button type="button" class="cul-open" data-ocon="QUR"><b>${ar ? 'القرآن والسماء' : 'The Quran and the sky'}</b><span lang="ar" class="cul-ar">القرآن والسماء</span><span class="cul-st">${ar ? 'آيات عن الفلك، مجموعة بحسب الموضوع' : 'Verses about astronomy, grouped by theme'}</span></button></div>`;
  if (cu.id === 'arab' && (DATA.lore.POE || {}).arab) h += `<div class="cul-card cul-qur"><button type="button" class="cul-open" data-ocon="POE"><b>${ar ? 'الشعر وأنواء العرب' : 'Poems and the star calendar'}</b><span lang="ar" class="cul-ar">الشعر وأنواء العرب</span><span class="cul-st">${ar ? 'أشعار في القمر والكواكب والنجوم، وما قالته العرب عند طلوع كل نجم' : 'Poems about the Moon, planets and stars, and what the Arabs said as each star rose'}</span></button></div>`;
  h += keys.filter(k => k !== feat).map(k => { const c = byKey[k], s = story(k);
    return `<div class="cul-card"><button type="button" class="cul-open" data-ocon="${k}"><b>${esc(ar ? c.ar : c.latin)}</b><span class="cul-ar" lang="${ar ? 'en' : 'ar'}">${esc(ar ? c.latin : c.ar)}</span><span class="cul-st">${esc(cutText(s.title || s.seen, 70))}</span></button>${AG.btn({t: 'con', key: k, cul: cu.id}, lang, true)}</div>`; }).join('');
  return h + `</div></div>`;
}
// tonight, for the chosen place: when the Moon rises and sets, and the brightest stars and deep-sky objects that stand high during the tour
const COMPASS = {en: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], ar: ['الشمال', 'الشمال الشرقي', 'الشرق', 'الجنوب الشرقي', 'الجنوب', 'الجنوب الغربي', 'الغرب', 'الشمال الغربي']};
let TN_HAS = null;   // which stars and objects have their own card
function tonightMoreHTML(pl, st, Y, M, D, lang) {
  const ar = lang === 'ar', tz = pl.tz, hhmm = t => { const d = new Date(t + tz * 36e5); return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0'); };
  const malt = t => { const m = SKY.moon(t); return SKY.altaz(m.ra, m.dec, t, pl.lat, pl.lon).alt - 0.125; };   // 0.125°: the Moon's rim with refraction
  // Moon: rise and set between noon today and noon tomorrow
  const t0 = localUTC(Y, M, D, 12, tz), ev = []; let pa = malt(t0);
  for (let t = t0 + 6e5; t <= t0 + 864e5; t += 6e5) { const a = malt(t); if ((pa < 0) !== (a < 0)) ev.push([a > 0 ? 'rise' : 'set', t - 6e5 * a / (a - pa)]); pa = a; }
  const up0 = malt(t0) > 0;
  let moon = ev.map(([k, t]) => `<span>${k === 'rise' ? (ar ? 'شروق القمر' : 'Moonrise') : (ar ? 'غروب القمر' : 'Moonset')} <b><bdi dir="ltr">${hhmm(t)}</bdi></b>${t >= t0 + 432e5 ? (ar ? ' (صباح الغد)' : ' (tomorrow)') : ''}</span>`).join('');
  if (!ev.length) moon = `<span>${up0 ? (ar ? 'القمر فوق الأفق طوال الليل' : 'The Moon is up all night') : (ar ? 'القمر تحت الأفق طوال الليل' : 'The Moon stays below the horizon all night')}</span>`;
  // the middle of the tour
  const hm = s => { const [h, m] = String(s || '21:00').split(':').map(Number); return (h || 0) + (m || 0) / 60; };
  let a = hm(st.tourStart), b = hm(st.tourEnd); if (b <= a) b += 24; const tm = localUTC(Y, M, D, 0, tz) + ((a + b) / 2) * 36e5;
  if (!TN_HAS) { TN_HAS = {star: new Set(), dso: new Set()}; Object.keys(DATA.sci).forEach(k => (DATA.sci[k].parts || []).forEach(p => { p.stars.forEach(x => TN_HAS.star.add(x.name)); (p.dsos || []).forEach(x => TN_HAS.dso.add(x.id)); })); }
  const where = (ra, dec) => SKY.altaz(ra, dec, tm, pl.lat, pl.lon);
  const dir = az => COMPASS[ar ? 'ar' : 'en'][Math.round(az / 45) % 8];
  const item = (kind, ref, name, alt, az, extra) => { const txt = `<b>${name}</b><span class="tn-w">${ar ? 'نحو ' + dir(az) : dir(az)} · <bdi dir="ltr">${Math.round(alt)}°</bdi>${extra}</span>`;
    return `<li>${TN_HAS[kind].has(ref) ? `<button type="button" class="tn-go" data-tgo="${kind}" data-ref="${esc(ref)}">${txt}</button>` : `<span class="tn-go">${txt}</span>`}</li>`; };
  const stars = Object.values(CALP.stars).filter(s => s.name && s.vmag <= 2.1).map(s => ({s, p: where(s.ra, s.dec)})).filter(x => x.p.alt >= 25).sort((x, y) => x.s.vmag - y.s.vmag).slice(0, 5);
  const dsos = allDsos().map(({d}) => ({d, q: DSO_POS[d.id]})).filter(x => x.q && x.d.mag != null && x.d.mag <= 6.5).map(x => ({d: x.d, p: where(x.q[0], x.q[1])})).filter(x => x.p.alt >= 30).sort((x, y) => x.d.mag - y.d.mag)
    .filter((x, i, a) => { const base = (x.d.name || x.d.cat || '').replace(/\s*\(.*$/, ''); return a.findIndex(y => (y.d.name || y.d.cat || '').replace(/\s*\(.*$/, '') === base) === i; }).slice(0, 5);
  const sl = stars.map(({s, p}) => item('star', s.name, esc(ar ? (DATA.starAr[s.name] || s.name) : s.name), p.alt, p.az, '')).join('');
  const dl = dsos.map(({d, p}) => item('dso', d.id, `<bdi dir="ltr">${esc(d.name || d.cat)}</bdi>`, p.alt, p.az, d.name && d.cat ? ` · <bdi dir="ltr">${esc(d.cat)}</bdi>` : '')).join('');
  return `<div class="ah-more"><div class="tn-moon">${moon}</div>`
    + `<p class="tn-at muted">${ar ? `أعلى ما في السماء نحو الساعة <bdi dir="ltr">${hhmm(tm)}</bdi> (منتصف جولتك). الرقم هو الارتفاع فوق الأفق.` : `High in the sky at about <bdi dir="ltr">${hhmm(tm)}</bdi> (the middle of your tour). The number is the height above the horizon.`}</p>`
    + `<div class="tn-cols">${sl ? `<div><span class="sect-lbl">${ar ? 'ألمع النجوم' : 'Brightest stars'}</span><ul class="tn-list">${sl}</ul></div>` : ''}${dl ? `<div><span class="sect-lbl">${ar ? 'أجرام عميقة' : 'Deep-sky objects'}</span><ul class="tn-list">${dl}</ul></div>` : ''}</div></div>`;
}
function astroHubHTML(lang) {
  const ar = lang === 'ar';
  let h = `<div class="hub ahub${ar ? ' rtl' : ''}"${ar ? ' dir="rtl" lang="ar"' : ''} style="--cc:var(--accent)">`;
  h += `<div class="hub-top"><div class="eyebrow"><span class="dot"></span>${ar ? 'المرشد الفلكي' : 'AstroGuide'}</div><h2>${ar ? 'المرشد الفلكي' : 'AstroGuide'}${ar ? '' : ' <span class="arn2" lang="ar">المرشد الفلكي</span>'}</h2><p class="muted">${ar ? 'كل ما تحتاجه لليلة رصد: ما جمعته، والخطة، والتقويم.' : 'Everything for a night under the stars: what you gathered, the plan and the calendar.'}</p></div>`;
  // tonight
  let tonight = '';
  try { calInit(); const pl = placeObj(), st = CAL.st, d = new Date(Date.now() + pl.tz * 36e5), Y = d.getUTCFullYear(), M = d.getUTCMonth(), D = d.getUTCDate();
    const m = SKY.moon(localUTC(Y, M, D, 21, pl.tz));
    tonight = `<div class="ah-tonight">${moonIcon(m.illum, m.waxing, pl.lat < 0, 46)}<div class="ah-tn"><b>${ar ? 'الليلة' : 'Tonight'} · ${esc(fmtD(Date.UTC(Y, M, D), lang, {weekday: 'short', day: 'numeric', month: 'short'}))}</b>
      <span>${esc(ar ? (pl.ar || pl.en) : pl.en)} · ${ar ? 'الجولة' : 'tour'} <bdi dir="ltr">${esc(st.tourStart)}–${esc(st.tourEnd)}</bdi> · <span class="nw">${ar ? 'القمر' : 'Moon'} <bdi dir="ltr">${Math.round(m.illum * 100)}%</bdi></span></span></div>
      <button type="button" class="pbtn" data-astro="calendar">${ar ? 'غيّر المكان' : 'Change place'}</button></div>${WX.box(pl, Y, M, D, 'mini')}${tonightMoreHTML(pl, st, Y, M, D, lang)}`;
  } catch (e) {}
  // my night
  const l = AG.active(), pn = AG.plannable().length;
  let mn = `<div class="ah-night"><div class="ah-nh"><span class="sect-lbl">${ar ? `ليلتي · ${l.items.length}` : `My night · ${l.items.length} ${l.items.length === 1 ? 'pick' : 'picks'}`}</span><button type="button" class="ah-link" data-astro="guide">${ar ? 'افتحها' : 'Open'}</button></div>`;
  if (!l.items.length) mn += `<p class="muted ah-empty">${ar ? 'لم تضف شيئًا بعد. اضغط «+ ليلتي» على أي كوكبة أو قصة أو كوكب في «التراث والثقافة» و«العلم».' : 'Nothing added yet. Tap + My night on any constellation, story or planet in Heritage & Culture and Science.'}</p>`;
  else mn += `<ul class="ah-items">${l.items.slice(0, 6).map(it => { const inf = AG.info(it, lang); if (!inf) return ''; return `<li><span class="dot" style="background:${inf.color}"></span><b>${esc(inf.title)}</b><span class="ah-type">${esc(inf.type)}</span></li>`; }).join('')}</ul>${l.items.length > 6 ? `<p class="muted ah-more">${ar ? `و${l.items.length - 6} أخرى` : `and ${l.items.length - 6} more`}</p>` : ''}`;
  if (pn) mn += `<button type="button" class="pbtn main ah-plan" data-astroplan>${ar ? `خطّط لليلة بهذه (${pn}) ←` : `Plan a night with these (${pn}) →`}</button>`;
  mn += `</div>`;
  const card = (id, cls, icon, t, d) => `<button type="button" class="ah-card ${cls}" data-astro="${id}"><svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icon}</svg><b>${t}</b><span>${d}</span></button>`;
  h += `<div class="ah-grid"><div class="ah-left">${tonight ? `<div class="ah-box">${tonight}</div>` : ''}${mn}</div><div class="ah-right">`
    + card('plan', 'gold', '<path d="M4 18l5-6 4 3 7-9"/><circle cx="20" cy="6" r="1.4"/>', ar ? 'خطّط لليلتك' : 'Plan a night', ar ? 'حوّل اختياراتك إلى جولة خطوة بخطوة' : 'Turn your picks into a step-by-step tour')
    + card('calendar', '', '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>', ar ? 'تقويم السماء' : 'Sky calendar', ar ? 'القمر والكواكب والأحداث، شهرًا بشهر' : 'The Moon, planets and events, month by month')
    + `<div class="ah-chips"><button type="button" class="sn" data-astro="guide" style="--cc:var(--accent)">✦ ${ar ? 'ليلتي' : 'My night'}</button><button type="button" class="sn" data-astro="quiz" style="--cc:var(--accent)">${ar ? 'اختبر معلوماتك' : 'Quiz'}</button><button type="button" class="sn" data-astro="learn" style="--cc:var(--accent)">${ar ? 'للمرشدين' : 'For guides'}</button></div>`
    + `</div></div>`;
  return h + `</div>`;
}
document.addEventListener('click', ev => {
  if (!ev.target.closest) return;
  const o = ev.target.closest('[data-ocon]'); if (o) { state.con = o.dataset.ocon; buildList(document.getElementById('q').value); render(); window.scrollTo({top: 0}); return; }
  const tg = ev.target.closest('[data-tgo]'); if (tg) { SEARCH.goTo(tg.dataset.tgo, tg.dataset.ref); return; }
  const a = ev.target.closest('[data-astro]'); if (a) { setCulture(a.dataset.astro); window.scrollTo({top: 0}); return; }
  if (ev.target.closest('[data-astroplan]')) { PLAN.seed(AG.plannable()); setCulture('plan'); window.scrollTo({top: 0}); }
});
