/* ===== الطلبات ===== */
const FSO = FS.replace(/\/products$/, "/orders");
const STATUSES = ["في انتظار مراجعة الدفع","تم تأكيد الدفع","جاري التجهيز","تم التسليم","ملغي"];
const waNum = (p) => { let d = String(p||"").replace(/\D/g,""); if (d.startsWith("00")) d = d.slice(2); else if (d.startsWith("0")) d = "20"+d.slice(1); return d; };
let orders = [];
async function refreshOrders(){
  try {
    const d = await api("?pageSize=300", {}, FSO);
    orders = (d.documents||[]).map(toProduct).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
  } catch (e) { if (e.message==="login") return showLogin(); $("#ordList").innerHTML = '<p class="err">'+esc(t("a.ordFail")+e.message+t("a.rules"))+'</p>'; return; }
  drawOrders();
}
function drawOrders(){
  const pending = orders.filter((o)=>o.status===STATUSES[0]).length;
  $("#ordBadge").hidden = !pending; $("#ordBadge").textContent = pending;
  $("#ordList").innerHTML = orders.length ? orders.map((o)=>`
    <div class="ord" data-id="${esc(o.id)}">
      <h3><span>${esc(o.name)}</span><span style="color:var(--fg)">${money(o.total||0)}</span></h3>
      <p>${esc(o.ref)} · ${esc(new Date(o.createdAt||0).toLocaleString(I18N.locale))}</p>
      <p dir="ltr" class="ltrp">${esc(o.phone)}</p>
      ${o.printName?`<p>الاسم للطباعة: <b style="color:var(--fg)">${esc(o.printName)}</b></p>`:""}
      <ul>${(o.items||[]).map((i)=>`<li>${esc(tx(i.name))} · ${esc(tx(i.color))} · ${esc(i.size)} · × ${esc(i.qty)}</li>`).join("")}</ul>
      <p>الدفع: ${esc(tx(o.payment))}${o.proofUrl?` · <a href="${esc(o.proofUrl)}" target="_blank" rel="noopener" style="color:var(--fg)">صورة الإثبات</a>`:" · لا يوجد إثبات مرفق"}</p>
      <select data-st>${STATUSES.map((s)=>`<option value="${s}" ${s===o.status?"selected":""}>${esc(tx(s))}</option>`).join("")}</select>
      <div class="acts"><a class="btn ghost sm" target="_blank" rel="noopener" href="https://wa.me/${waNum(o.phone)}">واتساب العميل</a>
        <button class="btn ghost sm danger" data-del>حذف</button></div>
    </div>`).join("") : '<p class="tag" style="display:block;padding:10px;margin-top:12px">مفيش طلبات لسه.</p>';
  I18N.scan($("#ordList"));
  document.querySelectorAll("#ordList select[data-st]").forEach((x)=>enhanceSelect(x,{title:()=>t("a.orderStatus")}));
}
$("#ordList").addEventListener("change", async (e)=>{
  const sel = e.target.closest("select[data-st]"); if (!sel) return;
  const id = sel.closest("[data-id]").dataset.id;
  try { await api(`/${id}?updateMask.fieldPaths=status`, { method:"PATCH", body: JSON.stringify({ fields:{ status: enc(sel.value) } }) }, FSO); toast(t("a.statusUpd")); }
  catch (er) { toast(t("a.err")+er.message); }
  refreshOrders();
});
$("#ordList").addEventListener("click", async (e)=>{
  const b = e.target.closest("button[data-del]"); if (!b) return;
  const o = orders.find((x)=>x.id===b.closest("[data-id]").dataset.id); if (!o || !confirm(t("a.confirmDelOrd",{n:o.name}))) return;
  try { await api("/"+o.id, { method:"DELETE" }, FSO); toast(t("a.deleted")); } catch (er) { toast(t("a.err")+er.message); }
  refreshOrders();
});
$("#ordRefresh").addEventListener("click", refreshOrders);
