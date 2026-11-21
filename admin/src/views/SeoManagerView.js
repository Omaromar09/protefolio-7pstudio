// ==============================================================================
// 7P STUDIO CONTROL CENTER — SEO MANAGER (SeoManagerView.js)
// Meta tags, Google SERP Snippet Preview, OpenGraph Social Cards & Sitemap
// ==============================================================================

import { SettingsService } from '../services/settingsService.js';
import { AdminToast } from '../components/Toast.js';

export class SeoManagerView {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
  }

  render() {
    const settings = SettingsService.getSettings();
    const seo = settings.seo || {};

    return `
      <div class="seo-view-container">
        <!-- Module Header -->
        <div class="module-header">
          <div class="module-title-box">
            <h1>SEO & Metadata Manager</h1>
            <p>Optimize search engine visibility, OpenGraph social previews, canonical tags, and robots directives.</p>
          </div>
          <div class="module-actions-bar">
            <a href="/sitemap.xml" target="_blank" class="btn-secondary">
              <i class="fa-solid fa-sitemap"></i>
              <span>View sitemap.xml</span>
            </a>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 24px;">
          <!-- Left: Meta Tag Editor Form -->
          <div class="glass-panel" style="padding: 24px;">
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 16px;">Meta Tag Configuration</h3>
            
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Page Title (Title Tag)</label>
                <input type="text" class="search-input-field" id="seo-title-input" value="${seo.metaTitle || '7P STUDIO — Modern Web Development Studio'}" />
                <span style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px; display: block;">Optimal length: 50–60 characters.</span>
              </div>

              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Meta Description</label>
                <textarea class="search-input-field" id="seo-desc-input" rows="3">${seo.metaDescription || 'استوديو 7P Studio لتصميم وتطوير مواقع الويب التفاعلية 3D، المتاجر الإلكترونية وسلات الشراء المباشرة.'}</textarea>
                <span style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px; display: block;">Optimal length: 150–160 characters.</span>
              </div>

              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Canonical URL</label>
                <input type="url" class="search-input-field" id="seo-canonical-input" value="${seo.canonicalUrl || 'https://7pstudio.tech/'}" />
              </div>

              <div>
                <label style="font-size: 0.74rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">Social Share Image (og:image)</label>
                <input type="text" class="search-input-field" id="seo-ogimage-input" value="${seo.ogImage || '/og-image.jpg'}" />
              </div>

              <div style="margin-top: 10px;">
                <button class="btn-primary" id="save-seo-btn">
                  <i class="fa-solid fa-floppy-disk"></i>
                  <span>Save SEO Settings</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Right: Live Search Engine & Social Previews -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <!-- Google Search SERP Preview -->
            <div class="glass-panel" style="padding: 24px;">
              <h3 style="font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 12px;">
                <i class="fa-brands fa-google" style="color: #4285F4; margin-right: 6px;"></i>
                Google Search Result Preview
              </h3>

              <div class="seo-preview-card">
                <div class="google-serp-url">https://7pstudio.tech</div>
                <div class="google-serp-title" id="serp-preview-title">${seo.metaTitle}</div>
                <div class="google-serp-desc" id="serp-preview-desc">${seo.metaDescription}</div>
              </div>
            </div>

            <!-- OpenGraph Facebook / WhatsApp / LinkedIn Preview -->
            <div class="glass-panel" style="padding: 24px;">
              <h3 style="font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 12px;">
                <i class="fa-solid fa-share-nodes" style="color: var(--accent-orange); margin-right: 6px;"></i>
                Social Media Card Preview
              </h3>

              <div class="og-social-card">
                <img src="${seo.ogImage || '/og-image.jpg'}" alt="OpenGraph Preview" id="og-preview-img" onerror="this.src='/src/assets/logo-7p.png'"/>
                <div class="og-social-content">
                  <div class="og-social-domain">7pstudio.tech</div>
                  <div class="og-social-title" id="og-preview-title">${seo.metaTitle}</div>
                  <div style="font-size: 0.78rem; color: #b0b3b8; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" id="og-preview-desc">
                    ${seo.metaDescription}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    const titleInput = container.querySelector('#seo-title-input');
    const descInput = container.querySelector('#seo-desc-input');
    const serpTitle = container.querySelector('#serp-preview-title');
    const serpDesc = container.querySelector('#serp-preview-desc');
    const ogTitle = container.querySelector('#og-preview-title');
    const ogDesc = container.querySelector('#og-preview-desc');

    if (titleInput && serpTitle && ogTitle) {
      titleInput.addEventListener('input', (e) => {
        serpTitle.textContent = e.target.value || '7P STUDIO';
        ogTitle.textContent = e.target.value || '7P STUDIO';
      });
    }

    if (descInput && serpDesc && ogDesc) {
      descInput.addEventListener('input', (e) => {
        serpDesc.textContent = e.target.value;
        ogDesc.textContent = e.target.value;
      });
    }

    const saveBtn = container.querySelector('#save-seo-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        SettingsService.updateSettings('seo', {
          metaTitle: titleInput.value,
          metaDescription: descInput.value,
          canonicalUrl: container.querySelector('#seo-canonical-input').value,
          ogImage: container.querySelector('#seo-ogimage-input').value
        });
        AdminToast.show('SEO metadata updated successfully', 'success');
      });
    }
  }
}
