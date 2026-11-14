/* ==========================================================
   عرض المنتجات (بطاقة نظيفة: صورة + اسم + سعر، والتفاصيل في صفحة المنتج)
   ========================================================== */
const availColors = (p) => p.colors.filter((c) => !(p.unavailableColors || []).includes(c.name));
const productHref = (id) => `#/p/${encodeURIComponent(id)}`;
const LOW_STOCK = 5;
// حالة المنتج: normal | preorder (حجز مسبق) | soon (قريباً جداً — غير قابل للشراء)
// صور اللون: لو اللون له صور خاصة تظهر هي، وإلا صور المنتج الأساسية
const baseImgs = (p) => (p.images?.length ? p.images : [p.image]);
const colorImgs = (p, name) => { const c = (p.colors || []).find((x) => x.name === name); return c?.images?.length ? c.images : baseImgs(p); };
const hasColorImgs = (p) => (p.colors || []).some((c) => c.images?.length);
const saleStatus = (p) => (p.saleStatus === "preorder" || p.saleStatus === "soon" ? p.saleStatus : "normal");
const STATUS_BADGE = { get preorder() { return t("status.preorder"); }, get soon() { return t("status.soon"); } };
function priceHTML(p, withChip = true) {
  const d = discountPct(p);
  return `<div class="price"><b>${money(unitPrice(p))}</b>${d ? `<s>${money(p.price)}</s>${withChip ? `<span class="off">-${num(d)}%</span>` : ""}` : ""}</div>`;
}
function cardHTML(p, isNew = false) {
  const d = discountPct(p);
  const imgs = p.images?.length ? p.images : [p.image];
  const ss = saleStatus(p);
  const out = ss !== "soon" && p.stock <= 0;
  const cols = availColors(p);
  return `
  <a class="card${out ? " is-out" : ""}${ss !== "normal" ? " is-" + ss : ""}" href="${productHref(p.id)}" data-id="${esc(p.id)}" aria-label="${esc(pName(p))}">
    <div class="media">
      <img class="img-main" src="${esc(imgUrl(p.image, 600))}" alt="${esc(pName(p))}" width="600" height="750" loading="lazy" decoding="async" onerror="${FALLBACK_IMG}">
      ${imgs[1] ? `<img class="img-alt" src="${esc(imgUrl(imgs[1], 600))}" alt="" width="600" height="750" loading="lazy" decoding="async" aria-hidden="true">` : ""}
      ${ss !== "normal" ? `<span class="badge status ${ss}">${STATUS_BADGE[ss]}</span>` : out ? `<span class="badge out">${t("badge.out")}</span>` : isNew ? `<span class="badge" dir="ltr">NEW IN</span>` : d ? `<span class="badge" dir="ltr">SALE</span>` : ""}
      ${cols.length > 1 ? `<span class="dots" role="img" aria-label="${esc(t("colors.avail"))}: ${esc(cols.map((c) => cLabel(p, c.name)).join(t("sep")))}">${cols.slice(0, 5).map((c) => `<i class="dot" style="background:${esc(c.value)}"></i>`).join("")}</span>` : ""}
    </div>
    <div class="body">
      <h3>${esc(pName(p))}</h3>
      ${priceHTML(p)}
      <span class="choose">${ss === "soon" ? t("choose.soon") : out ? t("choose.out") : ss === "preorder" ? t("choose.pre") : t("choose.size")}</span>
    </div>
  </a>`;
}
