/**
 * Interactive Partners & Projects Popover Handler
 * Manages hover alignment, edge detection, and touch/mobile devices
 */
export function initProjectPopovers() {
  const partnerItems = document.querySelectorAll('.partner-item');
  const partnersSection = document.getElementById('projects');
  if (!partnerItems.length) return;

  const closeAllPopovers = () => {
    partnerItems.forEach((item) => {
      item.classList.remove('is-active');
    });
    if (partnersSection) {
      partnersSection.classList.remove('has-active-modal');
    }
    document.body.classList.remove('project-modal-open');
  };

  partnerItems.forEach((item) => {
    const card = item.querySelector('.partner-card');
    const popover = item.querySelector('.project-popover-card');
    if (!card || !popover) return;

    // Viewport collision adjustment helper (for desktop hover popovers)
    const adjustPosition = () => {
      if (window.innerWidth <= 768) {
        popover.style.left = '';
        popover.style.right = '';
        popover.style.transform = '';
        return;
      }

      // Reset any overrides first
      popover.style.left = '50%';
      popover.style.right = 'auto';
      popover.style.transform = '';

      const rect = popover.getBoundingClientRect();
      const padding = 16;

      if (rect.left < padding) {
        const offset = padding - rect.left;
        popover.style.left = `calc(50% + ${offset}px)`;
      } else if (rect.right > window.innerWidth - padding) {
        const offset = rect.right - (window.innerWidth - padding);
        popover.style.left = `calc(50% - ${offset}px)`;
      }
    };

    // Desktop hover handling
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) {
        adjustPosition();
      }
    });

    // Touch & Mobile Click Handling
    card.addEventListener('click', (e) => {
      const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

      if (isMobile) {
        const isActive = item.classList.contains('is-active');

        if (!isActive) {
          e.preventDefault();
          e.stopPropagation();

          // Close other open popovers
          partnerItems.forEach((other) => {
            if (other !== item) other.classList.remove('is-active');
          });

          item.classList.add('is-active');
          if (partnersSection) {
            partnersSection.classList.add('has-active-modal');
          }
          document.body.classList.add('project-modal-open');
          adjustPosition();
        }
        // If already active, default click proceeds to live site URL!
      }
    });

    // Close button (X) inside popover card
    const closeBtns = popover.querySelectorAll('.popover-close-btn');
    closeBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeAllPopovers();
      });
    });

    // Tapping on the active modal backdrop pseudo-element closes it
    item.addEventListener('click', (e) => {
      if (e.target === item) {
        e.preventDefault();
        e.stopPropagation();
        closeAllPopovers();
      }
    });
  });

  // Tap outside anywhere on the document to close popovers on mobile
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.partner-item')) {
      closeAllPopovers();
    }
  });

  // Escape key closes active popover
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllPopovers();
    }
  });

  // Window resize re-align
  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 768;
    partnerItems.forEach((item) => {
      const popover = item.querySelector('.project-popover-card');
      if (popover) {
        if (isMobile) {
          popover.style.left = '';
          popover.style.right = '';
          popover.style.transform = '';
        } else if (item.classList.contains('is-active') || item.matches(':hover')) {
          popover.style.left = '50%';
        }
      }
    });
  }, { passive: true });
}
