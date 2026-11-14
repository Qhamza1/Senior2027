/* ==========================================================
   البحث الشامل: منتجات + أقسام + أسئلة شائعة (كلها من نفس البيانات اللي جاية من لوحة التحكم)
   - شاشة مستقلة (dialog) بتفتح من أيقونة البحث في الهيدر أو من قايمة الموبايل
   - عربي/إنجليزي: بيتجاهل التشكيل والهمزات (أ إ آ) و (ى ي) و (ة ه) والأرقام الهندية
   - كل كلمة لازم تتطابق في حتة (اسم/وصف/لون/قسم/سعر)، والترتيب بالأهمية
   ========================================================== */
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
function normText(s) {
  return String(s ?? "").toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/ؤ/g, "و").replace(/ئ/g, "ي")
    .replace(/[٠-٩]/g, (d) => AR_DIGITS.indexOf(d))
    .replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - 0x06F0)
    .replace(/\s+/g, " ").trim();
}
// ترجمة الكلمات المعروفة للعكس (عشان "black" يلاقي لون "أسود" حتى لو المتجر عربي)
const transWords = (s) => String(s || "").split(/\s+/).map((w) => I18N.trans(w) || "").filter(Boolean).join(" ");

function searchIndex() {
  const statusWords = ["status.preorder", "status.soon", "badge.out"].map((k) => t(k, null, "ar") + " " + t(k, null, "en")).join(" ");
  const prods = products.map((p) => {
    const sec = sectionById(sectionIdOf(p));
    const cols = (p.colors || []).map((c) => `${c.name} ${c.nameEn || ""} ${I18N.trans(c.name) || ""}`).join(" ");
    const ss = saleStatus(p);
    return {
      p,
      name: normText(`${p.name} ${p.nameEn || ""} ${pName(p)}`),
      mid: normText(`${cols} ${sec ? `${sec.name} ${sec.nameEn}` : ""}`),
      rest: normText(`${p.description || ""} ${p.descriptionEn || ""} ${transWords(p.name)} ${transWords(p.description)} ${(p.sizes || []).join(" ")} ${p.price} ${unitPrice(p)} ${ss !== "normal" ? statusWords : ""}`)
    };
  });
  const secs = visibleSections().map((s) => ({ s, name: normText(`${s.name} ${s.nameEn}`), rest: normText(`${s.desc} ${s.descEn}`) }));
  const faqs = [...document.querySelectorAll("#faq .acc-item")].map((el, i) => {
    const q = el.querySelector(".acc-q span")?.textContent.trim() || "", a = el.querySelector(".acc-a p")?.textContent.trim() || "";
    return { i, q, a, name: normText(q), rest: normText(a) };
  });
  return { prods, secs, faqs };
}

// كل الكلمات لازم تتطابق؛ الدرجة: اسم (بداية كلمة أعلى) > لون/قسم > باقي البيانات
function scoreOf(tokens, it) {
  let total = 0;
  for (const tk of tokens) {
    let s = 0;
    if (it.name.includes(tk)) s = it.name.split(" ").some((w) => w.startsWith(tk)) ? 5 : 4;
    else if (it.mid && it.mid.includes(tk)) s = 2.5;
    else if (it.rest.includes(tk)) s = 1;
    if (!s) return 0;
    total += s;
  }
  return total;
}
function runSearch(q) {
  const tokens = normText(q).split(" ").filter(Boolean);
  const idx = searchIndex();
  const rank = (arr) => arr.map((it, n) => ({ it, sc: scoreOf(tokens, it), n })).filter((r) => r.sc).sort((a, b) => b.sc - a.sc || a.n - b.n).map((r) => r.it);
  return { prods: rank(idx.prods), secs: rank(idx.secs), faqs: rank(idx.faqs) };
}

/* ---------- الرسم ---------- */
function srProductHTML(p) {
  const ss = saleStatus(p), out = ss !== "soon" && p.stock <= 0, sec = sectionById(sectionIdOf(p));
  const tag = ss !== "normal" ? STATUS_BADGE[ss] : out ? t("badge.out") : "";
  return `<a class="sr-item sr-prod" href="${productHref(p.id)}">
    <img src="${esc(imgUrl(p.image, 160))}" alt="" width="60" height="75" loading="lazy" decoding="async" onerror="${FALLBACK_IMG}">
    <span class="sr-info"><b>${esc(pName(p))}</b>
      <span class="sr-meta">${esc(sec ? sName(sec) : "")}${tag ? ` · <em>${esc(tag)}</em>` : ""}</span>
      ${priceHTML(p, false)}</span></a>`;
}
const srSectionHTML = (s) => `<a class="sr-item sr-sec" href="${sectionHref(s.id)}"><span class="sr-info"><b>${esc(sName(s))}</b>${sDesc(s) ? `<span class="sr-meta">${esc(sDesc(s))}</span>` : ""}</span><small>${t("sec.count", { n: num(sectionProducts(s.id).length) })}</small></a>`;
const srFaqHTML = (f) => `<a class="sr-item sr-faq" href="#faq" data-faq="${f.i}"><span class="sr-info"><b>${esc(f.q)}</b><span class="sr-meta sr-clamp">${esc(f.a)}</span></span></a>`;
const srGroup = (title, n, body) => `<section class="sr-group"><h3>${esc(title)} <span class="muted">(${num(n)})</span></h3>${body}</section>`;

