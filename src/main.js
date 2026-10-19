import './style.css';
import { DeterministicIntro } from './intro/deterministicIntro.js';
import { initLanguage, getLanguage, setLanguage } from './utils/i18n.js';
import { initTheme } from './utils/theme.js';
import { initSmoothScroll } from './motion/scroll.js';
import { initCustomCursor } from './motion/cursor.js';
import { initScrollAnimations } from './motion/animations.js';
import { initProjectPopovers } from './motion/popovers.js';
import { showToast } from './utils/toast.js';
import { fireSuccessConfetti } from './utils/confetti.js';
import { initAudio, toggleAudio, getAudioState } from './intro/soundSynth.js';
import gsap from 'gsap';

// ==========================================================================
// 1. APPLICATION BOOTSTRAP
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Bilingual Language System (Arabic Default)
  initLanguage();

  // Initialize Light / Dark Theme Switcher
  initTheme();

  // Initialize Smooth Scrolling & Lenis
  initSmoothScroll();

  // Initialize Custom Cursor & Magnetic Elements
  initCustomCursor();

  // Initialize Scroll-Triggered Animations & 3D Tilt
  initScrollAnimations();

  // Initialize Interactive Partner Project Popovers
  initProjectPopovers();

  // Setup Sound Controls & Synthesizer
  setupSoundControls();

  // Setup 3D Scenes (Hero Centerpiece + Skills Constellation)
  setup3DScenes();

  // Setup Deterministic 3-Second Welcome Intro
  setupIntroFlow();

  // Setup Project Filtering
  setupProjectFilters();

  // Setup Interactive Controls & Contact Form
  setupInteractiveControls();

  // Setup Mobile Navigation Drawer
  setupMobileNav();
});

// ==========================================================================
// 2. 3D SCENES SETUP (Deferred & Lazy Loaded for Zero TBT & 90+ PageSpeed)
// ==========================================================================
let heroSceneInstance = null;
let skillsSceneInstance = null;
let heroLoaded = false;
let skillsLoaded = false;

export async function ensureHeroSceneLoaded() {
  if (heroLoaded) return;
  const heroCanvas = document.getElementById('hero-3d-canvas');
  if (!heroCanvas) return;
  heroLoaded = true;

  try {
    const { HeroScene } = await import('./3d/heroScene.js');
    heroSceneInstance = new HeroScene(heroCanvas);

    window.addEventListener('scroll', () => {
      if (heroSceneInstance) {
        const progress = Math.min(window.scrollY / window.innerHeight, 1.5);
        heroSceneInstance.setScroll(progress);
      }
    }, { passive: true });
  } catch (err) {
    console.warn('Hero 3D lazy load skipped or failed:', err);
  }
}

function setup3DScenes() {
  const heroCanvas = document.getElementById('hero-3d-canvas');
  if (heroCanvas) {
    // 1. Initialize immediately upon first user interaction (scroll, touch, move, click)
    const onUserInteraction = () => {
      ensureHeroSceneLoaded();
      ['scroll', 'touchstart', 'mousemove', 'click', 'keydown'].forEach(evt => {
        window.removeEventListener(evt, onUserInteraction);
      });
    };
    ['scroll', 'touchstart', 'mousemove', 'click', 'keydown'].forEach(evt => {
      window.addEventListener(evt, onUserInteraction, { once: true, passive: true });
    });

    // 2. Idle fallback: load only after the main thread is completely idle (prevents TBT blocking)
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        setTimeout(ensureHeroSceneLoaded, 1800);
      }, { timeout: 3500 });
    } else {
      setTimeout(ensureHeroSceneLoaded, 2200);
    }
  }

  // About Skills 3D Constellation - Lazy load via IntersectionObserver when scrolled near
  const skillsCanvas = document.getElementById('skills-canvas');
  if (skillsCanvas) {
    const skillsObserver = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && !skillsLoaded) {
        skillsLoaded = true;
        skillsObserver.disconnect();

        try {
          const { SkillsScene } = await import('./3d/skillsScene.js');
          skillsSceneInstance = new SkillsScene(skillsCanvas);

          const skillTags = document.querySelectorAll('.skill-tag');
          skillTags.forEach((tag) => {
            const skillName = tag.getAttribute('data-skill') || tag.innerText;
            tag.addEventListener('mouseenter', () => {
              if (skillsSceneInstance) skillsSceneInstance.highlightSkill(skillName);
            });
            tag.addEventListener('mouseleave', () => {
              if (skillsSceneInstance) skillsSceneInstance.resetHighlights();
            });
          });
        } catch (err) {
          console.warn('Skills 3D lazy load skipped or failed:', err);
        }
      }
    }, { rootMargin: '300px' });

    skillsObserver.observe(skillsCanvas);
  }
}

