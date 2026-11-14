function setStep(n) {
  document.querySelectorAll(".stepper li").forEach((li, i) => {
    li.classList.toggle("done", i + 1 < n);
    li.classList.toggle("on", i + 1 === n);
    li.setAttribute("aria-current", i + 1 === n ? "step" : "false");
  });
}


/* ==========================================================
   إثبات التحويل
   ========================================================== */
function checkProofFile(f) {
  if (!ALLOWED_TYPES.includes(f.type)) return t("proof.type");
  if (f.size > STORE_CONFIG.maxProofMB * 1048576) return t("proof.size", { n: STORE_CONFIG.maxProofMB });
  return "";
}
function setProof(file) {
  const err = checkProofFile(file);
  if (err) return setErr(err);
  clearProof();
  proofFile = file;
  proofURL = URL.createObjectURL(file);
  drawProof();
  setErr("");
  setStep(4);
}
function drawProof() {
  if (!proofFile) return;
  $("#proofBox").innerHTML = `
    <img class="proof-img" src="${proofURL}" alt="${esc(t("proof.alt"))}">
    <div class="proof-meta"><span dir="ltr">${esc(proofFile.name)}</span><span>${fileSize(proofFile.size)}</span></div>
    <button type="button" class="btn ghost" id="removeProof">${t("proof.remove")}</button>`;
}
function clearProof() {
  if (proofURL) URL.revokeObjectURL(proofURL);
  proofFile = null;
  proofURL = null;
  $("#proofBox").innerHTML = "";
  $("#proof").value = "";
}

/* ==========================================================
   الدفع والتحقق
   ========================================================== */
function renderPayInfo() {
  const key = document.querySelector('input[name="pay"]:checked')?.value;
  setStep(key ? (key === "cod" ? 4 : 3) : 2);
  $("#proofBlock").hidden = key === "cod";
  const box = $("#payInfo");
  if (!key) {
    box.innerHTML = `<p class="muted">${t("pay.choose")}</p>`;
    return;
  }
  const m = STORE_CONFIG.payments[key];
  const total = orderTotal();
  if (key === "cod") {
    box.innerHTML = `<div class="pay-card"><div class="pay-amount"><span>${t("pay.codAmt")}</span><b>${money(total)}</b></div><p class="pay-hint">${t("pay.codHint")}</p></div>`;
    return;
  }
  const mLabel = tx(m.label);
  box.innerHTML = `
    <div class="pay-card">
      <div class="pay-amount"><span>${t("pay.amt")}</span><b>${money(total)}</b></div>
      ${m.link ? `<a class="btn" href="${esc(m.link)}" target="_blank" rel="noopener noreferrer">${esc(t("pay.now", { m: mLabel }))}</a>` : ""}
      <p class="pay-hint">${esc(t("pay.hint", { m: mLabel }))}</p>
      <div class="pay-alt">
        <span>${t("pay.alt")}</span><b dir="ltr">${esc(m.value)}</b>${m.recipient ? `<span>(${esc(tx(m.recipient))})</span>` : ""}
        <button type="button" class="copy" data-copy="${esc(m.value)}">${t("pay.copyAcc")}</button>
        <button type="button" class="copy" data-copy="${total}">${t("pay.copyAmt")}</button>
      </div>
    </div>`;
}

function validateForm(f) {
  const d = new FormData(f);
  const name = (d.get("name") || "").trim();
  const phone = normPhone(d.get("phone"));
  const print = (d.get("printName") || "").trim();
  if (name.length < 10) return t("v.name");
  if (!/^01[0125]\d{8}$/.test(phone)) return t("v.phone");
  if (print && !/^[\p{L}\p{N} .\-]{1,10}$/u.test(print)) return t("v.print");
  if (STORE_CONFIG.shippingEnabled) {
    if (!(d.get("governorate") || "").trim()) return t("v.gov");
    if ((d.get("city") || "").trim().length < 2) return t("v.city");
    if ((d.get("address") || "").trim().length < 10) return t("v.addr");
  }
  if (!d.get("pay")) return t("v.pay");
  if (d.get("pay") !== "cod" && !proofFile) return t("v.proof");
  return "";
}

function setErr(msg) {
  $("#formError").textContent = msg;
}

