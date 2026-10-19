/**
 * ==========================================================================
 * BILINGUAL i18n SYSTEM — ARABIC (DEFAULT) & ENGLISH
 * 7P Studio (Omar) — High Performance, Clean Web Development
 * ==========================================================================
 */

import { renderTestimonials } from './testimonials.js';

// ==========================================================================
// 1. EASILY EDITABLE CONSTANTS (تعديل الأسعار والملاحظات بسهولة هنا)
// ==========================================================================
export const PRICING_CONFIG = {
  // غير القيمة دي في أي وقت لتعديل سعر البداية لصفحات الهبوط
  landingPageStartingFrom_ar: '[X]',
  landingPageStartingFrom_en: '[X]'
};

// ==========================================================================
// 2. COMPLETE TRANSLATIONS DICTIONARY
// ==========================================================================
export const translations = {
  ar: {
    // Page Meta
    pageTitle: '7P STUDIO — عمر | مواقع عصرية وتفاعلية وسريعة',
    pageMetaDesc: '7P STUDIO / عمر - مطور ويب يبني مواقع نظيفة، عصرية، تفاعلية ويحل مشاكل المواقع بسرعة. تصميم وتطوير مواقع، أبعاد ثلاثية 3D، وحل فوري للمشاكل.',

    // Intro Stage
    soundOn: 'تشغيل الصوت',
    soundOff: 'كتم الصوت',
    skipIntro: 'تخطي',

    // Navigation & Header
    navBrand: 'STUDIO',
    navHome: 'الرئيسية',
    navAbout: 'عني',
    navWork: 'أعمالي',
    navServices: 'خدماتي',
    navProcess: 'طريقة الشغل',
    navContact: 'تواصل معايا',
    navCta: 'تكلم معايا',
    mobileCta: 'ابدأ موقعك دلوقتي',
    availableBadge: 'متاح لمشاريع',
    waTooltipTitle: 'متاح للشات دلوقتي',
    waTooltipSub: 'كلمنا واتساب مباشر',
    copyLinkSuccess: 'تم نسخ رابط المشروع بنجاح!',

    // Hero Section
    heroBadge1: '⚡ جاهز لنقل بيزنسك للرقمية أسرع وبدون صداع',
    heroBadge2: 'ويبسايت على كيفك وحركات 3D خفيفة',
    heroTitle: 'ويبسايت على كيفك، <span class="highlight">شكله رايق،</span> وسريع.',
    heroSubtitle: 'أهلاً، أنا <strong>عمر</strong>. بعمل مواقع لعملاء وبيزنس، بحل أي باجات أو مشاكل في مواقع موجودة، وبظبط الموقع على طلبك بالظبط ومن غير تعقيد.',
    heroCtaWork: 'شوف شغلي',
    heroCtaContact: 'ابدأ مشروعك معايا 🚀',
    heroStat1: 'تسليم سريع وفي الميعاد بالظبط',
    heroStat2: 'مضبوط 100% على الموبايل والكمبيوتر',
    heroStat3: 'دعم فني وتعديلات بعد التسليم',
    hero3dHint: 'حرك الماوس لتلف المجسم 3D',

    // Partners & Projects Showcase
    partnersBadge: 'أعمال ومشاريع',
    partnersTitle: 'شغلي <span class="highlight">ومشاريع نفذتها</span>',
    partnersSubtitle: 'دوس على أي موقع عشان تفتحه، أو وقّف الماوس عليه عشان تشوف تفاصيله',
    badgeClientWork: 'مشروع اتسلم لعميل',
    badgeReadyDesign: 'شغال وجاهز يتعدل ليك',
    visitLiveBtn: 'افتح الموقع لايف',

    p1Title: 'متجر آية للاكسسوارات (Aya Accessories)',
    p1Short: 'متجر إكسسوارات وباندانات هاندميد، مع فلاتر سريعة وسلة لطلب الأوردر على الواتساب علطول.',
    p1Tag1: 'سلة طلب',
    p1Tag2: 'واتساب فوري',
    p1Tag3: 'Mobile-First',

    p2Title: 'حلواني فيستيفال فايف ستار (Festival Pastry)',
    p2Short: 'موقع لحلواني تورت وحلويات في الهرم، بيعرض الأصناف والأسعار وفروع المحل والطلب أونلاين.',
    p2Tag1: 'منيو وتورت تفاعلية',
    p2Tag2: 'فروع ومواعيد',
    p2Tag3: 'خفيف وسريع',

    p3Title: 'مطعم المحترف (Elmo7taref Restaurant)',
    p3Short: 'موقع لمطعم وجبات ومشويات، فيه فلاتر سريعة للأكل ومعاينة للساندوتشات وطلب واتساب مباشر.',
    p3Tag1: 'أصناف ومعاينة',
    p3Tag2: 'حساب فاتورة',
    p3Tag3: 'طلب مباشر',

    p4Title: 'كيان للملابس (Kayan Apparel)',
    p4Short: 'موقع لبراند ملابس، بيعرض الكولكشن بشكل شيك وسلس مع سلة مشتريات تفاعلية.',
    p4Tag1: 'كولكشن وسلايدر',
    p4Tag2: 'سلة مشتريات',
    p4Tag3: 'أنيق وعصري',

    p5Title: 'مساحة عمل الڤراندا (El Veranda)',
    p5Short: 'موقع لوورك سبيس ومكان مذاكرة في شبرا، فيه أسعار الساعات والغرف والحجز.',
    p5Tag1: 'محاسبة بالساعة',
    p5Tag2: 'تفاصيل الغرف',
    p5Tag3: 'تسليم سريع',

    // Testimonials / Social Proof (Placeholder/Configured)
    testimonialsBadge: 'آراء العملاء',
    testimonialsTitle: 'كلام من <span class="highlight">أصحاب المشاريع</span>',
    testimonialsDesc: 'تجارب حقيقية لعملاء اشتغلنا سوا وطلعنا بمواقع لايف ناجحة:',

    // About Section
    aboutBadge: 'مين عمر',
    aboutTitle: 'من غير لف ودوران.. موقعك معمول على كيفك وبدون صداع.',
    aboutDesc: 'هدفي إن الموقع يكون شكله حلو، سريع على الموبايل والكمبيوتر، ومريح للعميل اللي بيفتحه.',
    aboutP1: 'أنا عمر، بعمل مواقع من الصفر أو بعدل على موقعك القديم، وبصلح أي حاجة بايظة فيه عشان يرجع يشتغل تمام.',
    aboutP2: 'لو عندك فكرة موقع جديدة، أو عندك موقع حالي وفيه باجات أو شكله مش مظبوط على الموبايل وعايز تظبطه، أو محتاج تضيف صفحات وميزات زيادة — بعملهولك خطوة بخطوة وبطريقة تناسبك.',

    // About Pillars
    pillar1Title: 'سريع وخفيف في التصفح',
    pillar1Desc: 'الموقع بيفتح في ثواني وخفيف في التصفح على أي موبايل ومفيهوش تقل.',
    pillar2Title: 'تصليح الباجات والمشاكل',
    pillar2Desc: 'بلاقي سبب المشكلة في الكود أو التصميم وبحلها علطول بدل ما تضيع وقت.',
    pillar3Title: 'لمسات 3D وحركات خفيفة',
    pillar3Desc: 'حركات ناعمة ومجسم 3D Three.js يدي موقعك شكل مميز وعصري.',
    pillar4Title: 'تعديل وتفصيل على طلبك',
    pillar4Desc: 'بظبط الألوان والتصميم والأقسام على حسب طلبك ونوع شغلك.',

    // Skills Matrix (Strictly Web Development)
    skillsTitle: 'تقنيات وأدوات بشتغل بيها',
    skillJs: 'جافاسكريبت (JavaScript)',
    skillHtml: 'HTML5 القياسي',
    skillCss: 'CSS3 وتصميم متجاوب',
    skillGsap: 'أنيميشن وحركات GSAP',
    skillThree: 'أبعاد ثلاثية Three.js',
    skillResp: 'تصميم متجاوب للموبايل',
    skillBug: 'حل وتصليح المشاكل',
    skillCustom: 'تعديل وتخصيص المواقع',

    // Services Section
    servicesBadge: 'خدماتي',
    servicesTitle: 'إيه اللي أقدر أساعدك فيه؟',
    servicesDesc: 'شغل واضح ومحدد حسب اللي محتاجه بيزنسك بالظبط:',
    s1Title: 'تطوير موقع كامل (Landing Page / E-commerce)',
    s1Desc: 'من الفكرة والتصميم لحد كود شغال وسريع، متوافق مع الموبايل ومربوط بسلة شراء ودومين واستضافة جاهزة.',
    s2Title: 'حل الباجات والصيانة السريعة',
    s2Desc: 'لو موقعك فيه مشكلة، بطيء، أزرار مش شغالة، أو شكله متلخبط على التليفون، بصلحهولك فوري وبدون صداع.',
    s3Title: 'تعديل وتطوير الـ UI/UX',
    s3Desc: 'تظبيط وتحديث شكل موقعك الحالي وتحويله لتصميم عصري جذاب يريح الزبون ويزود ثقته في بيزنسك.',
    s4Title: 'ربط واتساب وميزات تفاعلية ذكية',
    s4Desc: 'ربط مباشر لطلبات الشراء على الواتساب، فورمات تواصل وحجز سريعة، ولمسات تفاعلية 3D تميزك عن غيرك.',

    // Pricing Hint (No Fixed Numbers)
    pricingHintTag: 'تكلفة تقديرية',
    pricingHintTitle: 'عايز تعرف متوسط التكلفة؟',
    pricingHintDesc: `صفحات الهبوط بتبدأ من <strong class="pricing-highlight">${PRICING_CONFIG.landingPageStartingFrom_ar}</strong>. المتاجر والمشاريع الأكبر بنحدد تكلفتها بدقة بعد ما نتكلم ونفهم تفاصيل طلبك.`,
    pricingLandingStart: PRICING_CONFIG.landingPageStartingFrom_ar,
    pricingHintCta: 'اطلب عرض سعر لمشروعك',

    // Process Section
    processBadge: 'طريقة الشغل',
    processTitle: 'بشتغل إزاي؟',
    processDesc: 'أربع خطوات بسيطة بدون تضييع وقت:',
    pr1Step: 'الخطوة 01',
    pr1Title: 'نتفق على المطلوب',
    pr1Desc: 'بنتكلم شات أو مكالمة سريعة، بعرف منك محتاج إيه بالظبط وبنحدد الوقت والتكلفة.',
    pr2Step: 'الخطوة 02',
    pr2Title: 'الشكل والتوزيع',
    pr2Desc: 'بنستقر على التصميم والألوان وتقسيمة الصفحات المناسبة لفكرتك.',
    pr3Step: 'الخطوة 03',
    pr3Title: 'الكود والتنفيذ',
    pr3Desc: 'ببني الموقع وبضيف الحركات، وبجرب كل حاجة عشان تتأكد إنها شغالة 100% على أي شاشة.',
    pr4Step: 'الخطوة 04',
    pr4Title: 'التسليم والمراجعة',
    pr4Desc: 'بنرفع الموقع لايف، بنجرب كل زرار وكل رابط، وبتستلم موقعك جاهز وشغال تمام.',

    // Contact Section
    contactBadge: 'تواصل معايا',
    contactTitle: 'عندك فكرة مشروع وعايز تحولها لويبسايت جامد؟',
    contactDesc: 'كلمني فوراً وخلينا نبدأ — شات واتساب فوري وسريع، أو سيب بياناتك في الفورم وهرد عليك علطول.',
    waFastBadge: 'أسرع طريقة للتواصل',
    waDirectBtn: 'شات مباشر على واتساب 🚀',
    waDirectSub: 'رد فوري لمناقشة فكرتك والبدء علطول',
    cMethodPhone: 'واتساب / اتصال',
    cMethodEmail: 'الإيميل',
    cMethodInsta: 'انستجرام',
    replayIntroBtn: 'إعادة تشغيل الإنترو 3D',
    formNameLabel: 'اسمك',
    formNamePlaceholder: 'مثلاً: كريم، أحمد، سارة',
    formContactLabel: 'طريقة التواصل',
    formContactPlaceholder: 'رقم الواتساب أو التليفون',
    formServiceLabel: 'محتاج إيه؟',
    formOptBuildProject: 'بناء موقع لمشروع',
    formOptScratch: 'تطوير موقع كامل من الصفر (Landing Page / E-commerce)',
    formOptReady: 'تعديل وتخصيص نموذج جاهز لبيزنسي',
    formOptBug: 'حل باجات وصيانة سريعة لموقع موجود',
    formOptCustom: 'تطوير الـ UI/UX وإضافة صفحات وميزات',
    formOpt3d: 'ربط واتساب وميزات تفاعلية 3D',
    formMsgLabel: 'تفاصيل طلبك',
    formMsgPlaceholder: 'اكتب باختصار محتاج موقع جديد، ولا عندك مشكلة معينة عايز تصلحها...',
    formSubmitBtn: 'ابعت الرسالة',
    formPrivacyNote: 'بياناتك بتتبعت على واتساب بس ومش بنحفظها',
    privacyPolicyLink: 'سياسة الخصوصية',

    // Privacy Modal
    privacyModalTitle: 'سياسة الخصوصية وحماية البيانات',
    privacyModalP1: 'في 7P Studio، خصوصيتك خط أحمر وبسيطة جداً وبدون أي تعقيد:',
    privacyModalItem1: '<strong>لا يوجد سيرفر تخزين أو قاعدة بيانات:</strong> الموقع لا يحفظ أو يسجل أي بيانات تدخلها في نموذج التواصل.',
    privacyModalItem2: '<strong>تواصل مباشر عبر واتساب:</strong> عند إرسال النموذج، يتم تحويل بياناتك إلى رسالة مشفرة ومجهزة على تطبيق واتساب الخاص بك مباشرة دون المرور بأي طرف ثالث.',
    privacyModalItem3: '<strong>خالٍ من أدوات التتبع:</strong> لا نستخدم أي ملفات كوكيز (Cookies) تتبعية أو إعلانية تتبع نشاطك.',
    privacyModalCloseBtn: 'فهمت، إغلاق',

    // Footer
    footerCopy: '© 2026 7P Studio (عمر) — جميع الحقوق محفوظة. مواقع عصرية معمولة على كيفك.',
    backToTopBtn: 'للأعلى'
  },

  en: {
    // Page Meta
    pageTitle: '7P STUDIO — Omar | Modern Interactive Web Development',
    pageMetaDesc: '7P STUDIO / Omar - Modern, interactive web developer creating fast, high-converting websites and fixing bugs on existing sites.',

    // Intro Stage
    soundOn: 'Sound On',
    soundOff: 'Sound Off',
    skipIntro: 'Skip',

    // Navigation & Header
    navBrand: 'STUDIO',
    navHome: 'Home',
    navAbout: 'About',
    navWork: 'Work',
    navServices: 'Services',
    navProcess: 'How I Work',
    navContact: 'Contact',
    navCta: "Let's Talk",
    mobileCta: 'Start Your Project',
    availableBadge: 'Available for work',
    waTooltipTitle: 'Available to chat',
    waTooltipSub: 'Direct WhatsApp chat',
    copyLinkSuccess: 'Project link copied!',

    // Hero Section
    heroBadge1: '⚡ Ready to take your business digital faster & headache-free',
    heroBadge2: 'Websites made your way & smooth 3D motion',
    heroTitle: 'Websites made your way, <span class="highlight">looking sharp,</span> and lightning fast.',
    heroSubtitle: "Hey, I'm <strong>Omar</strong>. I build websites for clients, fix annoying bugs on existing sites, and tweak layouts to fit exactly what you need.",
    heroCtaWork: 'Check My Work',
    heroCtaContact: 'Start Your Project 🚀',
    heroStat1: 'Fast on-time delivery guaranteed',
    heroStat2: '100% responsive on mobile & desktop',
    heroStat3: 'Post-delivery support & tweaks',
    hero3dHint: 'Drag or hover to rotate 3D',

    // Partners & Projects Showcase
    partnersBadge: 'Selected Projects',
    partnersTitle: 'Work & <span class="highlight">Projects I Built</span>',
    partnersSubtitle: 'Click any site to visit it live, or hover to preview project details',
    badgeClientWork: 'Delivered Client Project',
    badgeReadyDesign: 'Ready to Customize',
    visitLiveBtn: 'Open Live Site',

    p1Title: 'Aya Accessories (Handmade Boutique)',
    p1Short: 'Handmade accessories boutique with instant product filters and direct WhatsApp ordering.',
    p1Tag1: 'Direct Cart',
    p1Tag2: 'WhatsApp Orders',
    p1Tag3: 'Mobile-First',

    p2Title: 'Festival Pastry Five Star',
    p2Short: 'Commercial website for a pastry and torte brand in Haram, showcasing items, prices, and branches.',
    p2Tag1: 'Interactive Menu',
    p2Tag2: 'Branches & Hours',
    p2Tag3: 'Fast & Lightweight',

    p3Title: 'Elmo7taref Restaurant & Grill',
    p3Short: 'Fast-casual restaurant site with meal filters, burger preview modal, and instant WhatsApp orders.',
    p3Tag1: 'Meal Preview',
    p3Tag2: 'Bill Summary',
    p3Tag3: 'Direct Checkout',

    p4Title: 'Kayan Apparel Store',
    p4Short: 'Modern apparel brand storefront showcasing collections smoothly with an interactive cart.',
    p4Tag1: 'Sleek Catalog',
    p4Tag2: 'Slide-out Cart',
    p4Tag3: 'Smooth Motion',

    p5Title: 'El Veranda Workspace',
    p5Short: 'Coworking and study hub web presence in Shubra with room rates and booking inquiries.',
    p5Tag1: 'Hourly Rates',
    p5Tag2: 'Room Amenities',
    p5Tag3: 'Fast Delivery',

    // Testimonials / Social Proof
    testimonialsBadge: 'What Clients Say',
    testimonialsTitle: 'Words from <span class="highlight">Business Owners</span>',
    testimonialsDesc: 'Real experiences from clients we teamed up with to launch live, successful websites:',

    // About Section
    aboutBadge: 'About Me',
    aboutTitle: 'No fluff, no headache. Built exactly how you want.',
    aboutDesc: 'My goal is to give you a site that looks clean, runs fast on phones and laptops, and feels great to use.',
    aboutP1: "I'm Omar. I build websites from scratch, tweak existing sites, and fix broken stuff so your site runs smooth.",
    aboutP2: "Whether you're starting from scratch, have an existing site with annoying bugs or broken mobile styling, or need to add new pages and features — I get it done smoothly without hassle.",

    // About Pillars
    pillar1Title: 'Fast & Lightweight',
    pillar1Desc: 'Loads in seconds, browses smoothly on any phone, and keeps things lightweight.',
    pillar2Title: 'Fast Bug Fixing',
    pillar2Desc: 'I track down the root cause in code or CSS and fix it without delay.',
    pillar3Title: 'Smooth Motion & 3D',
    pillar3Desc: 'Subtle animations and 3D touches to make your site stand out.',
    pillar4Title: 'Full Customization',
    pillar4Desc: 'Tuning colors, layout, and sections to match exactly what you want.',

    // Skills Matrix (Strictly Web Development)
    skillsTitle: 'Tools & Technologies',
    skillJs: 'JavaScript (ES6+)',
    skillHtml: 'Semantic HTML5',
    skillCss: 'CSS3 & Responsive Layouts',
    skillGsap: 'GSAP Animations & Motion',
    skillThree: 'Three.js 3D Interactive',
    skillResp: 'Mobile-First Responsive',
    skillBug: 'Bug Fixing & Debugging',
    skillCustom: 'Custom Site Tweaks',

    // Services Section
    servicesBadge: 'Services',
    servicesTitle: 'How I Can Help You',
    servicesDesc: 'Clear, straightforward work tailored to what you actually need:',
    s1Title: 'Full Website & E-commerce Development',
    s1Desc: 'From idea to delivery: complete, fast, mobile-first websites with custom domain, hosting, and order carts.',
    s2Title: 'Instant Bug Fixing & Maintenance',
    s2Desc: 'Got broken buttons, slow load times, or layout glitches on mobile? I troubleshoot and fix them immediately.',
    s3Title: 'UI/UX Redesign & Modernization',
    s3Desc: 'Revamp your existing website with a fresh, modern aesthetic, sharper colors, and better user experience.',
    s4Title: 'WhatsApp Integration & Smart Features',
    s4Desc: 'Direct WhatsApp checkout, interactive booking forms, and sleek 3D motion that sets your business apart.',

    // Pricing Hint (No Fixed Numbers)
    pricingHintTag: 'Estimated Investment',
    pricingHintTitle: 'Wondering about project pricing?',
    pricingHintDesc: `Landing pages start from <strong class="pricing-highlight">${PRICING_CONFIG.landingPageStartingFrom_en}</strong>. Stores and bigger projects are priced after we talk through your exact needs.`,
    pricingLandingStart: PRICING_CONFIG.landingPageStartingFrom_en,
    pricingHintCta: 'Get a custom quote',

    // Process Section
    processBadge: 'How It Works',
    processTitle: 'How We Work Together',
    processDesc: 'Four straightforward steps without wasted time:',
    pr1Step: 'STEP 01',
    pr1Title: 'Clarify What You Need',
    pr1Desc: 'A quick chat or call to understand your goal, agree on timeline, and set the price.',
    pr2Step: 'STEP 02',
    pr2Title: 'Layout & Design',
    pr2Desc: 'We settle on the colors, layout, and sections that fit your idea.',
    pr3Step: 'STEP 03',
    pr3Title: 'Coding & Building',
    pr3Desc: 'I build the site, add motion, and test everything thoroughly so it works 100% on any screen.',
    pr4Step: 'STEP 04',
    pr4Title: 'Review & Delivery',
    pr4Desc: 'We launch live, verify every button and link, and hand over your ready-to-use site.',

    // Contact Section
    contactBadge: 'Get in Touch',
    contactTitle: 'Got a project idea and want a standout website?',
    contactDesc: 'Reach out right now and let’s get started — direct WhatsApp chat, or drop a message below.',
    waFastBadge: 'Fastest way to talk',
    waDirectBtn: 'Chat Directly on WhatsApp 🚀',
    waDirectSub: 'Instant response to discuss your project',
    cMethodPhone: 'WhatsApp / Phone',
    cMethodEmail: 'Email',
    cMethodInsta: 'Instagram',
    replayIntroBtn: 'Replay 3D Intro',
    formNameLabel: 'Your Name',
    formNamePlaceholder: 'e.g. Karim or Sarah',
    formContactLabel: 'Contact Info',
    formContactPlaceholder: 'WhatsApp or phone number',
    formServiceLabel: 'What do you need?',
    formOptBuildProject: 'Build a website for a project',
    formOptScratch: 'Build a full site from scratch (Landing Page / E-commerce)',
    formOptReady: 'Customize one of the showcase designs',
    formOptBug: 'Fix bugs and fast maintenance on existing site',
    formOptCustom: 'UI/UX revamp and add new pages/features',
    formOpt3d: 'WhatsApp integration & interactive 3D touches',
    formMsgLabel: 'Details',
    formMsgPlaceholder: 'Briefly describe what you want to build or what needs fixing...',
    formSubmitBtn: 'Send Message',
    formPrivacyNote: 'Your details go to WhatsApp only and are not stored.',
    privacyPolicyLink: 'Privacy Policy',

    // Privacy Modal
    privacyModalTitle: 'Privacy Policy & Data Transparency',
    privacyModalP1: 'At 7P Studio, your privacy is straightforward and strictly respected:',
    privacyModalItem1: '<strong>Zero Backend Storage:</strong> This website does not log, save, or store any personal information submitted through forms.',
    privacyModalItem2: '<strong>Direct WhatsApp Transmission:</strong> Submitting the contact form creates an instant pre-filled message directly on your own WhatsApp client.',
    privacyModalItem3: '<strong>No Ad Tracking:</strong> We do not use tracking or advertising cookies of any kind.',
    privacyModalCloseBtn: 'Got it, Close',

    // Footer
    footerCopy: '© 2026 7P Studio (Omar). All rights reserved. Websites crafted your way.',
    backToTopBtn: 'Back to Top'
  }
};

