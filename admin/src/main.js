// ==============================================================================
// 7P STUDIO CONTROL CENTER — MASTER APPLICATION BOOTSTRAP (main.js)
// Protected Access Gate (7pstudio / 010010), Responsive Mobile UI, Silent Auto-Sync
// ==============================================================================

import { Sidebar } from './components/Sidebar.js';
import { TopNav } from './components/TopNav.js';
import { CommandPalette } from './components/CommandPalette.js';
import { LoginScreen } from './components/LoginScreen.js';
import { AdminToast } from './components/Toast.js';
import { AuthService } from './services/auth.js';
import { AdminI18n } from './services/i18nAdmin.js';
import { LeadsService } from './services/leadsService.js';
import { NotificationsService } from './services/notificationsService.js';

// Views
import { OverviewView } from './views/OverviewView.js';
import { LeadsView } from './views/LeadsView.js';
import { ProjectsView } from './views/ProjectsView.js';
import { MediaLibraryView } from './views/MediaLibraryView.js';
import { ServicesView } from './views/ServicesView.js';
import { TestimonialsView } from './views/TestimonialsView.js';
import { PagesView } from './views/PagesView.js';
import { AnalyticsView } from './views/AnalyticsView.js';
import { PerformanceView } from './views/PerformanceView.js';
import { ErrorMonitoringView } from './views/ErrorMonitoringView.js';
import { VercelDeploymentView } from './views/VercelDeploymentView.js';
import { SeoManagerView } from './views/SeoManagerView.js';
import { MarketingView } from './views/MarketingView.js';
import { ActivityLogsView } from './views/ActivityLogsView.js';
import { NotificationsView } from './views/NotificationsView.js';
import { UserManagementView } from './views/UserManagementView.js';
import { SettingsView } from './views/SettingsView.js';

class AdminApp {
  constructor() {
    this.currentRoute = this.getRouteFromHash() || 'overview';
    this.sidebar = null;
    this.topNav = null;
    this.commandPalette = null;
    this._notifiedLeadIds = new Set();
    this._isFirstLoad = true;
  }

  getRouteFromHash() {
    const hash = window.location.hash.replace('#', '').trim();
    return hash || 'overview';
  }

