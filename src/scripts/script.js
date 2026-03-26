import Lenis from 'lenis'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { TextHoverEffect } from './text-hover.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

new TextHoverEffect(document.querySelector('#site-heading'));

// Initialize Lenis
const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// .words-up — split into words, fade up on scroll into view
document.querySelectorAll('.words-up').forEach(el => {
  const split = SplitText.create(el, { type: 'words' });
  gsap.from(split.words, {
    y: 40, opacity: 0,
    stagger: 0.1, duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 90%',
      once: true,
    },
  });
});

// Loop: when scroll reaches the end, jump back to the top
(function () {
  let looping = false;
  lenis.on('scroll', ({ scroll, limit }) => {
    if (!looping && scroll >= limit - 1) {
      looping = true;
      lenis.scrollTo(0, { immediate: true });
      setTimeout(() => { looping = false; }, 100);
    }
  });
})();

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
    const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight) * 1.4;
    const w = img.naturalWidth  * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  }

  frames[0].onload = () => drawFrame(0);

  // Scroll to hero (midpoint of sequence-container) so animation is already 50% in
  // Use 'load' to ensure layout is settled before reading offsetTop
  window.addEventListener('load', () => {
    const hero = document.getElementById('hero-section');
    if (hero) requestAnimationFrame(() => lenis.scrollTo(hero.offsetTop, { immediate: true }));
  });

  const state = { frame: 0 };
  let freezeFrame = false;
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
    onUpdate() { if (!freezeFrame) drawFrame(Math.round(state.frame)); },
  });

  // Freeze the frame while the horizontal scroll section is active
  ScrollTrigger.create({
    trigger: '#h-scroll-outer',
    start: 'top top',
    end: () => `+=${(document.querySelectorAll('#h-scroll-inner > section').length - 1) * window.innerWidth}`,
    onToggle: self => { freezeFrame = self.isActive; },
  });

  const tl = gsap.timeline({ scrollTrigger: scrollConfig });
    gsap.to(canvas, {
    x: '30vw',
    y: '20vh',
    scale: 0.6,
    scrollTrigger: {
      trigger: '#sequence-container',
      start: 'top top',
      end: '20% top',   // ← only covers first 25% of the container
      scrub: 0.5,       // ← fast response
    }
  });

  gsap.to(canvas, {
    x: 0,
    scale: 1,
    scrollTrigger: {
      trigger: '#sequence-container',
      start: '25% top',
      end: '75% top',
      scrub: 2,         // ← sluggish, dreamy feel
    }
  });


})();

// Horizontal scroll section
(function () {
  const inner = document.getElementById('h-scroll-inner');
  if (!inner) return;
  const panels = inner.querySelectorAll(':scope > section');
  const totalWidth = (panels.length - 1) * window.innerWidth;

  gsap.to(inner, {
    x: -totalWidth,
    ease: 'none',
    scrollTrigger: {
      trigger: '#h-scroll-outer',
      pin: true,
      start: 'top top',
      end: () => `+=${totalWidth}`,
      scrub: 1,
      invalidateOnRefresh: true,
    },
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