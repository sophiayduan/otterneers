import Lenis from 'lenis'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis
const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

(function () {
  const frameCount = 47;
  const canvas = document.getElementById('frame-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const frames = Array.from({ length: frameCount }, (_, i) => {
    const img = new Image();
    img.src = `public/sequence/Untitled_Artwork-${i + 1}.png`;
    return img;
  });

  function drawFrame(index) {
    const img = frames[index];
    if (!img.complete) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth  * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  }

  frames[0].onload = () => drawFrame(0);

  const state = { frame: 0 };
  const scrollConfig = {
    trigger: '#sequence-container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.2,
  };

  gsap.to(state, {
    frame: frameCount - 1,
    ease: 'none',
    scrollTrigger: scrollConfig,
    onUpdate() { drawFrame(Math.round(state.frame)); },
  });

  const tl = gsap.timeline({ scrollTrigger: scrollConfig });
  tl.fromTo(canvas,
    { scale: 0.4, x: '25vw' },
    { scale: 1,   x: '-25vw', ease: 'power2.inOut', duration: 0.3 }
  ).to(canvas,
    { x: 0, ease: 'power2.out', duration: 0.5 }
  );
})();

// ── Star hover spin ───────────────────────────────────────────────────────────
(function () {
  const star = document.getElementById('hero-star');
  if (!star) return;

  const spinner = gsap.to(star, {
    rotation: 360,
    duration: 2.5,
    ease: 'none',
    repeat: -1,
    paused: true,
    transformOrigin: '50% 50%',
  });

  const scaler = gsap.to(star, {
    scale: 1.12,
    duration: 1.6,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    paused: true,
    transformOrigin: '50% 50%',
  });

  star.addEventListener('mouseenter', () => { spinner.play(); scaler.play(); });
  star.addEventListener('mouseleave', () => { spinner.pause(); scaler.pause(); });
})();
