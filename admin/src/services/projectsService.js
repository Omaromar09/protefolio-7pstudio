// ==============================================================================
// 7P STUDIO CONTROL CENTER — PROJECTS CMS SERVICE (projectsService.js)
// Real projects source of truth with full CRUD, reordering & tag management
// ==============================================================================

import { supabase, isSupabaseConfigured, getLocalData, setLocalData } from './db.js';
import { ActivityService } from './activityService.js';

const PROJECTS_STORAGE_KEY = 'projects_list';

const INITIAL_PROJECTS = [
  {
    id: 'aya',
    title: { ar: 'متجر آية للاكسسوارات', en: 'Aya Accessories Boutique' },
    client: 'Aya Accessories',
    category: { ar: 'متجر وسلة مبيعات', en: 'E-Commerce Boutique' },
    short: {
      ar: 'متجر إكسسوارات هاند ميد، عملناه عشان يسهل على العملاء يختاروا ويطلبوا بالضبط اللي عايزينه عبر الواتساب.',
      en: 'A handmade accessories boutique with seamless WhatsApp cart and fast filters.'
    },
    tags: {
      ar: ['سلة طلب واتساب', 'فلاتر سريعة', 'Mobile-First', 'كتالوج تفاعلي'],
      en: ['WhatsApp Cart', 'Fast Filters', 'Mobile-First', 'Interactive Catalog']
    },
    url: 'https://aya-accessories.vercel.app/',
    previewImg: '/projects/aya-preview.jpg',
    accentColor: '#C8431F',
    status: 'published',
    isFeatured: true,
    viewsCount: 12400,
    displayOrder: 1,
    createdAt: '2026-10-26T16:03:00.000Z'
  },
  {
    id: 'elara',
    title: { ar: 'دار إيلارا للأزياء الراقية (ÉLARA)', en: 'ÉLARA Atelier Haute Couture' },
    client: 'ÉLARA Atelier',
    category: { ar: 'دار أزياء راقية وتجارة إلكترونية فاخرة', en: 'Haute Couture & Quiet Luxury Storefront' },
    short: {
      ar: 'دار أزياء راقية وتجربة رقمية استثنائية بتجسد مفهوم الفخامة الهادئة، أنيميشن سينمائي Three.js، وسلة تسوق فاخرة.',
      en: 'Quiet Luxury digital fashion maison featuring seasonal runway collections, cinematic Three.js intro, and bespoke shopping bag.'
    },
    tags: {
      ar: ['فخامة هادئة Quiet Luxury', 'إنترو سينمائي Three.js', 'دعم ثنائي عربي وإنجليزي'],
      en: ['Quiet Luxury Redefined', 'Cinematic Three.js Intro', 'Bilingual EN & AR Support']
    },
    url: 'https://elara-omardemo.vercel.app/',
    previewImg: '/projects/elara-preview.jpg',
    accentColor: '#C5A059',
    status: 'published',
    isFeatured: true,
    viewsCount: 9800,
    displayOrder: 2,
    createdAt: '2026-11-18T22:06:00.000Z'
  },
  {
    id: 'flowers',
    title: { ar: 'بوتيك جاردان فيفانت للزهور', en: 'Jardin Vivant Haute Floriculture' },
    client: 'Jardin Vivant Paris',
    category: { ar: 'متجر زهور فاخرة 3D وتجربة تفاعلية', en: 'Luxury Florals & 3D Storefront' },
    short: {
      ar: 'متجر وتجربة رقمية فرنسية فاخرة لبوتيك زهور وتحف نباتية مع استوديو 3D.',
      en: 'French luxury floral boutique with interactive 3D bouquet selection and WhatsApp concierge.'
    },
    tags: {
      ar: ['استوديو زهور 3D تفاعلي', 'طلب مباشر عبر واتساب'],
      en: ['3D Flower Studio', 'Interactive Bouquet', 'WhatsApp Concierge']
    },
    url: 'https://demo-flowershop.vercel.app/',
    previewImg: '/projects/flowers-preview.jpg',
    accentColor: '#E87A90',
    status: 'published',
    isFeatured: true,
    viewsCount: 7300,
    displayOrder: 3,
    createdAt: '2026-11-11T19:53:00.000Z'
  },
  {
    id: 'festival',
    title: { ar: 'حلواني فيستفال فايف ستار', en: 'Festival Five Star Pastry' },
    client: 'Festival Pastry',
    category: { ar: 'حلواني وكافيه راقي', en: 'Bakery & Cake Ordering' },
    short: {
      ar: 'سلسلة حلويات راقية مع نظام طلب تورت تفاعلي وتحديد الفروع.',
      en: 'Luxury pastry chain with custom live cake builder and branch selector.'
    },
    tags: {
      ar: ['مصمم تورت لايف', 'تحديد الفروع', 'دفع عند الاستلام'],
      en: ['Live Cake Builder', 'Branch Selector', 'Fast Ordering']
    },
    url: 'https://festival-pastry.vercel.app/',
    previewImg: '/projects/festival-preview.jpg',
    accentColor: '#F59E0B',
    status: 'published',
    isFeatured: false,
    viewsCount: 6200,
    displayOrder: 4,
    createdAt: '2026-11-11T19:54:00.000Z'
  },
  {
    id: 'elmohtaref',
    title: { ar: 'مطعم المحترف للمشويات', en: 'El Mohtaref Grills & Dining' },
    client: 'El Mohtaref',
    category: { ar: 'مطعم مشويات ومأكولات شرقية', en: 'Dining & Online Ordering' },
    short: {
      ar: 'منصة رقمية كاملة لمطعم مشويات مع منيو ذكي وسلة دليفري.',
      en: 'Full digital restaurant platform with smart menu and fast delivery cart.'
    },
    tags: {
      ar: ['منيو رقمي', 'سلة دليفري', 'مواعيد الفروع'],
      en: ['Digital Menu', 'Delivery Cart', 'Branch Hours']
    },
    url: 'https://el-mohtaref-restaurant.vercel.app/',
    previewImg: '/projects/elmo7taref-preview.jpg',
    accentColor: '#EF4444',
    status: 'published',
    isFeatured: false,
    viewsCount: 5400,
    displayOrder: 5,
    createdAt: '2026-10-26T16:03:00.000Z'
  },
  {
    id: 'elveranda',
    title: { ar: 'مساحة عمل الڤيرندا', en: 'El Veranda Co-working Hub' },
    client: 'El Veranda',
    category: { ar: 'مساحة عمل وقاعات اجتماعات', en: 'Workspace & Meeting Rooms' },
    short: {
      ar: 'منصة متكاملة لمساحة عمل مشتركة مع حجز غرف اجتماعات وأسعار بالساعة.',
      en: 'Co-working hub platform with hourly booking and private room calendar.'
    },
    tags: {
      ar: ['حجز غرف اجتماعات', 'أسعار بالساعة', 'موقع جغرافي'],
      en: ['Room Booking', 'Hourly Rates', 'Amenities & Map']
    },
    url: 'https://elvaranda.vercel.app/',
    previewImg: '/projects/elveranda.jpg',
    accentColor: '#2EE6FF',
    status: 'published',
    isFeatured: false,
    viewsCount: 4100,
    displayOrder: 6,
    createdAt: '2026-11-11T19:54:00.000Z'
  },
  {
    id: 'rawnaq',
    title: { ar: 'متجر رَوْنَـق للعطور الفاخرة 3D', en: 'Rawnaq 3D Luxury Perfumes' },
    client: 'Rawnaq Perfumes',
    category: { ar: 'تجربة 3D تفاعلية ومتجر عطور', en: '3D WebGL Storefront & Fragrance Boutique' },
    short: {
      ar: 'متجر وتجربة تفاعلية لبراند عطور فاخرة مع زجاجة 3D تفاعلية وتأثير رذاذ.',
      en: 'Interactive 3D fragrance boutique with a rotatable WebGL bottle and WhatsApp orders.'
    },
    tags: {
      ar: ['زجاجة عطر 3D تفاعلية', 'سلة طلب واتساب', 'تأثيرات رش'],
      en: ['Interactive 3D Bottle', 'WhatsApp Checkout', 'WebGL Experience']
    },
    url: 'https://demo-perfume-sigma.vercel.app/',
    previewImg: '/projects/rawnaq-preview.jpg',
    accentColor: '#FFB800',
    status: 'published',
    isFeatured: false,
    viewsCount: 3900,
    displayOrder: 7,
    createdAt: '2026-11-11T19:55:00.000Z'
  },
  {
    id: 'xops',
    title: { ar: 'لاونج إكس أو بلايستيشن', en: 'XO PS Gaming Lounge' },
    client: 'XO PS Lounge',
    category: { ar: 'لاونج بلايستيشن ونظام حجوزات', en: 'Gaming Lounge & Booking System' },
    short: {
      ar: 'منصة رقمية متكاملة للاونج ألعاب وبلايستيشن مع حجز 15 غرفة معزولة.',
      en: 'Full-featured web platform for gaming lounge with online reservations for 15 soundproof VIP suites.'
    },
    tags: {
      ar: ['حجز 15 غرفة أونلاين', 'أجهزة PS5 ومكتبة ألعاب', 'تصميم Dark Mode'],
      en: ['15 Rooms Booking', 'PS5 & Games Library', 'Modern Dark Mode']
    },
    url: 'https://demoplaystaion-plum.vercel.app/',
    previewImg: '/projects/xops-preview.jpg',
    accentColor: '#C69255',
    status: 'published',
    isFeatured: false,
    viewsCount: 3100,
    displayOrder: 8,
    createdAt: '2026-11-11T19:55:00.000Z'
  }
];

