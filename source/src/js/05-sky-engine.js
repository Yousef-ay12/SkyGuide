/* ---------- Sky engine: Sun, Moon and planets (low precision, about 1°) ---------- */
const SKY = (() => {
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, OBL = 23.4392911 * D2R;
  const norm = a => ((a % 360) + 360) % 360;
  const jd = t => t / 864e5 + 2440587.5;
  // JPL "Approximate positions of the planets", valid 1800-2050: a, e, I, L, long.peri, long.node and their rates per century
  const EL = {
    mercury: [0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593, 0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081],
    venus: [0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255, 0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418],
    earth: [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0, 0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0],
    mars: [1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891, 0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
    jupiter: [5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909, -0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106],
    saturn: [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448, -0.00125060, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794],
    uranus: [19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.95427630, 74.01692503, -0.00196176, -0.00004397, -0.00242939, 428.48202785, 0.40805281, 0.04240589],
    neptune: [30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574, 0.00026291, 0.00005105, 0.00035372, 218.45945325, -0.32241464, -0.00508664],
    pluto: [39.48211675, 0.24882730, 17.14001206, 238.92903833, 224.06891629, 110.30393684, -0.00031596, 0.00005170, 0.00004818, 145.20780515, -0.04062942, -0.01183482]
  };
  function helio(p, T) {
    const e0 = EL[p], a = e0[0] + e0[6] * T, e = e0[1] + e0[7] * T, I = (e0[2] + e0[8] * T) * D2R, L = e0[3] + e0[9] * T, w = e0[4] + e0[10] * T, O = e0[5] + e0[11] * T;
    const om = (w - O) * D2R, Om = O * D2R;
    let M = norm(L - w); if (M > 180) M -= 360; M *= D2R;
    let E = M + e * Math.sin(M); for (let i = 0; i < 8; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    const x1 = a * (Math.cos(E) - e), y1 = a * Math.sqrt(1 - e * e) * Math.sin(E);
    const co = Math.cos(om), so = Math.sin(om), cO = Math.cos(Om), sO = Math.sin(Om), cI = Math.cos(I), sI = Math.sin(I);
    return [(co * cO - so * sO * cI) * x1 + (-so * cO - co * sO * cI) * y1, (co * sO + so * cO * cI) * x1 + (-so * sO + co * cO * cI) * y1, so * sI * x1 + co * sI * y1];
  }
  function eclToEq(x, y, z) { return [x, y * Math.cos(OBL) - z * Math.sin(OBL), y * Math.sin(OBL) + z * Math.cos(OBL)]; }
  function radec(v) { const [x, y, z] = v, r = Math.hypot(x, y, z); return {ra: norm(Math.atan2(y, x) * R2D), dec: Math.asin(z / r) * R2D, r}; }
  const Tof = t => (jd(t) - 2451545) / 36525;
  function sun(t) { const T = Tof(t), E = helio('earth', T); const g = [-E[0], -E[1], -E[2]]; return {...radec(eclToEq(...g)), lon: norm(Math.atan2(g[1], g[0]) * R2D)}; }
  function planet(p, t) {
    const T = Tof(t), E = helio('earth', T), P = helio(p, T), g = [P[0] - E[0], P[1] - E[1], P[2] - E[2]];
    const rr = Math.hypot(...P), R = Math.hypot(...E), d = Math.hypot(...g);
    const s = sun(t), q = radec(eclToEq(...g));
    const i = Math.acos(Math.max(-1, Math.min(1, (rr * rr + d * d - R * R) / (2 * rr * d)))) * R2D;
    const l5 = 5 * Math.log10(rr * d);
    const mag = {mercury: -0.42 + l5 + 0.038 * i - 0.000273 * i * i + 0.000002 * i ** 3, venus: -4.40 + l5 + 0.0009 * i + 0.000239 * i * i - 0.00000065 * i ** 3,
                 mars: -1.52 + l5 + 0.016 * i, jupiter: -9.40 + l5 + 0.005 * i, saturn: -8.88 + l5, uranus: -7.19 + l5, neptune: -6.87 + l5, pluto: -1.0 + l5}[p];
    const elon = sep(q.ra, q.dec, s.ra, s.dec);
    const lonP = norm(Math.atan2(g[1], g[0]) * R2D);
    const east = norm(lonP - s.lon) < 180;  // east of the Sun = evening sky
    return {ra: q.ra, dec: q.dec, dist: d, mag, elon, east};
  }
  function moon(t) {
    const T = Tof(t), S = x => Math.sin(x * D2R);
    let lam = 218.32 + 481267.881 * T + 6.29 * S(135.0 + 477198.87 * T) - 1.27 * S(259.3 - 413335.36 * T) + 0.66 * S(235.7 + 890534.22 * T)
      + 0.21 * S(269.9 + 954397.74 * T) - 0.19 * S(357.5 + 35999.05 * T) - 0.11 * S(186.5 + 966404.03 * T);
    const bet = 5.13 * S(93.3 + 483202.02 * T) + 0.28 * S(228.2 + 960400.89 * T) - 0.28 * S(318.3 + 6003.15 * T) - 0.17 * S(217.6 - 407332.21 * T);
    lam = norm(lam - 1.3969713 * T);  // equinox of date -> J2000
    const l = lam * D2R, b = bet * D2R;
    const q = radec(eclToEq(Math.cos(b) * Math.cos(l), Math.cos(b) * Math.sin(l), Math.sin(b)));
    const s = sun(t), el = norm(lam - s.lon);
    return {ra: q.ra, dec: q.dec, lon: lam, elong: el, illum: (1 - Math.cos(el * D2R)) / 2, waxing: el < 180};
  }
  function sep(r1, d1, r2, d2) {
    const c = Math.sin(d1 * D2R) * Math.sin(d2 * D2R) + Math.cos(d1 * D2R) * Math.cos(d2 * D2R) * Math.cos((r1 - r2) * D2R);
    return Math.acos(Math.max(-1, Math.min(1, c))) * R2D;
  }
  function lst(t, lon) { return norm(280.46061837 + 360.98564736629 * (jd(t) - 2451545) + lon); }
  function altaz(ra, dec, t, lat, lon) {
    const H = (lst(t, lon) - ra) * D2R, d = dec * D2R, f = lat * D2R;
    const sa = Math.sin(f) * Math.sin(d) + Math.cos(f) * Math.cos(d) * Math.cos(H);
    const alt = Math.asin(sa);
    const az = Math.atan2(-Math.cos(d) * Math.sin(H), Math.sin(d) * Math.cos(f) - Math.cos(d) * Math.sin(f) * Math.cos(H));
    return {alt: alt * R2D, az: norm(az * R2D)};
  }
  // time (ms) of the next phase event after t: k = 0 new, 1 first quarter, 2 full, 3 last quarter
  function phases(t0, t1) {
    const out = []; let t = t0, prev = moon(t).elong;
    const step = 6 * 36e5;
    while (t < t1) {
      const t2 = t + step, cur = moon(t2).elong;
      for (let k = 0; k < 4; k++) {
        const a = k * 90, p0 = norm(prev - a), p1 = norm(cur - a);
        if (p0 > 300 && p1 < 60) {
          let lo = t, hi = t2;
          for (let i = 0; i < 20; i++) { const m = (lo + hi) / 2; if (norm(moon(m).elong - a) > 180) lo = m; else hi = m; }
          out.push({k, t: (lo + hi) / 2});
        }
      }
      prev = cur; t = t2;
    }
    return out;
  }
  return {sun, moon, planet, altaz, sep, phases, norm};
})();

