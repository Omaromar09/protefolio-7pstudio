const fs = require('fs');
const path = require('path');

// 1. Gallery Carousel
const galleryPath = path.join(__dirname, '../src/motion/galleryCarousel.js');
const galleryCode = `import gsap from 'gsap';
import { translations, getLanguage } from '../utils/i18n.js';

export class GalleryCarousel {
  constructor(containerElement) {
    this.container = containerElement;
    this.cards = Array.from(this.container.querySelectorAll('.gallery-stack-card'));
    this.dots = Array.from(document.querySelectorAll('.gallery-dot'));
    this.btnPrev = document.getElementById('gallery-prev-btn');
    this.btnNext = document.getElementById('gallery-next-btn');
    this.captionEl = document.getElementById('gallery-active-caption');

    this.currentIndex = 0;
    this.totalCards = this.cards.length;
    this.isAnimating = false;

    this.startX = 0;
    this.startY = 0;

    this.init();
  }

  init() {
    this.updateStackPositions(false);
    this.bindEvents();
    this.updateCaption();

    window.addEventListener('languageChanged', () => {
      this.updateCaption();
    });
  }

  bindEvents() {
    if (this.btnNext) {
      this.btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        this.next();
      });
    }

    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        this.prev();
      });
    }

    this.dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        if (this.isAnimating || idx === this.currentIndex) return;
        this.goTo(idx);
      });
    });

    this.container.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      if (e.changedTouches.length > 0) {
        const dx = e.changedTouches[0].clientX - this.startX;
        const dy = e.changedTouches[0].clientY - this.startY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
          const isRTL = document.documentElement.dir === 'rtl';
          if (dx < 0) {
            isRTL ? this.prev() : this.next();
          } else {
            isRTL ? this.next() : this.prev();
          }
        }
      }
    }, { passive: true });

    let isMouseDown = false;
    let mouseStartX = 0;

    this.container.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      mouseStartX = e.clientX;
    });

    window.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const dx = e.clientX - mouseStartX;
      if (Math.abs(dx) > 40) {
        const isRTL = document.documentElement.dir === 'rtl';
        if (dx < 0) {
          isRTL ? this.prev() : this.next();
        } else {
          isRTL ? this.next() : this.prev();
        }
      }
    });

    this.container.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > 25 && !this.isAnimating) {
        if (e.deltaY > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }, { passive: true });
  }

  next() {
    if (this.isAnimating) return;
    this.goTo((this.currentIndex + 1) % this.totalCards);
  }

  prev() {
    if (this.isAnimating) return;
    this.goTo((this.currentIndex - 1 + this.totalCards) % this.totalCards);
  }

  goTo(targetIndex) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const oldCard = this.cards[this.currentIndex];
    this.currentIndex = targetIndex;

    gsap.to(oldCard, {
      y: -60,
      scale: 1.08,
      rotationX: 18,
      opacity: 0,
      filter: 'blur(6px)',
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        this.updateStackPositions(true);
        this.updateCaption();
        this.updateDots();
        this.isAnimating = false;
      }
    });
  }

  updateStackPositions(animate = true) {
    this.cards.forEach((card, idx) => {
      const relIdx = (idx - this.currentIndex + this.totalCards) % this.totalCards;

      if (relIdx === 0) {
        if (animate) {
          gsap.fromTo(card,
            { y: 30, scale: 0.92, opacity: 0.7, filter: 'blur(4px)' },
            { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', zIndex: 10, duration: 0.45, ease: 'expo.out' }
          );
        } else {
          gsap.set(card, { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', zIndex: 10 });
        }
      } else if (relIdx === 1) {
        gsap.to(card, {
          y: 18,
          scale: 0.94,
          opacity: 0.85,
          filter: 'blur(1px)',
          zIndex: 8,
          duration: animate ? 0.45 : 0,
          ease: 'expo.out'
        });
      } else if (relIdx === 2) {
        gsap.to(card, {
          y: 34,
          scale: 0.88,
          opacity: 0.65,
          filter: 'blur(2px)',
          zIndex: 6,
          duration: animate ? 0.45 : 0,
          ease: 'expo.out'
        });
      } else {
        gsap.to(card, {
          y: 45,
          scale: 0.82,
          opacity: 0,
          filter: 'blur(4px)',
          zIndex: 1,
          duration: animate ? 0.35 : 0
        });
      }
    });
  }

  updateDots() {
    this.dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === this.currentIndex);
    });
  }

  updateCaption() {
    const lang = getLanguage();
    const list = translations[lang]?.photoCaptions || translations.ar.photoCaptions;
    if (this.captionEl && list[this.currentIndex]) {
      gsap.to(this.captionEl, {
        opacity: 0,
        y: 4,
        duration: 0.15,
        onComplete: () => {
          this.captionEl.textContent = list[this.currentIndex];
          gsap.to(this.captionEl, { opacity: 1, y: 0, duration: 0.25 });
        }
      });
    }
  }
}
`;
fs.writeFileSync(galleryPath, galleryCode, 'utf8');
console.log('Successfully written galleryCarousel.js!');

// 2. UI Interactions
const interactionsPath = path.join(__dirname, '../src/motion/interactions.js');
const interactionsCode = `import gsap from 'gsap';
import Lenis from 'lenis';
import { getLanguage, translations } from '../utils/i18n.js';

let lenisInstance = null;

export function initSmoothScroll() {
  lenisInstance = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.5,
    infinite: false
  });

  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenisInstance;
}

export function initMagneticButtons() {
  const magneticEls = document.querySelectorAll('.btn, .magnetic-target');

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });
}

export function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast-notice');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-copy-target');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const textToCopy = targetEl.textContent.trim();

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast();
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast();
      }
    });
  });

  function showToast() {
    if (!toast) return;
    const lang = getLanguage();
    const msg = translations[lang]?.copiedToast || translations.ar.copiedToast;
    toast.textContent = msg;

    toast.classList.add('is-visible');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2400);
  }
}

export function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

export function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const drawer = document.getElementById('mobile-nav-drawer');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!drawer) return;

  const toggle = (open) => {
    drawer.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (openBtn) openBtn.addEventListener('click', () => toggle(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));

  links.forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });
}

export function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });
}
`;
fs.writeFileSync(interactionsPath, interactionsCode, 'utf8');
console.log('Successfully written interactions.js!');
