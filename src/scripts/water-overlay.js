/**
 * water-overlay.js
 *
 * Canvas 2D implementation of the Ajarus water shader look.
 * Computes the Ajarus dx/dy gradient on a small 48×48 grid in JS,
 * maps the resulting alpha to greyscale, draws via putImageData,
 * and CSS-scales the tiny canvas to full-screen (browser smooths it).
 *
 * mix-blend-mode: overlay — grey 0.5 = zero effect, brighter = lightens
 * page, darker = darkens. Creates depth and shading without touching colour.
 *
 * ~55 000 trig ops/frame — fast on any device.
 */

(function () {

  // ── Parameters ─────────────────────────────────────────────────────────────
  const SPEED          = 0.2;
  const SPEED_X        = 0.3;
  const SPEED_Y        = 0.3;
  const EMBOSS         = 0.50;
  const INTENSITY      = 2.4;
  const STEPS          = 8;
  const FREQUENCY      = 2.8;   // lower = larger, smoother ripples
  const ANGLE_DIVS     = 7;
  const DELTA          = 60.0;
  const GAIN           = 700.0;
  const REFL_CUTOFF    = 0.012;
  const REFL_INTENSITY = 200000.0;
  const TIME_SCALE     = 0.7;    // slower = smoother motion

  const GRID_W         = 48;     // computation resolution
  const GRID_H         = 48;
  const DISPLAY_SIZE   = 512;    // display canvas size — upscaled smoothly from grid
  const OPACITY        = 0.95;   // overall effect strength

  const CURSOR_WARP    = 1.4;    // how strongly cursor bends the water field
  const CURSOR_FALLOFF = 2.0;    // Gaussian width (lower = wider)
  const MOUSE_LERP     = 0.09;
  // ──────────────────────────────────────────────────────────────────────────

  // Offscreen canvas for computation (small, fast)
  const offscreen = document.createElement('canvas');
  offscreen.width  = GRID_W;
  offscreen.height = GRID_H;
  const offCtx  = offscreen.getContext('2d');
  const imgData = offCtx.createImageData(GRID_W, GRID_H);
  const data    = imgData.data;

  // Display canvas — larger, bilinear-upscaled from offscreen for smoothness
  const canvas = document.createElement('canvas');
  canvas.width  = DISPLAY_SIZE;
  canvas.height = DISPLAY_SIZE;
  Object.assign(canvas.style, {
    position:      'fixed',
    inset:         '0',
    width:         '100%',
    height:        '100%',
    pointerEvents: 'none',
    zIndex:        '50',
    mixBlendMode:  'hard-light',
    opacity:       String(OPACITY),
    filter:        'blur(6px)',   // kills remaining pixel-edge shakiness
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Precompute per-angle trig (constant for all pixels)
  const cosT = new Float32Array(STEPS);
  const sinT = new Float32Array(STEPS);
  const dtheta = (2 * Math.PI) / ANGLE_DIVS;
  for (let i = 0; i < STEPS; i++) {
    const theta = dtheta * i;
    cosT[i] = Math.cos(theta);
    sinT[i] = Math.sin(theta);
  }

  // Exact Ajarus col() function
  function waterField(x, y, time) {
    let sum = 0;
    for (let i = 0; i < STEPS; i++) {
      const ax = x + cosT[i] * time * SPEED + time * SPEED_X;
      const ay = y - sinT[i] * time * SPEED + time * SPEED_Y;
      sum += Math.cos((ax * cosT[i] - ay * sinT[i]) * FREQUENCY) * INTENSITY;
    }
    return Math.cos(sum);
  }

  // ── State ──────────────────────────────────────────────────────────────────
  const mouse  = { x: 0.5, y: 0.5 };
  const lerped = { x: 0.5, y: 0.5 };
  const t0     = performance.now();

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  }, { passive: true });

  // ── Render loop ────────────────────────────────────────────────────────────
  (function animate() {
    requestAnimationFrame(animate);

    const time = (performance.now() - t0) * 0.001 * TIME_SCALE;
    lerped.x  += (mouse.x - lerped.x) * MOUSE_LERP;
    lerped.y  += (mouse.y - lerped.y) * MOUSE_LERP;

    const asp = window.innerWidth / window.innerHeight;

    for (let py = 0; py < GRID_H; py++) {
      for (let px = 0; px < GRID_W; px++) {

        let u = px / GRID_W;
        let v = py / GRID_H;

        // ── Cursor push ──────────────────────────────────────────────────────
        const cu   = (u - lerped.x) * asp;
        const cv   =  v - lerped.y;
        const dist = Math.sqrt(cu * cu + cv * cv);
        const warp = Math.exp(-dist * dist * CURSOR_FALLOFF) * CURSOR_WARP;
        const ilen = 1 / (dist + 0.001);
        u -= cu * ilen * warp;
        v -= cv * ilen * warp;

        // ── Ajarus finite-difference gradient ───────────────────────────────
        const cc1 = waterField(u, v, time);
        const dx  = EMBOSS * (cc1 - waterField(u + 1 / DELTA, v, time)) / DELTA;
        const dy  = EMBOSS * (cc1 - waterField(u, v + 1 / DELTA, time)) / DELTA;

        // ── Ajarus alpha ─────────────────────────────────────────────────────
        let alpha = 1 + dx * dy * GAIN;
        const ddx = dx - REFL_CUTOFF;
        const ddy = dy - REFL_CUTOFF;
        if (ddx > 0 && ddy > 0) {
          alpha = Math.pow(Math.min(alpha, 3.5), ddx * ddy * REFL_INTENSITY);
        }

        // ── Map alpha → greyscale ────────────────────────────────────────────
        // Stretch contrast: 128 = neutral, deviations amplified 3×
        // so small wave gradients produce bold light/dark banding
        const grey = Math.max(0, Math.min(255, 128 + (alpha - 1) * 260));

        const idx    = (py * GRID_W + px) * 4;
        data[idx]    = grey;
        data[idx + 1]= grey;
        data[idx + 2]= Math.min(255, grey + 18); // faint blue tint on bright peaks
        data[idx + 3]= 255;
      }
    }

    // Write computation result to offscreen, then upscale-draw to display
    offCtx.putImageData(imgData, 0, 0);
    ctx.clearRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
    ctx.drawImage(offscreen, 0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
  })();

})();
