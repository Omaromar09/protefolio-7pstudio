import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function initSmoothScroll() {
  const isTouchOrMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 1024;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // On touch/mobile/tablet devices, native OS momentum scroll is 120fps hardware accelerated.
  // We completely bypass Lenis touch hijacking to eliminate freezing & scroll stutter.
  if (isTouchOrMobile) {
    window.addEventListener('scroll', () => {
      const progressEl = document.getElementById('scroll-progress');
      if (progressEl) {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        progressEl.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      }
    }, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            e.preventDefault();
            const top = targetElement.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      });
    });

    document.querySelectorAll('.footer-back-to-top, .back-to-top-btn, #floating-back-top').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    return null;
  }

  lenisInstance = new Lenis({
    duration: prefersReducedMotion ? 0.1 : 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: !prefersReducedMotion,
    wheelMultiplier: 1,
    touchMultiplier: 0,
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
    if (lenisInstance) {
      lenisInstance.raf(time * 1000);
    }
  });

  gsap.ticker.lagSmoothing(500, 33);

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
            duration: 1.1
          });
        }
      }
    });
  });

  // Setup back to top buttons
  document.querySelectorAll('.footer-back-to-top, .back-to-top-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      lenisInstance.scrollTo(0, { duration: 1.2 });
    });
  });

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}