export const ProjectsService = {
  async getProjects() {
    const local = getLocalData(PROJECTS_STORAGE_KEY, null);
    if (!local) {
      setLocalData(PROJECTS_STORAGE_KEY, INITIAL_PROJECTS);
      return INITIAL_PROJECTS;
    }
    return local;
  },

  async addProject(projectData) {
    const projects = await this.getProjects();
    const newProject = {
      id: projectData.id || 'proj_' + Date.now(),
      title: projectData.title || { en: 'New Project', ar: 'مشروع جديد' },
      client: projectData.client || 'Client',
      category: projectData.category || { en: 'Web Application', ar: 'تطبيق ويب' },
      short: projectData.short || { en: '', ar: '' },
      tags: projectData.tags || { en: ['Vite', 'Responsive'], ar: ['سريع', 'متجاوب'] },
      url: projectData.url || 'https://7pstudio.tech',
      previewImg: projectData.previewImg || '/projects/aya-preview.jpg',
      accentColor: projectData.accentColor || '#FF8500',
      status: projectData.status || 'published',
      isFeatured: !!projectData.isFeatured,
      viewsCount: 0,
      displayOrder: projects.length + 1,
      createdAt: new Date().toISOString()
    };

    projects.push(newProject);
    setLocalData(PROJECTS_STORAGE_KEY, projects);

    ActivityService.logAction({
      action: 'project_created',
      category: 'project',
      details: `Created new project "${newProject.title.en}"`
    });

    return newProject;
  },

  async updateProject(id, updates) {
    const projects = await this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() };
      setLocalData(PROJECTS_STORAGE_KEY, projects);

      ActivityService.logAction({
        action: 'project_updated',
        category: 'project',
        details: `Updated project "${projects[index].title?.en || id}"`
      });

      return projects[index];
    }
  },

  async deleteProject(id) {
    const projects = await this.getProjects();
    const target = projects.find(p => p.id === id);
    const updated = projects.filter(p => p.id !== id);
    setLocalData(PROJECTS_STORAGE_KEY, updated);

    ActivityService.logAction({
      action: 'project_deleted',
      category: 'project',
      details: `Deleted project "${target ? target.title.en : id}"`
    });
  },

  async togglePublish(id) {
    const projects = await this.getProjects();
    const p = projects.find(item => item.id === id);
    if (p) {
      p.status = p.status === 'published' ? 'draft' : 'published';
      setLocalData(PROJECTS_STORAGE_KEY, projects);
      return p.status;
    }
  }
};
