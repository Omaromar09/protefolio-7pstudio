/**
 * ==========================================================================
 * 7P STUDIO — INTERACTIVE PROJECT ESTIMATOR & LIVE WHATSAPP QUOTE ENGINE
 * High-IQ interactive configurator & dynamic quote architect
 * ==========================================================================
 */

import { getLanguage } from '../utils/i18n.js';
import { fireSuccessConfetti } from '../utils/confetti.js';
import { showToast } from '../utils/toast.js';

export function initProjectEstimator() {
  const typeContainer = document.getElementById('project-type-container');
  const featuresContainer = document.getElementById('features-container');
  const speedContainer = document.getElementById('speed-container');
  const whatsappTrigger = document.getElementById('hud-whatsapp-trigger');
  const quoteIdEl = document.getElementById('hud-quote-id');
  const valScopeEl = document.getElementById('hud-val-scope');
  const valDeliveryEl = document.getElementById('hud-val-delivery');
  const tagsContainer = document.getElementById('hud-tags-container');

  if (!typeContainer || !whatsappTrigger) return;

  // Generate randomized persistent session Quote ID
  const quoteId = `#7P-Q${Math.floor(1000 + Math.random() * 9000)}`;
  if (quoteIdEl) quoteIdEl.textContent = quoteId;

  // State
  let activeTypeId = 'landing';
  let activeFeatures = ['whatsapp', 'responsive', 'speed'];
  let activeSpeed = 'standard';

  // Days mapping
  const baseDays = {
    landing: { standard: '3 - 5 أيام عمل', standard_en: '3 - 5 business days', express: '48 ساعة فقط ⚡', express_en: '48 Hours Rush ⚡' },
    ecommerce: { standard: '5 - 8 أيام عمل', standard_en: '5 - 8 business days', express: '72 ساعة فقط ⚡', express_en: '72 Hours Rush ⚡' },
    corporate: { standard: '4 - 7 أيام عمل', standard_en: '4 - 7 business days', express: '48 - 72 ساعة ⚡', express_en: '48 - 72 Hours ⚡' },
    menu: { standard: '3 - 5 أيام عمل', standard_en: '3 - 5 business days', express: '48 ساعة فقط ⚡', express_en: '48 Hours Rush ⚡' },
    bugfix: { standard: '24 - 48 ساعة', standard_en: '24 - 48 hours', express: 'نفس اليوم فوري ⚡', express_en: 'Same Day Express ⚡' }
  };

  function updateHUD() {
    const lang = getLanguage();
    const isAr = lang === 'ar';

    // 1. Get active type element
    const activeTypeBtn = typeContainer.querySelector(`.type-btn[data-type-id="${activeTypeId}"]`);
    const typeName = activeTypeBtn
      ? (isAr ? activeTypeBtn.getAttribute('data-name-ar') : activeTypeBtn.getAttribute('data-name-en'))
      : (isAr ? 'صفحة هبوط تسويقية' : 'Landing Page');

    if (valScopeEl) valScopeEl.textContent = typeName;

    // 2. Turnaround Days
    const typeTiming = baseDays[activeTypeId] || baseDays.landing;
    const deliveryText = activeSpeed === 'express'
      ? (isAr ? typeTiming.express : typeTiming.express_en)
      : (isAr ? typeTiming.standard : typeTiming.standard_en);

    if (valDeliveryEl) valDeliveryEl.textContent = deliveryText;

    // 3. Features Tags in HUD
    if (tagsContainer) {
      tagsContainer.innerHTML = '';
      const checkedCards = featuresContainer.querySelectorAll('.feature-toggle-card.is-checked');
      if (checkedCards.length === 0) {
        const span = document.createElement('span');
        span.className = 'hud-tag';
        span.style.color = '#94A3B8';
        span.textContent = isAr ? 'كود أساسي فقط' : 'Base Clean Code';
        tagsContainer.appendChild(span);
      } else {
        checkedCards.forEach(card => {
          const tag = document.createElement('span');
          tag.className = 'hud-tag';
          tag.textContent = isAr ? card.getAttribute('data-name-ar') : card.getAttribute('data-name-en');
          tagsContainer.appendChild(tag);
        });
      }
    }

    // 4. Build Encoded WhatsApp Link
    const checkedFeatureNames = [];
    featuresContainer.querySelectorAll('.feature-toggle-card.is-checked').forEach(card => {
      checkedFeatureNames.push(isAr ? card.getAttribute('data-name-ar') : card.getAttribute('data-name-en'));
    });

    const featuresListStr = checkedFeatureNames.length > 0 ? checkedFeatureNames.join('، ') : (isAr ? 'كود قياسي' : 'Standard clean build');
    const speedStr = activeSpeed === 'express'
      ? (isAr ? 'تنفيذ إكسبريس عاجل (48 - 72 ساعة)' : 'Express Rush (48-72h)')
      : (isAr ? 'تنفيذ قياسي دقيق' : 'Standard Delivery');

    let waMessage = '';
    if (isAr) {
      waMessage = `أهلاً 7P Studio! قمت بحساب مواصفات مشروعي على موقعكم وعايز أبدأ التنفيذ:
📌 كود الكوتيشن: ${quoteId}
🚀 نوع المشروع: ${typeName}
✨ الميزات المطلوبة: ${featuresListStr}
⏱️ ميعاد التسليم المفضل: ${deliveryText} (${speedStr})
🛠️ حزمة التقنيات المقترحة: HTML5 / JavaScript / Three.js 3D

ممكن نتفق على التفاصيل ونبدأ؟`;
    } else {
      waMessage = `Hello 7P Studio! I configured my project on your website and would like to get started:
📌 Quote ID: ${quoteId}
🚀 Project Scope: ${typeName}
✨ Selected Features: ${featuresListStr}
⏱️ Preferred Turnaround: ${deliveryText} (${speedStr})
🛠️ Tech Stack: HTML5 / JavaScript / Three.js 3D

Can we discuss details and kick off?`;
    }

    whatsappTrigger.href = `https://wa.me/201515047449?text=${encodeURIComponent(waMessage)}`;
  }

  // Bind Type Selection
  typeContainer.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      typeContainer.querySelectorAll('.type-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeTypeId = btn.getAttribute('data-type-id');
      updateHUD();
    });
  });

  // Bind Features Toggle
  featuresContainer.querySelectorAll('.feature-toggle-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-checked');
      const featId = card.getAttribute('data-feature-id');
      if (card.classList.contains('is-checked')) {
        if (!activeFeatures.includes(featId)) activeFeatures.push(featId);
      } else {
        activeFeatures = activeFeatures.filter(f => f !== featId);
      }
      updateHUD();
    });
  });

  // Bind Speed Selection
  if (speedContainer) {
    speedContainer.querySelectorAll('.speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        speedContainer.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeSpeed = btn.getAttribute('data-speed');
        updateHUD();
      });
    });
  }

  // Bind WhatsApp Trigger Click
  whatsappTrigger.addEventListener('click', (e) => {
    // Fire celebration stardust confetti
    fireSuccessConfetti(0.5, 0.6);
    const isAr = getLanguage() === 'ar';
    showToast(isAr ? 'تم تجهيز كوتيشن مشروعك وتوجيهك لواتساب 🚀' : 'Project quote prepared! Redirecting to WhatsApp 🚀', 'success');
  });

  // Initial HUD calculation
  updateHUD();

  // Listen to Language Change
  window.addEventListener('languagechange', () => {
    updateHUD();
  });

  // Bind Logo Easter Egg in Navbar
  const brandLogoTrigger = document.getElementById('brand-logo-trigger');
  if (brandLogoTrigger) {
    brandLogoTrigger.addEventListener('click', (e) => {
      // Don't prevent default anchor jump to #hero, but trigger celebratory stardust
      fireSuccessConfetti(0.15, 0.2);
    });
  }
}
