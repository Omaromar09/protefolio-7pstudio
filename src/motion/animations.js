import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // 1. Reveal Section Headers
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach((header) => {
    gsap.from(header.children, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });
  });

  // 2. About Bio & Pillars Reveal
  const aboutPillars = document.querySelectorAll('.pillar-card');
  if (aboutPillars.length) {
    gsap.from(aboutPillars, {
      scrollTrigger: {
        trigger: '.about-pillars',
        start: 'top 85%'
      },
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out'
    });
  }

  // 3. Project Cards Stagger
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%'
      },
      y: 50,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: (index % 2) * 0.15
    });
  });

  // 4. Services Grid (Simultaneous level reveal with clearProps so cards stay 100% flush and equal)
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length) {
    gsap.from(serviceCards, {
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      clearProps: 'all'
    });
  }

  // 5. Process Timeline Steps (Simultaneous reveal with clearProps so cards stay 100% level)
  const processSteps = document.querySelectorAll('.process-step-card');
  if (processSteps.length) {
    gsap.from(processSteps, {
      scrollTrigger: {
        trigger: '.process-timeline',
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 25,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      clearProps: 'all'
    });
  }

  // 6. Contact Section Reveal
  const contactInfo = document.querySelector('.contact-info');
  const contactForm = document.querySelector('.contact-form-card');
  if (contactInfo && contactForm) {
    gsap.from(contactInfo, {
      scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%'
      },
      x: -40,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out'
    });

    gsap.from(contactForm, {
      scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%'
      },
      x: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out'
    });
  }

  // 7. 3D Tilt on Project Cards
  initProjectCardTilt();

  // 8. Navigation Active State on Scroll
  initScrollNavSpy();
}

/**
 * 3D Card Tilt with specular lighting effect
 */
function initProjectCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('.partner-card, .service-card, .process-step-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/**
 * Scrollspy to highlight active nav link
 */
function initScrollNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}
