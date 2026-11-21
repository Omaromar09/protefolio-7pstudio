// ==============================================================================
// 7P STUDIO CONTROL CENTER — TOP NAVIGATION (TopNav.js)
// Responsive mobile support, Language Switcher, Logout, Theme, Notifications
// ==============================================================================

import { NotificationsService } from '../services/notificationsService.js';
import { AuthService } from '../services/auth.js';
import { AdminI18n } from '../services/i18nAdmin.js';

export class TopNav {
  constructor(onOpenCommandPalette, onNavigate) {
    this.onOpenCommandPalette = onOpenCommandPalette;
    this.onNavigate = onNavigate;
    this.unreadNotifsCount = NotificationsService.getUnreadCount();
  }

  render() {
    const user = AuthService.getCurrentUser();
    const currentLang = AdminI18n.getLanguage();
    const isAr = currentLang === 'ar';

    return `
      <header class="top-navbar">
        <div style="display: flex; align-items: center; gap: 10px;">
          <!-- Mobile Hamburger Toggle Button (Visible on screens <= 768px) -->
          <button class="nav-icon-btn mobile-menu-btn" id="mobile-sidebar-toggle-btn" title="القائمة">
            <i class="fa-solid fa-bars"></i>
          </button>

          <!-- Global Search Input with Keyboard Shortcut -->
          <div class="global-search-container" id="global-search-trigger">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <span>${AdminI18n.t('searchPlaceholder')}</span>
            <span class="kbd-shortcut">Ctrl + K</span>
          </div>
        </div>

        <!-- Top Right Actions -->
        <div class="top-navbar-actions">
          <!-- Language Toggle Pill -->
          <button class="lang-switch-btn" id="lang-switch-btn" title="تبديل اللغة / Switch Language">
            <i class="fa-solid fa-globe"></i>
            <span>${isAr ? '🇬🇧 EN' : '🇸🇦 العربية'}</span>
          </button>

          <!-- Notification Bell -->
          <div class="relative-wrap" style="position: relative;">
            <button class="nav-icon-btn" id="notif-bell-btn" title="${AdminI18n.t('notifications')}">
              <i class="fa-regular fa-bell"></i>
              ${this.unreadNotifsCount > 0 ? `<span class="badge-count" id="top-notif-count">${this.unreadNotifsCount}</span>` : ''}
            </button>
            <div id="notif-dropdown-box" class="top-notif-dropdown" style="display: none;"></div>
          </div>

          <!-- Theme Toggle -->
          <button class="nav-icon-btn" id="theme-toggle-btn" title="${AdminI18n.t('toggleTheme')}">
            <i class="fa-regular fa-sun" id="theme-toggle-icon"></i>
          </button>

          <!-- Logout Button -->
          <button class="nav-icon-btn" id="admin-logout-btn" title="تسجيل الخروج (Logout)" style="color: var(--status-red);">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
          </button>

          <!-- Studio Profile / Avatar -->
          <div class="studio-avatar-btn" id="user-profile-btn" title="${user.name}">
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

    // Mobile Hamburger button handler
    const mobileToggleBtn = container.querySelector('#mobile-sidebar-toggle-btn');
    if (mobileToggleBtn) {
      mobileToggleBtn.addEventListener('click', () => {
        const sidebar = document.querySelector('.admin-sidebar');
        const backdrop = document.querySelector('.mobile-sidebar-backdrop');
        if (sidebar) sidebar.classList.toggle('mobile-open');
        if (backdrop) backdrop.classList.toggle('is-visible');
      });
    }

    // Language toggle
    const langBtn = container.querySelector('#lang-switch-btn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        AdminI18n.toggleLanguage();
      });
    }

    // Theme toggle
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

    // Logout button handler
    const logoutBtn = container.querySelector('#admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        const isAr = AdminI18n.getLanguage() === 'ar';
        if (confirm(isAr ? 'هل تريد تسجيل الخروج من لوحة التحكم؟' : 'Are you sure you want to log out?')) {
          AuthService.logout();
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

    // Avatar click
    const profileBtn = container.querySelector('#user-profile-btn');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('settings');
      });
    }

    // Listen to notification events to update badge live
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
    const list = NotificationsService.getNotifications().slice(0, 6);
    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border-subtle);">
        <span style="font-weight: 700; font-size: 0.88rem; color: #fff;">${AdminI18n.t('notifications')} (${list.length})</span>
        <button id="mark-all-read-btn" style="font-size: 0.74rem; color: var(--accent-orange); font-weight: 600; cursor: pointer; background: none; border: none;">${AdminI18n.t('markAllRead')}</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto;">
        ${list.length === 0 ? `
          <div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 12px;">${AdminI18n.t('noNotifications')}</div>
        ` : list.map(n => `
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
        <button id="view-all-notifs-btn" style="font-size: 0.76rem; color: var(--text-secondary); font-weight: 600; cursor: pointer; background: none; border: none;">${AdminI18n.t('viewAllNotifications')}</button>
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
