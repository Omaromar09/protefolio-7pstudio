// ==============================================================================
// 7P STUDIO CONTROL CENTER — SERVICES MANAGER (servicesService.js)
// ==============================================================================

import { getLocalData, setLocalData } from './db.js';

const SERVICES_STORAGE_KEY = 'services_list';

const INITIAL_SERVICES = [
  {
    id: 'custom-sites',
    title: { ar: 'مواقع وتطبيقات من الصفر', en: 'Websites from Scratch' },
    description: {
      ar: 'تصميم وبرمجة مواقع مخصصة بهوية فريدة، سرعة فائقة، ولمسات 3D ترفع قيمة علامتك التجارية.',
      en: 'Tailor-made web solutions engineered with modern web standards, ultra-fast load times, and custom 3D visuals.'
    },
    icon: 'fa-solid fa-code',
    displayOrder: 1,
    isFeatured: true,
    isActive: true
  },
  {
    id: 'e-commerce',
    title: { ar: 'متاجر وسلات بيع ذكية', en: 'High-Converting E-Commerce' },
    description: {
      ar: 'متاجر إلكترونية خفيفة وسريعة مع ربط مباشر بطلبات واتساب لزيادة نسبة المبيعات وتسهيل الشراء.',
      en: 'Seamless digital storefronts with WhatsApp instant checkout, smart filters, and zero cart friction.'
    },
    icon: 'fa-solid fa-cart-shopping',
    displayOrder: 2,
    isFeatured: true,
    isActive: true
  },
  {
    id: 'performance-seo',
    title: { ar: 'تسريع المواقع وحل المشاكل', en: 'Speed Optimization & Repairs' },
    description: {
      ar: 'فحص شامل للموقع، حل المشاكل البرمجية، تحسين سرعة التحميل وتهيئة الموقع لمحركات البحث.',
      en: 'Debugging, Core Web Vitals optimization, and responsive design repairs for existing websites.'
    },
    icon: 'fa-solid fa-gauge-high',
    displayOrder: 3,
    isFeatured: true,
    isActive: true
  },
  {
    id: '3d-motion',
    title: { ar: 'أنيميشن ثلاثي الأبعاد وتفاعل', en: '3D Visuals & Creative Motion' },
    description: {
      ar: 'إضافة عناصر 3D تفاعلية وأنيميشن سينمائي يلفت انتباه الزائر ويجعل موقعك لا يُنسى.',
      en: 'WebGL Three.js interactive centerpieces, GSAP animations, and custom fluid interactions.'
    },
    icon: 'fa-solid fa-cube',
    displayOrder: 4,
    isFeatured: true,
    isActive: true
  }
];

export const ServicesService = {
  getServices() {
    const local = getLocalData(SERVICES_STORAGE_KEY, null);
    if (!local) {
      setLocalData(SERVICES_STORAGE_KEY, INITIAL_SERVICES);
      return INITIAL_SERVICES;
    }
    return local;
  },

  updateService(id, updates) {
    const list = this.getServices();
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setLocalData(SERVICES_STORAGE_KEY, list);
      return list[idx];
    }
  },

  addService(service) {
    const list = this.getServices();
    const newService = {
      id: service.id || 'srv_' + Date.now(),
      displayOrder: list.length + 1,
      isActive: true,
      ...service
    };
    list.push(newService);
    setLocalData(SERVICES_STORAGE_KEY, list);
    return newService;
  },

  deleteService(id) {
    const list = this.getServices();
    const filtered = list.filter(s => s.id !== id);
    setLocalData(SERVICES_STORAGE_KEY, filtered);
  }
};
