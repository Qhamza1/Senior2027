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
let cart = loadCart();
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
  if (saleStatus(p) === "soon") return t("err.soon");
  if (!color) return t("err.pickColor");
  if (!size) return t("err.pickSize");
  if ((p.unavailableColors || []).includes(color)) return t("err.colorUnavail", { c: cLabel(p, color) });
  if ((p.unavailableSizes || []).includes(size)) return t("err.sizeUnavail", { s: size });
  if (usedStock(p.id) + qty > p.stock) return t("err.stock", { n: p.stock });
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
  toast(t("toast.added"));
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
  c.textContent = num(n);
  c.classList.toggle("is-empty", n === 0);
  $("#cartBtn").setAttribute("aria-label", n ? t("cart.ariaN", { n: num(n) }) : t("cart.aria"));
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
          <img src="${esc(imgUrl(colorImgs(p, i.color)[0], 240))}" alt="${esc(pName(p))}" width="84" height="104" loading="lazy" onerror="${FALLBACK_IMG}">
          <div class="ci-info">
            <div class="ci-top">
              <b>${esc(pName(p))}</b>
              <button type="button" class="ci-rm" data-c="rm" data-idx="${idx}" aria-label="${esc(t("cart.remove", { name: pName(p) }))}">${ICON_TRASH}</button>
            </div>
            <span class="ci-meta">${t("color")}: ${esc(cLabel(p, i.color))} · ${t("size.label")}: ${esc(i.size)}</span>
            ${i.qty > 1 ? `<span class="ci-unit">${t("cart.perPiece", { p: money(unitPrice(p)) })}</span>` : ""}
            <div class="ci-bottom">
              <div class="qty">
                <button type="button" data-c="dec" data-idx="${idx}" aria-label="${esc(t("qty.dec"))}">−</button>
                <output aria-live="polite">${num(i.qty)}</output>
                <button type="button" data-c="inc" data-idx="${idx}" aria-label="${esc(t("qty.inc"))}">+</button>
              </div>
              <strong>${money(unitPrice(p) * i.qty)}</strong>
            </div>
          </div>
        </article>`;
      }).join("")
    : `<div class="cart-empty"><p>${t("cart.empty")}</p><button type="button" class="btn ghost" data-close>${t("cart.discover")}</button></div>`;
  const n = cart.reduce((a, i) => a + i.qty, 0);
  $("#cartSub").textContent = n ? `(${num(n)})` : "";
  $("#cartSubtotal").textContent = money(total);
  $("#checkoutBtn").disabled = !cart.length;
  renderCartCount();
}

/* نقطة التهيئة الخاصة بالقسم ده — بتتنادى من app.js */
function initCart() {
  $("#cartItems").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-c]");
    if (!b) return;
    const idx = Number(b.dataset.idx);
    const item = cart[idx];
    if (!item) return;
    const p = findProduct(item.id);
    if (b.dataset.c === "inc") {
      if (usedStock(p.id) + 1 > p.stock) return toast(t("err.stock", { n: p.stock }));
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
    if (!cart.length) return toast(t("cart.empty"));
    $("#cartDialog").close();
    openCheckout();
  });
}
