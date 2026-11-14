/* ==========================================================
   قسم Senior 2027 — الترويسة المميّزة (بانر كبير + عدّاد المنتجات)
   أي قسم من لوحة التحكم مفعّل عليه "عرض مميّز" بيستخدم نفس التصميم.
   التصميم في senior-2027.css (وتأثيرات الوضع الداكن في theme.css)
   ========================================================== */
function featuredHeadHTML(sec, count, page) {
  const desc = sDesc(sec);
  return `
  <div class="s27">
    <span class="s27-mark" aria-hidden="true">’27</span>
    <div class="s27-copy">
      <h2 id="sec-${esc(sec.id)}-title" class="s27-title">${esc(sName(sec))}</h2>
      ${desc ? `<p class="s27-desc">${esc(desc)}</p>` : ""}
    </div>
    <div class="s27-meta">
      <span class="s27-count">${t("sec.count", { n: num(count) })}</span>
      ${page ? "" : `<a class="s27-link" href="${sectionHref(sec.id)}">${t("sec.viewAll")}</a>`}
    </div>
  </div>`;
}
