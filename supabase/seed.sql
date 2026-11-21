-- ==============================================================================
-- 7P STUDIO — SEED DATA
-- Populate initial portfolio content, services, testimonials, and sample logs
-- ==============================================================================

-- Initial Projects (Matching 7P Studio portfolio)
INSERT INTO public.projects (id, title_en, title_ar, client, category_en, category_ar, short_en, short_ar, tags_en, tags_ar, url, preview_img, accent_color, status, is_featured, display_order, views_count)
VALUES
('aya', 'Aya Accessories Boutique', 'متجر آية للاكسسوارات', 'Aya Accessories', 'E-Commerce Boutique', 'متجر وسلة مبيعات', 'A handmade accessories boutique with seamless WhatsApp ordering.', 'متجر إكسسوارات هاند ميد لتسهيل الطلب عبر واتساب.', '["WhatsApp Cart", "Fast Filters", "Mobile-First"]'::jsonb, '["سلة طلب واتساب", "فلاتر سريعة", "Mobile-First"]'::jsonb, 'https://aya-accessories.vercel.app/', '/projects/aya-preview.jpg', '#C8431F', 'published', true, 1, 12400),
('elara', 'ÉLARA Atelier Haute Couture', 'دار إيلارا للأزياء الراقية', 'ÉLARA Atelier', 'Haute Couture Storefront', 'دار أزياء راقية وتجارة إلكترونية', 'Quiet Luxury fashion maison with seasonal runway archives.', 'دار أزياء راقية وتجربة رقمية استثنائية.', '["Quiet Luxury", "Three.js Intro", "Bespoke Bag"]'::jsonb, '["فخامة هادئة", "إنترو Three.js", "سلة فاخرة"]'::jsonb, 'https://elara-omardemo.vercel.app/', '/projects/elara-preview.jpg', '#C5A059', 'published', true, 2, 9800),
('flowers', 'Jardin Vivant Haute Floriculture', 'بوتيك جاردان فيفانت للزهور', 'Jardin Vivant Paris', 'Luxury Florals & 3D Storefront', 'متجر زهور فاخرة 3D', 'French floral boutique with 3D bouquet selection.', 'متجر وتجربة رقمية فرنسية فاخرة لبوتيك زهور.', '["3D Flower Studio", "Interactive Bouquet"]'::jsonb, '["استوديو زهور 3D", "بوكيه تفاعلي"]'::jsonb, 'https://demo-flowershop.vercel.app/', '/projects/flowers-preview.jpg', '#E87A90', 'published', true, 3, 7300),
('festival', 'Festival Five Star Pastry', 'حلواني فيستفال فايف ستار', 'Festival Pastry', 'Bakery & Cake Ordering', 'حلواني وكافيه راقي', 'Luxury pastry chain with custom cake builder.', 'سلسلة حلويات راقية مع نظام طلب تورت تفاعلي.', '["Live Cake Builder", "Branch Selector"]'::jsonb, '["مصمم تورت لايف", "تحديد الفروع"]'::jsonb, 'https://festival-pastry.vercel.app/', '/projects/festival-preview.jpg', '#F59E0B', 'published', true, 4, 6200),
('elmohtaref', 'El Mohtaref Grills & Dining', 'مطعم المحترف للمشويات', 'El Mohtaref', 'Dining & Online Ordering', 'مطعم مشويات ومأكولات', 'Online restaurant platform with digital menu and delivery cart.', 'منصة رقمية كاملة لمطعم مشويات مع منيو ذكي وسلة دليفري.', '["Digital Menu", "Delivery Cart", "Branch Hours"]'::jsonb, '["منيو رقمي", "سلة دليفري", "مواعيد الفروع"]'::jsonb, 'https://el-mohtaref-restaurant.vercel.app/', '/projects/elmo7taref-preview.jpg', '#EF4444', 'published', true, 5, 5400),
('elveranda', 'El Veranda Co-working Hub', 'مساحة عمل الڤيرندا', 'El Veranda', 'Workspace & Meeting Rooms', 'مساحة عمل وقاعات اجتماعات', 'Co-working hub platform with hourly booking and private room calendar.', 'منصة متكاملة لمساحة عمل مشتركة مع حجز غرف اجتماعات.', '["Room Booking", "Hourly Rates", "Amenities"]'::jsonb, '["حجز غرف اجتماعات", "أسعار بالساعة"]'::jsonb, 'https://elvaranda.vercel.app/', '/projects/elveranda.jpg', '#2EE6FF', 'published', true, 6, 4100),
('rawnaq', 'Rawnaq 3D Luxury Perfumes', 'متجر رَوْنَـق للعطور الفاخرة 3D', 'Rawnaq Perfumes', '3D WebGL Storefront', 'تجربة 3D وتجارة عطور', 'Interactive 3D fragrance boutique with rotatable WebGL bottle.', 'متجر وتجربة تفاعلية لبراند عطور مع زجاجة 3D.', '["3D Bottle", "WhatsApp Checkout"]'::jsonb, '["زجاجة عطر 3D", "طلب واتساب"]'::jsonb, 'https://demo-perfume-sigma.vercel.app/', '/projects/rawnaq-preview.jpg', '#FFB800', 'published', true, 7, 3900),
('xops', 'XO PS Gaming Lounge', 'لاونج إكس أو بلايستيشن', 'XO PS Lounge', 'Gaming Lounge & Booking', 'لاونج ألعاب وحجوزات', 'Gaming lounge platform with VIP room reservations and PS5 specs.', 'منصة رقمية للاونج بلايستيشن مع حجز 15 غرفة ومكتبة ألعاب.', '["15 Rooms Booking", "PS5 Specs"]'::jsonb, '["حجز 15 غرفة", "مواصفات PS5"]'::jsonb, 'https://demoplaystaion-plum.vercel.app/', '/projects/xops-preview.jpg', '#C69255', 'published', true, 8, 3100)
ON CONFLICT (id) DO UPDATE SET views_count = EXCLUDED.views_count;

