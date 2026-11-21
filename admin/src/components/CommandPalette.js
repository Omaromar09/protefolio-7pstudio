// ==============================================================================
// 7P STUDIO CONTROL CENTER — COMMAND PALETTE (CommandPalette.js)
// Global shortcut modal (Ctrl+K) for instant navigation & studio quick actions
// ==============================================================================

export class CommandPalette {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.isOpen = false;
    this.selectedIndex = 0;
    this.commands = [
      { id: 'overview', title: 'Dashboard Overview', category: 'Navigation', icon: 'fa-solid fa-house' },
      { id: 'leads', title: 'Messages & Leads Inbox', category: 'Leads', icon: 'fa-solid fa-envelope' },
      { id: 'projects', title: 'Projects Management CMS', category: 'CMS', icon: 'fa-solid fa-folder' },
      { id: 'media', title: 'Media Library', category: 'CMS', icon: 'fa-solid fa-photo-film' },
      { id: 'services', title: 'Services Offerings', category: 'CMS', icon: 'fa-solid fa-puzzle-piece' },
      { id: 'testimonials', title: 'Testimonials & Reviews', category: 'CMS', icon: 'fa-solid fa-quote-left' },
      { id: 'pages', title: 'Pages & Sections Content', category: 'CMS', icon: 'fa-solid fa-table-columns' },
      { id: 'analytics', title: 'Analytics Center', category: 'Metrics', icon: 'fa-solid fa-chart-line' },
      { id: 'performance', title: 'Core Web Vitals & Speed', category: 'Metrics', icon: 'fa-solid fa-gauge-high' },
      { id: 'monitoring', title: 'Error Monitoring & Health', category: 'System', icon: 'fa-solid fa-triangle-exclamation' },
      { id: 'deployment', title: 'Vercel Deployment Status', category: 'System', icon: 'fa-solid fa-cloud' },
      { id: 'seo', title: 'SEO & Metadata Manager', category: 'Marketing', icon: 'fa-solid fa-magnifying-glass-chart' },
      { id: 'marketing', title: 'Marketing & Conversion Tracking', category: 'Marketing', icon: 'fa-solid fa-bullhorn' },
      { id: 'activity', title: 'Activity Audit Trail', category: 'Security', icon: 'fa-solid fa-list-check' },
      { id: 'notifications', title: 'Notification Center', category: 'System', icon: 'fa-regular fa-bell' },
      { id: 'users', title: 'User & Role Management', category: 'Security', icon: 'fa-solid fa-users-gear' },
      { id: 'settings', title: 'Settings & Integrations', category: 'Settings', icon: 'fa-solid fa-gear' },
      { id: 'view-site', title: 'Open Public Portfolio (7pstudio.tech)', category: 'Action', icon: 'fa-solid fa-arrow-up-right-from-square', action: () => window.open('/', '_blank') }
    ];

    this.filteredCommands = [...this.commands];
    this.bindGlobalShortcut();
  }

  bindGlobalShortcut() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      }
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    this.isOpen = true;
    this.selectedIndex = 0;
    this.filteredCommands = [...this.commands];
    this.render();
  }

  close() {
    this.isOpen = false;
    const root = document.getElementById('command-palette-root');
    if (root) root.innerHTML = '';
  }

  filter(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      this.filteredCommands = [...this.commands];
    } else {
      this.filteredCommands = this.commands.filter(c =>
        c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
      );
    }
    this.selectedIndex = 0;
    this.renderResults();
  }

  render() {
    const root = document.getElementById('command-palette-root');
    if (!root) return;

    root.innerHTML = `
      <div class="modal-overlay is-active" id="cmd-overlay">
        <div class="command-palette-dialog">
          <div class="command-search-header">
            <i class="fa-solid fa-magnifying-glass" style="color: var(--accent-orange); font-size: 1.1rem;"></i>
            <input type="text" class="command-search-input" id="cmd-input" placeholder="Type a command, section or action..." autofocus />
            <span class="kbd-shortcut">ESC</span>
          </div>
          <div class="command-results-list" id="cmd-results"></div>
        </div>
      </div>
    `;

    const input = root.querySelector('#cmd-input');
    const overlay = root.querySelector('#cmd-overlay');

    if (input) {
      input.focus();
      input.addEventListener('input', (e) => this.filter(e.target.value));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex + 1) % this.filteredCommands.length;
          this.renderResults();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex - 1 + this.filteredCommands.length) % this.filteredCommands.length;
          this.renderResults();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.executeSelected();
        }
      });
    }

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.close();
      });
    }

    this.renderResults();
  }

  renderResults() {
    const container = document.getElementById('cmd-results');
    if (!container) return;

    if (this.filteredCommands.length === 0) {
      container.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
          No matching commands found.
        </div>
      `;
      return;
    }

    container.innerHTML = this.filteredCommands.map((cmd, idx) => `
      <div class="command-result-item ${idx === this.selectedIndex ? 'is-selected' : ''}" data-idx="${idx}">
        <i class="${cmd.icon}" style="color: ${idx === this.selectedIndex ? 'var(--accent-orange)' : 'var(--text-muted)'}; width: 20px; text-align: center;"></i>
        <span style="font-weight: 500; flex: 1;">${cmd.title}</span>
        <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">${cmd.category}</span>
      </div>
    `).join('');

    container.querySelectorAll('.command-result-item').forEach(item => {
      item.addEventListener('click', () => {
        this.selectedIndex = parseInt(item.getAttribute('data-idx'));
        this.executeSelected();
      });
    });
  }

  executeSelected() {
    const cmd = this.filteredCommands[this.selectedIndex];
    if (cmd) {
      this.close();
      if (cmd.action) {
        cmd.action();
      } else if (this.onNavigate) {
        this.onNavigate(cmd.id);
      }
    }
  }
}
