/* ==========================================================
   أدوات مساعدة
   ========================================================== */
const $ = (s) => document.querySelector(s);
/* ===== اللغات (i18n.js لازم يتحمّل قبل الملف ده) ===== */
const { t, tx, num } = I18N;
const isEn = () => I18N.lang === "en";
const waL = () => (STORE_CONFIG.waLang === "auto" ? I18N.lang : "ar");   // لغة رسائل واتساب
// اسم/وصف/لون المنتج بالإنجليزي: من حقول لوحة التحكم (nameEn / descriptionEn / colors[].nameEn) وإلا ترجمة تلقائية للكلمات المعروفة
const pName = (p) => (isEn() ? p.nameEn || tx(p.name) : p.name);
const pDesc = (p) => (isEn() ? p.descriptionEn || tx(p.description || "", false) : p.description || "");
const cLabel = (p, name) => { if (!isEn()) return name; const c = (p.colors || []).find((x) => x.name === name); return (c && c.nameEn) || tx(name); };
I18N.vars = () => ({ fee: money(STORE_CONFIG.shippingFee), batch: STORE_CONFIG.footerText });
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n, l) => `${num(n, l)} ${t("cur", null, l)}`;
const findProduct = (id) => products.find((p) => p.id === id);
const discountPct = (p) =>
  p.discountPrice != null && p.discountPrice < p.price
    ? Math.round((1 - p.discountPrice / p.price) * 100)
    : 0;
const unitPrice = (p) => (discountPct(p) ? p.discountPrice : p.price);
const normPhone = (v) => String(v || "").replace(/[\s-]/g, "");
const fileSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} ${t("mb")}` : `${Math.round(b / 1024)} ${t("kb")}`);
const CART_KEY = "onefournine_cart";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const FALLBACK_IMG = "this.onerror=null;this.src='placeholder.svg'";

let detail = null;       // اختيارات صفحة المنتج
let proofFile = null;
let proofURL = null;

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  clearTimeout(toast.timer);
  clearTimeout(toast.hideTimer);
  // popover = طبقة علوية، فتظهر الرسالة فوق نافذة المنتج
  try { if (t.showPopover && !t.matches(":popover-open")) t.showPopover(); } catch (_) {}
  requestAnimationFrame(() => t.classList.add("show"));
  toast.timer = setTimeout(() => {
    t.classList.remove("show");
    toast.hideTimer = setTimeout(() => { try { t.hidePopover && t.hidePopover(); } catch (_) {} }, 300);
  }, 2600);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast(t("copied"));
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    toast(ok ? t("copied") : t("copyFail"));
  }
}
