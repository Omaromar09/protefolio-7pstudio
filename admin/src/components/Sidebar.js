// ==============================================================================
// 7P STUDIO CONTROL CENTER — SIDEBAR COMPONENT (Sidebar.js)
// Bilingual Arabic (Default) & English Sidebar
// ==============================================================================

import { LeadsService } from '../services/leadsService.js';
import { AdminI18n } from '../services/i18nAdmin.js';

export class Sidebar {
  constructor(activeRoute, onNavigate) {
    this.activeRoute = activeRoute || 'overview';
    this.onNavigate = onNavigate;
    this.unreadLeadsCount = 0;
    this.initBadge();
  }

  async initBadge() {
    try {
      this.unreadLeadsCount = await LeadsService.getUnreadCount();
      const badgeEl = document.getElementById('sidebar-leads-badge');
      if (badgeEl) {
        badgeEl.textContent = this.unreadLeadsCount;
        badgeEl.style.display = this.unreadLeadsCount > 0 ? 'inline-block' : 'none';
      }
    } catch (e) {}
  }

  render() {
    const t = (k) => AdminI18n.t(k);

    const navItems = [
      { id: 'overview', label: t('overview'), icon: 'fa-solid fa-house' },
      { id: 'projects', label: t('projects'), icon: 'fa-solid fa-folder-closed', hasChevron: true },
      { id: 'media', label: t('mediaLibrary'), icon: 'fa-solid fa-photo-film' },
      { id: 'services', label: t('services'), icon: 'fa-solid fa-puzzle-piece' },
      { id: 'testimonials', label: t('testimonials'), icon: 'fa-solid fa-quote-left' },
      { id: 'leads', label: t('messagesLeads'), icon: 'fa-solid fa-envelope', badge: this.unreadLeadsCount },
      { id: 'pages', label: t('pagesSections'), icon: 'fa-solid fa-table-columns' },
      { id: 'analytics', label: t('analytics'), icon: 'fa-solid fa-chart-line' },
      { id: 'performance', label: t('performance'), icon: 'fa-solid fa-gauge-high' },
      { id: 'monitoring', label: t('errorMonitoring'), icon: 'fa-solid fa-triangle-exclamation' },
      { id: 'settings', label: t('settings'), icon: 'fa-solid fa-gear' }
    ];

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <aside class="admin-sidebar">
        <!-- Logo & Brand Header -->
        <div class="sidebar-header">
          <div class="studio-logo-badge">
            <i class="fa-solid fa-bolt"></i>
          </div>
          <div class="studio-brand-text">
            <span class="studio-brand-name">${t('studioName')}</span>
            <span class="studio-brand-sub">${t('controlCenter')}</span>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="sidebar-nav">
          ${navItems.map(item => `
            <div class="nav-item ${this.activeRoute === item.id ? 'active' : ''}" data-route="${item.id}">
              <i class="${item.icon}"></i>
              <span>${item.label}</span>
              ${item.badge !== undefined && item.badge > 0 ? `<span class="nav-badge" id="sidebar-leads-badge">${item.badge}</span>` : ''}
              ${item.hasChevron ? `<i class="fa-solid fa-chevron-down nav-chevron"></i>` : ''}
            </div>
          `).join('')}
        </nav>

        <!-- Upgrade Plan Card with 3D Rocket Icon from Reference -->
        <div class="sidebar-upgrade-card">
          <div class="upgrade-rocket-icon">
            <i class="fa-solid fa-rocket"></i>
          </div>
          <h4 class="upgrade-title">${t('upgradePlan')}</h4>
          <p class="upgrade-desc">${t('upgradeDesc')}</p>
          <button class="upgrade-btn" id="upgrade-plan-btn">
            <span>${t('viewPlans')}</span>
            <i class="fa-solid fa-arrow-right" style="transform: ${AdminI18n.getLanguage() === 'ar' ? 'rotate(180deg)' : 'none'};"></i>
          </button>
        </div>

        <!-- Sidebar Footer with System Online status -->
        <div class="sidebar-footer">
          <div class="system-status-indicator">
            <span class="dot"></span>
            <span>${t('systemOnline')}</span>
          </div>
          <span>${t('lastUpdated')}: ${currentTime}</span>
        </div>
      </aside>
    `;
  }

  attachEvents(container) {
    container.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', () => {
        const route = el.getAttribute('data-route');
        if (route && this.onNavigate) {
          this.onNavigate(route);
        }
      });
    });

    const upgradeBtn = container.querySelector('#upgrade-plan-btn');
    if (upgradeBtn) {
      upgradeBtn.addEventListener('click', () => {
        alert(AdminI18n.getLanguage() === 'ar'
          ? 'باقة 7P STUDIO الاحترافية: سيرفر فائق السرعة، استلام غير محدود لطلبات العملاء، ونسخ احتياطي فوري متصلة بنجاح.'
          : '7P STUDIO Pro Plan: High-Speed Node, Unlimited Customer Leads, and Live Cloud Sync are active.');
      });
    }
  }
}
