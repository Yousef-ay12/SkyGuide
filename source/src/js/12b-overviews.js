/* ---------- Overview pages for Heritage & Culture and AstroGuide (Science has its own in 09g-science-overview.js) ---------- */
const plainText = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const cutText = (s, n) => s.length > n ? s.slice(0, s.lastIndexOf(' ', n) > n * 0.6 ? s.lastIndexOf(' ', n) : n) + '…' : s;
function culHubHTML(cul, lang) {
  const ar = lang === 'ar', cu = CULTURES.find(c => c.id === cul) || CULTURES[0];
  const sky = ar ? CUL_AR_SKY[cu.id] : cname(cu.id) + ' sky';
  const keys = DATA.constellations.filter(c => !c.hidden && c.key !== 'QUR' && (DATA.lore[c.key] || {})[cu.id]).map(c => c.key);
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
  h += keys.filter(k => k !== feat).map(k => { const c = byKey[k], s = story(k);
    return `<div class="cul-card"><button type="button" class="cul-open" data-ocon="${k}"><b>${esc(ar ? c.ar : c.latin)}</b><span class="cul-ar" lang="${ar ? 'en' : 'ar'}">${esc(ar ? c.latin : c.ar)}</span><span class="cul-st">${esc(cutText(s.title || s.seen, 70))}</span></button>${AG.btn({t: 'con', key: k, cul: cu.id}, lang, true)}</div>`; }).join('');
  return h + `</div></div>`;
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
      <span>${esc(ar ? (pl.ar || pl.en) : pl.en)} · ${ar ? 'الجولة' : 'tour'} <bdi dir="ltr">${esc(st.tourStart)}–${esc(st.tourEnd)}</bdi> · ${ar ? 'القمر' : 'Moon'} ${Math.round(m.illum * 100)}%</span></div>
      <button type="button" class="pbtn" data-astro="calendar">${ar ? 'غيّر المكان' : 'Change place'}</button></div>${WX.box(pl, Y, M, D, 'mini')}`;
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
  const a = ev.target.closest('[data-astro]'); if (a) { setCulture(a.dataset.astro); window.scrollTo({top: 0}); return; }
  if (ev.target.closest('[data-astroplan]')) { PLAN.seed(AG.plannable()); setCulture('plan'); window.scrollTo({top: 0}); }
});
