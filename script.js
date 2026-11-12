/* ==========================================================
   إعدادات المتجر
   ========================================================== */
const STORE_CONFIG = {
  brandName: "Onefournine",
  footerText: "Senior 2027",
  developer: "Developed BY HAMZA",
  socialLinks: {
    instagram: "https://www.instagram.com/q_7vmza/",
    tiktok: "https://www.tiktok.com/@q_7amza?_r=1&_t=ZS-97S7RofomcK"
  },
  // رقم واتساب الدولي بدون + ولا صفر (مصر = 20)
  whatsappNumber: "201066350362",
  // الشحن: فعّله (true) لإظهار حقلي المحافظة والعنوان
  shippingEnabled: true,
  shippingFee: 100,   // رسوم الشحن الثابتة (ج.م)
  governorates: ["القاهرة","الجيزة","الإسكندرية","القليوبية","الشرقية","الدقهلية","الغربية","المنوفية","كفر الشيخ","البحيرة","دمياط","بورسعيد","الإسماعيلية","السويس","شمال سيناء","جنوب سيناء","الفيوم","بني سويف","المنيا","أسيوط","سوهاج","قنا","الأقصر","أسوان","البحر الأحمر","الوادي الجديد","مطروح"],
  // أضف هنا رابط الخادم عند تشغيل Backend. فارغ = لا يتم حفظ الطلب على خادم
  ordersEndpoint: "",   // مثال: "https://your-server.com/api/orders"
  uploadEndpoint: "",   // مثال: "https://your-server.com/api/upload" (يرجع { url })
  maxProofMB: 5,
  // دليل المقاسات (سم). ⚠ راجع الأرقام دي بقياسات الهودي الفعلية قبل النشر وعدّلها من هنا.
  sizeChart: {
    unit: "سم",
    columns: ["عرض الصدر", "الطول", "طول الكم"],
    rows: {
      S:   [56, 68, 60],
      M:   [58, 70, 62],
      L:   [60, 72, 63],
      XL:  [62, 74, 64],
      XXL: [64, 76, 65]
    }
  },
  // اتركهم فارغين = المتجر يستخدم قايمة المنتجات الموجودة تحت في الملف فقط
  firebase: { projectId: "onefournine-64aac", apiKey: "AIzaSyBB6IiTJsuc3okPZINrsayYl6fU1m9fsYY" },
  payments: {
    cod: { label: "الدفع عند الاستلام (COD)", type: "cod", value: "", recipient: "" },
    instapay: { label: "Instapay", type: "egp", value: "hamzayousry12@instapay", recipient: "حمزه", link: "https://ipn.eg/S/hamzayousry12/instapay/7mnK13" },
    vodafone: { label: "Vodafone Cash", type: "egp", value: "01066350362", recipient: "حمزه", link: "http://vf.eg/vfcash?id=mt&qrId=o6CZUu" }
  },
  imgbbUrl: "https://api.imgbb.com/1/upload",
  // ⚠ لا تضع المفتاح هنا في الملف المنشور: أي زائر يقدر يشوفه. استخدم Backend
  imgbbKey: "5b5b9be41904239d9320e800dfe90db8"
};

/* ==========================================================
   المنتجات — عدّل من هنا
   ملاحظة: البيانات تجريبية. الأسعار والمخزون والصور ليست نهائية.
   ========================================================== */
