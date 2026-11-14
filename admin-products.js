/* ===== القائمة ===== */
let items = [];
async function refresh(){
  try { items = await listAll(); } catch (e) { if (e.message==="login") return showLogin(); toast(t("a.loadFail")+e.message); return; }
  drawList();
}
function drawList(){
  $("#seedBox").hidden = items.length > 0;
  drawSecFilter();
  $("#list").innerHTML = (SF === "all" ? items : items.filter((p) => secOf(p) === SF)).map((p)=>`
    <div class="card" data-id="${esc(p.id)}">
      <img src="${esc((p.images||[])[0]||"")}" alt="" onerror="this.style.visibility='hidden'">
      <div><h3>${esc(p.name)}</h3>
        <p>${p.discountPrice!=null&&p.discountPrice<p.price?`<s>${money(p.price)}</s> <b style="color:var(--fg)">${money(p.discountPrice)}</b>`:money(p.price)} · ${t("a.stock")} ${esc(p.stock)}</p>
        ${p.saleStatus==="preorder"?'<span class="tag pre">حجز مسبق</span>':p.saleStatus==="soon"?'<span class="tag pre">قريباً جداً</span>':""} ${p.active===false?'<span class="tag">مخفي</span>':""} ${p.featured?'<span class="tag">مميز</span>':""} <span class="tag">${esc(secName(SECS.find((s)=>s.id===secOf(p))))}</span>
        <div class="acts"><button class="btn ghost sm" data-a="edit">تعديل</button>
          <button class="btn ghost sm" data-a="vis">${p.active===false?"إظهار":"إخفاء"}</button>
          <button class="btn ghost sm danger" data-a="del">حذف</button></div></div>
    </div>`).join("");
  I18N.scan($("#list"));
}
$("#list").addEventListener("click", async (e)=>{
  const b = e.target.closest("button[data-a]"); if (!b) return;
  const p = items.find((x)=>x.id===b.closest("[data-id]").dataset.id); if (!p) return;
  if (b.dataset.a==="edit") return openEditor(p);
  b.disabled = true;
  try {
    if (b.dataset.a==="vis") { await saveDoc(p.id,{ active: p.active===false }); toast(p.active===false?t("a.shown"):t("a.hidden")); }
    if (b.dataset.a==="del" && confirm(t("a.confirmDel",{n:p.name}))) { await api("/"+p.id,{method:"DELETE"}); toast(t("a.deleted")); }
  } catch (er) { toast(t("a.err")+er.message); }
  refresh();
});
$("#seedBtn").addEventListener("click", async (e)=>{
  e.target.disabled = true;
  try {
    for (const [i,[id,name,desc,a,b,price,disc,cn,cv,feat]] of SEED.entries())
      await saveDoc(id,{ name, description:desc, images:[a,b], price, discountPrice:disc, stock:20, saleStatus:"normal", section:DEFAULT_SECTION_ID, featured:feat, active:true,
        colors:[{name:cn,value:cv}], sizes:ALL_SIZES, createdAt: Date.now()-i });
    toast(t("a.imported"));
  } catch (er) { toast(t("a.err")+er.message); }
  e.target.disabled = false; refresh();
});
