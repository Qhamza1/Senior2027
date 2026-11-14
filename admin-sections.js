/* ==========================================================
   إدارة الأقسام (Senior 2027 وأي قسم تاني): إضافة / تعديل / إخفاء / ترتيب / حذف
   الأقسام بتتحفظ في Firestore: products/_settings.sections — والمنتج بيتبع قسم بالحقل section
   ========================================================== */
let SECS = normalizeSections(null);
let SF = "all";          // فلتر القسم في تبويب المنتجات
let SE = null;           // القسم اللي بيتعدّل دلوقتي (null = جديد)
const secName = (s) => (I18N.lang === "en" ? s.nameEn || s.name : s.name);
const secDefaultId = () => (SECS.find((s) => s.id === DEFAULT_SECTION_ID) || SECS[0]).id;
const secOf = (p) => (p.section && SECS.some((s) => s.id === p.section) ? p.section : secDefaultId());
const secCount = (id) => items.filter((p) => secOf(p) === id).length;
async function saveSections() { await saveDoc("_settings", { sections: SECS }); }

// شرائح فلتر القسم فوق قايمة المنتجات
function drawSecFilter() {
  if (SF !== "all" && !SECS.some((s) => s.id === SF)) SF = "all";
  $("#secFilter").innerHTML = [`<button type="button" class="chip${SF === "all" ? " on" : ""}" data-sf="all">${t("a.all")} (${items.length})</button>`]
    .concat(SECS.map((s) => `<button type="button" class="chip${SF === s.id ? " on" : ""}" data-sf="${esc(s.id)}">${esc(secName(s))} (${secCount(s.id)})</button>`)).join("");
}
$("#secFilter").addEventListener("click", (e) => { const b = e.target.closest("[data-sf]"); if (!b) return; SF = b.dataset.sf; drawSecFilter(); drawList(); });

// اختيار القسم داخل محرر المنتج
function fillSectionSelect(val) {
  const sel = $("#fSection");
  sel.innerHTML = SECS.map((s) => `<option value="${esc(s.id)}">${esc(secName(s))}</option>`).join("");
  sel.value = SECS.some((s) => s.id === val) ? val : secDefaultId();
  enhanceSelect(sel, { title: () => t("a.section") });
}

// تبويب الأقسام
function drawSections() {
  $("#secList").innerHTML = SECS.map((s, i) => `
    <div class="ord" data-sid="${esc(s.id)}">
      <h3>${esc(secName(s))}${I18N.lang === "en" ? "" : s.nameEn ? ` <span class="muted" dir="ltr">· ${esc(s.nameEn)}</span>` : ""}</h3>
      <p>${t("a.nProducts", { n: secCount(s.id) })}</p>
      ${s.desc ? `<p>${esc(I18N.lang === "en" ? s.descEn || s.desc : s.desc)}</p>` : ""}
      ${s.featured ? '<span class="tag pre">عرض مميّز</span>' : ""} ${s.active ? "" : '<span class="tag">مخفي</span>'} ${s.id === DEFAULT_SECTION_ID ? '<span class="tag">افتراضي</span>' : ""}
      <div class="acts">
        <button class="btn ghost sm" data-sa="edit">تعديل</button>
        <button class="btn ghost sm" data-sa="vis">${s.active ? "إخفاء" : "إظهار"}</button>
        <button class="btn ghost sm" data-sa="up" aria-label="تحريك لأعلى" ${i === 0 ? "disabled" : ""}>↑</button>
        <button class="btn ghost sm" data-sa="down" aria-label="تحريك لأسفل" ${i === SECS.length - 1 ? "disabled" : ""}>↓</button>
        <button class="btn ghost sm danger" data-sa="del">حذف</button>
      </div>
    </div>`).join("");
  I18N.scan($("#secList"));
}
$("#secList").addEventListener("click", async (e) => {
  const b = e.target.closest("button[data-sa]"); if (!b) return;
  const i = SECS.findIndex((x) => x.id === b.closest("[data-sid]").dataset.sid), s = SECS[i]; if (!s) return;
  const a = b.dataset.sa;
  if (a === "edit") return openSecEditor(s);
  if (a === "del") {
    if (s.id === DEFAULT_SECTION_ID) return toast(t("a.secDefaultDel"));
    if (secCount(s.id)) return toast(t("a.secHasProducts"));
    if (!confirm(t("a.confirmDelSec", { n: secName(s) }))) return;
  }
  const prev = SECS.map((x) => ({ ...x }));
  if (a === "vis") s.active = !s.active;
  if (a === "up" && i > 0) [SECS[i - 1], SECS[i]] = [SECS[i], SECS[i - 1]];
  if (a === "down" && i < SECS.length - 1) [SECS[i + 1], SECS[i]] = [SECS[i], SECS[i + 1]];
  if (a === "del") SECS.splice(i, 1);
  SECS.forEach((x, n) => (x.order = n + 1));
  b.disabled = true;
  try { await saveSections(); toast(a === "del" ? t("a.secDeleted") : t("a.secSaved")); }
  catch (er) { SECS = prev; toast(t("a.err") + er.message); }
  refreshSectionsUI();
});
$("#secAdd").addEventListener("click", () => openSecEditor(null));

// محرر القسم
function openSecEditor(s) {
  SE = s ? s.id : null;
  $("#secEdTitle").textContent = s ? t("a.secEditT") : t("a.secNewT");
  $("#sName").value = s?.name || ""; $("#sNameEn").value = s?.nameEn || "";
  $("#sDesc").value = s?.desc || ""; $("#sDescEn").value = s?.descEn || "";
  $("#sFeat").checked = !!s?.featured; $("#sOn").checked = s ? s.active : true;
  $("#secErr").textContent = "";
  $("#secEditor").hidden = false; $("#secEditor").scrollTop = 0; document.body.style.overflow = "hidden";
}
function closeSecEditor() { $("#secEditor").hidden = true; document.body.style.overflow = ""; SE = null; }
async function saveSection() {
  const name = $("#sName").value.trim(), nameEn = $("#sNameEn").value.trim();
  if (name.length < 2) { $("#secErr").textContent = t("a.secNeedName"); return; }
  const prev = SECS.map((x) => ({ ...x }));
  const data = { name, nameEn, desc: $("#sDesc").value.trim(), descEn: $("#sDescEn").value.trim(), featured: $("#sFeat").checked, active: $("#sOn").checked };
  const cur = SECS.find((x) => x.id === SE);
  if (cur) Object.assign(cur, data);
  else {
    const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    SECS.push({ id: slug && !SECS.some((x) => x.id === slug) ? slug : "s-" + Date.now().toString(36), ...data, order: SECS.length + 1 });
  }
  const btns = [$("#secSave"), $("#secSaveTop")]; btns.forEach((b) => (b.disabled = true));
  try { await saveSections(); toast(t("a.secSaved")); closeSecEditor(); }
  catch (er) { SECS = prev; $("#secErr").textContent = er.message === "login" ? t("a.sess") : t("a.saveFail") + er.message; }
  btns.forEach((b) => (b.disabled = false));
  refreshSectionsUI();
}
$("#secSave").addEventListener("click", saveSection); $("#secSaveTop").addEventListener("click", saveSection); $("#secBack").addEventListener("click", closeSecEditor);

// إعادة رسم كل واجهات الأقسام (بعد أي تغيير أو تبديل لغة)
function refreshSectionsUI() { drawSecFilter(); drawSections(); drawList(); }
