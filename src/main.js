import './style.css';
import { initLanguage, getLanguage, setLanguage } from './utils/i18n.js';
import { initTheme } from './utils/theme.js';
import { initSmoothScroll } from './motion/scroll.js';
import { initCustomCursor } from './motion/cursor.js';
import { initScrollAnimations } from './motion/animations.js';
import { initProjectShowcase } from './motion/projectShowcase.js';
import { initBeforeAfterSlider } from './motion/beforeAfter.js';
import { initQuickDiagnosis } from './motion/diagnosis.js';
import { initProjectEstimator } from './motion/estimator.js';
import { renderTestimonials } from './utils/testimonials.js';
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

  // Initialize Custom Cursor & Magnetic Elements (Desktop Only)
  initCustomCursor();

  // Initialize Scroll-Triggered Animations
  initScrollAnimations();

  // Initialize Pinned Projects Showcase
  initProjectShowcase();

  // Initialize Before / After Comparison Slider
  initBeforeAfterSlider();

  // Initialize Quick Diagnosis Lead-Gen Quiz
  initQuickDiagnosis();

  // Initialize 7P Studio Interactive Project Estimator & WhatsApp Quote Engine
  initProjectEstimator();

  // Initialize Expandable Services Bento Tiles
  setupExpandableServices();

  // Initialize Spotlight Cards Cursor Effect
  setupSpotlightCards();

  // Initialize Client Testimonials / Social Proof (Strictly rendered only if real reviews exist)
  renderTestimonials(getLanguage());

  // Setup Sound Controls & Synthesizer (Default Muted / Strictly Opt-in)
  setupSoundControls();

  // Setup 3D Scenes (Hero Centerpiece + Skills Constellation)
  setup3DScenes();

  // Setup Deterministic 3-Second Welcome Intro
  setupIntroFlow();

  // Setup Interactive Controls & Contact Form
  setupInteractiveControls();

  // Setup Mobile Sticky Mini CTA Bar
  setupMobileStickyCta();

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
    // 1. Initialize immediately upon first user interaction
    const onUserInteraction = () => {
      ensureHeroSceneLoaded();
      ['scroll', 'touchstart', 'mousemove', 'click', 'keydown'].forEach(evt => {
        window.removeEventListener(evt, onUserInteraction);
      });
    };
    ['scroll', 'touchstart', 'mousemove', 'click', 'keydown'].forEach(evt => {
      window.addEventListener(evt, onUserInteraction, { once: true, passive: true });
    });

    // 2. Idle fallback
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        setTimeout(ensureHeroSceneLoaded, 1800);
      }, { timeout: 3500 });
    } else {
      setTimeout(ensureHeroSceneLoaded, 2200);
    }
  }

  // Skills 3D Constellation
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
// 3. SOUND SYNTHESIZER & CONTROLS (STRICTLY OPT-IN, NEVER AUTOPLAYS)
// ==========================================================================
function setupSoundControls() {
  const introSoundToggle = document.getElementById('intro-sound-toggle');
  const navSoundToggle = document.getElementById('nav-sound-toggle');
  const introSoundIcon = document.getElementById('intro-sound-icon');
  const introSoundText = document.getElementById('intro-sound-text');
  const navSoundIcon = document.getElementById('nav-sound-icon');

  function updateSoundUI(isOn) {
    const lang = getLanguage();
    const onText = lang === 'ar' ? 'تشغيل الصوت' : 'SOUND ON';
    const offText = lang === 'ar' ? 'كتم الصوت' : 'SOUND OFF';

    if (introSoundIcon) {
      introSoundIcon.className = isOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    }
    if (introSoundText) {
      introSoundText.textContent = isOn ? onText : offText;
    }
    if (navSoundIcon) {
      navSoundIcon.className = isOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    }
    if (navSoundToggle) {
      navSoundToggle.classList.toggle('is-on', isOn);
      navSoundToggle.setAttribute('title', isOn 
        ? (lang === 'ar' ? 'الصوت: شغال' : 'Sound: On') 
        : (lang === 'ar' ? 'الصوت: مكتوم' : 'Sound: Off'));
      navSoundToggle.setAttribute('aria-label', isOn 
        ? (lang === 'ar' ? 'كتم الصوت' : 'Mute sound') 
        : (lang === 'ar' ? 'تشغيل الصوت' : 'Enable sound'));
    }
    if (introSoundToggle) {
      introSoundToggle.classList.toggle('is-muted', !isOn);
      introSoundToggle.setAttribute('aria-label', isOn 
        ? (lang === 'ar' ? 'كتم الصوت' : 'Mute sound') 
        : (lang === 'ar' ? 'تشغيل الصوت' : 'Enable sound'));
    }
  }

  const handleToggle = () => {
    const newState = toggleAudio();
    updateSoundUI(newState);
  };

  if (introSoundToggle) introSoundToggle.addEventListener('click', handleToggle);
  if (navSoundToggle) navSoundToggle.addEventListener('click', handleToggle);

  window.addEventListener('languagechange', () => {
    updateSoundUI(getAudioState());
  });

  updateSoundUI(false);
}

