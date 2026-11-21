// ==============================================================================
// 7P STUDIO CONTROL CENTER — TOP NAVIGATION (TopNav.js)
// Search bar (Ctrl+K), Notification center badge, theme toggle, profile avatar
// ==============================================================================

import { NotificationsService } from '../services/notificationsService.js';
import { AuthService } from '../services/auth.js';

export class TopNav {
  constructor(onOpenCommandPalette, onNavigate) {
    this.onOpenCommandPalette = onOpenCommandPalette;
    this.onNavigate = onNavigate;
    this.unreadNotifsCount = NotificationsService.getUnreadCount();
  }

  render() {
    const user = AuthService.getCurrentUser();

    return `
      <header class="top-navbar">
        <!-- Global Search Input with Keyboard Shortcut -->
        <div class="global-search-container" id="global-search-trigger">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <span>Search anything...</span>
          <span class="kbd-shortcut">Ctrl + K</span>
        </div>

        <!-- Top Right Actions -->
        <div class="top-navbar-actions">
          <!-- Notification Bell -->
          <div class="relative-wrap" style="position: relative;">
            <button class="nav-icon-btn" id="notif-bell-btn" title="Notifications">
              <i class="fa-regular fa-bell"></i>
              ${this.unreadNotifsCount > 0 ? `<span class="badge-count" id="top-notif-count">${this.unreadNotifsCount}</span>` : ''}
            </button>
            <div id="notif-dropdown-box" style="display: none; position: absolute; right: 0; top: 48px; width: 340px; background: #141416; border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); box-shadow: 0 10px 30px rgba(0,0,0,0.8); z-index: 50; padding: 14px;"></div>
          </div>

          <!-- Theme Toggle -->
          <button class="nav-icon-btn" id="theme-toggle-btn" title="Toggle Theme">
            <i class="fa-regular fa-sun" id="theme-toggle-icon"></i>
          </button>

          <!-- Studio Profile / Quick Action Avatar -->
          <div class="studio-avatar-btn" id="user-profile-btn" title="${user.name} (${user.role})">
            <i class="fa-solid fa-bolt"></i>
          </div>
        </div>
      </header>
    `;
  }

  attachEvents(container) {
    const searchTrigger = container.querySelector('#global-search-trigger');
    if (searchTrigger) {
      searchTrigger.addEventListener('click', () => {
        if (this.onOpenCommandPalette) this.onOpenCommandPalette();
      });
    }

    const themeBtn = container.querySelector('#theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light');
        const icon = themeBtn.querySelector('i');
        if (icon) {
          icon.className = isLight ? 'fa-regular fa-moon' : 'fa-regular fa-sun';
        }
      });
    }

    // Notifications Dropdown Handler
    const notifBtn = container.querySelector('#notif-bell-btn');
    const notifDropdown = container.querySelector('#notif-dropdown-box');
    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = notifDropdown.style.display === 'block';
        if (isOpen) {
          notifDropdown.style.display = 'none';
        } else {
          this.renderNotificationDropdown(notifDropdown);
          notifDropdown.style.display = 'block';
        }
      });

      document.addEventListener('click', () => {
        notifDropdown.style.display = 'none';
      });
    }

    // Avatar click -> User Management / Settings
    const profileBtn = container.querySelector('#user-profile-btn');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('settings');
      });
    }

    // Listen to notification events to update badge live
    window.addEventListener('7p-notification', () => {
      this.updateBadge();
    });
    window.addEventListener('7p-notifications-updated', () => {
      this.updateBadge();
    });
  }

  updateBadge() {
    this.unreadNotifsCount = NotificationsService.getUnreadCount();
    const badgeEl = document.getElementById('top-notif-count');
    if (badgeEl) {
      badgeEl.textContent = this.unreadNotifsCount;
      badgeEl.style.display = this.unreadNotifsCount > 0 ? 'flex' : 'none';
    }
  }

  renderNotificationDropdown(container) {
    const list = NotificationsService.getNotifications().slice(0, 4);
    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border-subtle);">
        <span style="font-weight: 700; font-size: 0.88rem; color: #fff;">Notifications</span>
        <button id="mark-all-read-btn" style="font-size: 0.74rem; color: var(--accent-orange); font-weight: 600;">Mark all read</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${list.map(n => `
          <div style="padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid ${n.is_read ? 'transparent' : 'rgba(255,133,0,0.3)'};">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 0.82rem; font-weight: 600; color: #fff;">${n.title}</span>
              <span style="font-size: 0.68rem; color: var(--text-muted);">${new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 4px;">${n.message}</p>
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 12px; text-align: center;">
        <button id="view-all-notifs-btn" style="font-size: 0.76rem; color: var(--text-secondary); font-weight: 600;">View All Notifications →</button>
      </div>
    `;

    container.querySelector('#mark-all-read-btn')?.addEventListener('click', () => {
      NotificationsService.markAllAsRead();
      this.updateBadge();
      container.style.display = 'none';
    });

    container.querySelector('#view-all-notifs-btn')?.addEventListener('click', () => {
      if (this.onNavigate) this.onNavigate('notifications');
      container.style.display = 'none';
    });
  }
}
