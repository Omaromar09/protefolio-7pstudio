// ==============================================================================
// 7P STUDIO CONTROL CENTER — SIDEBAR COMPONENT (Sidebar.js)
// Replicating the exact reference image sidebar structure, glowing pill & card
// ==============================================================================

import { LeadsService } from '../services/leadsService.js';

export class Sidebar {
  constructor(activeRoute, onNavigate) {
    this.activeRoute = activeRoute || 'overview';
    this.onNavigate = onNavigate;
    this.unreadLeadsCount = 12; // Initial reference count
    this.initBadge();
  }

  async initBadge() {
    try {
      this.unreadLeadsCount = await LeadsService.getUnreadCount();
      const badgeEl = document.getElementById('sidebar-leads-badge');
      if (badgeEl) badgeEl.textContent = this.unreadLeadsCount;
    } catch (e) {}
  }

  render() {
    const navItems = [
      { id: 'overview', label: 'Overview', icon: 'fa-solid fa-house' },
      { id: 'projects', label: 'Projects', icon: 'fa-solid fa-folder-closed', hasChevron: true },
      { id: 'media', label: 'Media Library', icon: 'fa-solid fa-photo-film' },
      { id: 'services', label: 'Services', icon: 'fa-solid fa-puzzle-piece' },
      { id: 'testimonials', label: 'Testimonials', icon: 'fa-solid fa-quote-left' },
      { id: 'leads', label: 'Messages / Leads', icon: 'fa-solid fa-envelope', badge: this.unreadLeadsCount },
      { id: 'pages', label: 'Pages & Sections', icon: 'fa-solid fa-table-columns' },
      { id: 'analytics', label: 'Analytics', icon: 'fa-solid fa-chart-line' },
      { id: 'performance', label: 'Performance', icon: 'fa-solid fa-gauge-high' },
      { id: 'monitoring', label: 'Error Monitoring', icon: 'fa-solid fa-triangle-exclamation' },
      { id: 'settings', label: 'Settings', icon: 'fa-solid fa-gear' }
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
            <span class="studio-brand-name">7P STUDIO</span>
            <span class="studio-brand-sub">Control Center</span>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="sidebar-nav">
          ${navItems.map(item => `
            <div class="nav-item ${this.activeRoute === item.id ? 'active' : ''}" data-route="${item.id}">
              <i class="${item.icon}"></i>
              <span>${item.label}</span>
              ${item.badge !== undefined ? `<span class="nav-badge" id="sidebar-leads-badge">${item.badge}</span>` : ''}
              ${item.hasChevron ? `<i class="fa-solid fa-chevron-down nav-chevron"></i>` : ''}
            </div>
          `).join('')}
        </nav>

        <!-- Upgrade Plan Card with 3D Rocket Icon from Reference -->
        <div class="sidebar-upgrade-card">
          <div class="upgrade-rocket-icon">
            <i class="fa-solid fa-rocket"></i>
          </div>
          <h4 class="upgrade-title">Upgrade Your Plan</h4>
          <p class="upgrade-desc">Unlock more features and take your studio further.</p>
          <button class="upgrade-btn" id="upgrade-plan-btn">
            <span>View Plans</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <!-- Sidebar Footer with System Online status -->
        <div class="sidebar-footer">
          <div class="system-status-indicator">
            <span class="dot"></span>
            <span>System Online</span>
          </div>
          <span>Last updated: ${currentTime}</span>
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
        alert('7P STUDIO Pro Plan: Dedicated High-Speed Node, Unlimited Custom Leads Webhooks, and Automated Backup Archiving are active.');
      });
    }
  }
}
