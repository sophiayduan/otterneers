import Lenis from 'lenis'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { TextHoverEffect } from './text-hover.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

new TextHoverEffect(document.querySelector('#site-heading'));

// RAFT list item hover — slide up effect
(function () {
  const items = document.querySelectorAll('.raft-item');
  if (!items.length) return;

  const dur  = 0.5;
  const ease = 'power2.inOut';

  items.forEach(item => {
    const h2    = item.querySelector('.raft-h2');
    const clone = item.querySelector('.raft-h2-clone');
    const p     = item.querySelector('.raft-p');

    // Clone starts directly below the real H2 — both travel as a single column
    gsap.set(clone, { yPercent: 100 });
    gsap.set(p,     { y: 16, opacity: 0 });

    item.addEventListener('mouseenter', () => {
      gsap.killTweensOf([h2, clone, p]);
      gsap.to(h2,    { yPercent: -100, duration: dur, ease });
      gsap.to(clone, { yPercent: 0,    duration: dur, ease });
      gsap.to(p,     { y: 0, opacity: 1, duration: dur, ease: 'power2.out', delay: dur * 0.2 });
    });

    item.addEventListener('mouseleave', () => {
      gsap.killTweensOf([h2, clone, p]);
      gsap.to(h2,    { yPercent: 0,   duration: dur, ease });
      gsap.to(clone, { yPercent: 100, duration: dur, ease });
      gsap.to(p,     { y: 16, opacity: 0, duration: dur * 0.8, ease: 'power2.in' });
    });
  });
})();

// Corner hover frame for facts list items
(function () {
  const ul = document.querySelector('#facts-inner ul');
  if (!ul) return;

  const frame = document.createElement('div');
  frame.id = 'hover-frame';
  frame.innerHTML =
    '<span class="corner tl"></span>' +
    '<span class="corner tr"></span>' +
    '<span class="corner bl"></span>' +
    '<span class="corner br"></span>';
  document.body.appendChild(frame);

  gsap.set(frame, { opacity: 0 });

  // quickTo gives buttery continuous updates without spawning new tweens
  const qx = gsap.quickTo(frame, 'x',      { duration: 0.5, ease: 'power3.out' });
  const qy = gsap.quickTo(frame, 'y',      { duration: 0.5, ease: 'power3.out' });
  const qw = gsap.quickTo(frame, 'width',  { duration: 0.5, ease: 'power3.out' });
  const qh = gsap.quickTo(frame, 'height', { duration: 0.5, ease: 'power3.out' });

  const MAGNET = 0.18; // fraction of half-size the frame drifts toward cursor
  let visible = false;
  let activeItem = null;

  function snapTo(el) {
    const r = el.getBoundingClientRect();
    if (!visible) {
      gsap.set(frame, { x: r.left, y: r.top, width: r.width, height: r.height });
      gsap.to(frame, { opacity: 1, duration: 0.18, ease: 'power2.out' });
      visible = true;
    } else {
      qx(r.left); qy(r.top); qw(r.width); qh(r.height);
    }
    activeItem = el;
  }

  function applyMagnet(e) {
    if (!activeItem) return;
    const r = activeItem.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) * MAGNET;
    const dy = (e.clientY - (r.top  + r.height / 2)) * MAGNET;
    qx(r.left + dx);
    qy(r.top  + dy);
  }

  ul.querySelectorAll('.raft-item').forEach(item => {
    item.addEventListener('mouseenter', () => snapTo(item));
    item.addEventListener('mousemove',  applyMagnet);
  });

  ul.addEventListener('mouseleave', () => {
    // Spring back to last item center before fading
    if (activeItem) {
      const r = activeItem.getBoundingClientRect();
      qx(r.left); qy(r.top);
    }
    gsap.to(frame, { opacity: 0, duration: 0.22, ease: 'power2.in' });
    visible = false;
    activeItem = null;
  });
})();

// "SCROLL TO DISCOVER" cursor label — mouse follow + fade out on scroll
(function () {
  const label = document.getElementById('cursor-label');
  if (!label) return;

  document.addEventListener('mousemove', e => {
    gsap.set(label, { x: e.clientX, y: e.clientY });
  });

  ScrollTrigger.create({
    trigger: '#otter-unique-section',
    start: 'top bottom',
    once: true,
    onEnter: () => gsap.to(label, { opacity: 0, duration: 0.4, ease: 'power2.out', pointerEvents: 'none' }),
  });
})();

