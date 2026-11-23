/* ---------- Weather for the night: ECMWF forecast (IFS 9 km) through Open-Meteo, for any place in the list ---------- */
// A page asks for the weather by including <div class="wx" data-wx="lat,lon,tz,Y,M,D,mode">; this module notices it and fills it in.
// Forecasts are kept on the device for an hour (and shown, with their time, when there is no internet).
const WX = (() => {
  const API = 'https://api.open-meteo.com/v1/forecast';
  const VARS = 'cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,precipitation,precipitation_probability,temperature_2m,dew_point_2m,relative_humidity_2m,wind_speed_10m,wind_gusts_10m';
  const FRESH = 3600e3, KEY = 'osms-wx', DAYS = 15;
  const mem = {}, wait = {};
  const T = {
    en: {h: 'Weather for the night', load: 'Getting the forecast…', clear: 'Clear', most: 'Mostly clear', part: 'Partly cloudy', cloudy: 'Cloudy',
      good: 'Good night for stargazing', fair: 'Fair: gaps in the clouds', poor: 'Poor: too cloudy', wet: 'Rain likely', windy: 'Very windy',
      best: 'Clearest', none: 'No clear hours', moon: 'A bright Moon will wash out faint objects', dew: 'Dew likely: cover lenses and mirrors',
      far: 'Forecasts reach about 15 days ahead. Check again closer to the night.', past: 'This night has passed.', unsure: 'More than a week ahead: the forecast may still change a lot.',
      off: 'The forecast needs an internet connection.', saved: 'Saved forecast from', fail: 'The forecast could not be loaded right now.',
      low: 'Low', mid: 'Middle', high: 'High', rain: 'Rain', wind: 'Wind', temp: 'Temp', hum: 'Humidity', time: 'Time', clouds: 'Clouds',
      polar: 'The Sun does not set this night, so there is no dark sky.', kmh: 'km/h', cred: 'Weather: ECMWF forecast (IFS 9 km) through Open-Meteo, CC BY 4.0. Forecasts can be wrong.',
      ncm: 'Official forecasts and warnings: National Center for Meteorology'},
    ar: {h: 'الطقس في الليلة', load: 'جارٍ جلب التوقعات…', clear: 'صافية', most: 'صافية غالبًا', part: 'غائمة جزئيًا', cloudy: 'غائمة',
      good: 'ليلة جيدة لرصد النجوم', fair: 'مقبولة: فجوات بين السحب', poor: 'غير مناسبة: غيوم كثيرة', wet: 'يُتوقع مطر', windy: 'رياح قوية جدًا',
      best: 'أصفى الأوقات', none: 'لا ساعات صافية', moon: 'القمر الساطع سيحجب الأجرام الخافتة', dew: 'يُتوقع الندى: غطِّ العدسات والمرايا',
      far: 'تصل التوقعات إلى نحو 15 يومًا. عُد قبل الليلة بأيام.', past: 'مضت هذه الليلة.', unsure: 'أكثر من أسبوع: قد تتغير التوقعات كثيرًا.',
      off: 'التوقعات تحتاج إلى اتصال بالإنترنت.', saved: 'توقعات محفوظة من', fail: 'تعذّر تحميل التوقعات الآن.',
      low: 'منخفضة', mid: 'متوسطة', high: 'عالية', rain: 'مطر', wind: 'رياح', temp: 'الحرارة', hum: 'الرطوبة', time: 'الوقت', clouds: 'السحب',
      polar: 'لا تغرب الشمس في هذه الليلة، فلا توجد سماء مظلمة.', kmh: 'كم/س', cred: 'الطقس: توقعات المركز الأوروبي ECMWF (نموذج IFS بدقة 9 كم) عبر Open-Meteo، بترخيص CC BY 4.0. قد تخطئ التوقعات.',
      ncm: 'التوقعات والتنبيهات الرسمية: المركز الوطني للأرصاد'}
  };
  const keyOf = (lat, lon) => `${(+lat).toFixed(2)},${(+lon).toFixed(2)}`;
  function readSaved() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function save(k, rec) {
    const all = readSaved(); all[k] = rec;
    const keys = Object.keys(all).sort((a, b) => all[b].at - all[a].at).slice(0, 8);   // keep the 8 most recent places
    try { localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(keys.map(x => [x, all[x]])))); } catch (e) {}
  }
  // forecast for a place: {at, h: {t:[unix s], cc, lo, mi, hi, pr, pp, te, td, rh, ws, wg}}
  function get(lat, lon) {
    const k = keyOf(lat, lon), now = Date.now();
    if (mem[k] && now - mem[k].at < FRESH) return Promise.resolve(mem[k]);
    const old = mem[k] || readSaved()[k];
    if (old && now - old.at < FRESH) { mem[k] = old; return Promise.resolve(old); }
    if (wait[k]) return wait[k];
    // ECMWF first; if the service refuses that request, ask for the clouds only, then for its best model for the place
    const base = `${API}?latitude=${(+lat).toFixed(3)}&longitude=${(+lon).toFixed(3)}&timeformat=unixtime&timezone=GMT&forecast_days=${DAYS}`;
    const urls = [`${base}&hourly=${VARS}&models=ecmwf_ifs`, `${base}&hourly=cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,temperature_2m,dew_point_2m,wind_speed_10m&models=ecmwf_ifs`, `${base}&hourly=${VARS}`];
    const tryAll = i => fetch(urls[i]).then(r => r.ok ? r.json() : (r.status === 400 && i + 1 < urls.length ? tryAll(i + 1) : Promise.reject(new Error('http ' + r.status))));
    wait[k] = tryAll(0).then(j => {
      const H = j.hourly || {}, rec = {at: Date.now(), h: {t: H.time || [], cc: H.cloud_cover, lo: H.cloud_cover_low, mi: H.cloud_cover_mid, hi: H.cloud_cover_high,
        pr: H.precipitation, pp: H.precipitation_probability, te: H.temperature_2m, td: H.dew_point_2m, rh: H.relative_humidity_2m, ws: H.wind_speed_10m, wg: H.wind_gusts_10m}};
      if (!rec.h.t.length) throw new Error('empty');
      mem[k] = rec; save(k, rec); return rec;
    }).catch(e => { if (old) { mem[k] = old; return Object.assign({stale: true}, old); } throw e; }).finally(() => { delete wait[k]; });
    return wait[k];
  }
  const v = (a, i) => (a && a[i] != null ? a[i] : null);
  // humidity from temperature and dew point, when the model does not give it directly
  const rhOf = (te, td) => (te == null || td == null) ? null : Math.round(100 * Math.exp(17.625 * td / (243.04 + td)) / Math.exp(17.625 * te / (243.04 + te)));
  function nightHours(rec, pl, Y, M, D) {
    const se = sunEvents(Y, M, D, pl);
    if (!se.set || !se.rise) return {polar: true, rows: []};
    const t0 = se.set / 1000, t1 = se.rise / 1000, H = rec.h, rows = [];
    for (let i = 0; i < H.t.length; i++) {
      const t = H.t[i]; if (t < t0 - 1800 || t > t1 + 1800) continue;
      const te = v(H.te, i), td = v(H.td, i);
      rows.push({t, cc: v(H.cc, i), lo: v(H.lo, i), mi: v(H.mi, i), hi: v(H.hi, i), pr: v(H.pr, i), pp: v(H.pp, i), te, td, rh: v(H.rh, i) ?? rhOf(te, td), ws: v(H.ws, i), wg: v(H.wg, i)});
    }
    return {polar: false, rows, set: se.set, rise: se.rise};
  }
  const skyWord = (cc, t) => cc == null ? '–' : cc < 15 ? t.clear : cc < 40 ? t.most : cc < 75 ? t.part : t.cloudy;
  function verdict(rows, pl, t) {
    const cc = rows.filter(r => r.cc != null);
    if (!cc.length) return null;
    const avg = cc.reduce((s, r) => s + r.cc, 0) / cc.length;
    const wet = rows.some(r => (r.pp != null && r.pp >= 50) || (r.pr != null && r.pr >= 0.5));
    const windy = rows.some(r => r.ws != null && r.ws >= 35);
    const dew = rows.some(r => r.te != null && r.td != null && r.te - r.td <= 2.5);
    // clearest stretch: the longest run of hours with less than 30% cloud
    let best = null, run = null;
    rows.forEach(r => { if (r.cc != null && r.cc < 30) { run = run ? {a: run.a, b: r.t} : {a: r.t, b: r.t}; if (!best || run.b - run.a > best.b - best.a) best = {...run}; } else run = null; });
    const mid = rows.length ? rows[Math.floor(rows.length / 2)].t * 1000 : Date.now(), m = SKY.moon(mid), malt = SKY.altaz(m.ra, m.dec, mid, pl.lat, pl.lon).alt;
    const level = wet || avg >= 70 ? 'poor' : avg < 30 && !windy ? 'good' : 'fair';
    return {level, avg, wet, windy, dew, best, moon: m.illum > 0.6 && malt > 0};
  }
  const hm = (t, pl) => { const d = new Date(t * 1000 + pl.tz * 36e5); return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0'); };
  const isSaudi = pl => pl.r === 'Saudi Arabia' || (pl.lat > 16 && pl.lat < 32.5 && pl.lon > 34.5 && pl.lon < 55.7 && pl.tz === 3);
  function fillBox(box) {
    const [lat, lon, tz, Y, M, D, mode] = box.dataset.wx.split(','), ar = state.lang === 'ar', t = T[ar ? 'ar' : 'en'];
    const pl = CALD.places.find(p => keyOf(p.lat, p.lon) === keyOf(lat, lon)) || {lat: +lat, lon: +lon, tz: +tz};
    const night0 = Date.UTC(+Y, +M, +D) - pl.tz * 36e5, days = (night0 - Date.now()) / 864e5;
    const credit = `<p class="wx-cr">${esc(t.cred).replace('ECMWF', '<a href="https://www.ecmwf.int/en/forecasts/datasets/open-data" target="_blank" rel="noopener">ECMWF</a>').replace('Open-Meteo', '<a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a>')}${isSaudi(pl) ? `<br><a href="https://www.ncm.gov.sa/" target="_blank" rel="noopener">${t.ncm}</a>` : ''}</p>`;
    const head = mode === 'mini' ? '' : `<h3>${t.h}</h3>`;
    if (days < -1.2) { box.innerHTML = head + `<p class="muted">${t.past}</p>`; return; }
    if (days > DAYS - 1) { box.innerHTML = head + `<p class="muted">${t.far}</p>` + credit; return; }
    box.innerHTML = head + `<p class="muted">${t.load}</p>`;
    return get(lat, lon).then(rec => {
      if (!box.isConnected) return;
      const N = nightHours(rec, pl, +Y, +M, +D);
      if (N.polar) { box.innerHTML = head + `<p class="muted">${t.polar}</p>` + credit; return; }
      const V = verdict(N.rows, pl, t);
      if (!V) { box.innerHTML = head + `<p class="muted">${t.fail}</p>` + credit; return; }
      const notes = [V.wet && t.wet, V.windy && t.windy, V.moon && t.moon, V.dew && t.dew].filter(Boolean);
      const bestTxt = V.best ? `${t.best}: <bdi dir="ltr">${hm(V.best.a, pl)}–${hm(V.best.b + 3600, pl)}</bdi>` : t.none;
      let h = head + `<div class="wx-top wx-${V.level}"><b>${t[V.level]}</b><span>${skyWord(V.avg, t)} · <bdi dir="ltr">${Math.round(V.avg)}%</bdi> ${t.clouds}</span><span>${bestTxt}</span></div>`;
      if (notes.length) h += `<ul class="facts wx-notes">${notes.map(n => `<li>${n}</li>`).join('')}</ul>`;
      if (mode !== 'mini') {
        const bar = x => x == null ? '<td>–</td>' : `<td><span class="wx-b" style="--w:${Math.round(x)}%"></span><bdi dir="ltr">${Math.round(x)}%</bdi></td>`;
        h += `<div class="wx-scroll"><table class="wx-tab"><thead><tr><th>${t.time}</th><th>${t.clouds}</th><th>${t.low}</th><th>${t.mid}</th><th>${t.high}</th><th>${t.rain}</th><th>${t.wind}</th><th>${t.temp}</th><th>${t.hum}</th></tr></thead><tbody>`
          + N.rows.map(r => `<tr><th><bdi dir="ltr">${hm(r.t, pl)}</bdi></th>${bar(r.cc)}${bar(r.lo)}${bar(r.mi)}${bar(r.hi)}<td><bdi dir="ltr">${r.pp != null ? Math.round(r.pp) + '%' : r.pr != null ? r.pr.toFixed(1) + ' mm' : '–'}</bdi></td><td><bdi dir="ltr">${r.ws != null ? Math.round(r.ws) : '–'}</bdi></td><td><bdi dir="ltr">${r.te != null ? Math.round(r.te) + '°' : '–'}</bdi></td><td><bdi dir="ltr">${r.rh != null ? Math.round(r.rh) + '%' : '–'}</bdi></td></tr>`).join('')
          + `</tbody></table></div><p class="muted wx-units">${ar ? `الأوقات بالتوقيت المحلي القياسي. الرياح بـ${t.kmh}.` : `Times are local standard time. Wind in ${t.kmh}.`}</p>`;
      }
      if (days > 7) h += `<p class="muted">${t.unsure}</p>`;
      if (rec.stale) h += `<p class="muted">${t.saved} ${fmtD(rec.at + pl.tz * 36e5, ar ? 'ar' : 'en', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})}</p>`;
      box.innerHTML = h + credit;
    }).catch(() => { if (box.isConnected) box.innerHTML = head + `<p class="muted">${navigator.onLine === false ? t.off : t.fail}</p>` + credit; });
  }
  function scan(root) { return Promise.all([...(root || document).querySelectorAll('.wx[data-wx]:not([data-wxdone])')].map(b => { b.dataset.wxdone = '1'; return fillBox(b); })); }
  addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('card'); if (!card) return;
    new MutationObserver(() => scan(card)).observe(card, {childList: true, subtree: true});
    scan(card);
  });
  addEventListener('online', () => { document.querySelectorAll('.wx[data-wx]').forEach(b => { delete b.dataset.wxdone; }); scan(); });
  // the box a page puts where the weather should go
  const box = (pl, Y, M, D, mode) => `<div class="wx${mode === 'mini' ? ' wx-mini' : ''}" data-wx="${pl.lat},${pl.lon},${pl.tz},${Y},${M},${D},${mode || 'full'}"></div>`;
  return {box, get, fill: scan};
})();
