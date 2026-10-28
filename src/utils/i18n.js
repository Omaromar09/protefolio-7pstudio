/**
 * ==========================================================================
 * BILINGUAL i18n SYSTEM — ARABIC (DEFAULT) & ENGLISH
 * 7P Studio (Omar & Mostafa Gad) — High Performance, Clean Web Development
 * Egyptian Arabic, confident, direct, light humor, no inflated titles.
 * ==========================================================================
 */

import { renderTestimonials } from './testimonials.js';

// ==========================================================================
// 1. EASILY EDITABLE CONSTANTS (تعديل الأسعار والملاحظات بسهولة هنا)
// ==========================================================================
export const PRICING_CONFIG = {
  landingPageStartingFrom_ar: '[EDIT: 3,500 ج.م]',
  landingPageStartingFrom_en: '[EDIT: 3,500 EGP]'
};

// ==========================================================================
// 2. COMPLETE TRANSLATIONS DICTIONARY
// ==========================================================================
export const translations = {
  ar: {
    // Page Meta
    pageTitle: '7P STUDIO — عمر & مصطفى جاد | استوديو مواقع عصرية وتفاعلية وسريعة',
    pageMetaDesc: '7P STUDIO / عمر & مصطفى جاد - استوديو تطوير مواقع نبني مواقع نظيفة، عصرية، تفاعلية وسريعة ونحول زوارك لعملاء فعليين. أبعاد ثلاثية 3D وربط واتساب ودعم فني متكامل.',

    // Intro Stage
    soundOn: 'تشغيل الصوت',
    soundOff: 'كتم الصوت',
    skipIntro: 'تخطي',

    // Navigation & Header
    navBrand: '7P STUDIO',
    navHome: 'الرئيسية',
    navAbout: 'عنّا',
    navWork: 'أعمالنا',
    navComparison: 'الفرق مع 7P',
    navDiagnosis: 'شخّص موقعك',
    navServices: 'خدماتنا',
    navEstimator: 'احسب مشروعك',
    navTrust: 'ليه 7P',
    navProcess: 'طريقة شغلنا',
    navContact: 'تواصل معانا',
    navCta: 'تكلم معانا',
    mobileCta: 'ابدأ موقعك معانا',
    availableBadge: 'متاحين لمشاريع جديدة',
    waTooltipTitle: 'متاحين للشات دلوقتي',
    waTooltipSub: 'كلمنا واتساب مباشر',
    copyLinkSuccess: 'تم نسخ رابط المشروع بنجاح!',

    // Hero Section
    heroBadge1: '⚡ استوديو متخصص في بناء مواقع البيزنس الحديثة',
    heroBadge2: 'أبعاد ثلاثية 3D وتجاوب صاروخي على الموبايل',
    heroTitle: '7P Studio — مواقع عصرية، <span class="highlight">شكلها رايق،</span> وسريعة بتجيب زباين.',
    heroSubtitle: 'أهلاً بيك! إحنا <strong>عمر</strong> و<strong>مصطفى جاد</strong> في 7P Studio. بنبني مواقع استثنائية وسريعة تُحوّل زوارك لعملاء فعليين، بنحل المشاكل البرمجية، وبنظبط موقعك بأعلى كفاءة وبدون صداع.',
    heroCtaWork: 'شوف شغلنا',
    heroCtaEstimator: 'اعرف سعر مشروعك في 30 ثانية',
    heroCtaContact: 'ابدأ مشروعك معانا 🚀',
    hero3dHint: 'حرك الماوس لتلف المجسم 3D',

    // Real Proof Row (Computed from data, no fake numbers)
    heroProofProjectsVal: '7 مشاريع',
    heroProofProjectsLabel: 'شغالة لايف دلوقتي',
    heroProofIndustriesVal: '6 مجالات',
    heroProofIndustriesLabel: 'متاجر، مطاعم، مساحات، جيمينج، 3D',
    heroProofDeliveryVal: '7 - 14 يوم',
    heroProofDeliveryLabel: 'تسليم قياسي متفق عليه',
    heroProofSupportVal: 'طوال الأسبوع',
    heroProofSupportLabel: 'رد ومتابعة على واتساب',

    // Showcase Section
    showcaseBadge: 'معرض الأعمال التفاعلي',
    showcaseTitle: 'أعمالنا <span class="highlight">ومشاريع نفذناها</span>',
    showcaseSubtitle: 'تصفح مشاريعنا الحية، جرب تفاصيلها، أو اطلب موقع بنفس الجودة لبيزنسك',

    // Before / After Comparison
    comparisonBadge: 'ليه تختار 7P؟',
    comparisonTitle: 'شوف الفرق بنفسك: <span class="highlight">موقع عادي vs موقع من 7P</span>',
    comparisonSubtitle: 'اسحب الخط الفاصل وشوف الفرق بين موقع بطيء بيضيع زباين، وموقع من 7P فائق السرعة وجذاب',
    compBeforeBadge: 'موقع عادي تقليدي',
    compBeforeTitle: 'بطيء، تصميمه قديم، وبيخسر عملاء',
    compBeforeDesc: 'قوالب جاهزة مكررة بتزهق الزبون من بطء التحميل وتضيّع أكتر من 60% من المبيعات قبل ما يتواصل معاك.',
    compBeforeSpeed: 'نتيجة سرعة ضعيفة 34/100',
    compBeforeLoad: 'تحميل 4.8 ثانية (الزبون بيمشي)',
    compBeforeMobile: 'مش متجاوب والخطوط متداخلة',
    compBeforeSales: 'مفيش سلة واتساب ولا حجز سريع',

    compAfterBadge: 'موقع من 7P Studio',
    compAfterTitle: 'سريع، تفاعلي 3D، ومربوط بسلة واتساب',
    compAfterDesc: 'كود مخصص وخفيف بأحدث المعايير، بيفتح في لمح البصر مع سلة واتساب مباشرة بتضاعف طلباتك.',
    compAfterSpeed: 'نتيجة سرعة قياسية 98/100',
    compAfterLoad: 'تحميل فوري تحت 1.2 ثانية',
    compAfterMobile: 'متجاوب 100% ومصمم للموبايل أولاً',
    compAfterSales: 'سلة وفاتورة واتساب فورية لزيادة المبيعات',

    // Quick Diagnosis
    diagnosisBadge: 'شخّص موقعك في دقيقة',
    diagnosisTitle: 'مش متأكد موقعك محتاج إيه؟ <span class="highlight">شخّصه في دقيقة</span>',
    diagnosisSubtitle: 'جاوب 5 أسئلة سريعة وهنقولك بالظبط إيه اللي محتاجه بيزنسك لزيادة مبيعاته:',

    // Testimonials / Social Proof
    testimonialsBadge: 'آراء العملاء',
    testimonialsTitle: 'كلام من <span class="highlight">أصحاب المشاريع</span>',
    testimonialsDesc: 'تجارب حقيقية لعملاء اشتغلنا سوا وطلعنا بمواقع لايف ناجحة:',

    // Trust Section
    trustBadge: 'ثقة وأمان',
    trustTitle: 'ليه تثق في <span class="highlight">7P Studio</span> لشغلك؟',
    trustSubtitle: 'شغل شفاف، التزام كامل بالمواعيد، وضمان جودة حقيقي بعد التسليم:',
    trustLiveHeader: '7 نماذج ومشاريع لايف (مشاريع حقيقية + نماذج تجريبية):',
    trustPromise1Title: 'رد سريع وتواصل مباشر',
    trustPromise1Desc: 'تواصل مباشر مع عمر ومصطفى، بنسمع تفاصيل بيزنسك وبنرد علطول بدون تأخير.',
    trustPromise2Title: 'تسليم في الميعاد المحدد',
    trustPromise2Desc: 'بنتفق على جدول زمني واضح وبنلتزم بيه باليوم والساعة بدون مماطلة.',
    trustPromise3Title: 'دعم فني وضمان بعد الإطلاق',
    trustPromise3Desc: 'مش بنسيبك بعد التسليم؛ بنفضل معاك في أي تعديل وصيانة وتدريب على إدارة موقعك.',

    // About Section
    aboutBadge: 'عن الفريق',
    aboutTitle: 'من غير لف ودوران.. موقعك معمول على كيفك مع عمر ومصطفى جاد.',
    aboutDesc: 'هدفنا إن موقعك يكون شكله رايق، سريع جداً على الموبايل والكمبيوتر، ومريح للعميل اللي بيفتحه.',
    aboutP1: 'إحنا عمر ومصطفى جاد، شركاء ومطورو ويب في 7P Studio. بنبني مواقع من الصفر أو بنعدل على موقعك القديم، وبنصلح أي مشكلة برمجية عشان يرجع يشتغل تمام بأعلى أداء.',
    aboutP2: 'لو عندك فكرة موقع جديدة، أو عندك موقع حالي وفيه باجات ومحتاج صيانة، تسريع، أو إضافة ميزات وصفحات إضافية — بنعملهولك خطوة بخطوة وبتنسيق كامل يناسب بيزنسك.',

    // About Pillars
    pillar1Title: 'سريع وخفيف في التصفح',
    pillar1Desc: 'الموقع بيفتح في ثواني وخفيف في التصفح على أي موبايل ومفيهوش تقل.',
    pillar2Title: 'تصليح الباجات والمشاكل',
    pillar2Desc: 'بنلاقي سبب المشكلة في الكود أو التصميم وبنحلها علطول بدل ما تضيع وقت.',
    pillar3Title: 'لمسات 3D وحركات خفيفة',
    pillar3Desc: 'حركات ناعمة ومجسم 3D Three.js يدي موقعك شكل مميز وعصري.',
    pillar4Title: 'تعديل وتفصيل على طلبك',
    pillar4Desc: 'بنظبط الألوان والتصميم والأقسام على حسب طلبك ونوع شغلك.',

    // Skills Matrix
    skillsTitle: 'تقنيات بنعتمد عليها في الشغل',
    skillJs: 'جافاسكريبت (JavaScript)',
    skillHtml: 'HTML5 القياسي',
    skillCss: 'CSS3 وتصميم متجاوب',
    skillGsap: 'أنيميشن وحركات GSAP',
    skillThree: 'أبعاد ثلاثية Three.js',
    skillResp: 'تصميم متجاوب للموبايل',
    skillBug: 'حل وتصليح المشاكل',
    skillCustom: 'تعديل وتخصيص المواقع',

    // Services Section
    servicesBadge: 'خدماتنا',
    servicesTitle: 'إيه اللي نقدر نساعدك فيه؟',
    servicesDesc: 'اضغط على أي خدمة لترى التفاصيل الكاملة وما يتضمنه التنفيذ:',
    s1Title: 'تطوير موقع كامل (Landing Page / E-commerce)',
    s1Desc: 'من الفكرة والتصميم لحد كود شغال وسريع، متوافق مع الموبايل ومربوط بسلة شراء ودومين واستضافة جاهزة.',
    s1DeliverablesTitle: 'ما يتضمنه العمل:',
    s1Deliverables: 'تصميم واجهة متجاوبة، سلة شراء وفاتورة، لوحة تحكم سهلة، ربط دومين واستضافة.',
    s1AudienceTitle: 'مناسب لمين:',
    s1Audience: 'المتاجر والمطاعم، البراندات، والأنشطة التجارية الراغبة في مبيعات رقمية.',

    s2Title: 'حل الباجات والصيانة السريعة',
    s2Desc: 'لو موقعك فيه مشكلة، بطيء، أزرار مش شغالة، أو شكله متلخبط على التليفون، بنصلحهولك فوري وبدون صداع.',
    s2DeliverablesTitle: 'ما يتضمنه العمل:',
    s2Deliverables: 'فحص الأخطاء البرمجية، تسريع الصور والأكواد، وضبط العرض على كل شاشات الموبايل.',
    s2AudienceTitle: 'مناسب لمين:',
    s2Audience: 'أصحاب المواقع التي تعاني من بطء في التحميل أو أخطاء تمنع إتمام الطلبات.',

    s3Title: 'تعديل وتطوير الـ UI/UX',
    s3Desc: 'تظبيط وتحديث شكل موقعك الحالي وتحويله لتصميم عصري جذاب يريح الزبون ويزود ثقته في بيزنسك.',
    s3DeliverablesTitle: 'ما يتضمنه العمل:',
    s3Deliverables: 'إعادة هيكلة الصفحات، ألوان متناسقة، أيقونات وفونتات مميزة، وتحسين رحلة المستخدم.',
    s3AudienceTitle: 'مناسب لمين:',
    s3Audience: 'المواقع القديمة التي تحتاج مظهر عصري ينافس في السوق الحالي.',

    s4Title: 'ربط واتساب وميزات تفاعلية ذكية',
    s4Desc: 'ربط مباشر لطلبات الشراء على الواتساب، فورمات تواصل وحجز سريعة، ولمسات تفاعلية 3D تميزك عن غيرك.',
    s4DeliverablesTitle: 'ما يتضمنه العمل:',
    s4Deliverables: 'ربط سلة الواتساب التلقائية، مجسمات 3D تفاعلية بـ Three.js، وأنيميشن ناعم بـ GSAP.',
    s4AudienceTitle: 'مناسب لمين:',
    s4Audience: 'البراندات التي تريد إبهار عملائها وتسهيل التواصل الفوري المباشر.',

    // 7P Project Estimator
    estimatorBadge: 'حاسبة وكوتيشن 7P الذكية',
    estimatorTitle: 'احسب تفاصيل مشروعك واستلم <span class="highlight">كوتيشن واتساب فوري</span>',
    estimatorDesc: 'اختر نوع فكرتك والميزات اللي محتاجها، وشوف جدول التسليم والتقنيات المقترحة، وابدأ تواصل فوري بضغطة زر واحدة.',
    estStep1Title: 'نوع المشروع الأساسي',
    estStep1Desc: 'اختر نوع واحد',
    estType1Name: 'صفحة هبوط تسويقية',
    estType1Desc: 'لإطلاق منتج أو خدمة سريعة وزيادة المبيعات',
    estType2Name: 'متجر وسلة مبيعات',
    estType2Desc: 'عرض منتجات وسلة شراء وفاتورة فورية',
    estType3Name: 'موقع بيزنس / شركة',
    estType3Desc: 'تعريف احترافي بالخدمات وبناء الثقة',
    estType4Name: 'منيو مطعم / كافيه',
    estType4Desc: 'منيو QR سريع وسهل مع طلب مباشر واتساب',
    estType5Name: 'إصلاح موقع حالي',
    estType5Desc: 'حل باجات، رفع سرعة، وضبط شكل الموبايل',
    estStep2Title: 'الميزات الإضافية المقترحة',
    estStep2Desc: 'حدد كل اللي يهمك',
    estFeat1: 'شات ومزامنة واتساب فورية',
    estFeat2: 'تجاوب فائق الدقة على الموبايل',
    estFeat3: 'سرعة تحميل وأداء 95+ جوجل',
    estFeat4: 'تأثيرات ولمسات 3D سينمائية',
    estFeat5: 'حجز دومين واستضافة سحابية',
    estFeat6: 'تهيئة لمحركات البحث وتصدر جوجل',
    estStep3Title: 'سرعة وميعاد التسليم',
    estStep3Desc: 'اختر الأولوية',
    estSpeedStdTitle: 'تنفيذ قياسي دقيق',
    estSpeedStdDays: 'الميعاد الطبيعي بدون استعجال',
    estSpeedExpTitle: 'تنفيذ إكسبريس عاجل',
    estSpeedExpDays: 'تسليم عاجل خلال 48-72 ساعة',
    hudLabelScope: 'نوع المشروع',
    hudLabelDelivery: 'وقت التسليم المقدر',
    hudLabelPriceRange: 'التكلفة التقديرية',
    hudLabelFeatures: 'الميزات المختارة',
    hudLabelStack: 'حزمة الكود',
    hudGuaranteeText: 'ضمان جودة 7P Studio: تسليم بدون باجات، كود نظيف وسريع، وتعديلات ومتابعة مستمرة بعد التسليم.',
    hudCtaBtn: 'إرسال الكوتيشن لواتساب وبدء التنفيذ',
    hudSaveQuoteBtn: 'نسخ وحفظ تفاصيل الكوتيشن',
    hudSubhint: 'تجهيز فوري للرسالة والتواصل المباشر مع عمر ومصطفى',

    // Process Section
    processBadge: 'طريقة شغلنا',
    processTitle: 'بنشتغل إزاي؟',
    processDesc: 'أربع خطوات بسيطة بدون تضييع وقت وبدون تعقيد:',
    pr1Step: 'الخطوة 01',
    pr1Title: 'نتفق على المطلوب',
    pr1Desc: 'بنتكلم شات أو مكالمة سريعة، بنعرف منك محتاج إيه بالظبط وبنحدد الوقت والتكلفة بدقة.',
    pr2Step: 'الخطوة 02',
    pr2Title: 'التصميم والتوزيع',
    pr2Desc: 'بنستقر على التصميم والألوان وتقسيمة الصفحات المناسبة لفكرتك ولجمهورك المستهدف.',
    pr3Step: 'الخطوة 03',
    pr3Title: 'الكود والأداء',
    pr3Desc: 'بنبني الموقع بأحدث تقنيات الويب، وبنختبر السرعة والتجاوب على كل الموبايلات والشاشات.',
    pr4Step: 'الخطوة 04',
    pr4Title: 'التسليم والدعم',
    pr4Desc: 'بنرفع الموقع لايف ونربطه بالدومين، وبنفضل معاك بالدعم والتعديلات لضمان نجاحه.',

    // Contact Section
    contactBadge: 'تواصل معانا',
    contactTitle: 'عندك فكرة مشروع وعايز تحولها لويبسايت جامد؟',
    contactDesc: 'كلمنا فوراً وخلينا نبدأ — شات واتساب فوري وسريع، أو سيب بياناتك في الفورم وهنرد عليك علطول.',
    waFastBadge: 'أسرع طريقة للتواصل',
    waDirectBtn: 'شات مباشر على واتساب 🚀',
    waDirectSub: 'رد فوري لمناقشة فكرتك والبدء علطول',
    cMethodPhone: 'واتساب / اتصال',
    cMethodInsta: 'انستجرام',
    cMethodTiktok: 'تيك توك',
    replayIntroBtn: 'إعادة تشغيل الإنترو 3D',
    formNameLabel: 'اسمك الكريم',
    formNamePlaceholder: 'مثلاً: كريم، أحمد، سارة',
    formContactLabel: 'رقم الواتساب أو الهاتف',
    formContactPlaceholder: '01XXXXXXXXX',
    formMsgLabel: 'تفاصيل مشروعك أو مشكلتك',
    formMsgPlaceholder: 'اكتب باختصار محتاج موقع جديد، متجر، أو عندك مشكلة معينة عايز تصلحها...',
    formSubmitBtn: 'ابعت التفاصيل على واتساب',
    formPrivacyNote: 'بياناتك بتتبعت على واتساب بس ومش بنحفظها',
    privacyPolicyLink: 'سياسة الخصوصية',

    // Sticky Mobile CTA
    stickyCtaTitle: 'عندك فكرة مشروع؟',
    stickyCtaSub: 'عمر ومصطفى متاحين الآن',
    stickyCtaBtn: 'كلمنا واتساب',

    // Privacy Modal
    privacyModalTitle: 'سياسة الخصوصية وحماية البيانات',
    privacyModalP1: 'في 7P Studio، خصوصيتك خط أحمر وبسيطة جداً وبدون أي تعقيد:',
    privacyModalItem1: '<strong>لا يوجد سيرفر تخزين أو قاعدة بيانات:</strong> الموقع لا يحفظ أو يسجل أي بيانات تدخلها في نموذج التواصل.',
    privacyModalItem2: '<strong>تواصل مباشر عبر واتساب:</strong> عند إرسال النموذج، يتم تحويل بياناتك إلى رسالة مشفرة ومجهزة على تطبيق واتساب الخاص بك مباشرة دون المرور بأي طرف ثالث.',
    privacyModalItem3: '<strong>خالٍ من أدوات التتبع:</strong> لا نستخدم أي ملفات كوكيز (Cookies) تتبعية أو إعلانية تتبع نشاطك.',
    privacyModalCloseBtn: 'فهمت، إغلاق',

    // Footer
    footerCopy: '© 2026 7P Studio (عمر & مصطفى جاد) — جميع الحقوق محفوظة. مواقع عصرية معمولة على كيفك.',
    backToTopBtn: 'للأعلى'
  },

  en: {
    // Page Meta
    pageTitle: '7P STUDIO — Omar & Mostafa Gad | Modern Interactive Web Development Studio',
    pageMetaDesc: '7P STUDIO / Omar & Mostafa Gad - Modern web development studio creating fast, high-converting interactive websites and fixing technical bugs.',

    // Intro Stage
    soundOn: 'Sound On',
    soundOff: 'Sound Off',
    skipIntro: 'Skip',

    // Navigation & Header
    navBrand: '7P STUDIO',
    navHome: 'Home',
    navAbout: 'About Us',
    navWork: 'Our Work',
    navComparison: 'Why 7P',
    navDiagnosis: 'Diagnosis',
    navServices: 'Services',
    navEstimator: 'Estimator',
    navTrust: 'Trust',
    navProcess: 'Process',
    navContact: 'Contact',
    navCta: 'Talk With Us',
    mobileCta: 'Start Your Project With Us',
    availableBadge: 'Available for work',
    waTooltipTitle: 'Available to chat',
    waTooltipSub: 'Direct WhatsApp chat',
    copyLinkSuccess: 'Project link copied!',

    // Hero Section
    heroBadge1: '⚡ Studio specializing in high-performance business web development',
    heroBadge2: 'Interactive 3D WebGL & lightning fast mobile responsiveness',
    heroTitle: '7P Studio — Modern websites, <span class="highlight">looking sharp,</span> converting visitors.',
    heroSubtitle: "Hey there! We are <strong>Omar</strong> and <strong>Mostafa Gad</strong> (7P Studio). We craft high-performance websites that convert visitors into paying clients, resolve complex bugs, and engineer your digital presence headache-free.",
    heroCtaWork: 'See Our Work',
    heroCtaEstimator: 'Calculate Your Quote in 30s',
    heroCtaContact: 'Start Your Project With Us 🚀',
    hero3dHint: 'Drag or hover to rotate 3D',

    // Real Proof Row
    heroProofProjectsVal: '7 Projects',
    heroProofProjectsLabel: 'Live & Operational',
    heroProofIndustriesVal: '6 Domains',
    heroProofIndustriesLabel: 'Stores, Food, Gaming, 3D',
    heroProofDeliveryVal: '7 - 14 Days',
    heroProofDeliveryLabel: 'Standard Turnaround',
    heroProofSupportVal: '7 Days a Week',
    heroProofSupportLabel: 'Active WhatsApp Support',

    // Showcase Section
    showcaseBadge: 'Interactive Showcase',
    showcaseTitle: 'Our Work & <span class="highlight">Featured Projects</span>',
    showcaseSubtitle: 'Browse our live projects, inspect features, or commission a site with the same standard',

    // Before / After Comparison
    comparisonBadge: 'Why Choose 7P?',
    comparisonTitle: 'See the difference: <span class="highlight">Generic Website vs 7P Studio</span>',
    comparisonSubtitle: 'Drag the split handle to compare a slow, customer-leaking template against a fast, conversion-focused build',
    compBeforeBadge: 'Generic Slow Template',
    compBeforeTitle: 'Clunky, outdated design, losing customers',
    compBeforeDesc: 'Bloated, generic templates drive visitors away with slow load times, losing over 60% of potential leads.',
    compBeforeSpeed: 'Poor PageSpeed score 34/100',
    compBeforeLoad: '4.8s loading time (clients bounce)',
    compBeforeMobile: 'Broken layout on mobile viewports',
    compBeforeSales: 'No direct WhatsApp cart or quick checkout',

    compAfterBadge: 'Crafted by 7P Studio',
    compAfterTitle: 'Ultra-fast, interactive 3D, instant WhatsApp cart',
    compAfterDesc: 'Custom-coded high-performance architecture that loads instantly with seamless WhatsApp checkout.',
    compAfterSpeed: 'Flawless 98/100 PageSpeed score',
    compAfterLoad: 'Sub-1.2s instant page load',
    compAfterMobile: '100% mobile-first precision responsiveness',
    compAfterSales: 'Direct WhatsApp order checkout boosting sales',

    // Quick Diagnosis
    diagnosisBadge: '1-Minute Diagnosis',
    diagnosisTitle: 'Unsure what your site needs? <span class="highlight">Diagnose in 1 minute</span>',
    diagnosisSubtitle: 'Answer 5 quick questions to get an instant tailored recommendation to grow your business:',

    // Testimonials
    testimonialsBadge: 'Client Reviews',
    testimonialsTitle: 'Words from <span class="highlight">Business Owners</span>',
    testimonialsDesc: 'Real feedback from partners we collaborated with to launch live digital experiences:',

    // Trust Section
    trustBadge: 'Trust & Guarantees',
    trustTitle: 'Why Trust <span class="highlight">7P Studio</span>?',
    trustSubtitle: 'Transparent workflow, strict adherence to deadlines, and post-launch quality guarantee:',
    trustLiveHeader: '7 live models & projects (client work + interactive demos):',
    trustPromise1Title: 'Swift direct communication',
    trustPromise1Desc: 'Direct access to Omar and Mostafa with zero middleman friction.',
    trustPromise2Title: 'Guaranteed on-time delivery',
    trustPromise2Desc: 'We commit to clear milestones and deliver on schedule without delays.',
    trustPromise3Title: 'Post-launch warranty & support',
    trustPromise3Desc: 'We stand by our work, providing ongoing assistance and site maintenance.',

    // About Section
    aboutBadge: 'About the Team',
    aboutTitle: 'No fluff, no headache. Engineered your way with Omar & Mostafa Gad.',
    aboutDesc: 'Our goal is to build sites that look stunning, run lightning fast on mobile and desktop, and feel effortless to use.',
    aboutP1: "We are Omar and Mostafa Gad, web development partners at 7P Studio. We build websites from scratch, revamp existing platforms, and resolve technical bugs so your digital presence runs at peak performance.",
    aboutP2: "Whether you have a new project idea, an existing site requiring optimization or bug fixing, or want to expand with new pages and custom integrations — we engineer it step by step to fit your business perfectly.",

    // Pillars
    pillar1Title: 'Fast & Lightweight Browsing',
    pillar1Desc: 'Sites open in seconds and run smoothly across mobile devices without lag.',
    pillar2Title: 'Bug Fixing & Optimization',
    pillar2Desc: 'We pinpoint root causes in code and resolve them cleanly so you save time.',
    pillar3Title: 'Subtle 3D & Smooth Motion',
    pillar3Desc: 'Refined Three.js and GSAP interactions giving your site a signature modern feel.',
    pillar4Title: 'Customized to Your Needs',
    pillar4Desc: 'We tailor the styling, architecture, and sections specifically to your business niche.',

    // Skills
    skillsTitle: 'Core Technologies We Depend On',
    skillJs: 'Standard JavaScript (ESNext)',
    skillHtml: 'Semantic HTML5',
    skillCss: 'CSS3 & Responsive Design',
    skillGsap: 'GSAP Animation & Motion',
    skillThree: 'Three.js & 3D WebGL',
    skillResp: 'Mobile-First Responsive',
    skillBug: 'Bug Fixing & Diagnostics',
    skillCustom: 'Customization & Revamping',

    // Services
    servicesBadge: 'Our Services',
    servicesTitle: 'What We Can Do for Your Business',
    servicesDesc: 'Click on any service tile to view full deliverables and target fit:',
    s1Title: 'Full Website Development (Landing / E-commerce)',
    s1Desc: 'From concept and design to clean, performant code with shopping cart, domain, and hosting ready.',
    s1DeliverablesTitle: 'What is included:',
    s1Deliverables: 'Responsive UI, WhatsApp cart & checkout, easy management, domain & hosting configuration.',
    s1AudienceTitle: 'Who it is for:',
    s1Audience: 'E-commerce brands, restaurants, and businesses seeking high-converting digital storefronts.',

    s2Title: 'Bug Fixing & Rapid Maintenance',
    s2Desc: 'If your site is slow, buttons fail, or layout breaks on mobile, we fix it cleanly and promptly.',
    s2DeliverablesTitle: 'What is included:',
    s2Deliverables: 'Bug debugging, image/asset compression, mobile CSS repair, and speed optimization.',
    s2AudienceTitle: 'Who it is for:',
    s2Audience: 'Site owners experiencing performance bottlenecks or glitches preventing checkout.',

    s3Title: 'UI/UX Redesign & Modernization',
    s3Desc: 'Modernizing your existing layout into a sleek, trustworthy digital experience.',
    s3DeliverablesTitle: 'What is included:',
    s3Deliverables: 'Page restructuring, unified typography and color harmony, conversion UX improvements.',
    s3AudienceTitle: 'Who it is for:',
    s3Audience: 'Outdated websites needing a competitive visual upgrade.',

    s4Title: 'WhatsApp Integration & 3D Features',
    s4Desc: 'Direct WhatsApp sales funnel, booking modals, and interactive 3D touches.',
    s4DeliverablesTitle: 'What is included:',
    s4Deliverables: 'Automated WhatsApp cart messages, Three.js 3D models, and smooth GSAP choreography.',
    s4AudienceTitle: 'Who it is for:',
    s4Audience: 'Brands aiming to impress clients and make purchasing instantaneous.',

    // Estimator
    estimatorBadge: '7P Project Architect',
    estimatorTitle: 'Calculate your scope and receive <span class="highlight">instant WhatsApp quote</span>',
    estimatorDesc: 'Choose your scope and features to view estimated turnaround, stack, and kick off immediately.',
    estStep1Title: 'Primary Project Type',
    estStep1Desc: 'Select one type',
    estType1Name: 'High-Converting Landing Page',
    estType1Desc: 'Fast launch for products or services to boost leads',
    estType2Name: 'E-Commerce Store & Cart',
    estType2Desc: 'Catalog showcase, instant cart, and WhatsApp orders',
    estType3Name: 'Corporate Business Website',
    estType3Desc: 'Professional service presentation and trust building',
    estType4Name: 'Smart QR Menu & Ordering',
    estType4Desc: 'Fast QR menu for cafes and restaurants with instant checkout',
    estType5Name: 'Bug Fixing & Speed Boost',
    estType5Desc: 'Resolve bugs, speed up loading, and fix mobile responsiveness',
    estStep2Title: 'Suggested Features',
    estStep2Desc: 'Select all that apply',
    estFeat1: 'Instant WhatsApp Sync',
    estFeat2: '100% Mobile Responsive',
    estFeat3: 'Ultra Speed 95+ Score',
    estFeat4: '3D WebGL Atmosphere',
    estFeat5: 'Domain & Cloud Setup',
    estFeat6: 'SEO & OpenGraph Optimization',
    estStep3Title: 'Turnaround Speed',
    estStep3Desc: 'Select priority',
    estSpeedStdTitle: 'Standard Turnaround',
    estSpeedStdDays: 'Careful precision execution without rush',
    estSpeedExpTitle: 'Express Rush',
    estSpeedExpDays: 'Urgent turnaround in 48-72 hours',
    hudLabelScope: 'Project Scope',
    hudLabelDelivery: 'Estimated Delivery',
    hudLabelPriceRange: 'Estimated Range',
    hudLabelFeatures: 'Selected Features',
    hudLabelStack: 'Tech Stack',
    hudGuaranteeText: '7P Studio Guarantee: Bug-free delivery, clean performant code, and post-launch support.',
    hudCtaBtn: 'Send Quote to WhatsApp & Start',
    hudSaveQuoteBtn: 'Copy & Save Quote Details',
    hudSubhint: 'Instant WhatsApp message preparation for Omar & Mostafa',

    // Process
    processBadge: 'Our Process',
    processTitle: 'How We Work',
    processDesc: 'Four straightforward steps without wasting time or over-complicating:',
    pr1Step: 'Step 01',
    pr1Title: 'Align & Understand',
    pr1Desc: 'A focused discussion to pinpoint your exact goals, requirements, timeline, and cost.',
    pr2Step: 'Step 02',
    pr2Title: 'Design & Structure',
    pr2Desc: 'We solidify the UI aesthetic, colors, and layout tailored for your target audience.',
    pr3Step: 'Step 03',
    pr3Title: 'Code & Performance',
    pr3Desc: 'We engineer the site with modern web standards and test speed across all screens.',
    pr4Step: 'Step 04',
    pr4Title: 'Launch & Support',
    pr4Desc: 'We deploy the site live, connect custom domains, and support you after launch.',

    // Contact
    contactBadge: 'Contact Us',
    contactTitle: 'Have a project idea you want to bring to life?',
    contactDesc: 'Message us now — direct WhatsApp chat, or leave your details in the form and we will reply promptly.',
    waFastBadge: 'Fastest Response',
    waDirectBtn: 'Direct WhatsApp Chat 🚀',
    waDirectSub: 'Instant reply to discuss your project and start',
    cMethodPhone: 'WhatsApp / Call',
    cMethodInsta: 'Instagram',
    cMethodTiktok: 'TikTok',
    replayIntroBtn: 'Replay 3D Intro',
    formNameLabel: 'Your Name',
    formNamePlaceholder: 'e.g. Karim, Ahmed, Sarah',
    formContactLabel: 'WhatsApp or Phone Number',
    formContactPlaceholder: '01XXXXXXXXX or International',
    formMsgLabel: 'Project Details or Issue',
    formMsgPlaceholder: 'Briefly describe your vision, new site requirements, or bugs you need fixed...',
    formSubmitBtn: 'Send Details via WhatsApp',
    formPrivacyNote: 'Your details are sent strictly to WhatsApp and never stored on any server',
    privacyPolicyLink: 'Privacy Policy',

    // Sticky Mobile CTA
    stickyCtaTitle: 'Have a project idea?',
    stickyCtaSub: 'Omar & Mostafa are online',
    stickyCtaBtn: 'Chat WhatsApp',

    // Privacy Modal
    privacyModalTitle: 'Privacy Policy & Data Protection',
    privacyModalP1: 'At 7P Studio, your privacy is straightforward and strictly guarded:',
    privacyModalItem1: '<strong>No Storage Servers or Database:</strong> The website does not store or log any data you enter into the contact form.',
    privacyModalItem2: '<strong>Direct WhatsApp Transmission:</strong> Submitting formats your details into an encrypted message on your own WhatsApp application directly.',
    privacyModalItem3: '<strong>Zero Tracking Cookies:</strong> We do not deploy any third-party advertising or invasive tracking cookies.',
    privacyModalCloseBtn: 'Understood, Close',

    // Footer
    footerCopy: '© 2026 7P Studio (Omar & Mostafa Gad) — All Rights Reserved. Modern Websites Engineered Your Way.',
    backToTopBtn: 'Top'
  }
};

