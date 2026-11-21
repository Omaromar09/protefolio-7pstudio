// ==============================================================================
// 7P STUDIO CONTROL CENTER — MASTER APPLICATION BOOTSTRAP (main.js)
// ==============================================================================

import { Sidebar } from './components/Sidebar.js';
import { TopNav } from './components/TopNav.js';
import { CommandPalette } from './components/CommandPalette.js';
import { AdminToast } from './components/Toast.js';
import { AuthService } from './services/auth.js';

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
  }

  getRouteFromHash() {
    const hash = window.location.hash.replace('#', '').trim();
    return hash || 'overview';
  }

  init() {
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

    // Hash change listener
    window.addEventListener('hashchange', () => {
      const newRoute = this.getRouteFromHash();
      this.renderRoute(newRoute);
    });

    // Initial render
    this.renderRoute(this.currentRoute);

    // Initial Welcome Toast
    setTimeout(() => {
      AdminToast.show('Welcome to 7P STUDIO Control Center', 'info');
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

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new AdminApp();
  app.init();
});
