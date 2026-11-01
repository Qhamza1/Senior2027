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
  shippingEnabled: false,
  // أضف هنا رابط الخادم عند تشغيل Backend. فارغ = لا يتم حفظ الطلب على خادم
  ordersEndpoint: "",   // مثال: "https://your-server.com/api/orders"
  uploadEndpoint: "",   // مثال: "https://your-server.com/api/upload" (يرجع { url })
  maxProofMB: 5,
  // اتركهم فارغين = المتجر يستخدم قايمة المنتجات الموجودة تحت في الملف فقط
  firebase: { projectId: "onefournine-64aac", apiKey: "AIzaSyBB6IiTJsuc3okPZINrsayYl6fU1m9fsYY" },
  payments: {
    instapay: { label: "Instapay", type: "egp", value: "hamzayousry12@instapay", recipient: "حمزه" },
    vodafone: { label: "Vodafone Cash", type: "egp", value: "01066350362", recipient: "حمزه" }
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
  const rail = $("#productGrid"), x = rail.scrollLeft;
  rail.style.scrollBehavior = "auto";
  renderProducts();
  rail.scrollLeft = x;
  rail.style.scrollBehavior = "";
  renderCart();
  if ($("#productDialog").open && !findProduct(detail?.id)) closeDetail();
}

/* ==========================================================
   أدوات مساعدة
   ========================================================== */
const $ = (s) => document.querySelector(s);
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
let picks = {};          // اختيارات بطاقات الصفحة الرئيسية
let detail = null;       // اختيارات نافذة التفاصيل
let currentFilter = "all";
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
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2600);
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
  toast("تمت الإضافة إلى السلة");
  return true;
}

function renderCartCount() {
  $("#cartCount").textContent = cart.reduce((a, i) => a + i.qty, 0);
}
function renderCart() {
  const box = $("#cartItems");
  box.innerHTML = cart.length
    ? cart.map((i, idx) => {
        const p = findProduct(i.id);
        if (!p) return "";
        return `
        <div class="cart-item">
          <img src="${imgUrl(p.image, 200)}" alt="${p.name}" onerror="${FALLBACK_IMG}">
          <div class="ci-info">
            <b>${p.name}</b>
            <span>اللون: ${i.color} · المقاس: ${i.size}</span>
            <span>${money(unitPrice(p))} للقطعة</span>
            <div class="qty">
              <button class="btn ghost" data-c="dec" data-idx="${idx}" aria-label="تقليل الكمية">−</button>
              <output>${i.qty}</output>
              <button class="btn ghost" data-c="inc" data-idx="${idx}" aria-label="زيادة الكمية">+</button>
              <button class="link-danger" data-c="rm" data-idx="${idx}">حذف</button>
            </div>
          </div>
          <strong>${money(unitPrice(p) * i.qty)}</strong>
        </div>`;
      }).join("")
    : `<p class="empty">السلة فاضية. اختار قطعتك من المتجر.</p>`;
  $("#cartTotal").textContent = money(cartTotal());
  $("#checkoutBtn").disabled = !cart.length;
  renderCartCount();
}

/* ==========================================================
   عرض المنتجات
   ========================================================== */
function pickOf(p) {
  return (picks[p.id] ||= { color: p.colors[0]?.name || null, size: null });
}
function cardHTML(p) {
  const pk = pickOf(p);
  const d = discountPct(p);
  const priceHTML = d
    ? `<s>${money(p.price)}</s><b>${money(p.discountPrice)}</b><span class="badge-inline">-${d}%</span>`
    : `<b>${money(p.price)}</b>`;
  return `
  <article class="card" data-id="${p.id}">
    <div class="media">
      <img src="${imgUrl(p.image, 700)}" alt="${p.name}" loading="lazy" onerror="${FALLBACK_IMG}">
      ${d ? `<span class="badge">-${d}%</span>` : ""}
    </div>
    <div class="body">
      <h3>${p.name}</h3>
      <p class="desc">${p.description}</p>
      <div class="price">${priceHTML}</div>
      <div class="opt-label">اللون${pk.color ? `: ${pk.color}` : ""}</div>
      <div class="swatches">
        ${p.colors.map((c) => `
          <button type="button" class="swatch ${pk.color === c.name ? "on" : ""}"
            style="background:${c.value}" data-act="color" data-v="${c.name}"
            aria-label="${c.name}" aria-pressed="${pk.color === c.name}"
            ${(p.unavailableColors || []).includes(c.name) ? "disabled" : ""}></button>`).join("")}
      </div>
      <div class="opt-label">المقاس${pk.size ? `: ${pk.size}` : ""}</div>
      <div class="sizes">
        ${p.sizes.map((z) => `
          <button type="button" class="size ${pk.size === z ? "on" : ""}" data-act="size" data-v="${z}"
            aria-pressed="${pk.size === z}"
            ${(p.unavailableSizes || []).includes(z) ? "disabled" : ""}>${z}</button>`).join("")}
      </div>
      <div class="actions">
        <button class="btn" data-act="add">أضف إلى السلة</button>
        <button class="btn ghost" data-act="details">عرض التفاصيل</button>
      </div>
    </div>
  </article>`;
}
function renderProducts() {
  const list = products.filter((p) => currentFilter === "all" || p.featured);
  $("#productGrid").innerHTML = list.map(cardHTML).join("") || `<p class="empty">لا توجد منتجات الآن.</p>`;
}