// Facts section — padding + border-radius collapse on scroll
(function () {
  const section = document.getElementById('facts-section');
  const inner   = document.getElementById('facts-inner');
  if (!section || !inner) return;

  gsap.fromTo(section,
    { padding: '6rem' },
    {
      padding: '0rem',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end:   'top 20%',
        scrub: 1.2,
      },
    }
  );

  gsap.fromTo(inner,
    { borderRadius: '0.25rem' },
    {
      borderRadius: '0rem',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end:   'top 20%',
        scrub: 1.2,
      },
    }
  );
})();


// Fact cards — proximity-based push on hover
(function () {
  const container = document.getElementById('fact-cards');
  if (!container) return;
  const cards = Array.from(container.querySelectorAll('.fact-card'));

  const BASE = 170; // px adjacent card is pushed

  cards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      cards.forEach((other, j) => {
        if (j === i) {
          gsap.to(other, { x: 0, y: -22, scale: 1.22, duration: 0.5, ease: 'power3.out', zIndex: 20 });
        } else {
          const dir  = j < i ? -1 : 1;
          const dist = BASE / Math.abs(j - i); // adjacent = BASE, further = BASE/2, BASE/3…
          gsap.to(other, { x: dir * dist, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', zIndex: +other.style.zIndex || 1 });
        }
      });
    });
  });

  // Reset only when leaving the whole container, so card-to-card is seamless
  container.addEventListener('mouseleave', () => {
    cards.forEach(other => {
      gsap.to(other, { x: 0, y: 0, scale: 1, duration: 0.55, ease: 'power3.inOut', zIndex: +other.style.zIndex || 1 });
    });
  });
})();

// Facts section background colour transition on scroll
(function () {
  const section = document.getElementById('facts-section');
  const trigger = document.getElementById('facts-second');
  if (!section || !trigger) return;

  gsap.to(section, {
    backgroundColor: '#459DE5',
    ease: 'none',
    scrollTrigger: {
      trigger: trigger,
      start: 'top 80%',
      end:   'top 20%',
      scrub: 1.5,
    },
  });
})();

// Initialize Lenis
const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Infinite scroll loop — fade to black, teleport, fade back in
(function () {
  function maxScroll() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  // Full-screen transition overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'background:#040B11',
    'z-index:99998', 'opacity:0', 'pointer-events:none',
    'transition:opacity 0.35s ease',
  ].join(';');
  document.body.appendChild(overlay);

  const FADE = 350;  // ms fade duration (must match transition above)
  const BUFFER = 60; // px from edge to trigger
  let jumping = false;

  function jump(target) {
    if (jumping) return;
    jumping = true;

    overlay.style.opacity = '1';

    setTimeout(() => {
      lenis.scrollTo(target, { immediate: true });
      ScrollTrigger.update();

      // Small pause at black so the new position settles
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => { jumping = false; }, FADE);
      }, 80);
    }, FADE);
  }

  // Forward: end → start
  lenis.on('scroll', ({ scroll, direction }) => {
    if (direction > 0 && scroll >= maxScroll() - BUFFER) jump(0);
  });

  // Backward: start → end
  window.addEventListener('wheel', (e) => {
    if (e.deltaY < 0 && lenis.scroll <= BUFFER) jump(maxScroll());
  }, { passive: true });

  // Touch backward
  let touchY = 0;
  window.addEventListener('touchstart', (e) => { touchY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if ((touchY - e.changedTouches[0].clientY) < -40 && lenis.scroll <= BUFFER) jump(maxScroll());
  }, { passive: true });
})();

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



(function () {
  const frameCount = 51;
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

  const state = { frame: 0 };
  if (frames[0].complete) drawFrame(0);
  else frames[0].onload = () => drawFrame(0);
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

  const tl = gsap.timeline({ scrollTrigger: scrollConfig });
  // Canvas starts and ends centered so the loop is seamless
  gsap.set(canvas, { x: 0, scale: 1 });

  // Gentle sine-wave bob on y, independent of scroll
  const bobCenter = window.innerHeight * 0.10;
  gsap.fromTo(canvas,
    { y: bobCenter - 18 },
    { y: bobCenter + 18, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' }
  );

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