const LOCAL_PRODUCTS = [
  {
    id: "hoodie-black-001",
    name: "Onefournine Hoodie · أسود",
    description: "هودي أسود بتصميم عصري وخامة مريحة.",
    image: "hoodie-black-front.jpg",
    images: ["hoodie-black-front.jpg", "hoodie-black-back.jpg"],
    price: 950,
    discountPrice: 599,               // null = بدون خصم
    colors: [{ name: "أسود", value: "#08080A" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 20,
    featured: true,
    unavailableColors: [],
    unavailableSizes: []
  },
  {
    id: "hoodie-gray-001",
    name: "Onefournine Hoodie · رمادي",
    description: "هودي رمادي بخامة ناعمة وقصّة نظيفة.",
    image: "hoodie-gray-front.jpg",
    images: ["hoodie-gray-front.jpg", "hoodie-gray-back.jpg"],
    price: 950,
    discountPrice: 599,
    colors: [{ name: "رمادي", value: "#9A9EA0" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 20,
    featured: false,
    unavailableColors: [],
    unavailableSizes: []
  },
  {
    id: "hoodie-navy-001",
    name: "Onefournine Hoodie · VIP رمادي",
    description: "هودي رمادي VIP بجودة عالية وصناعة ممتازة.",
    image: "hoodie-vip-gray-front.jpg",
    images: ["hoodie-vip-gray-front.jpg", "hoodie-vip-gray-back.jpg"],
    price: 1050,
    discountPrice: 799,
    colors: [{ name: "رمادي VIP", value: "#9A9EA0" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 20,
    featured: false,
    unavailableColors: [],
    unavailableSizes: []
  },
  {
    id: "hoodie-beige-001",
    name: "Onefournine Hoodie · VIP أسود",
    description: "هودي أسود VIP بخامة ممتازة وجودة عالمية.",
    image: "hoodie-black-vip-front.jpg",
    images: ["hoodie-black-vip-front.jpg", "hoodie-black-vip-back.jpg"],
    price: 1050,
    discountPrice: 799,
    colors: [{ name: "أسود VIP", value: "#08080A" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 20,
    featured: false,
    unavailableColors: [],
    unavailableSizes: []
  }
];

/* ==========================================================
   منتجات الداشبورد (Firestore REST بدون مكتبات) مع نسخة محفوظة وبديل محلي
   ========================================================== */
const PRODUCTS_CACHE = "onefournine_products_v1";
let products = (() => {
  try { const c = JSON.parse(localStorage.getItem(PRODUCTS_CACHE)); if (Array.isArray(c) && c.length) return c; } catch { /* لا نسخة */ }
  return LOCAL_PRODUCTS;
})();
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
    return (d.documents || []).map((doc) => {
      const o = Object.fromEntries(Object.entries(doc.fields || {}).map(([k, x]) => [k, fsDec(x)]));
      return { unavailableColors: [], unavailableSizes: [], colors: [], sizes: [], stock: 0, discountPrice: null, ...o, id: doc.name.split("/").pop(), image: (o.images || [])[0] };
    }).filter((p) => p.active !== false && p.image && p.name && p.price > 0 && p.colors.length && p.sizes.length)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch { return null; } finally { clearTimeout(timer); }
}
async function syncProducts() {
  const list = await fetchRemoteProducts();
  if (!list?.length || JSON.stringify(list) === JSON.stringify(products)) return;  // فشل/فاضي/مفيش جديد: لا تغيير
  products = list;
  try { localStorage.setItem(PRODUCTS_CACHE, JSON.stringify(list)); } catch { /* تخزين غير متاح */ }
  cart = cart.filter((i) => findProduct(i.id));
  saveCart();
  renderProducts();
  renderCart();
  if (!$("#productView").hidden && !findProduct(detail?.id)) location.hash = "#products";
}

/* ==========================================================
   أدوات مساعدة
   ========================================================== */
const $ = (s) => document.querySelector(s);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => `${Number(n).toLocaleString("ar-EG")} ج.م`;
const findProduct = (id) => products.find((p) => p.id === id);
const discountPct = (p) =>
  p.discountPrice != null && p.discountPrice < p.price
    ? Math.round((1 - p.discountPrice / p.price) * 100)
    : 0;
const unitPrice = (p) => (discountPct(p) ? p.discountPrice : p.price);
const normPhone = (v) => String(v || "").replace(/[\s-]/g, "");
const fileSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} ميجابايت` : `${Math.round(b / 1024)} كيلوبايت`);
const CART_KEY = "onefournine_cart";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const FALLBACK_IMG = "this.onerror=null;this.src='images/placeholder.svg'";

let cart = loadCart();
let detail = null;       // اختيارات صفحة المنتج
let proofFile = null;
let proofURL = null;

function setStep(n) {
  document.querySelectorAll(".stepper li").forEach((li, i) => {
    li.classList.toggle("done", i + 1 < n);
    li.classList.toggle("on", i + 1 === n);
    li.setAttribute("aria-current", i + 1 === n ? "step" : "false");
  });
}

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
    toast("تم النسخ");
  } catch {
    const t = document.createElement("textarea");
    t.value = text;
    document.body.append(t);
    t.select();
    const ok = document.execCommand("copy");
    t.remove();
    toast(ok ? "تم النسخ" : "تعذّر النسخ، انسخه يدويًا");
  }
}

/* ==========================================================
   السلة (localStorage: بيانات المنتجات فقط، بدون أي بيانات حساسة)
   ========================================================== */
function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* تخزين غير متاح */ }
  renderCartCount();
}
const shipFee = () => (STORE_CONFIG.shippingEnabled && cart.length ? STORE_CONFIG.shippingFee : 0);
const orderTotal = () => cartTotal() + shipFee();
const familyOf = (p) => { const b = p.name.split("·")[0].trim(); return products.filter((x) => x.name.split("·")[0].trim() === b); };
const IC = (d) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
async function shareProduct(p) {
  const url = location.href;
  try { if (navigator.share) return await navigator.share({ title: p.name, url }); } catch { return; }
  copyText(url);
}
function usedStock(id) {
  return cart.filter((i) => i.id === id).reduce((a, i) => a + i.qty, 0);
}
function cartTotal() {
  return cart.reduce((s, i) => {
    const p = findProduct(i.id);
    return s + (p ? unitPrice(p) * i.qty : 0);
  }, 0);
}
function checkAdd(p, color, size, qty) {
  if (!color) return "اختر اللون أولًا.";
  if (!size) return "اختر المقاس أولًا.";
  if ((p.unavailableColors || []).includes(color)) return `اللون ${color} غير متاح حاليًا.`;
  if ((p.unavailableSizes || []).includes(size)) return `المقاس ${size} غير متاح حاليًا.`;
  if (usedStock(p.id) + qty > p.stock) return `الكمية المتاحة ${p.stock} قطعة فقط.`;
  return "";
}
function addToCart(id, color, size, qty = 1) {
  const p = findProduct(id);
  const err = checkAdd(p, color, size, qty);
  if (err) {
    toast(err);
    return false;
  }
  const line = cart.find((i) => i.id === id && i.color === color && i.size === size);
  if (line) line.qty += qty;
  else cart.push({ id, color, size, qty });
  saveCart();
  renderCart();
  bumpCart();
  toast("تمت الإضافة إلى السلة");
  return true;
}
function bumpCart() {
  const b = $("#cartBtn");
  b.classList.remove("bump");
  void b.offsetWidth;   // إعادة تشغيل الحركة
  b.classList.add("bump");
}

function renderCartCount() {
  const n = cart.reduce((a, i) => a + i.qty, 0);
  const c = $("#cartCount");
  c.textContent = n.toLocaleString("ar-EG");
  c.classList.toggle("is-empty", n === 0);
  $("#cartBtn").setAttribute("aria-label", n ? `سلة المشتريات، ${n} قطعة` : "سلة المشتريات");
}
const ICON_TRASH = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>';
function renderCart() {
  const box = $("#cartItems");
  const total = cartTotal();
  box.innerHTML = cart.length
    ? cart.map((i, idx) => {
        const p = findProduct(i.id);
        if (!p) return "";
        return `
        <article class="cart-item">
          <img src="${esc(imgUrl(p.image, 240))}" alt="${esc(p.name)}" width="84" height="104" loading="lazy" onerror="${FALLBACK_IMG}">
          <div class="ci-info">
            <div class="ci-top">
              <b>${esc(p.name)}</b>
              <button type="button" class="ci-rm" data-c="rm" data-idx="${idx}" aria-label="حذف ${esc(p.name)} من السلة">${ICON_TRASH}</button>
            </div>
            <span class="ci-meta">اللون: ${esc(i.color)} · المقاس: ${esc(i.size)}</span>
            ${i.qty > 1 ? `<span class="ci-unit">${money(unitPrice(p))} للقطعة</span>` : ""}
            <div class="ci-bottom">
              <div class="qty">
                <button type="button" data-c="dec" data-idx="${idx}" aria-label="تقليل الكمية">−</button>
                <output aria-live="polite">${i.qty.toLocaleString("ar-EG")}</output>
                <button type="button" data-c="inc" data-idx="${idx}" aria-label="زيادة الكمية">+</button>
              </div>
              <strong>${money(unitPrice(p) * i.qty)}</strong>
            </div>
          </div>
        </article>`;
      }).join("")
    : `<div class="cart-empty"><p>السلة فاضية.</p><button type="button" class="btn ghost" data-close>اكتشف المجموعة</button></div>`;
  const n = cart.reduce((a, i) => a + i.qty, 0);
  $("#cartSub").textContent = n ? `(${n.toLocaleString("ar-EG")})` : "";
  $("#cartSubtotal").textContent = money(total);
  $("#checkoutBtn").disabled = !cart.length;
  renderCartCount();
}

/* ==========================================================
   عرض المنتجات (بطاقة نظيفة: صورة + اسم + سعر، والتفاصيل في صفحة المنتج)
   ========================================================== */
const availColors = (p) => p.colors.filter((c) => !(p.unavailableColors || []).includes(c.name));
const productHref = (id) => `#/p/${encodeURIComponent(id)}`;
const LOW_STOCK = 5;
function priceHTML(p, withChip = true) {
  const d = discountPct(p);
  return `<div class="price"><b>${money(unitPrice(p))}</b>${d ? `<s>${money(p.price)}</s>${withChip ? `<span class="off">-${d.toLocaleString("ar-EG")}%</span>` : ""}` : ""}</div>`;
}
function cardHTML(p, isNew = false) {
  const d = discountPct(p);
  const imgs = p.images?.length ? p.images : [p.image];
  const out = p.stock <= 0;
  const cols = availColors(p);
  return `
  <a class="card${out ? " is-out" : ""}" href="${productHref(p.id)}" data-id="${esc(p.id)}" aria-label="${esc(p.name)}">
    <div class="media">
      <img class="img-main" src="${esc(imgUrl(p.image, 600))}" alt="${esc(p.name)}" width="600" height="750" loading="lazy" decoding="async" onerror="${FALLBACK_IMG}">
      ${imgs[1] ? `<img class="img-alt" src="${esc(imgUrl(imgs[1], 600))}" alt="" width="600" height="750" loading="lazy" decoding="async" aria-hidden="true">` : ""}
      ${out ? `<span class="badge out">نفد</span>` : isNew ? `<span class="badge" dir="ltr">NEW IN</span>` : d ? `<span class="badge" dir="ltr">SALE</span>` : ""}
      ${cols.length > 1 ? `<span class="dots" role="img" aria-label="الألوان المتاحة: ${esc(cols.map((c) => c.name).join("، "))}">${cols.slice(0, 5).map((c) => `<i class="dot" style="background:${esc(c.value)}"></i>`).join("")}</span>` : ""}
    </div>
    <div class="body">
      <h3>${esc(p.name)}</h3>
      ${priceHTML(p)}
      <span class="choose">${out ? "نفد المخزون" : "اختر المقاس"}</span>
    </div>
  </a>`;
}
function renderProducts() {
  $("#productGrid").innerHTML = products.map(cardHTML).join("") || `<p class="empty">لا توجد منتجات الآن.</p>`;
  $("#prodCount").textContent = products.length ? `(${products.length.toLocaleString("ar-EG")})` : "";
  updateAnnounce();
}
function updateAnnounce() {
  const max = Math.max(0, ...products.map(discountPct));
  $("#announceText").textContent = max ? `خصم حتى ${max.toLocaleString("ar-EG")}٪ · الدفع عند الاستلام أو فودافون كاش أو InstaPay` : "الدفع عند الاستلام أو فودافون كاش أو InstaPay";
}

/* ==========================================================
   صفحة المنتج (مسار: #/p/ID — يعمل مع زر الرجوع في أندرويد)
   ========================================================== */
let homeScroll = 0;
const ICON_CHECK = "";
function setView(name) {
  $("#homeView").hidden = name !== "home";
  $("#productView").hidden = name !== "product";
  $("#topbar").classList.remove("is-hidden");
  document.title = name === "home" ? "Onefournine | 149" : document.title;
}
function route() {
  const h = location.hash || "";
  const m = h.match(/^#\/p\/(.+)$/);
  const id = m ? decodeURIComponent(m[1]) : null;
  const wasProduct = !$("#productView").hidden;
  if (id && findProduct(id)) {
    if (!wasProduct) homeScroll = window.scrollY;
    showProduct(id);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    return;
  }
  if (wasProduct) { teardownProduct(); }
  setView("home");
  const target = h.length > 1 && !h.startsWith("#/") ? document.getElementById(h.slice(1)) : null;
  requestAnimationFrame(() => {
    if (target) target.scrollIntoView();
    else if (wasProduct) window.scrollTo(0, homeScroll);
  });
}

let pdObserver = null;
function teardownProduct() {
  if (pdObserver) { pdObserver.disconnect(); pdObserver = null; }
  detail = null;
  $("#productView").innerHTML = "";
}

function showProduct(id) {
  const p = findProduct(id);
  teardownProduct();
  const firstColor = (availColors(p)[0] || p.colors[0])?.name || null;
  detail = { id, color: firstColor, size: null, qty: 1 };
  document.title = `${p.name} | Onefournine`;
  const d = discountPct(p);
  const imgs = p.images?.length ? p.images : [p.image];
  const others = products.filter((x) => x.id !== id).slice(0, 4);
  $("#productView").innerHTML = `
    <div class="wrap">
      <nav class="crumbs" aria-label="مسار التنقل"><a href="#top">الرئيسية</a><span aria-hidden="true">/</span><a href="#products">المنتجات</a><span aria-hidden="true">/</span><span>${esc(p.name)}</span></nav>
      <div class="pdp">
        <div class="pg-wrap">
          <div class="pg" id="pg" aria-label="صور المنتج">
            ${imgs.map((src, i) => `
            <button type="button" class="pg-item" data-zoom="${i}" aria-label="تكبير الصورة ${i + 1}">
              <img src="${esc(imgUrl(src, 1100))}" alt="${esc(p.name)} - ${i + 1}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" onerror="${FALLBACK_IMG}">
            </button>`).join("")}
          </div>
          ${d ? `<span class="badge" dir="ltr">-${d.toLocaleString("ar-EG")}%</span>` : ""}
          ${imgs.length > 1 ? `<span class="pg-count" id="pgCount">1 / ${imgs.length}</span>` : ""}
          ${imgs.length > 1 ? `<div class="pg-dots" id="pgDots" aria-hidden="true">${imgs.map((_, i) => `<i class="${i === 0 ? "on" : ""}"></i>`).join("")}</div>` : ""}
        </div>
        <div class="info">
          <h1>${esc(p.name)}</h1>
          ${priceHTML(p)}
          <div id="buyBox"></div>
          <div class="gtk">
            <h4>مهم تعرفه</h4>
            <ul>
              <li>${IC('<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>')}الدفع عند الاستلام متاح</li>
              <li>${IC('<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/>')}التوصيل خلال ٢–٥ أيام عمل</li>
              <li>${IC('<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>')}استرجاع واستبدال سهل</li>
            </ul>
          </div>
          <div class="pd-acc">
            <div class="acc-item open">
              <h3><button class="acc-q" id="dq1" type="button" aria-expanded="true" aria-controls="da1">التفاصيل<span class="plus" aria-hidden="true"></span></button></h3>
              <div class="acc-a" id="da1" role="region" aria-labelledby="dq1"><div><p>${esc(p.description || "")} تقدر تطبع اسمك على القطعة (حتى ٢٠ حرف) أثناء إتمام الطلب.</p></div></div>
            </div>
            <div class="acc-item">
              <h3><button class="acc-q" id="dq2" type="button" aria-expanded="false" aria-controls="da2">الشحن<span class="plus" aria-hidden="true"></span></button></h3>
              <div class="acc-a" id="da2" role="region" aria-labelledby="dq2"><div><p>رسوم الشحن ${money(STORE_CONFIG.shippingFee)} لكل المحافظات، والتوصيل خلال ٢–٥ أيام عمل. الدفع عند الاستلام أو فودافون كاش أو InstaPay.</p></div></div>
            </div>
            <div class="acc-item">
              <h3><button class="acc-q" id="dq3" type="button" aria-expanded="false" aria-controls="da3">دليل المقاسات<span class="plus" aria-hidden="true"></span></button></h3>
              <div class="acc-a" id="da3" role="region" aria-labelledby="dq3"><div>${sizeGuideHTML()}</div></div>
            </div>
          </div>
          <button type="button" class="share-btn" data-d="share">${IC('<path d="M12 15V4M8 8l4-4 4 4M5 13v6h14v-6"/>')}مشاركة</button>
        </div>
      </div>
      ${others.length ? `<section class="related" aria-label="منتجات أخرى"><h2>قد يعجبك أيضًا</h2><div class="grid">${others.map((x) => cardHTML(x, true)).join("")}</div></section>` : ""}
    </div>
    <div class="sticky-atc" id="stickyAtc" aria-hidden="true">
      <div class="sa-info"><span class="sa-name">${esc(p.name)}</span><span class="sa-price" id="saPrice"></span></div>
      <button type="button" class="btn" id="saBtn" tabindex="-1"></button>
    </div>`;
  setView("product");
  renderBuy();
  (p.images || []).forEach((src) => { new Image().src = imgUrl(src, 1100); });

  // نقاط المعرض + العدّاد أثناء السحب
  const pg = $("#pg");
  if (imgs.length > 1 && pg) {
    pg.addEventListener("scroll", () => {
      const w = pg.clientWidth || 1;
      const i = Math.min(imgs.length - 1, Math.max(0, Math.round(Math.abs(pg.scrollLeft) / w)));
      $("#pgCount").textContent = `${i + 1} / ${imgs.length}`;
      document.querySelectorAll("#pgDots i").forEach((el, n) => el.classList.toggle("on", n === i));
    }, { passive: true });
  }

  // شريط الإضافة اللاصق يظهر لما زر الإضافة الأساسي يخرج من الشاشة
  const addBtn = $("#addBtn");
  if (addBtn && "IntersectionObserver" in window) {
    pdObserver = new IntersectionObserver(([en]) => {
      const bar = $("#stickyAtc");
      if (!bar) return;
      const show = !en.isIntersecting && en.boundingClientRect.top < 0;
      bar.classList.toggle("show", show);
      bar.setAttribute("aria-hidden", String(!show));
      $("#saBtn").tabIndex = show ? 0 : -1;
    }, { threshold: 0 });
    pdObserver.observe(addBtn);
  }
}

// يعيد رسم صندوق الشراء فقط (اللون/المقاس/الكمية/الزر) بدون لمس المعرض
function renderBuy() {
  if (!detail) return;
  const p = findProduct(detail.id);
  if (!p) return;
  const left = Math.max(p.stock - usedStock(p.id), 0);
  const out = p.stock <= 0;
  const soldOut = !out && left <= 0;
  const st = out ? ["out", "نفد المخزون"] : soldOut ? ["out", "وصلت للحد الأقصى المتاح في السلة"] : left <= LOW_STOCK ? ["low", `آخر ${left.toLocaleString("ar-EG")} قطع متاحة`] : ["ok", "متوفر"];
  const unSizes = p.unavailableSizes || [];
  const unCols = p.unavailableColors || [];
  const lowAll = !out && left <= LOW_STOCK;
  const fam = familyOf(p);
  const needSize = !detail.size && !out && !soldOut;
  $("#buyBox").innerHTML = `
    <div class="avail ${st[0]}">${st[1]}</div>
    ${fam.length > 1 ? `
    <div class="opt">
      <div class="opt-head">اللون <span>${esc(detail.color || "")}</span></div>
      <div class="sw-thumbs" role="group" aria-label="اللون">
        ${fam.map((x) => `<a class="sw-thumb ${x.id === p.id ? "on" : ""}" href="${productHref(x.id)}" aria-label="${esc(x.name)}" ${x.id === p.id ? 'aria-current="true"' : ""}><img src="${esc(imgUrl(x.image, 200))}" alt="" width="70" height="88" loading="lazy"></a>`).join("")}
      </div>
    </div>` : p.colors.length ? `
    <div class="opt">
      <div class="opt-head">اللون <span>${esc(detail.color || "")}</span></div>
      <div class="swatches" role="group" aria-label="اللون">
        ${p.colors.map((c) => `<button type="button" class="swatch ${detail.color === c.name ? "on" : ""}" style="background:${esc(c.value)}" data-d="color" data-v="${esc(c.name)}" aria-label="${esc(c.name)}" aria-pressed="${detail.color === c.name}" ${unCols.includes(c.name) ? "disabled" : ""}></button>`).join("")}
      </div>
    </div>` : ""}
    <div class="opt">
      <div class="opt-head">المقاس <button type="button" class="link-btn" data-d="guide">دليل المقاسات</button></div>
      <div class="sizes" id="pdSizes" role="group" aria-label="المقاس">
        ${p.sizes.map((z) => `<button type="button" class="size ${detail.size === z ? "on" : ""} ${lowAll ? "low" : ""}" data-d="size" data-v="${esc(z)}" aria-pressed="${detail.size === z}" ${unSizes.includes(z) ? "disabled" : ""}>${esc(z)}</button>`).join("")}
      </div>
      <p class="size-note" id="sizeNote" role="status">${detail.size ? `المقاس المختار: ${esc(detail.size)}` : "اختر المقاس"}</p>
    </div>
    <p class="ship-note"><i aria-hidden="true"></i>الطلبات تُشحن خلال ٢–٥ أيام.</p>
    <div class="buy-row">
      <div class="qty">
        <button type="button" data-d="dec" aria-label="تقليل الكمية">−</button>
        <output aria-live="polite">${detail.qty.toLocaleString("ar-EG")}</output>
        <button type="button" data-d="inc" aria-label="زيادة الكمية">+</button>
      </div>
      <button type="button" class="btn ${needSize ? "is-needs" : ""}" id="addBtn" data-d="add" ${out || soldOut ? "disabled" : ""}>${out ? "غير متاح" : soldOut ? "تم الوصول للحد الأقصى" : needSize ? "اختر المقاس" : `أضف إلى السلة · ${money(unitPrice(p) * detail.qty)}`}</button>
    </div>
    <button type="button" class="btn ghost buy-now" data-d="buynow" ${out || soldOut ? "disabled" : ""}>اشترِ الآن</button>`;
  // الشريط اللاصق
  const sa = $("#saBtn");
  if (sa) {
    $("#saPrice").textContent = money(unitPrice(p) * detail.qty);
    sa.textContent = out ? "غير متاح" : "أضف إلى السلة";
    sa.disabled = out || soldOut;
    sa.dataset.d = "add";
  }
  // إعادة ربط المراقب بالزر الجديد
  if (pdObserver) { pdObserver.disconnect(); const b = $("#addBtn"); if (b) pdObserver.observe(b); }
}

function openSizeGuide() {
  const c = STORE_CONFIG.sizeChart;
  const p = detail ? findProduct(detail.id) : null;
  $("#sizeGuide").innerHTML = sizeGuideHTML();
  $("#sizeDialog").showModal();
}
function sizeGuideHTML() {
  const c = STORE_CONFIG.sizeChart;
  const sizes = Object.keys(c.rows);
  return `
    <div class="sg-table-wrap"><table class="sg-table">
      <thead><tr><th>SIZE</th>${c.columns.map((x) => `<th dir="rtl">${esc(x)}</th>`).join("")}</tr></thead>
      <tbody>${sizes.map((z) => `<tr class="${detail?.size === z ? "hl" : ""}"><th scope="row">${esc(z)}</th>${c.rows[z].map((v) => `<td>${Number(v).toLocaleString("en")}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></div>
    <p class="sg-unit">كل القياسات بالـ${esc(c.unit)} وممكن يكون فيها فرق بسيط (١–٢ ${esc(c.unit)}).</p>
    <ul class="sg-tips">
      <li><b>عرض الصدر:</b> قيس من تحت الإبط للإبط والقطعة مفرودة على سطح مستوي.</li>
      <li><b>الطول:</b> من أعلى الكتف جنب الرقبة لحد نهاية الهودي.</li>
      <li><b>مش متأكد من مقاسك؟</b> قارن القياسات بهودي بيريحك، أو كلمنا على واتساب.</li>
    </ul>`;
}

function openZoom(i) {
  if (!detail) return;
  const p = findProduct(detail.id);
  const imgs = p.images?.length ? p.images : [p.image];
  const z = $("#zoomImg");
  z.src = imgUrl(imgs[i] || imgs[0], 1800);
  z.alt = p.name;
  $("#zoomDialog").showModal();
}

/* ==========================================================
   إثبات التحويل
   ========================================================== */
function checkProofFile(f) {
  if (!ALLOWED_TYPES.includes(f.type)) return "نوع الملف غير مدعوم. اختر صورة JPG أو PNG أو WEBP.";
  if (f.size > STORE_CONFIG.maxProofMB * 1048576) return `حجم الصورة أكبر من ${STORE_CONFIG.maxProofMB} ميجابايت.`;
  return "";
}
function setProof(file) {
  const err = checkProofFile(file);
  if (err) return setErr(err);
  clearProof();
  proofFile = file;
  proofURL = URL.createObjectURL(file);
  $("#proofBox").innerHTML = `
    <img class="proof-img" src="${proofURL}" alt="معاينة إثبات التحويل">
    <div class="proof-meta"><span dir="ltr">${file.name}</span><span>${fileSize(file.size)}</span></div>
    <button type="button" class="btn ghost" id="removeProof">حذف الصورة واختيار صورة أخرى</button>`;
  setErr("");
  setStep(4);
}
function clearProof() {
  if (proofURL) URL.revokeObjectURL(proofURL);
  proofFile = null;
  proofURL = null;
  $("#proofBox").innerHTML = "";
  $("#proof").value = "";
}

/* ==========================================================
   الدفع والتحقق
   ========================================================== */
function renderPayInfo() {
  const key = document.querySelector('input[name="pay"]:checked')?.value;
  setStep(key ? (key === "cod" ? 4 : 3) : 2);
  $("#proofBlock").hidden = key === "cod";
  const box = $("#payInfo");
  if (!key) {
    box.innerHTML = `<p class="muted">اختر وسيلة الدفع لتظهر لك خطوات الدفع.</p>`;
    return;
  }
  const m = STORE_CONFIG.payments[key];
  const total = orderTotal();
  if (key === "cod") {
    box.innerHTML = `<div class="pay-card"><div class="pay-amount"><span>المبلغ عند الاستلام (شامل الشحن)</span><b>${money(total)}</b></div><p class="pay-hint">هتدفع كاش للمندوب وقت استلام طلبك. بنأكد معاك على واتساب قبل الشحن.</p></div>`;
    return;
  }
  box.innerHTML = `
    <div class="pay-card">
      <div class="pay-amount"><span>المبلغ المطلوب</span><b>${money(total)}</b></div>
      ${m.link ? `<a class="btn" href="${esc(m.link)}" target="_blank" rel="noopener noreferrer">ادفع الآن عبر ${esc(m.label)}</a>` : ""}
      <p class="pay-hint">هيفتح لك ${esc(m.label)} مباشرة. حوّل نفس المبلغ بالظبط، وبعدها ارجع هنا وارفع صورة التحويل واضغط تأكيد. وبنراجع الدفع يدويًا بعد إرسال الطلب على واتساب.</p>
      <div class="pay-alt">
        <span>أو حوّل يدويًا:</span><b dir="ltr">${esc(m.value)}</b>${m.recipient ? `<span>(${esc(m.recipient)})</span>` : ""}
        <button type="button" class="copy" data-copy="${esc(m.value)}">نسخ الحساب</button>
        <button type="button" class="copy" data-copy="${total}">نسخ المبلغ</button>
      </div>
    </div>`;
}

function validateForm(f) {
  const d = new FormData(f);
  const name = (d.get("name") || "").trim();
  const phone = normPhone(d.get("phone"));
  const print = (d.get("printName") || "").trim();
  if (name.length < 10) return "اكتب اسمك الكامل ،اوالثلاثي على الأقل.";
  if (!/^01[0125]\d{8}$/.test(phone)) return "اكتب رقم موبايل مصري صحيح من 11 رقم يبدأ بـ 01.";
  if (print && !/^[\p{L}\p{N} .\-]{1,10}$/u.test(print)) return "الاسم المطلوب طباعته: حروف وأرقام فقط، حتى 10 حرفًا.";
  if (STORE_CONFIG.shippingEnabled) {
    if (!(d.get("governorate") || "").trim()) return "اختر المحافظة.";
    if ((d.get("city") || "").trim().length < 2) return "اكتب المدينة أو المنطقة.";
    if ((d.get("address") || "").trim().length < 10) return "اكتب العنوان بالتفصيل.";
  }
  if (!d.get("pay")) return "اختر وسيلة الدفع.";
  if (d.get("pay") !== "cod" && !proofFile) return "ارفع صورة إثبات التحويل.";
  return "";
}

function setErr(msg) {
  $("#formError").textContent = msg;
}

function openCheckout() {
  $("#shipBlock").hidden = !STORE_CONFIG.shippingEnabled;
  $("#orderSummary").innerHTML = cart.map((i) => {
    const p = findProduct(i.id);
    return `<div class="sum-row"><span>${esc(p.name)} · ${esc(i.color)} · ${esc(i.size)} × ${i.qty}</span><b>${money(unitPrice(p) * i.qty)}</b></div>`;
  }).join("") + `<div class="sum-row"><span>المجموع الفرعي</span><b>${money(cartTotal())}</b></div><div class="sum-row"><span>الشحن</span><b>${money(shipFee())}</b></div><div class="sum-row total"><span>الإجمالي</span><b>${money(orderTotal())}</b></div>`;
  $("#coTotal").textContent = money(cartTotal());
  $("#coGrand").textContent = money(orderTotal());
  $("#coShip").hidden = !shipFee();
  $("#coShipFee").textContent = money(shipFee());
  renderPayInfo();
  setErr("");
  setStep(2);
  $("#checkoutDialog").showModal();
}

/* ==========================================================
   الطلب: رقم مرجعي، تجهيز البيانات، الإرسال
   ========================================================== */
function makeRef() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rnd = crypto.getRandomValues(new Uint8Array(6));
  return `149-${ymd}-${[...rnd].map((x) => chars[x % chars.length]).join("")}`;
}

function buildOrder(f) {
  const d = new FormData(f);
  const key = d.get("pay");
  const pay = STORE_CONFIG.payments[key];
  return {
    ref: makeRef(),
    createdAt: new Date().toISOString(),
    customer: {
      name: d.get("name").trim(),
      phone: normPhone(d.get("phone")),
      printName: (d.get("printName") || "").trim(),
      governorate: STORE_CONFIG.shippingEnabled ? d.get("governorate").trim() : "",
      city: STORE_CONFIG.shippingEnabled ? (d.get("city") || "").trim() : "",
      address: STORE_CONFIG.shippingEnabled ? d.get("address").trim() : ""
    },
    items: cart.map((i) => {
      const p = findProduct(i.id);
      return {
        id: i.id, name: p.name, color: i.color, size: i.size, qty: i.qty,
        originalPrice: p.price, discount: discountPct(p), unitPrice: unitPrice(p)
      };
    }),
    subtotal: cartTotal(),
    shipping: shipFee(),
    total: orderTotal(), // الخادم يجب أن يعيد حسابه من المنتجات الموثوقة
    payment: {
      method: key, type: pay.type, label: pay.label, recipient: pay.recipient || ""
    },
    status: key === "cod" ? "دفع عند الاستلام - في انتظار التأكيد" : "في انتظار مراجعة الدفع",
    proofUrl: null
  };
}

function waURL(o) {
  const lines = [
    "*طلب جديد - Onefournine*",
    `الرقم المرجعي: ${o.ref}`,
    `التاريخ والوقت: ${new Date(o.createdAt).toLocaleString("ar-EG")}`,
    `اسم العميل: ${o.customer.name}`,
    `رقم الهاتف: ${o.customer.phone}`,
    `الاسم المطلوب طباعته: ${o.customer.printName || "-"}`
  ];
  if (STORE_CONFIG.shippingEnabled) lines.push(`المحافظة: ${o.customer.governorate}`, `المدينة: ${o.customer.city}`, `العنوان: ${o.customer.address}`);
  lines.push("", "*المنتجات:*");
  o.items.forEach((i, n) => {
    lines.push(`${n + 1}) ${i.name} | ${i.color} | ${i.size} | الكمية: ${i.qty}`);
    lines.push(i.discount
      ? `   السعر الأصلي: ${money(i.originalPrice)} | الخصم: ${i.discount}% | سعر القطعة: ${money(i.unitPrice)}`
      : `   سعر القطعة: ${money(i.unitPrice)}`);
  });
  const cod = o.payment.method === "cod";
  lines.push("", `المجموع الفرعي: ${money(o.subtotal)}`, `الشحن: ${money(o.shipping)}`, `*الإجمالي: ${money(o.total)}*`, `وسيلة الدفع: ${o.payment.label}`);
  if (!cod) lines.push(`اسم المستلم: ${o.payment.recipient}`, o.proofUrl ? `رابط إثبات التحويل: ${o.proofUrl}` : "صورة إثبات التحويل: سأرسلها في المحادثة.");
  lines.push(`حالة الطلب: ${o.status}`);
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

async function fetchWithTimeout(url, opts) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } catch {
    throw new Error("تعذّر الاتصال بالخادم. تحقق من الإنترنت وحاول مرة أخرى.");
  } finally {
    clearTimeout(timer);
  }
}

async function uploadProof() {
  const fd = new FormData();
  fd.append("image", proofFile);
  if (STORE_CONFIG.imgbbKey) {
    fd.append("key", STORE_CONFIG.imgbbKey);
    const res = await fetchWithTimeout(STORE_CONFIG.imgbbUrl, { method: "POST", body: fd });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.data?.url) throw new Error("فشل رفع صورة الإثبات. حاول مرة أخرى.");
    return data.data.url;
  }
  const res = await fetchWithTimeout(STORE_CONFIG.uploadEndpoint, { method: "POST", body: fd });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.url) throw new Error("فشل رفع صورة الإثبات. حاول مرة أخرى.");
  return data.url;
}

async function postOrder(order) {
  const res = await fetchWithTimeout(STORE_CONFIG.ordersEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error("تعذّر حفظ الطلب على الخادم. لم يتم مسح السلة، حاول مرة أخرى.");
}

/* حفظ الطلب في Firestore ليظهر في لوحة التحكم (لو فشل، الطلب يكمل على واتساب) */
const fsEnc = (v) => v === null || v === undefined ? { nullValue: null }
  : typeof v === "string" ? { stringValue: v }
  : typeof v === "boolean" ? { booleanValue: v }
  : typeof v === "number" ? (Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v })
  : Array.isArray(v) ? { arrayValue: { values: v.map(fsEnc) } }
  : { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fsEnc(x)])) } };

async function saveOrderToFirestore(o) {
  const c = STORE_CONFIG.firebase;
  if (!c?.projectId || !c?.apiKey) return;
  const doc = {
    ref: o.ref, createdAt: Date.now(), name: o.customer.name, phone: o.customer.phone,
    printName: o.customer.printName || "", total: o.total, payment: o.payment.label,
    recipient: o.payment.recipient || "", status: o.status, proofUrl: o.proofUrl || "",
    items: o.items.map((i) => ({ name: i.name, color: i.color, size: i.size, qty: i.qty, unitPrice: i.unitPrice }))
  };
  const url = `https://firestore.googleapis.com/v1/projects/${c.projectId}/databases/(default)/documents/orders?documentId=${encodeURIComponent(o.ref)}&key=${c.apiKey}`;
  const res = await fetchWithTimeout(url, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(doc).map(([k, v]) => [k, fsEnc(v)])) })
  });
  if (!res.ok) throw new Error("order-save-failed");
}

