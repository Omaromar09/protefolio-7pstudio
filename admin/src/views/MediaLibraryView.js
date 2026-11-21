// ==============================================================================
// 7P STUDIO CONTROL CENTER — MEDIA LIBRARY (MediaLibraryView.js)
// Upload images, filter, copy URLs, view dimensions & file size
// ==============================================================================

import { AdminToast } from '../components/Toast.js';

export class MediaLibraryView {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.filterType = 'all';
    this.searchQuery = '';
    this.mediaItems = [
      { id: 'm1', name: 'aya-preview.jpg', url: '/projects/aya-preview.jpg', type: 'image', size: '93.5 KB', dim: '1200x800', date: 'Oct 26, 2026' },
      { id: 'm2', name: 'elara-preview.jpg', url: '/projects/elara-preview.jpg', type: 'image', size: '88.2 KB', dim: '1200x800', date: 'Nov 18, 2026' },
      { id: 'm3', name: 'flowers-preview.jpg', url: '/projects/flowers-preview.jpg', type: 'image', size: '110.7 KB', dim: '1200x800', date: 'Nov 11, 2026' },
      { id: 'm4', name: 'festival-preview.jpg', url: '/projects/festival-preview.jpg', type: 'image', size: '139.0 KB', dim: '1200x800', date: 'Nov 11, 2026' },
      { id: 'm5', name: 'elmo7taref-preview.jpg', url: '/projects/elmo7taref-preview.jpg', type: 'image', size: '46.5 KB', dim: '1200x800', date: 'Oct 26, 2026' },
      { id: 'm6', name: 'elveranda.jpg', url: '/projects/elveranda.jpg', type: 'image', size: '88.4 KB', dim: '1200x800', date: 'Nov 11, 2026' },
      { id: 'm7', name: 'rawnaq-preview.jpg', url: '/projects/rawnaq-preview.jpg', type: 'image', size: '65.3 KB', dim: '1200x800', date: 'Nov 11, 2026' },
      { id: 'm8', name: 'xops-preview.jpg', url: '/projects/xops-preview.jpg', type: 'image', size: '134.0 KB', dim: '1200x800', date: 'Nov 11, 2026' },
      { id: 'm9', name: 'logo-7p.png', url: '/src/assets/logo-7p.png', type: 'image', size: '57.4 KB', dim: '512x512', date: 'Nov 15, 2026' },
      { id: 'm10', name: 'og-image.jpg', url: '/og-image.jpg', type: 'image', size: '38.6 KB', dim: '1200x630', date: 'Nov 15, 2026' }
    ];
  }

  render() {
    const filtered = this.mediaItems.filter(m => {
      const matchSearch = !this.searchQuery || m.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchType = this.filterType === 'all' || m.type === this.filterType;
      return matchSearch && matchType;
    });

    return `
      <div class="media-view-container">
        <!-- Module Header -->
        <div class="module-header">
          <div class="module-title-box">
            <h1>Media Library</h1>
            <p>Upload, organize, inspect, and copy links to portfolio graphics, thumbnails, and 3D textures (${this.mediaItems.length} assets).</p>
          </div>
          <div class="module-actions-bar">
            <button class="btn-primary" id="upload-media-trigger">
              <i class="fa-solid fa-cloud-arrow-up"></i>
              <span>Upload New File</span>
            </button>
            <input type="file" id="media-file-input" style="display: none;" accept="image/*,video/*" />
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="table-filter-bar">
          <div class="filter-group-left">
            <div class="search-input-wrap">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" class="search-input-field" id="media-search-input" placeholder="Search files by name..." value="${this.searchQuery}" />
            </div>

            <select class="filter-select" id="media-type-select">
              <option value="all">All File Types</option>
              <option value="image">Images (JPG, PNG, WEBP)</option>
              <option value="video">Videos (MP4)</option>
            </select>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            Showing ${filtered.length} files
          </div>
        </div>

        <!-- Media Grid -->
        <div class="media-grid-container">
          ${filtered.map(m => `
            <div class="media-item-card" data-url="${m.url}">
              <div class="media-preview-box">
                <img src="${m.url}" alt="${m.name}" class="media-preview-img" loading="lazy" />
              </div>
              <div class="media-info-box">
                <div class="media-filename" title="${m.name}">${m.name}</div>
                <div class="media-filesize">${m.size} • ${m.dim}</div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px;">
                  <button class="btn-icon copy-url-btn" data-url="${m.url}" title="Copy URL" style="width: 28px; height: 28px;">
                    <i class="fa-regular fa-copy" style="font-size: 0.75rem;"></i>
                  </button>
                  <a href="${m.url}" target="_blank" class="btn-icon" title="View Full" style="width: 28px; height: 28px;">
                    <i class="fa-solid fa-up-right-from-square" style="font-size: 0.72rem;"></i>
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    const searchInput = container.querySelector('#media-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.refresh(container);
      });
    }

    const typeSelect = container.querySelector('#media-type-select');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        this.filterType = e.target.value;
        this.refresh(container);
      });
    }

    // Copy URL
    container.querySelectorAll('.copy-url-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const url = btn.getAttribute('data-url');
        await navigator.clipboard.writeText(window.location.origin + url);
        AdminToast.show('URL copied to clipboard!', 'success');
      });
    });

    // Upload simulation
    const uploadTrigger = container.querySelector('#upload-media-trigger');
    const fileInput = container.querySelector('#media-file-input');
    if (uploadTrigger && fileInput) {
      uploadTrigger.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const fakeItem = {
            id: 'm_' + Date.now(),
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type.includes('video') ? 'video' : 'image',
            size: `${(file.size / 1024).toFixed(1)} KB`,
            dim: 'Custom',
            date: 'Today'
          };
          this.mediaItems.unshift(fakeItem);
          AdminToast.show(`Uploaded "${file.name}"`, 'success');
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
