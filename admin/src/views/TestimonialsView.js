// ==============================================================================
// 7P STUDIO CONTROL CENTER — TESTIMONIALS VIEW (TestimonialsView.js)
// Real customer reviews, star ratings, approvals & avatars
// ==============================================================================

import { TestimonialsService } from '../services/testimonialsService.js';
import { AdminToast } from '../components/Toast.js';

export class TestimonialsView {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
  }

  render() {
    const list = TestimonialsService.getTestimonials();

    return `
      <div class="testimonials-view-container">
        <!-- Module Header -->
        <div class="module-header">
          <div class="module-title-box">
            <h1>Testimonials & Social Proof</h1>
            <p>Approve and curate genuine feedback from TikTok comments, WhatsApp chats, and client deliveries.</p>
          </div>
          <div class="module-actions-bar">
            <button class="btn-primary" id="add-testimonial-btn">
              <i class="fa-solid fa-plus"></i>
              <span>Add Review</span>
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
          ${list.map(t => `
            <div class="glass-panel" style="padding: 22px; display: flex; flex-direction: column;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="${t.avatar}" alt="${t.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-subtle);" onerror="this.src='/src/assets/logo-7p.png'"/>
                  <div>
                    <div style="font-weight: 700; color: #fff; font-size: 0.92rem;">${t.name}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${t.role}</div>
                  </div>
                </div>
                <span class="badge-status ${t.isApproved ? 'published' : 'draft'}">
                  ${t.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>

              <!-- Rating Stars -->
              <div style="display: flex; gap: 4px; color: var(--accent-gold); font-size: 0.85rem; margin-bottom: 10px;">
                ${Array(t.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
              </div>

              <!-- Comment Arabic & English -->
              <p style="font-size: 0.84rem; color: #fff; line-height: 1.5; font-family: 'Cairo', sans-serif; direction: rtl; text-align: right; margin-bottom: 8px;">
                "${t.comment}"
              </p>
              ${t.comment_en ? `
                <p style="font-size: 0.76rem; color: var(--text-muted); line-height: 1.4; flex: 1;">
                  "${t.comment_en}"
                </p>
              ` : ''}

              <!-- Actions -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
                <button class="toggle-approve-btn" data-id="${t.id}" style="font-size: 0.76rem; font-weight: 600; color: ${t.isApproved ? 'var(--status-amber)' : 'var(--status-green)'};">
                  ${t.isApproved ? 'Unpublish' : 'Approve & Publish'}
                </button>
                <button class="btn-icon delete-testimonial-btn" data-id="${t.id}" style="color: var(--status-red); width: 28px; height: 28px;" title="Delete">
                  <i class="fa-regular fa-trash-can" style="font-size: 0.75rem;"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    container.querySelectorAll('.toggle-approve-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const isApproved = TestimonialsService.toggleApproval(id);
        AdminToast.show(`Testimonial ${isApproved ? 'Approved' : 'Unpublished'}`, 'info');
        this.refresh(container);
      });
    });

    container.querySelectorAll('.delete-testimonial-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this review?')) {
          TestimonialsService.deleteTestimonial(id);
          AdminToast.show('Review deleted', 'info');
          this.refresh(container);
        }
      });
    });

    const addBtn = container.querySelector('#add-testimonial-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const name = prompt('Client Name:');
        const text = prompt('Client Review:');
        if (name && text) {
          TestimonialsService.addTestimonial({
            name,
            role: 'Client Review',
            comment: text,
            comment_en: text
          });
          AdminToast.show('Testimonial added', 'success');
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
