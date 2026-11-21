// ==============================================================================
// 7P STUDIO CONTROL CENTER — HEADER GREETING BANNER (HeaderBanner.js)
// Greeting, Date Range Selector, Live Status Pill, View Website CTA
// ==============================================================================

export class HeaderBanner {
  constructor(currentTimeRange, onDateRangeChange) {
    this.currentTimeRange = currentTimeRange || 'last30';
    this.onDateRangeChange = onDateRangeChange;
  }

  render() {
    const timeLabels = {
      today: 'Today',
      yesterday: 'Yesterday',
      last7: 'Last 7 Days',
      last30: 'Last 30 Days',
      last90: 'Last 90 Days',
      year: 'This Year'
    };

    return `
      <div class="overview-header-banner">
        <div class="greeting-text-box">
          <h1>Good morning, 7P Studio</h1>
          <p>Here's what's happening with your website today.</p>
        </div>

        <div class="header-banner-controls">
          <!-- Date Range Selector -->
          <div style="position: relative;">
            <button class="date-selector-btn" id="date-range-dropdown-btn">
              <i class="fa-regular fa-calendar"></i>
              <span id="current-range-label">${timeLabels[this.currentTimeRange] || 'Last 30 Days'}</span>
              <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; margin-left: 4px;"></i>
            </button>
            <div id="date-range-menu" style="display: none; position: absolute; right: 0; top: 42px; background: #161619; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); box-shadow: 0 10px 25px rgba(0,0,0,0.7); z-index: 50; width: 160px; overflow: hidden; padding: 4px;">
              <button class="range-option-item ${this.currentTimeRange === 'today' ? 'active' : ''}" data-range="today">Today</button>
              <button class="range-option-item ${this.currentTimeRange === 'yesterday' ? 'active' : ''}" data-range="yesterday">Yesterday</button>
              <button class="range-option-item ${this.currentTimeRange === 'last7' ? 'active' : ''}" data-range="last7">Last 7 Days</button>
              <button class="range-option-item ${this.currentTimeRange === 'last30' ? 'active' : ''}" data-range="last30">Last 30 Days</button>
              <button class="range-option-item ${this.currentTimeRange === 'last90' ? 'active' : ''}" data-range="last90">Last 90 Days</button>
              <button class="range-option-item ${this.currentTimeRange === 'year' ? 'active' : ''}" data-range="year">This Year</button>
            </div>
          </div>

          <!-- Website Live Status Pill -->
          <div class="website-live-pill">
            <span class="dot"></span>
            <span>Website Live</span>
          </div>

          <!-- View Website Button -->
          <a href="/" target="_blank" rel="noopener noreferrer" class="view-website-btn">
            <span>View Website</span>
            <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem;"></i>
          </a>
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    const btn = container.querySelector('#date-range-dropdown-btn');
    const menu = container.querySelector('#date-range-menu');

    if (btn && menu) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      });

      document.addEventListener('click', () => {
        menu.style.display = 'none';
      });

      menu.querySelectorAll('.range-option-item').forEach(opt => {
        opt.addEventListener('click', (e) => {
          const range = opt.getAttribute('data-range');
          if (range && this.onDateRangeChange) {
            this.onDateRangeChange(range);
          }
        });
      });
    }
  }
}
