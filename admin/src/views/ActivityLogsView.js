// ==============================================================================
// 7P STUDIO CONTROL CENTER — ACTIVITY LOGS (ActivityLogsView.js)
// Comprehensive audit trail of actions taken in the administrative studio
// ==============================================================================

import { ActivityService } from '../services/activityService.js';
import { AdminToast } from '../components/Toast.js';

export class ActivityLogsView {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.categoryFilter = 'all';
  }

  render() {
    const logs = ActivityService.getLogs();
    const filtered = logs.filter(l => this.categoryFilter === 'all' || l.category === this.categoryFilter);

    return `
      <div class="activity-view-container">
        <!-- Module Header -->
        <div class="module-header">
          <div class="module-title-box">
            <h1>Activity Audit Trail</h1>
            <p>Chronological immutable record of studio operations, project modifications, logins, and lead status updates.</p>
          </div>
          <div class="module-actions-bar">
            <button class="btn-secondary" id="export-logs-btn">
              <i class="fa-solid fa-download"></i>
              <span>Export Audit Log</span>
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="table-filter-bar">
          <div class="filter-group-left">
            <select class="filter-select" id="log-category-select">
              <option value="all">All Categories</option>
              <option value="lead">Leads & Inquiries</option>
              <option value="project">Projects CMS</option>
              <option value="settings">Settings & Integrations</option>
              <option value="system">System & Deployments</option>
            </select>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            ${filtered.length} logged events
          </div>
        </div>

        <!-- Activity Table -->
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Action & Details</th>
                <th>Category</th>
                <th>Actor</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(l => `
                <tr>
                  <td>
                    <div style="font-weight: 600; color: #fff;">${l.details}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">${l.action}</div>
                  </td>
                  <td>
                    <span class="badge-status neutral" style="text-transform: uppercase;">${l.category}</span>
                  </td>
                  <td>
                    <div style="font-weight: 500; color: var(--text-primary); font-size: 0.82rem;">${l.user_name}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">${l.user_role}</div>
                  </td>
                  <td style="font-size: 0.78rem; color: var(--text-secondary);">
                    ${new Date(l.created_at).toLocaleString()}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    const select = container.querySelector('#log-category-select');
    if (select) {
      select.value = this.categoryFilter;
      select.addEventListener('change', (e) => {
        this.categoryFilter = e.target.value;
        this.refresh(container);
      });
    }

    const exportBtn = container.querySelector('#export-logs-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const logs = ActivityService.getLogs();
        const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
        const a = document.createElement('a');
        a.href = jsonStr;
        a.download = `7p_activity_audit_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        AdminToast.show('Audit logs exported', 'success');
      });
    }
  }

  refresh(container) {
    container.innerHTML = this.render();
    this.attachEvents(container);
  }
}
