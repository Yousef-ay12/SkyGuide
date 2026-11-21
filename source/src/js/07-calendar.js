/* ---------- Sky calendar ---------- */
const CALT = {
  en: {title: 'Sky calendar', place: 'Place', sky: 'Sky', month: 'Month', dark: 'Dark countryside', sub: 'Suburbs', city: 'City',
       best: 'Constellations at their best this month', bestNote: 'Highest in the sky at about 9 pm local time. Tap one to open its science page.',
       never: 'Best this month, but they never rise from here', low: 'low', planets: 'Planets', keyDates: 'Key planet dates in the next 12 months',
       moon: 'The Moon this month', see: 'How much of each constellation can you see?', time: 'Time', t21: 'Evening (9 pm)', t24: 'Midnight', t04: 'Before dawn (4 am)',
       noRise: 'Never rises here', evening: 'Evening sky', morning: 'Morning sky', allnight: 'Up most of the night', close: 'Too close to the Sun to see',
       inCon: 'in', bright: 'brightness', toSee: 'To see it', stars: 'stars', of: 'of'},
  ar: {title: 'تقويم السماء', place: 'المكان', sky: 'السماء', month: 'الشهر', dark: 'ريف مظلم', sub: 'ضواحي المدن', city: 'داخل المدينة',
       best: 'الكوكبات في أحسن مواضعها هذا الشهر', bestNote: 'في أعلى السماء نحو التاسعة مساءً بالتوقيت المحلي. اضغط على أي منها لفتح صفحتها العلمية.',
       never: 'في أحسن مواضعها هذا الشهر لكنها لا تطلع أبدًا من هنا', low: 'منخفضة', planets: 'الكواكب', keyDates: 'أهم مواعيد الكواكب في الأشهر الاثني عشر القادمة',
       moon: 'القمر هذا الشهر', see: 'كم ترى من كل كوكبة؟', time: 'الوقت', t21: 'المساء (التاسعة)', t24: 'منتصف الليل', t04: 'قبيل الفجر (الرابعة)',
       noRise: 'لا تطلع هنا أبدًا', evening: 'في سماء المساء', morning: 'في سماء الصباح', allnight: 'ظاهر معظم الليل', close: 'قريب جدًا من الشمس فلا يُرى',
       inCon: 'في', bright: 'اللمعان', toSee: 'لرؤيته', stars: 'نجمًا', of: 'من'}
};
const PLANETS = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
const DIRS = {en: ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'], ar: ['الشمال', 'الشمال الشرقي', 'الشرق', 'الجنوب الشرقي', 'الجنوب', 'الجنوب الغربي', 'الغرب', 'الشمال الغربي']};
const dirOf = (az, lang) => DIRS[lang][Math.round(az / 45) % 8];
let CAL = null;  // built lazily
function calInit() {
  if (CAL) return CAL;
  const iau = {};
  Object.entries(DATA.sci).forEach(([key, v]) => (v.parts || []).forEach(p => { iau[p.abbr] = {key, name: p.name, ar: p.ar, vis: p.vis}; }));
  const grid = CALD.grid.map(row => { const a = []; row.forEach(([v, n]) => { for (let i = 0; i < n; i++) a.push(v); }); return a; });
  const st = {place: 'Johannesburg', month: null, day: null, bortle: 4, sqm: '', tourStart: '19:30', tourEnd: '22:30', culture: 'all', open: false,
              k: VIS.DEFAULTS.k, guestPenalty: VIS.DEFAULTS.guestPenalty, passMargin: VIS.DEFAULTS.passMargin, stackMargins: false, minCoreAlt: VIS.DEFAULTS.minCoreAlt};
  try { const s = JSON.parse(localStorage.getItem('osms-cal') || '{}'); ['place', 'bortle', 'sqm', 'tourStart', 'tourEnd', 'culture', 'k', 'guestPenalty', 'passMargin', 'stackMargins', 'minCoreAlt'].forEach(x => { if (s[x] !== undefined && s[x] !== null) st[x] = s[x]; }); } catch (e) {}
  CAL = {iau, grid, st, events: null};
  return CAL;
}
function calSave() { try { const {month, day, open, ...keep} = CAL.st; localStorage.setItem('osms-cal', JSON.stringify(keep)); } catch (e) {} }
function placeObj() { calInit(); return CALD.places.find(p => p.en === CAL.st.place) || CALD.places[0]; }
function conAt(ra, dec) {
  const i = Math.round(dec - CALD.gridDec0); if (i < 0 || i >= CAL.grid.length) return null;
  const row = CAL.grid[i]; const ab = CALD.cons[row[Math.floor(SKY.norm(ra) / 0.5) % row.length]];
  return CAL.iau[ab] ? {ab, ...CAL.iau[ab]} : {ab, name: ab, ar: ab};
}
const localUTC = (y, m, d, h, tz) => Date.UTC(y, m, d, 0, 0) + (h - tz) * 36e5;
const DATE_FMT = new Map();   // making a date formatter is slow, so keep one per language and style
function fmtD(t, lang, opt = {day: 'numeric', month: 'long'}) {
  const key = lang + JSON.stringify(opt);
  if (!DATE_FMT.has(key)) DATE_FMT.set(key, new Intl.DateTimeFormat(lang === 'ar' ? 'ar-u-nu-latn' : 'en-GB', {...opt, timeZone: 'UTC'}));
  return DATE_FMT.get(key).format(new Date(t));
}
const SUN_EVENTS = new Map();   // the same night and place is asked for many times while a page is built
function sunEvents(y, m, d, pl) {
  // local sunset and next sunrise (ms UTC), scanning in 5-minute steps; null in polar day/night
  const key = `${y}-${m}-${d}|${pl.lat}|${pl.lon}|${pl.tz}`;
  if (SUN_EVENTS.has(key)) return SUN_EVENTS.get(key);
  let set = null, rise = null, prev = null;
  for (let h = 12; h <= 36; h += 1 / 12) {
    const t = localUTC(y, m, d, h, pl.tz), s = SKY.sun(t), a = SKY.altaz(s.ra, s.dec, t, pl.lat, pl.lon).alt;
    if (prev !== null) { if (prev > -0.83 && a <= -0.83 && !set) set = t; if (prev < -0.83 && a >= -0.83 && set && !rise) rise = t; }
    prev = a;
  }
  const r = {set, rise};
  SUN_EVENTS.set(key, r);
  return r;
}
function planetInfo(p, t, pl, lang) {
  const q = SKY.planet(p, t), c = conAt(q.ra, q.dec);
  const d = new Date(t + pl.tz * 36e5), se = sunEvents(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), pl);
  let where = 'close', when = null;
  const lim = p === 'mercury' ? 12 : p === 'venus' ? 10 : 15;
  if (q.elon > lim) {
    if (q.elon > 140) where = 'allnight'; else where = q.east ? 'evening' : 'morning';
    const tt = where === 'morning' ? (se.rise ? se.rise - 36e5 : null) : where === 'evening' ? (se.set ? se.set + 45 * 6e4 : null) : (se.set ? se.set + 4 * 36e5 : null);
    if (tt) { const h = SKY.altaz(q.ra, q.dec, tt, pl.lat, pl.lon); when = {t: tt, alt: h.alt, az: h.az}; if (h.alt < 3 && where !== 'allnight') where = 'close'; }
  }
  return {p, q, c, where, when};
}
function calEvents() {
  if (CAL.events) return CAL.events;
  const now = Date.now(), t0 = Date.UTC(new Date(now).getUTCFullYear(), new Date(now).getUTCMonth(), new Date(now).getUTCDate()) - 2 * 864e5, t1 = t0 + 368 * 864e5, ev = [];
  PLANETS.forEach(p => {
    let a = null, b = null;
    for (let t = t0; t < t1; t += 864e5) {
      const q = SKY.planet(p, t);
      if (a && b && b.elon > a.elon && b.elon > q.elon) {
        if (p === 'mercury' || p === 'venus') ev.push({p, t: t - 864e5, k: b.east ? 'gee' : 'gwe', elon: b.elon, mag: b.mag});
        else ev.push({p, t: t - 864e5, k: 'opp', mag: b.mag});
      }
      if (a && b && b.elon < a.elon && b.elon < q.elon) ev.push({p, t: t - 864e5, k: 'conj'});
      a = b; b = q;
    }
  });
  CAL.events = ev.sort((x, y) => x.t - y.t);
  return CAL.events;
}
function moonIcon(illum, waxing, south, size = 26) {
  const r = 10, rx = Math.abs(1 - 2 * illum) * r;
  let right = waxing; if (south) right = !right;
  const s = right ? 1 : -1;
  const d = `M0,${-r} A${r},${r} 0 0 ${right ? 1 : 0} 0,${r} A${rx},${r} 0 0 ${(illum < 0.5) === right ? 0 : 1} 0,${-r}Z`;
  return `<svg class="mi" viewBox="-12 -12 24 24" width="${size}" height="${size}" aria-hidden="true"><circle r="${r}" class="mi-d"/><path d="${d}" class="mi-l"/></svg>`;
}
function calHTML(lang) {
  calInit();
  const ar = lang === 'ar', T = CALT[lang], st = CAL.st, pl = placeObj();
  const now = new Date(Date.now() + pl.tz * 36e5);
  const months = []; for (let i = 0; i < 12; i++) { const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1)); months.push([d.getUTCFullYear(), d.getUTCMonth()]); }
  if (!st.month) st.month = months[0].join('-');
  const [Y, M] = st.month.split('-').map(Number);
  const dim = new Date(Date.UTC(Y, M + 1, 0)).getUTCDate();
  if (!st.day || st.day > dim) st.day = (Y === now.getUTCFullYear() && M === now.getUTCMonth()) ? now.getUTCDate() : 15;
  const pname = p => ar ? p.ar : p.en;
  // controls
  const regions = [...new Set(CALD.places.map(p => p.r))];
  let h = `<div class="calc${ar ? ' rtl' : ''}"${ar ? ' dir="rtl" lang="ar"' : ''}>`;
  h += `<div class="cal-ctl"><label>${T.place}<select id="cal-place">${regions.map(r => `<optgroup label="${esc(ar ? CALD.regionsAr[r] : r)}">${CALD.places.filter(p => p.r === r).map(p => `<option value="${esc(p.en)}"${p.en === st.place ? ' selected' : ''}>${esc(pname(p))}</option>`).join('')}</optgroup>`).join('')}</select></label>`;
  const BN = {en: ['', 'excellent dark site', 'truly dark site', 'rural sky', 'rural/suburban edge', 'suburban', 'bright suburban', 'suburban/urban edge', 'city', 'inner city'],
              ar: ['', 'موقع مظلم ممتاز', 'موقع مظلم حقًا', 'سماء ريفية', 'حافة الريف والضواحي', 'ضواحي', 'ضواحي ساطعة', 'حافة الضواحي والمدينة', 'مدينة', 'وسط المدينة']}[lang];
  h += `<label>${ar ? 'السماء (مقياس بورتل)' : 'Sky (Bortle class)'}<select id="cal-bortle">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(b => `<option value="${b}"${+st.bortle === b ? ' selected' : ''}>${b} · ${BN[b]}</option>`).join('')}</select></label>`;
  h += `<label>${ar ? 'أو قراءة SQM' : 'or SQM reading'}<input id="cal-sqm" type="number" step="0.01" min="16" max="22.5" inputmode="decimal" placeholder="${ar ? 'مثلًا 21.5' : 'e.g. 21.5'}" value="${esc(String(st.sqm ?? ''))}"></label>`;
  h += `<label>${T.month}<select id="cal-month">${months.map(([y, m]) => `<option value="${y}-${m}"${`${y}-${m}` === st.month ? ' selected' : ''}>${MONTHS[lang][m]} ${y}</option>`).join('')}</select></label></div>`;
  h += `<p class="muted cal-where">${ar ? `السماء من ${pname(pl)} (${latTxt(Math.round(pl.lat), true)})، والأوقات بالتوقيت المحلي القياسي دون التوقيت الصيفي.` : `The sky from ${pname(pl)} (${latTxt(Math.round(pl.lat))}). Times are local standard time, without daylight saving.`}</p>`;

  // 1. constellations of the month
  const best = Object.entries(CAL.iau).filter(([ab, v]) => v.vis.month === M).map(([ab, v]) => ({ab, ...v, alt: Math.round(90 - Math.abs(pl.lat - v.vis.dec))})).sort((a, b) => b.alt - a.alt);
  const up = best.filter(b => b.alt > 0), down = best.filter(b => b.alt <= 0);
  h += `<section class="cal-sec"><h3>${T.best}</h3><p class="muted">${T.bestNote}</p><div class="links">${up.map(b => `<button type="button" data-sci="${b.key}" style="--cc:var(--c-science)"><span class="dot"></span>${esc(ar ? b.ar : b.name)} <span class="vref">${b.alt}°${b.alt < 20 ? ' · ' + T.low : ''}</span></button>`).join('')}</div>`;
  if (down.length) h += `<p class="muted" style="margin:12px 0 4px">${T.never}:</p><div class="links">${down.map(b => `<button type="button" data-sci="${b.key}" style="--cc:var(--line)"><span class="dot"></span>${esc(ar ? b.ar : b.name)}</button>`).join('')}</div>`;
  h += `</section>`;

  // 2. planets on the chosen day
  const tDay = localUTC(Y, M, st.day, 21, pl.tz);
  const bodies = Object.fromEntries(DATA.sci.SOL.bodies.map(b => [b.id, b]));
  h += `<section class="cal-sec"><h3>${T.planets} · ${fmtD(Date.UTC(Y, M, st.day), lang, {day: 'numeric', month: 'long', year: 'numeric'})}</h3><div class="plg">`;
  PLANETS.forEach(p => {
    const I = planetInfo(p, tDay, pl, lang), b = bodies[p];
    let w = T[I.where];
    if (I.when && I.where !== 'close') {
      const tm = new Date(I.when.t + pl.tz * 36e5), hh = String(tm.getUTCHours()).padStart(2, '0') + ':' + String(tm.getUTCMinutes()).padStart(2, '0');
      w += ar ? `: نحو ${Math.round(I.when.alt)}° فوق أفق ${dirOf(I.when.az, 'ar')} الساعة ${hh}` : `: about ${Math.round(I.when.alt)}° up in the ${dirOf(I.when.az, 'en')} at ${hh}`;
    }
    const sc = scopeFor(I.q.mag);
    h += `<article class="plc" style="--pc:${b.color}"><h4><span class="pd" aria-hidden="true"></span>${esc(ar ? b.ar : b.en)}${AG.btn({t: 'planet', key: 'SOL', ref: p}, lang, true)}${swBtn(p[0].toUpperCase() + p.slice(1), 4, lang, I.when ? I.when.t : 0)}</h4><p>${esc(w)}</p>`;
    h += `<p class="muted">${I.c ? `${T.inCon} ${esc(ar ? I.c.ar : I.c.name)} · ` : ''}${T.bright} <bdi dir="ltr">${I.q.mag.toFixed(1)}</bdi> · ${T.toSee}: ${esc(sc[lang])}</p></article>`;
  });
  h += `</div>`;
  // year at a glance
  const YG = {evening: ['Evening', 'مساءً', 'ye'], morning: ['Morning', 'صباحًا', 'ym'], allnight: ['All night', 'طوال الليل', 'ya'], close: ['—', '—', 'yc']};
  h += `<h4 class="yh">${ar ? 'الكواكب على مدار السنة' : 'The planets through the year'}</h4><div class="ytab-w"><table class="ytab"><thead><tr><th></th>${months.map(([y, m]) => `<th>${MONTHS[lang][m].slice(0, ar ? 20 : 3)}</th>`).join('')}</tr></thead><tbody>`;
  PLANETS.forEach(p => {
    h += `<tr><th>${esc(ar ? bodies[p].ar : bodies[p].en)}</th>`;
    months.forEach(([y, m]) => {
      let I = null;
      for (const dd of [3, 9, 15, 21, 27]) { const J = planetInfo(p, localUTC(y, m, dd, 21, pl.tz), pl, lang); if (!I || (I.where === 'close' && J.where !== 'close') || (J.where !== 'close' && J.when && I.when && J.when.alt > I.when.alt && I.where !== 'allnight')) I = J; }
      const g = YG[I.where]; h += `<td class="${g[2]}${y === Y && m === M ? ' cur' : ''}">${g[ar ? 1 : 0]}</td>`; });
    h += `</tr>`;
  });
  h += `</tbody></table></div><p class="muted" style="font-size:15px">${ar ? 'أفضل ظهور في كل شهر. «مساءً» بعد الغروب، و«صباحًا» قبل الشروق، و«طوال الليل» قرب التقابل، و«—» قريب جدًا من الشمس.' : 'The best showing in each month. Evening means after sunset, Morning before sunrise, All night around opposition, and — too close to the Sun.'}</p>`;
  // key dates
  const EVT = {opp: ['at opposition: closest and brightest, up all night', 'في التقابل: أقرب ما يكون وألمع، ويبقى ظاهرًا طوال الليل'],
               gee: ['greatest distance east of the Sun: best in the evening sky', 'أقصى استطالة شرقية: أفضل رؤية في سماء المساء'],
               gwe: ['greatest distance west of the Sun: best in the morning sky', 'أقصى استطالة غربية: أفضل رؤية في سماء الصباح'],
               conj: ['passes behind or in front of the Sun: not visible for a few weeks', 'يمر خلف الشمس أو أمامها: لا يُرى بضعة أسابيع']};
  const evs = calEvents();
  h += `<details class="keyd"><summary>${T.keyDates}</summary><ul class="facts">${evs.map(e => `<li${new Date(e.t).getUTCMonth() === M && new Date(e.t).getUTCFullYear() === Y ? ' class="hl"' : ''}><b>${fmtD(e.t, lang, {day: 'numeric', month: 'long', year: 'numeric'})}</b> · ${esc(ar ? bodies[e.p].ar : bodies[e.p].en)} ${esc(EVT[e.k][ar ? 1 : 0])}${e.elon ? ` (${Math.round(e.elon)}°)` : ''}</li>`).join('')}</ul></details></section>`;

  // 3. Moon calendar
  const south = pl.lat < 0, ph = SKY.phases(Date.UTC(Y, M, 1) - pl.tz * 36e5, Date.UTC(Y, M + 1, 1) - pl.tz * 36e5);
  const PH = {en: ['New moon', 'First quarter', 'Full moon', 'Last quarter'], ar: ['المحاق', 'التربيع الأول', 'البدر', 'التربيع الأخير']}[lang];
  h += `<section class="cal-sec"><h3>${T.moon}</h3><p>${ph.map(p => { const lt = new Date(p.t + pl.tz * 36e5); return `<b>${PH[p.k]}</b> ${fmtD(lt.getTime(), lang)} ${String(lt.getUTCHours()).padStart(2, '0')}:${String(lt.getUTCMinutes()).padStart(2, '0')}`; }).join(' · ')}</p>`;
  const first = new Date(Date.UTC(Y, M, 1)).getUTCDay();
  const WD = {en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], ar: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']}[lang];
  h += `<div class="mgrid">${WD.map(w => `<div class="wd">${w}</div>`).join('')}${'<div></div>'.repeat(first)}`;
  for (let d = 1; d <= dim; d++) {
    const t = localUTC(Y, M, d, 21, pl.tz), m = SKY.moon(t), c = conAt(m.ra, m.dec);
    h += `<button type="button" class="md${d === st.day ? ' on' : ''}" data-day="${d}" title="${esc(c ? (ar ? c.ar : c.name) : '')}"><span class="dn">${d}</span>${moonIcon(m.illum, m.waxing, south)}<span class="mp">${Math.round(m.illum * 100)}%</span><span class="mc">${esc(c ? (ar ? c.ar : c.name) : '')}</span></button>`;
  }
  h += `</div><p class="muted" style="font-size:15px">${ar ? 'لكل يوم: طور القمر ونسبة المضاء منه، والكوكبة التي يكون فيها نحو التاسعة مساءً. اضغط يومًا لتحديث الكواكب والجدول أدناه.' : 'For each day: the Moon\'s phase, how much of it is lit, and the constellation it is in at about 9 pm. Tap a day to update the planets and the table below.'}${south ? (ar ? ' الأشكال مرسومة كما تُرى من نصف الكرة الجنوبي.' : ' The shapes are drawn as seen from the Southern Hemisphere.') : ''}</p></section>`;

  // 4. tour planner: which patterns can guests recognise?
  h += tourHTML(lang, Y, M, st.day, pl);
  h += `<p class="vref" style="white-space:normal">${ar ? 'المواقع محسوبة بمعادلات تقريبية (دقة نحو درجة واحدة للكواكب، وبضع ساعات لأطوار القمر). النجوم من فهرس HYG، والكواكب من عناصر المدارات التقريبية لمختبر الدفع النفاث (JPL).' : 'Positions are worked out with approximate formulas (about 1° for the planets, a few hours for the Moon\'s phases). Stars from the HYG catalogue; planets from JPL\'s approximate orbital elements.'}</p>`;
  return h + `</div>`;
}
function calBind(card) {
  const st = CAL.st;
  const on = (id, f) => { const el = card.querySelector('#' + id); if (el) el.addEventListener('change', () => { f(el.value); calSave(); render(); }); };
  on('cal-place', v => { st.place = v; const P = CALD.places.find(p => p.en === v); if (P && (P.bortle || P.bortle_est)) { st.bortle = P.bortle || P.bortle_est; st.sqm = ''; } });
  on('cal-bortle', v => { st.bortle = +v; st.sqm = ''; });
  on('cal-sqm', v => { st.sqm = v; });
  on('cal-month', v => { st.month = v; st.day = null; });
  on('tp-start', v => { if (v) st.tourStart = v; });
  on('tp-end', v => { if (v) st.tourEnd = v; });
  on('tp-cul', v => { st.culture = v; });
  ['k', 'guestPenalty', 'passMargin', 'minCoreAlt'].forEach(x => on('tp-' + x, v => { const n = parseFloat(v); if (!isNaN(n)) st[x] = n; }));
  const sm = card.querySelector('#tp-stack'); if (sm) sm.addEventListener('change', () => { st.stackMargins = sm.checked; calSave(); render(); });
  const adv = card.querySelector('#tp-adv'); if (adv) adv.addEventListener('toggle', () => { st.open = adv.open; });
  card.querySelectorAll('[data-day]').forEach(b => b.addEventListener('click', () => { st.day = +b.dataset.day; render(); }));
  card.querySelectorAll('[data-sci]').forEach(b => b.addEventListener('click', () => { state.con = b.dataset.sci; setCulture('science'); window.scrollTo({top: 0, behavior: 'smooth'}); }));
}

