// ==============================================================================
// 7P STUDIO CONTROL CENTER — DEVICES BREAKDOWN DONUT (DevicesDonut.js)
// SVG Donut chart with glowing orange outer ring & session breakdown
// ==============================================================================

export class DevicesDonut {
  constructor(devicesData) {
    this.devicesData = devicesData || {
      totalSessions: '68.4K',
      items: [
        { name: 'Desktop', percentage: 58.5, color: '#FF8500' },
        { name: 'Mobile', percentage: 37.2, color: '#71717A' },
        { name: 'Tablet', percentage: 4.3, color: '#3F3F46' }
      ]
    };
  }

  render() {
    const { totalSessions, items } = this.devicesData;
    // SVG Donut geometry
    // Radius: 50, Circumference = 2 * PI * 50 = 314.16
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

    return `
      <div class="card-panel-header">
        <div class="card-panel-title">
          <i class="fa-solid fa-desktop"></i>
          <span>Devices Breakdown</span>
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
          <circle cx="65" cy="65" r="50" fill="none" stroke="${segments[2].color}" stroke-width="12" stroke-dasharray="${segments[2].strokeDash}" stroke-dashoffset="${segments[2].strokeDashoffset}" />

          <!-- Mobile Segment -->
          <circle cx="65" cy="65" r="50" fill="none" stroke="${segments[1].color}" stroke-width="12" stroke-dasharray="${segments[1].strokeDash}" stroke-dashoffset="${segments[1].strokeDashoffset}" />

          <!-- Desktop Segment (Orange with Glow) -->
          <circle cx="65" cy="65" r="50" fill="none" stroke="${segments[0].color}" stroke-width="12" stroke-dasharray="${segments[0].strokeDash}" stroke-dashoffset="${segments[0].strokeDashoffset}" filter="url(#donut-glow)" />
        </svg>

        <!-- Center Counter inside Donut -->
        <div class="donut-center-stat">
          <span class="donut-big-number">${totalSessions}</span>
          <span class="donut-sub-label">Total Sessions</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="devices-legend-list">
        ${items.map(item => `
          <div class="device-legend-row">
            <div class="device-legend-left">
              <span class="device-color-dot" style="background: ${item.color};"></span>
              <span>${item.name}</span>
            </div>
            <span class="device-percentage">${item.percentage}%</span>
          </div>
        `).join('')}
      </div>
    `;
  }
}