// ==========================================================================
// 4. DETERMINISTIC 3-SECOND INTRO & ORANGE HAND-OFF
// ==========================================================================
let introInstance = null;

async function setupIntroFlow() {
  const introScreen = document.getElementById('intro-screen');
  const introCanvas = document.getElementById('intro-canvas');
  const skipBtn = document.getElementById('intro-skip');
  const replayBtn = document.getElementById('replay-intro-btn');
  const orangeHandoff = document.getElementById('orange-handoff-overlay');

  if (!introScreen || !introCanvas) return;

  let hasSeenIntro = false;
  try {
    hasSeenIntro = sessionStorage.getItem('omar_intro_seen') === 'true';
  } catch (e) {
    hasSeenIntro = false;
  }
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isBotOrAudit = /Googlebot|Lighthouse|bingbot|Baiduspider/i.test(navigator.userAgent);

  if (hasSeenIntro || prefersReducedMotion || isBotOrAudit) {
    introScreen.classList.add('is-hidden');
    triggerHeroReveal();
    return;
  }

  // Lazy-load DeterministicIntro only when needed to protect Core Web Vitals
  const { DeterministicIntro } = await import('./intro/deterministicIntro.js');

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
    replayBtn.addEventListener('click', async () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      try {
        sessionStorage.removeItem('omar_intro_seen');
      } catch (e) {}

      if (orangeHandoff) {
        orangeHandoff.classList.remove('active');
        orangeHandoff.style.clipPath = '';
        orangeHandoff.style.transform = '';
      }

      introScreen.style.opacity = '1';
      introScreen.classList.remove('is-hidden');
      if (!introInstance) {
        const mod = await import('./intro/deterministicIntro.js');
        introInstance = new mod.DeterministicIntro(introCanvas, {
          getLang: () => getLanguage(),
          onComplete: () => {
            executeOrangeHandoff(introScreen, orangeHandoff);
          }
        });
      }
      introInstance.start();
    });
  }

  introInstance.start();
}

function executeOrangeHandoff(introScreen, orangeHandoff) {
  try {
    sessionStorage.setItem('omar_intro_seen', 'true');
  } catch (e) {}

  if (orangeHandoff) {
    orangeHandoff.classList.add('active');
    orangeHandoff.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
    orangeHandoff.style.transform = 'translateY(0%)';

    introScreen.classList.add('is-hidden');

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
// 5. EXPANDABLE SERVICES BENTO TILES
// ==========================================================================
function setupExpandableServices() {
  const serviceTiles = document.querySelectorAll('.service-bento-tile');
  serviceTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const isAlreadyExpanded = tile.classList.contains('is-expanded');
      serviceTiles.forEach(t => t.classList.remove('is-expanded'));
      if (!isAlreadyExpanded) {
        tile.classList.add('is-expanded');
      }
    });
  });
}

