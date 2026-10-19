/**
 * ==========================================================================
 * CLIENT TESTIMONIALS / SOCIAL PROOF (آراء العملاء)
 * ==========================================================================
 * هنا تقدر تضيف آراء عملائك الحقيقيين (زي آية للاكسسوارات أو حلواني فيستيفال).
 * السكشن بيظهر تلقائياً بمجرد إضافة أي رأي حقيقي، وبيختفي تماماً لو مفيش آراء
 * أو لو النصوص فارغة، للحفاظ على المصداقية والاحترافية الكاملة.
 *
 * للبدء: شيل علامة التعليق /* ... *\/ واكتب الرأي الحقيقي للعميل.
 */

export const CLIENT_REVIEWS = [
  /*
  {
    id: 'aya',
    name_ar: 'آية',
    name_en: 'Aya',
    business_ar: 'متجر آية للاكسسوارات',
    business_en: 'Aya Accessories Boutique',
    role_ar: 'صاحبة المتجر',
    role_en: 'Store Founder',
    quote_ar: 'عمر عملي متجر ممتاز وسريع جداً، وتنسيق المنتجات وسلة الواتساب ريحتني وسهلت طلبات الزباين بشكل كبير!',
    quote_en: 'Omar built a gorgeous and incredibly fast online boutique for my store. WhatsApp ordering made taking customer orders effortless!',
    rating: 5,
    avatar: './projects/aya-logo.jpg'
  },
  {
    id: 'festival',
    name_ar: 'إدارة حلواني فيستيفال',
    name_en: 'Festival Pastry Team',
    business_ar: 'حلواني فيستيفال فايف ستار',
    business_en: 'Festival Pastry 5-Star',
    role_ar: 'الإدارة',
    role_en: 'Management',
    quote_ar: 'الموقع تصميمه رايق ومتوافق تماماً مع الموبايل، والزباين بقوا يفتحوا يشوفوا تشكيلة التورت والأسعار والفروع بسهولة.',
    quote_en: 'The website is crisp, elegant, and 100% mobile-friendly. Customers love browsing our cakes, prices, and branches with ease.',
    rating: 5,
    avatar: './projects/festival-logo.jpg'
  }
  */
];

export function renderTestimonials(lang = 'ar') {
  const section = document.getElementById('testimonials');
  const container = document.getElementById('testimonials-container');
  if (!section || !container) return;

  const validReviews = CLIENT_REVIEWS.filter(r => {
    if (!r) return false;
    const text = lang === 'ar' ? r.quote_ar : r.quote_en;
    return text && text.trim().length > 0 && !text.includes('اكتب هنا') && !text.includes('placeholder');
  });

  if (validReviews.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  container.innerHTML = validReviews.map(r => `
    <div class="testimonial-card">
      <div class="testimonial-stars" aria-label="${r.rating || 5} out of 5 stars">
        ${'<i class="fa-solid fa-star"></i>'.repeat(r.rating || 5)}
      </div>
      <p class="testimonial-quote">“${lang === 'ar' ? r.quote_ar : r.quote_en}”</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">
          ${r.avatar 
            ? `<img src="${r.avatar}" alt="${lang === 'ar' ? r.name_ar : r.name_en}" loading="lazy" />` 
            : `<i class="fa-solid fa-user"></i>`
          }
        </div>
        <div class="testimonial-author-info">
          <h4 class="testimonial-name">${lang === 'ar' ? r.name_ar : r.name_en}</h4>
          <span class="testimonial-biz">${lang === 'ar' ? (r.business_ar || r.role_ar) : (r.business_en || r.role_en)}</span>
        </div>
      </div>
    </div>
  `).join('');
}
