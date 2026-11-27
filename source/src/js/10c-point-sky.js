/* ---------- Point at the sky: hold the phone up and see the stars, lines, names and constellation art in that direction ----------
   Stars: Hipparcos via d3-celestial (BSD). Lines and art: Stellarium sky cultures. Western art by Johan Meuris (Free Art License);
   Arab sky: al-Sufi figures (public domain) placed with Khalid al-Ajaji's data (CC BY-ND 4.0), used unchanged.
   The data (assets/pointsky.*.js) and art (art/) load only when the view is opened. */
const PSKY_BODIES = new Set(['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn']);   // the ones the sky view draws
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
    // brightest first, so drawing can stop at the faintest star (or name) the view shows
    const ORD = Uint16Array.from({length: n}, (_, i) => i).sort((a, b) => M[a] - M[b]);
    const NM = []; for (const hip in d.names) { const i = H.get(+hip); if (i !== undefined) NM.push([i, d.names[hip]]); }
    NM.sort((a, b) => M[a[0]] - M[b[0]]);
    for (const set in d.cul) for (const key in d.cul[set]) { const c = d.cul[set][key]; c.li = c.l.map(l => l.map(h => { const i = H.get(h); return i === undefined ? -1 : i; })); }
    return {n, X, Y, Z, M, C, H, ORD, NM, names: d.names, cul: d.cul, sn: d.sn || {}, dso: d.dso || {}};
  }
  function starCol(bv) {
    if (bv < 0) return '#b9cdff'; if (bv < 0.3) return '#dfe7ff'; if (bv < 0.6) return '#fff8ee'; if (bv < 1.0) return '#ffe8c2'; if (bv < 1.4) return '#ffd29a'; return '#ffb27a';
  }
  // the soft glow round a bright star, made once per colour and reused (cheaper than a new gradient every frame)
  const glows = new Map();
  function glow(col) {
    let g = glows.get(col); if (g) return g;
    g = document.createElement('canvas'); g.width = g.height = 64; const x = g.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); glows.set(col, g); return g;
  }

  // ---- state ----
  let scratch = null, sctx = null, FONT = 'sans-serif', cen = null, cenFor = '', showDso = true, el = null, cv = null, ctx = null, W = 0, Hh = 0, dpr = 1, raf = 0;
  let mode = 'drag';            // 'sensor' or 'drag'
  let ori = null;               // last device orientation {a, b, g}
  let headK = null;             // offset that turns the gyroscope's alpha into a true-north one (from the compass, or from lining up)
  let lined = false;            // the user lined the view up on something in the sky: the compass is not used after that
  let gotRel = false, comp = null;
  let nudge = 0;                // the user's compass correction, degrees
  let view = {az: 180, alt: 35};  // drag mode
  let fov = 70;                 // vertical field of view, degrees
  let target = null;            // what to find: {kind: 'con'|'star'|'dso'|'body', key, hip, id, name: [en, ar]}
  let artSet = '', showLines = true;   // artSet: 'w' western, 's' al-Sufi, 'off'; '' = the usual one for the sky culture
  let E, N, U, pl, tNow = 0, lastPos = 0, bodies = [], dsos = [];
  const imgs = new Map();
  let gl = null, glc = null, ui = null;   // the drawings' layer on the graphics chip (WebGL), and the parts of the view updated every frame
  try { const s = JSON.parse(localStorage.getItem('osms-psky') || '{}'); if (typeof s.nudge === 'number') nudge = s.nudge; if (['w', 's', 'off'].includes(s.art)) artSet = s.art; if (s.lines === false) showLines = false; if (s.dso === false) showDso = false; } catch (e) {}
  const save = () => { try { localStorage.setItem('osms-psky', JSON.stringify({nudge, art: artSet, lines: showLines, dso: showDso})); } catch (e) {} };
  const ar = () => state.lang === 'ar';
  const T = (en, a) => (ar() ? a : en);
  const cul = () => (artSet === 'w' || artSet === 's' ? artSet : state.cul === 'arab' ? 's' : 'w');

  // ---- where the stars are now: east, north and up parts of each star's direction ----
  function place() { const p = placeObj(); return {lat: p.lat, lon: p.lon, md: p.md || 0, name: ar() ? p.ar : p.en}; }
  function positions() {
    tNow = Date.now(); pl = place(); lastPos = tNow; cen = null;
    const lst = norm(280.46061837 + 360.98564736629 * (tNow / 864e5 + 2440587.5 - 2451545) + pl.lon) * D2R, la = pl.lat * D2R;
    const sL = Math.sin(lst), cL = Math.cos(lst), sp = Math.sin(la), cp = Math.cos(la);
    if (!E) { E = new Float32Array(D.n); N = new Float32Array(D.n); U = new Float32Array(D.n); }
    for (let i = 0; i < D.n; i++) {
      // hour angle H = LST - RA: cos H and sin H from the star's x, y
      const x = D.X[i], y = D.Y[i], z = D.Z[i], cH = x * cL + y * sL, sH = x * sL - y * cL;
      E[i] = -sH; N[i] = z * cp - cH * sp; U[i] = z * sp + cH * cp;
    }
    dsos = Object.entries(D.dso).map(([id, [ra, dec, cat]]) => ({id, cat, v: eq2h(ra, dec, lst, sp, cp)}));
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
  // ---- holding the view steady: the motion sensors are noisy and no hand is perfectly still ----
  // An adaptive smoother (the "1 euro filter" used for motion tracking): held still, the view is smoothed heavily so what you point at
  // stays put; the faster the phone turns, the less it is smoothed, so turning still feels direct.
  let sm = null;
  function steady(c) {
    if (mode !== 'sensor' || !ori) { sm = null; return c; }
    const now = performance.now();
    if (!sm) { sm = {f: c.f.slice(), u: c.u.slice(), v: [0, 0, 0], t: now}; return c; }
    const dt = Math.max(1, Math.min(100, now - sm.t)) / 1000; sm.t = now;
    const al = hz => 1 / (1 + 1 / (2 * Math.PI * hz * dt));   // smoothing step for a cut-off frequency
    // how fast the phone is really turning: the change, itself smoothed, so the jitter averages out
    const aD = al(0.8); sm.v = sm.v.map((x, i) => x + ((c.f[i] - sm.f[i]) / dt - x) * aD);
    const speed = Math.hypot(...sm.v) * R2D;   // degrees a second
    const a = al(0.25 + 0.04 * speed);
    const unit = v => { const m = Math.hypot(...v) || 1; return v.map(x => x / m); };
    const f = unit(sm.f.map((x, i) => x + (c.f[i] - x) * a));
    let u = sm.u.map((x, i) => x + (c.u[i] - x) * a); const d = u[0] * f[0] + u[1] * f[1] + u[2] * f[2]; u = unit(u.map((x, i) => x - d * f[i]));
    sm.left = Math.hypot(...c.f.map((x, i) => x - f[i])) * R2D; sm.f = f; sm.u = u;
    return {f, u, r: [f[1] * u[2] - f[2] * u[1], f[2] * u[0] - f[0] * u[2], f[0] * u[1] - f[1] * u[0]]};
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
  function inv3(m) {
    const [[a, b, c], [d, e, f], [g, h, i]] = m, A = e * i - f * h, B = f * g - d * i, C = d * h - e * g, det = a * A + b * B + c * C;
    return [[A / det, (c * h - b * i) / det, (b * f - c * e) / det], [B / det, (a * i - c * g) / det, (c * d - a * f) / det], [C / det, (b * g - a * h) / det, (a * e - b * d) / det]];
  }
  // draw one triangle of a picture: p0..p2 on screen, s0..s2 in the picture; only the cell (x0, y0)-(x1, y1) of the image is used.
  // Each triangle is a little bigger than exact, so neighbours meet without a gap.
  function tri(c2, im, kx, ky, p0, p1, p2, s0, s1, s2, x0, y0, x1, y1) {
    const [u0, v0] = s0, [u1, v1] = s1, [u2, v2] = s2, det = u0 * (v1 - v2) + u1 * (v2 - v0) + u2 * (v0 - v1); if (!det) return;
    const a = (p0[0] * (v1 - v2) + p1[0] * (v2 - v0) + p2[0] * (v0 - v1)) / det, c = (u0 * (p1[0] - p2[0]) + u1 * (p2[0] - p0[0]) + u2 * (p0[0] - p1[0])) / det, e = p0[0] - a * u0 - c * v0;
    const b = (p0[1] * (v1 - v2) + p1[1] * (v2 - v0) + p2[1] * (v0 - v1)) / det, d = (u0 * (p1[1] - p2[1]) + u1 * (p2[1] - p0[1]) + u2 * (p0[1] - p1[1])) / det, f = p0[1] - b * u0 - d * v0;
    const gx = (p0[0] + p1[0] + p2[0]) / 3, gy = (p0[1] + p1[1] + p2[1]) / 3, g = p => { const dx = p[0] - gx, dy = p[1] - gy, l = Math.hypot(dx, dy) || 1; return [p[0] + dx / l * 0.8, p[1] + dy / l * 0.8]; };
    const [q0, q1, q2] = [g(p0), g(p1), g(p2)];
    const m = 2, W2 = im.naturalWidth / kx, H2 = im.naturalHeight / ky, sx = Math.max(0, x0 - m), sy = Math.max(0, y0 - m), ex = Math.min(W2, x1 + m), ey = Math.min(H2, y1 + m);
    c2.save(); c2.beginPath(); c2.moveTo(q0[0], q0[1]); c2.lineTo(q1[0], q1[1]); c2.lineTo(q2[0], q2[1]); c2.closePath(); c2.clip();
    c2.transform(a, b, c, d, e, f); c2.drawImage(im, sx * kx, sy * ky, (ex - sx) * kx, (ey - sy) * ky, sx, sy, ex - sx, ey - sy);
    c2.restore();
  }
  // ---- the drawings on the graphics chip ----
  // Each drawing is a flat picture laid on the sky through three stars; seen through this projection a flat picture is just a
  // picture in perspective, so the chip places it exactly from its four corners. Much faster than cutting it into triangles.
  // without WebGL: the picture is cut into a grid of triangles, drawn on a scratch canvas, then laid on the sky
  function art2D({cf, im, sw, sh, alpha}, P, on) {
    if (!scratch) { scratch = document.createElement('canvas'); sctx = scratch.getContext('2d'); }
    const G = 6, grid = [];
    for (let gy = 0; gy <= G; gy++) for (let gx = 0; gx <= G; gx++) {
      const x = sw * gx / G, y = sh * gy / G;
      grid.push(P(cf[0][0] * x + cf[0][1] * y + cf[0][2], cf[1][0] * x + cf[1][1] * y + cf[1][2], cf[2][0] * x + cf[2][1] * y + cf[2][2]));
    }
    const vis = grid.filter(p => p); if (!vis.some(p => on(p))) return;
    const AR = 0.7;   // drawn at 70% size and scaled up: they are soft, and it halves the work
    const bx = Math.max(0, Math.floor(Math.min(...vis.map(p => p[0])) - 2)), by = Math.max(0, Math.floor(Math.min(...vis.map(p => p[1])) - 2));
    const ex = Math.min(Math.round(W), Math.ceil(Math.max(...vis.map(p => p[0])) + 2)), ey = Math.min(Math.round(Hh), Math.ceil(Math.max(...vis.map(p => p[1])) + 2));
    if (ex - bx < 2 || ey - by < 2) return;
    const sw2 = Math.ceil((ex - bx) * AR), sh2 = Math.ceil((ey - by) * AR);
    if (scratch.width < sw2) scratch.width = sw2; if (scratch.height < sh2) scratch.height = sh2;
    sctx.setTransform(1, 0, 0, 1, 0, 0); sctx.clearRect(0, 0, sw2, sh2); sctx.setTransform(AR, 0, 0, AR, 0, 0);
    const kx = im.naturalWidth / sw, ky = im.naturalHeight / sh, o = p => [p[0] - bx, p[1] - by];
    for (let gy = 0; gy < G; gy++) for (let gx = 0; gx < G; gx++) {
      const i0 = gy * (G + 1) + gx, q = [grid[i0], grid[i0 + 1], grid[i0 + G + 1], grid[i0 + G + 2]];
      if (q.some(p => !p) || !q.some(p => on(p, 40))) continue;
      const x0 = sw * gx / G, x1 = sw * (gx + 1) / G, y0 = sh * gy / G, y1 = sh * (gy + 1) / G;
      tri(sctx, im, kx, ky, o(q[0]), o(q[1]), o(q[2]), [x0, y0], [x1, y0], [x0, y1], x0, y0, x1, y1);
      tri(sctx, im, kx, ky, o(q[1]), o(q[3]), o(q[2]), [x1, y0], [x1, y1], [x0, y1], x0, y0, x1, y1);
    }
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = alpha; ctx.drawImage(scratch, 0, 0, sw2, sh2, bx, by, sw2 / AR, sh2 / AR); ctx.restore();
  }
  function glInit(c) {
    try {
      const g = c.getContext('webgl', {alpha: false, antialias: false, depth: false, stencil: false});
      if (!g) return null;
      const sh = (t, src) => { const o = g.createShader(t); g.shaderSource(o, src); g.compileShader(o); g.attachShader(prog, o); };
      const prog = g.createProgram();
      // a_p: screen x, y in pixels times w, and w (the depth, so the picture is drawn in true perspective and cut at the edge of view)
      // a_t: picture position (u, v) for a drawing, or the colour for the sky behind it
      sh(g.VERTEX_SHADER, 'attribute vec3 a_p; attribute vec3 a_t; uniform vec2 u_s; varying vec3 v_t; void main() { v_t = a_t; gl_Position = vec4(2.0 * a_p.x / u_s.x - a_p.z, a_p.z - 2.0 * a_p.y / u_s.y, 0.0, a_p.z); }');
      sh(g.FRAGMENT_SHADER, 'precision mediump float; varying vec3 v_t; uniform sampler2D u_i; uniform float u_k; uniform float u_m; void main() { gl_FragColor = u_m > 0.5 ? texture2D(u_i, v_t.xy) * u_k : vec4(v_t, 1.0); }');
      g.linkProgram(prog); if (!g.getProgramParameter(prog, g.LINK_STATUS)) return null;
      g.useProgram(prog); g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
      const ap = g.getAttribLocation(prog, 'a_p'), at = g.getAttribLocation(prog, 'a_t');
      g.enableVertexAttribArray(ap); g.vertexAttribPointer(ap, 3, g.FLOAT, false, 24, 0);
      g.enableVertexAttribArray(at); g.vertexAttribPointer(at, 3, g.FLOAT, false, 24, 12);
      g.blendFunc(g.ONE, g.ONE_MINUS_SRC_COLOR);   // "screen", as the 2D version: the drawings lighten the sky and never darken it
      g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      g.U = {s: g.getUniformLocation(prog, 'u_s'), k: g.getUniformLocation(prog, 'u_k'), m: g.getUniformLocation(prog, 'u_m')};
      g.tex = new Map(); return g;
    } catch (e) { return null; }
  }
  // a picture becomes a texture once: copied to a power-of-two size so it can be smoothed when it is small on screen
  function glTex(im) {
    let t = gl.tex.get(im); if (t) return t;
    const pw = v => Math.min(1024, 2 ** Math.round(Math.log2(v))), cnv = document.createElement('canvas');
    cnv.width = pw(im.naturalWidth); cnv.height = pw(im.naturalHeight); cnv.getContext('2d').drawImage(im, 0, 0, cnv.width, cnv.height);
    t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cnv);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D); gl.tex.set(im, t); return t;
  }
  // sky colour top and bottom, then each drawing: its four corners in screen space with their depth
  function glDraw(top, bot, arts, cam, k) {
    const hex = h => [1, 3, 5].map(o => parseInt(h.slice(o, o + 2), 16) / 255);
    gl.viewport(0, 0, glc.width, glc.height); gl.uniform2f(gl.U.s, W, Hh);
    const [t, b] = [hex(top), hex(bot)];
    gl.disable(gl.BLEND); gl.uniform1f(gl.U.m, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, ...t, W, 0, 1, ...t, 0, Hh, 1, ...b, W, Hh, 1, ...b]), gl.DYNAMIC_DRAW); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!arts.length) return;
    gl.enable(gl.BLEND); gl.uniform1f(gl.U.m, 1);
    const {r, u, f} = cam, cx = W / 2, cy = Hh / 2;
    for (const {cf, sw, sh, im, alpha} of arts) {
      const v = [];
      for (const [x, y] of [[0, 0], [sw, 0], [0, sh], [sw, sh]]) {
        const e = cf[0][0] * x + cf[0][1] * y + cf[0][2], n = cf[1][0] * x + cf[1][1] * y + cf[1][2], up = cf[2][0] * x + cf[2][1] * y + cf[2][2];
        const z = e * f[0] + n * f[1] + up * f[2];
        v.push(cx * z + k * (e * r[0] + n * r[1] + up * r[2]), cy * z - k * (e * u[0] + n * u[1] + up * u[2]), z, x / sw, y / sh, 0);
      }
      gl.bindTexture(gl.TEXTURE_2D, glTex(im)); gl.uniform1f(gl.U.k, alpha);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.DYNAMIC_DRAW); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }
  function frame() {
    raf = 0; if (!el) return;
    if (Date.now() - lastPos > 20000) { positions(); placeLine(); }
    const cam = steady(camera()), r = cam.r, u = cam.u, f = cam.f;
    const k = (Hh / 2) / Math.tan(fov / 2 * D2R), cx = W / 2, cy = Hh / 2;
    const P = (e, n, up) => { const z = e * f[0] + n * f[1] + up * f[2]; if (z <= 0.05) return null; return [cx + k * (e * r[0] + n * r[1] + up * r[2]) / z, cy - k * (e * u[0] + n * u[1] + up * u[2]) / z, z]; };
    const on = (p, m = 0) => p && p[0] > -m && p[0] < W + m && p[1] > -m && p[1] < Hh + m;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const fc = facing(cam);
    // ---- the sky's colour follows the Sun, as in Stellarium: night, twilight, day ----
    const sunB = bodies.find(b => b.id === 'sun'), sunAlt = sunB ? Math.asin(sunB.v[2]) * R2D : -90;
    const dayK = Math.max(0, Math.min(1, (sunAlt + 12) / 14));   // 0 at night, 1 in daylight
    const mix = (a, b, t) => '#' + [0, 2, 4].map(o => Math.round(parseInt(a.slice(1 + o, 3 + o), 16) * (1 - t) + parseInt(b.slice(1 + o, 3 + o), 16) * t).toString(16).padStart(2, '0')).join('');
    const skyTop = mix('#02040b', '#2c5f9e', dayK), skyBot = mix(fc.alt < 20 ? '#0c1630' : '#060b1a', '#8cb4df', dayK);
    if (gl) ctx.clearRect(0, 0, W, Hh);
    else { const g = ctx.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, skyTop); g.addColorStop(1, skyBot); ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh); }
    const starK = 1 - dayK * 0.65;   // stars fade by day but stay findable
    const c = D.cul[cul()], sc = Math.min(1.6, Math.max(0.7, 70 / fov));
    if (!artSet) artSet = cul();
    // ---- which figures are near the middle of the screen: like Stellarium Mobile, their lines and drawings show clearly ----
    // the middles of the figures move only with time, so they are worked out again only when the positions are
    if (!cen || cenFor !== cul()) {
      cen = {}; cenFor = cul();
      for (const key in c) {
        let e = 0, n = 0, up = 0, cnt = 0; const seen = new Set();
        c[key].l.forEach(l => l.forEach(hip => { const i = D.H.get(hip); if (i === undefined || seen.has(i)) return; seen.add(i); e += E[i]; n += N[i]; up += U[i]; cnt++; }));
        if (cnt) { const m = Math.hypot(e, n, up); cen[key] = [e / m, n / m, up / m]; }
      }
    }
    const centres = cen, near = {};
    for (const key in centres) {
      const v = centres[key], ang = Math.acos(Math.max(-1, Math.min(1, v[0] * f[0] + v[1] * f[1] + v[2] * f[2]))) * R2D;
      near[key] = Math.max(0, Math.min(1, 1 - (ang - fov * 0.16) / (fov * 0.34)));
    }
    const tk = tgt(c);
    // ---- constellation art: only the drawings near the middle of the screen (the nearest two), fading in as they come closer ----
    const arts = [];
    if (artSet !== 'off') {
      const artA = (artSet === 's' ? 0.55 : 0.6) * (1 - dayK * 0.5), show = key => Math.max(0, Math.min(1, ((near[key] || 0) - 0.45) / 0.4));
      const keys = Object.keys(c).filter(key => c[key].a && show(key) > 0.08).sort((x, y) => near[y] - near[x]).slice(0, 2);
      for (const key of keys) {
        const a = c[key].a;
        let im = imgs.get(a.f); if (!im) { im = new Image(); im.onload = () => draw(); im.src = 'art/' + a.f; imgs.set(a.f, im); }
        if (!im.complete || !im.naturalWidth) continue;
        // three anchor stars fix the picture's plane: picture (x, y, 1) -> sky direction
        const V = a.p.map(([, , hip]) => { const i = D.H.get(hip); return [E[i], N[i], U[i]]; });
        if (!a.inv) a.inv = inv3(a.p.map(([x, y]) => [x, y, 1]));
        const cf = [0, 1, 2].map(k => [0, 1, 2].map(r => a.inv[r][0] * V[0][k] + a.inv[r][1] * V[1][k] + a.inv[r][2] * V[2][k]));
        const low = V.every(v => v[2] < 0);
        arts.push({cf, im, sw: a.sz[0], sh: a.sz[1], alpha: (key === tk ? 0.95 : artSet === 's' ? 0.5 : 0.55) * show(key) * (low ? 0.4 : 1) * artA});
      }
    }
    if (gl) glDraw(skyTop, skyBot, arts, cam, k); else arts.forEach(a => art2D(a, P, on));
    // ---- constellation lines: clear near the middle, faint further out ----
    if (showLines) {
      const groups = {};   // by strength in eighths; 't' (drawn last, in gold) is the figure being looked for
      for (const key in c) {
        const gk = key === tk ? 't' : Math.round((near[key] || 0) * 8), path = groups[gk] || (groups[gk] = new Path2D());
        for (const l of c[key].li) {
          let prev = null;
          for (const i of l) {
            const p = i < 0 ? null : P(E[i], N[i], U[i]);
            if (p && prev && (on(p, W) || on(prev, W))) { path.moveTo(prev[0], prev[1]); path.lineTo(p[0], p[1]); }
            prev = p;
          }
        }
      }
      ctx.lineCap = 'round';
      for (const gk in groups) {
        if (gk === 't') { ctx.strokeStyle = 'rgba(240,192,96,.95)'; ctx.lineWidth = 1.8; }
        else { const nr = gk / 8; ctx.strokeStyle = `rgba(110,160,230,${((0.16 + 0.6 * nr) * (1 - dayK * 0.4)).toFixed(3)})`; ctx.lineWidth = 1 + 0.5 * nr; }
        ctx.stroke(groups[gk]);
      }
    }
    // ---- stars, with a soft glow around the bright ones ----
    const lim = (fov > 80 ? 5.2 : fov > 50 ? 5.7 : 6.2) - dayK * 2.5, batch = new Map();
    for (const i of D.ORD) {
      if (D.M[i] > lim) break;   // brightest first: the rest are fainter still
      const z = E[i] * f[0] + N[i] * f[1] + U[i] * f[2]; if (z <= 0.05) continue;
      const x = cx + k * (E[i] * r[0] + N[i] * r[1] + U[i] * r[2]) / z, y = cy - k * (E[i] * u[0] + N[i] * u[1] + U[i] * u[2]) / z;
      if (x < -8 || x > W + 8 || y < -8 || y > Hh + 8) continue;
      const rad = Math.max(0.55, (3.4 - 0.55 * D.M[i]) * sc), a = Math.min(1, 1.25 - D.M[i] * 0.12) * starK;
      if (D.M[i] < 1.8) { const R = rad * 4.5; ctx.globalAlpha = 0.28 * a; ctx.drawImage(glow(D.C[i]), x - R, y - R, 2 * R, 2 * R); }
      const bk = D.C[i] + Math.round(a * 10); let L = batch.get(bk); if (!L) batch.set(bk, L = []); L.push(x, y, rad);
    }
    for (const [bk, L] of batch) {
      ctx.globalAlpha = +bk.slice(7) / 10; ctx.fillStyle = bk.slice(0, 7); ctx.beginPath();
      for (let j = 0; j < L.length; j += 3) { ctx.moveTo(L[j] + L[j + 2], L[j + 1]); ctx.arc(L[j], L[j + 1], L[j + 2], 0, 6.2832); }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    // ---- deep-sky objects (the ones on the site's pages), once zoomed in a little ----
    if (showDso && fov <= 75) {
      ctx.font = `12px ${FONT}`; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      // all the little ellipses in one stroke
      ctx.globalAlpha = 0.8 * starK; ctx.strokeStyle = '#7fd0c0'; ctx.lineWidth = 1.2; ctx.fillStyle = '#9fdccf'; ctx.beginPath();
      const shown = [];
      for (const d of dsos) { const p = P(...d.v); if (!on(p)) continue; ctx.moveTo(p[0] + 5.5 * Math.cos(0.5), p[1] - 5.5 * Math.sin(0.5)); ctx.ellipse(p[0], p[1], 5.5, 3.5, -0.5, 0, 6.2832); shown.push([d, p]); }
      ctx.stroke();
      if (fov <= 40) shown.forEach(([d, p]) => ctx.fillText(d.cat, p[0] + 8, p[1] + 4));
      ctx.globalAlpha = 1;
    }
    // ---- Sun, Moon and planets ----
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    bodies.forEach(b => {
      const p = P(...b.v); if (!on(p, 20)) return;
      const rad = b.id === 'sun' ? 12 : b.id === 'moon' ? 10 : Math.max(2.4, 4.2 - 0.4 * b.mag);
      if (b.id === 'sun') { const gg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 60); gg.addColorStop(0, 'rgba(255,240,190,.75)'); gg.addColorStop(1, 'rgba(255,240,190,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(p[0], p[1], 60, 0, 6.2832); ctx.fill(); }
      ctx.fillStyle = b.col; ctx.beginPath(); ctx.arc(p[0], p[1], rad, 0, 6.2832); ctx.fill();
      if (b.id === 'moon' && b.illum < 0.98) {
        // the dark part: from the unlit edge round to the terminator, an ellipse whose width follows the phase
        const sg = b.waxing ? -1 : 1, tx = rad * (1 - 2 * b.illum); ctx.fillStyle = 'rgba(6,10,20,.88)'; ctx.beginPath();
        for (let q = 0; q <= 20; q++) { const t = -Math.PI / 2 + Math.PI * q / 20; ctx.lineTo(p[0] + sg * rad * Math.cos(t), p[1] + rad * Math.sin(t)); }
        for (let q = 20; q >= 0; q--) { const t = -Math.PI / 2 + Math.PI * q / 20; ctx.lineTo(p[0] - sg * tx * Math.cos(t), p[1] + rad * Math.sin(t)); }
        ctx.fill();
      }
      ctx.fillStyle = b.id === 'sun' || b.id === 'moon' ? '#fff3d6' : b.col; ctx.font = `600 13px ${FONT}`; ctx.fillText(ar() ? b.ar : b.en, p[0] + rad + 5, p[1] - rad);
    });
    // ---- the ground, as in Stellarium: everything below the horizon sits behind it ----
    // On this kind of projection the horizon is a straight line on screen, so the ground is the screen cut along that line.
    const gnd = (x, y) => f[2] + r[2] * (x - cx) / k - u[2] * (y - cy) / k;   // the height of the ray through (x, y): below 0 is ground
    const poly = [], corners = [[0, 0], [W, 0], [W, Hh], [0, Hh]];
    corners.forEach((a, i) => { const b = corners[(i + 1) % 4], ga = gnd(...a), gb = gnd(...b); if (ga < 0) poly.push(a); if ((ga < 0) !== (gb < 0)) { const t = ga / (ga - gb); poly.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); } });
    if (poly.length > 2) {
      ctx.fillStyle = dayK > 0.5 ? 'rgba(46,58,40,.92)' : 'rgba(10,18,14,.9)'; ctx.beginPath(); poly.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(120,200,150,.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); let pv = null;
    for (let az = 0; az <= 360; az += 3) { const p = P(Math.sin(az * D2R), Math.cos(az * D2R), 0); if (p && pv) { ctx.moveTo(pv[0], pv[1]); ctx.lineTo(p[0], p[1]); } pv = p; }
    ctx.stroke();
    // compass points in red, like Stellarium's
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const pts = ar() ? ['ش', 'ش ق', 'ق', 'ج ق', 'ج', 'ج غ', 'غ', 'ش غ'] : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    pts.forEach((t, i) => { const az = i * 45 * D2R, p = P(Math.sin(az), Math.cos(az), 0); if (on(p)) { ctx.font = `700 ${i % 2 ? 14 : 19}px ${FONT}`; ctx.fillStyle = i % 2 ? 'rgba(230,110,90,.75)' : '#ff6a4d'; ctx.fillText(t, p[0], p[1] - 14); } });
    // ---- names ----
    ctx.textBaseline = 'alphabetic'; ctx.font = `13px ${FONT}`; ctx.textAlign = 'left';
    const nmLim = fov > 80 ? 1.6 : fov > 45 ? 2.3 : 3.2;
    ctx.fillStyle = dayK > 0.5 ? 'rgba(255,255,255,.85)' : 'rgba(205,215,235,.8)';
    for (const [i, nm] of D.NM) {
      if (D.M[i] > nmLim) break; if (U[i] < 0) continue;
      const p = P(E[i], N[i], U[i]); if (!on(p)) continue;
      ctx.fillText(ar() && nm[1] ? nm[1] : nm[0], p[0] + 6, p[1] - 6);
    }
    ctx.font = `600 13px ${FONT}`; ctx.textAlign = 'center';
    for (const key in centres) {
      const p = P(...centres[key]); if (!on(p) || centres[key][2] < -0.03) continue;
      const b = byKey[key], nm = c[key].n || [key, ''];
      const t = cul() === 's' ? (ar() ? nm[1] || nm[0] : nm[0]) : b ? (ar() ? b.ar : b.latin) : nm[0];
      ctx.globalAlpha = key === tk ? 1 : 0.45 + 0.5 * (near[key] || 0);
      ctx.fillStyle = key === tk ? '#f0c060' : '#8fb8f0'; ctx.fillText(t, p[0], p[1]);
    }
    ctx.globalAlpha = 1;
    // ---- the object being looked for: Stellarium's four-corner pointer, and a guide line from the middle of the screen ----
    let ptrAt = null;
    if (target) {
      const v = tVec(centres), p = v && P(...v);
      if (on(p, 20)) {
        const dx = p[0] - cx, dy = p[1] - cy, dist = Math.hypot(dx, dy);
        if (dist > 26) {
          ctx.save(); ctx.setLineDash([6, 6]); ctx.strokeStyle = 'rgba(255,140,80,.85)'; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(cx + dx / dist * 14, cy + dy / dist * 14); ctx.lineTo(p[0] - dx / dist * 24, p[1] - dy / dist * 24); ctx.stroke(); ctx.restore();
          ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, 9, 0, 6.2832); ctx.stroke();
        }
        if (target.kind !== 'con') ptrAt = p;
      }
    }
    const ptr = ui.ptr;
    put(ptr, 'hidden', !ptrAt);
    if (ptrAt) { ptr.style.transform = `translate(${ptrAt[0] - 22}px, ${ptrAt[1] - 22}px)`; put(ptr.lastChild, 'textContent', target.kind === 'body' ? '' : tName()); }
    // what is being looked for: an arrow at the edge when it is off screen
    hud(fc, centres, P, on);
    if (sm && sm.left > 0.02) draw();   // still easing towards where the phone points
  }
  function tVec(centres) {
    if (!target) return null;
    if (target.kind === 'con') return centres[target.key] || null;
    if (target.kind === 'star') { const i = D.H.get(target.hip); return i === undefined ? null : [E[i], N[i], U[i]]; }
    if (target.kind === 'dso') { const d = dsos.find(x => x.id === target.id); return d ? d.v : null; }
    const b = bodies.find(x => x.id === target.id); return b ? b.v : null;
  }
  function tName() { return target ? (ar() && target.name[1] ? target.name[1] : target.name[0]) : ''; }
  // set a property of a page element only when it changes (writing the same text again still costs the phone work)
  function put(node, k, v) { if (node[k] !== v) node[k] = v; }
  function hud(fc, centres, P, on) {
    const {dir, tg, arrow} = ui;
    const cards = ar() ? ['الشمال', 'الشمال الشرقي', 'الشرق', 'الجنوب الشرقي', 'الجنوب', 'الجنوب الغربي', 'الغرب', 'الشمال الغربي'] : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const al = Math.round(Math.abs(fc.alt));
    put(dir, 'textContent', (ar() ? 'تنظر نحو ' : 'Facing ') + cards[Math.round(fc.az / 45) % 8] + ' · ' + (ar() ? `${al}° ${fc.alt >= 0 ? 'فوق الأفق' : 'تحت الأفق'}` : `${al}° ${fc.alt >= 0 ? 'up' : 'below the horizon'}`));
    const v = tVec(centres); if (!v) { put(tg, 'hidden', true); put(arrow, 'hidden', true); return; }
    const p = P(...v), name = tName();
    const below = v[2] < -0.05;
    if (on(p, -30)) {
      const centred = Math.hypot(p[0] - W / 2, p[1] - Hh / 2) < Math.min(W, Hh) * 0.09;
      put(tg, 'hidden', !below && !centred); tg.classList.toggle('found', centred && !below);
      if (below) put(tg, 'textContent', T(`${name} is below the horizon now.`, `${name} تحت الأفق الآن.`)); else if (centred) put(tg, 'textContent', T(`You are pointing at ${name}`, `أنت تشير إلى ${name}`));
      put(arrow, 'hidden', true); return;
    }
    tg.classList.remove('found');
    // direction to turn: compare bearings and heights
    const taz = norm(Math.atan2(v[0], v[1]) * R2D), talt = Math.asin(v[2]) * R2D;
    let d = norm(taz - fc.az); if (d > 180) d -= 360;
    const turn = Math.abs(d) > 20 ? (d > 0 ? T('turn right', 'استدر يمينًا') : T('turn left', 'استدر يسارًا')) : (talt > fc.alt ? T('look higher', 'ارفع الهاتف') : T('look lower', 'اخفض الهاتف'));
    put(tg, 'hidden', false); put(tg, 'textContent', below ? T(`${name} is below the horizon now.`, `${name} تحت الأفق الآن.`) : `${name}: ${turn}`);
    const ang = Math.abs(d) > 20 ? (d > 0 ? 0 : 180) : (talt > fc.alt ? -90 : 90), R = Math.min(W, Hh) / 2 - 46;
    put(arrow, 'hidden', below); put(arrow.style, 'transform', `translate(-50%, -50%) rotate(${ang}deg)`);
    put(arrow.style, 'left', (W / 2 + R * Math.cos(ang * D2R)) + 'px'); put(arrow.style, 'top', (Hh / 2 + R * Math.sin(ang * D2R)) + 'px');
  }
  function draw() { if (!raf && el) raf = requestAnimationFrame(frame); }
  function resize() {
    if (!el) return; dpr = Math.min(2, window.devicePixelRatio || 1); W = el.clientWidth; Hh = el.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr); cv.style.width = W + 'px'; cv.style.height = Hh + 'px';
    if (gl) { glc.width = Math.round(W); glc.height = Math.round(Hh); glc.style.width = cv.style.width; glc.style.height = cv.style.height; }   // soft sky and drawings: normal resolution is enough, a quarter of the work on sharp screens
    draw();
  }

  // ---- sensors ----
  // The gyroscope (the relative orientation) drives the picture: smooth, and not upset by metal or magnets. The compass is only
  // used to say where north is: read carefully at the start, then trusted only if it keeps disagreeing. Lining up on something in
  // the sky replaces it altogether.
  function onOri(ev) {
    if (ev.alpha === null || ev.beta === null) return;
    const abs = ev.type === 'deviceorientationabsolute' || ev.absolute === true, now = performance.now();
    if (!abs) gotRel = true;
    if (!abs || !gotRel) ori = {a: ev.alpha, b: ev.beta, g: ev.gamma || 0};
    // a compass reading, turned into the offset it implies (magnetic north corrected to true north for the chosen place)
    let ca = null, good = true;
    if (typeof ev.webkitCompassHeading === 'number' && ev.webkitCompassHeading >= 0) { ca = 360 - ev.webkitCompassHeading; const acc = ev.webkitCompassAccuracy; good = acc >= 0 && acc <= 30; }
    else if (abs) ca = ev.alpha;
    if (ca !== null && ori) compass(norm(ca - (pl ? pl.md : 0) - ori.a), good, now);
    if (mode === 'sensor') draw();
  }
  const adiff = (a, b) => { let d = norm(a - b); return d > 180 ? d - 360 : d; };
  const cmean = l => norm(Math.atan2(l.reduce((s, x) => s + Math.sin(x * D2R), 0), l.reduce((s, x) => s + Math.cos(x * D2R), 0)) * R2D);
  function compass(k, good, now) {
    if (lined) return;
    if (!comp) comp = {t0: now, ok: [], any: [], lock: false, off: null, offL: []};
    const c = comp;
    if (!c.lock) {
      // the first second of good readings, averaged; if none are good after four seconds, the best there is (and a word about calibrating)
      (good ? c.ok : c.any).push(k); if (c.any.length > 60) c.any.shift();
      if (c.ok.length) headK = cmean(c.ok); else if (headK === null || c.any.length < 3) headK = cmean(c.any);
      if (c.ok.length && now - c.t0 > 1000 && c.ok.length >= 8) { c.lock = true; calNote(false); }
      else if (now - c.t0 > 4000) { c.lock = true; if (!c.ok.length) calNote(true); }
      return;
    }
    if (!good) return;
    calNote(false);
    const d = adiff(k, headK);
    if (Math.abs(d) < 15) { c.off = null; c.offL = []; headK = norm(headK + d * 0.0005); return; }   // agrees: follow very slowly, to undo gyroscope drift
    // keeps disagreeing by a lot for a second and a half, and steadily: the first reading was wrong, take the new one
    if (c.off === null) c.off = now; c.offL.push(k); if (c.offL.length > 120) c.offL.shift();
    const m = cmean(c.offL);
    if (now - c.off > 1500 && c.offL.every(x => Math.abs(adiff(x, m)) < 10)) { headK = m; c.off = null; c.offL = []; }
  }
  function calNote(on) {
    if (!el) return; const n = el.querySelector('.ps-note');
    if (on) { n.hidden = false; n.dataset.cal = '1'; n.textContent = T('The compass is unsure. Move your phone in a figure-8 a few times, or tap Line up and point at something you can see.', 'البوصلة غير متأكدة. حرّك هاتفك على شكل الرقم 8 عدة مرات، أو اضغط «محاذاة» ووجّهه إلى جرم تراه.'); }
    else if (n.dataset.cal) { delete n.dataset.cal; n.hidden = true; }
  }
  // lining up: the user points the middle of the screen at something they can see and picks it from the list
  function lineUpList() {
    const out = [];
    const vis = v => v[2] > 0.02;
    const near = v => Math.acos(Math.max(-1, Math.min(1, (({f}) => f[0] * v[0] + f[1] * v[1] + f[2] * v[2])(camera())))) * R2D;
    bodies.filter(b => b.id !== 'sun' && vis(b.v) && b.mag < 2).forEach(b => out.push({n: ar() ? b.ar : b.en, v: b.v, m: b.mag}));
    for (const [i, nm] of D.NM) { if (D.M[i] > 1.6) break; const v = [E[i], N[i], U[i]]; if (vis(v)) out.push({n: ar() && nm[1] ? nm[1] : nm[0], v, m: D.M[i]}); }
    if (target && target.kind !== 'con' && target.id !== 'sun') { const v = tVec({}); if (v && vis(v)) out.unshift({n: tName(), v, m: -99}); }
    // closest to where the phone points first, so the one in view is at the top
    return out.filter((x, i) => out.findIndex(y => y.n === x.n) === i).sort((a, b) => near(a.v) - near(b.v)).slice(0, 6);
  }
  function lineUp(v) {
    // turn the sky about the vertical so the middle of the screen points at v
    const fc = facing(camera()), az = norm(Math.atan2(v[0], v[1]) * R2D);
    headK = norm((headK || 0) + adiff(fc.az, az)); lined = true; sm = null;
  }
  async function startSensors() {
    try { if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') { const r = await DeviceOrientationEvent.requestPermission(); if (r !== 'granted') throw new Error('denied'); } }
    catch (e) { setMode('drag', T('Motion access was not allowed, so you can drag to look around instead. To allow it, reload the page and tap Start again.', 'لم يُسمح بالوصول إلى حساسات الحركة، فيمكنك السحب للتجول في السماء. للسماح، أعد تحميل الصفحة واضغط «ابدأ» مرة أخرى.')); return; }
    addEventListener('deviceorientationabsolute', onOri); addEventListener('deviceorientation', onOri);
    ori = null; if (!lined) { headK = null; comp = null; } gotRel = false; setMode('sensor');
    setTimeout(() => { if (el && mode === 'sensor' && !ori) setMode('drag', T('This device has no motion sensors that the browser can use. Drag to look around.', 'لا يجد المتصفح حساسات حركة في هذا الجهاز. اسحب للتجول في السماء.')); }, 1800);
  }
  function stopSensors() { removeEventListener('deviceorientationabsolute', onOri); removeEventListener('deviceorientation', onOri); }
  function setMode(m, msg) {
    mode = m; if (!el) return;
    el.querySelector('[data-ps=mode]').textContent = m === 'sensor' ? T('Drag instead', 'السحب بدل الحساسات') : T('Use motion', 'استخدم الحركة');
    el.querySelector('.ps-nudge').hidden = m !== 'sensor';
    const note = el.querySelector('.ps-note'); if (msg) { note.hidden = false; note.textContent = msg; } else if (!(target && target.id === 'sun')) note.hidden = true;   // the Sun warning stays
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
    target = null; lined = false; headK = null; comp = null; const spec = String(key || '');
    if (el) close();
    el = document.createElement('div'); el.className = 'psky'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', T('Point at the sky', 'وجّه هاتفك إلى السماء'));
    if (ar()) { el.dir = 'rtl'; el.lang = 'ar'; }
    const tname = spec ? '…' : '';
    el.innerHTML = `<canvas class="ps-gl" aria-hidden="true"></canvas><canvas aria-hidden="true"></canvas>
      <div class="ps-top"><button type="button" class="ps-x" data-ps="close" aria-label="${T('Close', 'إغلاق')}">×</button><div class="ps-t"><b>${T('Point at the sky', 'وجّه هاتفك إلى السماء')}</b><span class="ps-pl"></span></div>
</div>
      <div class="ps-arrow" hidden aria-hidden="true"><svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg></div>
      <div class="ps-ptr" hidden aria-hidden="true"><svg viewBox="0 0 44 44" width="44" height="44" fill="none" stroke="#ff6a3d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9V2h7M35 2h7v7M42 35v7h-7M9 42H2v-7"/></svg><span></span></div>
      <p class="ps-target" hidden></p><p class="ps-note" hidden></p>
      <div class="ps-aim" hidden aria-hidden="true"></div>
      <div class="ps-bot"><div class="ps-sheet" hidden role="dialog" aria-label="${T('Line up', 'محاذاة')}"></div><p class="ps-credit">${cul() === 's' ? T("Figures: al-Sufi's Book of the Fixed Stars (public domain), placed with Khalid al-Ajaji's Stellarium data (CC BY-ND 4.0)", 'الرسوم: كتاب صور الكواكب للصوفي (ملكية عامة)، بمواضع من بيانات خالد العجاجي في Stellarium (CC BY-ND 4.0)') : T('Art: Johan Meuris for Stellarium (Free Art License) · lines: Stellarium (CC BY-SA) · stars: Hipparcos via d3-celestial', 'الرسوم: يوهان ميوريس لبرنامج Stellarium (رخصة الفن الحر) · الخطوط: Stellarium (CC BY-SA) · النجوم: هيباركوس عبر d3-celestial')}</p><span class="ps-dir"></span>
        <div class="ps-nudge" hidden><button type="button" data-ps="lu" class="ps-lu">${T('Line up', 'محاذاة')}</button><button type="button" data-ps="nl" aria-label="${T('Turn the sky left', 'أدر السماء يسارًا')}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button><button type="button" data-ps="nr" aria-label="${T('Turn the sky right', 'أدر السماء يمينًا')}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button><button type="button" data-ps="n0">${T('Reset', 'إعادة')}</button></div>
        <div class="ps-tg"><button type="button" data-ps="art" class="ps-art"></button><button type="button" data-ps="lines" aria-pressed="${showLines}">${T('Lines', 'الخطوط')}</button><button type="button" data-ps="dso" aria-pressed="${showDso}">${T('Deep sky', 'الأجرام العميقة')}</button><button type="button" class="ps-mode" data-ps="mode"></button></div></div>
      <div class="ps-start"><div class="ps-card"><h3>${T('Point at the sky', 'وجّه هاتفك إلى السماء')}</h3>
        <p class="ps-intro">${tname ? T(`Hold your phone up and move it around. An arrow shows you where ${tname} is.`, `ارفع هاتفك وحرّكه في السماء، وسيدلّك سهم على مكان ${tname}.`) : T('Hold your phone up and move it around: the screen shows the stars, constellations and planets in that direction.', 'ارفع هاتفك وحرّكه في السماء، فتُظهر الشاشة النجوم والكوكبات والكواكب في ذلك الاتجاه.')}</p>
        <p class="muted">${T('Your phone may ask to use motion and orientation. Keep away from cars and metal. If the sky looks turned, tap Line up at the bottom and point at the Moon, a planet or a bright star.', 'قد يطلب هاتفك إذنًا لاستخدام الحركة والاتجاه. ابتعد عن السيارات والمعادن، وإن بدت السماء مُدارة فاضغط «محاذاة» في الأسفل ووجّه الهاتف إلى القمر أو كوكب أو نجم لامع.')}</p>
        <button type="button" class="pbtn ps-go" data-ps="go">${T('Start', 'ابدأ')}</button><button type="button" class="ps-alt" data-ps="drag">${T('No thanks, let me drag', 'لا، سأسحب بإصبعي')}</button></div></div>`;
    document.body.appendChild(el); document.body.classList.add('psky-open');
    cv = el.querySelector('canvas:not(.ps-gl)'); ctx = cv.getContext('2d');
    ui = {dir: el.querySelector('.ps-dir'), tg: el.querySelector('.ps-target'), arrow: el.querySelector('.ps-arrow'), ptr: el.querySelector('.ps-ptr')};
    glc = el.querySelector('.ps-gl'); gl = glInit(glc); glc.hidden = !gl;
    glc.addEventListener('webglcontextlost', e => { e.preventDefault(); e.target.hidden = true; if (e.target === glc) { gl = null; draw(); } });   // fall back to drawing in 2D FONT = getComputedStyle(document.body).fontFamily;
    el.addEventListener('click', onClick); addEventListener('resize', resize); addEventListener('orientationchange', resize); addEventListener('keydown', onKey);
    gestures();
    try { await load(); } catch (e) { el.querySelector('.ps-card').innerHTML = `<p>${T('The star data could not load. Check your connection and try again.', 'تعذّر تحميل بيانات النجوم. تحقّق من الاتصال وحاول مرة أخرى.')}</p><button type="button" class="pbtn" data-ps="close">${T('Close', 'إغلاق')}</button>`; return; }
    try { target = parseTarget(spec); } catch (e) { target = null; }
    positions(); placeLine();
    if (target) {
      const intro = el.querySelector('.ps-intro'); if (intro) intro.textContent = T(`Hold your phone up and move it around. An arrow shows you where ${tName()} is.`, `ارفع هاتفك وحرّكه في السماء، وسيدلّك سهم على مكان ${tName()}.`);
      const c = target.kind === 'con' ? D.cul[cul()][target.key] : null, t0 = c ? centreOf(c) : tVec({});
      if (t0) { const m = Math.hypot(...t0); view.az = norm(Math.atan2(t0[0], t0[1]) * R2D); view.alt = Math.max(5, Math.asin(t0[2] / m) * R2D); }
      if (target.kind !== 'con') fov = 50;
    }
    if (target && target.id === 'sun') { const n = el.querySelector('.ps-note'); n.hidden = false; n.textContent = T('Never look at the Sun, with or without binoculars or a telescope: it can blind you. Use the screen only.', 'لا تنظر إلى الشمس أبدًا، بعينك أو بمنظار أو تلسكوب، فقد تُفقدك البصر. استخدم الشاشة فقط.'); }
    if (faint) { const n = el.querySelector('.ps-note'); n.hidden = false; n.textContent = T('That star is too faint for this view, so it shows its constellation instead.', 'هذا النجم أخفت من أن يظهر هنا، فيُريك كوكبته بدلًا منه.'); setTimeout(() => { if (el) n.hidden = true; }, 6000); }
    if (!artSet) artSet = cul(); artUI(); setMode('drag'); resize();
    el.querySelector('[data-ps=go]').focus();
  }
  // the place, and a word when the Sun is up and the stars cannot be seen
  function placeLine() {
    const sun = bodies.find(b => b.id === 'sun'), alt = sun ? Math.asin(sun.v[2]) * R2D : -90;
    el.querySelector('.ps-pl').textContent = pl.name + ' · ' + T('now', 'الآن') + (alt > -6 ? T(' · daylight: the stars are not visible yet', ' · نهار: النجوم لا تُرى الآن') : alt > -12 ? T(' · twilight: only the brightest stars show', ' · شفق: لا يظهر إلا ألمع النجوم') : '');
  }
  // the art switch and the credit line follow the chosen drawings
  function artUI() {
    const b = el.querySelector('.ps-art'); b.textContent = {w: T('Western art', 'رسوم غربية'), s: T('al-Sufi art', 'رسوم الصوفي'), off: T('No art', 'بلا رسوم')}[artSet];
    b.setAttribute('aria-pressed', artSet !== 'off'); b.title = T('Switch between the western drawings, al-Sufi\'s figures and no drawings', 'بدّل بين الرسوم الغربية وصور الصوفي وبلا رسوم');
    el.querySelector('.ps-credit').textContent = cul() === 's' ? T("Figures: al-Sufi's Book of the Fixed Stars (public domain), placed with Khalid al-Ajaji's Stellarium data (CC BY-ND 4.0)", 'الرسوم: كتاب صور الكواكب للصوفي (ملكية عامة)، بمواضع من بيانات خالد العجاجي في Stellarium (CC BY-ND 4.0)') : T('Art: Johan Meuris for Stellarium (Free Art License) · lines: Stellarium (CC BY-SA) · stars: Hipparcos via d3-celestial', 'الرسوم: يوهان ميوريس لبرنامج Stellarium (رخصة الفن الحر) · الخطوط: Stellarium (CC BY-SA) · النجوم: هيباركوس عبر d3-celestial');
  }
  // the constellation being looked for, in the chosen figure set (al-Sufi names Sagittarius "Sgr" too, but has no Crux, for example)
  function tgt(c) { return target && target.kind === 'con' && c[target.key] ? target.key : null; }
  // what a button asks for: 'Ori' (a constellation), 'star:Rigel|Ori', 'dso:NGC1976|Orion Nebula', 'body:mars'
  function parseTarget(spec) {
    faint = false; if (!spec) return null;
    const [kind, rest] = spec.includes(':') ? spec.split(/:(.*)/s) : ['con', spec];
    const [val, extra] = (rest || '').split('|');
    const conT = k => (byKey[k] ? {kind: 'con', key: k, name: [byKey[k].latin, byKey[k].ar]} : null);
    if (kind === 'con') return conT(val);
    if (kind === 'star') { const hip = D.sn[val]; if (hip && D.H.has(hip)) { const nm = D.names[hip]; return {kind: 'star', hip, name: [val, nm && nm[1] && nm[0] === val ? nm[1] : '']}; }
      faint = true; return conT(extra); }   // too faint for the view: show its constellation instead
    if (kind === 'dso') return D.dso[val] ? {kind: 'dso', id: val, name: [extra || D.dso[val][2], '']} : null;
    if (kind === 'body') { const B = {sun: ['Sun', 'الشمس'], moon: ['Moon', 'القمر'], mercury: ['Mercury', 'عطارد'], venus: ['Venus', 'الزهرة'], mars: ['Mars', 'المريخ'], jupiter: ['Jupiter', 'المشتري'], saturn: ['Saturn', 'زحل']}[val]; return B ? {kind: 'body', id: val, name: B} : null; }
    return null;
  }
  let faint = false;
  function centreOf(c) { let e = 0, n = 0, up = 0, k = 0; c.l.forEach(l => l.forEach(h => { const i = D.H.get(h); if (i !== undefined) { e += E[i]; n += N[i]; up += U[i]; k++; } })); return k ? [e / k, n / k, up / k] : null; }
  let luItems = [];
  function openLineUp() {
    luItems = lineUpList(); const sh = el.querySelector('.ps-sheet');
    sh.innerHTML = `<p>${T('Point the middle of the screen at one of these that you can see, then tap it:', 'وجّه منتصف الشاشة إلى واحد من هذه تراه في السماء، ثم اضغط عليه:')}</p>`
      + (luItems.length ? `<div class="ps-lul">${luItems.map((x, i) => `<button type="button" data-ps="lux" data-i="${i}">${esc(x.n)}</button>`).join('')}</div>` : `<p class="muted">${T('Nothing bright is above the horizon right now.', 'لا يوجد جرم لامع فوق الأفق الآن.')}</p>`)
      + `<button type="button" class="ps-alt" data-ps="luc">${T('Cancel', 'إلغاء')}</button>`;
    sh.hidden = false; el.querySelector('.ps-aim').hidden = false;
  }
  function closeLineUp() { if (!el) return; el.querySelector('.ps-sheet').hidden = true; el.querySelector('.ps-aim').hidden = true; }
  function onKey(e) { if (e.key === 'Escape') close(); }
  function onClick(e) {
    const b = e.target.closest('[data-ps]'); if (!b) return;
    const a = b.dataset.ps;
    if (a === 'close') close();
    else if (a === 'go') { el.querySelector('.ps-start').remove(); startSensors(); }
    else if (a === 'drag') { el.querySelector('.ps-start').remove(); if (target && target.id === 'sun') { setMode('drag'); return; } setMode('drag', T('Drag to look around, and pinch to zoom.', 'اسحب للتجول في السماء، وباعد إصبعيك للتكبير.')); setTimeout(() => { const n = el && el.querySelector('.ps-note'); if (n) n.hidden = true; }, 4000); }
    else if (a === 'mode') { if (mode === 'sensor') { const fc = facing(camera()); view = {az: fc.az, alt: fc.alt}; setMode('drag'); } else startSensors(); }
    else if (a === 'art') { artSet = {w: 's', s: 'off', off: 'w'}[artSet] || 'w'; save(); artUI(); draw(); }
    else if (a === 'lines') { showLines = !showLines; b.setAttribute('aria-pressed', showLines); save(); draw(); }
    else if (a === 'dso') { showDso = !showDso; b.setAttribute('aria-pressed', showDso); save(); draw(); }
    else if (a === 'nl' || a === 'nr') { nudge = norm(nudge + (a === 'nl' ? -3 : 3)); if (nudge > 180) nudge -= 360; save(); draw(); }
    else if (a === 'n0') { nudge = 0; lined = false; headK = null; comp = null; sm = null; save(); draw(); }   // back to the compass
    else if (a === 'lu') openLineUp();
    else if (a === 'luc') closeLineUp();
    else if (a === 'lux') { const it = luItems[+b.dataset.i]; if (it) { lineUp(it.v); nudge = 0; save(); } closeLineUp(); const n = el.querySelector('.ps-note'); n.hidden = false; n.textContent = T('Lined up. The view now follows your phone without the compass.', 'تمت المحاذاة. يتبع العرض هاتفك الآن دون البوصلة.'); setTimeout(() => { if (el && !n.dataset.cal) n.hidden = true; }, 3500); draw(); }
  }
  function close() {
    if (!el) return; stopSensors(); cancelAnimationFrame(raf); raf = 0;
    removeEventListener('resize', resize); removeEventListener('orientationchange', resize); removeEventListener('keydown', onKey);
    if (gl) { const x = gl.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); }   // give the chip's memory back
    gl = null; glc = null; ui = null; el.remove(); el = null; document.body.classList.remove('psky-open');
  }
  // small icon button for one star, deep-sky object or planet
  function mini(spec, lang) {
    const a = lang === 'ar';
    return `<button type="button" class="psbtn psmini" data-psky="${esc(spec)}" title="${a ? 'أرني مكانه في السماء' : 'Show me where it is in the sky'}" aria-label="${a ? 'أرني مكانه في السماء' : 'Show me where it is in the sky'}"><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M12 7.5l1.1 2.3 2.4.3-1.8 1.6.5 2.4L12 12.9l-2.2 1.2.5-2.4-1.8-1.6 2.4-.3z"/></svg></button>`;
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
  return {open, close, btn, mini, _probe, _view: v => { view = v; mode = 'drag'; draw(); }, _flush: () => { if (raf) { cancelAnimationFrame(raf); frame(); } }, _ori: o => { ori = o; headK = 0; mode = 'sensor'; draw(); }, _state: () => ({mode, fov, nudge, target, faint, fc: el && D ? facing(camera()) : null, fs: sm ? facing({f: sm.f}) : null})};
})();