async function onSubmit(e) {
  e.preventDefault();
  setErr("");
  const form = $("#orderForm");
  const err = validateForm(form);
  if (err) return setErr(err);

  // التحقق من المخزون قبل الإرسال (الخادم هو المرجع الحقيقي)
  for (const i of cart) {
    const p = findProduct(i.id);
    if (!p) return setErr("منتج في السلة لم يعد متاحًا.");
    if (usedStock(p.id) > p.stock) return setErr(`الكمية المتاحة من ${p.name} ${p.stock} قطعة فقط.`);
  }

  const btn = $("#submitBtn");
  btn.disabled = true;
  btn.textContent = "جارٍ الإرسال...";
  try {
    const order = buildOrder(form);
    // رفع صورة الإثبات (imgbb أو uploadEndpoint) ويتضاف رابطها في رسالة واتساب.
    // لو الرفع فشل، الطلب يكمل والعميل يبعت الصورة في المحادثة.
    if (proofFile && (STORE_CONFIG.imgbbKey || STORE_CONFIG.uploadEndpoint)) {
      try { order.proofUrl = await uploadProof(); } catch { order.proofUrl = null; }
    }
    if (STORE_CONFIG.ordersEndpoint) await postOrder(order);
    try { await saveOrderToFirestore(order); } catch {}
    const url = waURL(order);
    cart = [];
    saveCart();
    renderCart();
    clearProof();
    form.reset();
    $("#checkoutDialog").close();
    window.location.href = url; // تحويل مباشر لواتساب
  } catch (ex) {
    setErr(ex.message || "تعذّر إرسال الطلب. حاول مرة أخرى.");
  } finally {
    btn.disabled = false;
    btn.textContent = "تأكيد إرسال الطلب";
  }
}

