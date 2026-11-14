/* ==========================================================
   Onefournine — الوضع الداكن / الفاتح
   - الاختيار بيتحفظ في localStorage ("o149_theme")
   - لو العميل ما اختارش: بيتبع إعداد الجهاز (prefers-color-scheme)
   - الحالة الابتدائية بتتحط بسكريبت صغير في <head> (من غير وميض)
   - التبديل: دائرة بتتوسّع من زر الثيم (View Transitions) أو fade ناعم كبديل
   ========================================================== */
(function () {
  "use strict";
  var KEY = "o149_theme", root = document.documentElement;
  var reduce = function () { return matchMedia("(prefers-reduced-motion: reduce)").matches; };

  function saved() { try { var s = localStorage.getItem(KEY); return s === "dark" || s === "light" ? s : null; } catch (e) { return null; } }
  function current() { return root.getAttribute("data-theme") === "dark" ? "dark" : "light"; }

  function paint(th) {
    root.setAttribute("data-theme", th);
    var bg = getComputedStyle(root).getPropertyValue("--bg").trim();
    var m = document.querySelector('meta[name="theme-color"]');
    if (m && bg) m.setAttribute("content", bg);
    [].forEach.call(document.querySelectorAll("[data-theme-toggle]"), function (b) { b.setAttribute("aria-pressed", String(th === "dark")); });
  }

  function run(fn, o) {
    if (reduce()) return fn();
    if (document.startViewTransition && o) {
      var r = Math.hypot(Math.max(o.x, innerWidth - o.x), Math.max(o.y, innerHeight - o.y));
      root.classList.add("vt-theme");
      var vt = document.startViewTransition(fn);
      vt.ready.then(function () {
        root.animate(
          { clipPath: ["circle(0px at " + o.x + "px " + o.y + "px)", "circle(" + r + "px at " + o.x + "px " + o.y + "px)"] },
          { duration: 700, easing: "cubic-bezier(0.22, 0.8, 0.3, 1)", pseudoElement: "::view-transition-new(root)" }
        );
      }).catch(function () {});
      vt.finished.finally(function () { root.classList.remove("vt-theme"); });
      return;
    }
    root.classList.add("theme-anim");
    fn();
    setTimeout(function () { root.classList.remove("theme-anim"); }, 650);
  }

  function set(th, origin) {
    try { localStorage.setItem(KEY, th); } catch (e) { /* تخزين غير متاح */ }
    root.removeAttribute("data-theme-auto");
    run(function () { paint(th); }, origin);
  }

  window.O149Theme = { get: current, set: set, toggle: function (o) { set(current() === "dark" ? "light" : "dark", o); } };

  function boot() {
    paint(current());
    [].forEach.call(document.querySelectorAll("[data-theme-toggle]"), function (b) {
      b.addEventListener("click", function () {
        var r = b.getBoundingClientRect();
        window.O149Theme.toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      });
    });
    // لو العميل لسه ما اختارش، نتبع تغيير إعداد الجهاز
    try {
      matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
        if (!saved() && root.hasAttribute("data-theme-auto")) run(function () { paint(e.matches ? "dark" : "light"); });
      });
    } catch (e) { /* متصفح قديم */ }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
