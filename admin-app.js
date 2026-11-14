/* ==========================================================
   التشغيل: التبويبات + تسجيل الدخول والخروج + تبديل اللغة
   ========================================================== */
/* التبويبات: المنتجات / الأقسام / الطلبات / الإعدادات */
document.querySelector(".tabs").addEventListener("click", (e)=>{
  const tab = e.target.closest(".tab"); if (!tab) return;
  document.querySelectorAll(".tab").forEach((x)=>x.classList.toggle("on", x===tab));
  const k = tab.dataset.t;
  $("#pTab").hidden = k!=="products"; $("#secTab").hidden = k!=="sections"; $("#oTab").hidden = k!=="orders"; $("#sTab").hidden = k!=="settings"; $("#addBtn").hidden = k!=="products";
  if (k==="orders") refreshOrders();
  if (k==="settings") drawSettings();
  if (k==="sections") refreshSectionsUI();
});

/* ===== تسجيل الدخول والخروج ===== */
function showLogin(){ $("#main").hidden=true; $("#login").hidden=false; closeEditor(); closeSecEditor(); }
function showMain(){ $("#login").hidden=true; $("#main").hidden=false; refresh(); refreshOrders(); loadSettings(); }
$("#loginBtn").addEventListener("click", async ()=>{
  const b=$("#loginBtn"); b.disabled=true; $("#loginErr").textContent="";
  try {
    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${CFG.apiKey}`, { method:"POST",
      headers:{"Content-Type":"application/json"}, body:JSON.stringify({ email:$("#em").value.trim(), password:$("#pw").value, returnSecureToken:true }) });
    const d = await r.json();
    if (!r.ok) throw new Error(/INVALID|EMAIL|PASSWORD/.test(d.error?.message||"") ? t("a.badLogin") : t("a.loginFail"));
    S = { rt:d.refreshToken, idt:d.idToken, exp:Date.now()+Number(d.expiresIn)*1000 }; saveS(); $("#pw").value=""; showMain();
  } catch (e) { $("#loginErr").textContent = e.message; }
  b.disabled=false;
});
$("#outBtn").addEventListener("click",()=>{ S=null; saveS(); showLogin(); });
if (!CFG.apiKey || !CFG.projectId || !CFG.cloudName || !CFG.uploadPreset) $("#loginErr").textContent = t("a.cfg");
if (S) showMain();
I18N.on(()=>{
  document.title = t("a.docTitle");
  refreshSectionsUI(); drawOrders(); drawSettings();
  if (E) { drawColors(); setStatus(E.status||"normal"); fillSectionSelect($("#fSection").value); $("#edTitle").textContent = items.some((x)=>x.id===E.id) ? t("a.editT") : t("a.newT"); }
  if (!$("#secEditor").hidden) $("#secEdTitle").textContent = SE ? t("a.secEditT") : t("a.secNewT");
});
