import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

/**
 * TextHoverEffect
 *
 * On hover, each character slides up out of frame left-to-right while an
 * aria-hidden duplicate rises up from below into its place.
 * On unhover the motion reverses.
 *
 * Usage:
 *   new TextHoverEffect(document.querySelector('.my-heading'));
 *   new TextHoverEffect('.my-heading', { duration: 0.4, stagger: 0.03 });
 */
export class TextHoverEffect {
  constructor(el, options = {}) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this.el) return;

    this.opts = {
      duration: 0.4,
      stagger:  0.03,
      ease:     'power3.inOut',
      offset:   110, // yPercent travel — slightly over 100 so chars fully leave
      ...options,
    };

    this._setup();
  }

  _setup() {
    const text = this.el.textContent.trim();

    // Turn the element into a clipping container
    gsap.set(this.el, { overflow: 'hidden', display: 'inline-block', position: 'relative' });

    // Two layers: visible original (a) and aria-hidden clone (b)
    this.el.innerHTML =
      `<span class="the-chars-a" style="display:block;">${text}</span>` +
      `<span class="the-chars-b" aria-hidden="true" style="position:absolute;inset:0;display:block;">${text}</span>`;

    this.charsA = new SplitText(this.el.querySelector('.the-chars-a'), { type: 'chars' }).chars;
    this.charsB = new SplitText(this.el.querySelector('.the-chars-b'), { type: 'chars' }).chars;

    // Clone starts below, out of view
    gsap.set(this.charsB, { yPercent: this.opts.offset });

    this.el.addEventListener('mouseenter', () => this._in());
    this.el.addEventListener('mouseleave', () => this._out());
  }

  _in() {
    const { duration, stagger, ease, offset } = this.opts;
    gsap.killTweensOf([...this.charsA, ...this.charsB]);

    // Original chars fly up and out, with a trailing shadow
    gsap.to(this.charsA, {
      yPercent: -offset,
      textShadow: `0 ${offset * 0.18}px ${offset * 0.12}px rgba(0,0,0,0.3)`,
      duration,
      ease,
      stagger: { each: stagger, from: 'start' },
    });

    // Clone chars rise from below into place
    gsap.to(this.charsB, {
      yPercent: 0,
      textShadow: '0 0px 0px rgba(0,0,0,0)',
      duration,
      ease,
      stagger: { each: stagger, from: 'start' },
    });
  }

  _out() {
    const { duration, stagger, ease, offset } = this.opts;
    gsap.killTweensOf([...this.charsA, ...this.charsB]);

    // Original chars return from above back into place
    gsap.to(this.charsA, {
      yPercent: 0,
      textShadow: '0 0px 0px rgba(0,0,0,0)',
      duration,
      ease,
      stagger: { each: stagger, from: 'start' },
    });

    // Clone chars sink back below
    gsap.to(this.charsB, {
      yPercent: offset,
      duration,
      ease,
      stagger: { each: stagger, from: 'start' },
    });
  }
}
