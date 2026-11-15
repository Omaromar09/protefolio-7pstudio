import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update Hero Proof Row
html = html.replace(
  '<span data-i18n="heroProofProjectsVal">6 Projects</span>',
  '<span data-i18n="heroProofProjectsVal">7 Projects</span>'
);
html = html.replace(
  '<span data-i18n="heroProofIndustriesVal">6 مجالات</span>',
  '<span data-i18n="heroProofIndustriesVal">7 مجالات</span>'
);
html = html.replace(
  '<span data-i18n="heroProofIndustriesVal">6 Domains</span>',
  '<span data-i18n="heroProofIndustriesVal">7 Domains</span>'
);
html = html.replace(
  '<span class="hero-proof-label" data-i18n="heroProofIndustriesLabel">متاجر، مطاعم، مساحات، جيمينج، 3D</span>',
  '<span class="hero-proof-label" data-i18n="heroProofIndustriesLabel">متاجر، زهور، مطاعم، مساحات، جيمينج، 3D</span>'
);

// 2. Add Flowers to mobile-work-list BEFORE Festival
const festivalMobileAnchor = '<a href="https://festival-fivestar.vercel.app/" target="_blank" rel="noopener noreferrer" class="mobile-work-item">';
const flowersMobileItem = `<a href="https://flowers-pi-two.vercel.app/" target="_blank" rel="noopener noreferrer" class="mobile-work-item">
                  <div class="mobile-work-icon" style="background: rgba(225, 29, 72, 0.15); color: #e11d48;"><i class="fa-solid fa-spa"></i></div>
                  <div class="mobile-work-info">
                    <span class="mobile-work-name" data-i18n="mobileWorkFlowersName">Jardin Vivant Luxury Florals (Demo)</span>
                    <span class="mobile-work-tag" data-i18n="mobileWorkFlowersTag">Interactive 3D Flora & Chilled Delivery</span>
                  </div>
                  <i class="fa-solid fa-arrow-up-right-from-square mobile-work-link-icon"></i>
                </a>\r\n                ${festivalMobileAnchor}`;

if (html.includes(festivalMobileAnchor)) {
  html = html.replace(festivalMobileAnchor, flowersMobileItem);
} else {
  console.error('Could not find festivalMobileAnchor');
}

// 3. Add Flowers to Trust Section BEFORE Festival
const festivalTrustAnchor = '<a href="https://festival-fivestar.vercel.app/" target="_blank" rel="noopener noreferrer" class="trust-live-item">';
const flowersTrustItem = `<a href="https://flowers-pi-two.vercel.app/" target="_blank" rel="noopener noreferrer" class="trust-live-item">
                <div class="trust-live-info">
                  <span class="trust-live-dot" style="background: #E11D48; box-shadow: 0 0 10px #E11D48;"></span>
                  <div>
                    <div class="trust-live-title">بوتيك جاردان فيفانت للزهور (Jardin Vivant) <span class="tab-badge-demo" style="margin-inline-start: 6px;">تجريبي</span></div>
                    <div class="trust-live-url">flowers-pi-two.vercel.app · تجريبي</div>
                  </div>
                </div>
                <i class="fa-solid fa-arrow-up-right-from-square" style="color: var(--text-dim); font-size: 0.85rem;"></i>
              </a>\r\n\r\n              ${festivalTrustAnchor}`;

if (html.includes(festivalTrustAnchor)) {
  html = html.replace(festivalTrustAnchor, flowersTrustItem);
} else {
  console.error('Could not find festivalTrustAnchor');
}

