// ==========================================================================
// 7P STUDIO — INTERACTIVE PINNED PROJECT SHOWCASE
// Scroll-driven & interactive tabs showcasing live projects with 3D device mockup
// ==========================================================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS_DATA } from '../data/projects.js';
import { getLanguage } from '../utils/i18n.js';

gsap.registerPlugin(ScrollTrigger);

let activeIndex = 0;

export function initProjectShowcase() {
  const showcaseContainer = document.getElementById('project-showcase-mount');
  if (!showcaseContainer) return;

  if (!showcaseContainer.querySelector('.showcase-shell')) {
    renderShowcaseStructure(showcaseContainer);
  }
  setupShowcaseInteractivity();
}

function renderShowcaseStructure(container) {
  const lang = getLanguage();
  const currentProject = PROJECTS_DATA[activeIndex];

  container.innerHTML = `
    <div class="showcase-shell" id="showcase-shell">
      <!-- Background Ambient Wipe -->
      <div class="showcase-ambient-wipe" id="showcase-ambient-wipe" style="--project-accent: ${currentProject.accentColor}"></div>

      <!-- Top Project Selector Tabs (Quick jump) -->
      <div class="showcase-tabs-nav" role="tablist" aria-label="Projects">
        ${PROJECTS_DATA.map((p, idx) => `
          <button type="button" 
                  class="showcase-tab-btn ${idx === activeIndex ? 'is-active' : ''}" 
                  data-idx="${idx}"
                  role="tab"
                  aria-selected="${idx === activeIndex}">
            <span class="tab-dot" style="background: ${p.accentColor}"></span>
            <span class="tab-title">${p.title[lang] || p.title.ar}</span>
            ${p.isDemo ? `<span class="tab-badge-demo">${lang === 'ar' ? 'تجريبي' : 'Demo'}</span>` : ''}
          </button>
        `).join('')}
      </div>

      <!-- Main Dual Panel Grid -->
      <div class="showcase-grid">
        <!-- Left / Start: 3D Device Mockup Stage -->
        <div class="showcase-mockup-stage" id="showcase-mockup-stage">
          <div class="device-laptop-frame" id="device-laptop-frame">
            <div class="laptop-screen-header">
              <span class="dot-red"></span>
              <span class="dot-yellow"></span>
              <span class="dot-green"></span>
              <div class="laptop-browser-bar">
                <i class="fa-solid fa-lock"></i>
                <span class="laptop-url-text" id="laptop-url-text">${currentProject.url.replace('https://', '')}</span>
              </div>
            </div>
            <div class="laptop-screen-inner">
              <img src="${currentProject.previewImg}" 
                   alt="${currentProject.title[lang] || currentProject.title.ar}" 
                   class="mockup-img active" 
                   id="mockup-screen-img"
                   loading="eager" />
              <div class="screen-glare"></div>
            </div>
            <div class="laptop-base"></div>
          </div>

          <!-- Mobile Complement Mockup -->
          <div class="device-mobile-frame" id="device-mobile-frame">
            <div class="mobile-speaker"></div>
            <div class="mobile-screen-inner">
              <img src="${currentProject.previewImg}" 
                   alt="${currentProject.title[lang] || currentProject.title.ar}" 
                   class="mockup-mobile-img" 
                   id="mockup-mobile-img"
                   loading="lazy" />
            </div>
          </div>
        </div>

        <!-- Right / End: Project Info & Features Panel -->
        <div class="showcase-info-panel chamfer-card" id="showcase-info-panel">
          <div class="panel-header">
            <div class="panel-header-tags" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <div class="project-category-pill" id="project-category-pill" style="color: ${currentProject.accentColor}; border-color: ${currentProject.accentColor}33; background: ${currentProject.accentColor}12;">
                <span class="category-icon"><i class="fa-solid fa-bolt"></i></span>
                <span id="project-category-text">${currentProject.category[lang] || currentProject.category.ar}</span>
              </div>
              <div class="project-partnership-pill" id="project-partnership-pill" style="${currentProject.partnership ? 'display: inline-flex;' : 'display: none;'} align-items: center; gap: 5px; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; color: #E0A96D; background: rgba(198, 146, 85, 0.15); border: 1px solid rgba(198, 146, 85, 0.35);">
                <i class="fa-solid fa-handshake"></i>
                <span id="project-partnership-text">${currentProject.partnership ? (currentProject.partnership[lang] || currentProject.partnership.ar) : ''}</span>
              </div>
            </div>
            <span class="project-count-badge numeral">
              <span id="project-curr-num">${(activeIndex + 1).toString().padStart(2, '0')}</span> / ${(PROJECTS_DATA.length).toString().padStart(2, '0')}
            </span>
          </div>

          <h3 class="project-hero-title" id="project-hero-title">
            ${currentProject.title[lang] || currentProject.title.ar}
          </h3>

          <p class="project-desc" id="project-desc">
            ${currentProject.short[lang] || currentProject.short.ar}
          </p>

          <div class="project-features-list">
            <span class="features-label">${lang === 'ar' ? 'أبرز الميزات المُنفّذة:' : 'Key Implemented Features:'}</span>
            <div class="features-chips-wrap" id="features-chips-wrap">
              ${(currentProject.tags[lang] || currentProject.tags.ar).map(tag => `
                <span class="feature-chip"><i class="fa-solid fa-check"></i> ${tag}</span>
              `).join('')}
            </div>
          </div>

          <div class="project-status-row">
            <span class="pulse-green"></span>
            <span class="status-label" id="project-status-label">${currentProject.status[lang] || currentProject.status.ar}</span>
          </div>

          <div class="project-actions-row">
            <a href="${currentProject.url}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn btn-primary showcase-live-btn" 
               id="showcase-live-btn"
               style="background: ${currentProject.accentColor}">
              <span id="showcase-live-text">${lang === 'ar' ? 'افتح الموقع لايف' : 'Open Live Website'}</span>
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>

            <a href="#" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn btn-secondary showcase-similar-btn" 
               id="showcase-similar-btn">
              <i class="fa-brands fa-whatsapp"></i>
              <span id="showcase-similar-text">${lang === 'ar' ? 'اطلب زيه' : 'Request Similar'}</span>
            </a>
          </div>

          <!-- Quick Navigation Arrows -->
          <div class="showcase-arrows-nav">
            <button type="button" class="arrow-btn" id="showcase-prev-btn" aria-label="Previous Project">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
            <button type="button" class="arrow-btn" id="showcase-next-btn" aria-label="Next Project">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  updateSimilarWhatsAppLink(currentProject);
}

function updateSimilarWhatsAppLink(project) {
  const similarBtn = document.getElementById('showcase-similar-btn');
  if (!similarBtn) return;

  const lang = getLanguage();
  const projectName = project.title[lang] || project.title.ar;
  const msg = lang === 'ar'
    ? `مساء الخير يا عمر ويا مصطفى، شوفت موقع "${projectName}" في أعمال 7P Studio وحابب أعمل موقع زيه لبيزنسي.`
    : `Hi Omar & Mostafa, I saw "${projectName}" on 7P Studio and I would like to build a similar website for my business.`;

  similarBtn.href = `https://wa.me/201515047449?text=${encodeURIComponent(msg)}`;
}

