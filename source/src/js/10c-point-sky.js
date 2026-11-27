/* ---------- Point at the sky: hold the phone up and see the stars, lines, names and constellation art in that direction ----------
   Stars: Hipparcos via d3-celestial (BSD). Lines and art: Stellarium sky cultures. Western art by Johan Meuris (Free Art License);
   Arab sky: al-Sufi figures (public domain) placed with Khalid al-Ajaji's data (CC BY-ND 4.0), used unchanged.
   The data (assets/pointsky.*.js) and art (art/) load only when the view is opened. */
const PSKY = (() => {
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  let D = null, loading = null;
  window.PSKY_READY = d => { D = prep(d); };
  function load() {
    if (D) return Promise.resolve();
    if (!loading) loading = new Promise((res, rej) => { const s = document.createElement('script'); s.src = window.PSKY_SRC; s.onload = () => (D ? res() : rej()); s.onerror = rej; document.head.appendChild(s); });
    return loading;
  }
  function prep(d) {
    const n = d.stars.length, X = new Float32Array(n), Y = new Float32Array(n), Z = new Float32Array(n), M = new Float32Array(n), C = [], H = new Map();
    d.stars.forEach(([hip, ra, dec, mag, bv], i) => {
      const a = ra * D2R, b = dec * D2R;
      X[i] = Math.cos(b) * Math.cos(a); Y[i] = Math.cos(b) * Math.sin(a); Z[i] = Math.sin(b); M[i] = mag; C.push(starCol(bv)); H.set(hip, i);
    });
    return {n, X, Y, Z, M, C, H, names: d.names, cul: d.cul, ra: d.stars.map(s => s[1]), dec: d.stars.map(s => s[2])};
  }
  function starCol(bv) {
    if (bv < 0) return '#b9cdff'; if (bv < 0.3) return '#dfe7ff'; if (bv < 0.6) return '#fff8ee'; if (bv < 1.0) return '#ffe8c2'; if (bv < 1.4) return '#ffd29a'; return '#ffb27a';
  }

  // ---- state ----
  let el = null, cv = null, ctx = null, W = 0, Hh = 0, dpr = 1, raf = 0;
  let mode = 'drag';            // 'sensor' or 'drag'
  let ori = null;               // last device orientation {a, b, g}
  let headK = null;             // iOS: offset that turns the relative alpha into a compass bearing
  let nudge = 0;                // the user's compass correction, degrees
  let view = {az: 180, alt: 35};  // drag mode
  let fov = 70;                 // vertical field of view, degrees
  let target = null;            // constellation key to find
  let showArt = true, showLines = true;
  let E, N, U, pl, tNow = 0, lastPos = 0, bodies = [];
  const imgs = new Map();
  try { const s = JSON.parse(localStorage.getItem('osms-psky') || '{}'); if (typeof s.nudge === 'number') nudge = s.nudge; if (s.art === false) showArt = false; if (s.lines === false) showLines = false; } catch (e) {}
  const save = () => { try { localStorage.setItem('osms-psky', JSON.stringify({nudge, art: showArt, lines: showLines})); } catch (e) {} };
  const ar = () => state.lang === 'ar';
  const T = (en, a) => (ar() ? a : en);
  const cul = () => (state.cul === 'arab' ? 's' : 'w');

  // ---- where the stars are now: east, north and up parts of each star's direction ----
  function place() { const p = placeObj(); return {lat: p.lat, lon: p.lon, name: ar() ? p.ar : p.en}; }
  function positions() {
    tNow = Date.now(); pl = place(); lastPos = tNow;
    const lst = norm(280.46061837 + 360.98564736629 * (tNow / 864e5 + 2440587.5 - 2451545) + pl.lon) * D2R, la = pl.lat * D2R;
    const sL = Math.sin(lst), cL = Math.cos(lst), sp = Math.sin(la), cp = Math.cos(la);
    if (!E) { E = new Float32Array(D.n); N = new Float32Array(D.n); U = new Float32Array(D.n); }
    for (let i = 0; i < D.n; i++) {
      // hour angle H = LST - RA: cos H and sin H from the star's x, y
      const x = D.X[i], y = D.Y[i], z = D.Z[i], cH = x * cL + y * sL, sH = x * sL - y * cL;
      E[i] = -sH; N[i] = z * cp - cH * sp; U[i] = z * sp + cH * cp;
    }
    bodies = [];
    const add = (id, en, a, ra, dec, mag, col, extra) => { const v = eq2h(ra, dec, lst, sp, cp); bodies.push({id, en, ar: a, v, mag, col, ...extra}); };
    const s = SKY.sun(tNow); add('sun', 'Sun', 'الشمس', s.ra, s.dec, -26, '#ffd25a');
    const m = SKY.moon(tNow); add('moon', 'Moon', 'القمر', m.ra, m.dec, -10, '#f2efe6', {illum: m.illum, waxing: m.waxing});
    [['mercury', 'Mercury', 'عطارد', '#c9b8a0'], ['venus', 'Venus', 'الزهرة', '#fff4d6'], ['mars', 'Mars', 'المريخ', '#ff8a5c'], ['jupiter', 'Jupiter', 'المشتري', '#ffe2b0'], ['saturn', 'Saturn', 'زحل', '#f1d58c']]
      .forEach(([id, en, a, col]) => { const p = SKY.planet(id, tNow); add(id, en, a, p.ra, p.dec, p.mag, col); });
  }
  const norm = a => ((a % 360) + 360) % 360;
  function eq2h(ra, dec, lst, sp, cp) {
    const a = ra * D2R, b = dec * D2R, x = Math.cos(b) * Math.cos(a), y = Math.cos(b) * Math.sin(a), z = Math.sin(b);
    const cH = x * Math.cos(lst) + y * Math.sin(lst), sH = x * Math.sin(lst) - y * Math.cos(lst);
    return [-sH, z * cp - cH * sp, z * sp + cH * cp];
  }

  // ---- the camera: right, up and forward directions in east-north-up ----
  function camera() {
    if (mode === 'sensor' && ori) {
      let a = ori.a; if (headK !== null) a = ori.a + headK;
      a = (a - nudge) * D2R; const b = ori.b * D2R, g = ori.g * D2R;
      const cA = Math.cos(a), sA = Math.sin(a), cB = Math.cos(b), sB = Math.sin(b), cG = Math.cos(g), sG = Math.sin(g);
      // columns of the W3C rotation: the phone's x (right), y (top) and z (out of the screen) in east-north-up
      let x = [cA * cG - sA * sB * sG, cG * sA + cA * sB * sG, -cB * sG], y = [-cB * sA, cA * cB, sB], z = [cA * sG + cG * sA * sB, sA * sG - cA * cG * sB, cB * cG];
      const ang = scrAngle();
      if (ang === 90) [x, y] = [y.map(v => -v), x];
      else if (ang === -90 || ang === 270) [x, y] = [y, x.map(v => -v)];
      else if (ang === 180) [x, y] = [x.map(v => -v), y.map(v => -v)];
      return {r: x, u: y, f: z.map(v => -v)};
    }
    const az = view.az * D2R, al = view.alt * D2R;
    const f = [Math.sin(az) * Math.cos(al), Math.cos(az) * Math.cos(al), Math.sin(al)], r = [Math.cos(az), -Math.sin(az), 0];
    return {r, u: [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]], f};
  }
  function scrAngle() {
    if (typeof window.orientation === 'number') return window.orientation;
    const a = screen.orientation && screen.orientation.angle; return a === 270 ? -90 : (a || 0);
  }
  function facing(cam) {
    const f = cam.f, az = norm(Math.atan2(f[0], f[1]) * R2D), alt = Math.asin(Math.max(-1, Math.min(1, f[2]))) * R2D;
    return {az, alt};
  }

  // ---- drawing ----
  function frame() {
    raf = 0; if (!el) return;
    if (Date.now() - lastPos > 20000) { positions(); placeLine(); }
    const cam = camera(), r = cam.r, u = cam.u, f = cam.f;
    const k = (Hh / 2) / Math.tan(fov / 2 * D2R), cx = W / 2, cy = Hh / 2;
    const P = (e, n, up) => { const z = e * f[0] + n * f[1] + up * f[2]; if (z <= 0.05) return null; return [cx + k * (e * r[0] + n * r[1] + up * r[2]) / z, cy - k * (e * u[0] + n * u[1] + up * u[2]) / z, z]; };
    const on = (p, m = 0) => p && p[0] > -m && p[0] < W + m && p[1] > -m && p[1] < Hh + m;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // sky, a little lighter towards the horizon
    const fc = facing(cam);
    const g = ctx.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, '#04070f'); g.addColorStop(1, fc.alt < 15 ? '#0b1428' : '#060b18');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
    const c = D.cul[cul()], sc = Math.min(1.6, Math.max(0.7, 70 / fov));
    // constellation art
    if (showArt) {
      ctx.save(); ctx.globalCompositeOperation = 'screen';
      for (const key in c) {
        const a = c[key].a; if (!a) continue;
        const pts = a.p.map(([px, py, hip]) => { const i = D.H.get(hip); return i === undefined ? null : P(E[i], N[i], U[i]); });
        if (pts.some(p => !p) || !pts.some(p => on(p, W))) continue;
        let im = imgs.get(a.f); if (!im) { im = new Image(); im.onload = () => draw(); im.src = 'art/' + a.f; imgs.set(a.f, im); }
        if (!im.complete || !im.naturalWidth) continue;
        const [[x1, y1], [x2, y2], [x3, y3]] = a.p, [[u1, v1], [u2, v2], [u3, v3]] = pts;
        const det = x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2); if (!det) continue;
        const A = (u1 * (y2 - y3) + u2 * (y3 - y1) + u3 * (y1 - y2)) / det, Cc = (x1 * (u2 - u3) + x2 * (u3 - u1) + x3 * (u1 - u2)) / det, Ee = u1 - A * x1 - Cc * y1;
        const B = (v1 * (y2 - y3) + v2 * (y3 - y1) + v3 * (y1 - y2)) / det, Dd = (x1 * (v2 - v3) + x2 * (v3 - v1) + x3 * (v1 - v2)) / det, Ff = v1 - B * x1 - Dd * y1;
        const lowArt = a.p.every(([, , hip]) => { const i = D.H.get(hip); return U[i] < 0; });
        ctx.globalAlpha = (key === target ? 0.55 : cul() === 's' ? 0.24 : 0.3) * (lowArt ? 0.35 : 1);
        ctx.setTransform(dpr * A, dpr * B, dpr * Cc, dpr * Dd, dpr * Ee, dpr * Ff);
        ctx.drawImage(im, 0, 0, a.sz[0], a.sz[1]);
      }
      ctx.restore(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    // constellation lines
    if (showLines) {
      ctx.lineWidth = 1.1; ctx.lineCap = 'round';
      for (const key in c) {
        ctx.strokeStyle = key === target ? 'rgba(232,185,90,.95)' : 'rgba(120,170,230,.42)'; ctx.lineWidth = key === target ? 1.8 : 1.1;
        ctx.beginPath();
        for (const l of c[key].l) {
          let prev = null;
          for (const hip of l) {
            const i = D.H.get(hip), p = i === undefined ? null : P(E[i], N[i], U[i]);
            if (p && prev && (on(p, W) || on(prev, W))) { ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); }
            prev = p;
          }
        }
        ctx.stroke();
      }
    }
    // stars (fainter when below the horizon)
    const lim = fov > 80 ? 5.2 : fov > 50 ? 5.7 : 6.2;
    for (let i = 0; i < D.n; i++) {
      if (D.M[i] > lim) continue;
      const p = P(E[i], N[i], U[i]); if (!on(p, 4)) continue;
      const rad = Math.max(0.55, (3.4 - 0.55 * D.M[i]) * sc);
      ctx.globalAlpha = U[i] < 0 ? 0.25 : Math.min(1, 1.25 - D.M[i] * 0.12);
      ctx.fillStyle = D.C[i]; ctx.beginPath(); ctx.arc(p[0], p[1], rad, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // horizon and the compass points
    ctx.strokeStyle = 'rgba(90,200,140,.55)'; ctx.lineWidth = 1.5; ctx.beginPath(); let pv = null;
    for (let az = 0; az <= 360; az += 3) { const p = P(Math.sin(az * D2R), Math.cos(az * D2R), 0); if (p && pv) { ctx.moveTo(pv[0], pv[1]); ctx.lineTo(p[0], p[1]); } pv = p; }
    ctx.stroke();
    ctx.font = `600 ${14}px ${getComputedStyle(document.body).fontFamily}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const pts = ar() ? ['ش', 'ش ق', 'ق', 'ج ق', 'ج', 'ج غ', 'غ', 'ش غ'] : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    pts.forEach((t, i) => { const az = i * 45 * D2R, p = P(Math.sin(az), Math.cos(az), 0); if (on(p)) { ctx.fillStyle = i % 2 ? 'rgba(140,220,170,.7)' : '#8fe3b0'; ctx.fillText(t, p[0], p[1] - 12); } });
    // star names
    ctx.font = `13px ${getComputedStyle(document.body).fontFamily}`; ctx.textAlign = 'left';
    const nmLim = fov > 80 ? 1.6 : fov > 45 ? 2.3 : 3.2;
    for (const hip in D.names) {
      const i = D.H.get(+hip); if (i === undefined || D.M[i] > nmLim) continue;
      const p = P(E[i], N[i], U[i]); if (!on(p)) continue;
      const nm = D.names[hip], t = ar() && nm[1] ? nm[1] : nm[0];
      ctx.fillStyle = U[i] < 0 ? 'rgba(200,210,230,.3)' : 'rgba(210,220,240,.8)'; ctx.fillText(t, p[0] + 6, p[1] - 6);
    }
    // constellation names, at the middle of each figure's stars
    ctx.font = `600 13px ${getComputedStyle(document.body).fontFamily}`; ctx.textAlign = 'center';
    const centres = {};
    for (const key in c) {
      let e = 0, n = 0, up = 0, cnt = 0; const seen = new Set();
      c[key].l.forEach(l => l.forEach(hip => { const i = D.H.get(hip); if (i === undefined || seen.has(i)) return; seen.add(i); e += E[i]; n += N[i]; up += U[i]; cnt++; }));
      if (!cnt) continue; const m = Math.hypot(e, n, up); centres[key] = [e / m, n / m, up / m];
      const p = P(...centres[key]); if (!on(p)) continue;
      const b = byKey[key]; const t = b ? (ar() ? b.ar : b.latin) : key;
      ctx.fillStyle = key === target ? '#f0c060' : 'rgba(140,180,235,.85)'; ctx.fillText(t, p[0], p[1]);
    }
    // Sun, Moon and planets
    ctx.textAlign = 'left';
    bodies.forEach(b => {
      const p = P(...b.v); if (!on(p, 20)) return;
      const rad = b.id === 'sun' ? 12 : b.id === 'moon' ? 10 : Math.max(2.4, 4.2 - 0.4 * b.mag);
      ctx.globalAlpha = b.v[2] < 0 ? 0.35 : 1; ctx.fillStyle = b.col; ctx.beginPath(); ctx.arc(p[0], p[1], rad, 0, 6.2832); ctx.fill();
      if (b.id === 'moon' && b.illum < 0.98) {
        // the dark part: from the unlit edge round to the terminator, an ellipse whose width follows the phase
        const sg = b.waxing ? -1 : 1, tx = rad * (1 - 2 * b.illum); ctx.fillStyle = 'rgba(6,10,20,.88)'; ctx.beginPath();
        for (let q = 0; q <= 20; q++) { const t = -Math.PI / 2 + Math.PI * q / 20; ctx.lineTo(p[0] + sg * rad * Math.cos(t), p[1] + rad * Math.sin(t)); }
        for (let q = 20; q >= 0; q--) { const t = -Math.PI / 2 + Math.PI * q / 20; ctx.lineTo(p[0] - sg * tx * Math.cos(t), p[1] + rad * Math.sin(t)); }
        ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.fillStyle = b.col; ctx.font = `600 13px ${getComputedStyle(document.body).fontFamily}`; ctx.fillText(ar() ? b.ar : b.en, p[0] + rad + 5, p[1] - rad);
    });
    // the constellation being looked for: an arrow at the edge when it is off screen
    hud(fc, centres, P, on);
  }
  function hud(fc, centres, P, on) {
    const dir = el.querySelector('.ps-dir'), tg = el.querySelector('.ps-target');
    const cards = ar() ? ['الشمال', 'الشمال الشرقي', 'الشرق', 'الجنوب الشرقي', 'الجنوب', 'الجنوب الغربي', 'الغرب', 'الشمال الغربي'] : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const al = Math.round(Math.abs(fc.alt));
    dir.textContent = (ar() ? 'تنظر نحو ' : 'Facing ') + cards[Math.round(fc.az / 45) % 8] + ' · ' + (ar() ? `${al}° ${fc.alt >= 0 ? 'فوق الأفق' : 'تحت الأفق'}` : `${al}° ${fc.alt >= 0 ? 'up' : 'below the horizon'}`);
    if (!target || !centres[target]) { tg.hidden = true; return; }
    const v = centres[target], p = P(...v), b = byKey[target], name = b ? (ar() ? b.ar : b.latin) : target;
    const below = v[2] < -0.05;
    if (on(p, -30)) { tg.hidden = !below; if (below) tg.textContent = T(`${name} is below the horizon now.`, `${name} تحت الأفق الآن.`); el.querySelector('.ps-arrow').hidden = true; return; }
    // direction to turn: compare bearings and heights
    const taz = norm(Math.atan2(v[0], v[1]) * R2D), talt = Math.asin(v[2]) * R2D;
    let d = norm(taz - fc.az); if (d > 180) d -= 360;
    const turn = Math.abs(d) > 20 ? (d > 0 ? T('turn right', 'استدر يمينًا') : T('turn left', 'استدر يسارًا')) : (talt > fc.alt ? T('look higher', 'ارفع الهاتف') : T('look lower', 'اخفض الهاتف'));
    tg.hidden = false; tg.textContent = below ? T(`${name} is below the horizon now.`, `${name} تحت الأفق الآن.`) : `${name}: ${turn}`;
    const ang = Math.abs(d) > 20 ? (d > 0 ? 0 : 180) : (talt > fc.alt ? -90 : 90), ar_ = el.querySelector('.ps-arrow');
    ar_.hidden = below; ar_.style.transform = `translate(-50%, -50%) rotate(${ang}deg)`;
    const R = Math.min(W, Hh) / 2 - 46; ar_.style.left = (W / 2 + R * Math.cos(ang * D2R)) + 'px'; ar_.style.top = (Hh / 2 + R * Math.sin(ang * D2R)) + 'px';
  }
  function draw() { if (!raf && el) raf = requestAnimationFrame(frame); }
  function resize() {
    if (!el) return; dpr = Math.min(2, window.devicePixelRatio || 1); W = el.clientWidth; Hh = el.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr); cv.style.width = W + 'px'; cv.style.height = Hh + 'px'; draw();
  }

  // ---- sensors ----
  function onOri(ev) {
    if (ev.alpha === null || ev.beta === null) return;
    ori = {a: ev.alpha, b: ev.beta, g: ev.gamma || 0};
    if (typeof ev.webkitCompassHeading === 'number' && !ev.absolute) {
      // iOS: alpha starts wherever the phone pointed; the compass heading fixes it to north. Follow slowly to smooth out jumps.
      const k = norm(360 - ev.webkitCompassHeading - ev.alpha);
      if (headK === null) headK = k; else { let dd = k - headK; if (dd > 180) dd -= 360; if (dd < -180) dd += 360; if (Math.abs(dd) < 25) headK = norm(headK + dd * 0.05); }
    } else if (ev.absolute === true || ev.type === 'deviceorientationabsolute') headK = 0;
    if (mode === 'sensor') draw();
  }
  async function startSensors() {
    try { if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') { const r = await DeviceOrientationEvent.requestPermission(); if (r !== 'granted') throw new Error('denied'); } }
    catch (e) { setMode('drag', T('Motion access was not allowed, so you can drag to look around instead. To allow it, reload the page and tap Start again.', 'لم يُسمح بالوصول إلى حساسات الحركة، فيمكنك السحب للتجول في السماء. للسماح، أعد تحميل الصفحة واضغط «ابدأ» مرة أخرى.')); return; }
    addEventListener('deviceorientationabsolute', onOri); addEventListener('deviceorientation', onOri);
    ori = null; headK = null; setMode('sensor');
    setTimeout(() => { if (el && mode === 'sensor' && !ori) setMode('drag', T('This device has no motion sensors that the browser can use. Drag to look around.', 'لا يجد المتصفح حساسات حركة في هذا الجهاز. اسحب للتجول في السماء.')); }, 1800);
  }
  function stopSensors() { removeEventListener('deviceorientationabsolute', onOri); removeEventListener('deviceorientation', onOri); }
  function setMode(m, msg) {
    mode = m; if (!el) return;
    el.querySelector('[data-ps=mode]').textContent = m === 'sensor' ? T('Drag instead', 'السحب بدل الحساسات') : T('Use motion', 'استخدم الحركة');
    el.querySelector('.ps-nudge').hidden = m !== 'sensor';
    const note = el.querySelector('.ps-note'); note.hidden = !msg; if (msg) note.textContent = msg;
    if (m === 'drag') stopSensors();
    draw();
  }

  // ---- drag, pinch and wheel ----
  function gestures() {
    const pts = new Map(); let pinch = 0, last = null;
    cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); last = [e.clientX, e.clientY]; if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); } });
    cv.addEventListener('pointermove', e => {
      if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (pts.size === 2) { const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) fov = Math.max(20, Math.min(110, fov * pinch / d)); pinch = d; draw(); return; }
      if (!last) return; const dx = e.clientX - last[0], dy = e.clientY - last[1]; last = [e.clientX, e.clientY];
      const deg = fov / Hh;
      if (mode === 'drag') { view.az = norm(view.az - dx * deg); view.alt = Math.max(-89, Math.min(89, view.alt + dy * deg)); draw(); }
    });
    const up = e => { pts.delete(e.pointerId); if (pts.size < 2) pinch = 0; if (!pts.size) last = null; };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', e => { e.preventDefault(); fov = Math.max(20, Math.min(110, fov * Math.exp(e.deltaY * 0.001))); draw(); }, {passive: false});
  }

  // ---- open and close ----
  async function open(key) {
    target = key && byKey[key] ? key : null;
    if (el) close();
    el = document.createElement('div'); el.className = 'psky'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', T('Point at the sky', 'وجّه هاتفك إلى السماء'));
    if (ar()) { el.dir = 'rtl'; el.lang = 'ar'; }
    const tname = target ? (ar() ? byKey[target].ar : byKey[target].latin) : '';
    el.innerHTML = `<canvas aria-hidden="true"></canvas>
      <div class="ps-top"><button type="button" class="ps-x" data-ps="close" aria-label="${T('Close', 'إغلاق')}">×</button><div class="ps-t"><b>${T('Point at the sky', 'وجّه هاتفك إلى السماء')}</b><span class="ps-pl"></span></div>
        <div class="ps-tg"><button type="button" data-ps="art" aria-pressed="${showArt}">${T('Art', 'الرسوم')}</button><button type="button" data-ps="lines" aria-pressed="${showLines}">${T('Lines', 'الخطوط')}</button></div></div>
      <div class="ps-arrow" hidden aria-hidden="true">➜</div>
      <p class="ps-target" hidden></p><p class="ps-note" hidden></p>
      <div class="ps-bot"><span class="ps-dir"></span>
        <div class="ps-nudge" hidden><span>${T('Compass off?', 'البوصلة غير دقيقة؟')}</span><button type="button" data-ps="nl" aria-label="${T('Turn the sky left', 'أدر السماء يسارًا')}">◀</button><button type="button" data-ps="nr" aria-label="${T('Turn the sky right', 'أدر السماء يمينًا')}">▶</button><button type="button" data-ps="n0">${T('Reset', 'إعادة')}</button></div>
        <button type="button" class="ps-mode" data-ps="mode"></button></div>
      <div class="ps-start"><div class="ps-card"><h3>${T('Point at the sky', 'وجّه هاتفك إلى السماء')}</h3>
        <p>${target ? T(`Hold your phone up and move it around. An arrow shows you where ${tname} is.`, `ارفع هاتفك وحرّكه في السماء، وسيدلّك سهم على مكان ${tname}.`) : T('Hold your phone up and move it around: the screen shows the stars, constellations and planets in that direction.', 'ارفع هاتفك وحرّكه في السماء، فتُظهر الشاشة النجوم والكوكبات والكواكب في ذلك الاتجاه.')}</p>
        <p class="muted">${T('Your phone may ask to use motion and orientation. Away from metal and cars the compass works best; if the sky looks turned, use the ◀ ▶ buttons.', 'قد يطلب هاتفك إذنًا لاستخدام الحركة والاتجاه. تعمل البوصلة أفضل بعيدًا عن المعادن والسيارات، وإن بدت السماء مُدارة فاستخدم زرّي ◀ ▶.')}</p>
        <button type="button" class="pbtn ps-go" data-ps="go">${T('Start', 'ابدأ')}</button><button type="button" class="ps-alt" data-ps="drag">${T('No thanks, let me drag', 'لا، سأسحب بإصبعي')}</button></div></div>
      <p class="ps-credit">${cul() === 's' ? T("Figures: al-Sufi's Book of the Fixed Stars (public domain), placed with Khalid al-Ajaji's Stellarium data (CC BY-ND 4.0)", 'الرسوم: كتاب صور الكواكب للصوفي (ملكية عامة)، بمواضع من بيانات خالد العجاجي في Stellarium (CC BY-ND 4.0)') : T('Art: Johan Meuris for Stellarium (Free Art License) · lines: Stellarium (CC BY-SA) · stars: Hipparcos via d3-celestial', 'الرسوم: يوهان ميوريس لبرنامج Stellarium (رخصة الفن الحر) · الخطوط: Stellarium (CC BY-SA) · النجوم: هيباركوس عبر d3-celestial')}</p>`;
    document.body.appendChild(el); document.body.classList.add('psky-open');
    cv = el.querySelector('canvas'); ctx = cv.getContext('2d');
    el.addEventListener('click', onClick); addEventListener('resize', resize); addEventListener('orientationchange', resize); addEventListener('keydown', onKey);
    gestures();
    try { await load(); } catch (e) { el.querySelector('.ps-card').innerHTML = `<p>${T('The star data could not load. Check your connection and try again.', 'تعذّر تحميل بيانات النجوم. تحقّق من الاتصال وحاول مرة أخرى.')}</p><button type="button" class="pbtn" data-ps="close">${T('Close', 'إغلاق')}</button>`; return; }
    positions(); placeLine();
    if (target) { const c = D.cul[cul()][target]; if (c) { const t0 = centreOf(c); if (t0) { view.az = norm(Math.atan2(t0[0], t0[1]) * R2D); view.alt = Math.max(5, Math.asin(t0[2]) * R2D); } } }
    setMode('drag'); resize();
    el.querySelector('[data-ps=go]').focus();
  }
  // the place, and a word when the Sun is up and the stars cannot be seen
  function placeLine() {
    const sun = bodies.find(b => b.id === 'sun'), alt = sun ? Math.asin(sun.v[2]) * R2D : -90;
    el.querySelector('.ps-pl').textContent = pl.name + ' · ' + T('now', 'الآن') + (alt > -6 ? T(' · daylight: the stars are not visible yet', ' · نهار: النجوم لا تُرى الآن') : alt > -12 ? T(' · twilight: only the brightest stars show', ' · شفق: لا يظهر إلا ألمع النجوم') : '');
  }
  function centreOf(c) { let e = 0, n = 0, up = 0, k = 0; c.l.forEach(l => l.forEach(h => { const i = D.H.get(h); if (i !== undefined) { e += E[i]; n += N[i]; up += U[i]; k++; } })); return k ? [e / k, n / k, up / k] : null; }
  function onKey(e) { if (e.key === 'Escape') close(); }
  function onClick(e) {
    const b = e.target.closest('[data-ps]'); if (!b) return;
    const a = b.dataset.ps;
    if (a === 'close') close();
    else if (a === 'go') { el.querySelector('.ps-start').remove(); startSensors(); }
    else if (a === 'drag') { el.querySelector('.ps-start').remove(); setMode('drag', T('Drag to look around, and pinch to zoom.', 'اسحب للتجول في السماء، وباعد إصبعيك للتكبير.')); setTimeout(() => { const n = el && el.querySelector('.ps-note'); if (n) n.hidden = true; }, 4000); }
    else if (a === 'mode') { if (mode === 'sensor') { const fc = facing(camera()); view = {az: fc.az, alt: fc.alt}; setMode('drag'); } else startSensors(); }
    else if (a === 'art') { showArt = !showArt; b.setAttribute('aria-pressed', showArt); save(); draw(); }
    else if (a === 'lines') { showLines = !showLines; b.setAttribute('aria-pressed', showLines); save(); draw(); }
    else if (a === 'nl' || a === 'nr') { nudge = norm(nudge + (a === 'nl' ? -3 : 3)); if (nudge > 180) nudge -= 360; save(); draw(); }
    else if (a === 'n0') { nudge = 0; save(); draw(); }
  }
  function close() {
    if (!el) return; stopSensors(); cancelAnimationFrame(raf); raf = 0;
    removeEventListener('resize', resize); removeEventListener('orientationchange', resize); removeEventListener('keydown', onKey);
    el.remove(); el = null; document.body.classList.remove('psky-open');
  }
  // the button that opens it
  function btn(key, lang) {
    const a = lang === 'ar';
    return `<button type="button" class="psbtn" data-psky="${esc(key || '')}" title="${a ? 'وجّه هاتفك إلى السماء لترى النجوم في ذلك الاتجاه' : 'Hold your phone up to see the stars in that direction'}" aria-label="${a ? 'وجّه هاتفك إلى السماء' : 'Point at the sky'}"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M12 7.5l1.1 2.3 2.4.3-1.8 1.6.5 2.4L12 12.9l-2.2 1.2.5-2.4-1.8-1.6 2.4-.3z"/></svg><span class="psl">${a ? 'وجّه إلى السماء' : 'Point at the sky'}</span></button>`;
  }
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-psky]'); if (b) open(b.dataset.psky); });
  // used by the browser tests: a star's place on screen and in the sky (_probe), set the view (_view) or a phone orientation (_ori)
  function _probe(hip) { const i = D.H.get(hip); const cam = camera(), r = cam.r, u = cam.u, f = cam.f, k = (Hh / 2) / Math.tan(fov / 2 * D2R);
    const z = E[i] * f[0] + N[i] * f[1] + U[i] * f[2]; return {x: W / 2 + k * (E[i] * r[0] + N[i] * r[1] + U[i] * r[2]) / z, y: Hh / 2 - k * (E[i] * u[0] + N[i] * u[1] + U[i] * u[2]) / z, alt: Math.asin(U[i]) * R2D, az: norm(Math.atan2(E[i], N[i]) * R2D), W, H: Hh}; }
  return {open, close, btn, _probe, _view: v => { view = v; mode = 'drag'; draw(); }, _ori: o => { ori = o; headK = 0; mode = 'sensor'; draw(); }, _state: () => ({mode, fov, nudge, target, fc: el && D ? facing(camera()) : null})};
})();
