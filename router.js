/* ==========================================================
   صفحة المنتج (مسار: #/p/ID — يعمل مع زر الرجوع في أندرويد)
   ========================================================== */
let homeScroll = 0;
const ICON_CHECK = "";
function setView(name) {
  $("#homeView").hidden = name !== "home";
  $("#productView").hidden = name !== "product";
  $("#sectionView").hidden = name !== "section";
  $("#topbar").classList.remove("is-hidden");
  document.title = name === "home" ? "Onefournine | 149" : document.title;
}
// المسارات: #/p/ID صفحة منتج — #/s/ID صفحة قسم — أي #id تاني بيروح لجزء في الرئيسية
function route() {
  const h = location.hash || "";
  const pm = h.match(/^#\/p\/(.+)$/), sm = h.match(/^#\/s\/(.+)$/);
  const id = pm ? decodeURIComponent(pm[1]) : null;
  const sid = sm ? decodeURIComponent(sm[1]) : null;
  const wasProduct = !$("#productView").hidden, wasSection = !$("#sectionView").hidden, wasHome = !$("#homeView").hidden;
  const top = () => window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  if (id && findProduct(id)) {
    if (wasHome) homeScroll = window.scrollY;
    showProduct(id);
    top();
    return;
  }
  if (sid && sectionById(sid) && sectionById(sid).active) {
    if (wasHome) homeScroll = window.scrollY;
    if (wasProduct) teardownProduct();
    currentSection = sid;
    renderSectionView();
    setView("section");
    top();
    return;
  }
  if (wasProduct) teardownProduct();
  setView("home");
  const target = h.length > 1 && !h.startsWith("#/") ? document.getElementById(h.slice(1)) : null;
  requestAnimationFrame(() => {
    if (target) target.scrollIntoView();
    else if (wasProduct || wasSection) window.scrollTo(0, homeScroll);
  });
}
