/* ---------- Share: a constellation or story page, a Cosmology topic, or a My night list.
   Phones open their own share sheet; elsewhere the link is copied ---------- */
const SHARE = (() => {
  const base = () => location.href.split('#')[0];
  const ICON = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>';
  function go(title, url) {
    const ar = state.lang === 'ar';
    if (navigator.share) { navigator.share({title: title + ' · Sky Guide', url}).catch(() => {}); return; }
    (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(url) : Promise.reject())
      .then(() => APP.toast(ar ? 'نُسخ الرابط. الصقه حيث تريد مشاركته.' : 'Link copied. Paste it wherever you want to share it.'), () => { prompt(ar ? 'انسخ هذا الرابط' : 'Copy this link', url); });
  }
  // the button: data-share holds the address (after #) and data-st the title
  const btn = (hash, title, lang, cls) => { const ar = lang === 'ar';
    return `<button type="button" class="shbtn${cls ? ' ' + cls : ''}" data-share="${esc(hash)}" data-st="${esc(title)}" aria-label="${ar ? 'شارك: ' : 'Share: '}${esc(title)}">${ICON}<span class="shl">${ar ? 'شارك' : 'Share'}</span></button>`; };
  document.addEventListener('click', ev => { const b = ev.target.closest && ev.target.closest('[data-share]'); if (!b) return; ev.preventDefault(); ev.stopPropagation(); go(b.dataset.st, base() + '#' + b.dataset.share); });
  return {go, btn};
})();
