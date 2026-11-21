// ==============================================================================
// 7P STUDIO CONTROL CENTER — MESSAGES & LEADS VIEW (LeadsView.js)
// Critical Feature: Pipeline Kanban, Table Inbox, Details Drawer, Notes & Actions
// Fully translated in Arabic (Primary) & English with Zero Mock Data
// ==============================================================================

import { LeadsService } from '../services/leadsService.js';
import { AdminToast } from '../components/Toast.js';
import { AdminI18n } from '../services/i18nAdmin.js';

export class LeadsView {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.viewMode = 'table'; // 'table' | 'kanban'
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.activeLead = null;
  }

  async render() {
    const leads = await LeadsService.getLeads();
    const isAr = AdminI18n.getLanguage() === 'ar';
    
    // Filter
    let filtered = leads.filter(l => {
      const matchSearch = !this.searchQuery || 
        (l.name && l.name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (l.email && l.email.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (l.phone && l.phone.includes(this.searchQuery)) ||
        (l.project_type && l.project_type.toLowerCase().includes(this.searchQuery.toLowerCase()));
      
      const matchStatus = this.statusFilter === 'all' || l.status === this.statusFilter;
      return matchSearch && matchStatus;
    });

    const unreadCount = leads.filter(l => !l.is_read).length;

    return `
      <div class="leads-view-container">
        <!-- Module Header -->
        <div class="module-header">
          <div class="module-title-box">
            <h1>${AdminI18n.t('leadsTitle')}</h1>
            <p>${AdminI18n.t('leadsSubtitle')} (${unreadCount} ${isAr ? 'غير مقروء' : 'unread'})</p>
          </div>
          <div class="module-actions-bar">
            <!-- View Mode Switcher -->
            <div style="background: var(--bg-input); border: 1px solid var(--border-subtle); border-radius: var(--radius-full); padding: 3px; display: flex;">
              <button class="view-switch-btn ${this.viewMode === 'table' ? 'active' : ''}" id="mode-table-btn" style="padding: 6px 12px; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 600; color: ${this.viewMode === 'table' ? '#fff' : 'var(--text-muted)'}; background: ${this.viewMode === 'table' ? 'rgba(255,133,0,0.25)' : 'none'}; border: none; cursor: pointer;">
                <i class="fa-solid fa-table-list"></i> ${AdminI18n.t('tableView')}
              </button>
              <button class="view-switch-btn ${this.viewMode === 'kanban' ? 'active' : ''}" id="mode-kanban-btn" style="padding: 6px 12px; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 600; color: ${this.viewMode === 'kanban' ? '#fff' : 'var(--text-muted)'}; background: ${this.viewMode === 'kanban' ? 'rgba(255,133,0,0.25)' : 'none'}; border: none; cursor: pointer;">
                <i class="fa-solid fa-chart-gantt"></i> ${AdminI18n.t('pipelineView')}
              </button>
            </div>

            <!-- Export to CSV -->
            <button class="btn-secondary" id="export-leads-csv-btn">
              <i class="fa-solid fa-file-csv"></i>
              <span>${AdminI18n.t('exportCsv')}</span>
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="table-filter-bar">
          <div class="filter-group-left">
            <div class="search-input-wrap">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" class="search-input-field" id="leads-search-input" placeholder="${AdminI18n.t('searchLeads')}" value="${this.searchQuery}" />
            </div>

            <select class="filter-select" id="leads-status-select">
              <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>${AdminI18n.t('allStatuses')}</option>
              <option value="new" ${this.statusFilter === 'new' ? 'selected' : ''}>${AdminI18n.t('statusNew')}</option>
              <option value="contacted" ${this.statusFilter === 'contacted' ? 'selected' : ''}>${AdminI18n.t('statusContacted')}</option>
              <option value="discussion" ${this.statusFilter === 'discussion' ? 'selected' : ''}>${AdminI18n.t('statusDiscussion')}</option>
              <option value="proposal_sent" ${this.statusFilter === 'proposal_sent' ? 'selected' : ''}>${AdminI18n.t('statusProposalSent')}</option>
              <option value="in_progress" ${this.statusFilter === 'in_progress' ? 'selected' : ''}>${AdminI18n.t('statusInProgress')}</option>
              <option value="completed" ${this.statusFilter === 'completed' ? 'selected' : ''}>${AdminI18n.t('statusCompleted')}</option>
              <option value="rejected" ${this.statusFilter === 'rejected' ? 'selected' : ''}>${AdminI18n.t('statusRejected')}</option>
            </select>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            ${isAr ? `عرض ${filtered.length} من إجمالي ${leads.length} طلب` : `Showing ${filtered.length} of ${leads.length} leads`}
          </div>
        </div>

        <!-- Main Body: Table or Kanban -->
        ${this.viewMode === 'table' ? this.renderTable(filtered) : this.renderKanban(filtered)}

        <!-- Slide-over Drawer Container -->
        <div id="lead-drawer-container"></div>
      </div>
    `;
  }

  renderTable(leads) {
    if (leads.length === 0) {
      return `
        <div class="glass-panel" style="padding: 48px; text-align: center; color: var(--text-muted);">
          <i class="fa-regular fa-envelope-open" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--accent-orange);"></i>
          <h3 style="color: #fff;">${AdminI18n.t('noLeadsFound')}</h3>
          <p style="font-size: 0.85rem; margin-top: 6px; max-width: 480px; margin-inline: auto;">${AdminI18n.t('noLeadsDesc')}</p>
        </div>
      `;
    }

    const isAr = AdminI18n.getLanguage() === 'ar';

    const getStatusLabel = (status) => {
      const map = {
        new: AdminI18n.t('statusNew'),
        contacted: AdminI18n.t('statusContacted'),
        discussion: AdminI18n.t('statusDiscussion'),
        proposal_sent: AdminI18n.t('statusProposalSent'),
        in_progress: AdminI18n.t('statusInProgress'),
        completed: AdminI18n.t('statusCompleted'),
        rejected: AdminI18n.t('statusRejected')
      };
      return map[status] || status;
    };

    return `
      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 30px;"></th>
              <th>${isAr ? 'اسم العميل' : 'Contact Name'}</th>
              <th>${isAr ? 'نوع المشروع والتفاصيل' : 'Inquiry / Project'}</th>
              <th>${isAr ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}</th>
              <th>${AdminI18n.t('status')}</th>
              <th>${isAr ? 'تاريخ الإرسال' : 'Date'}</th>
              <th style="text-align: right;">${AdminI18n.t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${leads.map(lead => `
              <tr class="${!lead.is_read ? 'is-unread' : ''}" data-lead-id="${lead.id}">
                <td>
                  <i class="${lead.is_starred ? 'fa-solid fa-star' : 'fa-regular fa-star'}" style="color: ${lead.is_starred ? 'var(--accent-gold)' : 'var(--text-muted)'}; cursor: pointer;" data-star-id="${lead.id}"></i>
                </td>
                <td>
                  <div style="font-weight: 600; color: #fff;">${lead.name}</div>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">${lead.email || (isAr ? 'لم يُحدد إيميل' : 'No email provided')}</div>
                </td>
                <td>
                  <div style="font-weight: 500; color: var(--text-primary);">${lead.project_type || 'Custom'}</div>
                  <div style="font-size: 0.72rem; color: var(--text-muted); max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${lead.message}
                  </div>
                </td>
                <td>
                  <div style="font-family: var(--font-mono); color: var(--text-primary); font-size: 0.82rem;">${lead.phone || 'N/A'}</div>
                  <div style="font-size: 0.7rem; color: var(--text-muted);">${lead.form_name || 'Website Contact Form'}</div>
                </td>
                <td>
                  <span class="badge-status ${lead.status}">
                    <span class="dot"></span>
                    ${getStatusLabel(lead.status)}
                  </span>
                </td>
                <td style="font-size: 0.78rem; color: var(--text-secondary);">
                  ${new Date(lead.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">${new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </td>
                <td style="text-align: right;">
                  <div style="display: inline-flex; align-items: center; gap: 6px;">
                    <button class="btn-icon open-lead-drawer-btn" data-id="${lead.id}" title="${AdminI18n.t('leadDetails')}">
                      <i class="fa-regular fa-eye"></i>
                    </button>
                    ${lead.phone ? `
                      <a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً ${lead.name}، معاك عمر من 7P Studio بخصوص طلب مشروعك (${lead.project_type || 'الموقع الإلكتروني'}).`)}" target="_blank" rel="noopener noreferrer" class="btn-icon" style="color: #22C55E;" title="${AdminI18n.t('whatsappChat')}">
                        <i class="fa-brands fa-whatsapp"></i>
                      </a>
                    ` : ''}
                    <button class="btn-icon delete-lead-btn" data-id="${lead.id}" title="حذف الطلب" style="color: var(--status-red);">
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderKanban(leads) {
    const columns = [
      { id: 'new', label: AdminI18n.t('statusNew'), color: 'var(--accent-orange)' },
      { id: 'contacted', label: AdminI18n.t('statusContacted'), color: '#3B82F6' },
      { id: 'discussion', label: AdminI18n.t('statusDiscussion'), color: '#A855F7' },
      { id: 'proposal_sent', label: AdminI18n.t('statusProposalSent'), color: '#EC4899' },
      { id: 'in_progress', label: AdminI18n.t('statusInProgress'), color: '#EAB308' },
      { id: 'completed', label: AdminI18n.t('statusCompleted'), color: 'var(--status-green)' },
      { id: 'rejected', label: AdminI18n.t('statusRejected'), color: 'var(--status-red)' }
    ];

    return `
      <div class="kanban-board-container">
        ${columns.map(col => {
          const colLeads = leads.filter(l => l.status === col.id);
          return `
            <div class="kanban-column" data-status-col="${col.id}">
              <div class="kanban-column-header">
                <span class="column-title-pill">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background: ${col.color}; display: inline-block;"></span>
                  ${col.label}
                </span>
                <span class="column-count-badge">${colLeads.length}</span>
              </div>
              <div class="kanban-cards-list">
                ${colLeads.map(l => `
                  <div class="kanban-card open-lead-drawer-btn" data-id="${l.id}">
                    <div class="kanban-card-title">${l.name}</div>
                    <div style="font-size: 0.74rem; color: var(--accent-orange); font-weight: 500;">${l.project_type}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                      ${l.message}
                    </div>
                    <div class="kanban-card-meta">
                      <span style="font-family: var(--font-mono); font-size: 0.7rem;">${l.phone || 'No Phone'}</span>
                      <span>${new Date(l.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  attachEvents(container) {
    // Search input
    const searchInput = container.querySelector('#leads-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.refresh(container);
      });
    }

    // Status filter
    const statusSelect = container.querySelector('#leads-status-select');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.statusFilter = e.target.value;
        this.refresh(container);
      });
    }

    // View mode switcher
    const tableBtn = container.querySelector('#mode-table-btn');
    const kanbanBtn = container.querySelector('#mode-kanban-btn');
    if (tableBtn && kanbanBtn) {
      tableBtn.addEventListener('click', () => {
        this.viewMode = 'table';
        this.refresh(container);
      });
      kanbanBtn.addEventListener('click', () => {
        this.viewMode = 'kanban';
        this.refresh(container);
      });
    }

    // Export CSV
    const exportBtn = container.querySelector('#export-leads-csv-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        const list = await LeadsService.getLeads();
        LeadsService.exportToCSV(list);
        AdminToast.show(AdminI18n.getLanguage() === 'ar' ? 'تم تصدير الطلبات بنجاح إلى ملف CSV' : 'Leads exported successfully to CSV', 'success');
      });
    }

    // Open Lead Details Drawer
    container.querySelectorAll('.open-lead-drawer-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const leads = await LeadsService.getLeads();
        const target = leads.find(l => String(l.id) === String(id));
        if (target) {
          await LeadsService.toggleRead(target.id, true);
          this.openDrawer(target, container);
        }
      });
    });

    // Delete Lead
    container.querySelectorAll('.delete-lead-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const confirmMsg = AdminI18n.getLanguage() === 'ar' ? 'هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟' : 'Are you sure you want to permanently delete this lead?';
        if (confirm(confirmMsg)) {
          await LeadsService.deleteLead(id);
          AdminToast.show(AdminI18n.getLanguage() === 'ar' ? 'تم حذف الطلب' : 'Lead deleted successfully', 'info');
          this.refresh(container);
        }
      });
    });
  }

  openDrawer(lead, mainContainer) {
    const drawerRoot = document.getElementById('lead-drawer-container');
    if (!drawerRoot) return;

    drawerRoot.innerHTML = `
      <div class="modal-overlay is-active" id="drawer-overlay" style="background: rgba(0,0,0,0.5);">
        <div class="drawer-container is-open" id="lead-drawer">
          <!-- Drawer Header -->
          <div style="padding: 20px 24px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--accent-orange); font-weight: 700; letter-spacing: 0.05em;">${AdminI18n.t('leadDetails')}</div>
              <h2 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-top: 2px;">${lead.name}</h2>
            </div>
            <button class="btn-icon" id="close-drawer-btn">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Drawer Body -->
          <div style="padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 20px;">
            <!-- Status & Pipeline Control -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px;">
              <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 8px;">${AdminI18n.t('pipelineStatus')}</label>
              <select class="filter-select" id="drawer-status-select" style="width: 100%;">
                <option value="new" ${lead.status === 'new' ? 'selected' : ''}>${AdminI18n.t('statusNew')}</option>
                <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>${AdminI18n.t('statusContacted')}</option>
                <option value="discussion" ${lead.status === 'discussion' ? 'selected' : ''}>${AdminI18n.t('statusDiscussion')}</option>
                <option value="proposal_sent" ${lead.status === 'proposal_sent' ? 'selected' : ''}>${AdminI18n.t('statusProposalSent')}</option>
                <option value="in_progress" ${lead.status === 'in_progress' ? 'selected' : ''}>${AdminI18n.t('statusInProgress')}</option>
                <option value="completed" ${lead.status === 'completed' ? 'selected' : ''}>${AdminI18n.t('statusCompleted')}</option>
                <option value="rejected" ${lead.status === 'rejected' ? 'selected' : ''}>${AdminI18n.t('statusRejected')}</option>
              </select>
            </div>

            <!-- Quick Communication Actions -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              ${lead.phone ? `
                <a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً ${lead.name}، معاك عمر من 7P Studio بخصوص تفاصيل مشروعك.`)}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="font-size: 0.8rem; padding: 10px; background: #22C55E; color: #000; box-shadow: none;">
                  <i class="fa-brands fa-whatsapp"></i>
                  <span>${AdminI18n.t('whatsappChat')}</span>
                </a>
              ` : `
                <button class="btn-secondary" disabled style="opacity: 0.5; font-size: 0.8rem; padding: 10px;">لا يوجد هاتف</button>
              `}

              ${lead.email ? `
                <a href="mailto:${lead.email}?subject=7P Studio — Project Discussion" class="btn-secondary" style="font-size: 0.8rem; padding: 10px;">
                  <i class="fa-regular fa-envelope"></i>
                  <span>${AdminI18n.t('sendEmail')}</span>
                </a>
              ` : `
                <button class="btn-secondary" disabled style="opacity: 0.5; font-size: 0.8rem; padding: 10px;">لا يوجد إيميل</button>
              `}
            </div>

            <!-- Contact Metadata Card -->
            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.84rem;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 8px;">
                <span style="color: var(--text-muted);">${AdminI18n.t('contactNumber')}:</span>
                <span style="font-family: var(--font-mono); color: #fff;">${lead.phone || 'N/A'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 8px;">
                <span style="color: var(--text-muted);">${AdminI18n.t('clientEmail')}:</span>
                <span style="color: #fff;">${lead.email || 'N/A'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 8px;">
                <span style="color: var(--text-muted);">${AdminI18n.t('projectScope')}:</span>
                <span style="color: var(--accent-orange); font-weight: 600;">${lead.project_type || 'Custom'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 8px;">
                <span style="color: var(--text-muted);">${AdminI18n.t('submittedAt')}:</span>
                <span style="color: var(--text-secondary);">${new Date(lead.created_at).toLocaleString()}</span>
              </div>
            </div>

            <!-- Message Body -->
            <div>
              <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">${AdminI18n.t('clientMessage')}</label>
              <div style="background: var(--bg-card-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px; font-size: 0.86rem; color: #fff; line-height: 1.5; white-space: pre-wrap;">
                ${lead.message}
              </div>
            </div>

            <!-- Internal Studio Notes -->
            <div>
              <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 8px;">${AdminI18n.t('internalNotes')}</label>
              <div id="notes-list" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px;">
                ${(lead.notes || []).map(n => `
                  <div style="padding: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; font-size: 0.8rem;">
                    <div style="display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.7rem; margin-bottom: 4px;">
                      <span style="font-weight: 600; color: var(--accent-orange);">${n.author}</span>
                      <span>${new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p style="color: var(--text-primary);">${n.text}</p>
                  </div>
                `).join('')}
              </div>

              <!-- Add Note Input -->
              <div style="display: flex; gap: 8px;">
                <input type="text" class="search-input-field" id="new-note-input" placeholder="${AdminI18n.t('addNotePlaceholder')}" style="flex: 1;" />
                <button class="btn-primary" id="add-note-btn" style="padding: 8px 14px; font-size: 0.78rem;">${AdminI18n.t('addNote')}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const closeBtn = drawerRoot.querySelector('#close-drawer-btn');
    const overlay = drawerRoot.querySelector('#drawer-overlay');
    const closeDrawer = () => {
      drawerRoot.innerHTML = '';
      this.refresh(mainContainer);
    };

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDrawer();
    });

    // Handle Status Change
    const statusSelect = drawerRoot.querySelector('#drawer-status-select');
    if (statusSelect) {
      statusSelect.addEventListener('change', async (e) => {
        await LeadsService.updateLeadStatus(lead.id, e.target.value);
        AdminToast.show(AdminI18n.getLanguage() === 'ar' ? 'تم تحديث حالة الطلب' : `Lead status updated to ${e.target.value}`, 'success');
      });
    }

    // Handle Add Note
    const noteInput = drawerRoot.querySelector('#new-note-input');
    const addNoteBtn = drawerRoot.querySelector('#add-note-btn');
    if (noteInput && addNoteBtn) {
      addNoteBtn.addEventListener('click', async () => {
        const text = noteInput.value.trim();
        if (text) {
          await LeadsService.addNote(lead.id, text, 'Omar (7P Studio)');
          noteInput.value = '';
          AdminToast.show(AdminI18n.getLanguage() === 'ar' ? 'تم حفظ الملاحظة' : 'Note saved', 'info');
          const leads = await LeadsService.getLeads();
          const updated = leads.find(l => l.id === lead.id);
          this.openDrawer(updated, mainContainer);
        }
      });
    }
  }

  async refresh(container) {
    const html = await this.render();
    container.innerHTML = html;
    this.attachEvents(container);
  }
}
