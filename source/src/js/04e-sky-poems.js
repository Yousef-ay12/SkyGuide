/* ---------- Poems and the star calendar (Arab sources): Ibn Qutayba's sayings for the stars rising at dawn, and Arabic poems about the sky ---------- */
// Ibn Qutayba's dates are for his own time. Precession and the calendar change since then put the same dawn risings about 20 days later today.
const POE_SHIFT = 20;
let POE_TAB = '';   // the group shown
const POE_MON = {January: 0, February: 1, March: 2, April: 3, May: 4, June: 5, July: 6, August: 7, September: 8, October: 9, November: 10, December: 11};
function poeDay(date) { const [d, m] = String(date).split(' '); return Date.UTC(2001, POE_MON[m], +d); }   // a day of a plain year
function poeNow(items) {
  const t = new Date(), now = Date.UTC(2001, t.getMonth(), t.getDate()), Y = 365 * 864e5;
  return items.filter(x => x.date).filter(x => { let dd = Math.abs(poeDay(x.date) + POE_SHIFT * 864e5 - now) % Y; dd = Math.min(dd, Y - dd); return dd <= 7 * 864e5; });
}
function poeBayt(s) {
  const parts = String(s).split(/\s*\.\.\.\s*|\s*\/\s*|\s*·\s*/).filter(Boolean);
  if (parts.length < 2) return `<div class="pv-ar" lang="ar">${esc(s)}</div>`;
  const rows = []; for (let i = 0; i < parts.length; i += 2) rows.push(parts.slice(i, i + 2));
  return rows.map(r => `<div class="bayt pv-ar" lang="ar">${r.map(x => `<span>${esc(x)}</span>`).join('')}</div>`).join('');
}
function poeLink(con, ar) {
  if (!con || !(DATA.lore[con] || {}).arab || !byKey[con]) return '';
  const c = byKey[con];
  return `<button type="button" class="pv-go" data-pcon="${con}">${ar ? 'افتح ' + esc(c.ar) : 'Open ' + esc(c.latin)} ›</button>`;
}
function poeCalItem(x, ar, now, id) {
  const head = `<div class="pv-head"><b>${esc(ar ? x.nameAr : x.name)}</b>${x.date ? `<span class="pv-date">${ar ? 'يطلع بالغداة' : 'Rises at dawn'} · ${esc(ar ? x.dateAr : x.date)}</span>` : ''}${now ? `<span class="pv-now">${ar ? 'يطلع نحو هذا الوقت' : 'Rising about now'}</span>` : ''}</div>`
    + `<p class="pv-stars">${esc(ar ? x.starsAr : x.stars)}</p>`;
  const sum = x.sum ? `<p class="pv-sum"><span class="pv-lbl">${ar ? 'المعنى' : 'What it means'}</span>${esc(ar ? x.sumAr : x.sum)}</p>` : '';
  const body = ar ? sum + (x.noteAr ? `<p class="pv-note"><span class="pv-lbl">قال ابن قتيبة:</span> ${esc(x.noteAr)}</p>` : '')
                  : `<p class="pv-mean">${esc(x.en)}</p>${sum}${x.note ? `<p class="pv-note">${esc(x.note)}</p>` : ''}`;
  return `<div class="pverse pv-cal${now ? ' is-now' : ''}" id="${id}">${head}${poeBayt(x.ar)}${body}<div class="pv-foot"><span class="pv-by">${esc(ar ? x.byAr : x.by)}</span>${poeLink(x.con, ar)}</div></div>`;
}
function poePoemItem(x, ar) {
  const star = ar ? x.starAr : x.star, note = ar ? x.noteAr : x.note;
  return `<div class="pverse">${star ? `<div class="pv-head"><b>${esc(star)}</b></div>` : ''}${poeBayt(x.ar)}<p class="pv-sum"><span class="pv-lbl">${ar ? 'المعنى' : 'What it means'}</span>${esc(ar ? x.enAr : x.en)}</p>${note ? `<p class="pv-note">${esc(note)}</p>` : ''}<div class="pv-foot"><span class="pv-by">${esc(ar ? x.byAr : x.by)}</span></div></div>`;
}
function poeHTML(e, ar) {
  const gs = e.poemGroups, cal = gs.filter(g => g.kind === 'cal'), poems = gs.filter(g => g.kind === 'poem');
  const nowSet = new Set(poeNow(cal.flatMap(g => g.items))), aid = new Map();
  cal.forEach(g => g.items.forEach((x, i) => aid.set(x, `poe-${g.id}-${i}`)));
  let h = `<div class="poe${ar ? ' rtl' : ''}"${ar ? ' dir="rtl" lang="ar"' : ''}>`;
  h += ar ? `<p class="poe-lead">كانت العرب تعرف أوقات السنة بالنجوم: كل ثلاثة عشر يومًا يطلع منزل من منازل القمر الثمانية والعشرين مع الفجر، فيأتي معه حرّ أو برد أو مطر أو جَنى. وقالوا في كل نجم سجعًا يحفظونه. جمعها ابن قتيبة (ت ٢٧٦هـ) في كتاب «الأنواء في مواسم العرب»، ومعها أبيات للشعراء في القمر والكواكب والنجوم.</p>`
          : `<p class="poe-lead">The Arabs told the time of year by the stars. Every thirteen days one of the 28 stations of the Moon rises at dawn, bringing heat, cold, rain or harvest, and for each one there was a short rhymed saying that everyone knew. Ibn Qutayba collected them in the 9th century in <i>al-Anwa' fi Mawasim al-'Arab</i>. After the calendar come poems about the Moon, the planets and the stars.</p>`;
  h += `<p class="poe-shift muted">${ar ? 'التواريخ كما ذكرها ابن قتيبة في زمانه. وبسبب حركة المبادرة وتغيّر التقويم منذ ذلك الحين صار طلوع النجوم نفسها يتأخر نحو ثلاثة أسابيع في أيامنا.' : "The dates are Ibn Qutayba's, for his time. Because of precession and the change of calendar since then, the same stars now rise at dawn about three weeks later."}</p>`;
  if (nowSet.size) h += `<p class="poe-nowline">${ar ? 'يطلع بالغداة نحو هذا الوقت من السنة' : 'Rising at dawn about now'}: ${[...nowSet].map(x => `<a href="#${aid.get(x)}">${esc(ar ? x.nameAr : x.name)}</a>`).join(ar ? '، ' : ', ')}</p>`;
  // one group at a time: the tabs choose it; it opens on the season whose stars are rising now
  if (!gs.some(g => g.id === POE_TAB)) { const n = [...nowSet][0]; POE_TAB = n ? cal.find(g => g.items.includes(n)).id : cal[0].id; }
  const tab = g => `<button type="button" class="poe-chip" role="tab" data-ptab="${g.id}" aria-selected="${g.id === POE_TAB}">${esc(ar ? g.titleAr : g.title)}</button>`;
  h += `<div class="poe-jump" id="poe-tabs" role="tablist" aria-label="${ar ? 'أقسام الصفحة' : 'Sections'}"><span class="pv-lbl">${ar ? 'تقويم النجوم (الأنواء)' : "The star calendar (al-Anwa')"}</span><div class="poe-row">${cal.map(tab).join('')}</div><span class="pv-lbl">${ar ? 'أشعار السماء' : 'Poems of the sky'}</span><div class="poe-row">${poems.map(tab).join('')}</div></div>`;
  const pager = i => { const p = gs[i - 1], n = gs[i + 1], b = (g, k) => g ? `<button type="button" class="pbtn poe-pg" data-ptab="${g.id}">${k ? '' : (ar ? '› ' : '‹ ')}${esc(ar ? g.titleAr : g.title)}${k ? (ar ? ' ‹' : ' ›') : ''}</button>` : '<span></span>';
    return `<div class="poe-pager">${b(p, 0)}${b(n, 1)}</div>`; };
  gs.forEach((g, i) => {
    const isCal = g.kind === 'cal';
    h += `<section class="qgroup poe-tab" id="poe-g-${g.id}" role="tabpanel"${g.id === POE_TAB ? '' : ' hidden'}><h3>${esc(ar ? g.titleAr : g.title)}</h3><p>${esc(ar ? g.introAr : g.intro)}${!isCal && g.con ? ' ' + poeLink(g.con, ar) : ''}</p>${g.mean ? `<p class="pv-sum poe-smean"><span class="pv-lbl">${ar ? 'ماذا كان يعني' : 'What it meant'}</span>${esc(ar ? g.meanAr : g.mean)}</p>` : ''}`;
    g.items.forEach(x => { h += isCal ? poeCalItem(x, ar, nowSet.has(x), aid.get(x)) : poePoemItem(x, ar); });
    h += pager(i) + `</section>`;
  });
  h += `<div class="src poe-src" dir="ltr" lang="en">${srcLinks("Ibn Qutayba, al-Anwa' fi Mawasim al-'Arab (the calendar); Ibn Manzur, Nithar al-Azhar fi al-Layl wa al-Nahar (most of the poems); Ibn Zafir, Ghara'ib al-Tanbihat (the Moon and planets meeting); al-Tadhkira al-Fakhriyya (the crescent and Venus); Oman Daily star series (al-'Ayyuq, al-Simak, Qalb al-'Aqrab)")}</div>`;
  return h + `</div>`;
}
// the links inside the page: open a constellation in the Arab sky, and jump within the page without changing the address
document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-pcon]');
  if (b) { state.con = b.dataset.pcon; try { buildList(document.getElementById('q').value); } catch (e) {} render(); window.scrollTo({top: 0}); return; }
  const tb = ev.target.closest('.poe [data-ptab]');
  if (tb) { poeShow(tb.dataset.ptab, tb.classList.contains('poe-pg')); return; }
  const a = ev.target.closest('.poe a[href^="#poe-"]');
  if (a) { ev.preventDefault(); const t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
    const sec = t.closest('.poe-tab'); if (sec) poeShow(sec.id.slice(6), false); t.scrollIntoView({behavior: 'smooth', block: 'start'}); }
});
function poeShow(id, toTop) {
  POE_TAB = id;
  document.querySelectorAll('.poe-tab').forEach(s => { s.hidden = s.id !== 'poe-g-' + id; });
  document.querySelectorAll('.poe-chip[data-ptab]').forEach(b => b.setAttribute('aria-selected', b.dataset.ptab === id));
  const on = document.querySelector('.poe-chip[aria-selected="true"]'); if (on) { const r = on.parentElement; if (r.scrollWidth > r.clientWidth) r.scrollLeft += on.getBoundingClientRect().left - r.getBoundingClientRect().left - (r.clientWidth - on.offsetWidth) / 2; }
  if (toTop) { const t = document.getElementById('poe-tabs'); if (t) t.scrollIntoView({behavior: 'smooth', block: 'start'}); }
}
