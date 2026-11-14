/* ===== رفع الصور (Cloudinary unsigned) ===== */
async function shrink(file){
  const b = await createImageBitmap(file), c = document.createElement("canvas"), x = c.getContext("2d");
  if (IMG.norm) {
    const [rw,rh] = IMG.ratio.split("/").map(Number), M = 1600;
    c.width = rh>=rw ? Math.round(M*rw/rh) : M; c.height = rh>=rw ? M : Math.round(M*rh/rw);
    x.fillStyle = "#f5f5f3"; x.fillRect(0,0,c.width,c.height);
    const k = (IMG.fit==="contain"?Math.min:Math.max)(c.width/b.width, c.height/b.height), w = b.width*k, h = b.height*k;
    x.drawImage(b,(c.width-w)/2,(c.height-h)/2,w,h);
  } else {
    const k = Math.min(1, 1600/Math.max(b.width,b.height));
    c.width = Math.round(b.width*k); c.height = Math.round(b.height*k); x.drawImage(b,0,0,c.width,c.height);
  }
  return new Promise((r)=>c.toBlob(r,"image/jpeg",.9));
}
async function upload(file){
  const fd = new FormData(); fd.append("file", await shrink(file)); fd.append("upload_preset", CFG.uploadPreset);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CFG.cloudName}/image/upload`, { method:"POST", body:fd });
  const d = await r.json().catch(()=>({}));
  if (!r.ok || !d.secure_url) throw new Error(d.error?.message || t("a.upFail"));
  return d.secure_url;
}
