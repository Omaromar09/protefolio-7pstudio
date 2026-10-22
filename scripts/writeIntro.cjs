const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/intro/masterIntro.js');

const code = `import gsap from 'gsap';
import { getLanguage } from '../utils/i18n.js';

export class MasterIntro {
  constructor(options = {}) {
    this.onComplete = options.onComplete || (() => {});
    this.masterTL = null;
    this.hasCompleted = false;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.introStage = document.getElementById('intro-stage');
    this.skipBtn = document.getElementById('skip-intro-btn');
    this.introDot = document.getElementById('intro-dot');
    this.introRing = document.getElementById('intro-ring');
    this.introPill = document.getElementById('intro-pill');
    this.pillAvatars = document.querySelectorAll('.intro-pill-avatar');
    this.headlineBox = document.getElementById('intro-headline');
    this.wordRollerInner = document.getElementById('intro-word-roller-inner');
    this.meetBox = document.getElementById('intro-meet');
    this.wheelBox = document.getElementById('intro-wheel');
    this.wheelTrack = document.getElementById('intro-wheel-track');
    this.targetCard = document.getElementById('intro-landing-card');
    this.checkBadge = document.getElementById('intro-check-badge');

    this.siteHeader = document.querySelector('.site-header');
    this.heroContent = document.querySelector('.hero-content');
    this.heroActions = document.querySelector('.hero-actions');
    this.heroWheelWrapper = document.querySelector('.hero-wheel-wrapper');

    this.init();
  }

  init() {
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem('omar_intro_seen') === 'true';
    } catch (e) {
      console.warn('sessionStorage inaccessible:', e);
    }

    if (alreadySeen || this.isReducedMotion) {
      this.skipToHero();
      return;
    }

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.skipToHero();
      });
    }

    this.buildTimeline();
  }

  buildTimeline() {
    this.masterTL = gsap.timeline({
      paused: false,
      onComplete: () => this.completeIntro()
    });

    const tl = this.masterTL;

    gsap.set(this.introStage, { display: 'flex', pointerEvents: 'none' });
    gsap.set(this.introDot, { scale: 0, opacity: 1 });
    gsap.set(this.introRing, { scale: 1, opacity: 0 });
    gsap.set(this.introPill, { width: 14, height: 14, opacity: 0, scale: 0.8 });
    gsap.set(this.pillAvatars, { scale: 0 });
    gsap.set(this.headlineBox, { opacity: 0, filter: 'blur(14px)', scale: 0.96 });
    gsap.set(this.meetBox, { opacity: 0, filter: 'blur(10px)', y: 25 });
    gsap.set(this.wheelBox, { opacity: 0 });
    gsap.set(this.checkBadge, { scale: 0 });

    if (this.siteHeader) gsap.set(this.siteHeader, { y: -100, clipPath: 'inset(0 0 100% 0)' });
    if (this.heroContent) gsap.set(this.heroContent, { clipPath: 'inset(0 0 100% 0)', y: 20 });
    if (this.heroActions) gsap.set(this.heroActions, { scale: 0.9, opacity: 0 });

    const cardHeight = this.targetCard ? this.targetCard.offsetHeight || 420 : 420;
    const gap = 20;
    const step = cardHeight + gap;
    const targetY = - (7 * step - (window.innerHeight - cardHeight) / 2);
    const startY = targetY + 3200;

    gsap.set(this.wheelTrack, { y: startY });

    // 0.00 - 0.50s: Orange dot in center + soft pulsing ring
    tl.to(this.introDot, {
      scale: 1,
      duration: 0.35,
      ease: 'back.out(1.8)'
    }, 0.00);

    tl.to(this.introRing, {
      scale: 2.5,
      opacity: 0.85,
      duration: 0.15,
      ease: 'power1.out'
    }, 0.15);

    tl.to(this.introRing, {
      opacity: 0,
      scale: 3.2,
      duration: 0.35,
      ease: 'power2.out'
    }, 0.30);

    // 0.50 - 0.85s: Dot grows into white rounded pill with soft shadow
    tl.to(this.introDot, {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.in'
    }, 0.50);

    tl.to(this.introPill, {
      opacity: 1,
      scale: 1,
      width: 182,
      height: 52,
      duration: 0.35,
      ease: 'expo.out'
    }, 0.50);

    // 0.85 - 1.20s: Small circular avatars (photos 1 to 4) pop into pill
    tl.to(this.pillAvatars, {
      scale: 1,
      duration: 0.22,
      stagger: 0.075,
      ease: 'back.out(1.6)'
    }, 0.85);

    // 1.20 - 2.00s: Pill dissolves, headline blurs in with inline avatars
    tl.to(this.introPill, {
      opacity: 0,
      scale: 0.92,
      duration: 0.28,
      ease: 'power2.in'
    }, 1.20);

    tl.to(this.headlineBox, {
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      duration: 0.55,
      ease: 'power3.out'
    }, 1.30);

    // 2.00 - 3.20s: Word rolls 4 times with vertical roll & motion blur
    const wordStepPercent = 25;
    tl.to(this.wordRollerInner, {
      yPercent: -wordStepPercent * 1,
      duration: 0.28,
      ease: 'power3.inOut',
      onStart: () => gsap.set(this.wordRollerInner, { filter: 'blur(0px 3px)' }),
      onComplete: () => gsap.set(this.wordRollerInner, { filter: 'blur(0px 0px)' })
    }, 2.00);

    tl.to(this.wordRollerInner, {
      yPercent: -wordStepPercent * 2,
      duration: 0.28,
      ease: 'power3.inOut',
      onStart: () => gsap.set(this.wordRollerInner, { filter: 'blur(0px 3px)' }),
      onComplete: () => gsap.set(this.wordRollerInner, { filter: 'blur(0px 0px)' })
    }, 2.35);

    tl.to(this.wordRollerInner, {
      yPercent: -wordStepPercent * 3,
      duration: 0.28,
      ease: 'power3.inOut',
      onStart: () => gsap.set(this.wordRollerInner, { filter: 'blur(0px 3px)' }),
      onComplete: () => gsap.set(this.wordRollerInner, { filter: 'blur(0px 0px)' })
    }, 2.70);

    // 3.20 - 3.50s: Headline blurs & slides out, "قابل عمر." reveals on start side
    tl.to(this.headlineBox, {
      opacity: 0,
      filter: 'blur(12px)',
      y: -25,
      duration: 0.30,
      ease: 'power2.in'
    }, 3.20);

    tl.to(this.meetBox, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      duration: 0.30,
      ease: 'power2.out'
    }, 3.20);

    // 3.30 - 5.00s: Vertical Photo Wheel scrolls fast with vertical blur,
    // decelerates exponentially and STOPS at EXACTLY t = 5.00s on photo-2
    tl.to(this.wheelBox, {
      opacity: 1,
      duration: 0.20,
      ease: 'power1.out'
    }, 3.30);

    tl.to(this.wheelTrack, {
      y: targetY,
      duration: 1.70,
      ease: 'power4.out',
      onStart: () => gsap.set(this.wheelTrack, { filter: 'blur(0px 10px)' })
    }, 3.30);

    tl.to(this.wheelTrack, {
      filter: 'blur(0px 0px)',
      duration: 0.35,
      ease: 'power2.out'
    }, 4.65);

    // 5.00s: Stopped card (photo-2) gets 3px orange border + orange check badge
    tl.call(() => {
      if (this.targetCard) {
        this.targetCard.classList.add('is-selected');
      }
    }, null, 5.00);

    tl.to(this.checkBadge, {
      scale: 1,
      duration: 0.26,
      ease: 'back.out(2.2)'
    }, 5.02);

    // 5.30 - 6.00s: Seamless Hand-off
    tl.to(this.meetBox, {
      opacity: 0,
      y: -15,
      filter: 'blur(6px)',
      duration: 0.35,
      ease: 'power2.in'
    }, 5.30);

    if (this.siteHeader) {
      tl.to(this.siteHeader, {
        y: 0,
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.50,
        ease: 'power3.out'
      }, 5.35);
    }

    if (this.heroContent) {
      tl.to(this.heroContent, {
        y: 0,
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.55,
        ease: 'power3.out'
      }, 5.40);
    }

    if (this.heroActions) {
      tl.to(this.heroActions, {
        scale: 1,
        opacity: 1,
        duration: 0.40,
        ease: 'back.out(1.4)'
      }, 5.50);
    }

    if (this.skipBtn) {
      tl.to(this.skipBtn, {
        opacity: 0,
        duration: 0.25,
        pointerEvents: 'none'
      }, 5.60);
    }
  }

  skipToHero() {
    if (this.hasCompleted) return;

    if (this.masterTL) {
      this.masterTL.seek(6.0);
    }

    this.completeIntro();
  }

  completeIntro() {
    if (this.hasCompleted) return;
    this.hasCompleted = true;

    try {
      sessionStorage.setItem('omar_intro_seen', 'true');
    } catch (e) {
      console.warn('sessionStorage inaccessible:', e);
    }

    if (this.introStage) {
      this.introStage.classList.add('is-hidden');
    }
    if (this.skipBtn) {
      this.skipBtn.style.display = 'none';
    }

    if (this.siteHeader) {
      gsap.set(this.siteHeader, { y: 0, clipPath: 'inset(0 0 0% 0)', opacity: 1 });
    }
    if (this.heroContent) {
      gsap.set(this.heroContent, { y: 0, clipPath: 'inset(0 0 0% 0)', opacity: 1 });
    }
    if (this.heroActions) {
      gsap.set(this.heroActions, { scale: 1, opacity: 1 });
    }

    this.onComplete();
  }
}
`;

fs.writeFileSync(targetPath, code, 'utf8');
console.log('Successfully written masterIntro.js!');
