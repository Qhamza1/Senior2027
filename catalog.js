/* ==========================================================
   الكتالوج: بيرسم كل قسم في الصفحة الرئيسية + صفحة القسم المستقلة (#/s/ID) + روابط التنقل
   ========================================================== */
let currentSection = null;

function standardHeadHTML(sec, count, page) {
  return `<div class="sec-head"><h2 id="sec-${esc(sec.id)}-title">${esc(sName(sec))} <span class="count-note" aria-hidden="true">(${num(count)})</span></h2>${page ? "" : `<a class="sec-link" href="${sectionHref(sec.id)}">${t("sec.viewAll")}</a>`}</div>${sDesc(sec) ? `<p class="sec-desc">${esc(sDesc(sec))}</p>` : ""}`;
}
function sectionBlockHTML(sec, opts = {}) {
  const list = sectionProducts(sec.id);
  const limit = STORE_CONFIG.sectionPreview || 8;
  const shown = opts.page ? list : list.slice(0, limit);
  const head = sec.featured ? featuredHeadHTML(sec, list.length, opts.page) : standardHeadHTML(sec, list.length, opts.page);
  return `
  <section class="products catalog-sec${sec.featured ? " is-featured" : ""}" id="sec-${esc(sec.id)}" aria-labelledby="sec-${esc(sec.id)}-title">
    <div class="wrap">
      ${head}
      <div class="grid">${shown.map((p) => cardHTML(p)).join("")}</div>
      ${!opts.page && list.length > shown.length ? `<a class="btn ghost sec-more" href="${sectionHref(sec.id)}">${t("sec.viewAll")}</a>` : ""}
    </div>
  </section>`;
}

// الصفحة الرئيسية: كل الأقسام الظاهرة بالترتيب اللي في لوحة التحكم
function renderProducts() {
  $("#catalog").innerHTML = visibleSections().map((s) => sectionBlockHTML(s)).join("") || `<div class="wrap"><p class="empty">${t("empty.products")}</p></div>`;
  renderNav();
  updateAnnounce();
  if (!$("#sectionView").hidden) renderSectionView();
  if (typeof refreshSearch === "function") refreshSearch();
}

// صفحة قسم مستقلة: #/s/ID
function renderSectionView() {
  const sec = sectionById(currentSection);
  if (!sec) return;
  $("#sectionView").innerHTML = `
    <div class="wrap"><nav class="crumbs" aria-label="${esc(t("crumbs.aria"))}"><a href="#top">${t("crumbs.home")}</a><span aria-hidden="true">/</span><span>${esc(sName(sec))}</span></nav></div>
    ${sectionBlockHTML(sec, { page: true })}`;
  document.title = `${sName(sec)} | Onefournine`;
}

// روابط التنقل (الهيدر + قائمة الموبايل + الفوتر): كل قسم ظاهر + الأسئلة الشائعة
function renderNav() {
  const secs = visibleSections();
  const html = secs.map((s) => `<a href="#sec-${esc(s.id)}">${esc(sName(s))}</a>`).join("") + `<a href="#faq">${t("nav.faq")}</a>`;
  $("#navMain").innerHTML = html;
  // قائمة الموبايل (شاشة مستقلة): اسم القسم + عدد المنتجات
  $("#menuList").innerHTML = secs.map((s) => `<a href="#sec-${esc(s.id)}"><span>${esc(sName(s))}</span><small>${num(sectionProducts(s.id).length)}</small></a>`).join("")
    + `<a href="#faq"><span>${t("nav.faq")}</span></a>`;
  const soc = STORE_CONFIG.socialLinks || {};
  $("#menuFoot").innerHTML = [["Instagram", soc.instagram], ["TikTok", soc.tiktok]].filter(([, u]) => /^https?:\/\//.test(u)).map(([n, u]) => `<a class="latin" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${n}</a>`).join("");
  const foot = $("#footLinks");
  foot.querySelectorAll("a").forEach((a) => a.remove());
  foot.insertAdjacentHTML("beforeend", html);
}

function updateAnnounce() {
  const max = Math.max(0, ...products.map(discountPct));
  $("#announceText").textContent = max ? t("announce.max", { n: num(max) }) : t("announce.base");
}
