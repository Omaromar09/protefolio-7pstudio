// ==============================================================================
// 7P STUDIO CONTROL CENTER — PAGES & SECTIONS (PagesView.js)
// Real CMS content manager for Hero, Services, Estimator, Contact, and Footer
// ==============================================================================

import { SectionsService } from '../services/sectionsService.js';
import { AdminToast } from '../components/Toast.js';

export class PagesView {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.activeTab = 'hero';
  }

  render() {
    const sections = SectionsService.getSections();
    const hero = sections.hero || {};
    const services = sections.services || {};
    const contact = sections.contact || {};

    return `
      <div class="pages-view-container">
        <!-- Module Header -->
        <div class="module-header">
          <div class="module-title-box">
            <h1>Pages & Sections Manager</h1>
            <p>Update live public website copy, hero headlines, CTA buttons, and contact links without editing code.</p>
          </div>
          <div class="module-actions-bar">
            <a href="/" target="_blank" class="btn-secondary">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
              <span>Preview Live Site</span>
            </a>
          </div>
        </div>

        <!-- Section Navigation Tabs -->
        <div style="display: flex; gap: 10px; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; overflow-x: auto;">
          <button class="nav-item ${this.activeTab === 'hero' ? 'active' : ''}" data-tab="hero" style="border-radius: var(--radius-full); padding: 8px 18px;">
            <i class="fa-solid fa-bullhorn"></i> Hero Showcase
          </button>
          <button class="nav-item ${this.activeTab === 'services' ? 'active' : ''}" data-tab="services" style="border-radius: var(--radius-full); padding: 8px 18px;">
            <i class="fa-solid fa-puzzle-piece"></i> Services Grid
          </button>
          <button class="nav-item ${this.activeTab === 'contact' ? 'active' : ''}" data-tab="contact" style="border-radius: var(--radius-full); padding: 8px 18px;">
            <i class="fa-solid fa-address-book"></i> Contact & Social
          </button>
        </div>

        <!-- Tab 1: Hero Section -->
        ${this.activeTab === 'hero' ? `
          <div class="glass-panel" style="padding: 28px; max-width: 800px;">
            <h3 style="font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 16px;">Hero Section Content</h3>
            
            <div style="display: flex; flex-direction: column; gap: 18px;">
              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Arabic Main Headline</label>
                <input type="text" class="search-input-field" id="hero-headline-ar" value="${hero.headline_ar || ''}" style="direction: rtl;" />
              </div>

              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">English Main Headline</label>
                <input type="text" class="search-input-field" id="hero-headline-en" value="${hero.headline_en || ''}" />
              </div>

              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Arabic Subheadline Description</label>
                <textarea class="search-input-field" id="hero-sub-ar" rows="3" style="direction: rtl;">${hero.subheadline_ar || ''}</textarea>
              </div>

              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">English Subheadline Description</label>
                <textarea class="search-input-field" id="hero-sub-en" rows="3">${hero.subheadline_en || ''}</textarea>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Primary CTA Button Text</label>
                  <input type="text" class="search-input-field" id="hero-cta-text" value="${hero.ctaText_ar || ''}" />
                </div>
                <div>
                  <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">CTA Target Link</label>
                  <input type="text" class="search-input-field" id="hero-cta-url" value="${hero.ctaUrl || '#estimator'}" />
                </div>
              </div>

              <div style="margin-top: 10px;">
                <button class="btn-primary" id="save-hero-content-btn">
                  <i class="fa-solid fa-floppy-disk"></i>
                  <span>Save Hero Content</span>
                </button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Tab 2: Services Section -->
        ${this.activeTab === 'services' ? `
          <div class="glass-panel" style="padding: 28px; max-width: 800px;">
            <h3 style="font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 16px;">Services Section Content</h3>
            
            <div style="display: flex; flex-direction: column; gap: 18px;">
              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Arabic Section Title</label>
                <input type="text" class="search-input-field" id="services-title-ar" value="${services.title_ar || ''}" style="direction: rtl;" />
              </div>

              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">English Section Title</label>
                <input type="text" class="search-input-field" id="services-title-en" value="${services.title_en || ''}" />
              </div>

              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Section Subtitle</label>
                <textarea class="search-input-field" id="services-sub-ar" rows="2" style="direction: rtl;">${services.subtitle_ar || ''}</textarea>
              </div>

              <div style="margin-top: 10px;">
                <button class="btn-primary" id="save-services-content-btn">
                  <i class="fa-solid fa-floppy-disk"></i>
                  <span>Save Services Header</span>
                </button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Tab 3: Contact & Social -->
        ${this.activeTab === 'contact' ? `
          <div class="glass-panel" style="padding: 28px; max-width: 800px;">
            <h3 style="font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 16px;">Contact Channels & Social Links</h3>
            
            <div style="display: flex; flex-direction: column; gap: 18px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Official WhatsApp Number</label>
                  <input type="text" class="search-input-field" id="contact-whatsapp" value="${contact.whatsapp || ''}" />
                </div>
                <div>
                  <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Contact Email</label>
                  <input type="email" class="search-input-field" id="contact-email" value="${contact.email || ''}" />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">TikTok Handle</label>
                  <input type="text" class="search-input-field" id="contact-tiktok" value="${contact.tiktok || ''}" />
                </div>
                <div>
                  <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Instagram Handle</label>
                  <input type="text" class="search-input-field" id="contact-instagram" value="${contact.instagram || ''}" />
                </div>
              </div>

              <div style="margin-top: 10px;">
                <button class="btn-primary" id="save-contact-content-btn">
                  <i class="fa-solid fa-floppy-disk"></i>
                  <span>Save Channels</span>
                </button>
              </div>
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

    // Save Hero
    const saveHeroBtn = container.querySelector('#save-hero-content-btn');
    if (saveHeroBtn) {
      saveHeroBtn.addEventListener('click', () => {
        SectionsService.updateSection('hero', {
          headline_ar: container.querySelector('#hero-headline-ar').value,
          headline_en: container.querySelector('#hero-headline-en').value,
          subheadline_ar: container.querySelector('#hero-sub-ar').value,
          subheadline_en: container.querySelector('#hero-sub-en').value,
          ctaText_ar: container.querySelector('#hero-cta-text').value,
          ctaUrl: container.querySelector('#hero-cta-url').value
        });
        AdminToast.show('Hero section updated', 'success');
      });
    }

    // Save Services
    const saveServicesBtn = container.querySelector('#save-services-content-btn');
    if (saveServicesBtn) {
      saveServicesBtn.addEventListener('click', () => {
        SectionsService.updateSection('services', {
          title_ar: container.querySelector('#services-title-ar').value,
          title_en: container.querySelector('#services-title-en').value,
          subtitle_ar: container.querySelector('#services-sub-ar').value
        });
        AdminToast.show('Services header updated', 'success');
      });
    }

    // Save Contact
    const saveContactBtn = container.querySelector('#save-contact-content-btn');
    if (saveContactBtn) {
      saveContactBtn.addEventListener('click', () => {
        SectionsService.updateSection('contact', {
          whatsapp: container.querySelector('#contact-whatsapp').value,
          email: container.querySelector('#contact-email').value,
          tiktok: container.querySelector('#contact-tiktok').value,
          instagram: container.querySelector('#contact-instagram').value
        });
        AdminToast.show('Contact channels updated', 'success');
      });
    }
  }

  refresh(container) {
    container.innerHTML = this.render();
    this.attachEvents(container);
  }
}
