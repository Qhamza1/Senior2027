/* ===== Firestore (REST) + تحويل القيم ===== */
const FS = `https://firestore.googleapis.com/v1/projects/${CFG.projectId}/databases/(default)/documents/products`;
const enc = (v) => v===null?{nullValue:null}:typeof v==="string"?{stringValue:v}:typeof v==="boolean"?{booleanValue:v}
  :typeof v==="number"?(Number.isInteger(v)?{integerValue:String(v)}:{doubleValue:v}):Array.isArray(v)?{arrayValue:{values:v.map(enc)}}
  :{mapValue:{fields:Object.fromEntries(Object.entries(v).map(([k,x])=>[k,enc(x)]))}};
const dec = (f) => "stringValue"in f?f.stringValue:"integerValue"in f?Number(f.integerValue):"doubleValue"in f?f.doubleValue
  :"booleanValue"in f?f.booleanValue:"nullValue"in f?null:"arrayValue"in f?(f.arrayValue.values||[]).map(dec)
  :"mapValue"in f?Object.fromEntries(Object.entries(f.mapValue.fields||{}).map(([k,x])=>[k,dec(x)])):null;

/* ===== الدخول ===== */
let S = null; try { S = JSON.parse(localStorage.getItem("o149_admin")); } catch {}
const saveS = () => { try { S ? localStorage.setItem("o149_admin", JSON.stringify(S)) : localStorage.removeItem("o149_admin"); } catch {} };
async function token(){
  if (!S) throw new Error("login");
  if (Date.now() > S.exp - 60000) {
    const r = await fetch(`https://securetoken.googleapis.com/v1/token?key=${CFG.apiKey}`, { method:"POST",
      headers:{"Content-Type":"application/x-www-form-urlencoded"}, body:`grant_type=refresh_token&refresh_token=${encodeURIComponent(S.rt)}` });
    const d = await r.json();
    if (!r.ok) { S = null; saveS(); throw new Error("login"); }
    S = { rt:d.refresh_token, idt:d.id_token, exp:Date.now()+Number(d.expires_in)*1000 }; saveS();
  }
  return S.idt;
}
async function api(path="", opt={}, base=FS){
  const r = await fetch(base + path, { ...opt, headers:{ Authorization:"Bearer "+await token(), "Content-Type":"application/json" } });
  const d = await r.json().catch(()=>({}));
  if (!r.ok) throw new Error(d.error?.message || t("a.apiErr",{s:r.status}));
  return d;
}
const toProduct = (doc) => ({ id: doc.name.split("/").pop(), ...Object.fromEntries(Object.entries(doc.fields||{}).map(([k,x])=>[k,dec(x)])) });
async function listAll(){ const d = await api("?pageSize=300"); return (d.documents||[]).map(toProduct).filter((p)=>p.id!=="_settings").sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)); }
async function saveDoc(id, data){
  const mask = Object.keys(data).map((k)=>"updateMask.fieldPaths="+k).join("&");
  await api(`/${id}?${mask}`, { method:"PATCH", body: JSON.stringify({ fields: Object.fromEntries(Object.entries(data).map(([k,v])=>[k,enc(v)])) }) });
}
