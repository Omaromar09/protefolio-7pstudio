// ==============================================================================
// 7P STUDIO CONTROL CENTER — ALERTS & SYSTEM STATUS (AlertsStatus.js)
// Delivery audit warning, deployment success & Vercel hosting indicators
// ==============================================================================

export class AlertsStatus {
  constructor(alerts, onNavigate) {
    this.alerts = alerts;
    this.onNavigate = onNavigate;
  }

  render() {
    return `
      <div class="card-panel-header">
        <div class="card-panel-title">
          <i class="fa-solid fa-shield-halved"></i>
          <span>Alerts & System Status</span>
        </div>
        <span class="card-header-link" id="view-all-alerts-link">View All →</span>
      </div>

      <div class="alerts-cards-list">
        <!-- Warning Card -->
        <div class="system-alert-card warning">
          <div class="alert-icon-wrap">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div class="alert-body-content">
            <div class="alert-title-text">Contact form delivery needs attention</div>
            <div class="alert-desc-text">Some messages are not being delivered to inbox.</div>
          </div>
          <button class="alert-action-btn" id="check-delivery-btn">Check Now →</button>
        </div>

        <!-- Success Deployment Card -->
        <div class="system-alert-card success">
          <div class="alert-icon-wrap">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div class="alert-body-content">
            <div class="alert-title-text">Deployment Successful</div>
            <div class="alert-desc-text">Your site is up and running perfectly! • 1 hour ago</div>
          </div>
        </div>
      </div>

      <!-- Footer Meta Bar: Hosting Vercel & Domain 7pstudio.tech -->
      <div class="alerts-footer-meta">
        <div class="alerts-meta-item">
          <i class="fa-solid fa-cloud" style="font-size: 0.8rem; color: #A1A1AA;"></i>
          <span>Hosting: Vercel</span>
          <span class="dot"></span>
        </div>
        <div style="color: var(--border-strong);">|</div>
        <div class="alerts-meta-item">
          <span>Domain: 7pstudio.tech</span>
          <span class="dot"></span>
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    const link = container.querySelector('#view-all-alerts-link');
    if (link && this.onNavigate) {
      link.addEventListener('click', () => this.onNavigate('monitoring'));
    }

    const checkBtn = container.querySelector('#check-delivery-btn');
    if (checkBtn && this.onNavigate) {
      checkBtn.addEventListener('click', () => this.onNavigate('monitoring'));
    }
  }
}
