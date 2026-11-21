// ==============================================================================
// 7P STUDIO CONTROL CENTER — DEVICES BREAKDOWN DONUT (DevicesDonut.js)
// SVG Donut chart with glowing orange outer ring & real session breakdown
// ==============================================================================

import { AdminI18n } from '../services/i18nAdmin.js';

export class DevicesDonut {
  constructor(devicesData) {
    this.devicesData = devicesData || {
      totalSessions: '1',
      items: [
        { name: 'Desktop', percentage: 100, color: '#FF8500' },
        { name: 'Mobile', percentage: 0, color: '#71717A' },
        { name: 'Tablet', percentage: 0, color: '#3F3F46' }
      ]
    };
  }

  render() {
    const { totalSessions, items } = this.devicesData;
    const circumference = 314.16;
    let offset = 0;

    const segments = items.map(item => {
      const strokeLength = (item.percentage / 100) * circumference;
      const strokeDash = `${strokeLength} ${circumference - strokeLength}`;
      const currentOffset = offset;
      offset -= strokeLength;
      return {
        ...item,
        strokeDash,
        strokeDashoffset: currentOffset
      };
    });

    const isAr = AdminI18n.getLanguage() === 'ar';

    const getDeviceLabel = (name) => {
      if (name.includes('Desktop') || name.includes('كمبيوتر')) return isAr ? 'كمبيوتر مكتبي' : 'Desktop';
      if (name.includes('Mobile') || name.includes('هاتف')) return isAr ? 'هاتف ذكي' : 'Mobile';
      if (name.includes('Tablet') || name.includes('لوحية')) return isAr ? 'تابلت' : 'Tablet';
      return name;
    };

    return `
      <div class="card-panel-header">
        <div class="card-panel-title">
          <i class="fa-solid fa-desktop"></i>
          <span>${AdminI18n.t('devicesBreakdown')}</span>
        </div>
      </div>

      <div class="donut-chart-container">
        <svg class="donut-svg-wrapper" viewBox="0 0 130 130">
          <defs>
            <filter id="donut-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#FF8500" flood-opacity="0.5"/>
            </filter>
          </defs>
          <!-- Background track -->
          <circle cx="65" cy="65" r="50" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="12" />

          <!-- Tablet Segment -->
          ${segments[2] ? `
            <circle cx="65" cy="65" r="50" fill="none" stroke="${segments[2].color}" stroke-width="12" stroke-dasharray="${segments[2].strokeDash}" stroke-dashoffset="${segments[2].strokeDashoffset}" />
          ` : ''}

          <!-- Mobile Segment -->
          ${segments[1] ? `
            <circle cx="65" cy="65" r="50" fill="none" stroke="${segments[1].color}" stroke-width="12" stroke-dasharray="${segments[1].strokeDash}" stroke-dashoffset="${segments[1].strokeDashoffset}" />
          ` : ''}

          <!-- Desktop Segment (Orange with Glow) -->
          ${segments[0] ? `
            <circle cx="65" cy="65" r="50" fill="none" stroke="${segments[0].color}" stroke-width="12" stroke-dasharray="${segments[0].strokeDash}" stroke-dashoffset="${segments[0].strokeDashoffset}" filter="url(#donut-glow)" />
          ` : ''}
        </svg>

        <!-- Center Counter inside Donut -->
        <div class="donut-center-stat">
          <span class="donut-big-number">${totalSessions}</span>
          <span class="donut-sub-label">${AdminI18n.t('totalSessions')}</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="devices-legend-list">
        ${items.map(item => `
          <div class="device-legend-row">
            <div class="device-legend-left">
              <span class="device-color-dot" style="background: ${item.color};"></span>
              <span>${getDeviceLabel(item.name)}</span>
            </div>
            <span class="device-percentage">${item.percentage}%</span>
          </div>
        `).join('')}
      </div>
    `;
  }
}
