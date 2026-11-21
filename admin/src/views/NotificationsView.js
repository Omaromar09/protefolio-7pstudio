// ==============================================================================
// 7P STUDIO CONTROL CENTER — NOTIFICATIONS CENTER (NotificationsView.js)
// Centralized notification management, unread filters, and historical alerts
// ==============================================================================

import { NotificationsService } from '../services/notificationsService.js';
import { AdminToast } from '../components/Toast.js';

export class NotificationsView {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.filter = 'all'; // 'all' | 'unread'
  }

  render() {
    const all = NotificationsService.getNotifications();
    const list = this.filter === 'unread' ? all.filter(n => !n.is_read) : all;

    return `
      <div class="notifications-view-container">
        <!-- Module Header -->
        <div class="module-header">
          <div class="module-title-box">
            <h1>Notifications Center</h1>
            <p>Unified alert inbox for new leads, deployments, system health checks, and studio operations.</p>
          </div>
          <div class="module-actions-bar">
            <button class="btn-primary" id="notif-mark-all-read-btn">
              <i class="fa-solid fa-check-double"></i>
              <span>Mark All as Read</span>
            </button>
          </div>
        </div>

        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
          <button class="view-switch-btn ${this.filter === 'all' ? 'active' : ''}" id="filter-all-btn" style="padding: 6px 14px; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600; color: ${this.filter === 'all' ? '#fff' : 'var(--text-muted)'}; background: ${this.filter === 'all' ? 'rgba(255,133,0,0.25)' : 'rgba(255,255,255,0.05)'};">
            All (${all.length})
          </button>
          <button class="view-switch-btn ${this.filter === 'unread' ? 'active' : ''}" id="filter-unread-btn" style="padding: 6px 14px; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600; color: ${this.filter === 'unread' ? '#fff' : 'var(--text-muted)'}; background: ${this.filter === 'unread' ? 'rgba(255,133,0,0.25)' : 'rgba(255,255,255,0.05)'};">
            Unread (${all.filter(n => !n.is_read).length})
          </button>
        </div>

        <div class="glass-panel" style="padding: 20px;">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${list.length === 0 ? `
              <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fa-regular fa-bell-slash" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>No notifications found.</p>
              </div>
            ` : list.map(n => `
              <div style="padding: 16px; border-radius: var(--radius-md); background: ${n.is_read ? 'rgba(255,255,255,0.015)' : 'rgba(255,133,0,0.05)'}; border: 1px solid ${n.is_read ? 'var(--border-subtle)' : 'rgba(255,133,0,0.3)'}; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;">
                <div style="display: flex; gap: 14px; align-items: flex-start;">
                  <i class="${n.severity === 'warning' ? 'fa-solid fa-triangle-exclamation' : (n.severity === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-envelope')}" style="color: ${n.severity === 'warning' ? 'var(--status-amber)' : (n.severity === 'success' ? 'var(--status-green)' : 'var(--accent-orange)')}; font-size: 1.25rem; margin-top: 2px;"></i>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-weight: 700; color: #fff; font-size: 0.92rem;">${n.title}</span>
                      <span class="badge-status ${n.severity}">${n.type.toUpperCase()}</span>
                    </div>
                    <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.4;">${n.message}</p>
                    <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 6px;">
                      ${new Date(n.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 8px;">
                  ${!n.is_read ? `
                    <button class="btn-icon mark-read-single-btn" data-id="${n.id}" title="Mark as read">
                      <i class="fa-solid fa-check"></i>
                    </button>
                  ` : ''}
                  ${n.link ? `
                    <button class="btn-secondary nav-link-btn" data-link="${n.link}" style="font-size: 0.74rem; padding: 6px 12px;">
                      View
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    const markAllBtn = container.querySelector('#notif-mark-all-read-btn');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', () => {
        NotificationsService.markAllAsRead();
        AdminToast.show('All notifications marked as read', 'success');
        this.refresh(container);
      });
    }

    container.querySelector('#filter-all-btn')?.addEventListener('click', () => {
      this.filter = 'all';
      this.refresh(container);
    });

    container.querySelector('#filter-unread-btn')?.addEventListener('click', () => {
      this.filter = 'unread';
      this.refresh(container);
    });

    container.querySelectorAll('.mark-read-single-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        NotificationsService.markAsRead(id);
        this.refresh(container);
      });
    });

    container.querySelectorAll('.nav-link-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const link = btn.getAttribute('data-link');
        if (link && this.onNavigate) {
          const route = link.replace('#', '').replace('/admin/', '');
          this.onNavigate(route);
        }
      });
    });
  }

  refresh(container) {
    container.innerHTML = this.render();
    this.attachEvents(container);
  }
}