-- Initial Services
INSERT INTO public.services (id, title_en, title_ar, description_en, description_ar, icon, display_order, is_featured, is_active)
VALUES
('custom-sites', 'Websites from Scratch', 'مواقع وتطبيقات من الصفر', 'Tailor-made web solutions engineered with modern web standards, ultra-fast load times, and custom 3D visuals.', 'تصميم وبرمجة مواقع مخصصة بهوية فريدة، سرعة فائقة، ولمسات 3D ترفع قيمة علامتك التجارية.', 'fa-solid fa-code', 1, true, true),
('e-commerce', 'High-Converting E-Commerce', 'متاجر وسلات بيع ذكية', 'Seamless digital storefronts with WhatsApp instant checkout, smart filters, and zero cart friction.', 'متاجر إلكترونية خفيفة وسريعة مع ربط مباشر بطلبات واتساب لزيادة نسبة المبيعات وتسهيل الشراء.', 'fa-solid fa-cart-shopping', 2, true, true),
('performance-seo', 'Speed Optimization & Repairs', 'تسريع المواقع وحل المشاكل', 'Debugging, Core Web Vitals optimization, and responsive design repairs for existing websites.', 'فحص شامل للموقع، حل المشاكل البرمجية، تحسين سرعة التحميل وتهيئة الموقع لمحركات البحث.', 'fa-solid fa-gauge-high', 3, true, true),
('3d-motion', '3D Visuals & Creative Motion', 'أنيميشن ثلاثي الأبعاد وتفاعل', 'WebGL Three.js interactive centerpieces, GSAP animations, and custom fluid interactions.', 'إضافة عناصر 3D تفاعلية وأنيميشن سينمائي يلفت انتباه الزائر ويجعل موقعك لا يُنسى.', 'fa-solid fa-cube', 4, true, true)
ON CONFLICT (id) DO NOTHING;

