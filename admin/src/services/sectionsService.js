// ==============================================================================
// 7P STUDIO CONTROL CENTER — PAGES & SECTIONS CMS (sectionsService.js)
// Allows studio admin to edit copy, headlines, CTA URLs, and visibility
// ==============================================================================

import { getLocalData, setLocalData } from './db.js';

const SECTIONS_STORAGE_KEY = 'sections_content';

const INITIAL_SECTIONS = {
  hero: {
    id: 'hero',
    name: 'Hero Showcase Section',
    isVisible: true,
    headline_ar: 'بنحول فكرتك لموقع عصري يبيع ويجيب عملاء',
    headline_en: 'Crafting Web Experiences That Convert & Stand Out',
    subheadline_ar: 'استوديو 7P Studio لتصميم وتطوير مواقع الويب التفاعلية 3D والمتاجر السريعة مع ربط مباشر بطلبات واتساب.',
    subheadline_en: '7P Studio crafts high-performance 3D websites, fast e-commerce stores, and digital experiences.',
    ctaText_ar: 'اعرف سعر مشروعك في 30 ثانية',
    ctaText_en: 'Get Instant Project Estimate',
    ctaUrl: '#estimator'
  },
  services: {
    id: 'services',
    name: 'Services Bento Grid',
    isVisible: true,
    title_ar: 'خدماتنا الاستثنائية',
    title_en: 'Our Core Offerings',
    subtitle_ar: 'حلول برمجية متكاملة مصممة لرفع قيمة بيزنسك وزيادة مبيعاتك.',
    subtitle_en: 'Full-stack engineering & creative digital experiences for modern brands.'
  },
  estimator: {
    id: 'estimator',
    name: 'Interactive Project Estimator',
    isVisible: true,
    whatsappRecipient: '201515047449',
    avgDeliveryDays: '7 - 14 Business Days'
  },
  contact: {
    id: 'contact',
    name: 'Contact & Inquiry Section',
    isVisible: true,
    phone: '+201515047449',
    whatsapp: '+201515047449',
    email: 'contact@7pstudio.tech',
    tiktok: '@7p.studio6',
    instagram: '@7p__studio'
  }
};

export const SectionsService = {
  getSections() {
    const local = getLocalData(SECTIONS_STORAGE_KEY, null);
    if (!local) {
      setLocalData(SECTIONS_STORAGE_KEY, INITIAL_SECTIONS);
      return INITIAL_SECTIONS;
    }
    return local;
  },

  updateSection(sectionId, updates) {
    const sections = this.getSections();
    if (sections[sectionId]) {
      sections[sectionId] = { ...sections[sectionId], ...updates };
      setLocalData(SECTIONS_STORAGE_KEY, sections);
      return sections[sectionId];
    }
  }
};
