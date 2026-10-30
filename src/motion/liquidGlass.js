/**
 * ==========================================================================
 * 7P STUDIO — LIQUID GLASS MOTION & PERFORMANCE CONTROLLER
 * 1. Specular sheen pointermove & scroll tracking (throttled via RAF)
 * 2. Progressive enhancement feature detection for SVG refraction filter
 * 3. Mobile & low-end hardware concurrency constraints
 * 4. Visibility observer to pause orbs on inactive tabs
 * 5. Header pill scroll shrink & gooey toggle interactions
 * ==========================================================================
 */

export function initLiquidGlass() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const isLowEnd = hardwareConcurrency <= 4;

  // 1. Hardware & Capability Assessment
  if (isMobile || isLowEnd) {
    document.documentElement.classList.add('low-end-or-mobile');
  }

  // 2. Tab Visibility Observer (Pause drifting animations on hidden tab)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.documentElement.classList.add('pause-orbs');
    } else {
      document.documentElement.classList.remove('pause-orbs');
    }
  });

  // 3. Header Pill Scroll Shrink (Optimized, no global style property mutations)
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let isScrolled = false;
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const shouldBeScrolled = scrollY > 40;
      if (shouldBeScrolled !== isScrolled) {
        isScrolled = shouldBeScrolled;
        if (isScrolled) {
          navbar.classList.add('is-scrolled');
        } else {
          navbar.classList.remove('is-scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 4. Desktop Specular Sheen Interactive Cursor Tracking (Isolated to hovered card ONLY)
  if (!isMobile && !prefersReducedMotion) {
    let pendingRaf = false;
    let lastClientX = 0;
    let lastClientY = 0;
    let hoveredCard = null;

    // Cache interactive glass targets
    const glassTargets = document.querySelectorAll(
      '.glass, .glass--card, .service-bento-tile, .process-step-card, ' +
      '.showcase-shell, .estimator-card-main, .contact-form-card, ' +
      '.contact-method-card, .trust-promises-card, .diagnosis-quiz-card, ' +
      '.diagnosis-result-card, .ba-slider-container, .hero-proof-card, .pillar-card'
    );

    glassTargets.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        hoveredCard = card;
      });
      card.addEventListener('mouseleave', () => {
        if (hoveredCard === card) {
          hoveredCard = null;
          card.style.removeProperty('--mx');
          card.style.removeProperty('--my');
        }
      });
    });

    window.addEventListener('pointermove', (e) => {
      if (!hoveredCard) return; // Zero work when no card is hovered!
      lastClientX = e.clientX;
      lastClientY = e.clientY;

      if (!pendingRaf) {
        pendingRaf = true;
        requestAnimationFrame(() => {
          pendingRaf = false;
          if (hoveredCard) {
            const rect = hoveredCard.getBoundingClientRect();
            const cx = (((lastClientX - rect.left) / rect.width) * 100).toFixed(1);
            const cy = (((lastClientY - rect.top) / rect.height) * 100).toFixed(1);
            hoveredCard.style.setProperty('--mx', `${cx}%`);
            hoveredCard.style.setProperty('--my', `${cy}%`);
          }
        });
      }
    }, { passive: true });
  }

  // 5. Language Toggle Interaction
  const langToggles = document.querySelectorAll('.lang-toggle');
  langToggles.forEach(toggle => {
    const btns = toggle.querySelectorAll('.lang-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        toggle.classList.add('is-animating');
        setTimeout(() => toggle.classList.remove('is-animating'), 280);
      });
    });
  });
}