// ==========================================================================
// 3. SOUND SYNTHESIZER & CONTROLS
// ==========================================================================
function setupSoundControls() {
  const introSoundToggle = document.getElementById('intro-sound-toggle');
  const navSoundToggle = document.getElementById('nav-sound-toggle');
  const introSoundIcon = document.getElementById('intro-sound-icon');
  const introSoundText = document.getElementById('intro-sound-text');
  const navSoundIcon = document.getElementById('nav-sound-icon');

  // Resume Web Audio context safely on first user gesture
  const unlockAudio = () => {
    initAudio();
  };
  ['click', 'keydown', 'touchstart'].forEach(evt => window.addEventListener(evt, unlockAudio, { once: true }));

  function updateSoundUI(isOn) {
    if (introSoundIcon) {
      introSoundIcon.className = isOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    }
    if (introSoundText) {
      introSoundText.textContent = isOn ? 'SOUND ON' : 'SOUND OFF';
    }
    if (navSoundIcon) {
      navSoundIcon.className = isOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    }
    if (navSoundToggle) {
      navSoundToggle.classList.toggle('is-on', isOn);
      navSoundToggle.setAttribute('title', isOn ? 'Sound: On' : 'Sound: Off');
    }
    if (introSoundToggle) {
      introSoundToggle.classList.toggle('is-muted', !isOn);
    }
  }

  const handleToggle = () => {
    const newState = toggleAudio();
    updateSoundUI(newState);
  };

  if (introSoundToggle) introSoundToggle.addEventListener('click', handleToggle);
  if (navSoundToggle) navSoundToggle.addEventListener('click', handleToggle);

  updateSoundUI(getAudioState());
}

// ==========================================================================
// 4. DETERMINISTIC 3-SECOND INTRO & ORANGE HAND-OFF
// ==========================================================================
let introInstance = null;

function setupIntroFlow() {
  const introScreen = document.getElementById('intro-screen');
  const introCanvas = document.getElementById('intro-canvas');
  const skipBtn = document.getElementById('intro-skip');
  const replayBtn = document.getElementById('replay-intro-btn');
  const orangeHandoff = document.getElementById('orange-handoff-overlay');

  if (!introScreen || !introCanvas) return;

  // Initialize Deterministic Intro instance unconditionally so replay always works
  introInstance = new DeterministicIntro(introCanvas, {
    getLang: () => getLanguage(),
    onComplete: () => {
      executeOrangeHandoff(introScreen, orangeHandoff);
    }
  });

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      if (introInstance) {
        introInstance.skip();
      }
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      initAudio();
      window.scrollTo({ top: 0, behavior: 'instant' });
      sessionStorage.removeItem('omar_intro_seen');

      if (orangeHandoff) {
        orangeHandoff.classList.remove('active');
        orangeHandoff.style.clipPath = '';
        orangeHandoff.style.transform = '';
      }

      introScreen.style.opacity = '1';
      introScreen.classList.remove('is-hidden');
      if (introInstance) {
        introInstance.start();
      }
    });
  }

  const hasSeenIntro = sessionStorage.getItem('omar_intro_seen');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hasSeenIntro === 'true' || prefersReducedMotion) {
    introScreen.classList.add('is-hidden');
    triggerHeroReveal();
  } else {
    introInstance.start();
  }
}

function executeOrangeHandoff(introScreen, orangeHandoff) {
  sessionStorage.setItem('omar_intro_seen', 'true');

  if (orangeHandoff) {
    // 1. Activate flat overlay
    orangeHandoff.classList.add('active');
    orangeHandoff.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
    orangeHandoff.style.transform = 'translateY(0%)';

    // 2. Hide intro canvas screen
    introScreen.classList.add('is-hidden');

    // 3. Trigger shape wipe: panel sweeps up / contracts vertically
    gsap.to(orangeHandoff, {
      clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
      duration: 0.75,
      ease: 'power3.inOut',
      onComplete: () => {
        orangeHandoff.classList.remove('active');
      }
    });
  } else {
    introScreen.classList.add('is-hidden');
  }

  // 4. Reveal hero content picking up from the wipe
  triggerHeroReveal();
}

