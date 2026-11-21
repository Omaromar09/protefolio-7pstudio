// ==============================================================================
// 7P STUDIO CONTROL CENTER — BILINGUAL TRANSLATION SYSTEM (i18nAdmin.js)
// Primary Language: Arabic (عربي أساسي) | Secondary Language: English (EN)
// ==============================================================================

const LANG_STORAGE_KEY = '7p_admin_lang';

export const DICT = {
  ar: {
    // Brand & Sidebar
    studioName: '7P STUDIO',
    controlCenter: 'لوحة التحكم المركزية',
    overview: 'نظرة عامة',
    projects: 'إدارة المشاريع',
    mediaLibrary: 'مكتبة الوسائط',
    services: 'خدمات الاستوديو',
    testimonials: 'آراء العملاء',
    messagesLeads: 'الرسائل والطلبات',
    pagesSections: 'الصفحات والأقسام',
    analytics: 'مركز الإحصائيات',
    performance: 'الأداء والسرعة',
    errorMonitoring: 'مراقبة النظام',
    settings: 'إعدادات الاستوديو',
    upgradePlan: 'ترقية الخطة',
    upgradeDesc: 'افتح المزيد من الميزات المتقدمة وتوسيع نطاق أعمال الاستوديو.',
    viewPlans: 'عرض الخطط',
    systemOnline: 'النظام متصل',
    lastUpdated: 'آخر تحديث',

    // Top Navigation
    searchPlaceholder: 'ابحث عن أي شيء في الاستوديو... (Ctrl + K)',
    toggleTheme: 'تبديل المظهر',
    notifications: 'التنبيهات والإشعارات',
    markAllRead: 'تحديد الكل كمقروء',
    viewAllNotifications: 'عرض جميع الإشعارات ←',
    noNotifications: 'لا توجد إشعارات جديدة حالياً.',
    languageToggle: 'English',

    // Greeting Banner
    greetingTitle: 'صباح الخير، 7P Studio',
    greetingSubtitle: 'إليك ما يحدث على موقعك اليوم وبيانات الزوار والطلبات الفعلية.',
    websiteLive: 'الموقع مباشر لايف',
    viewWebsite: 'معاينة الموقع ↗',
    last30Days: 'آخر 30 يوم',
    today: 'اليوم',
    yesterday: 'أمس',
    last7Days: 'آخر 7 أيام',
    last90Days: 'آخر 90 يوم',
    thisYear: 'هذا العام',

    // KPI Cards
    totalVisitors: 'إجمالي الزوار',
    pageViews: 'مشاهدات الصفحات',
    activeProjects: 'المشاريع المنشورة',
    newLeads: 'طلبات العملاء الجديدة',
    vsPreviousPeriod: 'مقارنة بالفترة السابقة',
    realTrackingActive: 'تتبع فعلي مباشر',

    // Row 2 Widgets
    visitorTraffic: 'حركة الزوار الفعلية',
    visitors: 'الزوار',
    views: 'المشاهدات',
    topPages: 'الصفحات الأكثر زيارة',
    viewAll: 'عرض الكل ←',
    devicesBreakdown: 'توزيع الأجهزة',
    totalSessions: 'إجمالي الجلسات',
    desktop: 'كمبيوتر مكتبي',
    mobile: 'هاتف ذكي',
    tablet: 'تابلت',

    // Row 3 Widgets
    projectsManagement: 'إدارة وتتبع المشاريع',
    project: 'المشروع',
    status: 'الحالة',
    viewsCount: 'النقرات الفعلية',
    actions: 'إجراءات',
    published: 'منشور لايف',
    draft: 'مسودة',
    recentActivity: 'أحدث النشاطات',
    alertsSystemStatus: 'تنبيهات وحالة النظام',
    formDeliveryStatus: 'نظام تسليم رسائل الموقع',
    formDeliveryDesc: 'يتم حفظ كافة رسائل وتفاصيل المشاريع مباشرة وبأمان في قاعدة البيانات.',
    deploymentSuccessful: 'نجاح النشر على السحابة',
    deploymentDesc: 'موقعك متصل ويعمل بأعلى كفاءة وسرعة عبر Vercel.',
    hostingVercel: 'الاستضافة: Vercel',
    domain7p: 'الدومين: 7pstudio.tech',

    // Leads Module
    leadsTitle: 'الرسائل والطلبات الواردة',
    leadsSubtitle: 'استقبال وإدارة رسائل العملاء، طلبات المشاريع، واستفسارات الأسعار الواردة من الموقع فوراً.',
    exportCsv: 'تصدير كملف CSV',
    tableView: 'جدول البيانات',
    pipelineView: 'لوحة المراحل (Pipeline)',
    searchLeads: 'ابحث بالاسم، رقم الواتساب، الإيميل، أو نوع المشروع...',
    allStatuses: 'جميع الحالات',
    statusNew: 'طلب جديد',
    statusContacted: 'تم التواصل',
    statusDiscussion: 'قيد النقاش',
    statusProposalSent: 'تم إرسال العرض',
    statusInProgress: 'قيد التنفيذ',
    statusCompleted: 'مكتمل بنجاح',
    statusRejected: 'مرفوض / ملغي',
    noLeadsFound: 'لا توجد رسائل واردة حالياً',
    noLeadsDesc: 'أي عميل يقوم بتعبئة فورم التواصل على موقعك ستصل رسالته وتفاصيل مشروعه إلى هنا فوراً.',
    leadDetails: 'تفاصيل الطلب والعميل',
    pipelineStatus: 'مرحلة الطلب في خط الإنتاج',
    whatsappChat: 'محادثة واتساب مباشرة',
    sendEmail: 'إرسال بريد إلكتروني',
    contactNumber: 'رقم الهاتف / الواتساب',
    clientEmail: 'البريد الإلكتروني',
    projectScope: 'نوع المشروع المطلوب',
    submittedAt: 'تاريخ الإرسال',
    clientMessage: 'نص رسالة وتفاصيل العميل',
    internalNotes: 'ملاحظات داخلية لفريق الاستوديو',
    addNote: 'إضافة ملاحظة',
    addNotePlaceholder: 'اكتب ملاحظة داخلية عن هذا العميل...',

    // Projects Module
    projectsTitle: 'إدارة مشاريع البورتفوليو',
    projectsSubtitle: 'التحكم في أعمال الاستوديو المعروضة، الروابط المباشرة، الصور، والنقرات الفعلية لكل مشروع.',
    addNewProject: 'إضافة مشروع جديد',
    editProject: 'تعديل المشروع',
    deleteProject: 'حذف المشروع',
    confirmDeleteProject: 'هل أنت متأكد من رغبتك في حذف هذا المشروع؟',
    projectTitleEn: 'عنوان المشروع (بالإنجليزية)',
    projectTitleAr: 'عنوان المشروع (بالعربية)',
    clientName: 'اسم العميل / البراند',
    categoryEn: 'تصنيف المشروع (EN)',
    liveUrl: 'رابط الموقع لايف (URL)',
    previewImage: 'مسار الصورة المعروضة',
    accentColor: 'اللون المميز (Accent Color)',
    saveProject: 'حفظ المشروع',
    cancel: 'إلغاء'
  },
  en: {
    // Brand & Sidebar
    studioName: '7P STUDIO',
    controlCenter: 'Control Center',
    overview: 'Overview',
    projects: 'Projects',
    mediaLibrary: 'Media Library',
    services: 'Services',
    testimonials: 'Testimonials',
    messagesLeads: 'Messages / Leads',
    pagesSections: 'Pages & Sections',
    analytics: 'Analytics',
    performance: 'Performance',
    errorMonitoring: 'Error Monitoring',
    settings: 'Settings',
    upgradePlan: 'Upgrade Your Plan',
    upgradeDesc: 'Unlock more features and take your studio further.',
    viewPlans: 'View Plans',
    systemOnline: 'System Online',
    lastUpdated: 'Last updated',

    // Top Navigation
    searchPlaceholder: 'Search anything... (Ctrl + K)',
    toggleTheme: 'Toggle Theme',
    notifications: 'Notifications',
    markAllRead: 'Mark all as read',
    viewAllNotifications: 'View All Notifications →',
    noNotifications: 'No new notifications.',
    languageToggle: 'العربية',

    // Greeting Banner
    greetingTitle: 'Good morning, 7P Studio',
    greetingSubtitle: "Here's what's happening with your website today.",
    websiteLive: 'Website Live',
    viewWebsite: 'View Website ↗',
    last30Days: 'Last 30 Days',
    today: 'Today',
    yesterday: 'Yesterday',
    last7Days: 'Last 7 Days',
    last90Days: 'Last 90 Days',
    thisYear: 'This Year',

    // KPI Cards
    totalVisitors: 'Total Visitors',
    pageViews: 'Page Views',
    activeProjects: 'Active Projects',
    newLeads: 'New Customer Leads',
    vsPreviousPeriod: 'vs previous period',
    realTrackingActive: 'Realtime Tracking Active',

    // Row 2 Widgets
    visitorTraffic: 'Real Visitor Traffic',
    visitors: 'Visitors',
    views: 'Views',
    topPages: 'Top Pages',
    viewAll: 'View All →',
    devicesBreakdown: 'Devices Breakdown',
    totalSessions: 'Total Sessions',
    desktop: 'Desktop',
    mobile: 'Mobile',
    tablet: 'Tablet',

    // Row 3 Widgets
    projectsManagement: 'Projects Management',
    project: 'Project',
    status: 'Status',
    viewsCount: 'Real Clicks',
    actions: 'Actions',
    published: 'Published',
    draft: 'Draft',
    recentActivity: 'Recent Activity',
    alertsSystemStatus: 'Alerts & System Status',
    formDeliveryStatus: 'Website Form Delivery Engine',
    formDeliveryDesc: 'All visitor messages and specifications are securely saved directly in database.',
    deploymentSuccessful: 'Deployment Successful',
    deploymentDesc: 'Your site is up and running with ultra-fast speed on Vercel.',
    hostingVercel: 'Hosting: Vercel',
    domain7p: 'Domain: 7pstudio.tech',

    // Leads Module
    leadsTitle: 'Messages & Leads Inbox',
    leadsSubtitle: 'Real-time inquiries, project proposals, and estimates submitted through the website.',
    exportCsv: 'Export CSV',
    tableView: 'Table View',
    pipelineView: 'Pipeline (Kanban)',
    searchLeads: 'Search by name, phone, email, or project...',
    allStatuses: 'All Statuses',
    statusNew: 'New',
    statusContacted: 'Contacted',
    statusDiscussion: 'Discussion',
    statusProposalSent: 'Proposal Sent',
    statusInProgress: 'In Progress',
    statusCompleted: 'Completed',
    statusRejected: 'Rejected',
    noLeadsFound: 'No customer messages yet',
    noLeadsDesc: 'Whenever a client fills out the contact form on your portfolio, their message will appear here instantly.',
    leadDetails: 'Lead & Client Details',
    pipelineStatus: 'Pipeline Status',
    whatsappChat: 'Direct WhatsApp Chat',
    sendEmail: 'Send Email',
    contactNumber: 'Phone / WhatsApp',
    clientEmail: 'Email Address',
    projectScope: 'Project Scope',
    submittedAt: 'Submitted At',
    clientMessage: 'Client Message & Details',
    internalNotes: 'Internal Studio Notes',
    addNote: 'Add Note',
    addNotePlaceholder: 'Add an internal note about this client...',

    // Projects Module
    projectsTitle: 'Portfolio Projects CMS',
    projectsSubtitle: 'Control showcase projects, outbound links, preview graphics, and actual click counts.',
    addNewProject: 'Add New Project',
    editProject: 'Edit Project',
    deleteProject: 'Delete Project',
    confirmDeleteProject: 'Are you sure you want to delete this project?',
    projectTitleEn: 'Project Title (English)',
    projectTitleAr: 'Project Title (Arabic)',
    clientName: 'Client / Brand Name',
    categoryEn: 'Category (EN)',
    liveUrl: 'Live Website URL',
    previewImage: 'Preview Image Path',
    accentColor: 'Accent Color',
    saveProject: 'Save Project',
    cancel: 'Cancel'
  }
};

export const AdminI18n = {
  getLanguage() {
    return localStorage.getItem(LANG_STORAGE_KEY) || 'ar'; // Default Arabic
  },

  setLanguage(lang) {
    if (lang !== 'ar' && lang !== 'en') lang = 'ar';
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    this.applyToDOM(lang);
    window.dispatchEvent(new CustomEvent('admin-lang-change', { detail: { lang } }));
  },

  toggleLanguage() {
    const current = this.getLanguage();
    const next = current === 'ar' ? 'en' : 'ar';
    this.setLanguage(next);
    return next;
  },

  t(key) {
    const lang = this.getLanguage();
    const dict = DICT[lang] || DICT.ar;
    return dict[key] || DICT.en[key] || key;
  },

  applyToDOM(lang = this.getLanguage()) {
    const isAr = lang === 'ar';
    document.documentElement.lang = isAr ? 'ar' : 'en';
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    if (isAr) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }
};
