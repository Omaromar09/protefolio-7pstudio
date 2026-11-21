// ==============================================================================
// 7P STUDIO CONTROL CENTER — SETTINGS VIEW (SettingsView.js)
// General, Website maintenance mode, Integrations, Backup & Export
// ==============================================================================

import { SettingsService } from '../services/settingsService.js';
import { AdminToast } from '../components/Toast.js';
import { AuthService } from '../services/auth.js';

export class SettingsView {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.activeTab = 'general';
  }

  render() {
    const settings = SettingsService.getSettings();
    const general = settings.general || {};
    const website = settings.website || {};
    const integrations = settings.integrations || {};

    return `
      <div class="settings-view-container">
        <!-- Module Header -->
        <div class="module-header">
          <div class="module-title-box">
            <h1>Settings & Studio Configuration</h1>
            <p>Manage 7P STUDIO brand identity, external API integrations, database backups, and security policies.</p>
          </div>
          <div class="module-actions-bar">
            <button class="btn-secondary" id="logout-btn" style="color: var(--status-red);">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>

        <!-- Settings Tabs -->
        <div style="display: flex; gap: 10px; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; overflow-x: auto;">
          <button class="nav-item ${this.activeTab === 'general' ? 'active' : ''}" data-tab="general" style="border-radius: var(--radius-full); padding: 8px 18px;">
            <i class="fa-solid fa-sliders"></i> General
          </button>
          <button class="nav-item ${this.activeTab === 'integrations' ? 'active' : ''}" data-tab="integrations" style="border-radius: var(--radius-full); padding: 8px 18px;">
            <i class="fa-solid fa-plug"></i> Integrations
          </button>
          <button class="nav-item ${this.activeTab === 'backups' ? 'active' : ''}" data-tab="backups" style="border-radius: var(--radius-full); padding: 8px 18px;">
            <i class="fa-solid fa-database"></i> Database & Backups
          </button>
        </div>

        <!-- Tab 1: General -->
        ${this.activeTab === 'general' ? `
          <div class="glass-panel" style="padding: 28px; max-width: 780px;">
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 16px;">General Studio Identity</h3>

            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Studio Name</label>
                  <input type="text" class="search-input-field" id="set-studio-name" value="${general.studioName || '7P STUDIO'}" />
                </div>
                <div>
                  <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Tagline</label>
                  <input type="text" class="search-input-field" id="set-tagline" value="${general.tagline || 'Modern Web Development Studio'}" />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Production Domain</label>
                  <input type="url" class="search-input-field" id="set-url" value="${general.websiteUrl || 'https://7pstudio.tech'}" />
                </div>
                <div>
                  <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Official Studio Email</label>
                  <input type="email" class="search-input-field" id="set-email" value="${general.contactEmail || 'contact@7pstudio.tech'}" />
                </div>
              </div>

              <!-- Maintenance Mode Toggle -->
              <div style="padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <div style="font-weight: 600; color: #fff; font-size: 0.9rem;">Maintenance Mode</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">When enabled, visitors see a temporary status screen while administrators can still access the dashboard.</div>
                </div>
                <input type="checkbox" id="set-maintenance" ${website.maintenanceMode ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: var(--accent-orange); cursor: pointer;" />
              </div>

              <div style="margin-top: 10px;">
                <button class="btn-primary" id="save-general-settings-btn">
                  <i class="fa-solid fa-floppy-disk"></i>
                  <span>Save General Settings</span>
                </button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Tab 2: Integrations -->
        ${this.activeTab === 'integrations' ? `
          <div class="glass-panel" style="padding: 28px; max-width: 780px;">
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 16px;">Connected Cloud Services</h3>

            <div style="display: flex; flex-direction: column; gap: 20px;">
              <!-- Supabase PostgreSQL -->
              <div style="padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 32px; height: 32px; border-radius: 8px; background: #3ECF8E; display: flex; align-items: center; justify-content: center; color: #000; font-weight: 800; font-size: 0.85rem;"><i class="fa-solid fa-bolt"></i></div>
                    <div>
                      <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">Supabase PostgreSQL Database</div>
                      <div style="font-size: 0.72rem; color: var(--text-muted);">Row Level Security, Realtime subscriptions & Auth</div>
                    </div>
                  </div>
                  <span class="badge-status success"><span class="dot"></span>Ready</span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                  <div>
                    <label style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Supabase URL</label>
                    <input type="text" class="search-input-field" id="supabase-url-input" placeholder="https://your-project.supabase.co" value="${integrations.supabaseUrl || ''}" />
                  </div>
                  <div>
                    <label style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Supabase Anon Key</label>
                    <input type="password" class="search-input-field" id="supabase-key-input" placeholder="eyJhbGciOi..." value="${integrations.supabaseAnonKey || ''}" />
                  </div>
                </div>
              </div>

              <!-- Vercel Hosting -->
              <div style="padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 32px; height: 32px; border-radius: 8px; background: #000; border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; color: #fff;">
                      <svg width="16" height="16" viewBox="0 0 76 65" fill="#fff"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/></svg>
                    </div>
                    <div>
                      <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">Vercel Platform</div>
                      <div style="font-size: 0.72rem; color: var(--text-muted);">Edge Network & Serverless Functions (7pstudio.tech)</div>
                    </div>
                  </div>
                  <span class="badge-status success"><span class="dot"></span>Live Production</span>
                </div>
              </div>

              <div>
                <button class="btn-primary" id="save-integrations-btn">
                  <i class="fa-solid fa-floppy-disk"></i>
                  <span>Save Integration Credentials</span>
                </button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Tab 3: Backups & Database -->
        ${this.activeTab === 'backups' ? `
          <div class="glass-panel" style="padding: 28px; max-width: 780px;">
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 12px;">Database Backup & Full Studio Export</h3>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 20px;">
              Export all studio data (Leads, Projects CMS, Testimonials, Services, Content sections, and Activity logs) as a single portable JSON snapshot.
            </p>

            <div style="display: flex; gap: 12px;">
              <button class="btn-primary" id="export-full-backup-btn">
                <i class="fa-solid fa-cloud-arrow-down"></i>
                <span>Download Full JSON Snapshot</span>
              </button>
              <button class="btn-secondary" id="reset-demo-data-btn" style="color: var(--status-amber);">
                <i class="fa-solid fa-arrow-rotate-left"></i>
                <span>Reset to Clean Studio Defaults</span>
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  attachEvents(container) {
    container.querySelectorAll('.nav-item[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeTab = tab.getAttribute('data-tab');
        this.refresh(container);
      });
    });

    // Save General
    const saveGenBtn = container.querySelector('#save-general-settings-btn');
    if (saveGenBtn) {
      saveGenBtn.addEventListener('click', () => {
        SettingsService.updateSettings('general', {
          studioName: container.querySelector('#set-studio-name').value,
          tagline: container.querySelector('#set-tagline').value,
          websiteUrl: container.querySelector('#set-url').value,
          contactEmail: container.querySelector('#set-email').value
        });
        SettingsService.updateSettings('website', {
          maintenanceMode: container.querySelector('#set-maintenance').checked
        });
        AdminToast.show('General settings saved', 'success');
      });
    }

    // Save Integrations
    const saveIntBtn = container.querySelector('#save-integrations-btn');
    if (saveIntBtn) {
      saveIntBtn.addEventListener('click', () => {
        SettingsService.updateSettings('integrations', {
          supabaseUrl: container.querySelector('#supabase-url-input').value,
          supabaseAnonKey: container.querySelector('#supabase-key-input').value
        });
        AdminToast.show('Integration keys saved. Reload to activate cloud connection.', 'success');
      });
    }

    // Backup Full JSON
    const exportBtn = container.querySelector('#export-full-backup-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const fullBackup = {
          studio: '7P STUDIO',
          version: '2.0.0',
          exportedAt: new Date().toISOString(),
          settings: SettingsService.getSettings(),
          storageDump: { ...localStorage }
        };
        const str = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
        const a = document.createElement('a');
        a.href = str;
        a.download = `7P_STUDIO_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        AdminToast.show('Full studio backup snapshot downloaded', 'success');
      });
    }

    // Reset Clean
    const resetBtn = container.querySelector('#reset-demo-data-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset studio data to factory seed settings?')) {
          localStorage.clear();
          AdminToast.show('Resetting data...', 'info');
          setTimeout(() => window.location.reload(), 600);
        }
      });
    }

    // Logout
    const logoutBtn = container.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        AuthService.logout();
      });
    }
  }

  refresh(container) {
    container.innerHTML = this.render();
    this.attachEvents(container);
  }
}