  init() {
    AdminI18n.applyToDOM();

    const appRoot = document.getElementById('admin-app');
    if (!appRoot) return;

    // 1. Check Authentication Gate
    if (!AuthService.isAuthenticated()) {
      const login = new LoginScreen(() => {
        this.init();
      });
      appRoot.innerHTML = login.render();
      login.attachEvents(appRoot);
      return;
    }

    // 2. Build the master shell layout with mobile backdrop
    appRoot.innerHTML = `
      <div class="admin-shell">
        <div class="mobile-sidebar-backdrop" id="mobile-sidebar-backdrop"></div>
        <div id="sidebar-mount-point"></div>
        <div class="admin-main">
          <div id="topnav-mount-point"></div>
          <main class="view-content-area" id="view-mount-point"></main>
        </div>
      </div>
    `;

    // Close mobile sidebar when clicking backdrop
    const backdrop = document.getElementById('mobile-sidebar-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        const sidebar = document.querySelector('.admin-sidebar');
        if (sidebar) sidebar.classList.remove('mobile-open');
        backdrop.classList.remove('is-visible');
      });
    }

    // Instantiate Command Palette
    this.commandPalette = new CommandPalette((targetRoute) => {
      this.navigate(targetRoute);
    });

    // Instantiate TopNav
    this.topNav = new TopNav(
      () => this.commandPalette.open(),
      (targetRoute) => this.navigate(targetRoute)
    );
    const topNavMount = document.getElementById('topnav-mount-point');
    if (topNavMount) {
      topNavMount.innerHTML = this.topNav.render();
      this.topNav.attachEvents(topNavMount);
    }

    // Language Change Listener -> Live re-render
    window.addEventListener('admin-lang-change', () => {
      if (this.topNav && topNavMount) {
        topNavMount.innerHTML = this.topNav.render();
        this.topNav.attachEvents(topNavMount);
      }
      const sidebarMount = document.getElementById('sidebar-mount-point');
      if (sidebarMount) {
        this.sidebar = new Sidebar(this.currentRoute, (targetRoute) => this.navigate(targetRoute));
        sidebarMount.innerHTML = this.sidebar.render();
        this.sidebar.attachEvents(sidebarMount);
      }
      this.renderRoute(this.currentRoute);
      AdminToast.show(AdminI18n.getLanguage() === 'ar' ? 'تم تحويل اللغة إلى العربية (افتراضي)' : 'Switched to English', 'info');
    });

    // Hash change listener
    window.addEventListener('hashchange', () => {
      const newRoute = this.getRouteFromHash();
      this.renderRoute(newRoute);
      // Close mobile sidebar on navigation
      const sidebar = document.querySelector('.admin-sidebar');
      const backdropEl = document.getElementById('mobile-sidebar-backdrop');
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (backdropEl) backdropEl.classList.remove('is-visible');
    });

    // Silent, Deduplicated Lead Handler (Sound is completely muted as requested)
    const handleIncomingLead = (lead) => {
      if (!lead || !lead.id) return;
      if (this._notifiedLeadIds.has(String(lead.id))) return;
      this._notifiedLeadIds.add(String(lead.id));

      if (!this._isFirstLoad) {
        const isAr = AdminI18n.getLanguage() === 'ar';
        const clientName = lead.name || (isAr ? 'عميل جديد' : 'New Client');
        AdminToast.show(
          isAr ? `طلب مشروع جديد من: ${clientName}` : `New lead from: ${clientName}`,
          'success'
        );

        NotificationsService.addNotification({
          title: isAr ? 'طلب مشروع جديد' : 'New Project Inquiry',
          message: `${clientName} (${lead.project_type || 'طلب عام'})`,
          type: 'lead',
          action_url: '#leads'
        });
      }

      if (this.topNav) this.topNav.updateBadge();
      this.renderRoute(this.currentRoute);
    };

    // BroadcastChannel for instant same-browser cross-tab sync
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const syncChannel = new BroadcastChannel('7p_studio_sync_channel');
        syncChannel.onmessage = (event) => {
          if (event.data && event.data.type === 'NEW_LEAD') {
            handleIncomingLead(event.data.lead);
          }
        };
      } catch (bcErr) {}
    }

    // Cross-tab storage listener
    window.addEventListener('storage', (e) => {
      if (e.key === '7p_studio_last_lead_ping' || e.key === '7p_studio_leads_list') {
        try {
          const stored = JSON.parse(localStorage.getItem('7p_studio_leads_list') || '[]');
          if (stored.length > 0) {
            handleIncomingLead(stored[0]);
          }
        } catch (err) {}
      }
    });

    // Supabase Realtime WebSocket Listener (Silent & instantaneous)
    LeadsService.setupRealtimeListener((newLead) => {
      handleIncomingLead(newLead);
    });

    // Silent background auto-sync heartbeat (every 5 seconds)
    setInterval(async () => {
      try {
        const leads = await LeadsService.getLeads();
        leads.forEach(l => {
          if (l && l.id && !this._notifiedLeadIds.has(String(l.id))) {
            handleIncomingLead(l);
          }
        });
      } catch (pollErr) {}
    }, 5000);

    // Initial render
    this.renderRoute(this.currentRoute).then(() => {
      setTimeout(() => {
        this._isFirstLoad = false;
      }, 1500);
    });

    // Initial Welcome Toast
    setTimeout(() => {
      const isAr = AdminI18n.getLanguage() === 'ar';
      AdminToast.show(isAr ? 'مرحباً بك في لوحة تحكم 7P STUDIO المركزية' : 'Welcome to 7P STUDIO Control Center', 'info');
    }, 400);
  }

  navigate(route) {
    window.location.hash = route;
  }

  async renderRoute(route) {
    this.currentRoute = route;

    // Re-render sidebar to highlight active item
    const sidebarMount = document.getElementById('sidebar-mount-point');
    if (sidebarMount) {
      this.sidebar = new Sidebar(route, (targetRoute) => this.navigate(targetRoute));
      sidebarMount.innerHTML = this.sidebar.render();
      this.sidebar.attachEvents(sidebarMount);
    }

    const viewMount = document.getElementById('view-mount-point');
    if (!viewMount) return;

    let viewInstance = null;

    switch (route) {
      case 'overview':
        viewInstance = new OverviewView((r) => this.navigate(r));
        break;
      case 'leads':
      case 'messages':
        viewInstance = new LeadsView((r) => this.navigate(r));
        break;
      case 'projects':
        viewInstance = new ProjectsView((r) => this.navigate(r));
        break;
      case 'media':
        viewInstance = new MediaLibraryView((r) => this.navigate(r));
        break;
      case 'services':
        viewInstance = new ServicesView((r) => this.navigate(r));
        break;
      case 'testimonials':
        viewInstance = new TestimonialsView((r) => this.navigate(r));
        break;
      case 'pages':
        viewInstance = new PagesView((r) => this.navigate(r));
        break;
      case 'analytics':
        viewInstance = new AnalyticsView((r) => this.navigate(r));
        break;
      case 'performance':
        viewInstance = new PerformanceView((r) => this.navigate(r));
        break;
      case 'monitoring':
        viewInstance = new ErrorMonitoringView((r) => this.navigate(r));
        break;
      case 'deployment':
        viewInstance = new VercelDeploymentView((r) => this.navigate(r));
        break;
      case 'seo':
        viewInstance = new SeoManagerView((r) => this.navigate(r));
        break;
      case 'marketing':
        viewInstance = new MarketingView((r) => this.navigate(r));
        break;
      case 'activity':
        viewInstance = new ActivityLogsView((r) => this.navigate(r));
        break;
      case 'notifications':
        viewInstance = new NotificationsView((r) => this.navigate(r));
        break;
      case 'users':
        viewInstance = new UserManagementView((r) => this.navigate(r));
        break;
      case 'settings':
        viewInstance = new SettingsView((r) => this.navigate(r));
        break;
      default:
        viewInstance = new OverviewView((r) => this.navigate(r));
    }

    const html = await viewInstance.render();
    viewMount.innerHTML = html;
    if (viewInstance.attachEvents) {
      viewInstance.attachEvents(viewMount);
    }
  }
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new AdminApp();
  app.init();
});
