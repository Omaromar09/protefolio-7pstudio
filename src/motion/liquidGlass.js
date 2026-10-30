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

  // Progressive enhancement refraction check (Chromium desktop with high concurrency only)
  const isChromium = /Chrome|Chromium|Edg/i.test(navigator.userAgent) && !/Firefox|FxiOS/i.test(navigator.userAgent);
  let supportsUrlBackdrop = false;
  try {
    supportsUrlBackdrop = (window.CSS && CSS.supports && (CSS.supports('backdrop-filter', 'url(#liquid-distort)') || CSS.supports('-webkit-backdrop-filter', 'url(#liquid-distort)')));
  } catch (e) {
    supportsUrlBackdrop = false;
  }

  if (isChromium && !isMobile && !isLowEnd && supportsUrlBackdrop) {
    document.documentElement.classList.add('supports-liquid-refraction');
  }

  // 2. Tab Visibility Observer (Pause drifting orbs on hidden tab for 0% CPU consumption)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.documentElement.classList.add('pause-orbs');
    } else {
      document.documentElement.classList.remove('pause-orbs');
    }
  });

  // 3. Header Pill Scroll Shrink & Opacity Listener
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }

    // On Mobile: subtle specular sheen drift driven by scroll
    if (isMobile && !prefersReducedMotion) {
      const scrollOffset = (scrollY % 600) / 6;
      document.documentElement.style.setProperty('--my', `${20 + scrollOffset * 0.5}%`);
      document.documentElement.style.setProperty('--mx', `${50 + Math.sin(scrollY * 0.004) * 20}%`);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 4. Desktop Specular Sheen Interactive Cursor Tracking (Throttled via RAF)
  if (!isMobile && !prefersReducedMotion) {
    let pendingRaf = false;
    let lastClientX = window.innerWidth / 2;
    let lastClientY = window.innerHeight / 2;
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
      lastClientX = e.clientX;
      lastClientY = e.clientY;

      if (!pendingRaf) {
        pendingRaf = true;
        requestAnimationFrame(() => {
          pendingRaf = false;

          // Global sheen coordinates
          const gx = ((lastClientX / window.innerWidth) * 100).toFixed(1);
          const gy = ((lastClientY / window.innerHeight) * 100).toFixed(1);
          document.documentElement.style.setProperty('--global-mx', `${gx}%`);
          document.documentElement.style.setProperty('--global-my', `${gy}%`);

          // Card-specific specular coordinate
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

  // 5. Language Toggle Gooey Blob Sliding Interaction
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