function setupShowcaseInteractivity() {
  const tabBtns = document.querySelectorAll('.showcase-tab-btn');
  const prevBtn = document.getElementById('showcase-prev-btn');
  const nextBtn = document.getElementById('showcase-next-btn');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      switchProject(idx);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newIdx = (activeIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length;
      switchProject(newIdx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const newIdx = (activeIndex + 1) % PROJECTS_DATA.length;
      switchProject(newIdx);
    });
  }

  // Desktop 3D Tilt on Laptop Frame
  const stage = document.getElementById('showcase-mockup-stage');
  const laptop = document.getElementById('device-laptop-frame');
  if (stage && laptop && !window.matchMedia('(pointer: coarse)').matches) {
    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(laptop, {
        rotateY: x * 14,
        rotateX: -y * 10,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    });

    stage.addEventListener('mouseleave', () => {
      gsap.to(laptop, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    });
  }

  // Listen for language switch
  window.addEventListener('languagechange', () => {
    const lang = getLanguage();
    const curr = PROJECTS_DATA[activeIndex];
    updateProjectUI(curr, lang);
  });
}

function switchProject(newIdx) {
  if (newIdx === activeIndex) return;
  activeIndex = newIdx;
  const project = PROJECTS_DATA[activeIndex];
  const lang = getLanguage();

  // Update tabs active state
  document.querySelectorAll('.showcase-tab-btn').forEach((btn, idx) => {
    btn.classList.toggle('is-active', idx === activeIndex);
    btn.setAttribute('aria-selected', idx === activeIndex);
  });

  // Color Wipe Animation
  const ambientWipe = document.getElementById('showcase-ambient-wipe');
  if (ambientWipe) {
    gsap.fromTo(ambientWipe, 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
    );
    ambientWipe.style.setProperty('--project-accent', project.accentColor);
  }

  // Smooth Screen Crossfade
  const screenImg = document.getElementById('mockup-screen-img');
  const mobileImg = document.getElementById('mockup-mobile-img');
  if (screenImg) {
    gsap.to(screenImg, {
      opacity: 0,
      scale: 0.98,
      duration: 0.2,
      onComplete: () => {
        screenImg.src = project.previewImg;
        screenImg.alt = project.title[lang] || project.title.ar;
        gsap.to(screenImg, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
      }
    });
  }
  if (mobileImg) {
    mobileImg.src = project.previewImg;
  }

  updateProjectUI(project, lang);
}

function updateProjectUI(project, lang) {
  const urlText = document.getElementById('laptop-url-text');
  const catText = document.getElementById('project-category-text');
  const catPill = document.getElementById('project-category-pill');
  const currNum = document.getElementById('project-curr-num');
  const heroTitle = document.getElementById('project-hero-title');
  const desc = document.getElementById('project-desc');
  const chipsWrap = document.getElementById('features-chips-wrap');
  const statusLabel = document.getElementById('project-status-label');
  const liveBtn = document.getElementById('showcase-live-btn');

  if (urlText) urlText.textContent = project.url.replace('https://', '');
  if (currNum) currNum.textContent = (activeIndex + 1).toString().padStart(2, '0');
  if (catText) catText.textContent = project.category[lang] || project.category.ar;

  const partPill = document.getElementById('project-partnership-pill');
  const partText = document.getElementById('project-partnership-text');
  if (partPill && partText) {
    if (project.partnership) {
      partPill.style.display = 'inline-flex';
      partText.textContent = project.partnership[lang] || project.partnership.ar;
    } else {
      partPill.style.display = 'none';
    }
  }
  if (catPill) {
    catPill.style.color = project.accentColor;
    catPill.style.borderColor = `${project.accentColor}33`;
    catPill.style.background = `${project.accentColor}12`;
  }
  if (heroTitle) heroTitle.textContent = project.title[lang] || project.title.ar;
  if (desc) desc.textContent = project.short[lang] || project.short.ar;
  if (statusLabel) statusLabel.textContent = project.status[lang] || project.status.ar;
  if (liveBtn) {
    liveBtn.href = project.url;
    liveBtn.style.background = project.accentColor;
  }

  if (chipsWrap) {
    chipsWrap.innerHTML = (project.tags[lang] || project.tags.ar).map(tag => `
      <span class="feature-chip"><i class="fa-solid fa-check"></i> ${tag}</span>
    `).join('');
  }

  updateSimilarWhatsAppLink(project);
}
