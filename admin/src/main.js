// ==============================================================================
// 7P STUDIO CONTROL CENTER — MASTER APPLICATION BOOTSTRAP (main.js)
// Real-time synchronization engine with BroadcastChannel, Audio Chime, & WebSockets
// ==============================================================================

import { Sidebar } from './components/Sidebar.js';
import { TopNav } from './components/TopNav.js';
import { CommandPalette } from './components/CommandPalette.js';
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

// Web Audio API Synth Chime (Zero external mp3 needed)
function playLeadArrivalChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // Note D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.14); // Note A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
}

class AdminApp {
  constructor() {
    this.currentRoute = this.getRouteFromHash() || 'overview';
    this.sidebar = null;
    this.topNav = null;
    this.commandPalette = null;
    this._lastLeadCount = 0;
  }

  getRouteFromHash() {
    const hash = window.location.hash.replace('#', '').trim();
    return hash || 'overview';
  }

  init() {
    // 1. Apply primary language and direction to DOM (Arabic default)
    AdminI18n.applyToDOM();

    const appRoot = document.getElementById('admin-app');
    if (!appRoot) return;

    // Build the master shell layout
    appRoot.innerHTML = `
      <div class="admin-shell">
        <div id="sidebar-mount-point"></div>
        <div class="admin-main">
          <div id="topnav-mount-point"></div>
          <main class="view-content-area" id="view-mount-point"></main>
        </div>
      </div>
    `;

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
    });

    // Real-Time Cross-Tab Synchronization Handlers
    const handleIncomingLead = (lead) => {
      playLeadArrivalChime();
      const isAr = AdminI18n.getLanguage() === 'ar';
      const clientName = lead?.name || (isAr ? 'عميل جديد' : 'New Client');
      AdminToast.show(
        isAr ? `🔔 طلب مشروع جديد وصل الآن من: ${clientName}!` : `🔔 New project inquiry received from: ${clientName}!`,
        'success'
      );

      // Add to internal notifications
      NotificationsService.addNotification({
        title: isAr ? 'طلب مشروع جديد 🚀' : 'New Project Inquiry 🚀',
        message: `${clientName} (${lead?.project_type || 'طلب عام'})`,
        type: 'lead',
        action_url: '#leads'
      });

      // Update badge live
      if (this.topNav) this.topNav.updateBadge();

      // Refresh sidebar badge
      const sidebarMount = document.getElementById('sidebar-mount-point');
      if (sidebarMount) {
        this.sidebar = new Sidebar(this.currentRoute, (targetRoute) => this.navigate(targetRoute));
        sidebarMount.innerHTML = this.sidebar.render();
        this.sidebar.attachEvents(sidebarMount);
      }

      // Live Re-render active view to show lead immediately without refresh
      this.renderRoute(this.currentRoute);
    };

    // 1. BroadcastChannel (Millisecond instant sync between portfolio & control center tabs)
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

    // 2. Cross-tab Storage Listener
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

    // 3. Same-window custom event listener
    window.addEventListener('7p-notification', (e) => {
      if (e.detail) handleIncomingLead(e.detail);
    });

    // 4. Supabase Realtime WebSocket Listener (For cross-device & mobile-to-laptop instant sync)
    LeadsService.setupRealtimeListener((newLead) => {
      handleIncomingLead(newLead);
    });

    // 5. Background Heartbeat Auto-Sync Polling (Every 3 seconds)
    setInterval(async () => {
      try {
        const leads = await LeadsService.getLeads();
        if (this._lastLeadCount > 0 && leads.length > this._lastLeadCount) {
          handleIncomingLead(leads[0]);
        }
        this._lastLeadCount = leads.length;
      } catch (pollErr) {}
    }, 3000);

    // Initial render
    this.renderRoute(this.currentRoute);

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

    viewMount.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 300px; color: var(--accent-orange);">
        <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem;"></i>
      </div>
    `;

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
