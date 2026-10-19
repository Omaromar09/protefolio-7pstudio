import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function initSmoothScroll() {
  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  lenisInstance = new Lenis({
    duration: prefersReducedMotion ? 0.1 : 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: !prefersReducedMotion,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Synchronize Lenis with GSAP ScrollTrigger
  lenisInstance.on('scroll', (e) => {
    ScrollTrigger.update();
    
    // Update scroll progress bar
    const progressEl = document.getElementById('scroll-progress');
    if (progressEl) {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (e.scroll / scrollHeight) * 100 : 0;
      progressEl.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  });

  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Setup smooth anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          lenisInstance.scrollTo(targetElement, {
            offset: -70,
            duration: 1.2
          });
        }
      }
    });
  });

  // Setup back to top buttons
  document.querySelectorAll('.footer-back-to-top, .back-to-top-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      lenisInstance.scrollTo(0, { duration: 1.4 });
    });
  });

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}
