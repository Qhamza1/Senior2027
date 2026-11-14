/* أدوات أساسية: اختصارات DOM، الترجمة، الرسائل */
const { t, tx } = I18N;
document.title = t("a.docTitle");
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const money = (n) => I18N.num(n) + " " + t("cur");
function toast(m){ const t=$("#toast"); t.textContent=m; t.classList.add("show"); clearTimeout(toast.t); toast.t=setTimeout(()=>t.classList.remove("show"),2600); }
