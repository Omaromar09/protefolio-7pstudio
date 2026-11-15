/**
 * ==========================================================================
 * CLIENT TESTIMONIALS & REVIEWS (آراء العملاء وتقييمات المشاريع)
 * ==========================================================================
 * تجارب حقيقية لعملاء نفذنا مشاريعهم، وملاحظات موثقة من أصحاب بيزنس ومتابعين
 * بدون أي إيموجي أو عبارات تسويقية مصطنعة.
 */

export const CLIENT_REVIEWS = [
  // 1. Aya Accessories Boutique (Verified Client)
  {
    id: 'aya',
    name_ar: 'آية',
    name_en: 'Aya',
    business_ar: 'متجر آية للإكسسوارات',
    business_en: 'Aya Accessories Boutique',
    role_ar: 'مؤسسة المتجر',
    role_en: 'Store Founder',
    quote_ar: 'عمر وجاد نفذوا لي متجر سريع جداً وسهل الاستخدام، تنسيق المنتجات وسلة الطلب على الواتساب وفرت عليا وقت كبير وسهلت متابعة طلبات العملاء.',
    quote_en: 'Omar & Gad built a very fast and easy-to-use boutique website for my store. Product layout and direct WhatsApp ordering saved us huge time.',
    rating: 5,
    avatar: '/projects/aya-logo.jpg',
    isTikTok: false,
    source_ar: 'عميل حقيقي متعاقد',
    source_en: 'Verified Direct Client',
    link: 'https://aya-accessories.vercel.app/'
  },
  // 2. Festival Pastry (Verified Client)
  {
    id: 'festival',
    name_ar: 'إدارة حلواني فيستيفال',
    name_en: 'Festival Pastry Team',
    business_ar: 'حلواني فيستيفال فايف ستار',
    business_en: 'Festival Pastry 5-Star',
    role_ar: 'إدارة الفروع',
    role_en: 'Branch Management',
    quote_ar: 'الموقع تصميمه راقي ومتوافق تماماً مع الموبايل، العملاء بقوا يتصفحوا تشكيلة التورت والأسعار وقائمة الفروع بسهولة وبدون أي بطء.',
    quote_en: 'The website is crisp, elegant, and perfectly mobile-friendly. Customers now browse our full cake selection, prices, and branches with ease.',
    rating: 5,
    avatar: '/projects/festival-logo.jpg',
    isTikTok: false,
    source_ar: 'عميل حقيقي متعاقد',
    source_en: 'Verified Direct Client',
    link: 'https://festival-fivestar.vercel.app/'
  },
  // 3. XO PS Lounge (Verified Client)
  {
    id: 'xops',
    name_ar: 'كابتن محمود',
    name_en: 'Mahmoud',
    business_ar: 'لاونج إكس أو للألعاب',
    business_en: 'XO PS Lounge',
    role_ar: 'المدير التنفيذي',
    role_en: 'Operations Lead',
    quote_ar: 'شغل احترافي ومحترم جداً، صفحة المنيو والأسعار سهلة وسريعة وبتفتح فوري على الموبايل بدون تعقيد، والتعامل كان في منتهى الوضوح والالتزام.',
    quote_en: 'Highly professional work. The menu and pricing page loads instantly on mobile, and the communication throughout delivery was clear and on-time.',
    rating: 5,
    avatar: '/projects/xo-logo.jpg',
    isTikTok: false,
    source_ar: 'عميل حقيقي متعاقد',
    source_en: 'Verified Direct Client',
    link: 'https://xo-ps-lounge.vercel.app/'
  },
  // 4. Aya Store comment on TikTok Showcase
  {
    id: 'tiktok-aya-store',
    name_ar: 'متجر آية',
    name_en: 'Aya Store',
    business_ar: 'متابعة من مجتمع الأعمال',
    business_en: 'Business Community Review',
    role_ar: 'عميلة على تيك توك',
    role_en: 'Client on TikTok',
    quote_ar: 'شغل محترم جداً، عملت الويب سايت بتاعي وكان في قمة الشياكة والسرعة.',
    quote_en: 'Respectable work, they built my website with great taste and speed.',
    rating: 5,
    avatar: '/projects/aya-logo.jpg',
    isTikTok: true,
    source_ar: 'فيديو عرض الشغل على تيك توك',
    source_en: 'TikTok Showcase Video',
    link: 'https://www.tiktok.com/@7p.studio6'
  },
  // 5. Mohamed Ahmed on TikTok Showcase
  {
    id: 'tiktok-mohamed-ahmed',
    name_ar: 'محمد أحمد',
    name_en: 'Mohamed Ahmed',
    business_ar: 'متابع لأعمال الاستوديو',
    business_en: 'Studio Showcase Reviewer',
    role_ar: 'متابع تقني',
    role_en: 'Tech Follower',
    quote_ar: 'اللهم بارك، شغل ممتاز جداً يا بشمهندس، ربنا يوفقكم ويزيدكم من فضله.',
    quote_en: 'Outstanding and clean implementation, wishing you continuous success.',
    rating: 5,
    avatar: '/testimonials/tiktok-mohamed-ahmed.jpg',
    isTikTok: true,
    source_ar: 'فيديو عرض الشغل على تيك توك',
    source_en: 'TikTok Showcase Video',
    link: 'https://www.tiktok.com/@7p.studio6'
  },
  // 6. Moustafa on TikTok Showcase
  {
    id: 'tiktok-moustafa',
    name_ar: 'مصطفى',
    name_en: 'Moustafa',
    business_ar: 'متابع لأعمال الاستوديو',
    business_en: 'Community Reviewer',
    role_ar: 'متابع على تيك توك',
    role_en: 'Follower on TikTok',
    quote_ar: 'تسلم إيديكم، مستوى تنفيذ راقي ومتعوب عليه، بالتوفيق دائماً.',
    quote_en: 'Great craftsmanship and polished execution. Best wishes always.',
    rating: 5,
    avatar: '/testimonials/tiktok-moustafa.jpg',
    isTikTok: true,
    source_ar: 'فيديو عرض الشغل على تيك توك',
    source_en: 'TikTok Showcase Video',
    link: 'https://www.tiktok.com/@7p.studio6'
  },
  // 7. Mohamed Tech
  {
    id: 'tiktok-mohamed-tech',
    name_ar: 'محمد تك',
    name_en: 'Mohamed Tech',
    business_ar: 'محتوى تقني وبرمجيات',
    business_en: 'Tech & Software Reviews',
    role_ar: 'متابع تقني على تيك توك',
    role_en: 'Tech Creator on TikTok',
    quote_ar: 'ما شاء الله، شغل عالي ومتقن ومختلف عن المعتاد في السوق.',
    quote_en: 'High-end, refined work that clearly stands out in quality.',
    rating: 5,
    avatar: '/testimonials/tiktok-mohamed-tech.jpg',
    isTikTok: true,
    source_ar: 'فيديو عرض الشغل على تيك توك',
    source_en: 'TikTok Showcase Video',
    link: 'https://www.tiktok.com/@7p.studio6'
  },
  // 8. Sama
  {
    id: 'tiktok-sama',
    name_ar: 'سما',
    name_en: 'Sama',
    business_ar: 'متابعة لأعمال الاستوديو',
    business_en: 'Community Follower',
    role_ar: 'متابعة على تيك توك',
    role_en: 'Follower on TikTok',
    quote_ar: 'ما شاء الله اللهم بارك، سرعة التصفح وتناسق الألوان مريح جداً.',
    quote_en: 'Remarkable speed and comfortable visual harmony.',
    rating: 5,
    avatar: '/testimonials/tiktok-sama.jpg',
    isTikTok: true,
    source_ar: 'فيديو عرض الشغل على تيك توك',
    source_en: 'TikTok Showcase Video',
    link: 'https://www.tiktok.com/@7p.studio6'
  }
];

