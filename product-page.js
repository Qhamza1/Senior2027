const familyOf = (p) => { const b = p.name.split("·")[0].trim(); return products.filter((x) => x.name.split("·")[0].trim() === b); };
const IC = (d) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
async function shareProduct(p) {
  const url = location.href;
  try { if (navigator.share) return await navigator.share({ title: pName(p), url }); } catch { return; }
  copyText(url);
}

let pdObserver = null;
// يرسم معرض صور اللون المختار (ويرجع للأول عند تبديل اللون)
function renderGallery(p) {
  const pg = $("#pg");
  if (!pg || !detail) return;
  const imgs = colorImgs(p, detail.color);
  pg.innerHTML = imgs.map((src, i) => `
    <button type="button" class="pg-item" data-zoom="${i}" aria-label="${esc(t("zoom.img", { n: num(i + 1) }))}">
      <img src="${esc(imgUrl(src, 1100))}" alt="${esc(pName(p))} - ${i + 1}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" onerror="${FALLBACK_IMG}">
    </button>`).join("");
  pg.scrollLeft = 0;
  const cnt = $("#pgCount"), dots = $("#pgDots");
  cnt.hidden = dots.hidden = imgs.length < 2;
  cnt.textContent = `1 / ${imgs.length}`;
  dots.innerHTML = imgs.map((_, i) => `<i class="${i === 0 ? "on" : ""}"></i>`).join("");
}
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
  document.title = `${pName(p)} | Onefournine`;
  const d = discountPct(p);
  const others = [...products.filter((x) => x.id !== id && sectionIdOf(x) === sectionIdOf(p)), ...products.filter((x) => x.id !== id && sectionIdOf(x) !== sectionIdOf(p))].slice(0, 4);   // من نفس القسم الأول
  $("#productView").innerHTML = `
    <div class="wrap">
      <nav class="crumbs" aria-label="${esc(t("crumbs.aria"))}"><a href="#top">${t("crumbs.home")}</a><span aria-hidden="true">/</span><a href="${sectionHref(sectionIdOf(p))}">${esc(sName(sectionById(sectionIdOf(p))))}</a><span aria-hidden="true">/</span><span>${esc(pName(p))}</span></nav>
      <div class="pdp">
        <div class="pg-wrap">
          <div class="pg" id="pg" aria-label="${esc(t("pdp.gallery"))}"></div>
          ${saleStatus(p) !== "normal" ? `<span class="badge status ${saleStatus(p)}">${STATUS_BADGE[saleStatus(p)]}</span>` : d ? `<span class="badge" dir="ltr">-${num(d)}%</span>` : ""}
          <span class="pg-count" id="pgCount" hidden></span>
          <div class="pg-dots" id="pgDots" aria-hidden="true" hidden></div>
        </div>
        <div class="info">
          <h1>${esc(pName(p))}</h1>
          ${priceHTML(p)}
          <div id="buyBox"></div>
          <div class="gtk">
            <h4>${t("pdp.good")}</h4>
            <ul>
              <li>${IC('<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>')}${t("pdp.cod")}</li>
              <li>${IC('<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/>')}${t("pdp.deliv")}</li>
              <li>${IC('<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>')}${t("pdp.returns")}</li>
            </ul>
          </div>
          <div class="pd-acc">
            <div class="acc-item open">
              <h3><button class="acc-q" id="dq1" type="button" aria-expanded="true" aria-controls="da1">${t("pdp.details")}<span class="plus" aria-hidden="true"></span></button></h3>
              <div class="acc-a" id="da1" role="region" aria-labelledby="dq1"><div><p>${esc(pDesc(p))} ${t("pdp.printNote")}</p></div></div>
            </div>
            <div class="acc-item">
              <h3><button class="acc-q" id="dq2" type="button" aria-expanded="false" aria-controls="da2">${t("pdp.shipping")}<span class="plus" aria-hidden="true"></span></button></h3>
              <div class="acc-a" id="da2" role="region" aria-labelledby="dq2"><div><p>${t("pdp.shipText", { fee: money(STORE_CONFIG.shippingFee) })}</p></div></div>
            </div>
            <div class="acc-item">
              <h3><button class="acc-q" id="dq3" type="button" aria-expanded="false" aria-controls="da3">${t("sg.title")}<span class="plus" aria-hidden="true"></span></button></h3>
              <div class="acc-a" id="da3" role="region" aria-labelledby="dq3"><div>${sizeGuideHTML()}</div></div>
            </div>
          </div>
          <button type="button" class="share-btn" data-d="share">${IC('<path d="M12 15V4M8 8l4-4 4 4M5 13v6h14v-6"/>')}${t("share")}</button>
        </div>
      </div>
      ${others.length ? `<section class="related" aria-label="${esc(t("related.aria"))}"><h2>${t("related.title")}</h2><div class="grid">${others.map((x) => cardHTML(x, true)).join("")}</div></section>` : ""}
    </div>
    <div class="sticky-atc" id="stickyAtc" aria-hidden="true">
      <div class="sa-info"><span class="sa-name">${esc(pName(p))}</span><span class="sa-price" id="saPrice"></span></div>
      <button type="button" class="btn" id="saBtn" tabindex="-1"></button>
    </div>`;
  setView("product");
  renderBuy();
  renderGallery(p);
  baseImgs(p).concat((p.colors || []).flatMap((c) => c.images || [])).forEach((src) => { new Image().src = imgUrl(src, 1100); });

  // نقاط المعرض + العدّاد أثناء السحب
  const pg = $("#pg");
  if (pg) {
    pg.addEventListener("scroll", () => {
      const n = pg.children.length;
      if (n < 2) return;
      const w = pg.clientWidth || 1;
      const i = Math.min(n - 1, Math.max(0, Math.round(Math.abs(pg.scrollLeft) / w)));
      $("#pgCount").textContent = `${i + 1} / ${n}`;
      document.querySelectorAll("#pgDots i").forEach((el, k) => el.classList.toggle("on", k === i));
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
  const ss = saleStatus(p);
  const soon = ss === "soon";
  const out = !soon && p.stock <= 0;
  const soldOut = !out && !soon && left <= 0;
  const st = soon ? ["soon", t("av.soon")] : out ? ["out", t("av.out")] : soldOut ? ["out", t("av.max")] : left <= LOW_STOCK ? ["low", t("av.low", { n: num(left) })] : ss === "preorder" ? ["ok", t("av.pre")] : ["ok", t("av.ok")];
  const unSizes = p.unavailableSizes || [];
  const unCols = p.unavailableColors || [];
  const lowAll = !out && left <= LOW_STOCK;
  const fam = familyOf(p);
  const needSize = !detail.size && !out && !soldOut && !soon;
  const blocked = out || soldOut || soon;
  $("#buyBox").innerHTML = `
    <div class="avail ${st[0]}">${st[1]}</div>
    ${fam.length > 1 ? `
    <div class="opt">
      <div class="opt-head">${t("color")} <span>${esc(cLabel(p, detail.color) || "")}</span></div>
      <div class="sw-thumbs" role="group" aria-label="${esc(t("color"))}">
        ${fam.map((x) => `<a class="sw-thumb ${x.id === p.id ? "on" : ""}" href="${productHref(x.id)}" aria-label="${esc(pName(x))}" ${x.id === p.id ? 'aria-current="true"' : ""}><img src="${esc(imgUrl(x.image, 200))}" alt="" width="70" height="88" loading="lazy"></a>`).join("")}
      </div>
    </div>` : hasColorImgs(p) ? `
    <div class="opt">
      <div class="opt-head">${t("color")} <span>${esc(cLabel(p, detail.color) || "")}</span></div>
      <div class="sw-thumbs" role="group" aria-label="${esc(t("color"))}">
        ${p.colors.map((c) => `<button type="button" class="sw-thumb ${detail.color === c.name ? "on" : ""}" data-d="color" data-v="${esc(c.name)}" aria-label="${esc(cLabel(p, c.name))}" aria-pressed="${detail.color === c.name}" ${unCols.includes(c.name) ? "disabled" : ""}><img src="${esc(imgUrl(colorImgs(p, c.name)[0], 200))}" alt="" width="70" height="88" loading="lazy"></button>`).join("")}
      </div>
    </div>` : p.colors.length ? `
    <div class="opt">
      <div class="opt-head">${t("color")} <span>${esc(cLabel(p, detail.color) || "")}</span></div>
      <div class="swatches" role="group" aria-label="${esc(t("color"))}">
        ${p.colors.map((c) => `<button type="button" class="swatch ${detail.color === c.name ? "on" : ""}" style="background:${esc(c.value)}" data-d="color" data-v="${esc(c.name)}" aria-label="${esc(cLabel(p, c.name))}" aria-pressed="${detail.color === c.name}" ${unCols.includes(c.name) ? "disabled" : ""}></button>`).join("")}
      </div>
    </div>` : ""}
    <div class="opt">
      <div class="opt-head">${t("size.label")} <button type="button" class="link-btn" data-d="guide">${t("sg.title")}</button></div>
      <div class="sizes" id="pdSizes" role="group" aria-label="${esc(t("size.label"))}">
        ${p.sizes.map((z) => `<button type="button" class="size ${detail.size === z ? "on" : ""} ${lowAll ? "low" : ""}" data-d="size" data-v="${esc(z)}" aria-pressed="${detail.size === z}" ${unSizes.includes(z) ? "disabled" : ""}>${esc(z)}</button>`).join("")}
      </div>
      <p class="size-note" id="sizeNote" role="status">${detail.size ? t("size.chosen", { s: esc(detail.size) }) : t("size.pick")}</p>
    </div>
    <p class="ship-note"><i aria-hidden="true"></i>${t("ship.note")}</p>
    <div class="buy-row">
      <div class="qty">
        <button type="button" data-d="dec" aria-label="${esc(t("qty.dec"))}">−</button>
        <output aria-live="polite">${num(detail.qty)}</output>
        <button type="button" data-d="inc" aria-label="${esc(t("qty.inc"))}">+</button>
      </div>
      <button type="button" class="btn ${needSize ? "is-needs" : ""}" id="addBtn" data-d="add" ${blocked ? "disabled" : ""}>${soon ? t("choose.soon") : out ? t("btn.na") : soldOut ? t("btn.max") : needSize ? t("choose.size") : `${ss === "preorder" ? t("btn.reserve") : t("btn.add")} · ${money(unitPrice(p) * detail.qty)}`}</button>
    </div>
    <button type="button" class="btn ghost buy-now" data-d="buynow" ${blocked ? "disabled" : ""} ${soon || ss === "preorder" ? "hidden" : ""}>${t("buy.now")}</button>`;
  // الشريط اللاصق
  const sa = $("#saBtn");
  if (sa) {
    $("#saPrice").textContent = money(unitPrice(p) * detail.qty);
    sa.textContent = soon ? t("choose.soon") : out ? t("btn.na") : ss === "preorder" ? t("btn.reserve") : t("btn.add");
    sa.disabled = blocked;
    sa.dataset.d = "add";
  }
  // إعادة ربط المراقب بالزر الجديد
  if (pdObserver) { pdObserver.disconnect(); const b = $("#addBtn"); if (b) pdObserver.observe(b); }
}

// حجز مسبق: يفتح واتساب برسالة منسّقة (المنتج/اللون/المقاس/الكمية) بدون المرور على السلة
function reserveViaWhatsApp(p) {
  const { color, size, qty } = detail;
  const err = checkAdd(p, color, size, qty);
  if (err) return toast(err);
  const unit = unitPrice(p);
  const link = `${location.origin}${location.pathname}${productHref(p.id)}`;
  const L = waL(), T = (k, v) => t(k, v, L);
  const lines = [
    T("wa.pre.title"), "",
    T("wa.product", { v: p.name }),
    T("wa.color", { v: L === "en" ? cLabel(p, color) : color }),
    T("wa.size", { v: size }),
    T("wa.qty", { v: qty.toLocaleString("en-US") }),
    T("wa.unit", { v: money(unit, L) }),
    T("wa.total", { v: money(unit * qty, L) }), "",
    T("wa.link", { v: link }), "",
    T("wa.pre.end")
  ];
  const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  if (!window.open(url, "_blank", "noopener")) window.location.href = url;
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
      <thead><tr><th>SIZE</th>${c.columns.map((x) => `<th dir="${I18N.dir}">${esc(tx(x))}</th>`).join("")}</tr></thead>
      <tbody>${sizes.map((z) => `<tr class="${detail?.size === z ? "hl" : ""}"><th scope="row">${esc(z)}</th>${c.rows[z].map((v) => `<td>${Number(v).toLocaleString("en")}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></div>
    <p class="sg-unit">${t("sg.unit", { u: esc(tx(c.unit)) })}</p>
    <ul class="sg-tips">
      <li>${t("sg.tip1")}</li>
      <li>${t("sg.tip2")}</li>
      <li>${t("sg.tip3")}</li>
    </ul>`;
}

function openZoom(i) {
  if (!detail) return;
  const p = findProduct(detail.id);
  const imgs = colorImgs(p, detail.color);
  const z = $("#zoomImg");
  z.src = imgUrl(imgs[i] || imgs[0], 1800);
  z.alt = pName(p);
  $("#zoomDialog").showModal();
}

/* نقطة التهيئة الخاصة بالقسم ده — بتتنادى من app.js */
function initProductPage() {
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
      case "color": detail.color = b.dataset.v; renderGallery(p); break;
      case "size": detail.size = b.dataset.v; break;
      case "guide": return openSizeGuide();
      case "inc":
        if (usedStock(p.id) + detail.qty >= p.stock) return toast(t("err.stock", { n: p.stock }));
        detail.qty++;
        break;
      case "dec": detail.qty = Math.max(1, detail.qty - 1); break;
      case "share": return shareProduct(p);
      case "buynow":
        if (!detail.size) { toast(t("err.needSize")); const zs = $("#pdSizes"); zs.scrollIntoView({ block: "center", behavior: "smooth" }); zs.classList.remove("nudge"); void zs.offsetWidth; zs.classList.add("nudge"); return; }
        if (addToCart(p.id, detail.color, detail.size, detail.qty)) { detail.qty = 1; renderBuy(); openCheckout(); }
        return;
      case "add":
        if (!detail.size) {
          toast(t("err.needSize"));
          const zs = $("#pdSizes");
          zs.scrollIntoView({ block: "center", behavior: "smooth" });
          zs.classList.remove("nudge"); void zs.offsetWidth; zs.classList.add("nudge");
          return;
        }
        if (saleStatus(p) === "preorder") return reserveViaWhatsApp(p);   // الحجز المسبق: واتساب مباشرة بدون سلة
        if (addToCart(p.id, detail.color, detail.size, detail.qty)) {
          detail.qty = 1;
          renderBuy();
          $("#cartDialog").showModal();   // زي المرجع: تفتح السلة بعد الإضافة
        }
        return;
    }
    renderBuy();
  });
}
