/* ==========================================================
   Onefournine — محرّك اللغات (عربي RTL / English LTR)
   - الاختيار بيتحفظ في localStorage ("o149_lang")
   - النصوص الثابتة: data-i18n / data-i18n-html / data-i18n-attr="attr:key;attr2:key2"
   - النصوص الديناميكية: I18N.t("key", {vars})
   - بيانات المنتجات (ألوان/محافظات/...): I18N.tx("نص عربي")
   القواميس في ملفات منفصلة: store.js (المتجر) و admin.js (لوحة التحكم).
   لإضافة نص جديد: ضيف سطر [key, عربي, English] في القاموس المناسب.
   ========================================================== */
(function () {
  "use strict";
  var KEY = "o149_lang", root = document.documentElement;
  var DICT = { ar: {}, en: {} }, MAP = {}, listeners = [];

  function saved() { try { var s = localStorage.getItem(KEY); return s === "en" || s === "ar" ? s : null; } catch (e) { return null; } }
  var lang = saved() || (root.getAttribute("lang") === "en" ? "en" : "ar");

  function add(list) { list.forEach(function (r) { DICT.ar[r[0]] = r[1]; DICT.en[r[0]] = r[2]; }); }
  function addMap(list) { list.forEach(function (r) { MAP[r[0]] = r[1]; }); }

  function t(key, vars, l) {
    l = l || lang;
    var s = DICT[l][key];
    if (s == null) s = DICT.ar[key];
    if (s == null) return key;
    if (typeof vars === "function") vars = vars();
    return vars ? s.replace(/\{(\w+)\}/g, function (m, k) { return k in vars ? vars[k] : m; }) : s;
  }
  // ترجمة بيانات عربية (ألوان، محافظات، أسماء منتجات...). words=false => تطابق كامل فقط
  function tx(s, words) {
    s = String(s == null ? "" : s);
    if (lang !== "en" || !s) return s;
    if (MAP[s]) return MAP[s];
    if (words === false) return s;
    return s.split(/(\s+)/).map(function (w) { return MAP[w] || w; }).join("");
  }
  function num(n, l) { return Number(n).toLocaleString((l || lang) === "en" ? "en-US" : "ar-EG"); }

  /* نصوص ثابتة بـ data-attributes */
  function apply(scope) {
    scope = scope || document;
    var v = I.vars ? I.vars() : {};
    scope.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n"), v); });
    scope.querySelectorAll("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html"), v); });
    scope.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (p) {
        var i = p.indexOf(":"); if (i < 1) return;
        el.setAttribute(p.slice(0, i).trim(), t(p.slice(i + 1).trim(), v));
      });
    });
  }

  /* مسح تلقائي للنصوص العربية المطابقة تمامًا لـ MAP (لوحة التحكم) — بيحفظ الأصل ويرجّعه */
  var ATTRS = ["placeholder", "aria-label", "title"];
  function scan(scope) {
    scope = scope || document.body;
    if (!scope) return;
    var w = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { var p = n.parentNode && n.parentNode.nodeName; return p === "SCRIPT" || p === "STYLE" ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    var n;
    while ((n = w.nextNode())) {
      var v = n.nodeValue, core = v.trim();
      if (!core) continue;
      var src = n.__ar != null ? n.__ar : (MAP[core] ? core : null);
      if (src == null) continue;
      n.__ar = src;
      var out = lang === "en" ? MAP[src] : src;
      if (out == null) continue;
      var lead = v.match(/^\s*/)[0], tail = v.match(/\s*$/)[0];
      var next = lead + out + tail;
      if (next !== v) n.nodeValue = next;
    }
    var els = scope.querySelectorAll ? scope.querySelectorAll("[placeholder],[aria-label],[title]") : [];
    if (scope.nodeType === 1) els = [scope].concat([].slice.call(els));
    [].forEach.call(els, function (el) {
      ATTRS.forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        el.__arA = el.__arA || {};
        var cur = el.getAttribute(a), src = el.__arA[a] != null ? el.__arA[a] : (MAP[cur] ? cur : null);
        if (src == null) return;
        el.__arA[a] = src;
        var out = lang === "en" ? MAP[src] : src;
        if (out != null && out !== cur) el.setAttribute(a, out);
      });
    });
  }

  function label() {
    [].forEach.call(document.querySelectorAll("[data-lang-toggle]"), function (b) {
      b.textContent = t("lang.other");
      b.setAttribute("aria-label", t("lang.aria"));
      b.setAttribute("title", t("lang.aria"));
      b.setAttribute("lang", lang === "en" ? "ar" : "en");
    });
  }

  function set(l) {
    if (l !== "en" && l !== "ar") return;
    lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) { /* تخزين غير متاح */ }
    root.setAttribute("lang", l);
    root.setAttribute("dir", l === "en" ? "ltr" : "rtl");
    apply(); scan(); label();
    root.classList.remove("lang-swap"); void root.offsetWidth; root.classList.add("lang-swap");
    setTimeout(function () { root.classList.remove("lang-swap"); }, 520);
    listeners.forEach(function (fn) { try { fn(l); } catch (e) { console.error(e); } });
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: l } }));
  }

  var I = {
    get lang() { return lang; },
    get dir() { return lang === "en" ? "ltr" : "rtl"; },
    get locale() { return lang === "en" ? "en-US" : "ar-EG"; },
    vars: null, t: t, tx: tx, trans: function (s) { return MAP[s] || null; }, num: num, add: add, addMap: addMap, apply: apply, scan: scan, set: set,
    toggle: function () { set(lang === "en" ? "ar" : "en"); },
    on: function (fn) { listeners.push(fn); }
  };
  window.I18N = I;

  /* ---------- تشغيل ---------- */
  function boot() {
    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "en" ? "ltr" : "rtl");
    apply(); scan(); label();
    [].forEach.call(document.querySelectorAll("[data-lang-toggle]"), function (b) { b.addEventListener("click", I.toggle); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
