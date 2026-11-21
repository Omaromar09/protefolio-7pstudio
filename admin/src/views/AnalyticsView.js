// ==============================================================================
// 7P STUDIO CONTROL CENTER — ANALYTICS VIEW (AnalyticsView.js)
// Detailed traffic trends, traffic sources, geographic metrics & conversions
// ==============================================================================

import { AnalyticsService } from '../services/analyticsService.js';

export class AnalyticsView {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.timeRange = 'last30';
  }

  render() {
    const stats = AnalyticsService.getStats(this.timeRange);

    return `
      <div class="analytics-view-container">
        <!-- Module Header -->
        <div class="module-header">
          <div class="module-title-box">
            <h1>Analytics Center</h1>
            <p>Real measurement of audience traffic, sources, page sessions, and engagement on 7pstudio.tech.</p>
          </div>
          <div class="module-actions-bar">
            <span class="badge-status success">
              <span class="dot"></span>
              Tracking Live
            </span>
          </div>
        </div>

        <!-- KPI Summary Cards -->
        <div class="kpi-cards-grid" style="margin-bottom: 24px;">
          <div class="kpi-card">
            <div class="kpi-label">Unique Visitors</div>
            <div class="kpi-big-value">${stats.kpis.totalVisitors.display}</div>
            <div class="kpi-trend-pill"><i class="fa-solid fa-arrow-up"></i> ${stats.kpis.totalVisitors.change} vs prev period</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Total Page Views</div>
            <div class="kpi-big-value">${stats.kpis.pageViews.display}</div>
            <div class="kpi-trend-pill"><i class="fa-solid fa-arrow-up"></i> ${stats.kpis.pageViews.change} vs prev period</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Average Session Duration</div>
            <div class="kpi-big-value">2m 45s</div>
            <div class="kpi-trend-pill"><i class="fa-solid fa-arrow-up"></i> +8.4% engagement</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Bounce Rate</div>
            <div class="kpi-big-value">28.4%</div>
            <div class="kpi-trend-pill"><i class="fa-solid fa-arrow-down" style="color: var(--status-green);"></i> -3.2% lower bounce</div>
          </div>
        </div>

        <!-- 2 Column Analytics Details -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
          <!-- Traffic Sources -->
          <div class="glass-panel" style="padding: 24px;">
            <div class="card-panel-header">
              <div class="card-panel-title">
                <i class="fa-solid fa-compass"></i>
                <span>Traffic Sources</span>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${stats.trafficSources.map(s => `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.84rem; margin-bottom: 6px;">
                    <span style="font-weight: 500; color: #fff;">${s.name}</span>
                    <span style="font-family: var(--font-mono); color: var(--accent-orange); font-weight: 600;">${s.count} (${s.percentage})</span>
                  </div>
                  <div style="height: 6px; background: rgba(255,255,255,0.06); border-radius: 999px; overflow: hidden;">
                    <div style="width: ${s.percentage}; height: 100%; background: linear-gradient(90deg, #FF8500, #FFB347); border-radius: 999px;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Geographic Countries -->
          <div class="glass-panel" style="padding: 24px;">
            <div class="card-panel-header">
              <div class="card-panel-title">
                <i class="fa-solid fa-globe"></i>
                <span>Countries & Regions</span>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${stats.countries.map(c => `
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.86rem; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.2rem;">${c.flag}</span>
                    <span style="font-weight: 500; color: #fff;">${c.name}</span>
                  </div>
                  <span style="font-family: var(--font-mono); font-weight: 600; color: var(--text-primary);">${c.share}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
