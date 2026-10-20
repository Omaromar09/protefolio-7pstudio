import './style.css';
import { DeterministicIntro } from './intro/deterministicIntro.js';
import { initLanguage, getLanguage, setLanguage } from './utils/i18n.js';
import { initTheme } from './utils/theme.js';
import { initSmoothScroll } from './motion/scroll.js';
import { initCustomCursor } from './motion/cursor.js';
import { initScrollAnimations } from './motion/animations.js';
import { initProjectPopovers } from './motion/popovers.js';
import { renderTestimonials } from './utils/testimonials.js';
import { showToast } from './utils/toast.js';
import { fireSuccessConfetti } from './utils/confetti.js';
import { initAudio, toggleAudio, getAudioState } from './intro/soundSynth.js';
import { injectSpeedInsights } from '@vercel/speed-insights';
import gsap from 'gsap';

// ==========================================================================
// 1. APPLICATION BOOTSTRAP
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Vercel Speed Insights
  injectSpeedInsights();

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

  // Initialize Client Testimonials / Social Proof
  renderTestimonials(getLanguage());

  // Setup Sound Controls & Synthesizer (Default Muted / No Autoplay)
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

  // Sync sound labels on language change
  window.addEventListener('languagechange', () => {
    updateSoundUI(getAudioState());
  });

  // Initial UI state (strictly default OFF)
  updateSoundUI(false);
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

  // Skip works instantly from frame 0
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      if (introInstance) {
        introInstance.skip();
      }
    });
  }

  // Replay from contact section
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
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
      if (introInstance) {
        introInstance.start();
      }
    });
  }

  // Safe sessionStorage check with try/catch
  let hasSeenIntro = false;
  try {
    hasSeenIntro = sessionStorage.getItem('omar_intro_seen') === 'true';
  } catch (e) {
    hasSeenIntro = false;
  }
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Respect prefers-reduced-motion & single-play per session
  if (hasSeenIntro || prefersReducedMotion) {
    introScreen.classList.add('is-hidden');
    triggerHeroReveal();
  } else {
    introInstance.start();
  }
}

function executeOrangeHandoff(introScreen, orangeHandoff) {
  try {
    sessionStorage.setItem('omar_intro_seen', 'true');
  } catch (e) {}

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

  // Contact Form Submission (Validation, WhatsApp Direct & Success State)
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const contactInput = document.getElementById('form-contact');
      const serviceSelect = document.getElementById('form-service');
      const messageInput = document.getElementById('form-message');

      const name = nameInput.value.trim();
      const contact = contactInput.value.trim();
      const service = serviceSelect.options[serviceSelect.selectedIndex].text;
      const message = messageInput.value.trim();
      const lang = getLanguage();

      // Reset previous error indicators
      [nameInput, contactInput, messageInput].forEach(inp => inp.classList.remove('input-error'));
      const existingError = contactForm.querySelector('.form-error-banner');
      if (existingError) existingError.remove();

      // Validation check
      if (!name || !contact || !message) {
        if (!name) nameInput.classList.add('input-error');
        if (!contact) contactInput.classList.add('input-error');
        if (!message) messageInput.classList.add('input-error');

        const errorMsg = lang === 'ar'
          ? 'من فضلك املأ جميع الحقول المطلوبة (الاسم، طريقة التواصل، والتفاصيل).'
          : 'Please fill in all required fields (Name, Contact info, and Details).';
        
        const errDiv = document.createElement('div');
        errDiv.className = 'form-error-banner';
        errDiv.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>${errorMsg}</span>`;
        contactForm.prepend(errDiv);
        showToast(errorMsg, '⚠️');
        return;
      }

      // Success Confetti
      fireSuccessConfetti();

      const whatsappText = lang === 'ar'
        ? `👋 أهلاً يا عمر، أنا *${name}*\n\n📱 وسيلة التواصل: ${contact}\n🎯 محتاج: *${service}*\n\n📝 تفاصيل مشروعي:\n${message}\n\n---\n🌐 مرسلة من موقع 7P Studio (7pstudio.tech)`
        : `👋 Hi Omar, I am *${name}*\n\n📱 Contact: ${contact}\n🎯 Requested: *${service}*\n\n📝 Project details:\n${message}\n\n---\n🌐 Sent from 7P Studio (7pstudio.tech)`;

      const encodedMsg = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/201515047449?text=${encodedMsg}`;

      const successToast = lang === 'ar'
        ? `شكراً ليك يا ${name}! بنحولك على واتساب الآن بالرسالة جاهزة...`
        : `Thank you, ${name}! Redirecting to WhatsApp with your details...`;
      showToast(successToast, '🚀');

      // Visual success state on submit button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.classList.add('btn-success-state');
      submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>${lang === 'ar' ? 'تم تجهيز الرسالة!' : 'Message Ready!'}</span>`;

      // Open WhatsApp directly
      setTimeout(() => {
        const opened = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        if (!opened || opened.closed || typeof opened.closed === 'undefined') {
          window.location.href = whatsappUrl;
        }
        contactForm.reset();
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn-success-state');
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
