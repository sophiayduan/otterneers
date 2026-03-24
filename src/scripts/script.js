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

// Soft snap to hero top TODO:fix this
(function () {
  const THRESHOLD = 400; // px within hero top to trigger snap
  let snapTimer;

  lenis.on('scroll', ({ scroll }) => {
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      const hero = document.getElementById('hero-section');
      if (!hero) return;
      const heroTop = hero.offsetTop;
      const dist = Math.abs(scroll - heroTop);
      if (dist < THRESHOLD && dist > 4) {
        lenis.scrollTo(heroTop, { duration: 1.2, easing: t => 1 - Math.pow(1 - t, 4) });
      }
    }, 180);
  });
})();

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
    img.src = `/sequence/frame${i + 1}.png`;
    return img;
  });

  function drawFrame(index) {
    const img = frames[index];
    if (!img.complete) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth  * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  }

  frames[0].onload = () => drawFrame(0);

  // Scroll to hero (midpoint of sequence-container) so animation is already 50% in
  // Use 'load' to ensure layout is settled before reading offsetTop
  window.addEventListener('load', () => {
    const hero = document.getElementById('hero-section');
    if (hero) window.scrollTo({ top: hero.offsetTop, behavior: 'instant' });
  });

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
    gsap.to(canvas, {
    x: '-10vw',
    scale: 0.5,
    scrollTrigger: {
      trigger: '#sequence-container',
      start: 'top top',
      end: '25% top',   // ← only covers first 25% of the container
      scrub: 0.5,       // ← fast response
    }
  });

  gsap.to(canvas, {
    x: 0,
    scale: 1.2,
    scrollTrigger: {
      trigger: '#sequence-container',
      start: '25% top',
      end: '75% top',
      scrub: 2,         // ← sluggish, dreamy feel
    }
  });
})();

// (function () {
//   const star = document.getElementById('hero-star');
//   if (!star) return;

//   const spinner = gsap.to(star, {
//     rotation: 360,
//     duration: 2.5,
//     ease: 'none',
//     repeat: -1,
//     paused: true,
//     transformOrigin: '50% 50%',
//   });

//   const scaler = gsap.to(star, {
//     scale: 1.12,
//     duration: 1.6,
//     ease: 'sine.inOut',
//     yoyo: true,
//     repeat: -1,
//     paused: true,
//     transformOrigin: '50% 50%',
//   });

//   star.addEventListener('mouseenter', () => { spinner.play(); scaler.play(); });
//   star.addEventListener('mouseleave', () => { spinner.pause(); scaler.pause(); });
// })();