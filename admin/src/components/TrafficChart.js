// ==============================================================================
// 7P STUDIO CONTROL CENTER — VISITOR TRAFFIC CHART (TrafficChart.js)
// Interactive SVG chart matching reference line curves, grid lines & tooltip
// ==============================================================================

export class TrafficChart {
  constructor(chartData) {
    this.chartData = chartData;
  }

  render() {
    // Width: 520, Height: 190
    // Values: 0 to 50k
    const maxVal = 50000;
    const h = 170;
    const w = 500;
    const paddingLeft = 35;
    const paddingBottom = 25;
    const chartW = w - paddingLeft;
    const chartH = h - paddingBottom;

    // Y values points for Visitors [18k, 26k, 24k, 36k, 31k, 48.7k]
    const visitorsData = [18000, 26000, 24000, 36000, 31000, 48700];
    const pageviewsData = [12000, 19000, 16000, 25000, 22000, 34000];

    const getX = (idx, total) => paddingLeft + (idx / (total - 1)) * chartW;
    const getY = (val) => chartH - (val / maxVal) * chartH + 10;

    // Generate Visitors Path
    let pathVisitors = `M ${getX(0, visitorsData.length)} ${getY(visitorsData[0])}`;
    for (let i = 1; i < visitorsData.length; i++) {
      const prevX = getX(i - 1, visitorsData.length);
      const prevY = getY(visitorsData[i - 1]);
      const currX = getX(i, visitorsData.length);
      const currY = getY(visitorsData[i]);
      const c1x = prevX + (currX - prevX) * 0.5;
      pathVisitors += ` C ${c1x} ${prevY}, ${c1x} ${currY}, ${currX} ${currY}`;
    }

    // Generate Page Views Path
    let pathViews = `M ${getX(0, pageviewsData.length)} ${getY(pageviewsData[0])}`;
    for (let i = 1; i < pageviewsData.length; i++) {
      const prevX = getX(i - 1, pageviewsData.length);
      const prevY = getY(pageviewsData[i - 1]);
      const currX = getX(i, pageviewsData.length);
      const currY = getY(pageviewsData[i]);
      const c1x = prevX + (currX - prevX) * 0.5;
      pathViews += ` C ${c1x} ${prevY}, ${c1x} ${currY}, ${currX} ${currY}`;
    }

    // Tooltip position at end of Visitors curve (Oct 30)
    const tipX = getX(visitorsData.length - 1, visitorsData.length);
    const tipY = getY(visitorsData[visitorsData.length - 1]);

    return `
      <div class="card-panel-header">
        <div class="card-panel-title">
          <i class="fa-solid fa-chart-simple"></i>
          <span>Visitor Traffic</span>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <div class="traffic-legend-bar">
            <span><span class="traffic-legend-dot visitors"></span>Visitors</span>
            <span><span class="traffic-legend-dot pageviews"></span>Page Views</span>
          </div>
          <button class="date-selector-btn" style="padding: 4px 10px; font-size: 0.74rem;">
            <span>Last 30 Days</span>
            <i class="fa-solid fa-chevron-down" style="font-size: 0.65rem; margin-left: 3px;"></i>
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
            <line x1="${paddingLeft}" y1="${getY(50000)}" x2="${w}" y2="${getY(50000)}" />
            <line x1="${paddingLeft}" y1="${getY(40000)}" x2="${w}" y2="${getY(40000)}" />
            <line x1="${paddingLeft}" y1="${getY(30000)}" x2="${w}" y2="${getY(30000)}" />
            <line x1="${paddingLeft}" y1="${getY(20000)}" x2="${w}" y2="${getY(20000)}" />
            <line x1="${paddingLeft}" y1="${getY(10000)}" x2="${w}" y2="${getY(10000)}" />
            <line x1="${paddingLeft}" y1="${getY(0)}" x2="${w}" y2="${getY(0)}" stroke="rgba(255,255,255,0.12)" />
          </g>

          <g fill="#71717A" font-size="9" font-family="'JetBrains Mono', monospace" text-anchor="end">
            <text x="${paddingLeft - 8}" y="${getY(50000) + 3}">50k</text>
            <text x="${paddingLeft - 8}" y="${getY(40000) + 3}">40k</text>
            <text x="${paddingLeft - 8}" y="${getY(30000) + 3}">30k</text>
            <text x="${paddingLeft - 8}" y="${getY(20000) + 3}">20k</text>
            <text x="${paddingLeft - 8}" y="${getY(10000) + 3}">10k</text>
            <text x="${paddingLeft - 8}" y="${getY(0) + 3}">0</text>
          </g>

          <!-- X-Axis Labels -->
          <g fill="#71717A" font-size="9" font-family="'Inter', sans-serif">
            <text x="${getX(0, 5)}" y="185">Oct 01</text>
            <text x="${getX(1, 5)}" y="185">Oct 07</text>
            <text x="${getX(2, 5)}" y="185">Oct 14</text>
            <text x="${getX(3, 5)}" y="185">Oct 21</text>
            <text x="${getX(4, 5)}" y="185">Oct 30</text>
          </g>

          <!-- Page Views Curve (Secondary Gray) -->
          <path d="${pathViews}" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" />

          <!-- Visitors Area Gradient Fill -->
          <path d="${pathVisitors} L ${tipX} ${getY(0)} L ${paddingLeft} ${getY(0)} Z" fill="url(#visitors-fill)" />

          <!-- Visitors Primary Curve (Orange with Glow) -->
          <path d="${pathVisitors}" fill="none" stroke="#FF8500" stroke-width="2.6" stroke-linecap="round" filter="url(#orange-glow)" />

          <!-- Vertical Guideline at Tooltip -->
          <line x1="${tipX}" y1="${tipY}" x2="${tipX}" y2="${getY(0)}" stroke="rgba(255,133,0,0.4)" stroke-dasharray="3 3" />

          <!-- Glowing Tooltip Dot at Oct 30 Point -->
          <circle cx="${tipX}" cy="${tipY}" r="5" fill="#FF8500" stroke="#FFFFFF" stroke-width="2" filter="url(#orange-glow)" />

          <!-- Tooltip Box: 48.7K Visitors -->
          <g transform="translate(${tipX - 70}, ${tipY - 38})">
            <rect width="78" height="26" rx="6" fill="#18181B" stroke="rgba(255,133,0,0.5)" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.6))" />
            <text x="39" y="13" fill="#FFFFFF" font-size="9.5" font-weight="700" font-family="'Inter', sans-serif" text-anchor="middle">48.7K</text>
            <text x="39" y="21" fill="#A1A1AA" font-size="7" font-family="'Inter', sans-serif" text-anchor="middle">Visitors</text>
          </g>
        </svg>
      </div>
    `;
  }
}
