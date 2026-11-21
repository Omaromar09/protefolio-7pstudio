// ==============================================================================
// 7P STUDIO CONTROL CENTER — TOP PAGES WIDGET (TopPages.js)
// Ranked list of top performing pages with real tracked views
// ==============================================================================

import { AdminI18n } from '../services/i18nAdmin.js';

export class TopPages {
  constructor(pagesData, onNavigate) {
    this.pagesData = pagesData || [];
    this.onNavigate = onNavigate;
  }

  render() {
    return `
      <div class="card-panel-header">
        <div class="card-panel-title">
          <i class="fa-solid fa-star"></i>
          <span>${AdminI18n.t('topPages')}</span>
        </div>
        <span class="card-header-link" id="view-all-pages-link">${AdminI18n.t('viewAll')}</span>
      </div>

      <div class="top-pages-list">
        ${this.pagesData.map(p => `
          <div class="top-page-row">
            <span class="top-page-rank">${p.rank}</span>
            <span class="top-page-name">${p.name}</span>
            <span class="top-page-views">${p.views}</span>
            <span class="top-page-growth">
              <i class="fa-solid fa-arrow-up" style="font-size: 0.65rem;"></i>
              ${p.growth}
            </span>
          </div>
        `).join('')}
      </div>
    `;
  }

  attachEvents(container) {
    const link = container.querySelector('#view-all-pages-link');
    if (link && this.onNavigate) {
      link.addEventListener('click', () => this.onNavigate('analytics'));
    }
  }
}
