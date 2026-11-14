/* ==========================================================
   التهيئة العامة: بتنادي init لكل قسم بنفس الترتيب القديم
   ========================================================== */
function init() {
  document.querySelectorAll("[data-ship-fee]").forEach((el) => { el.textContent = money(STORE_CONFIG.shippingFee); });
  $("#devText").textContent = STORE_CONFIG.developer;
  $("#year").textContent = new Date().getFullYear();
  [["#igLink", STORE_CONFIG.socialLinks.instagram], ["#ttLink", STORE_CONFIG.socialLinks.tiktok]].forEach(([sel, url]) => {
    const a = $(sel);
    if (/^https?:\/\//.test(url)) a.href = url;
    else a.hidden = true; // لا تظهر الرابط قبل وضعه
  });

  buildGov();
  renderProducts();
  renderCart();
  syncProducts();
  initHeader();
  initSearch();
  initFaq();
  initProductPage();
  /* الراوتر: #/p/ID لصفحة المنتج، وباقي الروابط للأقسام */
  addEventListener("hashchange", route);
  route();
  I18N.on(rerenderAll);   // تبديل اللغة: إعادة رسم كل الأجزاء الديناميكية
  initCart();
  initCheckout();
  initDialogs();
}

/* قايمة المحافظات: القيمة عربي (للطلب) والعرض حسب اللغة */
function buildGov() {
  const sel = $("#cGov"), cur = sel.value;
  sel.innerHTML = `<option value="">${esc(t("co.pickGov"))}</option>` + STORE_CONFIG.governorates.map((g) => `<option value="${esc(g)}">${esc(tx(g))}</option>`).join("");
  sel.value = cur;
  enhanceSelect(sel, { title: () => t("co.pickGov"), searchable: true });
}

/* تبديل اللغة: يعيد رسم المنتجات والسلة وصفحة المنتج والدفع بنفس اختيارات العميل */
function rerenderAll() {
  buildGov();
  renderProducts();
  renderCart();
  if (!$("#productView").hidden && detail) {
    const d = { ...detail };
    showProduct(d.id);
    Object.assign(detail, d);
    renderGallery(findProduct(d.id));
    renderBuy();
  }
  if ($("#checkoutDialog").open) { fillCheckout(); setErr(""); }
  drawProof();
  if ($("#sizeDialog").open) $("#sizeGuide").innerHTML = sizeGuideHTML();
}

document.addEventListener("DOMContentLoaded", init);

// أي صورة لا تُحمَّل تُستبدل بصورة احتياطية واضحة بدل المساحة البيضاء
document.addEventListener("error", (e) => {
  const t = e.target;
  if (t.tagName === "IMG" && !t.dataset.fb) {
    t.dataset.fb = "1";
    t.src = "placeholder.svg";
  }
}, true);
