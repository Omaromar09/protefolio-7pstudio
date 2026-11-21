// ==============================================================================
// 7P STUDIO CONTROL CENTER — HEADER GREETING BANNER (HeaderBanner.js)
// Bilingual Greeting, Date Range Selector, Live Status Pill, View Website CTA
// ==============================================================================

import { AdminI18n } from '../services/i18nAdmin.js';

export class HeaderBanner {
  constructor(currentTimeRange, onDateRangeChange) {
    this.currentTimeRange = currentTimeRange || 'last30';
    this.onDateRangeChange = onDateRangeChange;
  }

  render() {
    const timeLabels = {
      today: AdminI18n.t('today'),
      yesterday: AdminI18n.t('yesterday'),
      last7: AdminI18n.t('last7Days'),
      last30: AdminI18n.t('last30Days'),
      last90: AdminI18n.t('last90Days'),
      year: AdminI18n.t('thisYear')
    };

    return `
      <div class="overview-header-banner">
        <div class="greeting-text-box">
          <h1>${AdminI18n.t('greetingTitle')} 👋</h1>
          <p>${AdminI18n.t('greetingSubtitle')}</p>
        </div>

        <div class="header-banner-controls">
          <!-- Date Range Selector -->
          <div style="position: relative;">
            <button class="date-selector-btn" id="date-range-dropdown-btn">
              <i class="fa-regular fa-calendar"></i>
              <span id="current-range-label">${timeLabels[this.currentTimeRange] || AdminI18n.t('last30Days')}</span>
              <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; margin-inline-start: 4px;"></i>
            </button>
            <div id="date-range-menu" style="display: none; position: absolute; inset-inline-end: 0; top: 42px; background: #161619; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); box-shadow: 0 10px 25px rgba(0,0,0,0.7); z-index: 50; width: 160px; overflow: hidden; padding: 4px;">
              <button class="range-option-item ${this.currentTimeRange === 'today' ? 'active' : ''}" data-range="today">${AdminI18n.t('today')}</button>
              <button class="range-option-item ${this.currentTimeRange === 'yesterday' ? 'active' : ''}" data-range="yesterday">${AdminI18n.t('yesterday')}</button>
              <button class="range-option-item ${this.currentTimeRange === 'last7' ? 'active' : ''}" data-range="last7">${AdminI18n.t('last7Days')}</button>
              <button class="range-option-item ${this.currentTimeRange === 'last30' ? 'active' : ''}" data-range="last30">${AdminI18n.t('last30Days')}</button>
              <button class="range-option-item ${this.currentTimeRange === 'last90' ? 'active' : ''}" data-range="last90">${AdminI18n.t('last90Days')}</button>
              <button class="range-option-item ${this.currentTimeRange === 'year' ? 'active' : ''}" data-range="year">${AdminI18n.t('thisYear')}</button>
            </div>
          </div>

          <!-- Website Live Status Pill -->
          <div class="website-live-pill">
            <span class="dot"></span>
            <span>${AdminI18n.t('websiteLive')}</span>
          </div>

          <!-- View Website Button -->
          <a href="/" target="_blank" rel="noopener noreferrer" class="view-website-btn">
            <span>${AdminI18n.t('viewWebsite')}</span>
            <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem;"></i>
          </a>
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    const btn = container.querySelector('#date-range-dropdown-btn');
    const menu = container.querySelector('#date-range-menu');

    if (btn && menu) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      });

      document.addEventListener('click', () => {
        menu.style.display = 'none';
      });

      menu.querySelectorAll('.range-option-item').forEach(opt => {
        opt.addEventListener('click', (e) => {
          const range = opt.getAttribute('data-range');
          if (range && this.onDateRangeChange) {
            this.onDateRangeChange(range);
          }
        });
      });
    }
  }
}
