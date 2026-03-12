gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scene",
    start: "top top",
    end: "+=2000",
    scrub: true,
    pin: true,
    invalidateOnRefresh: true,
    onLeave: () => {
      gsap.to(".splash", { autoAlpha: 0, duration: 0.5 });
    },
    onLeaveBack: () => {
      gsap.to(".splash", { autoAlpha: 1, duration: 0.5 });
      
    }
  }
});


tl.to(".c2-scroll", {
  x: 200,
  ease: "none"
}, 0);

tl.to(".c3-scroll", {
  x: -200,
  ease: "none"
}, 0);

tl.to(".rock-r", {
  x: 400,
  scale: 3,
  ease: "none"
}, 0);
tl.to(".grass-r-scroll", {
  x: 400,
  ease: "none",
  scale: 3,
  overwrite: "auto"
}, 0);

tl.to(".rock-l", {
  x: -400,
  scale: 3,
  ease: "none"
}, 0);
tl.to(".grass-l-scroll", {
  x: -400,
  scale: 3,
  ease: "none",
  overwrite: "auto"
}, 0);

tl.fromTo(".boat-container",
  { 
    scale: 0.2,
  },
  {
    scale: 1, 
    ease: "none",
  },
0);

gsap.to(".boat", {
  y: "+=10",
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});
