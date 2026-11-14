/* الهيدر: يختفي عند النزول ويظهر عند الصعود + قائمة الموبايل (شاشة مستقلة) */

/* نقطة التهيئة الخاصة بالقسم ده — بتتنادى من app.js */
function initHeader() {
  const bar = $("#topbar"), menu = $("#menuPanel"), menuBtn = $("#menuBtn");
  let lastY = window.scrollY, ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      bar.classList.toggle("is-stuck", y > 8);
      if (y > lastY + 6 && y > 160) bar.classList.add("is-hidden");
      else if (y < lastY - 6 || y < 160) bar.classList.remove("is-hidden");
      lastY = y;
      ticking = false;
    });
  }, { passive: true });

  menuBtn.addEventListener("click", () => { if (!menu.open) menu.showModal(); menuBtn.setAttribute("aria-expanded", "true"); });
  menu.addEventListener("close", () => menuBtn.setAttribute("aria-expanded", "false"));
  // اختيار قسم: تقفل الشاشة والصفحة تروح للقسم
  menu.addEventListener("click", (e) => { if (e.target.closest("#menuList a, #menuFoot a")) menu.close(); });
  // لو الشاشة اتكبرت لحجم الكمبيوتر القايمة تتقفل
  matchMedia("(min-width: 900px)").addEventListener("change", (m) => { if (m.matches && menu.open) menu.close(); });
}
