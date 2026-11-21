// ==============================================================================
// 7P STUDIO CONTROL CENTER — PROJECTS CMS VIEW (ProjectsView.js)
// Full project management: Add, Edit, Delete, Reorder, Status & Real Clicks
// ==============================================================================

import { ProjectsService } from '../services/projectsService.js';
import { AdminToast } from '../components/Toast.js';
import { AdminI18n } from '../services/i18nAdmin.js';

export class ProjectsView {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.categoryFilter = 'all';
  }

  async render() {
    const projects = await ProjectsService.getProjects();
    const isAr = AdminI18n.getLanguage() === 'ar';

    const filtered = projects.filter(p => {
      const matchSearch = !this.searchQuery ||
        p.title.en.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.title.ar.includes(this.searchQuery) ||
        p.client.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchStatus = this.statusFilter === 'all' || p.status === this.statusFilter;
      return matchSearch && matchStatus;
    });

    return `
      <div class="projects-view-container">
        <!-- Module Header -->
        <div class="module-header">
          <div class="module-title-box">
            <h1>${AdminI18n.t('projectsTitle')}</h1>
            <p>${AdminI18n.t('projectsSubtitle')} (${projects.length} ${isAr ? 'مشاريع' : 'total'}).</p>
          </div>
          <div class="module-actions-bar">
            <button class="btn-primary" id="add-new-project-btn">
              <i class="fa-solid fa-plus"></i>
              <span>${AdminI18n.t('addNewProject')}</span>
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="table-filter-bar">
          <div class="filter-group-left">
            <div class="search-input-wrap">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" class="search-input-field" id="proj-search-input" placeholder="${isAr ? 'ابحث عن مشروع بالاسم، العميل، أو التصنيف...' : 'Search projects by name, client, or tag...'}" value="${this.searchQuery}" />
            </div>

            <select class="filter-select" id="proj-status-select">
              <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>${AdminI18n.t('allStatuses')}</option>
              <option value="published" ${this.statusFilter === 'published' ? 'selected' : ''}>${AdminI18n.t('published')}</option>
              <option value="draft" ${this.statusFilter === 'draft' ? 'selected' : ''}>${AdminI18n.t('draft')}</option>
              <option value="archived" ${this.statusFilter === 'archived' ? 'selected' : ''}>${isAr ? 'مؤرشف' : 'Archived'}</option>
            </select>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            ${isAr ? `عرض ${filtered.length} من إجمالي ${projects.length} مشروع` : `Showing ${filtered.length} of ${projects.length} projects`}
          </div>
        </div>

        <!-- Projects Table -->
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>${AdminI18n.t('project')}</th>
                <th>${isAr ? 'التصنيف والعميل' : 'Category'}</th>
                <th>${AdminI18n.t('status')}</th>
                <th>${AdminI18n.t('viewsCount')}</th>
                <th>${isAr ? 'الترتيب' : 'Order'}</th>
                <th style="text-align: right;">${AdminI18n.t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(p => `
                <tr data-project-id="${p.id}">
                  <td>
                    <div class="project-cell-flex">
                      <img src="${p.previewImg}" alt="${p.client}" class="project-thumb-img" onerror="this.src='/src/assets/logo-7p.png'"/>
                      <div>
                        <div style="font-weight: 700; color: #fff;">${isAr && p.title.ar ? p.title.ar : p.title.en}</div>
                        <div style="font-size: 0.76rem; color: var(--text-muted); font-family: 'Inter', sans-serif;">${p.title.en}</div>
                        <a href="${p.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.72rem; color: var(--accent-orange); margin-top: 2px; display: inline-flex; align-items: center; gap: 4px;">
                          <span>${p.url.replace('https://', '')}</span>
                          <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.65rem;"></i>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style="font-size: 0.82rem; color: var(--text-primary); font-weight: 500;">${isAr && p.category.ar ? p.category.ar : p.category.en}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${p.client}</div>
                  </td>
                  <td>
                    <button class="badge-status ${p.status === 'published' ? 'published' : 'draft'} toggle-publish-btn" data-id="${p.id}" title="Click to toggle publish" style="border: none; cursor: pointer;">
                      <span class="dot"></span>
                      ${p.status === 'published' ? AdminI18n.t('published') : AdminI18n.t('draft')}
                    </button>
                  </td>
                  <td style="font-family: var(--font-mono); font-weight: 600;">
                    ${p.viewsCount || 0}
                  </td>
                  <td style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">
                    #${p.displayOrder || 1}
                  </td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; align-items: center; gap: 6px;">
                      <button class="btn-icon edit-project-btn" data-id="${p.id}" title="${AdminI18n.t('editProject')}">
                        <i class="fa-solid fa-pen"></i>
                      </button>
                      <button class="btn-icon delete-project-btn" data-id="${p.id}" title="${AdminI18n.t('deleteProject')}" style="color: var(--status-red);">
                        <i class="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div id="project-modal-container"></div>
      </div>
    `;
  }

  attachEvents(container) {
    const searchInput = container.querySelector('#proj-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.refresh(container);
      });
    }

    const statusSelect = container.querySelector('#proj-status-select');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.statusFilter = e.target.value;
        this.refresh(container);
      });
    }

    // Toggle publish
    container.querySelectorAll('.toggle-publish-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const newStatus = await ProjectsService.togglePublish(id);
        AdminToast.show(`Project is now ${newStatus}`, 'info');
        this.refresh(container);
      });
    });

    // Delete
    container.querySelectorAll('.delete-project-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const confirmMsg = AdminI18n.getLanguage() === 'ar' ? AdminI18n.t('confirmDeleteProject') : 'Are you sure you want to delete this project?';
        if (confirm(confirmMsg)) {
          await ProjectsService.deleteProject(id);
          AdminToast.show(AdminI18n.getLanguage() === 'ar' ? 'تم حذف المشروع' : 'Project removed', 'info');
          this.refresh(container);
        }
      });
    });

    // Add New Project Modal
    const addBtn = container.querySelector('#add-new-project-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.openEditModal(null, container);
      });
    }

    // Edit Project Modal
    container.querySelectorAll('.edit-project-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const projects = await ProjectsService.getProjects();
        const p = projects.find(item => item.id === id);
        if (p) this.openEditModal(p, container);
      });
    });
  }

  openEditModal(project, mainContainer) {
    const modalRoot = document.getElementById('project-modal-container');
    if (!modalRoot) return;

    const isEdit = !!project;
    const isAr = AdminI18n.getLanguage() === 'ar';
    const p = project || {
      id: '',
      title: { en: '', ar: '' },
      client: '',
      category: { en: 'Web Application', ar: 'تطبيق ويب' },
      short: { en: '', ar: '' },
      url: 'https://',
      previewImg: '/projects/aya-preview.jpg',
      accentColor: '#FF8500',
      status: 'published'
    };

    modalRoot.innerHTML = `
      <div class="modal-overlay is-active" id="proj-modal-overlay">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">${isEdit ? AdminI18n.t('editProject') : AdminI18n.t('addNewProject')}</h3>
            <button class="btn-icon" id="close-proj-modal-btn">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body" style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">${AdminI18n.t('projectTitleEn')}</label>
                <input type="text" class="search-input-field" id="modal-title-en" value="${p.title.en}" placeholder="e.g. Aya Accessories Boutique" required />
              </div>
              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">${AdminI18n.t('projectTitleAr')}</label>
                <input type="text" class="search-input-field" id="modal-title-ar" value="${p.title.ar}" placeholder="مثلاً: متجر آية" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">${AdminI18n.t('clientName')}</label>
                <input type="text" class="search-input-field" id="modal-client" value="${p.client}" placeholder="e.g. Aya Accessories" required />
              </div>
              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">${AdminI18n.t('categoryEn')}</label>
                <input type="text" class="search-input-field" id="modal-category" value="${p.category.en}" placeholder="e.g. E-Commerce Boutique" />
              </div>
            </div>

            <div>
              <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">${AdminI18n.t('liveUrl')}</label>
              <input type="url" class="search-input-field" id="modal-url" value="${p.url}" placeholder="https://..." required />
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">${AdminI18n.t('previewImage')}</label>
                <input type="text" class="search-input-field" id="modal-img" value="${p.previewImg}" placeholder="/projects/aya-preview.jpg" />
              </div>
              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">${AdminI18n.t('accentColor')}</label>
                <input type="color" id="modal-color" value="${p.accentColor || '#FF8500'}" style="width: 100%; height: 38px; background: none; border: 1px solid var(--border-subtle); border-radius: 8px; cursor: pointer;" />
              </div>
            </div>

            <div>
              <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">${isAr ? 'وصف مختصر للمشروع' : 'Description (English)'}</label>
              <textarea class="search-input-field" id="modal-desc-en" rows="2" placeholder="Brief project summary...">${p.short.en}</textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" id="cancel-proj-btn">${AdminI18n.t('cancel')}</button>
            <button class="btn-primary" id="save-proj-btn">${AdminI18n.t('saveProject')}</button>
          </div>
        </div>
      </div>
    `;

    const close = () => { modalRoot.innerHTML = ''; };
    modalRoot.querySelector('#close-proj-modal-btn')?.addEventListener('click', close);
    modalRoot.querySelector('#cancel-proj-btn')?.addEventListener('click', close);

    modalRoot.querySelector('#save-proj-btn')?.addEventListener('click', async () => {
      const titleEn = modalRoot.querySelector('#modal-title-en').value.trim();
      const titleAr = modalRoot.querySelector('#modal-title-ar').value.trim();
      const client = modalRoot.querySelector('#modal-client').value.trim();
      const categoryEn = modalRoot.querySelector('#modal-category').value.trim();
      const url = modalRoot.querySelector('#modal-url').value.trim();
      const img = modalRoot.querySelector('#modal-img').value.trim();
      const color = modalRoot.querySelector('#modal-color').value;
      const descEn = modalRoot.querySelector('#modal-desc-en').value.trim();

      if (!titleEn || !url) {
        alert(isAr ? 'يرجى إدخال عنوان المشروع ورابط الموقع.' : 'Please provide project title and live URL.');
        return;
      }

      if (isEdit) {
        await ProjectsService.updateProject(p.id, {
          title: { en: titleEn, ar: titleAr || titleEn },
          client,
          category: { en: categoryEn, ar: categoryEn },
          url,
          previewImg: img,
          accentColor: color,
          short: { en: descEn, ar: descEn }
        });
        AdminToast.show(isAr ? 'تم تحديث المشروع بنجاح' : 'Project updated successfully', 'success');
      } else {
        await ProjectsService.addProject({
          title: { en: titleEn, ar: titleAr || titleEn },
          client,
          category: { en: categoryEn, ar: categoryEn },
          url,
          previewImg: img || '/projects/aya-preview.jpg',
          accentColor: color,
          short: { en: descEn, ar: descEn }
        });
        AdminToast.show(isAr ? 'تمت إضافة المشروع الجديد بنجاح' : 'New project added', 'success');
      }

      close();
      this.refresh(mainContainer);
    });
  }

  async refresh(container) {
    const html = await this.render();
    container.innerHTML = html;
    this.attachEvents(container);
  }
}