export function renderTestimonials(lang = 'ar') {
  const section = document.getElementById('testimonials');
  const container = document.getElementById('testimonials-container');
  if (!section || !container) return;

  const validReviews = CLIENT_REVIEWS.filter(r => {
    if (!r) return false;
    const text = lang === 'ar' ? r.quote_ar : r.quote_en;
    return text && text.trim().length > 0;
  });

  if (validReviews.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  container.innerHTML = validReviews.map(r => {
    const isTikTok = !!r.isTikTok;
    const badgeText = lang === 'ar' ? r.source_ar : r.source_en;
    const badgeMarkup = isTikTok
      ? `<a href="${r.link || 'https://www.tiktok.com/@7p.studio6'}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="review-source-badge tiktok" 
            title="${lang === 'ar' ? 'افتح حساب التيك توك وشاهد الفيديوهات' : 'Watch on TikTok'}">
           <i class="fa-brands fa-tiktok"></i>
           <span>${badgeText}</span>
           <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.65rem; margin-inline-start: 4px; opacity: 0.85;"></i>
         </a>`
      : `<span class="review-source-badge client" style="color: #E8A33D; border-color: rgba(232, 163, 61, 0.4); background: rgba(232, 163, 61, 0.08);">
           <i class="fa-solid fa-circle-check"></i>
           <span>${badgeText}</span>
         </span>`;

    const authorRole = lang === 'ar' 
      ? (r.business_ar || r.role_ar) 
      : (r.business_en || r.role_en);

    return `
      <div class="testimonial-card ${isTikTok ? 'is-tiktok-card' : 'is-client-card'}">
        <div class="testimonial-top-row">
          <div class="testimonial-stars" aria-label="${r.rating || 5} out of 5 stars" style="color: #E8A33D;">
            ${'<i class="fa-solid fa-star"></i>'.repeat(r.rating || 5)}
          </div>
          ${badgeMarkup}
        </div>

        <p class="testimonial-quote">“${lang === 'ar' ? r.quote_ar : r.quote_en}”</p>

        <div class="testimonial-author">
          <div class="testimonial-avatar ${isTikTok ? 'tiktok-ring' : ''}">
            ${r.avatar 
              ? `<img src="${r.avatar}" alt="${lang === 'ar' ? r.name_ar : r.name_en}" loading="lazy" />` 
              : `<i class="fa-solid fa-user"></i>`
            }
          </div>
          <div class="testimonial-author-info">
            <h4 class="testimonial-name">${lang === 'ar' ? r.name_ar : r.name_en}</h4>
            <span class="testimonial-biz">${authorRole}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
