// ==============================================================================
// 7P STUDIO CONTROL CENTER — RECENT ACTIVITY WIDGET (RecentActivity.js)
// Timeline with glowing track & authentic studio telemetry
// ==============================================================================

import { AdminI18n } from '../services/i18nAdmin.js';

export class RecentActivity {
  constructor(activities, onNavigate) {
    this.activities = activities || [];
    this.onNavigate = onNavigate;
  }

  render() {
    const list = this.activities.slice(0, 4);

    const getIconClass = (category) => {
      if (category === 'lead') return 'lead';
      if (category === 'deployment') return 'success';
      return '';
    };

    const getIconHtml = (category) => {
      if (category === 'lead') return '<i class="fa-regular fa-envelope"></i>';
      if (category === 'deployment') return '<i class="fa-solid fa-check"></i>';
      if (category === 'analytics') return '<span style="font-size: 0.95rem;">🇪🇬</span>';
      return '<i class="fa-solid fa-pen"></i>';
    };

    return `
      <div class="card-panel-header">
        <div class="card-panel-title">
          <i class="fa-solid fa-bolt"></i>
          <span>${AdminI18n.t('recentActivity')}</span>
        </div>
        <span class="card-header-link" id="view-all-activity-link">${AdminI18n.t('viewAll')}</span>
      </div>

      <div class="activity-timeline">
        ${list.map(item => `
          <div class="timeline-entry">
            <div class="timeline-icon-node ${getIconClass(item.category)}">
              ${getIconHtml(item.category)}
            </div>
            <div class="timeline-content-box">
              <div class="timeline-title-text">${item.details}</div>
              <div class="timeline-time-ago">${new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  attachEvents(container) {
    const link = container.querySelector('#view-all-activity-link');
    if (link && this.onNavigate) {
      link.addEventListener('click', () => this.onNavigate('activity'));
    }
  }
}
