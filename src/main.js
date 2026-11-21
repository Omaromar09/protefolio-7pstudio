import './style.css';
import { DeterministicIntro } from './intro/deterministicIntro.js';
import { initLanguage, getLanguage, setLanguage } from './utils/i18n.js';
import { initTheme } from './utils/theme.js';
import { initSmoothScroll } from './motion/scroll.js';
import { initCustomCursor } from './motion/cursor.js';
import { initScrollAnimations } from './motion/animations.js';
import { initProjectShowcase } from './motion/projectShowcase.js';
import { initProjectEstimator } from './motion/estimator.js';
import { renderTestimonials } from './utils/testimonials.js';
import { showToast } from './utils/toast.js';
import { fireSuccessConfetti } from './utils/confetti.js';
import { initLiquidGlass } from './motion/liquidGlass.js';
import gsap from 'gsap';

// ==========================================================================
// 1. APPLICATION BOOTSTRAP
// ==========================================================================

// Dynamic Global WhatsApp link text updates for 100% language fidelity
function updateGlobalWhatsAppLinks(lang) {
  const isAr = lang === 'ar';

  // 1. Floating WhatsApp trigger
  const floatingBtn = document.querySelector('.whatsapp-floating-btn');
  if (floatingBtn) {
    const text = isAr
      ? 'مساء الخير (7P Studio)، شوفت موقعكم وحابب نتكلم عن مشروعي'
      : 'Hello 7P Studio, I visited your website and would like to discuss my project';
    floatingBtn.href = `https://wa.me/201515047449?text=${encodeURIComponent(text)}`;
  }

  // 2. Mobile Sticky CTA
  const stickyBtn = document.querySelector('.mobile-sticky-btn');
  if (stickyBtn) {
    const text = isAr
      ? 'مساء الخير (7P Studio)، عايز أستفسر عن تنفيذ موقع لبيزنسي'
      : 'Hello 7P Studio, I would like to inquire about building a website for my business';
    stickyBtn.href = `https://wa.me/201515047449?text=${encodeURIComponent(text)}`;
  }

  // 3. Contact section WhatsApp card
  const contactCard = document.querySelector('.whatsapp-hero-cta-card');
  if (contactCard) {
    const text = isAr
      ? 'مساء الخير (7P Studio)، عايز أستفسر عن تنفيذ موقع لبيزنسي'
      : 'Hello 7P Studio, I would like to inquire about building a website for my business';
    contactCard.href = `https://wa.me/201515047449?text=${encodeURIComponent(text)}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Bilingual Language System (Arabic Default)
  initLanguage();
  updateGlobalWhatsAppLinks(getLanguage());
  window.addEventListener('languagechange', (e) => updateGlobalWhatsAppLinks(e.detail.lang));

  // Initialize Light / Dark Theme Switcher
  initTheme();
  initLiquidGlass();

  // Initialize Smooth Scrolling & Lenis
  initSmoothScroll();

  // Initialize Custom Cursor & Magnetic Elements (Desktop Only)
  initCustomCursor();

  // Initialize Scroll-Triggered Animations
  initScrollAnimations();

  // Initialize Pinned Projects Showcase
  initProjectShowcase();

  // Initialize 7P Studio Interactive Project Estimator & WhatsApp Quote Engine
  initProjectEstimator();

  // Initialize Expandable Services Bento Tiles
  setupExpandableServices();

  // Initialize Spotlight Cards Cursor Effect
  setupSpotlightCards();

  // Initialize Client Testimonials / Social Proof (Strictly rendered only if real reviews exist)
  renderTestimonials(getLanguage());

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
// 2. 3D SCENES SETUP (Skills Constellation only — Hero replaced by CSS/SVG 7P logo)
// ==========================================================================
let skillsSceneInstance = null;
let skillsLoaded = false;

function setup3DScenes() {
  // Skills 3D Constellation (unchanged)
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
// 4. DETERMINISTIC INTRO & WARM AMBER HAND-OFF
// ==========================================================================
let introInstance = null;

function setupIntroFlow() {
  const introScreen = document.getElementById('intro-screen');
  const introCanvas = document.getElementById('intro-canvas');
  const skipBtn = document.getElementById('intro-skip');
  const orangeHandoff = document.getElementById('orange-handoff-overlay');

  if (!introScreen || !introCanvas) {
    triggerHeroReveal();
    return;
  }

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

  introInstance.start();
}

function executeOrangeHandoff(introScreen, orangeHandoff) {
  if (orangeHandoff) {
    orangeHandoff.classList.add('active');
    orangeHandoff.style.display = 'block';
    orangeHandoff.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
    orangeHandoff.style.transform = 'translateY(0%)';

    introScreen.classList.add('is-hidden');

    gsap.to(orangeHandoff, {
      clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
      duration: 0.65,
      ease: 'power3.inOut',
      onComplete: () => {
        orangeHandoff.classList.remove('active');
        orangeHandoff.style.display = 'none';
      }
    });
  } else {
    introScreen.classList.add('is-hidden');
  }

  triggerHeroReveal();
}

function triggerHeroReveal() {
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
          showToast(msg, 'check');
        } catch (err) {
          const temp = document.createElement('textarea');
          temp.value = text;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
          const msg = getLanguage() === 'ar' ? `تم نسخ "${text}" بنجاح!` : `Copied "${text}" to clipboard!`;
          showToast(msg, 'check');
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
        showToast(errorMsg, 'error');
        return;
      }

      fireSuccessConfetti();

      const whatsappText = lang === 'ar'
        ? `مساء الخير (7P Studio)، أنا *${name}*\n\nوسيلة التواصل: ${contact}\n\nتفاصيل مشروعي:\n${message}\n\n---\nمرسلة من موقع 7P Studio (7pstudio.tech)`
        : `Hello 7P Studio, I am *${name}*\n\nContact: ${contact}\n\nProject details:\n${message}\n\n---\nSent from 7P Studio (7pstudio.tech)`;

      const encodedMsg = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/201515047449?text=${encodedMsg}`;

      const successToast = lang === 'ar'
        ? `شكراً ليك يا ${name}، بنحولك على واتساب الآن بالرسالة جاهزة...`
        : `Thank you, ${name}! Redirecting to WhatsApp with your details...`;
      showToast(successToast);

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