/* ==========================================================
   تفاصيل المنتج
   ========================================================== */
function openDetail(id) {
  const dlg = $("#productDialog");
  if (dlg.open || !findProduct(id)) return;
  const pk = pickOf(findProduct(id));
  detail = { id, color: pk.color, size: pk.size, qty: 1, img: 0 };
  renderDetail();
  document.body.classList.add("pd-lock");   // يمنع تمرير الصفحة خلف النافذة
  dlg.showModal();
  $("#productDetail").scrollTop = 0;
  (findProduct(id).images || []).forEach((src) => { new Image().src = src; });
}
// إغلاق بحركة ناعمة ثم إغلاق الـ dialog فعليًا
function closeDetail() {
  const dlg = $("#productDialog");
  if (!dlg.open || dlg.classList.contains("is-closing")) return;
  dlg.classList.add("is-closing");
  clearTimeout(closeDetail.timer);
  closeDetail.timer = setTimeout(() => {
    dlg.classList.remove("is-closing");
    dlg.close();
  }, 220);
}
function renderDetail() {
  const p = findProduct(detail.id);
  const d = discountPct(p);
  const imgs = p.images?.length ? p.images : [p.image];
  const idx = Math.min(detail.img || 0, imgs.length - 1);
  $("#productDetail").innerHTML = `
    <div class="pd-close-wrap"><button type="button" class="pd-close" data-close aria-label="إغلاق">×</button></div>
    <img class="d-img" src="${imgUrl(imgs[idx], 900)}" alt="${p.name}" onerror="${FALLBACK_IMG}">
    ${imgs.length > 1 ? `<div class="thumbs">${imgs.map((src, i) => `
      <button type="button" class="thumb ${i === idx ? "on" : ""}" data-d="img" data-v="${i}" aria-label="صورة ${i + 1}">
        <img src="${imgUrl(src, 160)}" alt="">
      </button>`).join("")}</div>` : ""}
    <h2>${p.name}</h2>
    <p class="desc">${p.description}</p>
    <div class="price">${d
      ? `<s>${money(p.price)}</s><b>${money(p.discountPrice)}</b><span class="badge-inline">-${d}%</span>`
      : `<b>${money(p.price)}</b>`}</div>
    <h3>اللون${detail.color ? `: ${detail.color}` : ""}</h3>
    <div class="swatches">
      ${p.colors.map((c) => `<button type="button" class="swatch ${detail.color === c.name ? "on" : ""}"
        style="background:${c.value}" data-d="color" data-v="${c.name}" aria-label="${c.name}"
        aria-pressed="${detail.color === c.name}"
        ${(p.unavailableColors || []).includes(c.name) ? "disabled" : ""}></button>`).join("")}
    </div>
    <h3>المقاس${detail.size ? `: ${detail.size}` : ""}</h3>
    <div class="sizes">
      ${p.sizes.map((z) => `<button type="button" class="size ${detail.size === z ? "on" : ""}"
        data-d="size" data-v="${z}" aria-pressed="${detail.size === z}"
        ${(p.unavailableSizes || []).includes(z) ? "disabled" : ""}>${z}</button>`).join("")}
    </div>
    <h3>الكمية</h3>
    <div class="qty">
      <button class="btn ghost" data-d="dec" aria-label="تقليل">−</button>
      <output>${detail.qty}</output>
      <button class="btn ghost" data-d="inc" aria-label="زيادة">+</button>
    </div>
    <div class="total-row"><span>إجمالي السعر</span><strong>${money(unitPrice(p) * detail.qty)}</strong></div>
    <button class="btn" data-d="add">أضف إلى السلة</button>
    <button class="btn ghost" data-close>إغلاق</button>`;
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
  setStep(key ? 3 : 2);
  const box = $("#payInfo");
  if (!key) {
    box.innerHTML = `<p class="muted">اختر وسيلة الدفع لتظهر بيانات التحويل.</p>`;
    return;
  }
  const m = STORE_CONFIG.payments[key];
  const instr = `حوّل مبلغ <b>${money(cartTotal())}</b> عبر ${m.label} إلى الحساب التالي، ثم أدخل رقم هاتفك وارفع الإيصال:`;
  box.innerHTML = `
    <div class="pay-card">
      <span class="muted">${m.label}</span>
      <b dir="ltr">${m.value}</b>
      ${m.recipient ? `<span>اسم المستلم: ${m.recipient}</span>` : ""}
      <button type="button" class="btn ghost" data-copy="${m.value}">نسخ الحساب</button>
    </div>
    <p class="pay-instr">${instr}</p>
    <ol class="steps">
      <li>راجع إجمالي المبلغ.</li>
      <li>حوّل المبلغ إلى الحساب المختار.</li>
      <li>احتفظ بصورة إثبات التحويل وارفعها هنا.</li>
      <li>راجع بياناتك ثم اضغط "تأكيد إرسال الطلب".</li>
    </ol>`;
}

