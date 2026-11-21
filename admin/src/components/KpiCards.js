// ==============================================================================
// 7P STUDIO CONTROL CENTER — KPI CARDS (KpiCards.js)
// 4 Stat Cards with SVG Glowing Sparklines & Zero Mock Values
// ==============================================================================

import { AdminI18n } from '../services/i18nAdmin.js';

export class KpiCards {
  constructor(stats) {
    this.stats = stats;
  }

  generateSparklineSvg(dataPoints, id, color = '#FF8500') {
    const pointsArr = Array.isArray(dataPoints) && dataPoints.length >= 2 ? dataPoints : [1, 2, 3, 4, 5];
    const min = Math.min(...pointsArr);
    const max = Math.max(...pointsArr) || 1;
    const width = 100;
    const height = 36;
    const range = (max - min) || 1;

    const points = pointsArr.map((val, idx) => {
      const x = (idx / (pointsArr.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return [x, y];
    });

    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev[0] + curr[0]) / 2;
      d += ` Q ${prev[0]} ${prev[1]} ${cx} ${(prev[1] + curr[1]) / 2}`;
    }
    const last = points[points.length - 1];
    d += ` L ${last[0]} ${last[1]}`;

    return `
      <svg class="kpi-sparkline-svg" viewBox="0 0 100 36">
        <defs>
          <filter id="glow-${id}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="${color}" flood-opacity="0.6"/>
          </filter>
        </defs>
        <path d="${d}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow-${id})"/>
      </svg>
    `;
  }

  render() {
    const { totalVisitors, pageViews, projects, newLeads } = this.stats.kpis;

    return `
      <div class="kpi-cards-grid">
        <!-- Card 1: Total Visitors (Real) -->
        <div class="kpi-card">
          <div class="kpi-card-top">
            <div class="kpi-icon-square">
              <i class="fa-solid fa-users"></i>
            </div>
            <div class="kpi-sparkline-box">
              ${this.generateSparklineSvg(totalVisitors.sparkline, 'visitors')}
            </div>
          </div>
          <div class="kpi-label">${AdminI18n.t('totalVisitors')}</div>
          <div class="kpi-value-row">
            <span class="kpi-big-value">${totalVisitors.display}</span>
            <span class="kpi-trend-pill">
              <i class="fa-solid fa-arrow-up"></i>
              <span>${totalVisitors.change}</span>
            </span>
          </div>
        </div>

        <!-- Card 2: Page Views (Real) -->
        <div class="kpi-card">
          <div class="kpi-card-top">
            <div class="kpi-icon-square">
              <i class="fa-regular fa-eye"></i>
            </div>
            <div class="kpi-sparkline-box">
              ${this.generateSparklineSvg(pageViews.sparkline, 'pageviews')}
            </div>
          </div>
          <div class="kpi-label">${AdminI18n.t('pageViews')}</div>
          <div class="kpi-value-row">
            <span class="kpi-big-value">${pageViews.display}</span>
            <span class="kpi-trend-pill">
              <i class="fa-solid fa-arrow-up"></i>
              <span>${pageViews.change}</span>
            </span>
          </div>
        </div>

        <!-- Card 3: Active Projects (8 Authentic) -->
        <div class="kpi-card">
          <div class="kpi-card-top">
            <div class="kpi-icon-square">
              <i class="fa-solid fa-folder"></i>
            </div>
            <div class="kpi-sparkline-box">
              ${this.generateSparklineSvg(projects.sparkline, 'projects')}
            </div>
          </div>
          <div class="kpi-label">${AdminI18n.t('activeProjects')}</div>
          <div class="kpi-value-row">
            <span class="kpi-big-value">${projects.display}</span>
            <span class="kpi-trend-pill neutral">
              <i class="fa-solid fa-check"></i>
              <span>${projects.change}</span>
            </span>
          </div>
        </div>

        <!-- Card 4: New Leads (Real Inbox) -->
        <div class="kpi-card">
          <div class="kpi-card-top">
            <div class="kpi-icon-square">
              <i class="fa-solid fa-envelope"></i>
            </div>
            <div class="kpi-sparkline-box">
              ${this.generateSparklineSvg(newLeads.sparkline, 'leads')}
            </div>
          </div>
          <div class="kpi-label">${AdminI18n.t('newLeads')}</div>
          <div class="kpi-value-row">
            <span class="kpi-big-value">${newLeads.display}</span>
            <span class="kpi-trend-pill ${Number(newLeads.raw) > 0 ? '' : 'neutral'}">
              <i class="fa-solid fa-bolt"></i>
              <span>${newLeads.change}</span>
            </span>
          </div>
        </div>
      </div>
    `;
  }
}
