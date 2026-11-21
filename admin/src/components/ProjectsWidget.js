// ==============================================================================
// 7P STUDIO CONTROL CENTER — PROJECTS OVERVIEW WIDGET (ProjectsWidget.js)
// Authentic 8 projects, published status, real outbound clicks & quick actions
// ==============================================================================

import { AdminI18n } from '../services/i18nAdmin.js';

export class ProjectsWidget {
  constructor(projects, onNavigate) {
    this.projects = projects || [];
    this.onNavigate = onNavigate;
  }

  render() {
    const displayList = this.projects.slice(0, 3);
    const isAr = AdminI18n.getLanguage() === 'ar';

    return `
      <div class="card-panel-header">
        <div class="card-panel-title">
          <i class="fa-solid fa-folder"></i>
          <span>${AdminI18n.t('projectsManagement')}</span>
        </div>
        <span class="card-header-link" id="view-all-projects-link">${AdminI18n.t('viewAll')}</span>
      </div>

      <table class="projects-mini-table">
        <thead>
          <tr>
            <th>${AdminI18n.t('project')}</th>
            <th>${AdminI18n.t('status')}</th>
            <th>${AdminI18n.t('viewsCount')}</th>
            <th style="text-align: right;">${AdminI18n.t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${displayList.map(p => {
            const title = isAr && p.title.ar ? p.title.ar : p.title.en;
            return `
              <tr>
                <td>
                  <div class="project-cell-flex">
                    <img src="${p.previewImg}" alt="${p.client}" class="project-thumb-img" onerror="this.src='/src/assets/logo-7p.png'"/>
                    <div>
                      <div class="project-name-bold">${title}</div>
                      <div class="project-url-muted">${p.client} • ${p.url.replace('https://', '')}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge-status ${p.status === 'published' ? 'published' : 'draft'}">
                    ${p.status === 'published' ? AdminI18n.t('published') : AdminI18n.t('draft')}
                  </span>
                </td>
                <td style="font-family: var(--font-mono); font-weight: 600;">
                  ${p.viewsCount || 0}
                </td>
                <td style="text-align: right;">
                  <div class="project-actions-btns" style="justify-content: flex-end;">
                    <button class="mini-action-btn edit-proj-btn" data-id="${p.id}" title="${AdminI18n.t('editProject')}">
                      <i class="fa-solid fa-pen" style="font-size: 0.72rem;"></i>
                    </button>
                    <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="mini-action-btn" title="${AdminI18n.t('viewWebsite')}">
                      <i class="fa-regular fa-eye" style="font-size: 0.75rem;"></i>
                    </a>
                    <button class="mini-action-btn" title="More">
                      <i class="fa-solid fa-ellipsis" style="font-size: 0.75rem;"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  attachEvents(container) {
    const link = container.querySelector('#view-all-projects-link');
    if (link && this.onNavigate) {
      link.addEventListener('click', () => this.onNavigate('projects'));
    }

    container.querySelectorAll('.edit-proj-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('projects');
      });
    });
  }
}
