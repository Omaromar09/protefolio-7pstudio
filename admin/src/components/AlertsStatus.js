// ==============================================================================
// 7P STUDIO CONTROL CENTER — ALERTS & SYSTEM STATUS (AlertsStatus.js)
// Delivery audit status, deployment success & Vercel hosting indicators
// ==============================================================================

import { AdminI18n } from '../services/i18nAdmin.js';

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
          <span>${AdminI18n.t('alertsSystemStatus')}</span>
        </div>
        <span class="card-header-link" id="view-all-alerts-link">${AdminI18n.t('viewAll')}</span>
      </div>

      <div class="alerts-cards-list">
        <!-- Direct Lead Delivery Engine Card -->
        <div class="system-alert-card success" style="border-color: rgba(255,133,0,0.35);">
          <div class="alert-icon-wrap" style="color: var(--accent-orange); background: rgba(255,133,0,0.12);">
            <i class="fa-solid fa-inbox"></i>
          </div>
          <div class="alert-body-content">
            <div class="alert-title-text">${AdminI18n.t('formDeliveryStatus')}</div>
            <div class="alert-desc-text">${AdminI18n.t('formDeliveryDesc')}</div>
          </div>
          <button class="alert-action-btn" id="check-delivery-btn" style="color: var(--accent-orange);">${AdminI18n.t('messagesLeads')} →</button>
        </div>

        <!-- Success Deployment Card -->
        <div class="system-alert-card success">
          <div class="alert-icon-wrap">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div class="alert-body-content">
            <div class="alert-title-text">${AdminI18n.t('deploymentSuccessful')}</div>
            <div class="alert-desc-text">${AdminI18n.t('deploymentDesc')}</div>
          </div>
        </div>
      </div>

      <!-- Footer Meta Bar: Hosting Vercel & Domain 7pstudio.tech -->
      <div class="alerts-footer-meta">
        <div class="alerts-meta-item">
          <i class="fa-solid fa-cloud" style="font-size: 0.8rem; color: #A1A1AA;"></i>
          <span>${AdminI18n.t('hostingVercel')}</span>
          <span class="dot"></span>
        </div>
        <div style="color: var(--border-strong);">|</div>
        <div class="alerts-meta-item">
          <span>${AdminI18n.t('domain7p')}</span>
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
      checkBtn.addEventListener('click', () => this.onNavigate('leads'));
    }
  }
}
