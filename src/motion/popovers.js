/**
 * Interactive Partners & Projects Popover Handler
 * Manages hover alignment, edge detection, and touch devices
 */
export function initProjectPopovers() {
  const partnerItems = document.querySelectorAll('.partner-item');
  if (!partnerItems.length) return;

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  partnerItems.forEach((item) => {
    const card = item.querySelector('.partner-card');
    const popover = item.querySelector('.project-popover-card');
    if (!card || !popover) return;

    // Viewport collision adjustment helper
    const adjustPosition = () => {
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

    if (!isTouchDevice) {
      item.addEventListener('mouseenter', () => {
        adjustPosition();
      });
    } else {
      // Touch Handling: tap to open popover, tap again to navigate
      card.addEventListener('click', (e) => {
        const isActive = item.classList.contains('is-active');

        if (!isActive) {
          e.preventDefault();
          e.stopPropagation();

          // Close other open popovers
          partnerItems.forEach((other) => {
            if (other !== item) other.classList.remove('is-active');
          });

          item.classList.add('is-active');
          adjustPosition();
        }
        // If already active, default click proceeds to live site URL!
      });
    }
  });

  // Tap outside to close popovers on mobile
  if (isTouchDevice) {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.partner-item')) {
        partnerItems.forEach((item) => item.classList.remove('is-active'));
      }
    });
  }

  // Window resize re-align
  window.addEventListener('resize', () => {
    partnerItems.forEach((item) => {
      if (item.classList.contains('is-active') || item.matches(':hover')) {
        const popover = item.querySelector('.project-popover-card');
        if (popover) {
          popover.style.left = '50%';
        }
      }
    });
  }, { passive: true });
}
