import Lenis from 'lenis'
import { gsap } from "gsap";

gsap.registerPlugin(ScrollTrigger) 
const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);


// const repeatPage = (parentEL, total = 0) => {
//   const items = [...parentEl.children];
    

// };
// repeatPage(document.querySelector('.page'), 6)
window.addEventListener('load', () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('#site-heading', {
    x:-200,
    duration:1,
    ease: "power2.out"


  })
    
  gsap.to('.page', {
      backgroundColor: "#DC0000",
      color:"#18171A",
      duration:3,
      ease:"power2.out",
      scrollTrigger: {
          trigger: "#trig",
          start: "center top",
          scrub: 1,
          markers:true,
      },
      markers:true,
  });
})


// gsap.to('#page', {
//   backgroundColor: "#000000",
//   scrollTrigger: {
//     trigger: "#trig",
//     start: "bottom bottom",
//     scrub: 0.25,
//     markers:true,

//    },

// })