// 4. Update Showcase Tabs in SSR HTML: Insert Flowers Tab at index 1 and update subsequent data-idx
const oldTabsBlock = `<div class="showcase-tabs-nav" role="tablist" aria-label="Projects">
        
          <button type="button" 
                  class="showcase-tab-btn is-active" 
                  data-idx="0"
                  role="tab"
                  aria-selected="true">
            <span class="tab-dot" style="background: #FF3DF0"></span>
            <span class="tab-title">Aya Accessories Boutique</span>
            
          </button>
        
          <button type="button" 
                  class="showcase-tab-btn " 
                  data-idx="1"
                  role="tab"
                  aria-selected="false">
            <span class="tab-dot" style="background: #F59E0B"></span>
            <span class="tab-title">Festival Pastry 5-Star</span>
            
          </button>
        
          <button type="button" 
                  class="showcase-tab-btn " 
                  data-idx="2"
                  role="tab"
                  aria-selected="false">
            <span class="tab-dot" style="background: #8B3DFF"></span>
            <span class="tab-title">كيان للأزياء الفاخرة (تجريبي)</span>
            <span class="tab-badge-demo">تجريبي</span>
          </button>
        
          <button type="button" 
                  class="showcase-tab-btn " 
                  data-idx="3"
                  role="tab"
                  aria-selected="false">
            <span class="tab-dot" style="background: #2EE6FF"></span>
            <span class="tab-title">El Veranda Coworking Hub</span>
            
          </button>
        
          <button type="button" 
                  class="showcase-tab-btn " 
                  data-idx="4"
                  role="tab"
                  aria-selected="false">
            <span class="tab-dot" style="background: #FFB800"></span>
            <span class="tab-title">متجر رَوْنَـق للعطور الفاخرة 3D (تجريبي)</span>
            <span class="tab-badge-demo">تجريبي</span>
          </button>
        
          <button type="button" 
                  class="showcase-tab-btn " 
                  data-idx="5"
                  role="tab"
                  aria-selected="false">
            <span class="tab-dot" style="background: #C69255"></span>
            <span class="tab-title">لاونج إكس أو بلايستيشن (تجريبي)</span>
            <span class="tab-badge-demo">تجريبي</span>
          </button>
        
      </div>`;

const newTabsBlock = `<div class="showcase-tabs-nav" role="tablist" aria-label="Projects">
        
          <button type="button" 
                  class="showcase-tab-btn is-active" 
                  data-idx="0"
                  role="tab"
                  aria-selected="true">
            <span class="tab-dot" style="background: #FF3DF0"></span>
            <span class="tab-title">Aya Accessories Boutique</span>
          </button>
        
          <button type="button" 
                  class="showcase-tab-btn " 
                  data-idx="1"
                  role="tab"
                  aria-selected="false">
            <span class="tab-dot" style="background: #E11D48"></span>
            <span class="tab-title">Jardin Vivant Haute Floriculture (Demo)</span>
            <span class="tab-badge-demo">Demo</span>
          </button>
        
          <button type="button" 
                  class="showcase-tab-btn " 
                  data-idx="2"
                  role="tab"
                  aria-selected="false">
            <span class="tab-dot" style="background: #F59E0B"></span>
            <span class="tab-title">Festival Pastry 5-Star</span>
          </button>
        
          <button type="button" 
                  class="showcase-tab-btn " 
                  data-idx="3"
                  role="tab"
                  aria-selected="false">
            <span class="tab-dot" style="background: #8B3DFF"></span>
            <span class="tab-title">Kayan Luxury Fashion (Demo)</span>
            <span class="tab-badge-demo">Demo</span>
          </button>
        
          <button type="button" 
                  class="showcase-tab-btn " 
                  data-idx="4"
                  role="tab"
                  aria-selected="false">
            <span class="tab-dot" style="background: #2EE6FF"></span>
            <span class="tab-title">El Veranda Coworking Hub</span>
          </button>
        
          <button type="button" 
                  class="showcase-tab-btn " 
                  data-idx="5"
                  role="tab"
                  aria-selected="false">
            <span class="tab-dot" style="background: #FFB800"></span>
            <span class="tab-title">Rawnaq 3D Luxury Perfumes (Demo)</span>
            <span class="tab-badge-demo">Demo</span>
          </button>
        
          <button type="button" 
                  class="showcase-tab-btn " 
                  data-idx="6"
                  role="tab"
                  aria-selected="false">
            <span class="tab-dot" style="background: #C69255"></span>
            <span class="tab-title">XO PS Gaming Lounge (Demo)</span>
            <span class="tab-badge-demo">Demo</span>
          </button>
        
      </div>`;

// Replace tab block if found
const tabsNavRegex = /<div class="showcase-tabs-nav" role="tablist" aria-label="Projects">[\s\S]*?<\/div>/;
if (tabsNavRegex.test(html)) {
  html = html.replace(tabsNavRegex, newTabsBlock);
  console.log('Replaced showcase-tabs-nav');
} else {
  console.error('Could not find tabsNavRegex');
}

// 5. Update count badge in SSR
html = html.replace(
  '<span id="project-curr-num">01</span> / 06',
  '<span id="project-curr-num">01</span> / 07'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html!');
