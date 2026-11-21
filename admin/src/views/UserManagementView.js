// ==============================================================================
// 7P STUDIO CONTROL CENTER — USER MANAGEMENT & RBAC (UserManagementView.js)
// Roles: Owner, Admin, Editor with security permissions
// ==============================================================================

import { AuthService } from '../services/auth.js';
import { AdminToast } from '../components/Toast.js';

export class UserManagementView {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.users = [
      { id: 'u1', name: 'Omar / 7P Studio', email: 'admin@7pstudio.tech', role: 'owner', lastActive: 'Active Now' },
      { id: 'u2', name: '7P Support Lead', email: 'support@7pstudio.tech', role: 'admin', lastActive: '2 hours ago' },
      { id: 'u3', name: 'Content Editor', email: 'editor@7pstudio.tech', role: 'editor', lastActive: 'Yesterday' }
    ];
  }

  render() {
    const currentUser = AuthService.getCurrentUser();

    return `
      <div class="users-view-container">
        <!-- Module Header -->
        <div class="module-header">
          <div class="module-title-box">
            <h1>User & Role Management</h1>
            <p>Admin security access levels, password configurations, and team roles for 7P Studio.</p>
          </div>
          <div class="module-actions-bar">
            <button class="btn-primary" id="invite-user-btn">
              <i class="fa-solid fa-user-plus"></i>
              <span>Add Admin User</span>
            </button>
          </div>
        </div>

        <!-- Role Overview Banner -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
          <div class="glass-panel" style="padding: 18px;">
            <div style="font-weight: 700; color: #fff; font-size: 0.95rem; margin-bottom: 4px;">OWNER</div>
            <p style="font-size: 0.74rem; color: var(--text-muted); line-height: 1.4;">
              Full unconstrained access to settings, database backups, integrations, and user creation.
            </p>
          </div>
          <div class="glass-panel" style="padding: 18px;">
            <div style="font-weight: 700; color: #fff; font-size: 0.95rem; margin-bottom: 4px;">ADMIN</div>
            <p style="font-size: 0.74rem; color: var(--text-muted); line-height: 1.4;">
              Manages leads, customer inquiries, projects CMS, media library, and content updates.
            </p>
          </div>
          <div class="glass-panel" style="padding: 18px;">
            <div style="font-weight: 700; color: #fff; font-size: 0.95rem; margin-bottom: 4px;">EDITOR</div>
            <p style="font-size: 0.74rem; color: var(--text-muted); line-height: 1.4;">
              Restricted access to edit draft projects, upload images, and preview website changes.
            </p>
          </div>
        </div>

        <!-- Users Table -->
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>User Profile</th>
                <th>Role</th>
                <th>Access Level</th>
                <th>Last Active</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${this.users.map(u => `
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #FF8500, #FF6000); display: flex; align-items: center; justify-content: center; color: #000; font-weight: 700; font-size: 0.88rem;">
                        ${u.name.slice(0, 1)}
                      </div>
                      <div>
                        <div style="font-weight: 600; color: #fff;">${u.name} ${u.email === currentUser.email ? '<span style="font-size: 0.7rem; color: var(--accent-orange);">(You)</span>' : ''}</div>
                        <div style="font-size: 0.74rem; color: var(--text-muted);">${u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge-status ${u.role === 'owner' ? 'discussion' : (u.role === 'admin' ? 'success' : 'neutral')}" style="text-transform: uppercase;">
                      ${u.role}
                    </span>
                  </td>
                  <td style="font-size: 0.8rem; color: var(--text-secondary);">
                    ${u.role === 'owner' ? 'Full Studio Control' : (u.role === 'admin' ? 'Content & Leads' : 'Content Only')}
                  </td>
                  <td style="font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono);">
                    ${u.lastActive}
                  </td>
                  <td style="text-align: right;">
                    ${u.role !== 'owner' ? `
                      <button class="btn-icon" title="Remove User" style="color: var(--status-red);">
                        <i class="fa-regular fa-trash-can"></i>
                      </button>
                    ` : '<span style="font-size: 0.72rem; color: var(--text-muted);">Protected</span>'}
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
    const inviteBtn = container.querySelector('#invite-user-btn');
    if (inviteBtn) {
      inviteBtn.addEventListener('click', () => {
        const email = prompt('Enter new administrator email:');
        if (email) {
          this.users.push({
            id: 'u_' + Date.now(),
            name: email.split('@')[0],
            email,
            role: 'admin',
            lastActive: 'Just invited'
          });
          AdminToast.show(`Invitation sent to ${email}`, 'success');
          container.innerHTML = this.render();
          this.attachEvents(container);
        }
      });
    }
  }
}