function fillCheckout() {
  $("#shipBlock").hidden = !STORE_CONFIG.shippingEnabled;
  $("#orderSummary").innerHTML = cart.map((i) => {
    const p = findProduct(i.id);
    return `<div class="sum-row"><span>${esc(pName(p))} · ${esc(cLabel(p, i.color))} · ${esc(i.size)} × ${num(i.qty)}</span><b>${money(unitPrice(p) * i.qty)}</b></div>`;
  }).join("") + `<div class="sum-row"><span>${t("cart.subtotal")}</span><b>${money(cartTotal())}</b></div><div class="sum-row"><span>${t("co.shipShort")}</span><b>${money(shipFee())}</b></div><div class="sum-row total"><span>${t("co.total")}</span><b>${money(orderTotal())}</b></div>`;
  $("#coTotal").textContent = money(cartTotal());
  $("#coGrand").textContent = money(orderTotal());
  $("#coShip").hidden = !shipFee();
  $("#coShipFee").textContent = money(shipFee());
  renderPayInfo();
}
function openCheckout() {
  fillCheckout();
  setErr("");
  setStep(2);
  $("#checkoutDialog").showModal();
}

/* ==========================================================
   الطلب: رقم مرجعي، تجهيز البيانات، الإرسال
   ========================================================== */
function makeRef() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rnd = crypto.getRandomValues(new Uint8Array(6));
  return `149-${ymd}-${[...rnd].map((x) => chars[x % chars.length]).join("")}`;
}

function buildOrder(f) {
  const d = new FormData(f);
  const key = d.get("pay");
  const pay = STORE_CONFIG.payments[key];
  return {
    ref: makeRef(),
    createdAt: new Date().toISOString(),
    customer: {
      name: d.get("name").trim(),
      phone: normPhone(d.get("phone")),
      printName: (d.get("printName") || "").trim(),
      governorate: STORE_CONFIG.shippingEnabled ? d.get("governorate").trim() : "",
      city: STORE_CONFIG.shippingEnabled ? (d.get("city") || "").trim() : "",
      address: STORE_CONFIG.shippingEnabled ? d.get("address").trim() : ""
    },
    items: cart.map((i) => {
      const p = findProduct(i.id);
      return {
        id: i.id, name: p.name, color: i.color, size: i.size, qty: i.qty,
        originalPrice: p.price, discount: discountPct(p), unitPrice: unitPrice(p)
      };
    }),
    subtotal: cartTotal(),
    shipping: shipFee(),
    total: orderTotal(), // الخادم يجب أن يعيد حسابه من المنتجات الموثوقة
    payment: {
      method: key, type: pay.type, label: pay.label, recipient: pay.recipient || ""
    },
    status: key === "cod" ? "دفع عند الاستلام - في انتظار التأكيد" : "في انتظار مراجعة الدفع",
    proofUrl: null
  };
}

function waURL(o) {
  const L = waL(), T = (k, v) => t(k, v, L);
  const lines = [
    T("wa.new"),
    T("wa.ref", { v: o.ref }),
    T("wa.date", { v: new Date(o.createdAt).toLocaleString(L === "en" ? "en-GB" : "ar-EG") }),
    T("wa.cust", { v: o.customer.name }),
    T("wa.phone", { v: o.customer.phone }),
    T("wa.print", { v: o.customer.printName || "-" })
  ];
  if (STORE_CONFIG.shippingEnabled) lines.push(T("wa.gov", { v: L === "en" ? tx(o.customer.governorate) : o.customer.governorate }), T("wa.city", { v: o.customer.city }), T("wa.addr", { v: o.customer.address }));
  lines.push("", T("wa.items"));
  o.items.forEach((i, n) => {
    const col = L === "en" ? tx(i.color) : i.color;
    lines.push(T("wa.item", { n: n + 1, name: i.name, color: col, size: i.size, qty: i.qty }));
    lines.push(i.discount
      ? T("wa.price1", { o: money(i.originalPrice, L), d: i.discount, u: money(i.unitPrice, L) })
      : T("wa.price2", { u: money(i.unitPrice, L) }));
  });
  const cod = o.payment.method === "cod";
  lines.push("", T("wa.sub", { v: money(o.subtotal, L) }), T("wa.shipping", { v: money(o.shipping, L) }), T("wa.total", { v: money(o.total, L) }), T("wa.method", { v: L === "en" ? tx(o.payment.label) : o.payment.label }));
  if (!cod) lines.push(T("wa.recipient", { v: L === "en" ? tx(o.payment.recipient) : o.payment.recipient }), o.proofUrl ? T("wa.proofUrl", { v: o.proofUrl }) : T("wa.proofLater"));
  lines.push(T("wa.status", { v: L === "en" ? tx(o.status) : o.status }));
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

async function fetchWithTimeout(url, opts) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } catch {
    throw new Error(t("err.net"));
  } finally {
    clearTimeout(timer);
  }
}

