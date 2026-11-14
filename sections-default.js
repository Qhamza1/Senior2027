/* ==========================================================
   الأقسام الافتراضية — مشتركة بين المتجر ولوحة التحكم
   التعديل الفعلي بيتم من لوحة التحكم > الأقسام (بتتحفظ في Firestore: products/_settings.sections)
   ========================================================== */
const DEFAULT_SECTION_ID = "senior-2027";
const DEFAULT_SECTIONS = [
  { id: "senior-2027", name: "Senior 2027", nameEn: "Senior 2027", desc: "هوديز دفعة 2027 — آخر سنة وأحلى ذكرى.", descEn: "Class of 2027 hoodies — the final year, the best memories.", active: true, featured: true, order: 1 },
  { id: "main", name: "المجموعة", nameEn: "Collection", desc: "", descEn: "", active: true, featured: false, order: 2 }
];
// ينضّف أي قايمة أقسام جاية من Firestore/الكاش (لو فاضية يرجع الافتراضي)
function normalizeSections(arr) {
  const list = (Array.isArray(arr) ? arr : []).filter((s) => s && s.id && s.name).map((s, i) => ({
    id: String(s.id), name: String(s.name), nameEn: String(s.nameEn || ""), desc: String(s.desc || ""), descEn: String(s.descEn || ""),
    active: s.active !== false, featured: !!s.featured, order: Number.isFinite(+s.order) ? +s.order : i + 1
  }));
  return (list.length ? list : DEFAULT_SECTIONS.map((s) => ({ ...s }))).sort((a, b) => a.order - b.order);
}
