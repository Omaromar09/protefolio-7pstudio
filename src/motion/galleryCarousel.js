import gsap from 'gsap';
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
