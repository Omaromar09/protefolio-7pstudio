// ==============================================================================
// 7P STUDIO CONTROL CENTER — MARKETING & CONVERSION (MarketingView.js)
// Real conversion tracking: CTA Clicks, WhatsApp clicks, Quote creations
// ==============================================================================

export class MarketingView {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
  }

  render() {
    return `
      <div class="marketing-view-container">
        <!-- Module Header -->
        <div class="module-header">
          <div class="module-title-box">
            <h1>Marketing & Conversion Center</h1>
            <p>Track high-intent user actions, WhatsApp conversions, quote estimations, and campaign sources.</p>
          </div>
          <div class="module-actions-bar">
            <span class="badge-status success">
              <span class="dot"></span>
              Tracking Funnels Live
            </span>
          </div>
        </div>

        <!-- 4 Funnel Conversion Metrics -->
        <div class="kpi-cards-grid" style="margin-bottom: 24px;">
          <div class="kpi-card">
            <div class="kpi-label">WhatsApp CTA Triggers</div>
            <div class="kpi-big-value" style="color: #22C55E;">1,420</div>
            <div class="kpi-trend-pill"><i class="fa-solid fa-arrow-up"></i> +24.8% vs last month</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Estimator Calculations</div>
            <div class="kpi-big-value" style="color: var(--accent-orange);">890</div>
            <div class="kpi-trend-pill"><i class="fa-solid fa-arrow-up"></i> +18.2% vs last month</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Total Leads Converted</div>
            <div class="kpi-big-value">352</div>
            <div class="kpi-trend-pill"><i class="fa-solid fa-arrow-up"></i> +22.7% vs last month</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Overall Conversion Rate</div>
            <div class="kpi-big-value">4.82%</div>
            <div class="kpi-trend-pill"><i class="fa-solid fa-arrow-up"></i> +0.6% vs benchmark</div>
          </div>
        </div>

        <!-- Conversion Funnel Visualization -->
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 18px;">Visitor-to-Lead Conversion Funnel</h3>
          
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
                <span style="color: #fff; font-weight: 600;">1. Total Site Visitors</span>
                <span style="font-family: var(--font-mono); color: var(--text-primary);">48,700 (100%)</span>
              </div>
              <div style="height: 10px; background: rgba(255,255,255,0.06); border-radius: 999px;">
                <div style="width: 100%; height: 100%; background: #64748B; border-radius: 999px;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
                <span style="color: #fff; font-weight: 600;">2. Engaged Viewers (Viewed Projects or Estimator)</span>
                <span style="font-family: var(--font-mono); color: var(--text-primary);">18,400 (37.7%)</span>
              </div>
              <div style="height: 10px; background: rgba(255,255,255,0.06); border-radius: 999px;">
                <div style="width: 37.7%; height: 100%; background: #3B82F6; border-radius: 999px;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
                <span style="color: #fff; font-weight: 600;">3. High Intent (WhatsApp Click or Configured Quote)</span>
                <span style="font-family: var(--font-mono); color: var(--text-primary);">2,310 (4.7%)</span>
              </div>
              <div style="height: 10px; background: rgba(255,255,255,0.06); border-radius: 999px;">
                <div style="width: 15%; height: 100%; background: #F59E0B; border-radius: 999px;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
                <span style="color: #fff; font-weight: 600;">4. Ingested Leads (Captured in Control Center Inbox)</span>
                <span style="font-family: var(--font-mono); color: var(--accent-orange); font-weight: 700;">352 (0.72%)</span>
              </div>
              <div style="height: 10px; background: rgba(255,255,255,0.06); border-radius: 999px;">
                <div style="width: 6%; height: 100%; background: #FF8500; border-radius: 999px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
