import * as THREE from 'three';
(function () {
  const canvas = document.getElementById('hero-title');

  const svgImg = new Image();
  svgImg.onload = function () {
    const W = svgImg.naturalWidth;
    const H = svgImg.naturalHeight;
    const PAD = 300; // padding so edge distortion isn't clipped
    const PW = W + PAD * 2;
    const PH = H + PAD * 2;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-PW/2, PW/2, PH/2, -PH/2, -1, 1);

    const texCanvas = document.createElement('canvas');
    const texCtx = texCanvas.getContext('2d');
    texCanvas.width = W;
    texCanvas.height = H;
    texCtx.drawImage(svgImg, 0, 0, W, H);
    const texture = new THREE.Texture(texCanvas);
    texture.needsUpdate = true;

    // UV offsets so texture is mapped only to the central W×H area of the PW×PH plane
    const uPadU   = PAD / PW;
    const uPadV   = PAD / PH;
    const uScaleU = W / PW;
    const uScaleV = H / PH;

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTex:     { value: texture },
        uMouse:   { value: new THREE.Vector2(0.5, 0.5) },
        uHover:   { value: 0.0 },
        uTime:    { value: 0.0 },
        uPadUV:   { value: new THREE.Vector2(uPadU, uPadV) },
        uScaleUV: { value: new THREE.Vector2(uScaleU, uScaleV) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uTex;
        uniform vec2 uMouse;
        uniform float uHover;
        uniform float uTime;
        uniform vec2 uPadUV;
        uniform vec2 uScaleUV;
        varying vec2 vUv;

        void main() {
          // Remap from full-plane UV space to texture (content) UV space
          vec2 uv = (vUv - uPadUV) / uScaleUV;

          vec2 toMouse = uMouse - uv;
          float dist = length(toMouse);
          vec2 dir = normalize(toMouse + 0.0001);

          // Elastic wave distortion
          float wave = sin(dist * 14.0 - uTime * 4.0) * exp(-dist * 6.0);
          uv += dir * wave * uHover * 0.18;

          // Custom-colour chromatic split
          float split = uHover * 0.04 * smoothstep(0.4, 0.0, dist);
          float t     = uHover * smoothstep(0.4, 0.0, dist);

          vec3 col1 = vec3(0.102, 0.910, 0.898); // #1AE8E5
          vec3 col3 = vec3(0.686, 0.592, 0.729); // #AF97BA

          vec2 uv1 = uv + dir * split;
          vec2 uv2 = uv;
          vec2 uv3 = uv - dir * split;

          // Zero out samples that fall outside [0,1] — prevents edge-clamp streaks
          float m1 = step(0.0,uv1.x)*step(uv1.x,1.0)*step(0.0,uv1.y)*step(uv1.y,1.0);
          float m2 = step(0.0,uv2.x)*step(uv2.x,1.0)*step(0.0,uv2.y)*step(uv2.y,1.0);
          float m3 = step(0.0,uv3.x)*step(uv3.x,1.0)*step(0.0,uv3.y)*step(uv3.y,1.0);

          float a1 = texture2D(uTex, uv1).a * m1;
          float a2 = texture2D(uTex, uv2).a * m2;
          float a3 = texture2D(uTex, uv3).a * m3;

          vec4 base    = texture2D(uTex, uv2);
          base.a      *= m2;
          vec3 mainCol = vec3(0.098, 0.200, 0.702); // #1933B3

          vec3 splitCol = mainCol * a2
                        + col1 * max(a1 - a2, 0.0)
                        + col3 * max(a3 - a2, 0.0);
          float splitA  = max(a1, max(a2, a3));

          gl_FragColor = vec4(mix(mainCol, splitCol, t), mix(base.a, splitA, t));
        }
      `,
    });

    // Plane covers the full padded canvas — distorted pixels render in the padding area
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), mat);
    scene.add(mesh);

    let currentScale = 1;

    function resize() {
      currentScale = canvas.parentElement.clientWidth / W;
      const DPR = Math.min(window.devicePixelRatio, 2);
      const texW = Math.round(W * currentScale * DPR);
      const texH = Math.round(H * currentScale * DPR);
      if (texCanvas.width !== texW || texCanvas.height !== texH) {
        texCanvas.width = texW;
        texCanvas.height = texH;
        texCtx.drawImage(svgImg, 0, 0, texW, texH);
        texture.needsUpdate = true;
      }
      const sPW = Math.round(PW * currentScale);
      const sPH = Math.round(PH * currentScale);
      canvas.style.margin = `-${PAD * currentScale}px`;
      renderer.setSize(sPW, sPH);
      camera.left   = -sPW / 2;
      camera.right  =  sPW / 2;
      camera.top    =  sPH / 2;
      camera.bottom = -sPH / 2;
      camera.updateProjectionMatrix();
      mesh.geometry.dispose();
      mesh.geometry = new THREE.PlaneGeometry(sPW, sPH);
    }

    new ResizeObserver(resize).observe(canvas.parentElement);
    window.addEventListener('resize', resize);
    resize();

    const mouse  = new THREE.Vector2(0.5, 0.5);
    const lerped = new THREE.Vector2(0.5, 0.5);
    let hoverTarget = 0;
    let lastMoveTime = 0;
    const IDLE_MS   = 150;
    const PROXIMITY = 140; // px outside canvas that starts activating the effect

    document.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      const sPAD = PAD * currentScale;
      const l = r.left + sPAD, ri = r.right  - sPAD;
      const t = r.top  + sPAD, b  = r.bottom - sPAD;

      const dx   = Math.max(l - e.clientX, 0, e.clientX - ri);
      const dy   = Math.max(t - e.clientY, 0, e.clientY - b);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < PROXIMITY) {
        hoverTarget   = 1 - dist / PROXIMITY;
        lastMoveTime  = performance.now();
      } else {
        hoverTarget = 0;
      }

      // Always update mouse UV — clamp to content bounds so direction is valid
      mouse.set(
        (Math.max(l, Math.min(ri, e.clientX)) - l) / (W * currentScale),
        1 - (Math.max(t, Math.min(b, e.clientY)) - t) / (H * currentScale)
      );
    });

    (function animate(t) {
      requestAnimationFrame(animate);
      if (hoverTarget > 0 && performance.now() - lastMoveTime > IDLE_MS) {
        hoverTarget = 0;
      }
      lerped.lerp(mouse, 0.07);
      mat.uniforms.uMouse.value.copy(lerped);
      mat.uniforms.uHover.value += (hoverTarget - mat.uniforms.uHover.value) * 0.018;
      mat.uniforms.uTime.value   = t * 0.001;
      renderer.render(scene, camera);
    })(0);
  };
  svgImg.src = '/seaotters.svg';
})();
