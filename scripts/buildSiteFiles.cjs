const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Write index.html
const indexHtmlContent = `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>عمر يحيى — مصمم ومطور ويب</title>
    <meta name="description" content="الموقع الشخصي لعمر يحيى، مصمم ومطور ويب. تصميم وتطوير مواقع عصرية، تجارب ثلاثية الأبعاد وحركات تفاعلية." />
    <meta name="keywords" content="عمر يحيى, Omar Yahia, Web Designer, Web Developer, مصمم مواقع, مطور ويب, Three.js, GSAP" />
    <meta name="author" content="Omar Yahia" />

    <!-- Open Graph (Facebook, WhatsApp, LinkedIn) -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Omar Yahia" />
    <meta property="og:locale" content="ar_EG" />
    <meta property="og:locale:alternate" content="en_US" />
    <meta property="og:url" content="https://omaryahia.me/" />
    <meta property="og:title" content="عمر يحيى — مصمم ومطور ويب" />
    <meta property="og:description" content="الموقع الشخصي لعمر يحيى، مصمم ومطور ويب. تصميم وتطوير مواقع عصرية، تجارب ثلاثية الأبعاد وحركات تفاعلية." />
    <meta property="og:image" content="https://7pstudio.tech/og-image.jpg" />
    <meta property="og:image:secure_url" content="https://7pstudio.tech/og-image.jpg" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="عمر يحيى — مصمم ومطور ويب" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="عمر يحيى — مصمم ومطور ويب" />
    <meta name="twitter:description" content="الموقع الشخصي لعمر يحيى، مصمم ومطور ويب. تصميم وتطوير مواقع عصرية، تجارب ثلاثية الأبعاد وحركات تفاعلية." />
    <meta name="twitter:image" content="https://7pstudio.tech/og-image.jpg" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="theme-color" content="#FBF8F4" />

    <!-- Preload 6 Photos & Avatars for Intro -->
    <link rel="preload" as="image" href="/photos/photo-1.webp" type="image/webp" />
    <link rel="preload" as="image" href="/photos/photo-2.webp" type="image/webp" />
    <link rel="preload" as="image" href="/photos/photo-3.webp" type="image/webp" />
    <link rel="preload" as="image" href="/photos/photo-4.webp" type="image/webp" />
    <link rel="preload" as="image" href="/photos/photo-5.webp" type="image/webp" />
    <link rel="preload" as="image" href="/photos/photo-6.webp" type="image/webp" />
    <link rel="preload" as="image" href="/photos/photo-1-avatar.webp" type="image/webp" />
    <link rel="preload" as="image" href="/photos/photo-2-avatar.webp" type="image/webp" />
    <link rel="preload" as="image" href="/photos/photo-3-avatar.webp" type="image/webp" />
    <link rel="preload" as="image" href="/photos/photo-4-avatar.webp" type="image/webp" />

    <!-- Google Fonts: Geist (EN) and IBM Plex Sans Arabic (AR) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

    <!-- Structured Data JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Omar Yahia",
      "alternateName": "عمر يحيى",
      "jobTitle": "Web Designer & Developer",
      "url": "https://omaryahia.me/",
      "image": "https://7pstudio.tech/og-image.jpg",
      "sameAs": [
        "https://7pstudio.tech",
        "https://instagram.com/omar_thegratt",
        "https://wa.me/201221576360"
      ]
    }
    </script>
  </head>
  <body>
    <!-- Background Peach Drifting Shapes Layer -->
    <div class="peach-blobs-layer" aria-hidden="true">
      <div class="peach-blob blob-top"></div>
      <div class="peach-blob blob-bottom"></div>
      <div class="peach-blob blob-mid"></div>
    </div>

    <!-- Skip Intro Button (Visible from Frame 1) -->
    <button id="skip-intro-btn" class="skip-intro-btn" aria-label="تخطي المقدمة">
      <span data-i18n="skipIntro">تخطي</span>
      <span>/ Skip</span>
    </button>

    <!-- INTRO STAGE (0.00s to 5.00s Master Timeline + Hand-off) -->
    <div id="intro-stage" aria-hidden="true">
      <!-- 0.00 - 1.20s: Center Orange Dot, Pulse Ring, Expanding Pill & Avatars -->
      <div class="intro-center-box">
        <div id="intro-dot" class="intro-dot"></div>
        <div id="intro-ring" class="intro-ring"></div>
        <div id="intro-pill" class="intro-pill">
          <div class="intro-avatars-group">
            <img src="/photos/photo-1-avatar.webp" alt="عمر" class="intro-avatar intro-pill-avatar" />
            <img src="/photos/photo-2-avatar.webp" alt="عمر" class="intro-avatar intro-pill-avatar" />
            <img src="/photos/photo-3-avatar.webp" alt="عمر" class="intro-avatar intro-pill-avatar" />
            <img src="/photos/photo-4-avatar.webp" alt="عمر" class="intro-avatar intro-pill-avatar" />
          </div>
        </div>
      </div>

      <!-- 1.20 - 3.20s: Headline Blur-in with Inline Avatars & 4-Word Vertical Roll -->
      <div id="intro-headline" class="intro-headline-container">
        <div class="intro-headline-line1">
          <span data-i18n="introHeadlineLine1Before">خلّي</span>
          <span class="intro-inline-avatars">
            <img src="/photos/photo-1-avatar.webp" alt="عمر" class="intro-inline-avatar" />
            <img src="/photos/photo-2-avatar.webp" alt="عمر" class="intro-inline-avatar" />
            <img src="/photos/photo-3-avatar.webp" alt="عمر" class="intro-inline-avatar" />
            <img src="/photos/photo-4-avatar.webp" alt="عمر" class="intro-inline-avatar" />
          </span>
          <span data-i18n="introHeadlineLine1After">عمر يبني</span>
        </div>
        <div class="intro-headline-line2">
          <span class="intro-word-roller">
            <span id="intro-word-roller-inner" class="intro-word-roller-inner">
              <span class="intro-roll-word">موقع</span>
              <span class="intro-roll-word">متجر</span>
              <span class="intro-roll-word">براند</span>
              <span class="intro-roll-word">مشروع</span>
            </span>
          </span>
          <span data-i18n="introHeadlineLine2Suffix">بتاعك</span>
        </div>
      </div>

      <!-- 3.20 - 3.50s: "قابل عمر." (Meet Omar) Start Side Reveal -->
      <div id="intro-meet" class="intro-meet-container">
        <div class="intro-meet-text">
          <span data-i18n="introMeetLine1">قابل</span><br />
          <span data-i18n="introMeetLine2">عمر.</span>
        </div>
      </div>

      <!-- 3.30 - 5.00s: Vertical Photo Wheel Scrolling & Exponential Stopping -->
      <div id="intro-wheel" class="intro-wheel-container">
        <div id="intro-wheel-track" class="intro-wheel-track">
          <!-- Looping Cards 1 to 6 (landing target is index 7 = photo-2) -->
          <div class="intro-wheel-card"><img src="/photos/photo-1.webp" alt="عمر" /></div>
          <div class="intro-wheel-card"><img src="/photos/photo-2.webp" alt="عمر" /></div>
          <div class="intro-wheel-card"><img src="/photos/photo-3.webp" alt="عمر" /></div>
          <div class="intro-wheel-card"><img src="/photos/photo-4.webp" alt="عمر" /></div>
          <div class="intro-wheel-card"><img src="/photos/photo-5.webp" alt="عمر" /></div>
          <div class="intro-wheel-card"><img src="/photos/photo-6.webp" alt="عمر" /></div>
          <div class="intro-wheel-card"><img src="/photos/photo-1.webp" alt="عمر" /></div>
          <!-- Landing Card: photo-2 with check badge -->
          <div id="intro-landing-card" class="intro-wheel-card">
            <img src="/photos/photo-2.webp" alt="عمر" style="object-position: center 22%;" />
            <div id="intro-check-badge" class="intro-check-badge">
              <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
            </div>
          </div>
          <div class="intro-wheel-card"><img src="/photos/photo-3.webp" alt="عمر" /></div>
          <div class="intro-wheel-card"><img src="/photos/photo-4.webp" alt="عمر" /></div>
          <div class="intro-wheel-card"><img src="/photos/photo-5.webp" alt="عمر" /></div>
          <div class="intro-wheel-card"><img src="/photos/photo-6.webp" alt="عمر" /></div>
        </div>
      </div>
    </div>

    <!-- SITE WRAPPER -->
    <div class="site-wrapper">
      <!-- HEADER / NAVIGATION (reveals during 5.30s - 6.00s mask hand-off) -->
      <header class="site-header">
        <div class="container">
          <div class="nav-wrapper">
            <!-- Brand -->
            <a href="#hero" class="nav-brand" aria-label="الصفحة الرئيسية">
              <span>عمر</span>
              <span class="nav-brand-dot"></span>
            </a>

            <!-- Nav Links Pill -->
            <ul class="nav-links-pill">
              <li><a href="#about" class="nav-link" data-i18n="navAbout">عني</a></li>
              <li><a href="#gallery" class="nav-link" data-i18n="navGallery">صوري</a></li>
              <li><a href="#services" class="nav-link" data-i18n="navServices">بعمل إيه</a></li>
              <li><a href="#work" class="nav-link" data-i18n="navWork">شغلي</a></li>
              <li><a href="#contact" class="nav-link" data-i18n="navContact">تواصل</a></li>
            </ul>

            <!-- Actions -->
            <div class="nav-actions">
              <button id="lang-toggle-btn" class="lang-toggle-btn" aria-label="تبديل اللغة">EN</button>
              <button id="mobile-menu-btn" class="mobile-menu-btn" aria-label="فتح القائمة">
                <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- MOBILE NAVIGATION DRAWER -->
      <div id="mobile-nav-drawer" class="mobile-nav-drawer" aria-hidden="true">
        <div class="mobile-drawer-top">
          <div class="nav-brand">
            <span>عمر</span>
            <span class="nav-brand-dot"></span>
          </div>
          <button id="mobile-drawer-close" class="mobile-drawer-close" aria-label="إغلاق القائمة">
            <svg viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
          </button>
        </div>
        <ul class="mobile-nav-links">
          <li><a href="#about" class="mobile-nav-link" data-i18n="navAbout">عني</a></li>
          <li><a href="#gallery" class="mobile-nav-link" data-i18n="navGallery">صوري</a></li>
          <li><a href="#services" class="mobile-nav-link" data-i18n="navServices">بعمل إيه</a></li>
          <li><a href="#work" class="mobile-nav-link" data-i18n="navWork">شغلي</a></li>
          <li><a href="#contact" class="mobile-nav-link" data-i18n="navContact">تواصل</a></li>
        </ul>
        <div class="mobile-drawer-bottom">
          <button id="mobile-lang-toggle-btn" class="lang-toggle-btn">EN</button>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <main>
        <!-- HERO SECTION (Interactive Photo Wheel Centerpiece) -->
        <section class="hero-section" id="hero">
          <div class="container">
            <div class="hero-grid">
              <!-- Start Side: Typography & Actions -->
              <div class="hero-content hero-reveal-mask">
                <span class="hero-label">
                  <span class="hero-label-dot"></span>
                  <span data-i18n="heroLabel">مصمم ومطور ويب</span>
                </span>
                <!-- The ONLY H1 on the page -->
                <h1 class="hero-title" data-i18n="heroGreeting">أنا عمر</h1>
                <p class="hero-subline" data-i18n="heroSubline">بصمم وببرمج مواقع</p>
                <div class="hero-actions">
                  <a href="https://7pstudio.tech" target="_blank" rel="noopener noreferrer" class="btn btn-primary" data-i18n="heroBtnWork">
                    شوف شغلي
                  </a>
                  <a href="https://wa.me/201221576360" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" data-i18n="heroBtnContact">
                    كلمني
                  </a>
                </div>
              </div>

              <!-- End Side: Interactive 3D Photo Wheel Centerpiece -->
              <div class="hero-centerpiece">
                <div class="hero-wheel-wrapper">
                  <!-- The 3D Card host container with 3px orange border -->
                  <div id="hero-3d-card" class="hero-3d-card-container">
                    <!-- Three.js Canvas -->
                    <canvas id="hero-3d-canvas"></canvas>
                    <!-- Domestic 2D Image Fallback (Starts on photo-2) -->
                    <img id="hero-card-fallback-img" src="/photos/photo-2.webp" alt="عمر يحيى" class="hero-card-fallback" />
                    <!-- Orange Check Badge in corner -->
                    <div class="hero-check-badge">
                      <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>

                  <!-- Controls Pill: Up/Down Buttons + Counter ("02 / 06") -->
                  <div class="hero-wheel-controls">
                    <button id="wheel-btn-up" class="wheel-nav-btn" aria-label="الصورة السابقة">
                      <svg viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <span id="photo-counter" class="wheel-counter">02 / 06</span>
                    <button id="wheel-btn-down" class="wheel-nav-btn" aria-label="الصورة التالية">
                      <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 1: ABOUT ME ("عني") -->
        <section id="about" class="about-section">
          <div class="container">
            <div class="section-header">
              <span class="section-tag" data-i18n="aboutTitle">عني</span>
              <h2 class="section-title"><span class="accent-word" data-i18n="aboutTitle">عني</span> والشغف بالويب</h2>
              <p class="section-subtitle" data-i18n="aboutTagline">شغفي بالويب وتفاصيله</p>
            </div>

            <div class="about-grid">
              <!-- Bio Card with Editable Placeholder -->
              <div class="about-bio-card">
                <p class="about-bio-text">
                  أهلاً! أنا عمر، مصمم ومطور واجهات ويب بركز على الجمع بين جمال التصميم والتفاعل السلس وسرعة الأداء.
                </p>
                <div class="about-bio-placeholder" data-i18n="aboutBio">
                  [EDIT: اكتب هنا 2 إلى 3 أسطر عن نفسك، اهتماماتك الشخصية، وشغفك ببناء تجارب رقمية مميزة وسلسة للناس.]
                </div>
                <div class="about-meta">
                  <span class="about-caption" data-i18n="aboutCardCaption">عمر يحيى · مطور ومصمم واجهات</span>
                  <span class="about-badge" data-i18n="aboutBadge">شخصي وليس استوديو</span>
                </div>
              </div>

              <!-- Orbiting / Fanning Cards Showcase -->
              <div class="about-fan-showcase">
                <div class="fan-card fan-card-1"><img src="/photos/photo-1.webp" alt="صورة عمر 1" /></div>
                <div class="fan-card fan-card-2"><img src="/photos/photo-2.webp" alt="صورة عمر 2" /></div>
                <div class="fan-card fan-card-3"><img src="/photos/photo-3.webp" alt="صورة عمر 3" /></div>
                <div class="fan-card fan-card-4"><img src="/photos/photo-4.webp" alt="صورة عمر 4" /></div>
                <div class="fan-card fan-card-5"><img src="/photos/photo-5.webp" alt="صورة عمر 5" /></div>
                <div class="fan-card fan-card-6"><img src="/photos/photo-6.webp" alt="صورة عمر 6" /></div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 2: PHOTO GALLERY ("صوري") 3D STACK / CAROUSEL -->
        <section id="gallery" class="gallery-section">
          <div class="container">
            <div class="section-header" style="text-align: center; align-items: center;">
              <span class="section-tag" data-i18n="galleryTitle">صوري</span>
              <h2 class="section-title"><span class="accent-word" data-i18n="galleryTitle">صوري</span> الشخصية</h2>
              <p class="section-subtitle" data-i18n="gallerySubtitle">لقطات من أوقاتي وأماكني المفضلة</p>
            </div>

            <div class="gallery-container">
              <div id="gallery-stack" class="gallery-stack-wrapper">
                <div class="gallery-stack-card"><img src="/photos/photo-1.webp" alt="غروب البحر" /></div>
                <div class="gallery-stack-card"><img src="/photos/photo-2.webp" alt="صورة الجلوس" /></div>
                <div class="gallery-stack-card"><img src="/photos/photo-3.webp" alt="سيلفي الكافيه" /></div>
                <div class="gallery-stack-card"><img src="/photos/photo-4.webp" alt="صورة ليلية" /></div>
                <div class="gallery-stack-card"><img src="/photos/photo-5.webp" alt="مراية العربية" /></div>
                <div class="gallery-stack-card"><img src="/photos/photo-6.webp" alt="زاوية قريبة" /></div>
              </div>

              <!-- Active Caption -->
              <p id="gallery-active-caption" class="about-caption" style="font-weight: 600;"></p>

              <!-- Gallery Nav Controls -->
              <div class="gallery-controls">
                <button id="gallery-prev-btn" class="gallery-nav-btn" aria-label="السابق">
                  <svg viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <div class="gallery-indicators">
                  <span class="gallery-dot is-active"></span>
                  <span class="gallery-dot"></span>
                  <span class="gallery-dot"></span>
                  <span class="gallery-dot"></span>
                  <span class="gallery-dot"></span>
                  <span class="gallery-dot"></span>
                </div>
                <button id="gallery-next-btn" class="gallery-nav-btn" aria-label="التالي">
                  <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
              <span class="gallery-drag-hint" data-i18n="photoDragHint">اسحب أو مرر للتبديل بين الصور</span>
            </div>
          </div>
        </section>

        <!-- SECTION 3: WHAT I DO ("بعمل إيه") - EXACTLY 3 ITEMS -->
        <section id="services" class="services-section">
          <div class="container">
            <div class="section-header">
              <span class="section-tag" data-i18n="servicesTitle">بعمل إيه</span>
              <h2 class="section-title"><span class="accent-word" data-i18n="servicesTitle">بعمل إيه</span> بالظبط</h2>
              <p class="section-subtitle" data-i18n="servicesSubtitle">التركيز على الأساسيات بجودة عالية واهتمام بالتفاصيل</p>
            </div>

            <div class="services-grid">
              <!-- Item 1: Designing websites -->
              <div class="service-card">
                <div class="service-number">01</div>
                <h3 class="service-card-title" data-i18n="service1Title">تصميم مواقع</h3>
                <p class="service-card-desc" data-i18n="service1Desc">
                  تصميم واجهات مستخدم فريدة تركز على الهوية وتجربة المستخدم وسهولة الاستخدام وجمال التفاصيل.
                </p>
              </div>

              <!-- Item 2: Building websites with animation and 3D -->
              <div class="service-card">
                <div class="service-number">02</div>
                <h3 class="service-card-title" data-i18n="service2Title">برمجة مواقع بأنيميشن و3D</h3>
                <p class="service-card-desc" data-i18n="service2Desc">
                  تطوير تفاعلي متقدم باستخدام تقنيات الويب الحديثة وحركات سلسة ثلاثية الأبعاد تمنح الموقع حيوية.
                </p>
              </div>

              <!-- Item 3: Fixing and customizing existing sites -->
              <div class="service-card">
                <div class="service-number">03</div>
                <h3 class="service-card-title" data-i18n="service3Title">تعديل وتطوير مواقع موجودة</h3>
                <p class="service-card-desc" data-i18n="service3Desc">
                  حل المشاكل التقنية، تحسين سرعة التصفح، وتخصيص وتطوير مزايا إضافية لموقعك الحالي.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 4: MY WORK ("شغلي") - ONE LARGE CARD TO 7P STUDIO -->
        <section id="work" class="work-section">
          <div class="container">
            <div class="section-header">
              <span class="section-tag" data-i18n="workTitle">شغلي</span>
              <h2 class="section-title"><span class="accent-word" data-i18n="workTitle">شغلي</span> مع العملاء</h2>
              <p class="section-subtitle" data-i18n="workSubtitle">أعمالي مع العملاء وتطبيقات الويب الكاملة</p>
            </div>

            <div class="work-single-container">
              <a href="https://7pstudio.tech" target="_blank" rel="noopener noreferrer" class="work-main-card magnetic-target">
                <div class="work-card-top">
                  <span class="work-badge" data-i18n="workBadge">رابط خارجي</span>
                  <div class="work-arrow-circle">
                    <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                </div>
                <h3 class="work-main-title" data-i18n="workMainText">شغلي الكامل على 7P Studio</h3>
                <p class="work-main-desc" data-i18n="workSubtext">
                  جميع المشاريع التجارية والأعمال البرمجية للعملاء معروضة بتفاصيلها على رابط استوديو 7P.
                </p>
                <div class="work-url-tag force-ltr">
                  <span>https://7pstudio.tech</span>
                  <span>↗</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        <!-- SECTION 5: CONTACT ("تواصل") -->
        <section id="contact" class="contact-section">
          <div class="container">
            <div class="section-header">
              <span class="section-tag" data-i18n="contactTitle">تواصل</span>
              <h2 class="section-title"><span class="accent-word" data-i18n="contactTitle">تواصل</span> معايا</h2>
              <p class="section-subtitle" data-i18n="contactSubtitle">تقدر تراسلني في أي وقت لمناقشة فكرة أو مشروع جديد</p>
            </div>

            <div class="contact-grid">
              <!-- WhatsApp Card -->
              <div class="contact-card">
                <span class="contact-card-label" data-i18n="contactWhatsappLabel">واتساب</span>
                <span id="contact-val-phone" class="contact-card-value force-ltr" data-i18n="contactWhatsappValue">01221576360</span>
                <div class="contact-card-actions">
                  <button class="copy-btn" data-copy-target="contact-val-phone">
                    <span data-i18n="copyBtn">نسخ</span>
                  </button>
                  <a href="https://wa.me/201221576360" target="_blank" rel="noopener noreferrer" class="contact-link-btn force-ltr">
                    <span>wa.me</span> <span>↗</span>
                  </a>
                </div>
              </div>

              <!-- Email Card -->
              <div class="contact-card">
                <span class="contact-card-label" data-i18n="contactEmailLabel">البريد الإلكتروني</span>
                <span id="contact-val-email" class="contact-card-value force-ltr" data-i18n="contactEmailValue">om058166@gmail.com</span>
                <div class="contact-card-actions">
                  <button class="copy-btn" data-copy-target="contact-val-email">
                    <span data-i18n="copyBtn">نسخ</span>
                  </button>
                  <a href="mailto:om058166@gmail.com" class="contact-link-btn">
                    <span>mail</span> <span>↗</span>
                  </a>
                </div>
              </div>

              <!-- Instagram Card -->
              <div class="contact-card">
                <span class="contact-card-label" data-i18n="contactInstaLabel">انستجرام</span>
                <span id="contact-val-insta" class="contact-card-value force-ltr" data-i18n="contactInstaValue">@omar_thegratt</span>
                <div class="contact-card-actions">
                  <button class="copy-btn" data-copy-target="contact-val-insta">
                    <span data-i18n="copyBtn">نسخ</span>
                  </button>
                  <a href="https://instagram.com/omar_thegratt" target="_blank" rel="noopener noreferrer" class="contact-link-btn force-ltr">
                    <span>instagram</span> <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- FOOTER -->
      <footer>
        <div class="container">
          <div class="footer-content">
            <span class="footer-copy">© 2026 <span data-i18n="footerRights">عمر يحيى — جميع الحقوق محفوظة</span></span>
            <button id="back-to-top-btn" class="back-to-top-btn" data-i18n="backToTop">إلى الأعلى ↑</button>
          </div>
        </div>
      </footer>
    </div>

    <!-- TOAST NOTICE -->
    <div id="toast-notice" class="toast-notice" role="alert">تم النسخ بنجاح!</div>

    <!-- MAIN JAVASCRIPT BUNDLE -->
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`;

