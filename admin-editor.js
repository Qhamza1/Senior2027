/* ===== المحرر ===== */
let E = null;
function openEditor(p){
  E = { id: p?.id || "p-"+Date.now().toString(36), createdAt: p?.createdAt || Date.now(),
    colors: (p?.colors||[{name:"",value:"#08080A"}]).map((c,i)=>({ name:c.name, nameEn:c.nameEn||"", value:c.value, imgs:(c.images?.length?c.images:(i===0?(p?.images||[]):[])).map((u)=>({url:u,prev:u})) })),
    sizes: new Set(p?.sizes || ALL_SIZES), extra: p ? { unavailableColors:p.unavailableColors||[], unavailableSizes:p.unavailableSizes||[] } : {} };
  $("#edTitle").textContent = p ? t("a.editT") : t("a.newT");
  $("#fName").value = p?.name||""; $("#fNameEn").value = p?.nameEn||""; $("#fDescEn").value = p?.descriptionEn||""; $("#fDesc").value = p?.description||""; $("#fPrice").value = p?.price??"";
  $("#fDisc").value = p?.discountPrice??""; $("#fStock").value = p?.stock??20;
  setStatus(p?.saleStatus==="preorder"||p?.saleStatus==="soon" ? p.saleStatus : "normal");
  $("#fFeat").checked = !!p?.featured; $("#fOn").checked = p?.active!==false; $("#edErr").textContent = "";
  drawColors(); drawSizes(); pct();
  fillSectionSelect(p?.section || (SF !== "all" ? SF : DEFAULT_SECTION_ID));
  $("#editor").hidden = false; $("#editor").scrollTop = 0; document.body.style.overflow = "hidden";
}
const STATUS_HINT = { normal:"يظهر المنتج للبيع بشكل طبيعي.", preorder:"تظهر شارة «حجز مسبق» ويقدر العميل يطلبه (بحد المخزون المحدد).", soon:"تظهر شارة «قريباً جداً» ويتعطّل الشراء لحد ما تغيّر الحالة." };
function setStatus(v){ E.status = v; document.querySelectorAll("#fStatus [data-s]").forEach((b)=>{ const on=b.dataset.s===v; b.classList.toggle("on",on); b.setAttribute("aria-checked",on); }); $("#statusHint").textContent = t("a.hint."+v); }
$("#fStatus").addEventListener("click",(e)=>{ const b=e.target.closest("[data-s]"); if(b&&E) setStatus(b.dataset.s); });
function closeEditor(){ $("#editor").hidden = true; document.body.style.overflow = ""; E = null; }
function pct(){ const a=+$("#fPrice").value, b=+$("#fDisc").value; $("#pct").textContent = a&&b&&b<a ? `(-${Math.round((1-b/a)*100)}%)` : ""; }
["#fPrice","#fDisc"].forEach((s)=>$(s).addEventListener("input",pct));
function drawColors(){
  $("#colors").innerHTML = E.colors.map((c,i)=>`<div class="ccard"><div class="row"><input type="color" value="${esc(c.value)}" data-ci="${i}" data-k="value">
    <input placeholder="اسم اللون (مثال: أسود)" value="${esc(c.name)}" data-ci="${i}" data-k="name">
    ${E.colors.length>1?`<button class="btn ghost sm" data-rc="${i}" type="button" aria-label="حذف اللون">×</button>`:""}</div>
    <div class="row"><input placeholder="اسم اللون بالإنجليزية (اختياري)" value="${esc(c.nameEn||"")}" data-ci="${i}" data-k="nameEn" dir="ltr"></div>
    <small>${i===0?"صور هذا اللون (الأولى هي الرئيسية)":"صور هذا اللون — لو سيبتها فاضية هتظهر صور اللون الأول"}</small>
    <div class="imgs">${c.imgs.map((m,j)=>`<div class="im ${j===0?"main":""}"><img src="${esc(m.prev)}" alt="" data-main="${i}:${j}">
      <button type="button" data-ri="${i}:${j}" aria-label="حذف">×</button>${j===0?"<i>الرئيسية</i>":"<i>اضغط للرئيسية</i>"}</div>`).join("")}
      ${c.imgs.length<6?`<div class="add" data-add="${i}">+ صورة</div>`:""}</div></div>`).join("");
  I18N.scan($("#colors"));
}
let FT = 0; // اللون اللي بنرفعله صور
$("#colors").addEventListener("click",(e)=>{
  const ad = e.target.closest("[data-add]"); if (ad) { FT = +ad.dataset.add; return $("#file").click(); }
  const r = e.target.closest("[data-ri]"); if (r) { const [i,j]=r.dataset.ri.split(":").map(Number); E.colors[i].imgs.splice(j,1); return drawColors(); }
  const m = e.target.closest("[data-main]"); if (m) { const [i,j]=m.dataset.main.split(":").map(Number); if (j>0) { const a=E.colors[i].imgs; a.unshift(...a.splice(j,1)); drawColors(); } }
});
$("#colors").addEventListener("input",(e)=>{ const t=e.target; if (t.dataset.ci!=null) E.colors[+t.dataset.ci][t.dataset.k]=t.value; });
$("#colors").addEventListener("click",(e)=>{ const b=e.target.closest("[data-rc]"); if(b){ E.colors.splice(+b.dataset.rc,1); drawColors(); } });
$("#addColor").addEventListener("click",()=>{ E.colors.push({name:"",value:"#08080A",imgs:[]}); drawColors(); });
function drawSizes(){ $("#sizes").innerHTML = ALL_SIZES.map((z)=>`<button type="button" class="chip ${E.sizes.has(z)?"on":""}" data-z="${z}">${z}</button>`).join(""); }
$("#sizes").addEventListener("click",(e)=>{ const b=e.target.closest("[data-z]"); if(!b) return; E.sizes.has(b.dataset.z)?E.sizes.delete(b.dataset.z):E.sizes.add(b.dataset.z); drawSizes(); });
$("#file").addEventListener("change",(e)=>{
  const c = E.colors[FT]; if (c) [...e.target.files].slice(0,6-c.imgs.length).forEach((f)=>c.imgs.push({file:f,prev:URL.createObjectURL(f)}));
  e.target.value = ""; drawColors();
});

