/* تسجيل الـ Service Worker + شريط "نزّل التطبيق" فوق */
(() => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }

  const bar = document.getElementById("installBar");
  const btn = document.getElementById("installBtn");
  const closeBtn = document.getElementById("installClose");
  const sub = document.getElementById("ibSub");
  if (!bar) return;

  const KEY = "installDismissedAt";
  const HIDE_DAYS = 1; // بعد الإغلاق مايظهرش تاني لمدة يوم
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  const dismissed = () => {
    try { return Date.now() - Number(localStorage.getItem(KEY) || 0) < HIDE_DAYS * 864e5; } catch { return false; }
  };
  const show = () => { if (!standalone && !dismissed()) bar.hidden = false; };
  const hide = () => { bar.hidden = true; };

  let deferred = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    show();
  });

  btn.addEventListener("click", async () => {
    if (deferred) {
      deferred.prompt();
      await deferred.userChoice.catch(() => {});
      deferred = null;
      hide();
    } else {
      // iOS Safari: مفيش prompt تلقائي
      sub.textContent = "اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية»";
      btn.hidden = true;
    }
  });

  closeBtn.addEventListener("click", () => {
    try { localStorage.setItem(KEY, String(Date.now())); } catch {}
    hide();
  });

  window.addEventListener("appinstalled", hide);

  // iOS مابيدعمش beforeinstallprompt، فنظهر الشريط بتعليمات يدوية
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  if (isIOS) show();
})();