fs.writeFileSync(path.join(rootDir, 'index.html'), indexHtmlContent, 'utf8');
console.log('1. index.html written successfully.');

// 2. Write src/main.js
const mainJsContent = `/**
 * ==========================================================================
 * OMAR YAHIA — PERSONAL PORTFOLIO MAIN ENTRYPOINT
 * Tech Stack: Vite + Three.js + GSAP (ScrollTrigger) + Lenis
 * Visual Identity: Warm off-white #FBF8F4, Orange #E8552B, Near-Black #14110F
 * ==========================================================================
 */

import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initLanguage, toggleLanguage } from './utils/i18n.js';
import { MasterIntro } from './intro/masterIntro.js';
import { HeroCard3D } from './3d/heroCard3D.js';
import { GalleryCarousel } from './motion/galleryCarousel.js';
import {
  initSmoothScroll,
  initMagneticButtons,
  initCopyButtons,
  initBackToTop,
  initMobileMenu,
  initHeaderScroll
} from './motion/interactions.js';

gsap.registerPlugin(ScrollTrigger);
window.gsap = gsap;

let heroCardInstance = null;
let galleryInstance = null;
let masterIntroInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Bilingual Language System (Arabic RTL Default)
  initLanguage();

  // 2. Setup Language Toggle Buttons
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleLanguage();
    });
  }
  const mobileLangBtn = document.getElementById('mobile-lang-toggle-btn');
  if (mobileLangBtn) {
    mobileLangBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleLanguage();
    });
  }

  // 3. Initialize Smooth Scrolling (Lenis)
  const lenis = initSmoothScroll();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 4. Initialize UI Interactions
  initMagneticButtons();
  initCopyButtons();
  initBackToTop();
  initMobileMenu();
  initHeaderScroll();

  // 5. Initialize Photo Gallery 3D Stack / Carousel
  const galleryWrapper = document.getElementById('gallery-stack');
  if (galleryWrapper) {
    galleryInstance = new GalleryCarousel(galleryWrapper);
    window.galleryInstance = galleryInstance;
  }

  // 6. Initialize Master Intro (plays once per session)
  const intro = new MasterIntro({
    onComplete: () => {
      initHeroCenterpiece();
      initScrollAnimations();
    }
  });
  masterIntroInstance = intro;
  window.masterIntroInstance = intro;

  // If intro completed immediately (e.g. already seen or reduced motion)
  if (intro.hasCompleted) {
    initHeroCenterpiece();
    initScrollAnimations();
  }
});

/**
 * Initialize Interactive 3D Hero Centerpiece
 */
function initHeroCenterpiece() {
  if (heroCardInstance) return;

  const canvas = document.getElementById('hero-3d-canvas');
  const container = document.getElementById('hero-3d-card');

  if (canvas && container) {
    heroCardInstance = new HeroCard3D(canvas, container);
    window.heroCardInstance = heroCardInstance;
  }
}

/**
 * ScrollTrigger Animations for sections below the hero
 */
function initScrollAnimations() {
  const sections = document.querySelectorAll('section');

  sections.forEach(sec => {
    gsap.fromTo(sec.querySelectorAll('.section-header, .about-bio-card, .service-card, .work-main-card, .contact-card'),
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sec,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}
`;

fs.writeFileSync(path.join(rootDir, 'src/main.js'), mainJsContent, 'utf8');
console.log('2. src/main.js written successfully.');
`;

fs.writeFileSync(path.join(__dirname, 'buildSiteFiles.cjs'), content, 'utf8');
console.log('buildSiteFiles.cjs written.');