// ==========================================================================
// 3. STORAGE & LANGUAGE RETRIEVAL (Safe localStorage with try/catch)
// ==========================================================================
export function getSavedLanguage() {
  try {
    const val = localStorage.getItem('omar_lang');
    return (val === 'ar' || val === 'en') ? val : 'ar';
  } catch (e) {
    return 'ar';
  }
}

export function saveLanguage(lang) {
  try {
    localStorage.setItem('omar_lang', lang);
  } catch (e) {}
}

let currentLang = getSavedLanguage();

export function getLanguage() {
  return currentLang;
}

export function setLanguage(lang) {
  if (lang !== 'ar' && lang !== 'en') return;
  currentLang = lang;
  saveLanguage(lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  applyTranslations(lang);
  updateToggleButtons(lang);
  renderTestimonials(lang);

  // Dispatch custom event for any listeners (sound, scenes, etc.)
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
}

// ==========================================================================
// 4. TRANSLATIONS DOM APPLICATION
// ==========================================================================
export function applyTranslations(lang) {
  const dict = translations[lang];
  if (!dict) return;

  // 1. Text elements
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      if (dict[key].includes('<')) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // 2. Placeholders
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // 3. Document Title & Meta Description
  if (dict.pageTitle) {
    document.title = dict.pageTitle;
  }
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && dict.pageMetaDesc) {
    metaDesc.setAttribute('content', dict.pageMetaDesc);
  }
}

function updateToggleButtons(lang) {
  const buttons = document.querySelectorAll('.lang-btn');
  buttons.forEach((btn) => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    }
  });
}

// ==========================================================================
// 5. INITIALIZATION
// ==========================================================================
export function initLanguage() {
  const initial = getSavedLanguage();
  setLanguage(initial);

  // Bind clicks on all toggle buttons (desktop + mobile drawer)
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang) {
        setLanguage(targetLang);
      }
    });
  });
}