/* ==========================================================
   التهيئة والأحداث
   ========================================================== */
function init() {
  document.querySelectorAll("[data-ship-fee]").forEach((el) => { el.textContent = money(STORE_CONFIG.shippingFee); });
  $("#footerText").textContent = STORE_CONFIG.footerText;
  $("#devText").textContent = STORE_CONFIG.developer;
  $("#year").textContent = new Date().getFullYear();
  [["#igLink", STORE_CONFIG.socialLinks.instagram], ["#ttLink", STORE_CONFIG.socialLinks.tiktok]].forEach(([sel, url]) => {
    const a = $(sel);
    if (/^https?:\/\//.test(url)) a.href = url;
    else a.hidden = true; // لا تظهر الرابط قبل وضعه
  });

  $("#cGov").innerHTML = `<option value="">اختر المحافظة</option>` + STORE_CONFIG.governorates.map((g) => `<option>${esc(g)}</option>`).join("");
  renderProducts();
  renderCart();
  syncProducts();

  /* الهيدر: يختفي عند النزول ويظهر عند الصعود */
  const bar = $("#topbar"), mnav = $("#mobileNav"), menuBtn = $("#menuBtn");
  let lastY = window.scrollY, ticking = false;
  const setMenu = (open) => { mnav.hidden = !open; menuBtn.setAttribute("aria-expanded", String(open)); if (open) bar.classList.remove("is-hidden"); };
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      bar.classList.toggle("is-stuck", y > 8);
      if (mnav.hidden) {
        if (y > lastY + 6 && y > 160) bar.classList.add("is-hidden");
        else if (y < lastY - 6 || y < 160) bar.classList.remove("is-hidden");
      }
      lastY = y;
      ticking = false;
    });
  }, { passive: true });
  menuBtn.addEventListener("click", () => setMenu(mnav.hidden));
  mnav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("click", (e) => { if (!mnav.hidden && !e.target.closest("#topbar")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !mnav.hidden) { setMenu(false); menuBtn.focus(); } });

  /* الأسئلة الشائعة */
  $(".acc").addEventListener("click", (e) => {
    const q = e.target.closest(".acc-q");
    if (!q) return;
    const item = q.closest(".acc-item");
    const willOpen = !item.classList.contains("open");
    document.querySelectorAll(".acc-item.open").forEach((i) => {
      i.classList.remove("open");
      i.querySelector(".acc-q").setAttribute("aria-expanded", "false");
    });
    if (willOpen) { item.classList.add("open"); q.setAttribute("aria-expanded", "true"); }
  });

  /* صفحة المنتج: اللون / المقاس / الكمية / الإضافة / الدليل / التكبير / الأكورديون */
  $("#productView").addEventListener("click", (e) => {
    const z = e.target.closest("[data-zoom]");
    if (z) return openZoom(Number(z.dataset.zoom));
    const q = e.target.closest(".pd-acc .acc-q");
    if (q) {
      const item = q.closest(".acc-item");
      const open = !item.classList.contains("open");
      item.classList.toggle("open", open);
      q.setAttribute("aria-expanded", String(open));
      return;
    }
    const b = e.target.closest("button[data-d]");
    if (!b || !detail) return;
    const p = findProduct(detail.id);
    if (!p) return;
    switch (b.dataset.d) {
      case "color": detail.color = b.dataset.v; break;
      case "size": detail.size = b.dataset.v; break;
      case "guide": return openSizeGuide();
      case "inc":
        if (usedStock(p.id) + detail.qty >= p.stock) return toast(`الكمية المتاحة ${p.stock} قطعة فقط.`);
        detail.qty++;
        break;
      case "dec": detail.qty = Math.max(1, detail.qty - 1); break;
      case "share": return shareProduct(p);
      case "buynow":
        if (!detail.size) { toast("لازم تختار المقاس"); const zs = $("#pdSizes"); zs.scrollIntoView({ block: "center", behavior: "smooth" }); zs.classList.remove("nudge"); void zs.offsetWidth; zs.classList.add("nudge"); return; }
        if (addToCart(p.id, detail.color, detail.size, detail.qty)) { detail.qty = 1; renderBuy(); openCheckout(); }
        return;
      case "add":
        if (!detail.size) {
          toast("لازم تختار المقاس");
          const zs = $("#pdSizes");
          zs.scrollIntoView({ block: "center", behavior: "smooth" });
          zs.classList.remove("nudge"); void zs.offsetWidth; zs.classList.add("nudge");
          return;
        }
        if (addToCart(p.id, detail.color, detail.size, detail.qty)) {
          detail.qty = 1;
          renderBuy();
          $("#cartDialog").showModal();   // زي المرجع: تفتح السلة بعد الإضافة
        }
        return;
    }
    renderBuy();
  });

  /* الراوتر: #/p/ID لصفحة المنتج، وباقي الروابط للأقسام */
  addEventListener("hashchange", route);
  route();

  $("#cartItems").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-c]");
    if (!b) return;
    const idx = Number(b.dataset.idx);
    const item = cart[idx];
    if (!item) return;
    const p = findProduct(item.id);
    if (b.dataset.c === "inc") {
      if (usedStock(p.id) + 1 > p.stock) return toast(`الكمية المتاحة ${p.stock} قطعة فقط.`);
      item.qty++;
    }
    if (b.dataset.c === "dec") item.qty = Math.max(1, item.qty - 1);
    if (b.dataset.c === "rm") cart.splice(idx, 1);
    saveCart();
    renderCart();
  });

  $("#cartBtn").addEventListener("click", () => {
    renderCart();
    $("#cartDialog").showModal();
  });
  $("#cartDialog").addEventListener("click", (e) => { if (e.target.id === "cartDialog") e.target.close(); });

  $("#checkoutBtn").addEventListener("click", () => {
    if (!cart.length) return toast("السلة فاضية.");
    $("#cartDialog").close();
    openCheckout();
  });

  $("#checkoutDialog").addEventListener("change", (e) => {
    if (e.target.name === "pay") renderPayInfo();
    if (e.target.id === "proof" && e.target.files[0]) setProof(e.target.files[0]);
  });

  $("#checkoutDialog").addEventListener("click", (e) => {
    const c = e.target.closest("[data-copy]");
    if (c) copyText(c.dataset.copy);
    if (e.target.closest("#removeProof")) clearProof();
  });

  $("#orderForm").addEventListener("submit", onSubmit);

  // إغلاق النوافذ بالضغط على الخلفية
  document.querySelectorAll("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));

  // أزرار الإغلاق
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-close]");
    if (!b) return;
    b.closest("dialog")?.close();
  });
}

document.addEventListener("DOMContentLoaded", init);

// أي صورة لا تُحمَّل تُستبدل بصورة احتياطية واضحة بدل المساحة البيضاء
document.addEventListener("error", (e) => {
  const t = e.target;
  if (t.tagName === "IMG" && !t.dataset.fb) {
    t.dataset.fb = "1";
    t.src = "images/placeholder.svg";
  }
}, true);
