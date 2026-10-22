const fs = require('fs');
const path = require('path');

const content = `/**
 * ==========================================================================
 * OMAR YAHIA — PERSONAL PORTFOLIO i18n TRANSLATIONS
 * Arabic Default (RTL) & English (LTR)
 * All copy centralized in one object for easy editing
 * Placeholders clearly marked with [EDIT: ...]
 * ==========================================================================
 */

export const translations = {
  ar: {
    // Document
    docTitle: 'عمر يحيى — مصمم ومطور ويب',
    docDesc: 'الموقع الشخصي لعمر يحيى، مصمم ومطور ويب. تصميم وتطوير مواقع عصرية، تجارب ثلاثية الأبعاد وحركات تفاعلية.',

    // Navigation
    navAbout: 'عني',
    navGallery: 'صوري',
    navServices: 'بعمل إيه',
    navWork: 'شغلي',
    navContact: 'تواصل',
    langToggle: 'EN',
    skipIntro: 'تخطي',

    // Intro (Master Timeline)
    introHeadlineLine1Before: 'خلّي',
    introHeadlineLine1After: 'عمر يبني',
    introHeadlineLine2Suffix: 'بتاعك',
    introWords: ['موقع', 'متجر', 'براند', 'مشروع'],
    introMeetLine1: 'قابل',
    introMeetLine2: 'عمر.',

    // Hero
    heroLabel: 'مصمم ومطور ويب',
    heroGreeting: 'أنا عمر',
    heroSubline: 'بصمم وببرمج مواقع',
    heroBtnWork: 'شوف شغلي',
    heroBtnContact: 'كلمني',
    heroCounterOf: 'من',

    // Section 1: About Me ("عني")
    aboutTitle: 'عني',
    aboutTagline: 'شغفي بالويب وتفاصيله',
    aboutBio: '[EDIT: اكتب هنا 2 إلى 3 أسطر عن نفسك، اهتماماتك الشخصية، وشغفك ببناء تجارب رقمية مميزة وسلسة للناس.]',
    aboutCardCaption: 'عمر يحيى · مطور ومصمم واجهات',
    aboutBadge: 'شخصي وليس استوديو',

    // Section 2: Photos ("صوري")
    galleryTitle: 'صوري',
    gallerySubtitle: 'لقطات من أوقاتي وأماكني المفضلة',
    photoCaptions: [
      'غروب البحر والهدوء',
      'صورة الجلوس على الكرسي (الصورة الأساسية)',
      'سيلفي في الكافيه',
      'صورة ليلية بالبولو المخطط',
      'انعكاس في مراية العربية',
      'زاوية قريبة بالبولو الأخضر'
    ],
    photoDragHint: 'اسحب أو مرر للتبديل بين الصور',

    // Section 3: What I Do ("بعمل إيه")
    servicesTitle: 'بعمل إيه',
    servicesSubtitle: 'التركيز على الأساسيات بجودة عالية واهتمام بالتفاصيل',
    service1Title: 'تصميم مواقع',
    service1Desc: 'تصميم واجهات مستخدم فريدة تركز على الهوية وتجربة المستخدم وسهولة الاستخدام وجمال التفاصيل.',
    service2Title: 'برمجة مواقع بأنيميشن و3D',
    service2Desc: 'تطوير تفاعلي متقدم باستخدام تقنيات الويب الحديثة وحركات سلسة ثلاثية الأبعاد تمنح الموقع حيوية.',
    service3Title: 'تعديل وتطوير مواقع موجودة',
    service3Desc: 'حل المشاكل التقنية، تحسين سرعة التصفح، وتخصيص وتطوير مزايا إضافية لموقعك الحالي.',

    // Section 4: My Work ("شغلي")
    workTitle: 'شغلي',
    workSubtitle: 'أعمالي مع العملاء وتطبيقات الويب الكاملة',
    workMainText: 'شغلي الكامل على 7P Studio',
    workSubtext: 'جميع المشاريع التجارية والأعمال البرمجية للعملاء معروضة بتفاصيلها على رابط استوديو 7P.',
    workBadge: 'رابط خارجي',

    // Section 5: Contact ("تواصل")
    contactTitle: 'تواصل',
    contactSubtitle: 'تقدر تراسلني في أي وقت لمناقشة فكرة أو مشروع جديد',
    contactWhatsappLabel: 'واتساب',
    contactWhatsappValue: '01221576360',
    contactEmailLabel: 'البريد الإلكتروني',
    contactEmailValue: 'om058166@gmail.com',
    contactInstaLabel: 'انستجرام',
    contactInstaValue: '@omar_thegratt',
    copyBtn: 'نسخ',
    copiedToast: 'تم النسخ بنجاح!',

    // Footer
    backToTop: 'إلى الأعلى ↑',
    footerRights: 'عمر يحيى — جميع الحقوق محفوظة'
  },

  en: {
    // Document
    docTitle: 'Omar Yahia — Web Designer & Developer',
    docDesc: 'Personal portfolio of Omar Yahia, web designer & developer. Crafting modern web experiences, 3D interactions, and refined motion.',

    // Navigation
    navAbout: 'About',
    navGallery: 'Photos',
    navServices: 'What I Do',
    navWork: 'My Work',
    navContact: 'Contact',
    langToggle: 'عربي',
    skipIntro: 'Skip',

    // Intro (Master Timeline)
    introHeadlineLine1Before: 'Let',
    introHeadlineLine1After: 'Omar build',
    introHeadlineLine2Suffix: 'your',
    introWords: ['website', 'store', 'brand', 'idea'],
    introMeetLine1: 'Meet',
    introMeetLine2: 'Omar.',

    // Hero
    heroLabel: 'Web Designer & Developer',
    heroGreeting: "I'm Omar",
    heroSubline: 'I design and build websites',
    heroBtnWork: 'See My Work',
    heroBtnContact: 'Get in Touch',
    heroCounterOf: 'of',

    // Section 1: About Me ("About")
    aboutTitle: 'About Me',
    aboutTagline: 'Curiosity, craft, and code',
    aboutBio: '[EDIT: Write 2 to 3 lines about me, my background, personal passions, and love for creating fluid digital web experiences.]',
    aboutCardCaption: 'Omar Yahia · UI Designer & Developer',
    aboutBadge: 'Personal Portfolio',

    // Section 2: Photos ("Photos")
    galleryTitle: 'My Photos',
    gallerySubtitle: 'Moments and snapshots along the journey',
    photoCaptions: [
      'Beach silhouette at sunset',
      'Black and white sitting portrait (Landing photo)',
      'Mirror selfie in a cafe',
      'Night photo in striped polo',
      'Reflection in a car mirror',
      'Low-angle portrait in green striped polo'
    ],
    photoDragHint: 'Drag or scroll to cycle through photos',

    // Section 3: What I Do ("What I Do")
    servicesTitle: 'What I Do',
    servicesSubtitle: 'Simple, focused craftsmanship with obsessive attention to detail',
    service1Title: 'Designing Websites',
    service1Desc: 'Bespoke user interfaces focused on distinct visual identity, intuitive ergonomics, and memorable aesthetics.',
    service2Title: 'Building with Animation & 3D',
    service2Desc: 'Advanced front-end engineering leveraging real-time 3D, physics-based springs, and fluid interactive choreography.',
    service3Title: 'Fixing & Customizing Existing Sites',
    service3Desc: 'Diagnosing technical bottlenecks, accelerating performance, and tailoring bespoke features for existing platforms.',

    // Section 4: My Work ("My Work")
    workTitle: 'My Work',
    workSubtitle: 'Client work & full-scale digital products',
    workMainText: 'My full client work at 7P Studio',
    workSubtext: 'All commercial client engagements and design systems are curated in detail on the 7P Studio showcase.',
    workBadge: 'External Link',

    // Section 5: Contact ("Contact")
    contactTitle: 'Contact',
    contactSubtitle: 'Always open to discuss new ideas, projects, or say hello',
    contactWhatsappLabel: 'WhatsApp',
    contactWhatsappValue: '01221576360',
    contactEmailLabel: 'Email',
    contactEmailValue: 'om058166@gmail.com',
    contactInstaLabel: 'Instagram',
    contactInstaValue: '@omar_thegratt',
    copyBtn: 'Copy',
    copiedToast: 'Copied to clipboard!',

    // Footer
    backToTop: 'Back to top ↑',
    footerRights: 'Omar Yahia — All rights reserved'
  }
};

let currentLang = 'ar';

export function getLanguage() {
  return currentLang;
}

export function initLanguage() {
  let saved = null;
  try {
    saved = localStorage.getItem('omar_lang');
  } catch (e) {
    console.warn('localStorage not accessible:', e);
  }

  currentLang = saved === 'en' ? 'en' : 'ar';
  applyLanguage(currentLang, false);
}

export function setLanguage(lang) {
  currentLang = lang === 'en' ? 'en' : 'ar';
  try {
    localStorage.setItem('omar_lang', currentLang);
  } catch (e) {
    console.warn('localStorage not accessible:', e);
  }
  applyLanguage(currentLang, true);
}

export function toggleLanguage() {
  const next = currentLang === 'ar' ? 'en' : 'ar';
  setLanguage(next);
  return next;
}

export function applyLanguage(lang, triggerEvents = true) {
  const dict = translations[lang] || translations.ar;
  const isRTL = lang === 'ar';

  document.documentElement.lang = lang;
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

  if (dict.docTitle) document.title = dict.docTitle;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && dict.docDesc) metaDesc.setAttribute('content', dict.docDesc);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (dict[key] !== undefined) {
      el.setAttribute('aria-label', dict[key]);
    }
  });

  const toggleBtn = document.getElementById('lang-toggle-btn');
  if (toggleBtn) {
    toggleBtn.textContent = dict.langToggle;
  }
  const mobileToggleBtn = document.getElementById('mobile-lang-toggle-btn');
  if (mobileToggleBtn) {
    mobileToggleBtn.textContent = dict.langToggle;
  }

  if (triggerEvents) {
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang, isRTL } }));
  }
}
`;

const dest = path.join(__dirname, '../src/utils/i18n.js');
fs.writeFileSync(dest, content, 'utf8');
console.log('Successfully written i18n.js!');