async function save(){
  const name=$("#fName").value.trim(), price=+$("#fPrice").value, discRaw=$("#fDisc").value.trim(), disc=discRaw===""?null:+discRaw;
  const named=E.colors.filter((c)=>c.name.trim());
  const err = name.length<3 ? t("a.e.name") : !(price>0) ? t("a.e.price") : disc!==null&&!(disc>0&&disc<price) ? t("a.e.disc")
    : !named.length ? t("a.e.color") : !E.sizes.size ? t("a.e.size") : !named[0].imgs.length ? t("a.e.img") : "";
  $("#edErr").textContent = err; if (err) return;
  const btns = [$("#saveBtn"),$("#saveTop")]; btns.forEach((b)=>b.disabled=true);
  try {
    let n = 0; const total = named.reduce((a,c)=>a+c.imgs.filter((m)=>m.file&&!m.url).length,0);
    const colors = [];
    for (const c of named) {
      const urls = [];
      for (const m of c.imgs) {
        if (m.file && !m.url) { $("#saveBtn").textContent = t("a.uploading",{i:++n,n:total}); m.url = await upload(m.file); }
        urls.push(m.url);
      }
      colors.push({ name:c.name.trim(), value:c.value, images:urls, ...(c.nameEn&&c.nameEn.trim()?{nameEn:c.nameEn.trim()}:{}) });
    }
    const urls = colors[0].images;
    $("#saveBtn").textContent = t("a.saving");
    await saveDoc(E.id, { name, description:$("#fDesc").value.trim(), nameEn:$("#fNameEn").value.trim(), descriptionEn:$("#fDescEn").value.trim(), price, discountPrice:disc, stock:Math.max(0,Math.floor(+$("#fStock").value||0)),
      saleStatus:E.status||"normal", section:$("#fSection").value, featured:$("#fFeat").checked, active:$("#fOn").checked, colors, sizes:ALL_SIZES.filter((z)=>E.sizes.has(z)), images:urls,
      unavailableColors:E.extra.unavailableColors||[], unavailableSizes:E.extra.unavailableSizes||[], createdAt:E.createdAt });
    toast(t("a.saved")); closeEditor(); refresh();
  } catch (er) { $("#edErr").textContent = er.message==="login" ? t("a.sess") : t("a.saveFail")+er.message; }
  btns.forEach((b)=>b.disabled=false); $("#saveBtn").textContent = t("a.saveProd");
}
$("#saveBtn").addEventListener("click",save); $("#saveTop").addEventListener("click",save);
$("#backBtn").addEventListener("click",closeEditor); $("#addBtn").addEventListener("click",()=>openEditor(null));
