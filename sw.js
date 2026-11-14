const CACHE = "onefournine-v12";
const CORE = ["./", "index.html", "pwa.js", "intro-box.jpg", "icon-192.png", "icon-512.png", "base.css", "header.css", "hero.css", "catalog.css", "faq.css", "footer.css", "product-page.css", "dialogs.css", "checkout.css", "toast.css", "responsive.css", "install-bar.css", "product-extras.css", "badges.css", "select.css", "sections.css", "senior-2027.css", "theme.css", "intro.css", "menu-search.css", "i18n.js", "i18n-common.js", "i18n-store.js", "theme.js", "intro.js", "sections-default.js", "config.js", "seed-products.js", "utils.js", "select.js", "products.js", "sections-data.js", "cart.js", "product-card.js", "senior-2027.js", "catalog.js", "product-page.js", "checkout.js", "faq.js", "header.js", "search.js", "dialogs.js", "router.js", "app.js"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(CORE.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// شبكة أولًا (عشان التحديثات توصل فورًا)، والكاش لو مفيش نت. الطلبات الخارجية (Firebase وغيره) بتعدّي زي ما هي.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || (req.mode === "navigate" ? caches.match("index.html") : Response.error())))
  );
});