async function uploadProof() {
  const fd = new FormData();
  fd.append("image", proofFile);
  if (STORE_CONFIG.imgbbKey) {
    fd.append("key", STORE_CONFIG.imgbbKey);
    const res = await fetchWithTimeout(STORE_CONFIG.imgbbUrl, { method: "POST", body: fd });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.data?.url) throw new Error(t("err.upload"));
    return data.data.url;
  }
  const res = await fetchWithTimeout(STORE_CONFIG.uploadEndpoint, { method: "POST", body: fd });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.url) throw new Error(t("err.upload"));
  return data.url;
}

async function postOrder(order) {
  const res = await fetchWithTimeout(STORE_CONFIG.ordersEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error(t("err.post"));
}

/* حفظ الطلب في Firestore ليظهر في لوحة التحكم (لو فشل، الطلب يكمل على واتساب) */
const fsEnc = (v) => v === null || v === undefined ? { nullValue: null }
  : typeof v === "string" ? { stringValue: v }
  : typeof v === "boolean" ? { booleanValue: v }
  : typeof v === "number" ? (Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v })
  : Array.isArray(v) ? { arrayValue: { values: v.map(fsEnc) } }
  : { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fsEnc(x)])) } };

async function saveOrderToFirestore(o) {
  const c = STORE_CONFIG.firebase;
  if (!c?.projectId || !c?.apiKey) return;
  const doc = {
    ref: o.ref, createdAt: Date.now(), name: o.customer.name, phone: o.customer.phone,
    printName: o.customer.printName || "", total: o.total, payment: o.payment.label,
    recipient: o.payment.recipient || "", status: o.status, proofUrl: o.proofUrl || "",
    items: o.items.map((i) => ({ name: i.name, color: i.color, size: i.size, qty: i.qty, unitPrice: i.unitPrice }))
  };
  const url = `https://firestore.googleapis.com/v1/projects/${c.projectId}/databases/(default)/documents/orders?documentId=${encodeURIComponent(o.ref)}&key=${c.apiKey}`;
  const res = await fetchWithTimeout(url, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(doc).map(([k, v]) => [k, fsEnc(v)])) })
  });
  if (!res.ok) throw new Error("order-save-failed");
}

async function onSubmit(e) {
  e.preventDefault();
  setErr("");
  const form = $("#orderForm");
  const err = validateForm(form);
  if (err) return setErr(err);

  // التحقق من المخزون قبل الإرسال (الخادم هو المرجع الحقيقي)
  for (const i of cart) {
    const p = findProduct(i.id);
    if (!p) return setErr(t("err.gone"));
    if (usedStock(p.id) > p.stock) return setErr(t("err.stockOf", { name: pName(p), n: p.stock }));
  }

  const btn = $("#submitBtn");
  btn.disabled = true;
  btn.textContent = t("co.sending");
  try {
    const order = buildOrder(form);
    // رفع صورة الإثبات (imgbb أو uploadEndpoint) ويتضاف رابطها في رسالة واتساب.
    // لو الرفع فشل، الطلب يكمل والعميل يبعت الصورة في المحادثة.
    if (proofFile && (STORE_CONFIG.imgbbKey || STORE_CONFIG.uploadEndpoint)) {
      try { order.proofUrl = await uploadProof(); } catch { order.proofUrl = null; }
    }
    if (STORE_CONFIG.ordersEndpoint) await postOrder(order);
    try { await saveOrderToFirestore(order); } catch {}
    const url = waURL(order);
    cart = [];
    saveCart();
    renderCart();
    clearProof();
    form.reset();
    $("#checkoutDialog").close();
    window.location.href = url; // تحويل مباشر لواتساب
  } catch (ex) {
    setErr(ex.message || t("err.send"));
  } finally {
    btn.disabled = false;
    btn.textContent = t("co.submit");
  }
}

/* نقطة التهيئة الخاصة بالقسم ده — بتتنادى من app.js */
function initCheckout() {
  $("#checkoutDialog").addEventListener("change", (e) => {
    if (e.target.name === "pay") renderPayInfo();
    if (e.target.id === "proof" && e.target.files[0]) setProof(e.target.files[0]);
  });

  $("#checkoutDialog").addEventListener("click", (e) => {
    const c = e.target.closest("[data-copy]");
    if (c) copyText(c.dataset.copy);
    if (e.target.closest("#removeProof")) clearProof();
  });

  $("#orderForm").addEventListener("submit", onSubmit);
}
