/* ==========================================================
   منتجات الداشبورد (Firestore REST بدون مكتبات) مع نسخة محفوظة وبديل محلي
   ========================================================== */
const PRODUCTS_CACHE = "onefournine_products_v1";
let products = (() => {
  try { const c = JSON.parse(localStorage.getItem(PRODUCTS_CACHE)); if (Array.isArray(c) && c.length) return c; } catch { /* لا نسخة */ }
  return LOCAL_PRODUCTS;
})();
// إعدادات مقاس الصور (من لوحة التحكم) — محفوظة محليًا لتجنّب أي وميض
function applyImageSettings(s) {
  if (!s) return;
  const r = /^\d+ \/ \d+$/.test(s.imageRatio || "") ? s.imageRatio : "4 / 5";
  const f = s.imageFit === "contain" ? "contain" : "cover";
  document.documentElement.style.setProperty("--img-ratio", r);
  document.documentElement.style.setProperty("--img-fit", f);
  try { localStorage.setItem("o149_imgset", JSON.stringify({ imageRatio: r, imageFit: f })); } catch { /* تخزين غير متاح */ }
}
try { applyImageSettings(JSON.parse(localStorage.getItem("o149_imgset"))); } catch { /* لا إعدادات محفوظة */ }
const imgUrl = (s, w) => /res\.cloudinary\.com\/.+\/image\/upload\//.test(s) ? s.replace("/image/upload/", `/image/upload/f_auto,q_auto,w_${w}/`) : s;
const fsDec = (f) => "stringValue" in f ? f.stringValue : "integerValue" in f ? Number(f.integerValue) : "doubleValue" in f ? f.doubleValue
  : "booleanValue" in f ? f.booleanValue : "nullValue" in f ? null : "arrayValue" in f ? (f.arrayValue.values || []).map(fsDec)
  : "mapValue" in f ? Object.fromEntries(Object.entries(f.mapValue.fields || {}).map(([k, x]) => [k, fsDec(x)])) : null;
async function fetchRemoteProducts() {
  const c = STORE_CONFIG.firebase;
  if (!c?.projectId) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${c.projectId}/databases/(default)/documents/products?pageSize=300&key=${c.apiKey}`, { signal: ctrl.signal });
    if (!r.ok) return null;
    const d = await r.json();
    const sdoc = (d.documents || []).find((x) => x.name.endsWith("/_settings"));
    if (sdoc) {
      const st = Object.fromEntries(Object.entries(sdoc.fields || {}).map(([k, x]) => [k, fsDec(x)]));
      applyImageSettings(st);
      applySections(st.sections);   // الأقسام من لوحة التحكم
    }
    return (d.documents || []).filter((x) => !x.name.endsWith("/_settings")).map((doc) => {
      const o = Object.fromEntries(Object.entries(doc.fields || {}).map(([k, x]) => [k, fsDec(x)]));
      return { unavailableColors: [], unavailableSizes: [], colors: [], sizes: [], stock: 0, discountPrice: null, ...o, id: doc.name.split("/").pop(), image: (o.images || [])[0] };
    }).filter((p) => p.active !== false && p.image && p.name && p.price > 0 && p.colors.length && p.sizes.length)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch { return null; } finally { clearTimeout(timer); }
}
async function syncProducts() {
  const list = await fetchRemoteProducts();
  if (!list?.length || (JSON.stringify(list) === JSON.stringify(products) && !sectionsChanged)) return;  // فشل/فاضي/مفيش جديد: لا تغيير
  products = list;
  sectionsChanged = false;
  try { localStorage.setItem(PRODUCTS_CACHE, JSON.stringify(list)); } catch { /* تخزين غير متاح */ }
  cart = cart.filter((i) => findProduct(i.id));
  saveCart();
  renderProducts();
  renderCart();
  if (!$("#productView").hidden && !findProduct(detail?.id)) location.hash = "#products";
}
