/* النوافذ: إغلاق بالضغط على الخلفية وأزرار الإغلاق */

/* نقطة التهيئة الخاصة بالقسم ده — بتتنادى من app.js */
function initDialogs() {
  // إغلاق النوافذ بالضغط على الخلفية
  document.querySelectorAll("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));

  // أزرار الإغلاق
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-close]");
    if (!b) return;
    b.closest("dialog")?.close();
  });
}