const CULT_LBL = {iau: ['IAU constellation', 'كوكبة دولية'], asterism: ['Asterism', 'نجمية'], arab: ['Arab', 'عربية'], safrica: ['Southern African', 'من جنوب أفريقيا'],
                  chinese: ['Chinese', 'صينية'], greek: ['Greek', 'إغريقية'], maori: ['Māori', 'ماورية']};
function hhmm(t, tz) { const d = new Date(t + tz * 36e5); return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0'); }
function tourRow(r, byId_p, lang, pl) {
  const ar = lang === 'ar', st = CAL.st;
  const REASON = {twilight: ['the sky is not dark enough during the tour', 'السماء غير مظلمة بما يكفي خلال الجولة'], low: ['too low: not all core stars get above ' + st.minCoreAlt + '°', 'منخفض: لا ترتفع كل النجوم الأساسية فوق ' + st.minCoreAlt + '°'], faint: ['too faint tonight', 'أخفت من أن يُرى الليلة']};
  const p = byId_p, c = CULT_LBL[p.culture], key = CAL.iau[p.refCon] ? CAL.iau[p.refCon].key : null;
    let x = `<article class="tpr${r.pass ? ' ok' : ''}"><div class="tph"><span class="tps">${r.pass ? (ar ? '✓ ينجح' : '✓ Pass') : (ar ? '✗ لا' : '✗ Fail')}</span><b>${esc(ar ? p.nameAr : p.name)}</b> <span class="vref">${c[ar ? 1 : 0]}</span>${key ? AG.btn({t: 'pat', key, ref: p.id}, lang, true) : ''}</div><p>`;
    if (r.pass && r.window.start === r.window.end) x += ar ? `نحو ${hhmm(r.window.peak, pl.tz)} فقط. ` : `Only around ${hhmm(r.window.peak, pl.tz)}. `;
    else if (r.pass) x += ar ? `أفضل وقت: ${hhmm(r.window.start, pl.tz)}–${hhmm(r.window.end, pl.tz)} (الأفضل ${hhmm(r.window.peak, pl.tz)}). ` : `Best window: ${hhmm(r.window.start, pl.tz)}–${hhmm(r.window.end, pl.tz)} (best at ${hhmm(r.window.peak, pl.tz)}). `;
    else x += (REASON[r.reason] ? REASON[r.reason][ar ? 1 : 0] : '') + '. ';
    x += ar ? `الكلفة الأساسية <bdi dir="ltr">${r.coreCost.toFixed(2)}</bdi> (${esc(r.faintest.name)}) مقابل الميزانية <bdi dir="ltr">${r.budget.toFixed(2)}</bdi>` : `Core cost ${r.coreCost.toFixed(2)} (${esc(r.faintest.name)}) vs budget ${r.budget.toFixed(2)}`;
    x += r.reason === 'low' ? (ar ? `، وأخفض نجم أساسي على ${Math.round(r.minAlt)}°.` : `; lowest core star at ${Math.round(r.minAlt)}°.`) : '.';
    x += ' ' + (r.fullVisible ? (ar ? 'والشكل الكامل ظاهر أيضًا.' : 'The full figure is visible too.') : (ar ? 'الشكل الكامل لن يُرى كله.' : 'The full figure will not all be visible.'));
    if (r.variable.length) x += ` <span class="vref" style="white-space:normal">${ar ? 'نجم متغيّر: ' : 'Variable star: '}${esc(r.variable.join(', '))}</span>`;
    if (!p.coreCurated) x += ` <span class="vref" style="white-space:normal">${ar ? '(الشكل الأساسي = الشكل الكامل)' : '(core shape = whole figure)'}</span>`;
    x += `</p>${key ? `<button type="button" class="tpl" data-sci="${key}">${ar ? 'الصفحة العلمية' : 'Science page'} →</button>` : ''}</article>`;
    return x;
}
function tourHTML(lang, Y, M, D, pl) {
  const ar = lang === 'ar', st = CAL.st;
  const S = {lat: pl.lat, lon: pl.lon, tz: pl.tz, bortle: st.bortle, sqm: st.sqm, tourStart: st.tourStart, tourEnd: st.tourEnd,
             k: st.k, guestPenalty: st.guestPenalty, passMargin: st.passMargin, stackMargins: st.stackMargins, minCoreAlt: st.minCoreAlt};
  const pats = CALP.patterns.filter(p => st.culture === 'all' || p.culture === st.culture);
  const R = VIS.rankPatterns(pats, S, Y, M, D, CALP.stars);
  const sqm = (S.sqm !== '' && S.sqm != null && !isNaN(+S.sqm)) ? +S.sqm : VIS.sqmFromBortle(S.bortle);
  const mid = R.ctx[Math.floor(R.ctx.length / 2)], req = VIS.required(R.settings);
  const byId = Object.fromEntries(CALP.patterns.map(p => [p.id, p]));
  let h = `<section class="cal-sec"><h3>${ar ? 'مخطط الجولة: أي الأشكال يستطيع الضيوف تمييزها الليلة؟' : 'Tour planner: which patterns can guests recognise tonight?'}</h3>`;
  h += `<p class="muted">${ar ? 'لكل شكل نجمي: «الكلفة» هي قدر أخفت نجم في شكله الأساسي بعد خفوته قرب الأفق، و«الميزانية» هي أخفت ما تراه العين الليلة عند ذلك النجم ناقص هامش الضيوف. ينجح الشكل إذا كانت كلفته ضمن الميزانية وكانت كل نجومه الأساسية أعلى من ' + st.minCoreAlt + '° في وقت ما من الجولة.' : 'For each pattern, the cost is the magnitude of the faintest star in its core shape, after dimming near the horizon. The budget is the faintest star the eye can see tonight at that spot, minus the guest margin. A pattern passes when its cost is within budget and every core star is above ' + st.minCoreAlt + '° at some point in the tour.'}</p>`;
  h += `<div class="cal-ctl"><label>${ar ? 'بداية الجولة' : 'Tour starts'}<input id="tp-start" type="time" value="${esc(st.tourStart)}"></label><label>${ar ? 'نهاية الجولة' : 'Tour ends'}<input id="tp-end" type="time" value="${esc(st.tourEnd)}"></label>`;
  h += `<label>${ar ? 'الأشكال' : 'Patterns'}<select id="tp-cul"><option value="all">${ar ? 'الكل' : 'All'}</option>${Object.entries(CULT_LBL).map(([k, v]) => `<option value="${k}"${st.culture === k ? ' selected' : ''}>${v[ar ? 1 : 0]}</option>`).join('')}</select></label></div>`;
  h += `<details id="tp-adv"${st.open ? ' open' : ''} class="keyd"><summary>${ar ? 'إعدادات متقدمة' : 'Advanced settings'}</summary><div class="cal-ctl" style="margin-top:8px">`;
  const num = (id, lbl, v, step) => `<label>${lbl}<input id="tp-${id}" type="number" step="${step}" value="${v}" inputmode="decimal" style="width:7em"></label>`;
  h += num('k', ar ? 'معامل الخفوت الجوي (قدر/كتلة هوائية)' : 'Extinction k (mag/airmass)', st.k, 0.01) + num('guestPenalty', ar ? 'هامش الضيوف (قدر)' : 'Guest penalty (mag)', st.guestPenalty, 0.05)
     + num('passMargin', ar ? 'هامش النجاح (قدر)' : 'Pass margin (mag)', st.passMargin, 0.05) + num('minCoreAlt', ar ? 'أدنى ارتفاع للنجوم الأساسية (°)' : 'Lowest core altitude (°)', st.minCoreAlt, 1);
  h += `<label style="flex-direction:row;align-items:center;gap:8px"><input id="tp-stack" type="checkbox"${st.stackMargins ? ' checked' : ''}> ${ar ? 'جمع الهامشين (أكثر تشددًا)' : 'Stack both margins (stricter)'}</label></div>`;
  h += `<p class="vref" style="white-space:normal">${ar ? `الهامش المطبّق: ${req.toFixed(2)} قدر (${st.stackMargins ? 'مجموع الهامشين' : 'الأكبر من الهامشين، فهامش النجاح يتضمن هامش الضيوف'}). الشفق: تُستبعد الأوقات التي تكون فيها الشمس أعلى من 12° تحت الأفق.` : `Margin applied: ${req.toFixed(2)} mag (${st.stackMargins ? 'both margins added' : 'the larger of the two: the pass margin includes the guest penalty'}). Twilight: times when the Sun is higher than 12° below the horizon are left out.`}</p></details>`;
  h += `<p>${ar
    ? `${fmtD(Date.UTC(Y, M, D), 'ar', {weekday: 'long', day: 'numeric', month: 'long'})}، من ${st.tourStart} إلى ${st.tourEnd}: سطوع السماء المظلمة ${sqm.toFixed(2)} قدر/ثانية قوسية² (أخفت نجم عند سمت الرأس دون القمر نحو <bdi dir="ltr">${VIS.nelmFromSqm(sqm).toFixed(1)}</bdi>). القمر مضاء ${Math.round(mid.moon.illum * 100)}% و${mid.moon.alt > 0 ? `على ارتفاع ${Math.round(mid.moon.alt)}°` : 'تحت الأفق'} في منتصف الجولة.`
    : `${fmtD(Date.UTC(Y, M, D), 'en', {weekday: 'long', day: 'numeric', month: 'long'})}, ${st.tourStart} to ${st.tourEnd}: dark-sky brightness ${sqm.toFixed(2)} mag/arcsec² (faintest star overhead without the Moon about ${VIS.nelmFromSqm(sqm).toFixed(1)}). The Moon is ${Math.round(mid.moon.illum * 100)}% lit and ${mid.moon.alt > 0 ? `${Math.round(mid.moon.alt)}° up` : 'below the horizon'} in the middle of the tour.`}</p>`;
  const pass = R.results.filter(r => r.pass), fail = R.results.filter(r => !r.pass);
  const row = r => tourRow(r, byId[r.id], lang, pl);
  h += `<span class="sci-sub">${ar ? `ينجح الليلة (${pass.length})` : `Recognisable tonight (${pass.length})`}</span><div class="tpl-list">${pass.map(row).join('') || `<p class="muted">${ar ? 'لا شيء ينجح بهذه الشروط.' : 'Nothing passes under these conditions.'}</p>`}</div>`;
  h += `<details class="keyd"><summary>${ar ? `لا يُميَّز الليلة (${fail.length})` : `Not recognisable tonight (${fail.length})`}</summary><div class="tpl-list">${fail.map(row).join('')}</div></details>`;
  h += `<p class="vref" style="white-space:normal;margin-top:10px">${linkText(ar ? 'النماذج: تحويل SQM إلى أخفت قدر مرئي بمعادلة شيفر (Unihedron)؛ ضوء القمر والكتلة الهوائية بنموذج كريسيونس وشيفر (1991)؛ أقدار النجوم من فهرس HYG 4.1 (هيباركوس)، مع جمع لمعان النجوم المزدوجة الأقرب من دقيقة قوسية.' : 'Models: SQM to limiting magnitude by Schaefer\'s formula (as published by Unihedron); moonlight and airmass by Krisciunas & Schaefer (1991); star magnitudes from the HYG 4.1 catalogue (Hipparcos), with doubles closer than 1 arcminute combined.')}</p></section>`;
  return h;
}

