// ==============================================================================
// 7P STUDIO CONTROL CENTER — SERVICES VIEW (ServicesView.js)
// Manage 4 core studio offerings, order, icon, and visibility
// ==============================================================================

import { ServicesService } from '../services/servicesService.js';
import { AdminToast } from '../components/Toast.js';

export class ServicesView {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
  }

  render() {
    const services = ServicesService.getServices();

    return `
      <div class="services-view-container">
        <!-- Module Header -->
        <div class="module-header">
          <div class="module-title-box">
            <h1>Services Management</h1>
            <p>Customize the 4 core studio service offerings displayed on the website Bento grid.</p>
          </div>
          <div class="module-actions-bar">
            <button class="btn-primary" id="add-service-btn">
              <i class="fa-solid fa-plus"></i>
              <span>Add Service</span>
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
          ${services.map(s => `
            <div class="glass-panel" style="padding: 24px; display: flex; flex-direction: column; position: relative;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: rgba(255,133,0,0.12); border: 1px solid rgba(255,133,0,0.3); display: flex; align-items: center; justify-content: center; color: var(--accent-orange); font-size: 1.25rem;">
                  <i class="${s.icon}"></i>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="badge-status ${s.isActive ? 'published' : 'draft'}">
                    ${s.isActive ? 'Active' : 'Hidden'}
                  </span>
                  <button class="btn-icon edit-srv-btn" data-id="${s.id}" title="Edit Service">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                </div>
              </div>

              <h3 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 4px;">${s.title.en}</h3>
              <div style="font-size: 0.85rem; color: var(--text-muted); font-family: 'Cairo', sans-serif; margin-bottom: 12px;">${s.title.ar}</div>
              
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; flex: 1;">${s.description.en}</p>
              
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 18px; padding-top: 12px; border-top: 1px solid var(--border-subtle); font-size: 0.74rem; color: var(--text-muted);">
                <span>Display Order: #${s.displayOrder}</span>
                <button class="toggle-srv-active" data-id="${s.id}" style="color: var(--accent-orange); font-weight: 600;">
                  ${s.isActive ? 'Hide on Website' : 'Show on Website'}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    container.querySelectorAll('.toggle-srv-active').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const services = ServicesService.getServices();
        const s = services.find(item => item.id === id);
        if (s) {
          ServicesService.updateService(id, { isActive: !s.isActive });
          AdminToast.show(`Service is now ${!s.isActive ? 'Active' : 'Hidden'}`, 'info');
          this.refresh(container);
        }
      });
    });

    const addBtn = container.querySelector('#add-service-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const title = prompt('Enter service title (English):');
        if (title) {
          ServicesService.addService({
            title: { en: title, ar: title },
            description: { en: 'High performance customized studio solution.', ar: 'حل برمجي واستشاري مخصص.' },
            icon: 'fa-solid fa-star'
          });
          AdminToast.show('Service added', 'success');
          this.refresh(container);
        }
      });
    }
  }

  refresh(container) {
    container.innerHTML = this.render();
    this.attachEvents(container);
  }
}
