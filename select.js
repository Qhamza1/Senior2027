/* ===== قائمة اختيار عصرية (Custom Select) — تحافظ على <select> الأصلي للفورم والتحقق ===== */
function enhanceSelect(sel, opts = {}) {
  if (!sel) return;
  if (sel._cs) return sel._cs.sync();
  const ttl = () => (typeof opts.title === "function" ? opts.title() : opts.title);
  const wrap = document.createElement("div");
  wrap.className = "cs";
  sel.parentNode.insertBefore(wrap, sel);
  wrap.appendChild(sel);
  sel.classList.add("cs-native");
  sel.tabIndex = -1;
  sel.setAttribute("aria-hidden", "true");
  const trig = document.createElement("button");
  trig.type = "button";
  trig.className = "cs-trigger";
  trig.setAttribute("aria-haspopup", "listbox");
  trig.setAttribute("aria-expanded", "false");
  const lab = sel.id && document.querySelector(`label[for="${sel.id}"]`);
  if (lab) { if (!lab.id) lab.id = sel.id + "-lbl"; trig.setAttribute("aria-labelledby", lab.id); }
  wrap.appendChild(trig);

  let panel = null, list = null, q = null, items = [], active = -1;
  const optsList = () => [...sel.options].filter((o) => o.value !== "");
  const placeholder = () => (sel.options[0] && sel.options[0].value === "" ? sel.options[0].textContent : ttl() || t("sel.choose"));
  function sync() {
    const o = sel.selectedOptions[0];
    const has = o && o.value !== "";
    trig.innerHTML = `<span class="cs-val${has ? "" : " ph"}">${esc(has ? o.textContent : placeholder())}</span><svg class="cs-caret" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    trig.disabled = sel.disabled;
  }
  function paint(filter = "") {
    const f = filter.trim();
    const cur = sel.value;
    items = optsList().filter((o) => !f || o.textContent.toLowerCase().includes(f.toLowerCase()));
    list.innerHTML = items.length
      ? items.map((o, i) => `<li role="option" class="cs-opt${o.value === cur ? " on" : ""}" data-i="${i}" aria-selected="${o.value === cur}"><span>${esc(o.textContent)}</span><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></li>`).join("")
      : `<li class="cs-empty">${esc(t("sel.none"))}</li>`;
    active = Math.max(0, items.findIndex((o) => o.value === cur));
    mark(true);
  }
  function mark(scroll) {
    [...list.querySelectorAll(".cs-opt")].forEach((el, i) => {
      el.classList.toggle("act", i === active);
      if (i === active && scroll) el.scrollIntoView({ block: "center" });
    });
  }
  function choose(i) {
    const o = items[i];
    if (!o) return;
    sel.value = o.value;
    sel.dispatchEvent(new Event("change", { bubbles: true }));
    sync();
    close();
  }
  function open() {
    if (panel || sel.disabled) return;
    panel = document.createElement("div");
    panel.className = "cs-layer";
    panel.innerHTML = `<div class="cs-back"></div><div class="cs-panel" role="dialog" aria-modal="true" aria-label="${esc(ttl() || placeholder())}">
      <div class="cs-grab" aria-hidden="true"></div>
      <div class="cs-head"><b>${esc(ttl() || placeholder())}</b><button type="button" class="cs-x" aria-label="${esc(t("close"))}">×</button></div>
      ${opts.searchable ? `<div class="cs-search"><input type="search" placeholder="${esc(t("sel.search"))}" autocomplete="off" aria-label="${esc(t("sel.searchLbl"))}"></div>` : ""}
      <ul class="cs-list" role="listbox"></ul></div>`;
    list = panel.querySelector(".cs-list");
    q = panel.querySelector("input");
    (trig.closest("dialog[open]") || document.body).appendChild(panel);
    paint();
    requestAnimationFrame(() => panel && panel.classList.add("in"));
    trig.setAttribute("aria-expanded", "true");
    panel.querySelector(".cs-back").addEventListener("click", close);
    panel.querySelector(".cs-x").addEventListener("click", close);
    list.addEventListener("click", (e) => { const li = e.target.closest(".cs-opt"); if (li) choose(+li.dataset.i); });
    if (q) q.addEventListener("input", () => paint(q.value));
    panel.addEventListener("keydown", onKey);
    // على الشاشات الكبيرة فقط نركّز البحث تلقائيًا (لتجنّب فتح الكيبورد على الموبايل)
    (q && matchMedia("(hover:hover)").matches ? q : panel.querySelector(".cs-panel")).focus({ preventScroll: true });
    panel.querySelector(".cs-panel").tabIndex = -1;
  }
  function close() {
    if (!panel) return;
    const p = panel; panel = null;
    p.classList.remove("in");
    trig.setAttribute("aria-expanded", "false");
    setTimeout(() => p.remove(), 180);
    trig.focus({ preventScroll: true });
  }
  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); return close(); }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!items.length) return;
      active = (active + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      mark(true);
    } else if (e.key === "Enter" && items.length && e.target.tagName !== "BUTTON") { e.preventDefault(); choose(active); }
    else if (e.key === "Tab") { e.preventDefault(); }
  }
  trig.addEventListener("click", open);
  sel.addEventListener("change", sync);
  if (sel.form) sel.form.addEventListener("reset", () => setTimeout(sync, 0));
  sel._cs = { sync };
  sync();
}
