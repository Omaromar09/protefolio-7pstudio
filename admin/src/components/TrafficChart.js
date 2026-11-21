// ==============================================================================
// 7P STUDIO CONTROL CENTER — VISITOR TRAFFIC CHART (TrafficChart.js)
// Dynamic SVG chart reflecting real visitor & pageview telemetry
// ==============================================================================

import { AdminI18n } from '../services/i18nAdmin.js';

export class TrafficChart {
  constructor(chartData) {
    this.chartData = chartData || {};
  }

  render() {
    const h = 170;
    const w = 500;
    const paddingLeft = 35;
    const paddingBottom = 25;
    const chartW = w - paddingLeft;
    const chartH = h - paddingBottom;

    const visitorsData = this.chartData?.visitors?.length >= 2 ? this.chartData.visitors : [1, 2, 3, 4, 5];
    const pageviewsData = this.chartData?.pageviews?.length >= 2 ? this.chartData.pageviews : [1, 3, 5, 7, 9];
    const labels = this.chartData?.labels?.length === visitorsData.length ? this.chartData.labels : ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Today'];

    const rawMax = Math.max(...visitorsData, ...pageviewsData, 5);
    const maxVal = Math.ceil(rawMax * 1.25);

    const getX = (idx, total) => paddingLeft + (idx / (total - 1)) * chartW;
    const getY = (val) => chartH - (val / maxVal) * chartH + 10;

    // Visitors Path
    let pathVisitors = `M ${getX(0, visitorsData.length)} ${getY(visitorsData[0])}`;
    for (let i = 1; i < visitorsData.length; i++) {
      const prevX = getX(i - 1, visitorsData.length);
      const prevY = getY(visitorsData[i - 1]);
      const currX = getX(i, visitorsData.length);
      const currY = getY(visitorsData[i]);
      const c1x = prevX + (currX - prevX) * 0.5;
      pathVisitors += ` C ${c1x} ${prevY}, ${c1x} ${currY}, ${currX} ${currY}`;
    }

    // Pageviews Path
    let pathViews = `M ${getX(0, pageviewsData.length)} ${getY(pageviewsData[0])}`;
    for (let i = 1; i < pageviewsData.length; i++) {
      const prevX = getX(i - 1, pageviewsData.length);
      const prevY = getY(pageviewsData[i - 1]);
      const currX = getX(i, pageviewsData.length);
      const currY = getY(pageviewsData[i]);
      const c1x = prevX + (currX - prevX) * 0.5;
      pathViews += ` C ${c1x} ${prevY}, ${c1x} ${currY}, ${currX} ${currY}`;
    }

    const lastIdx = visitorsData.length - 1;
    const tipX = getX(lastIdx, visitorsData.length);
    const tipY = getY(visitorsData[lastIdx]);
    const latestVal = visitorsData[lastIdx];
    const latestDisplay = latestVal > 999 ? (latestVal / 1000).toFixed(1) + 'K' : String(latestVal);

    // Dynamic Y ticks
    const step = maxVal / 5;
    const yTicks = [maxVal, step * 4, step * 3, step * 2, step, 0];

    return `
      <div class="card-panel-header">
        <div class="card-panel-title">
          <i class="fa-solid fa-chart-simple"></i>
          <span>${AdminI18n.t('visitorTraffic')}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <div class="traffic-legend-bar">
            <span><span class="traffic-legend-dot visitors"></span>${AdminI18n.t('visitors')}</span>
            <span><span class="traffic-legend-dot pageviews"></span>${AdminI18n.t('views')}</span>
          </div>
          <button class="date-selector-btn" style="padding: 4px 10px; font-size: 0.74rem;">
            <span>${AdminI18n.t('last30Days')}</span>
            <i class="fa-solid fa-chevron-down" style="font-size: 0.65rem; margin-inline-start: 3px;"></i>
          </button>
        </div>
      </div>

      <div class="chart-canvas-wrapper">
        <svg viewBox="0 0 520 190" style="width: 100%; height: 100%; overflow: visible;">
          <defs>
            <filter id="orange-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#FF8500" flood-opacity="0.6"/>
            </filter>
            <linearGradient id="visitors-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FF8500" stop-opacity="0.22" />
              <stop offset="100%" stop-color="#FF8500" stop-opacity="0" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid Lines & Y-Labels -->
          <g stroke="rgba(255,255,255,0.06)" stroke-width="1">
            ${yTicks.map(val => `<line x1="${paddingLeft}" y1="${getY(val)}" x2="${w}" y2="${getY(val)}" ${val === 0 ? 'stroke="rgba(255,255,255,0.12)"' : ''} />`).join('')}
          </g>

          <g fill="#71717A" font-size="9" font-family="'JetBrains Mono', monospace" text-anchor="end">
            ${yTicks.map(val => `<text x="${paddingLeft - 8}" y="${getY(val) + 3}">${val > 999 ? Math.round(val / 1000) + 'k' : Math.round(val)}</text>`).join('')}
          </g>

          <!-- X-Axis Labels -->
          <g fill="#71717A" font-size="9" font-family="'Cairo', 'Inter', sans-serif">
            ${labels.map((lbl, idx) => `<text x="${getX(idx, labels.length)}" y="185" text-anchor="middle">${lbl}</text>`).join('')}
          </g>

          <!-- Page Views Curve (Secondary Gray) -->
          <path d="${pathViews}" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" />

          <!-- Visitors Area Gradient Fill -->
          <path d="${pathVisitors} L ${tipX} ${getY(0)} L ${paddingLeft} ${getY(0)} Z" fill="url(#visitors-fill)" />

          <!-- Visitors Primary Curve (Orange with Glow) -->
          <path d="${pathVisitors}" fill="none" stroke="#FF8500" stroke-width="2.6" stroke-linecap="round" filter="url(#orange-glow)" />

          <!-- Vertical Guideline at Tooltip -->
          <line x1="${tipX}" y1="${tipY}" x2="${tipX}" y2="${getY(0)}" stroke="rgba(255,133,0,0.4)" stroke-dasharray="3 3" />

          <!-- Glowing Tooltip Dot at latest Point -->
          <circle cx="${tipX}" cy="${tipY}" r="5" fill="#FF8500" stroke="#FFFFFF" stroke-width="2" filter="url(#orange-glow)" />

          <!-- Tooltip Box: Real Visitors -->
          <g transform="translate(${Math.max(paddingLeft, tipX - 70)}, ${Math.max(10, tipY - 38)})">
            <rect width="78" height="26" rx="6" fill="#18181B" stroke="rgba(255,133,0,0.5)" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.6))" />
            <text x="39" y="13" fill="#FFFFFF" font-size="9.5" font-weight="700" font-family="'Inter', sans-serif" text-anchor="middle">${latestDisplay}</text>
            <text x="39" y="21" fill="#A1A1AA" font-size="7" font-family="'Cairo', 'Inter', sans-serif" text-anchor="middle">${AdminI18n.t('visitors')}</text>
          </g>
        </svg>
      </div>
    `;
  }
}
