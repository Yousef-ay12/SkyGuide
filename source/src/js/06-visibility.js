/* ---------- Constellation visibility filter: budget (tonight's limiting magnitude) vs cost (a pattern's faintest star) ---------- */
const VIS = (() => {
  const D2R = Math.PI / 180;
  const DEFAULTS = {bortle: 3, sqm: null, k: 0.25, guestPenalty: 1.25, passMargin: 1.5, stackMargins: false,
                    minCoreAlt: 30, minFullAlt: 15, sunMax: -12, stepMin: 10, meridianWeight: 0.5, tourStart: '19:30', tourEnd: '22:30'};

  // Typical zenith sky brightness (mag/arcsec²) for each Bortle class: midpoints of the SQM ranges usually tabulated
  // for Bortle's scale (J. Bortle, Sky & Telescope, Feb 2001; SQM ranges as compiled by Unihedron and the
  // Wikipedia "Bortle scale" article).
  const BORTLE_SQM = {1: 22.0, 2: 21.9, 3: 21.8, 4: 21.1, 5: 20.0, 6: 19.2, 7: 18.7, 8: 18.0, 9: 17.5};
  function sqmFromBortle(b) { return BORTLE_SQM[Math.min(9, Math.max(1, Math.round(b)))]; }

  // Naked-eye limiting magnitude from sky brightness:
  //   NELM = 7.93 - 5·log10(10^(4.316 - SQM/5) + 1)
  // Formula by B. E. Schaefer, as published by Unihedron with the Sky Quality Meter ("SQM to NELM" conversion).
  function nelmFromSqm(sqm) { return 7.93 - 5 * Math.log10(Math.pow(10, 4.316 - sqm / 5) + 1); }

  // Krisciunas & Schaefer (1991), "A model of the brightness of moonlight", PASP 103, 1033.
  const nLfromV = V => 34.08 * Math.exp(20.7233 - 0.92104 * V);         // eq. 1: mag/arcsec² -> nanoLamberts
  const VfromnL = B => (20.7233 - Math.log(B / 34.08)) / 0.92104;       // inverse of eq. 1
  function airmass(altDeg) {                                          // eq. 3, with Z = zenith distance
    const z = (90 - Math.max(altDeg, 0)) * D2R;
    return 1 / Math.sqrt(1 - 0.96 * Math.sin(z) * Math.sin(z));
  }
  function moonSkyBrightness(phaseAngle, sepDeg, moonAlt, targetAlt, k) {   // eqs. 15, 20, 21, result in nanoLamberts
    if (moonAlt <= 0) return 0;
    const a = Math.abs(phaseAngle), rho = Math.max(sepDeg, 10);        // the model is not valid closer than about 10°
    const I = Math.pow(10, -0.4 * (3.84 + 0.026 * a + 4e-9 * Math.pow(a, 4)));
    const c = Math.cos(rho * D2R);
    const f = Math.pow(10, 5.36) * (1.06 + c * c) + Math.pow(10, 6.15 - rho / 40);
    return f * I * Math.pow(10, -0.4 * k * airmass(moonAlt)) * (1 - Math.pow(10, -0.4 * k * airmass(targetAlt)));
  }
  // Sky brightness at the target (mag/arcsec²): the dark sky brightens towards the horizon (KS91 eq. 2) plus moonlight.
  function skyAt(sqmZenith, targetAlt, moon, k) {
    const X = airmass(targetAlt);
    const dark = nLfromV(sqmZenith) * Math.pow(10, -0.4 * k * (X - 1)) * X;
    const lunar = moon ? moonSkyBrightness(moon.phaseAngle, moon.sep, moon.alt, targetAlt, k) : 0;
    return VfromnL(dark + lunar);
  }
  function settingsSqm(S) { return S.sqm != null && S.sqm !== '' && !isNaN(+S.sqm) ? +S.sqm : sqmFromBortle(S.bortle); }
  // NELM at one point of the sky at one moment (before the guest penalty)
  function nelmAt(S, t, ra, dec, ctx) {
    const c = ctx || context(S, t);
    const alt = SKY.altaz(ra, dec, t, S.lat, S.lon).alt;
    const moon = c.moon.alt > 0 ? {phaseAngle: c.moon.phaseAngle, alt: c.moon.alt, sep: SKY.sep(ra, dec, c.moon.ra, c.moon.dec)} : null;
    return {nelm: nelmFromSqm(skyAt(settingsSqm(S), alt, moon, S.k)), alt};
  }
  function context(S, t) {
    const m = SKY.moon(t), s = SKY.sun(t);
    return {moon: {ra: m.ra, dec: m.dec, alt: SKY.altaz(m.ra, m.dec, t, S.lat, S.lon).alt, phaseAngle: 180 - m.elong > 0 ? 180 - m.elong : m.elong - 180, illum: m.illum},
            sunAlt: SKY.altaz(s.ra, s.dec, t, S.lat, S.lon).alt};
  }
  const required = S => S.stackMargins ? S.guestPenalty + S.passMargin : Math.max(S.guestPenalty, S.passMargin);
  // Cost of one star set at one moment: the faintest star after extinction, and the headroom against the local NELM
  function patternCost(pattern, which, S, t, STARS, ctx) {
    const ids = which === 'full' ? pattern.full : pattern.core;
    let worst = null, minAlt = 90, minHead = Infinity;
    for (const id of ids) {
      const st = STARS[id], r = nelmAt(S, t, st.ra, st.dec, ctx);
      minAlt = Math.min(minAlt, r.alt);
      const app = st.vmag + S.k * (airmass(r.alt) - 1);
      const head = r.nelm - app;
      if (head < minHead) { minHead = head; worst = {id, name: st.name, vmag: st.vmag, app, nelm: r.nelm, alt: r.alt}; }
    }
    return {cost: worst.app, faintest: worst, budget: worst.nelm - required(S), headroom: minHead, minAlt};
  }
  function parseHM(s) { const [h, m] = s.split(':').map(Number); return h + (m || 0) / 60; }
  // y, m (0-11), d: the local date the tour starts on
  function windowTimes(S, y, m, d) {
    const a = parseHM(S.tourStart); let b = parseHM(S.tourEnd); if (b <= a) b += 24;
    const out = [];
    for (let h = a; h <= b + 1e-9; h += S.stepMin / 60) out.push(Date.UTC(y, m, d) + (h - S.tz) * 36e5);
    return out;
  }
  function evaluatePattern(pattern, S, times, STARS, ctxs) {
    const steps = times.map((t, i) => {
      const ctx = ctxs[i];
      const core = patternCost(pattern, 'core', S, t, STARS, ctx);
      const dark = ctx.sunAlt <= S.sunMax, high = core.minAlt >= S.minCoreAlt, bright = core.cost <= core.budget;
      const cra = pattern._ra;
      const ha = ((((lstOf(t, S.lon) - cra) % 360) + 540) % 360) - 180;   // hour angle of the pattern centre, degrees
      const score = (core.budget - core.cost) + S.meridianWeight * Math.cos(ha * D2R);
      return {t, core, pass: dark && high && bright, dark, high, bright, score};
    });
    let best = null, run = null;
    steps.forEach((s, i) => {
      if (s.pass) { if (!run) run = {i0: i, i1: i, peak: i}; else { run.i1 = i; if (s.score > steps[run.peak].score) run.peak = i; } }
      if ((!s.pass || i === steps.length - 1) && run) { if (!best || steps[run.peak].score > steps[best.peak].score) best = run; run = null; }
    });
    const pick = best ? steps[best.peak] : steps.reduce((a, b) => {
      const sa = (a.dark ? 0 : -100) + (a.high ? 0 : -10 + a.core.minAlt / 10) + Math.min(0, a.core.budget - a.core.cost);
      const sb = (b.dark ? 0 : -100) + (b.high ? 0 : -10 + b.core.minAlt / 10) + Math.min(0, b.core.budget - b.core.cost);
      return sb > sa ? b : a;
    });
    const full = patternCost(pattern, 'full', S, pick.t, STARS, ctxs[steps.indexOf(pick)]);
    const fullVisible = full.minAlt >= S.minFullAlt && full.headroom >= S.guestPenalty;
    let reason = null;
    if (!best) reason = !steps.some(s => s.dark) ? 'twilight' : !steps.some(s => s.dark && s.high) ? 'low' : 'faint';
    const flags = pattern.core.filter(id => STARS[id].variable).map(id => STARS[id].name);
    return {id: pattern.id, pass: !!best, reason, score: pick.score,
            window: best ? {start: steps[best.i0].t, end: steps[best.i1].t, peak: steps[best.peak].t} : null,
            at: pick.t, coreCost: pick.core.cost, budget: pick.core.budget, faintest: pick.core.faintest, minAlt: pick.core.minAlt,
            fullVisible, fullCost: full.cost, variable: flags};
  }
  function lstOf(t, lon) { return ((280.46061837 + 360.98564736629 * (t / 864e5 + 2440587.5 - 2451545) + lon) % 360 + 360) % 360; }
  function prepare(patterns, STARS) {
    patterns.forEach(p => {
      if (p._ra != null) return;
      let x = 0, y = 0, z = 0;
      p.core.forEach(id => { const s = STARS[id], r = s.ra * D2R, d = s.dec * D2R; x += Math.cos(d) * Math.cos(r); y += Math.cos(d) * Math.sin(r); z += Math.sin(d); });
      p._ra = ((Math.atan2(y, x) / D2R) + 360) % 360; p._dec = Math.asin(z / Math.hypot(x, y, z)) / D2R;
    });
  }
  function rankPatterns(patterns, S0, y, m, d, STARS) {
    const S = {...DEFAULTS, ...S0};
    prepare(patterns, STARS);
    const times = windowTimes(S, y, m, d), ctxs = times.map(t => context(S, t));
    const res = patterns.map(p => evaluatePattern(p, S, times, STARS, ctxs));
    res.sort((a, b) => (b.pass - a.pass) || (b.score - a.score));
    return {results: res, times, ctx: ctxs, settings: S};
  }
  return {DEFAULTS, sqmFromBortle, nelmFromSqm, airmass, moonSkyBrightness, skyAt, nelmAt, patternCost, evaluatePattern, rankPatterns, required, context};
})();

