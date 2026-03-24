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
    makeSprite(ctx => {
      const g = ctx.createRadialGradient(32,32,0,32,32,28);
      g.addColorStop(0, 'rgba(255,253,246,1)');
      g.addColorStop(0.4, 'rgba(255,253,246,0.6)');
      g.addColorStop(1, 'rgba(255,253,246,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(32,32,28,0,Math.PI*2); ctx.fill();
    }),
    makeSprite(ctx => {
      const g = ctx.createRadialGradient(32,32,0,32,32,22);
      g.addColorStop(0, 'rgba(255,253,246,0.9)');
      g.addColorStop(0.5, 'rgba(255,253,246,0.5)');
      g.addColorStop(1, 'rgba(255,253,246,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(32,32,22,0,Math.PI*2); ctx.fill();
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
      size: 0.032, map: sprite, color: 0xFFFDF6,
      transparent: true, opacity: 0.7,
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

  (function animate() {
    requestAnimationFrame(animate);
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
