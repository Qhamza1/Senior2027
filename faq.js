/* الأسئلة الشائعة */

/* نقطة التهيئة الخاصة بالقسم ده — بتتنادى من app.js */
function initFaq() {
  /* الأسئلة الشائعة */
  $(".acc").addEventListener("click", (e) => {
    const q = e.target.closest(".acc-q");
    if (!q) return;
    const item = q.closest(".acc-item");
    const willOpen = !item.classList.contains("open");
    document.querySelectorAll(".acc-item.open").forEach((i) => {
      i.classList.remove("open");
      i.querySelector(".acc-q").setAttribute("aria-expanded", "false");
    });
    if (willOpen) { item.classList.add("open"); q.setAttribute("aria-expanded", "true"); }
  });
}
