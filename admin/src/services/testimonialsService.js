// ==============================================================================
// 7P STUDIO CONTROL CENTER — TESTIMONIALS MANAGER (testimonialsService.js)
// ==============================================================================

import { getLocalData, setLocalData } from './db.js';

const TESTIMONIALS_STORAGE_KEY = 'testimonials_list';

const INITIAL_TESTIMONIALS = [
  {
    id: 't_1',
    name: 'Aya Store',
    role: 'Aya Accessories Boutique',
    comment: 'ما شاء الله الشغل ممتاز وسريع جداً، سلة الواتساب فرقت جداً في سرعة الطلبات وشكل المتجر شيك ومريح للعميل.',
    comment_en: 'The WhatsApp cart completely changed how our customers place orders! So fast, clean and elegant.',
    rating: 5,
    avatar: '/testimonials/tiktok-aya-store.jpg',
    platform: 'tiktok',
    isApproved: true,
    isFeatured: true
  },
  {
    id: 't_2',
    name: 'Mohamed Tech',
    role: 'Corporate Solution',
    comment: 'الموقع طلع في منتهى الاحترافية والأنيميشن مظبوط بدون أي بطء. تسليم في الميعاد بالضبط.',
    comment_en: 'Great attention to details, animations were smooth and the site looks like high-end European agencies.',
    rating: 5,
    avatar: '/testimonials/tiktok-mohamed-tech.jpg',
    platform: 'tiktok',
    isApproved: true,
    isFeatured: true
  },
  {
    id: 't_3',
    name: 'Diaa Khaled',
    role: 'Workspace Platform',
    comment: 'التعامل راقي جداً والشغل منظم، صفحة الحجز اتنفذت بأحسن من اللي كنا متخيلينه.',
    comment_en: 'Booking system is very intuitive, and mobile responsiveness is 10/10.',
    rating: 5,
    avatar: '/testimonials/tiktok-diaa-khaled.jpg',
    platform: 'tiktok',
    isApproved: true,
    isFeatured: true
  }
];

export const TestimonialsService = {
  getTestimonials() {
    const local = getLocalData(TESTIMONIALS_STORAGE_KEY, null);
    if (!local) {
      setLocalData(TESTIMONIALS_STORAGE_KEY, INITIAL_TESTIMONIALS);
      return INITIAL_TESTIMONIALS;
    }
    return local;
  },

  toggleApproval(id) {
    const list = this.getTestimonials();
    const item = list.find(t => t.id === id);
    if (item) {
      item.isApproved = !item.isApproved;
      setLocalData(TESTIMONIALS_STORAGE_KEY, list);
      return item.isApproved;
    }
  },

  addTestimonial(t) {
    const list = this.getTestimonials();
    const newItem = {
      id: 't_' + Date.now(),
      isApproved: true,
      isFeatured: false,
      rating: 5,
      avatar: '/photos/photo-1-avatar.webp',
      ...t
    };
    list.push(newItem);
    setLocalData(TESTIMONIALS_STORAGE_KEY, list);
    return newItem;
  },

  deleteTestimonial(id) {
    const list = this.getTestimonials();
    const filtered = list.filter(t => t.id !== id);
    setLocalData(TESTIMONIALS_STORAGE_KEY, filtered);
  }
};
