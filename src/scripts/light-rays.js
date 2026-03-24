import * as THREE from 'three';

(function () {
  const canvas = document.getElementById('light-rays');

  const W = window.innerWidth;
  const H = window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H);

  // gl_FragCoord is in *physical* pixels, so uResolution must match the
  // drawing buffer (W × dpr, H × dpr), not the logical CSS size.
  const drawSize = new THREE.Vector2();
  renderer.getDrawingBufferSize(drawSize);

  const scene  = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite:  false,
    uniforms: {
      uTime:       { value: 0.0 },
      uResolution: { value: drawSize.clone() },
    },
    vertexShader: /* glsl */`
      void main() {
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      precision mediump float;
      uniform float uTime;
      uniform vec2  uResolution;

      float rayGaussian(float angle, float center, float sigma) {
        float d = angle - center;
        return exp(-0.5 * d * d / (sigma * sigma));
      }

      void main() {
        // Work in actual pixel coordinates — avoids all aspect-ratio angle distortion.
        // (0,0) = top-left corner, matching CSS / SVG coordinate space.
        vec2 px = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);

        // Origin: top-right corner, nudged just outside the canvas
        vec2 origin = vec2(uResolution.x * 1.02, uResolution.y * -0.02);

        vec2 dir  = px - origin;
        float dist = length(dir);
        float angle = atan(dir.y, dir.x);

        // Slow organic animation
        float t  = uTime * 0.22;
        float w1 = sin(t)              * 0.018;
        float w2 = sin(t * 1.4 + 1.1) * 0.012;

        // Define each ray by where it aims on screen (matches the SVG polygon centres).
        // Ray 1: first SVG polygon — fans toward lower-left edge (~9% x, ~71% y)
        vec2 r1target = vec2(uResolution.x * 0.09, uResolution.y * 0.71);
        float r1angle = atan(r1target.y - origin.y, r1target.x - origin.x);

        // Ray 2: second SVG polygon — fans toward lower-centre (~34% x, ~87% y)
        vec2 r2target = vec2(uResolution.x * 0.34, uResolution.y * 0.87);
        float r2angle = atan(r2target.y - origin.y, r2target.x - origin.x);

        // Sigma in radians — grows with distance so edges soften at the far end
        float normDist = dist / length(uResolution);
        float r1sigma  = 0.08 + normDist * 0.18 + sin(t * 0.7)       * 0.008;
        float r2sigma  = 0.07 + normDist * 0.15 + sin(t * 0.9 + 0.5) * 0.008;

        float r1 = rayGaussian(angle, r1angle + w1, r1sigma);
        float r2 = rayGaussian(angle, r2angle + w2, r2sigma);

        float rays = r1 * 0.65 + r2 * 0.50;

        // Radial fade from source outward
        float maxDist    = length(uResolution);
        float radialFade = smoothstep(maxDist, maxDist * 0.05, dist);

        // Extra dissolve at the bottom-left termination zone
        vec2 uv    = px / uResolution;
        float blFade = 1.0 - smoothstep(0.45, 1.0, (1.0 - uv.x) * 0.55 + uv.y * 0.45);

        // Subtle brightness pulse
        float pulse = 0.96 + 0.04 * sin(t * 1.1);

        float alpha = rays * radialFade * blFade * pulse * 0.22;

        vec3 col = vec3(1.0, 0.922, 0.678); // #FFEBAD
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
      }
    `,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  scene.add(mesh);

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.getDrawingBufferSize(mat.uniforms.uResolution.value);
  });

  (function animate(t) {
    requestAnimationFrame(animate);
    mat.uniforms.uTime.value = t * 0.001;
    renderer.render(scene, camera);
  })(0);
})();