let currentLang = 'ar';

export function initLanguage() {
  const savedLang = localStorage.getItem('omar_portfolio_lang') || 'ar';
  setLanguage(savedLang, false);

  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang && targetLang !== currentLang) {
        setLanguage(targetLang, true);
      }
    });
  });
}

export function setLanguage(lang, persist = true) {
  if (lang !== 'ar' && lang !== 'en') return;
  currentLang = lang;

  if (persist) {
    try {
      localStorage.setItem('omar_portfolio_lang', lang);
    } catch (e) {}
  }

  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  applyTranslations(lang);
  updateLanguageToggles(lang);

  renderTestimonials(lang);

  window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
}

export function getLanguage() {
  return currentLang;
}

export function t(key) {
  const dict = translations[currentLang] || translations.ar;
  return dict[key] || key;
}

function applyTranslations(lang) {
  const dict = translations[lang] || translations.ar;

  if (dict.pageTitle) {
    document.title = dict.pageTitle;
  }
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && dict.pageMetaDesc) {
    metaDesc.setAttribute('content', dict.pageMetaDesc);
  }

  const i18nElements = document.querySelectorAll('[data-i18n]');
  i18nElements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  const i18nPlaceholders = document.querySelectorAll('[data-i18n-placeholder]');
  i18nPlaceholders.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });
}

function updateLanguageToggles(lang) {
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    const isActive = btnLang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}