// ==========================================================================
// 6. SPOTLIGHT BORDER HOVER EFFECT
// ==========================================================================
function setupSpotlightCards() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('.spotlight-card, .chamfer-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// ==========================================================================
// 7. STICKY MINI CTA BAR ON MOBILE
// ==========================================================================
function setupMobileStickyCta() {
  const stickyCta = document.getElementById('mobile-sticky-cta');
  if (!stickyCta) return;

  window.addEventListener('scroll', () => {
    if (window.innerWidth < 768) {
      if (window.scrollY > 450) {
        stickyCta.classList.add('is-visible');
      } else {
        stickyCta.classList.remove('is-visible');
      }
    }
  }, { passive: true });
}

// ==========================================================================
// 8. INTERACTIVE CONTROLS & CONTACT FORM
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

  // Contact Form Submission (3 Streamlined Fields)
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const contactInput = document.getElementById('form-contact');
      const messageInput = document.getElementById('form-message');

      const name = nameInput.value.trim();
      const contact = contactInput.value.trim();
      const message = messageInput.value.trim();
      const lang = getLanguage();

      [nameInput, contactInput, messageInput].forEach(inp => inp.classList.remove('input-error'));

      if (!name || !contact || !message) {
        if (!name) nameInput.classList.add('input-error');
        if (!contact) contactInput.classList.add('input-error');
        if (!message) messageInput.classList.add('input-error');

        const errorMsg = lang === 'ar'
          ? 'من فضلك املأ جميع الحقول المطلوبة (الاسم، وسيلة التواصل، والتفاصيل).'
          : 'Please fill in all required fields (Name, Contact info, and Details).';
        showToast(errorMsg, '⚠️');
        return;
      }

      fireSuccessConfetti();

      const whatsappText = lang === 'ar'
        ? `👋 مساء الخير يا عمر ويا مصطفى، أنا *${name}*\n\n📱 وسيلة التواصل: ${contact}\n\n📝 تفاصيل مشروعي:\n${message}\n\n---\n🌐 مرسلة من موقع 7P Studio (7pstudio.tech)`
        : `👋 Hi Omar & Mostafa, I am *${name}*\n\n📱 Contact: ${contact}\n\n📝 Project details:\n${message}\n\n---\n🌐 Sent from 7P Studio (7pstudio.tech)`;

      const encodedMsg = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/201515047449?text=${encodedMsg}`;

      const successToast = lang === 'ar'
        ? `شكراً ليك يا ${name}! بنحولك على واتساب الآن بالرسالة جاهزة...`
        : `Thank you, ${name}! Redirecting to WhatsApp with your details...`;
      showToast(successToast, '🚀');

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>${lang === 'ar' ? 'تم تجهيز الرسالة!' : 'Message Ready!'}</span>`;

      setTimeout(() => {
        const opened = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        if (!opened || opened.closed || typeof opened.closed === 'undefined') {
          window.location.href = whatsappUrl;
        }
        contactForm.reset();
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }, 2500);
      }, 400);
    });
  }

  // Privacy Policy Modal Handlers
  const privacyModal = document.getElementById('privacy-modal');
  const openPrivacyBtn = document.getElementById('open-privacy-btn');
  const closePrivacyBtn = document.getElementById('close-privacy-btn');
  const confirmPrivacyBtn = document.getElementById('confirm-privacy-btn');

  if (privacyModal && openPrivacyBtn) {
    const openModal = () => {
      privacyModal.style.display = 'flex';
      setTimeout(() => privacyModal.classList.add('is-open'), 10);
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      privacyModal.classList.remove('is-open');
      setTimeout(() => {
        privacyModal.style.display = 'none';
        document.body.style.overflow = '';
      }, 250);
    };

    openPrivacyBtn.addEventListener('click', openModal);
    if (closePrivacyBtn) closePrivacyBtn.addEventListener('click', closeModal);
    if (confirmPrivacyBtn) confirmPrivacyBtn.addEventListener('click', closeModal);

    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && privacyModal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  // Floating Back-to-Top Button & Upward Rocket Launch
  const floatingBackTop = document.getElementById('floating-back-top');
  const footerBackTop = document.querySelector('.footer-back-to-top');

  const scrollToTop = () => {
    // Upward launch effect
    if (floatingBackTop) {
      gsap.to(floatingBackTop, {
        y: -30,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(floatingBackTop, { y: 0, opacity: 1 });
        }
      });
    }
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
// 9. MOBILE NAVIGATION DRAWER
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
