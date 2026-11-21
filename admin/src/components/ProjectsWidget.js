// ==============================================================================
// 7P STUDIO CONTROL CENTER — PROJECTS OVERVIEW WIDGET (ProjectsWidget.js)
// Table showing top projects, published status, views & quick actions
// ==============================================================================

export class ProjectsWidget {
  constructor(projects, onNavigate) {
    this.projects = projects || [];
    this.onNavigate = onNavigate;
  }

  render() {
    const displayList = this.projects.slice(0, 3);

    return `
      <div class="card-panel-header">
        <div class="card-panel-title">
          <i class="fa-solid fa-folder"></i>
          <span>Projects Management</span>
        </div>
        <span class="card-header-link" id="view-all-projects-link">View All →</span>
      </div>

      <table class="projects-mini-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Status</th>
            <th>Views</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${displayList.map(p => `
            <tr>
              <td>
                <div class="project-cell-flex">
                  <img src="${p.previewImg}" alt="${p.client}" class="project-thumb-img" onerror="this.src='/src/assets/logo-7p.png'"/>
                  <div>
                    <div class="project-name-bold">${p.title.en}</div>
                    <div class="project-url-muted">https://7pstudio.tech</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge-status ${p.status === 'published' ? 'published' : 'draft'}">
                  ${p.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </td>
              <td style="font-family: var(--font-mono); font-weight: 600;">
                ${p.viewsCount > 1000 ? (p.viewsCount / 1000).toFixed(1) + 'K' : p.viewsCount}
              </td>
              <td style="text-align: right;">
                <div class="project-actions-btns" style="justify-content: flex-end;">
                  <button class="mini-action-btn edit-proj-btn" data-id="${p.id}" title="Edit Project">
                    <i class="fa-solid fa-pen" style="font-size: 0.72rem;"></i>
                  </button>
                  <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="mini-action-btn" title="View Live Project">
                    <i class="fa-regular fa-eye" style="font-size: 0.75rem;"></i>
                  </a>
                  <button class="mini-action-btn" title="More Options">
                    <i class="fa-solid fa-ellipsis" style="font-size: 0.75rem;"></i>
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
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
