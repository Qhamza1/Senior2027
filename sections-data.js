/* ==========================================================
   الأقسام (Senior 2027 + أي أقسام تانية) — بيانات + دوال مساعدة
   المنتج بيتبع قسم بالحقل product.section؛ لو مفيش (أو القسم اتحذف) يروح للقسم الافتراضي.
   ========================================================== */
const SECTIONS_CACHE = "o149_sections_v1";
let sections = (() => {
  try { const c = JSON.parse(localStorage.getItem(SECTIONS_CACHE)); if (Array.isArray(c) && c.length) return normalizeSections(c); } catch { /* لا نسخة */ }
  return normalizeSections(null);
})();
let sectionsChanged = false;
function applySections(raw) {
  if (!Array.isArray(raw) || !raw.length) return;
  const next = normalizeSections(raw);
  if (JSON.stringify(next) === JSON.stringify(sections)) return;
  sections = next;
  sectionsChanged = true;
  try { localStorage.setItem(SECTIONS_CACHE, JSON.stringify(next)); } catch { /* تخزين غير متاح */ }
}
const sectionById = (id) => sections.find((s) => s.id === id);
const fallbackSectionId = () => (sectionById(DEFAULT_SECTION_ID) || sections[0]).id;
const sectionIdOf = (p) => (p.section && sectionById(p.section) ? p.section : fallbackSectionId());
const sectionProducts = (id) => products.filter((p) => sectionIdOf(p) === id);
// الأقسام الظاهرة في المتجر: مفعّلة وفيها منتج واحد على الأقل
const visibleSections = () => sections.filter((s) => s.active && sectionProducts(s.id).length);
const sName = (s) => (isEn() ? s.nameEn || tx(s.name) : s.name);
const sDesc = (s) => (isEn() ? s.descEn || s.desc : s.desc);
const sectionHref = (id) => `#/s/${encodeURIComponent(id)}`;
