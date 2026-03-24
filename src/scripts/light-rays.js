import * as THREE from 'three';

(function () {
  const hero   = document.getElementById('hero-section');
  const canvas = document.getElementById('light-rays');

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const drawSize = new THREE.Vector2();

  const scene  = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite:  false,
    uniforms: {
      uTime:       { value: 0.0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
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
        // Physical pixel coords, (0,0) = top-left of canvas
        vec2 px = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);

        // Origin: slightly beyond the top-right corner of the hero section
        vec2 origin = vec2(uResolution.x * 1.02, uResolution.y * -0.02);

        vec2 dir   = px - origin;
        float dist  = length(dir);
        float angle = atan(dir.y, dir.x);

        float t  = uTime * 0.22;

        // --- Ray A: steep, fans toward bottom-left corner ---
        vec2 raTarget = vec2(uResolution.x * 0.05, uResolution.y * 0.90);
        float raAngle = atan(raTarget.y - origin.y, raTarget.x - origin.x);
        float wa      = sin(t)               * 0.020;
        float normDist = dist / length(uResolution);
        float raSigma  = 0.22 + normDist * 0.14 + sin(t * 0.7)        * 0.008;
        float rA       = rayGaussian(angle, raAngle + wa, raSigma);

        // --- Ray B: shallower, fans toward left-centre ---
        vec2 rbTarget = vec2(uResolution.x * 0.30, uResolution.y * 0.42);
        float rbAngle = atan(rbTarget.y - origin.y, rbTarget.x - origin.x);
        float wb      = sin(t * 1.3 + 1.2) * 0.016;
        float rbSigma  = 0.18 + normDist * 0.11 + sin(t * 0.9 + 0.5) * 0.008;
        float rB       = rayGaussian(angle, rbAngle + wb, rbSigma);

        float rays = rA * 0.70 + rB * 0.55;

        // Radial fade — bright near source, dissolves toward far ends
        float maxDist    = length(uResolution);
        float radialFade = smoothstep(maxDist, maxDist * 0.05, dist);

        // Soften the bottom-left termination of Ray A
        vec2 uv    = px / uResolution;
        float blFade = 1.0 - smoothstep(0.45, 1.0, (1.0 - uv.x) * 0.55 + uv.y * 0.45);

        float pulse = 0.96 + 0.04 * sin(t * 1.1);
        float alpha = rays * radialFade * blFade * pulse * 0.22;

        vec3 col = vec3(1.0, 0.922, 0.678); // #FFEBAD
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
      }
    `,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  scene.add(mesh);

  function resize() {
    const W = hero.offsetWidth;
    const H = hero.offsetHeight;
    renderer.setSize(W, H);
    renderer.getDrawingBufferSize(drawSize);
    mat.uniforms.uResolution.value.copy(drawSize);
  }

  // Use ResizeObserver so we catch hero height changes too
  new ResizeObserver(resize).observe(hero);
  resize();

  (function animate(t) {
    requestAnimationFrame(animate);
    mat.uniforms.uTime.value = t * 0.001;
    renderer.render(scene, camera);
  })(0);
})();
