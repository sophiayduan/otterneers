import * as THREE from 'three';

(function () {
  const hero   = document.getElementById('hero-section');
  const canvas = document.getElementById('hero-particles');

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const group = new THREE.Group();
  scene.add(group);

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 4;

  function makeSprite(drawFn) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#FFFDF6';
    drawFn(ctx);
    return new THREE.CanvasTexture(c);
  }

  const sprites = [
    // teardrop
    makeSprite(ctx => {
      ctx.beginPath();
      ctx.moveTo(32, 14);
      ctx.bezierCurveTo(48, 14, 52, 30, 48, 40);
      ctx.bezierCurveTo(44, 50, 20, 50, 16, 40);
      ctx.bezierCurveTo(12, 30, 16, 14, 32, 14);
      ctx.fill();
    }),
    // lopsided blob
    makeSprite(ctx => {
      ctx.beginPath();
      ctx.moveTo(32, 18);
      ctx.bezierCurveTo(46, 16, 52, 28, 46, 38);
      ctx.bezierCurveTo(40, 48, 22, 46, 16, 36);
      ctx.bezierCurveTo(10, 26, 18, 20, 32, 18);
      ctx.fill();
    }),
    // squished oval
    makeSprite(ctx => {
      ctx.beginPath();
      ctx.ellipse(32, 32, 20, 13, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }),
    // kidney-ish
    makeSprite(ctx => {
      ctx.beginPath();
      ctx.moveTo(22, 22);
      ctx.bezierCurveTo(14, 18, 14, 38, 24, 42);
      ctx.bezierCurveTo(32, 46, 50, 42, 50, 32);
      ctx.bezierCurveTo(50, 22, 38, 16, 28, 20);
      ctx.bezierCurveTo(26, 21, 24, 22, 22, 22);
      ctx.fill();
    }),
  ];

  const COUNT = 200, RANGE = 10, ZMIN = -9, ZMAX = -2;
  const positions  = new Float32Array(COUNT * 3);
  const velocities = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    positions[i*3]    = (Math.random()-0.5) * RANGE;
    positions[i*3+1]  = (Math.random()-0.5) * RANGE;
    positions[i*3+2]  = Math.random() * (ZMAX - ZMIN) + ZMIN;
    velocities[i*3]   = (Math.random()-0.5) * 0.004;
    velocities[i*3+1] = (Math.random()-0.5) * 0.004;
    velocities[i*3+2] = (Math.random()-0.5) * 0.001;
  }

  const perShape = Math.floor(COUNT / sprites.length);
  const pointsObjects = sprites.map((sprite, si) => {
    const start = si * perShape;
    const end   = si === sprites.length - 1 ? COUNT : start + perShape;
    const n = end - start;
    const buf = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      buf[i*3]   = positions[(start+i)*3];
      buf[i*3+1] = positions[(start+i)*3+1];
      buf[i*3+2] = positions[(start+i)*3+2];
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(buf, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.07, map: sprite, color: 0xFFFDF6, // attributes
      transparent: true, opacity: 0.3,
      sizeAttenuation: true, depthWrite: false,
    });
    const pts = new THREE.Points(geo, mat);
    group.add(pts);
    return { pts, start, end };
  });

  const mouse  = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  window.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    if (e.clientY > rect.bottom) return;
    mouse.x =  ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    mouse.y = -((e.clientY - rect.top)  / rect.height - 0.5) * 2;
  });

  function resize() {
    const w = hero.offsetWidth, h = hero.offsetHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  let heroVisible = true;
  new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
  }, { rootMargin: '200px' }).observe(hero);

  (function animate() {
    requestAnimationFrame(animate);
    if (!heroVisible) return;
    const half = RANGE / 2;
    for (let i = 0; i < COUNT; i++) {
      positions[i*3]   += velocities[i*3];
      positions[i*3+1] += velocities[i*3+1];
      positions[i*3+2] += velocities[i*3+2];
      if (positions[i*3]   >  half) positions[i*3]   = -half;
      if (positions[i*3]   < -half) positions[i*3]   =  half;
      if (positions[i*3+1] >  half) positions[i*3+1] = -half;
      if (positions[i*3+1] < -half) positions[i*3+1] =  half;
      if (positions[i*3+2] > ZMAX)  positions[i*3+2] = ZMIN;
      if (positions[i*3+2] < ZMIN)  positions[i*3+2] = ZMAX;
    }
    for (const { pts, start, end } of pointsObjects) {
      const attr = pts.geometry.attributes.position;
      const n = end - start;
      for (let i = 0; i < n; i++) {
        attr.array[i*3]   = positions[(start+i)*3];
        attr.array[i*3+1] = positions[(start+i)*3+1];
        attr.array[i*3+2] = positions[(start+i)*3+2];
      }
      attr.needsUpdate = true;
    }
    target.x += (mouse.x - target.x) * 0.04;
    target.y += (mouse.y - target.y) * 0.04;
    group.rotation.y = target.x * 0.1;
    group.rotation.x = target.y * 0.06;
    renderer.render(scene, camera);
  })();
})();
