/* Onefournine cinematic intro — fog, lightning, camera push-in, box opens, white-out into the site.
   Plays once per session, skippable (button / Esc). Add ?intro=1 to the URL to force it. */
(function () {
  var root = document.documentElement, el = document.getElementById('intro');
  if (!el) return;
  var finished = false;
  function end() {
    finished = true;
    if (window.gsap) gsap.ticker.remove(tick);
    root.classList.remove('intro-on');
    if (el.parentNode) el.parentNode.removeChild(el);
  }
  function done(fast) {
    if (finished) return;
    try { sessionStorage.setItem('o149-intro', '1'); } catch (e) {}
    if (window.gsap && !fast) gsap.to(el, { opacity: 0, duration: .5, onComplete: end }); else end();
  }
  if (!root.classList.contains('intro-on') || !window.gsap) { end(); return; }

  var $ = function (id) { return document.getElementById(id); };
  var stage = $('stage'), cv = $('fx'), ctx = cv.getContext('2d'), lid = $('lid');
  var R = function (a, b) { return a + Math.random() * (b - a); };

  /* ---------- camera (progress p: 0 = wide shot, 1 = right on top of the box) ---------- */
  var cam = { p: 0 }, shake = { x: 0, y: 0 }, st = { L: 0, fogIn: 0 };
  var VW, VH, s0, s1, fy0;
  function fit() {
    VW = innerWidth; VH = innerHeight;
    var land = VW / VH >= 1;
    s0 = Math.max(VW / 1024, VH / 1536);
    s1 = land ? Math.max(VW / 650, VH / 360) : VW / 430;
    fy0 = land ? 740 : 768;
  }
  addEventListener('resize', fit); fit();
  function place() {
    var p = cam.p, s = s0 + (s1 - s0) * p, fx = 512 + 23 * p, fy = fy0 + (790 - fy0) * p;
    var tx = VW / 2 - fx * s, ty = VH / 2 - fy * s;
    tx = Math.min(0, Math.max(VW - 1024 * s, tx)) + shake.x * s / 2;
    ty = Math.min(0, Math.max(VH - 1536 * s, ty)) + shake.y * s / 2;
    stage.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0) scale(' + s + ')';
  }

  /* ---------- fog sprites ---------- */
  var shape = document.createElement('canvas'); shape.width = shape.height = 256;
  (function () {
    var g = shape.getContext('2d');
    for (var i = 0; i < 10; i++) {
      var x = 128 + R(-42, 42), y = 128 + R(-34, 34), r = R(34, 72), gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, 'rgba(0,0,0,.4)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    }
  })();
  function tint(color) {
    var c = document.createElement('canvas'); c.width = c.height = 256; var g = c.getContext('2d');
    g.drawImage(shape, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = color; g.fillRect(0, 0, 256, 256); return c;
  }
  var gray = tint('rgb(150,153,165)'), white = tint('#fff');

  var fog = [], puffs = [], dust = [], bolts = [];
  for (var i = 0; i < 54; i++) fog.push({
    x: R(-100, 1124), y: 560 + Math.pow(Math.random(), .8) * 940, size: R(340, 720), vx: R(8, 34) * (Math.random() < .35 ? -1 : 1),
    a: R(.05, .13), f: R(.2, .6), ph: R(0, 6.28), amp: R(10, 40), flip: Math.random() < .5 ? -1 : 1
  });
  for (i = 0; i < 46; i++) dust.push({ x: R(0, 1024), y: R(300, 1500), vx: R(-6, 6), vy: -R(5, 22), r: R(.6, 1.6), ph: R(0, 6.28) });

  function burst() {
    for (var k = 0; k < 38; k++) {
      var a = R(0, 6.28), sp = R(120, 420);
      puffs.push({ x: 540 + R(-120, 120), y: 800 + R(-20, 30), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * .55 - R(60, 220), size: R(220, 480), life: R(1.6, 2.6), age: 0 });
    }
  }

  /* ---------- lightning ---------- */
  function jag(x0, y0, x1, y1, spread) {
    var pts = [[x0, y0], [x1, y1]];
    for (var k = 0; k < 6; k++) {
      var n = [];
      for (var i = 0; i < pts.length - 1; i++) {
        var a = pts[i], b = pts[i + 1]; n.push(a);
        n.push([(a[0] + b[0]) / 2 + (Math.random() - .5) * spread, (a[1] + b[1]) / 2 + (Math.random() - .5) * spread * .35]);
      }
      n.push(pts[pts.length - 1]); pts = n; spread *= .55;
    }
    return pts;
  }
  function makeBolt(x0, y0, x1, y1, w) {
    var main = jag(x0, y0, x1, y1, w * 14), paths = [main];
    for (var b = 0; b < 3; b++) {
      var p = main[Math.floor(main.length * R(.2, .7))];
      paths.push(jag(p[0], p[1], p[0] + R(-130, 130), p[1] + R(80, 240), w * 8));
    }
    return { paths: paths, a: 0, w: w };
  }

  /* ---------- render ---------- */
  var last = performance.now();
  function tick() {
    var now = performance.now(), dt = Math.min(.05, (now - last) / 1000), t = now / 1000; last = now;
    place();
    var L = st.L, i, p;
    ctx.clearRect(0, 0, 1024, 1536);
    ctx.globalCompositeOperation = 'source-over';
    for (i = 0; i < fog.length; i++) {
      p = fog[i]; p.x += p.vx * dt;
      if (p.x > 1124 + p.size / 2) p.x = -100 - p.size / 2; else if (p.x < -100 - p.size / 2) p.x = 1124 + p.size / 2;
      var y = p.y + Math.sin(t * p.f + p.ph) * p.amp, a = p.a * st.fogIn, h = p.size / 2;
      ctx.globalAlpha = a * (1 - L * .8);
      ctx.drawImage(gray, p.x - h, y - h, p.size, p.size);
      if (L > .01) {
        var d = (p.x - 540) * (p.x - 540) + (y - 800) * (y - 800), fall = Math.exp(-d / (2 * 460 * 460));
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = Math.min(.85, a * L * (2 + 9 * fall));
        ctx.drawImage(white, p.x - h, y - h, p.size, p.size);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    for (i = puffs.length - 1; i >= 0; i--) {
      p = puffs[i]; p.age += dt;
      if (p.age > p.life) { puffs.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .985; p.vy *= .985;
      var u = p.age / p.life, al = Math.sin(Math.min(1, u * 1.4) * Math.PI) * .75, hs = p.size * (.6 + u) / 2;
      ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = al;
      ctx.drawImage(white, p.x - hs, p.y - hs, hs * 2, hs * 2);
    }
    ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#d8dcea';
    for (i = 0; i < dust.length; i++) {
      p = dust[i]; p.x += p.vx * dt; p.y += p.vy * dt; if (p.y < 200) p.y = 1500;
      ctx.globalAlpha = (.18 + .3 * Math.sin(t * 1.3 + p.ph)) * st.fogIn * (1 - L * .6);
      if (ctx.globalAlpha > 0) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
    }
    ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (i = 0; i < bolts.length; i++) {
      var b = bolts[i]; if (b.a <= 0) continue; ctx.globalAlpha = Math.min(1, b.a);
      for (var j = 0; j < b.paths.length; j++) {
        var path = b.paths[j], k = j ? .5 : 1;
        ctx.beginPath(); ctx.moveTo(path[0][0], path[0][1]);
        for (var q = 1; q < path.length; q++) ctx.lineTo(path[q][0], path[q][1]);
        ctx.strokeStyle = 'rgba(110,150,255,.4)'; ctx.lineWidth = b.w * 6 * k; ctx.stroke();
        ctx.strokeStyle = 'rgba(205,222,255,.85)'; ctx.lineWidth = b.w * 2.2 * k; ctx.stroke();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = b.w * .8 * k; ctx.stroke();
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
  gsap.ticker.add(tick);

  /* ---------- timeline ---------- */
  var fl = $('flash'), tl = gsap.timeline({ paused: true, onComplete: function () { done(true); } });
  gsap.set(lid, { transformOrigin: '445px 676px' });
  gsap.set($('rays'), { xPercent: -50, yPercent: -50, scale: .15 });
  gsap.set($('beam'), { scaleY: 0 });
  gsap.set($('bloom'), { scale: .15 });

  function shakeAt(t, amp) { tl.to(shake, { x: amp, y: -amp * .6, duration: .04, repeat: 9, yoyo: true, ease: 'none' }, t); }
  function strike(t, o) {
    tl.call(function () {
      var b = makeBolt(o.x0, o.y0, o.x1, o.y1, o.w || 3); bolts.push(b);
      gsap.timeline({ onComplete: function () { var i = bolts.indexOf(b); if (i > -1) bolts.splice(i, 1); } })
        .to(b, { a: 1, duration: .04 }).to(b, { a: .25, duration: .06 }).to(b, { a: 1, duration: .04 }).to(b, { a: 0, duration: .4, ease: 'power2.out' });
    }, null, t);
    tl.fromTo(fl, { opacity: 0 }, { opacity: o.k, duration: .05, ease: 'none' }, t)
      .to(fl, { opacity: o.k * .22, duration: .07 }, t + .05)
      .to(fl, { opacity: o.k * .85, duration: .04 }, t + .12)
      .to(fl, { opacity: 0, duration: .6, ease: 'power2.out' }, t + .16);
    if (o.shake) shakeAt(t + .05, o.shake);
  }

  /* 1 · fade up from black into the fog; camera begins its push-in */
  tl.to(stage, { opacity: 1, duration: 1.8, ease: 'power1.out' }, 0)
    .to(st, { fogIn: 1, duration: 2.2 }, 0)
    .to(cam, { p: 1, duration: 6.7, ease: 'power2.inOut' }, 0)
    .to(cam, { p: 1.05, duration: 1.4, ease: 'none' }, 6.7);

  /* 2 · lightning in the ruined hall, building toward the box */
  strike(1.0, { x0: 690, y0: 90, x1: 640, y1: 340, k: .5 });
  strike(2.6, { x0: 430, y0: 60, x1: 390, y1: 320, k: .7 });
  strike(2.78, { x0: 700, y0: 100, x1: 650, y1: 380, k: .4 });
  strike(4.2, { x0: 520, y0: 120, x1: 570, y1: 640, k: .9, shake: 6 });
  strike(5.8, { x0: 770, y0: 200, x1: 620, y1: 780, k: 1, shake: 10, w: 4 });

  /* 3 · the lid trembles, a seam of light appears, then it pops open */
  tl.to($('seam'), { opacity: 1, duration: .5 }, 6.15)
    .to(lid, { x: 2, y: -1, duration: .03, repeat: 15, yoyo: true, ease: 'none' }, 6.1)
    .to(lid, { rotationX: 10, y: -14, duration: .16, ease: 'power2.out' }, 6.6)
    .fromTo($('ilight'), { opacity: 0 }, { opacity: 1, duration: .35, ease: 'power2.out' }, 6.62)
    .to(lid, { rotationX: 74, y: -90, duration: .9, ease: 'power3.out' }, 6.78)
    .to($('lidlight'), { opacity: 1, duration: .6 }, 6.7)
    .to(lid, { opacity: 0, duration: .5 }, 7.3);

  /* 4 · blinding burst: light fills the smoke and the screen */
  tl.call(burst, null, 6.62)
    .to(st, { L: 1, duration: 1.1, ease: 'power2.in' }, 6.6)
    .to($('rays'), { opacity: 1, scale: 1.1, duration: 1, ease: 'power2.out' }, 6.65)
    .to($('rays'), { rotation: 25, duration: 2.2, ease: 'none' }, 6.65)
    .to($('beam'), { opacity: 1, scaleY: 1, duration: .5, ease: 'power2.out' }, 6.62)
    .fromTo(fl, { opacity: 0 }, { opacity: 1, duration: .08, ease: 'none' }, 6.62)
    .to(fl, { opacity: .5, duration: .6 }, 6.7)
    .to($('bloom'), { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.in' }, 6.7);
  shakeAt(6.62, 8);

  /* 5 · white-out, then the homepage is revealed underneath */
  tl.to($('white'), { opacity: 1, duration: .8, ease: 'power2.in' }, 7.5)
    .to(el, { opacity: 0, duration: .9, ease: 'power1.inOut' }, 8.4);

  /* start once the artwork is decoded (or after a short timeout) */
  var started = false;
  function go() { if (!started && !finished) { started = true; tl.play(); } }
  var img = $('bg');
  if (img.decode) img.decode().then(go, go); else img.onload = go;
  setTimeout(go, 2500);

  $('skip').addEventListener('click', function () { tl.kill(); done(); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') { tl.kill(); done(); } });
})();
