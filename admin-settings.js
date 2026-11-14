/* ===== إعدادات مقاس الصور (محفوظة في مستند _settings داخل products) ===== */
let IMG = { ratio:"4 / 5", fit:"cover", norm:true };
const applyAR = () => document.documentElement.style.setProperty("--ar", IMG.ratio);
async function loadSettings(){
  try {
    const d = toProduct(await api("/_settings"));
    IMG = { ratio:d.imageRatio||IMG.ratio, fit:d.imageFit||IMG.fit, norm:d.imageNormalize!==false };
    if (Array.isArray(d.sections) && d.sections.length) SECS = normalizeSections(d.sections);   // الأقسام
  } catch {}
  applyAR(); drawSettings(); refreshSectionsUI();
}
function drawSettings(){
  document.querySelectorAll("#sRatio [data-r]").forEach((b)=>{ const on=b.dataset.r===IMG.ratio; b.classList.toggle("on",on); b.setAttribute("aria-checked",on); });
  document.querySelectorAll("#sFit [data-f]").forEach((b)=>{ const on=b.dataset.f===IMG.fit; b.classList.toggle("on",on); b.setAttribute("aria-checked",on); });
  $("#sNorm").checked = IMG.norm;
  const pv = $("#sPrev"), src = (items[0]?.images||[])[0];
  pv.style.aspectRatio = IMG.ratio;
  pv.innerHTML = src ? `<img src="${esc(src)}" alt="" style="object-fit:${IMG.fit}">` : `<span>${esc(IMG.ratio.replace(" / ",":"))}</span>`;
  applyAR();
}
$("#sRatio").addEventListener("click",(e)=>{ const b=e.target.closest("[data-r]"); if(b){ IMG.ratio=b.dataset.r; drawSettings(); } });
$("#sFit").addEventListener("click",(e)=>{ const b=e.target.closest("[data-f]"); if(b){ IMG.fit=b.dataset.f; drawSettings(); } });
$("#sNorm").addEventListener("change",()=>{ IMG.norm=$("#sNorm").checked; });
$("#sSave").addEventListener("click", async (e)=>{
  e.target.disabled = true; $("#sErr").textContent = "";
  try { await saveDoc("_settings",{ imageRatio:IMG.ratio, imageFit:IMG.fit, imageNormalize:IMG.norm }); toast(t("a.imgSaved")); }
  catch (er) { $("#sErr").textContent = "تعذّر الحفظ: "+er.message; }
  e.target.disabled = false;
});
