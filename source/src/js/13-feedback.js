/* ---------- Feedback: sent to the owner's Google Form ---------- */
const FB = {url: 'https://docs.google.com/forms/d/e/1FAIpQLScozkqJMwmrHlOfCnMeouZEureiwztVFgIIL2dXjwcSkZ9Pmg/formResponse',
            name: 'entry.1242525159', email: 'entry.2051052095', type: 'entry.740548683', msg: 'entry.1190509643'};
const FB_TYPES = [['Suggestion', 'اقتراح'], ['Mistake in the content', 'خطأ في المحتوى'], ['Something not working', 'شيء لا يعمل كما ينبغي'], ['Other', 'غير ذلك']];
const FBT = {
  en: {h: 'Send feedback', intro: 'Tell me what you think, point out a mistake, or suggest something new. Only I see your message; nothing you send is shown on this page.',
       name: 'Name', opt: 'optional', email: 'Email', emailHint: 'only if you would like a reply', type: 'Type', choose: 'Choose…', msg: 'Message', send: 'Send', sending: 'Sending…',
       need: 'Please write a message first.', needName: 'Please write your name.', needType: 'Please choose a type.', badEmail: 'That email address does not look right. Fix it or leave the box empty.', wait: 'Please wait a few seconds before sending again.',
       ok: 'Thank you! Your message has been sent.', again: 'Send another message', fail: 'Sorry, the message could not be sent. Check your internet connection and try again.'},
  ar: {h: 'أرسل ملاحظاتك', intro: 'أخبرني برأيك، أو نبّهني إلى خطأ، أو اقترح شيئًا جديدًا. لا يرى رسالتك أحد غيري، ولا يظهر شيء منها في هذه الصفحة.',
       name: 'الاسم', opt: 'اختياري', email: 'البريد الإلكتروني', emailHint: 'فقط إن أردت ردًّا', type: 'النوع', choose: 'اختر…', msg: 'الرسالة', send: 'إرسال', sending: 'جارٍ الإرسال…',
       need: 'اكتب رسالتك أولًا من فضلك.', needName: 'اكتب اسمك من فضلك.', needType: 'اختر النوع من فضلك.', badEmail: 'يبدو أن البريد الإلكتروني غير صحيح. صحّحه أو اترك الخانة فارغة.', wait: 'انتظر بضع ثوانٍ قبل أن ترسل مرة أخرى.',
       ok: 'شكرًا لك! أُرسلت رسالتك.', again: 'أرسل رسالة أخرى', fail: 'عذرًا، تعذّر إرسال الرسالة. تحقّق من اتصالك بالإنترنت ثم حاول مرة أخرى.'}
};
let fbLast = 0, fbDone = false;
function fbPlace() {
  if (state.cul === 'guide') return 'Saved lists'; if (state.cul === 'calendar') return 'Sky calendar'; if (state.cul === 'plan') return 'Plan a night'; if (state.cul === 'quiz') return 'Quiz'; if (state.cul === 'learn') return 'For guides · ' + GUIDES.page;
  const c = byKey[state.con]; return (c ? c.latin : state.con) + ' · ' + cname(state.cul);
}
function fbRender() {
  const box = document.getElementById('fbbox'); if (!box) return;
  const L = state.lang === 'ar' ? 'ar' : 'en', t = FBT[L], ar = L === 'ar';
  const old = {}; box.querySelectorAll('[data-fb]').forEach(x => { old[x.dataset.fb] = x.value; });
  box.setAttribute('dir', ar ? 'rtl' : 'ltr'); box.setAttribute('lang', L); box.classList.toggle('rtl', ar);
  if (fbDone) { box.innerHTML = `<div class="fbok" role="status"><p>${t.ok}</p><button type="button" class="fbbtn" id="fbagain">${t.again}</button></div>`; box.querySelector('#fbagain').addEventListener('click', () => { fbDone = false; fbRender(); }); return; }
  box.innerHTML = `<form class="fbform" id="fbform" novalidate><h3>${t.h}</h3><p class="srcnote">${t.intro}</p>
    <div class="fbrow"><label><span>${t.name}</span><input type="text" data-fb="name" maxlength="80" autocomplete="name" required></label>
    <label><span>${t.email} <span class="fbopt">(${t.opt}${ar ? '، ' : ', '}${t.emailHint})</span></span><input type="email" data-fb="email" maxlength="120" autocomplete="email" dir="ltr"></label>
    <label><span>${t.type}</span><select data-fb="type" required><option value="">${t.choose}</option>${FB_TYPES.map(([v, a]) => `<option value="${esc(v)}">${ar ? a : v}</option>`).join('')}</select></label></div>
    <label class="fbmsg"><span>${t.msg}</span><textarea data-fb="msg" rows="5" maxlength="3000" required></textarea></label>
    <input type="text" data-fb="hp" class="fbhp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div class="fbbar"><button type="submit" class="fbbtn">${t.send}</button><span class="fbmsgline" role="status" aria-live="polite"></span></div></form>`;
  box.querySelectorAll('[data-fb]').forEach(x => { if (old[x.dataset.fb] != null) x.value = old[x.dataset.fb]; });
  box.querySelector('#fbform').addEventListener('submit', fbSend);
}
async function fbSend(ev) {
  ev.preventDefault();
  const f = ev.target, L = state.lang === 'ar' ? 'ar' : 'en', t = FBT[L], line = f.querySelector('.fbmsgline'), btn = f.querySelector('button[type=submit]');
  const v = k => (f.querySelector(`[data-fb="${k}"]`).value || '').trim();
  if (v('hp')) return;                                         // a bot filled the hidden box
  if (!v('name')) { line.textContent = t.needName; f.querySelector('[data-fb="name"]').focus(); return; }
  if (!v('type')) { line.textContent = t.needType; f.querySelector('[data-fb="type"]').focus(); return; }
  if (!v('msg')) { line.textContent = t.need; f.querySelector('[data-fb="msg"]').focus(); return; }
  if (v('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) { line.textContent = t.badEmail; f.querySelector('[data-fb="email"]').focus(); return; }
  if (Date.now() - fbLast < 15000) { line.textContent = t.wait; return; }
  const body = new URLSearchParams();
  body.set(FB.name, v('name')); body.set(FB.email, v('email')); body.set(FB.type, v('type'));
  body.set(FB.msg, v('msg') + '\n\n(Sent from: ' + fbPlace() + ', ' + (L === 'ar' ? 'Arabic' : 'English') + ')');
  btn.disabled = true; btn.textContent = t.sending; line.textContent = '';
  try {
    await fetch(FB.url, {method: 'POST', mode: 'no-cors', body});   // Google does not let pages read the reply, so a completed request counts as sent
    fbLast = Date.now(); fbDone = true; fbRender();
  } catch (e) { btn.disabled = false; btn.textContent = t.send; line.textContent = t.fail; }
}