-- Initial Testimonials
INSERT INTO public.testimonials (client_name, role_or_project, comment_en, comment_ar, rating, platform, is_approved, is_featured, display_order)
VALUES
('Aya Store', 'Aya Accessories Boutique', 'The WhatsApp cart completely changed how our customers place orders! So fast and elegant.', 'ما شاء الله الشغل ممتاز وسريع جداً، سلة الواتساب فرقت جداً في سرعة الطلبات وشكل المتجر شيك ومريح للعميل.', 5, 'tiktok', true, true, 1),
('Mohamed Tech', 'Corporate Solution', 'Great attention to details, animations were smooth and the site looks like high-end European agencies.', 'الموقع طلع في منتهى الاحترافية والأنيميشن مظبوط بدون أي بطء. تسليم في الميعاد بالضبط.', 5, 'tiktok', true, true, 2),
('Diaa Khaled', 'Workspace Platform', 'Booking system is very intuitive, and mobile responsiveness is 10/10.', 'التعامل راقي جداً والشغل منظم، صفحة الحجز اتنفذت بأحسن من اللي كنا متخيلينه.', 5, 'tiktok', true, true, 3)
ON CONFLICT DO NOTHING;

-- Initial Site Settings
INSERT INTO public.site_settings (id, studio_name, tagline, contact_email, contact_whatsapp, maintenance_mode, meta_title, meta_description, og_image)
VALUES ('current', '7P STUDIO', 'Modern Web Development Studio', 'contact@7pstudio.tech', '+201515047449', false, '7P STUDIO — Modern Web Development Studio', 'Interactive 3D Web Experiences, High-Conversion Landing Pages and E-Commerce Solutions.', '/og-image.jpg')
ON CONFLICT (id) DO NOTHING;

-- Initial Leads (matching dashboard reference overview)
INSERT INTO public.leads (name, email, phone, project_type, budget, message, status, priority, is_read, form_name, source_url)
VALUES
('Tarek Mansour', 'tarek@mansourgroup.com', '+201098765432', 'E-Commerce Store', '$1,500 - $3,000', 'We need a high-end luxury fashion store with WhatsApp checkout and 3D product showcase.', 'new', 'urgent', false, 'portfolio-contact', 'https://7pstudio.tech/'),
('Sarah El-Sayed', 'sarah.design@gmail.com', '+201123456789', 'Portfolio & Branding', '$800 - $1,500', 'Architect looking for an editorial interactive portfolio with subtle 3D models of projects.', 'discussion', 'high', true, 'estimator', 'https://7pstudio.tech/#estimator'),
('Ahmed Yassin', 'ayassin@fintech-eg.com', '+201200001122', 'Corporate Web Platform', '$3,000+', 'Redesigning our fintech services website with high security, bilingual support, and speed.', 'proposal_sent', 'normal', true, 'portfolio-contact', 'https://7pstudio.tech/')
ON CONFLICT DO NOTHING;

-- Initial Notifications
INSERT INTO public.notifications (type, title, message, link, severity, is_read)
VALUES
('lead', 'New lead from contact form', 'Tarek Mansour submitted an inquiry for E-Commerce Store', '/admin/#leads', 'info', false),
('system', 'Contact form delivery needs attention', 'Some messages are not being delivered to inbox. Verify email webhook configuration.', '/admin/#settings', 'warning', false),
('deployment', 'Deployment Successful', 'Your site is up and running perfectly on Vercel (7pstudio.tech)', '/admin/#deployment', 'success', true)
ON CONFLICT DO NOTHING;

-- Initial Activity Logs (Matching reference image timeline)
INSERT INTO public.activity_logs (action, user_name, user_role, category, details)
VALUES
('new_lead', 'System', 'system', 'lead', 'New lead from contact form: Tarek Mansour (E-Commerce Store)'),
('project_updated', 'Admin (7P Studio)', 'owner', 'project', 'Project "E-Commerce Store" updated (thumbnail and tags)'),
('visitor_session', 'Visitor EG-Cairo', 'visitor', 'system', 'New visitor from Egypt on Safari Mobile'),
('deployment_success', 'Vercel Bot', 'system', 'system', 'Website deployed successfully to production (7pstudio.tech)')
ON CONFLICT DO NOTHING;
