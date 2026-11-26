/* ---------- Welcome: on the first visit, choose where to begin (Heritage & Culture, Science or AstroGuide) ---------- */
const WELCOME = (() => {
  const T = {
    en: {h: 'Where would you like to begin?', p: 'Explore the sky through its stories or its science, then gather it all into one night.',
         doors: [['culture', 'Heritage & Culture', 'Star stories from seven sky cultures: Arab, Greek, Egyptian, Chinese, Japanese, Indian and Southern African.', 'Explore the stories'],
                 ['science', 'Science', 'Stars and constellations, the Solar System, deep-sky objects and how the universe works.', 'Explore the science'],
                 ['astro', 'AstroGuide', 'Plan a night and the Sky calendar. Everything you add with + My night is waiting here.', 'Plan a night']],
         foot: 'You can switch at any time from the bar at the ', top: 'top', bottom: 'bottom', close: 'Close'},
    ar: {h: 'من أين تحب أن تبدأ؟', p: 'استكشف السماء من خلال قصصها أو علمها، ثم اجمع ذلك كله في ليلة واحدة.',
         doors: [['culture', 'التراث والثقافة', 'قصص النجوم في سبع ثقافات: العرب والإغريق ومصر القديمة والصين واليابان والهند وجنوب أفريقيا.', 'استكشف القصص'],
                 ['science', 'العلم', 'النجوم والكوكبات، والمجموعة الشمسية، والأجرام العميقة، وكيف يعمل الكون.', 'استكشف العلم'],
                 ['astro', 'المرشد الفلكي', '«خطّط لليلتك» و«تقويم السماء». وكل ما تضيفه بزر «+ ليلتي» تجده هنا.', 'خطّط لليلتك']],
         foot: 'يمكنك التنقّل في أي وقت من الشريط ', top: 'أعلى الشاشة', bottom: 'أسفل الشاشة', close: 'إغلاق'}};
  let el = null, back = null;
  const seen = () => { try { return localStorage.getItem('osms-welcome') === '1'; } catch (e) { return true; } };
  const mark = () => { try { localStorage.setItem('osms-welcome', '1'); } catch (e) {} };
  function html() {
    const ar = state.lang === 'ar', t = T[ar ? 'ar' : 'en'], phone = matchMedia('(max-width: 760px)').matches;
    return `<div class="wel-sky" aria-hidden="true"></div><div class="wel-in"${ar ? ' dir="rtl" lang="ar"' : ''}>
      <div class="wel-top"><span class="wel-brand"><span class="b-star">✦</span> Sky Guide <span lang="ar">دليل السماء</span></span>
        <span class="wel-tools"><span class="hlang" role="group" aria-label="Language"><button type="button" data-wlang="en" aria-pressed="${!ar}">EN</button><button type="button" data-wlang="ar" lang="ar" aria-pressed="${ar}">عربي</button></span>
        <button type="button" class="wel-x" data-wx aria-label="${t.close}">✕</button></span></div>
      <h2 id="wel-h">${t.h}</h2><p class="wel-p">${t.p}</p>
      <div class="wel-doors">${t.doors.map(([id, name, d, go]) => `<button type="button" class="wel-door" data-wsec="${id}" style="--sc:var(--s-${id})"><span class="wel-ic"><svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${SEC_ICON[id]}</svg></span><span class="wel-t"><b>${name}</b><span class="wel-d">${d}</span><span class="wel-go">${go} ${ar ? '←' : '→'}</span></span></button>`).join('')}</div>
      <p class="wel-foot">${t.foot}${phone ? t.bottom : t.top}</p></div>`;
  }
  function draw() {
    el.innerHTML = html();
    el.querySelectorAll('[data-wsec]').forEach(b => b.addEventListener('click', () => { const sec = b.dataset.wsec; hide(); goSection(sec); window.scrollTo({top: 0}); }));
    el.querySelectorAll('[data-wlang]').forEach(b => b.addEventListener('click', () => { state.lang = b.dataset.wlang; try { localStorage.setItem('osms-lang', state.lang); } catch (e) {} draw(); try { buildList(document.getElementById('q').value); render(); } catch (e) {} el.querySelector(`[data-wlang=${state.lang}]`).focus(); }));
    el.querySelector('[data-wx]').addEventListener('click', hide);
  }
  function key(ev) { if (ev.key === 'Escape') hide(); }
  function show() {
    if (el) return;
    back = document.activeElement;
    el = document.createElement('div'); el.id = 'welcome'; el.className = 'welcome'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'wel-h');
    document.body.appendChild(el); document.documentElement.classList.add('wel-open');
    draw(); document.addEventListener('keydown', key);
    const f = el.querySelector('.wel-door'); if (f) f.focus({preventScroll: true});
  }
  function hide() {
    if (!el) return; mark();
    el.remove(); el = null; document.documentElement.classList.remove('wel-open'); document.removeEventListener('keydown', key);
    if (back && back.focus && back !== document.body) back.focus({preventScroll: true});
    setTimeout(() => { try { TOUR.note(); } catch (e) {} }, 600);
  }
  // first visit, opened without a link to a particular page
  function first(hadHash) { if (!seen() && !hadHash) show(); }
  return {show, hide, first, open: () => !!el};
})();