function validateForm(f) {
  const d = new FormData(f);
  const name = (d.get("name") || "").trim();
  const phone = normPhone(d.get("phone"));
  const print = (d.get("printName") || "").trim();
  if (name.length < 3) return "اكتب اسمك الكامل، 3 حروف على الأقل.";
  if (!/^01[0125]\d{8}$/.test(phone)) return "اكتب رقم موبايل مصري صحيح من 11 رقم يبدأ بـ 01.";
  if (print && !/^[\p{L}\p{N} .\-]{1,20}$/u.test(print)) return "الاسم المطلوب طباعته: حروف وأرقام فقط، حتى 20 حرفًا.";
  if (STORE_CONFIG.shippingEnabled) {
    if (!(d.get("governorate") || "").trim()) return "اكتب المحافظة.";
    if ((d.get("address") || "").trim().length < 10) return "اكتب العنوان بالتفصيل.";
  }
  if (!d.get("pay")) return "اختر وسيلة الدفع.";
  if (!proofFile) return "ارفع صورة إثبات التحويل.";
  return "";
}

function setErr(msg) {
  $("#formError").textContent = msg;
}

function openCheckout() {
  $("#shipBlock").hidden = !STORE_CONFIG.shippingEnabled;
  $("#orderSummary").innerHTML = cart.map((i) => {
    const p = findProduct(i.id);
    return `<div class="sum-row"><span>${p.name} · ${i.color} · ${i.size} × ${i.qty}</span><b>${money(unitPrice(p) * i.qty)}</b></div>`;
  }).join("") + `<div class="sum-row total"><span>الإجمالي</span><b>${money(cartTotal())}</b></div>`;
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
      address: STORE_CONFIG.shippingEnabled ? d.get("address").trim() : ""
    },
    items: cart.map((i) => {
      const p = findProduct(i.id);
      return {
        id: i.id, name: p.name, color: i.color, size: i.size, qty: i.qty,
        originalPrice: p.price, discount: discountPct(p), unitPrice: unitPrice(p)
      };
    }),
    total: cartTotal(), // الخادم يجب أن يعيد حسابه من المنتجات الموثوقة
    payment: {
      method: key, type: pay.type, label: pay.label, recipient: pay.recipient || ""
    },
    status: "في انتظار مراجعة الدفع",
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
  if (STORE_CONFIG.shippingEnabled) lines.push(`المحافظة: ${o.customer.governorate}`, `العنوان: ${o.customer.address}`);
  lines.push("", "*المنتجات:*");
  o.items.forEach((i, n) => {
    lines.push(`${n + 1}) ${i.name} | ${i.color} | ${i.size} | الكمية: ${i.qty}`);
    lines.push(i.discount
      ? `   السعر الأصلي: ${money(i.originalPrice)} | الخصم: ${i.discount}% | سعر القطعة: ${money(i.unitPrice)}`
      : `   سعر القطعة: ${money(i.unitPrice)}`);
  });
  lines.push(
    "",
    `*الإجمالي: ${money(o.total)}*`,
    `وسيلة الدفع: ${o.payment.label}`,
    `اسم المستلم: ${o.payment.recipient}`,
    o.proofUrl ? `رابط إثبات التحويل: ${o.proofUrl}` : "صورة إثبات التحويل: سأرسلها في المحادثة.",
    `حالة الطلب: ${o.status}`
  );
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
    if (STORE_CONFIG.imgbbKey || STORE_CONFIG.uploadEndpoint) {
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
  $("#footerText").textContent = STORE_CONFIG.footerText;
  $("#devText").textContent = STORE_CONFIG.developer;
  $("#year").textContent = new Date().getFullYear();
  [["#igLink", STORE_CONFIG.socialLinks.instagram], ["#ttLink", STORE_CONFIG.socialLinks.tiktok]].forEach(([sel, url]) => {
    const a = $(sel);
    if (/^https?:\/\//.test(url)) a.href = url;
    else a.hidden = true; // لا تظهر الرابط قبل وضعه
  });

  renderProducts();
  renderCart();
  syncProducts();
  const rail = $("#productGrid");
  const step = () => (rail.querySelector(".card")?.offsetWidth || 300) + 16;
  $("#railNext").addEventListener("click", () => rail.scrollBy({ left: -step(), behavior: "smooth" }));
  $("#railPrev").addEventListener("click", () => rail.scrollBy({ left: step(), behavior: "smooth" }));

  document.querySelector(".filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    currentFilter = b.dataset.filter;
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === b));
    renderProducts();
  });

  $("#productGrid").addEventListener("click", (e) => {
    // الضغط على صورة المنتج (.media) يفتح التفاصيل مثل زر "عرض التفاصيل"
    const b = e.target.closest("button[data-act], .media");
    if (!b) return;
    const id = b.closest("[data-id]").dataset.id;
    const p = findProduct(id);
    const pk = pickOf(p);
    switch (b.dataset.act || "details") {
      case "color": pk.color = b.dataset.v; break;
      case "size": pk.size = b.dataset.v; break;
      case "add": addToCart(id, pk.color, pk.size); return;
      case "details": openDetail(id); return;
    }
    renderProducts();
  });

  $("#productDetail").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-d]");
    if (!b) return;
    const p = findProduct(detail.id);
    switch (b.dataset.d) {
      case "color": detail.color = b.dataset.v; break;
      case "size": detail.size = b.dataset.v; break;
      case "inc":
        if (usedStock(p.id) + detail.qty >= p.stock) return toast(`الكمية المتاحة ${p.stock} قطعة فقط.`);
        detail.qty++;
        break;
      case "img": detail.img = Number(b.dataset.v); break;
      case "dec": detail.qty = Math.max(1, detail.qty - 1); break;
      case "add":
        if (addToCart(p.id, detail.color, detail.size, detail.qty)) closeDetail();
        return;
    }
    renderDetail();
  });

  $("#cartItems").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-c]");
    if (!b) return;
    const idx = Number(b.dataset.idx);
    const item = cart[idx];
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


  // نافذة التفاصيل: إغلاق بالضغط خارج البطاقة أو بزر Esc/رجوع الأندرويد، وفك قفل التمرير
  const pDlg = $("#productDialog");
  pDlg.addEventListener("click", (e) => { if (e.target === pDlg) closeDetail(); });
  pDlg.addEventListener("cancel", (e) => { e.preventDefault(); closeDetail(); });
  pDlg.addEventListener("close", () => {
    document.body.classList.remove("pd-lock");
  });

  // أزرار الإغلاق
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-close]");
    if (!b) return;
    const dlg = b.closest("dialog");
    if (dlg?.id === "productDialog") closeDetail();
    else dlg?.close();
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

// iOS Safari يتجاهل user-scalable=no، فنمنع إيماءة القرص (pinch) يدويًا.
// لا تؤثر على اللمس العادي أو التمرير أو النقر.
["gesturestart", "gesturechange", "gestureend"].forEach((ev) =>
  document.addEventListener(ev, (e) => e.preventDefault(), { passive: false })
);