function renderSearch() {
  const input = $("#searchInput"), body = $("#searchBody"), q = input.value.trim();
  $("#searchClear").hidden = !q;
  if (!q) {
    const secs = visibleSections(), latest = products.slice(0, 4);
    body.innerHTML = (secs.length ? `<section class="sr-group"><h3>${t("search.browse")}</h3><div class="sr-chips">${secs.map((s) => `<a class="sr-chip" href="${sectionHref(s.id)}">${esc(sName(s))}<small>${num(sectionProducts(s.id).length)}</small></a>`).join("")}</div></section>` : "")
      + (latest.length ? `<section class="sr-group"><h3>${t("search.latest")}</h3>${latest.map((p) => srProductHTML(p)).join("")}</section>` : "");
    return;
  }
  const r = runSearch(q);
  if (!r.prods.length && !r.secs.length && !r.faqs.length) {
    body.innerHTML = `<div class="sr-empty"><p><b>${esc(t("search.none", { q }))}</b></p><p class="muted">${t("search.hint")}</p></div>` +
      `<div class="sr-chips">${visibleSections().map((s) => `<a class="sr-chip" href="${sectionHref(s.id)}">${esc(sName(s))}<small>${num(sectionProducts(s.id).length)}</small></a>`).join("")}</div>`;
    return;
  }
  body.innerHTML = (r.prods.length ? srGroup(t("search.products"), r.prods.length, r.prods.slice(0, 40).map((x) => srProductHTML(x.p)).join("")) : "")
    + (r.secs.length ? srGroup(t("search.sections"), r.secs.length, r.secs.map((x) => srSectionHTML(x.s)).join("")) : "")
    + (r.faqs.length ? srGroup(t("search.faq"), r.faqs.length, r.faqs.map(srFaqHTML).join("")) : "");
}
// بتتنادى لما المنتجات/الأقسام تتحدّث (catalog.js) أو اللغة تتغير
function refreshSearch() { const d = $("#searchPanel"); if (d && d.open) renderSearch(); }

/* فتح سؤال من الأسئلة الشائعة بعد النقل للصفحة */
function openFaqItem(i) {
  const item = document.querySelectorAll("#faq .acc-item")[i];
  if (!item) return;
  document.querySelectorAll(".acc-item.open").forEach((x) => { x.classList.remove("open"); x.querySelector(".acc-q").setAttribute("aria-expanded", "false"); });
  item.classList.add("open");
  item.querySelector(".acc-q").setAttribute("aria-expanded", "true");
  item.scrollIntoView({ block: "center" });
}

function initSearch() {
  const panel = $("#searchPanel"), input = $("#searchInput"), menu = $("#menuPanel");
  const open = () => { if (menu.open) menu.close(); if (!panel.open) panel.showModal(); renderSearch(); input.focus(); };
  $("#searchBtn").addEventListener("click", open);
  $("#menuSearch").addEventListener("click", open);
  input.addEventListener("input", renderSearch);
  $("#searchClear").addEventListener("click", () => { input.value = ""; renderSearch(); input.focus(); });
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const first = $("#searchBody .sr-item");
    if (first) first.click(); else input.blur();
  });
  panel.addEventListener("close", () => { input.value = ""; input.blur(); });
  $("#searchBody").addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    const faq = a.dataset.faq;
    panel.close();
    if (faq != null) {
      e.preventDefault();
      const go = () => setTimeout(() => openFaqItem(+faq), 90);
      if (location.hash === "#faq" || !$("#homeView").hidden) { location.hash = "#faq"; go(); } else { location.hash = "#faq"; go(); }
    }
  });
  // تظهر الشاشة الجاية للغة الجديدة
  I18N.on(refreshSearch);
  // اختصار: Ctrl/⌘ + K أو "/" لفتح البحث
  document.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "");
    if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing)) { e.preventDefault(); if (!document.querySelector("dialog[open]") || menu.open) open(); }
  });
}
