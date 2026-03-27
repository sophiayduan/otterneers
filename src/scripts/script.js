import Lenis from 'lenis'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Draggable } from 'gsap/Draggable';
import { TextHoverEffect } from './text-hover.js';

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable);

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

  // Transfer CSS rotate into GSAP so it's preserved in every tween
  const rots = cards.map(card => {
    const deg = parseFloat(card.style.rotate) || 0;
    gsap.set(card, { rotation: deg });
    card.style.removeProperty('rotate');
    return deg;
  });

  const BASE = 170;

  cards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      cards.forEach((other, j) => {
        if (j === i) {
          gsap.to(other, { x: 0, y: -20, scale: 1.18, rotation: rots[j], duration: 0.08, ease: 'power4.out', zIndex: 20 });
        } else {
          const dir  = j < i ? -1 : 1;
          const dist = BASE / Math.abs(j - i);
          gsap.to(other, { x: dir * dist, y: 0, scale: 1, rotation: rots[j], duration: 0.08, ease: 'power4.out', zIndex: +other.style.zIndex || 1 });
        }
      });
    });
  });

  container.addEventListener('mouseleave', () => {
    cards.forEach((other, j) => {
      gsap.to(other, { x: 0, y: 0, scale: 1, rotation: rots[j], duration: 0.1, ease: 'power4.inOut', zIndex: +other.style.zIndex || 1 });
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

// Drag-card — cursor follower + GSAP Draggable to reveal button behind
(function () {
  const card  = document.getElementById('drag-card');
  const label = document.getElementById('drag-label');
  if (!card || !label) return;

  let mx = 0, my = 0, cx = 0, cy = 0;
  let hovering = false, dragging = false;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  card.addEventListener('mouseenter', () => {
    if (dragging) return;
    hovering = true;
    gsap.to(label, { opacity: 1, duration: 0.2 });
  });
  card.addEventListener('mouseleave', () => {
    hovering = false;
    gsap.to(label, { opacity: 0, duration: 0.2 });
  });

  (function loop() {
    requestAnimationFrame(loop);
    cx += (mx + 18 - cx) * 0.1;
    cy += (my - 28  - cy) * 0.1;
    label.style.transform = `translate(${cx}px,${cy}px)`;
  })();

  Draggable.create(card, {
    type: 'x,y',
    onPress() {
      dragging = true;
      gsap.to(label, { opacity: 0, duration: 0.15 });
      gsap.to(card, { cursor: 'grabbing' });
    },
    onRelease() {
      dragging = false;
      if (hovering) gsap.to(label, { opacity: 1, duration: 0.2 });
    },
  });
})();

// Initialize Lenis
const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Sequence — declared at module scope so the loop can share state
const seqCanvas   = document.getElementById('frame-canvas');
const seqCtx      = seqCanvas.getContext('2d');
const FRAME_COUNT = 51;
const HERO_FRAME  = 4; // frame 5, 0-indexed
let   seqFrozen   = false;

(function () {
  function resize() {
    seqCanvas.width  = window.innerWidth;
    seqCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
})();

const seqFrames = Array.from({ length: FRAME_COUNT }, (_, i) => {
  const img = new Image();
  img.src = `/sequence/frame${i + 1}.png`;
  return img;
});

function drawSeqFrame(index) {
  const img = seqFrames[index];
  if (!img.complete) return;
  seqCtx.clearRect(0, 0, seqCanvas.width, seqCanvas.height);
  const scale = Math.min(seqCanvas.width / img.naturalWidth, seqCanvas.height / img.naturalHeight);
  const w = img.naturalWidth  * scale;
  const h = img.naturalHeight * scale;
  seqCtx.drawImage(img, (seqCanvas.width - w) / 2, (seqCanvas.height - h) / 2, w, h);
}

const seqState = { frame: HERO_FRAME };
if (seqFrames[HERO_FRAME].complete) drawSeqFrame(HERO_FRAME);
else seqFrames[HERO_FRAME].onload = () => drawSeqFrame(HERO_FRAME);

const seqScrollConfig = {
  trigger: '#sequence-container',
  start: 'top top',
  end: 'bottom bottom',
  scrub: 0.2,
};

// Hold at frame 5 for the first 20 % of the sequence scroll, then animate to end
gsap.timeline({ scrollTrigger: seqScrollConfig })
  .to(seqState, {
    frame: HERO_FRAME, duration: 0.2, ease: 'none',
    onUpdate() { if (!seqFrozen) drawSeqFrame(Math.round(seqState.frame)); },
  })
  .to(seqState, {
    frame: FRAME_COUNT - 1, duration: 0.8, ease: 'none',
    onUpdate() { if (!seqFrozen) drawSeqFrame(Math.round(seqState.frame)); },
  });

gsap.set(seqCanvas, { x: 0, scale: 1 });

// Gentle sine-wave bob on y, independent of scroll
const bobCenter = window.innerHeight * 0.10;
gsap.fromTo(seqCanvas,
  { y: bobCenter - 18 },
  { y: bobCenter + 18, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' }
);

// Seamless infinite scroll loop
(function () {
  function maxScroll() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  const BUFFER = 60;
  let jumping  = false;
  let reversing = false;

  // Forward: end → start
  // The canvas fades briefly to mask the jump — much less jarring than a full overlay
  function jumpToStart() {
    if (jumping || reversing) return;
    jumping = true;
    seqFrozen = true;
    gsap.to(seqCanvas, {
      opacity: 0, duration: 0.18, ease: 'power2.in',
      onComplete() {
        lenis.scrollTo(0, { immediate: true });
        ScrollTrigger.update();
        requestAnimationFrame(() => {
          gsap.to(seqCanvas, {
            opacity: 1, duration: 0.18, ease: 'power2.out',
            onComplete() { seqFrozen = false; jumping = false; },
          });
        });
      },
    });
  }

  // Backward: start → end
  // Play canvas backward from frame 5 → 1 while fading out the hero overlay,
  // then jump to the end once the canvas is at its earliest (darkest) frame.
  function jumpToEnd() {
    if (jumping || reversing) return;
    reversing = true;
    lenis.stop();
    seqFrozen = true;

    const heroEls = [...document.querySelectorAll('#hero, #rock-scene')];
    gsap.to(heroEls, { opacity: 0, duration: 0.5, ease: 'power2.in' });

    gsap.to(seqState, {
      frame: 0,
      duration: 0.7,
      ease: 'power2.in',
      onUpdate() { drawSeqFrame(Math.round(seqState.frame)); },
      onComplete() {
        lenis.start();
        lenis.scrollTo(maxScroll(), { immediate: true });
        ScrollTrigger.update();
        // Hero is now off-screen; restore opacity for when user loops back
        gsap.set(heroEls, { opacity: 1 });
        requestAnimationFrame(() => { seqFrozen = false; reversing = false; });
      },
    });
  }

  // Forward trigger
  lenis.on('scroll', ({ scroll, direction }) => {
    if (direction > 0 && scroll >= maxScroll() - BUFFER) jumpToStart();
  });

  // Backward trigger — wheel
  window.addEventListener('wheel', (e) => {
    if (e.deltaY < 0 && lenis.scroll <= BUFFER) jumpToEnd();
  }, { passive: true });

  // Backward trigger — touch
  let touchY = 0;
  window.addEventListener('touchstart', (e) => { touchY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if ((touchY - e.changedTouches[0].clientY) < -40 && lenis.scroll <= BUFFER) jumpToEnd();
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