function triggerHeroReveal() {
  ensureHeroSceneLoaded();
  const heroContent = document.querySelector('.hero-content');
  const hero3d = document.querySelector('.hero-3d-wrap');

  if (heroContent) {
    gsap.from(heroContent.children, {
      y: 40,
      opacity: 0,
      duration: 0.85,
      stagger: 0.12,
      ease: 'power3.out',
      clearProps: 'all'
    });
  }

  if (hero3d) {
    gsap.from(hero3d, {
      scale: 0.85,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2,
      clearProps: 'all'
    });
  }
}

// ==========================================================================
// 4. PROJECT CATEGORY FILTERING
// ==========================================================================
function setupProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          gsap.to(card, {
            display: 'flex',
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out'
          });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.95,
            y: 15,
            duration: 0.35,
            ease: 'power2.in',
            onComplete: () => {
              card.style.display = 'none';
            }
          });
        }
      });
    });
  });
}

// ==========================================================================
// 6. INTERACTIVE CONTROLS & CONTACT FORM
// ==========================================================================
function setupInteractiveControls() {
  // One-click copy buttons
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      if (text) {
        try {
          await navigator.clipboard.writeText(text);
          const msg = getLanguage() === 'ar' ? `تم نسخ "${text}" بنجاح!` : `Copied "${text}" to clipboard!`;
          showToast(msg, '✓');
        } catch (err) {
          const temp = document.createElement('textarea');
          temp.value = text;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
          const msg = getLanguage() === 'ar' ? `تم نسخ "${text}" بنجاح!` : `Copied "${text}" to clipboard!`;
          showToast(msg, '✓');
        }
      }
    });
  });

  // Contact Form Submission
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value;
      const contact = document.getElementById('form-contact').value;
      const service = document.getElementById('form-service').options[document.getElementById('form-service').selectedIndex].text;
      const message = document.getElementById('form-message').value;

      fireSuccessConfetti();

      const successToast = getLanguage() === 'ar'
        ? `شكراً ليك يا ${name}! تم استلام رسالتك وهرد عليك فوراً.`
        : `Thank you, ${name}! Your message has been received.`;
      showToast(successToast, '🚀');

      const encodedMsg = encodeURIComponent(
        `أهلاً يا عمر، أنا ${name} (${contact}).\nالخدمة المطلوبة: ${service}\nالتفاصيل: ${message}`
      );

      setTimeout(() => {
        const confirmText = getLanguage() === 'ar'
          ? 'تحب تفتح الواتساب دلوقتي وتتكلم مع عمر مباشرة؟'
          : 'Would you like to open WhatsApp to chat with Omar right now?';
        const confirmWa = confirm(confirmText);
        if (confirmWa) {
          window.open(`https://wa.me/201221576360?text=${encodedMsg}`, '_blank');
        }
      }, 800);

      contactForm.reset();
    });
  }

  // Floating Back-to-Top Button & Footer Back-to-Top
  const floatingBackTop = document.getElementById('floating-back-top');
  const footerBackTop = document.querySelector('.footer-back-to-top');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (floatingBackTop) {
    floatingBackTop.addEventListener('click', scrollToTop);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 380) {
        floatingBackTop.classList.add('is-visible');
      } else {
        floatingBackTop.classList.remove('is-visible');
      }
    }, { passive: true });
  }

  if (footerBackTop) {
    footerBackTop.addEventListener('click', scrollToTop);
  }
}

// ==========================================================================
// 7. MOBILE NAVIGATION DRAWER
// ==========================================================================
function setupMobileNav() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, #mobile-cta-btn');

  if (!menuToggle || !mobileNav) return;

  const toggleNav = () => {
    menuToggle.classList.toggle('is-active');
    mobileNav.classList.toggle('is-open');
    document.body.style.overflow = mobileNav.classList.contains('is-open') ? 'hidden' : '';
  };

  menuToggle.addEventListener('click', toggleNav);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('is-active');
      mobileNav.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
}
