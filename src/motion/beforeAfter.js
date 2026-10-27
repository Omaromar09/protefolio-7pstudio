// ==========================================================================
// 7P STUDIO — INTERACTIVE BEFORE / AFTER SLIDER (موقع عادي vs موقع 7P)
// Draggable visual comparison with touch and mouse support
// ==========================================================================

import { getLanguage } from '../utils/i18n.js';

export function initBeforeAfterSlider() {
  const container = document.getElementById('before-after-slider');
  if (!container) return;

  const handle = container.querySelector('.ba-slider-handle');
  const beforePanel = container.querySelector('.ba-panel-before');
  const afterPanel = container.querySelector('.ba-panel-after');
  if (!handle || !beforePanel || !afterPanel) return;

  let isDragging = false;

  function updateSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;

    // Constrain percentage between 5% and 95%
    percentage = Math.max(5, Math.min(95, percentage));

    handle.style.left = `${percentage}%`;
    beforePanel.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
  }

  // Pointer events (works for mouse and touch)
  handle.addEventListener('pointerdown', (e) => {
    isDragging = true;
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;
  });

  // Click anywhere on container to move handle
  container.addEventListener('click', (e) => {
    if (e.target.closest('.ba-slider-handle')) return;
    updateSliderPosition(e.clientX);
  });

  // Initial position: 50%
  handle.style.left = '50%';
  beforePanel.style.clipPath = 'polygon(0 0, 50% 0, 50% 100%, 0 100%)';
}
