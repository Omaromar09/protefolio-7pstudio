// ==========================================================================
// 7P STUDIO — QUICK DIAGNOSIS TOOL ("شخّص موقعك في دقيقة")
// Dynamic Branching Quiz Engine: Questions adapt based on client's exact answer
// ==========================================================================

import { getLanguage } from '../utils/i18n.js';
import { fireSuccessConfetti } from '../utils/confetti.js';

// Question 1: Root Question
const ROOT_QUESTION = {
  id: 'site_status',
  title: {
    ar: '1. وضع موقعك أو فكرتك حالياً إيه؟',
    en: '1. What is the current status of your website or idea?'
  },
  options: [
    {
      id: 'no_site',
      branch: 'new',
      label: {
        ar: 'معنديش موقع خالص، وعايز أبدأ موقع جديد من الصفر 🚀',
        en: 'I don’t have a website, I want to build one from scratch 🚀'
      }
    },
    {
      id: 'outdated_site',
      branch: 'existing',
      label: {
        ar: 'عندي موقع بس قديم وشكله مش بيجيب عملاء ومحتاج تجديد شامل 📉',
        en: 'I have an outdated website that doesn’t convert visitors 📉'
      }
    },
    {
      id: 'buggy_site',
      branch: 'existing',
      label: {
        ar: 'عندي موقع بس بطيء وفيه مشاكل وباجات ومحتاج صيانة سريعة ⚠️',
        en: 'I have a website but it has bugs, errors, and slow speed ⚠️'
      }
    }
  ]
};

// Branch A: Client has NO website yet (Building from scratch)
const BRANCH_NEW_QUESTIONS = [
  {
    id: 'business_type',
    title: {
      ar: '2. إيه نوع نشاطك أو مجالك؟',
      en: '2. What is your business type or industry?'
    },
    options: [
      { id: 'store', label: { ar: 'متجر لبيع منتجات فيزيكال (أزياء، إكسسوارات، عطور...) 🛍️', en: 'E-commerce store (apparel, accessories, perfumes...) 🛍️' } },
      { id: 'food', label: { ar: 'مطعم، كافيه، أو حلواني ومحتاج منيو وطلبات 🍔', en: 'Restaurant, cafe, or pastry with smart menu 🍔' } },
      { id: 'corporate', label: { ar: 'شركة، خدمات، مكتب استشارات، أو براند شخصي 🏢', en: 'Corporate services, consulting, or personal brand 🏢' } },
      { id: 'hub', label: { ar: 'مساحة عمل، عيادة، أو نظام حجز مواعيد وغرف 📅', en: 'Coworking space, clinic, or booking system 📅' } }
    ]
  },
  {
    id: 'key_feature',
    title: {
      ar: '3. إيه أهم ميزة محتاجها في موقعك الجديد؟',
      en: '3. What is the most critical feature you need?'
    },
    options: [
      { id: 'cart_wa', label: { ar: 'سلة مشتريات وطلب أوردر مباشر على الواتساب 🛒', en: 'Instant cart with direct WhatsApp ordering 🛒' } },
      { id: 'landing_leads', label: { ar: 'صفحة هبوط تسويقية سريعة تشرح خدماتي وتجيب عملاء 🎯', en: 'High-converting landing page explaining services 🎯' }, },
      { id: 'motion_3d', label: { ar: 'لمسات 3D تفاعلية ومظهر عصري يبهر الزائر ✨', en: 'Interactive 3D touches and modern sleek UI ✨' } },
      { id: 'speed_mobile', label: { ar: 'سرعة خارقة وتجاوب 100% على كل شاشات الموبايل ⚡', en: 'Ultra-fast speed and 100% mobile perfection ⚡' } }
    ]
  },
  {
    id: 'assets_readiness',
    title: {
      ar: '4. هل جاهز باللوجو والصور والمحتوى؟',
      en: '4. Do you have your logo, photos, and copy ready?'
    },
    options: [
      { id: 'ready', label: { ar: 'معايا كل حاجة وجاهز نبدأ التنفيذ فوراً ✅', en: 'Everything is ready, let’s kick off immediately ✅' } },
      { id: 'partial', label: { ar: 'معايا صور وفكرة، ومحتاج مساعدتكم في ترتيب المحتوى 📝', en: 'I have raw photos and ideas, need help organizing 📝' } },
      { id: 'need_all', label: { ar: 'محتاج استوديو 7P يجهّز معايا كل التفاصيل من الصفر 🎨', en: 'Need 7P Studio to assist from concept to execution 🎨' } }
    ]
  },
  {
    id: 'launch_timeline',
    title: {
      ar: '5. حابب الموقع يكون شغال لايف إمتى؟',
      en: '5. When do you need the website live?'
    },
    options: [
      { id: 'urgent', label: { ar: 'في أقرب وقت ممكن (تسليم عاجل ومستعجل) ⚡', en: 'As soon as possible (urgent rush delivery) ⚡' } },
      { id: 'standard', label: { ar: 'خلال أسبوع إلى أسبوعين (الوقت القياسي) 🗓️', en: 'Within 1 to 2 weeks (standard turnaround) 🗓️' } },
      { id: 'exploring', label: { ar: 'لسه بظبط بيزنسي وبستفسر عشان أجهز نفسي 💬', en: 'Currently planning, preparing ahead of time 💬' } }
    ]
  }
];

// Branch B: Client ALREADY HAS an existing website (Needs fixes, speed boost, or redesign)
const BRANCH_EXISTING_QUESTIONS = [
  {
    id: 'pain_point',
    title: {
      ar: '2. إيه أكبر مشكلة بتواجهك في موقعك الحالي؟',
      en: '2. What is the biggest issue with your current site?'
    },
    options: [
      { id: 'slow_load', label: { ar: 'بطيء جداً في التحميل والزبون بيزهق ويمشي قبل ما يفتح ⏳', en: 'Very slow loading, clients leave before seeing items ⏳' } },
      { id: 'broken_mobile', label: { ar: 'شكله متبهدل ومش مظبوط لما بيتفتح من الموبايل 📱❌', en: 'Broken layout and unclickable buttons on mobile 📱❌' } },
      { id: 'bugs_errors', label: { ar: 'فيه أزرار وسلة مش شغالة أو أخطاء برمجية معقدة ⚠️', en: 'Broken buttons, checkout errors, or code bugs ⚠️' } },
      { id: 'low_conversion', label: { ar: 'تصميمه قديم ومش بيدي ثقة للعميل إنه يشتري 📉', en: 'Outdated look, fails to build trust or sales 📉' } }
    ]
  },
  {
    id: 'current_tech',
    title: {
      ar: '3. موقعك الحالي معمول بإيه لو تعرف؟',
      en: '3. What technology or platform is your site built on?'
    },
    options: [
      { id: 'wordpress', label: { ar: 'ووردبريس (WordPress) أو شوبيفاي / زد / سلة 🌐', en: 'WordPress, Shopify, Salla, or similar platform 🌐' } },
      { id: 'custom_code', label: { ar: 'مبرمج كود خاص (HTML / React / PHP / Node) 💻', en: 'Custom code (HTML, React, PHP, Node) 💻' } },
      { id: 'not_sure', label: { ar: 'مش متأكد من التقنية اللي اتعمل بيها ❓', en: 'Not sure what technology was used ❓' } }
    ]
  },
  {
    id: 'target_goal',
    title: {
      ar: '4. هدفك الأساسي من التعديل إيه؟',
      en: '4. What is your primary objective from revamping?'
    },
    options: [
      { id: 'fix_speed', label: { ar: 'صيانة فورية وتصليح الباجات ورفع السرعة لأعلى أداء ⚡', en: 'Fix bugs and optimize speed to top performance ⚡' } },
      { id: 'redesign_ui', label: { ar: 'إعادة تصميم كاملة (Redesign) لمظهر عصري وفخم 🎨', en: 'Full UI/UX redesign for a modern luxury look 🎨' } },
      { id: 'add_whatsapp_cart', label: { ar: 'إضافة سلة طلبات وفاتورة سريعة على الواتساب 🛒', en: 'Add automated WhatsApp cart & quick checkout 🛒' } }
    ]
  },
  {
    id: 'preferred_approach',
    title: {
      ar: '5. تفضيلك في طريقة التنفيذ:',
      en: '5. Your preferred approach:'
    },
    options: [
      { id: 'patch_existing', label: { ar: 'صيانة وتعديل على موقعي الحالي لو ينفع 🔧', en: 'Patch and optimize my existing site if possible 🔧' } },
      { id: 'fresh_rebuild', label: { ar: 'بناء موقع جديد نظيف وسريع يريحني من صداع المشاكل القديمة 🚀', en: 'Build a fresh, clean site to eliminate legacy headaches 🚀' } },
      { id: 'consult_first', label: { ar: 'عايز نصيحتكم الأفضل بعد ما تفحصوا كود الموقع 💡', en: 'I want your recommendation after you audit the site 💡' } }
    ]
  }
];

export function initQuickDiagnosis() {
  const mount = document.getElementById('diagnosis-mount');
  if (!mount) return;

  let currentStepIndex = 0; // 0 is Root, 1..4 are Branch questions
  let chosenBranch = null; // 'new' or 'existing'
  const userAnswers = {};

  function getCurrentQuestion() {
    if (currentStepIndex === 0) {
      return ROOT_QUESTION;
    }
    const questionsList = chosenBranch === 'new' ? BRANCH_NEW_QUESTIONS : BRANCH_EXISTING_QUESTIONS;
    return questionsList[currentStepIndex - 1];
  }

  function renderQuizStep() {
    const lang = getLanguage();
    const q = getCurrentQuestion();
    const totalSteps = 5;
    const isLast = currentStepIndex === totalSteps - 1;

    mount.innerHTML = `
      <div class="diagnosis-card chamfer-card">
        <div class="diagnosis-progress-bar">
          <div class="diagnosis-progress-fill" style="width: ${((currentStepIndex + 1) / totalSteps) * 100}%"></div>
        </div>

        <div class="diagnosis-header">
          <div class="diagnosis-step-pill">
            <span class="step-num numeral">${currentStepIndex + 1}</span> / ${totalSteps}
          </div>
          <h3 class="diagnosis-question-title">${q.title[lang] || q.title.ar}</h3>
          <p class="diagnosis-question-sub">${lang === 'ar' ? 'اختر الإجابة الأنسب لوضعك الحالي:' : 'Select the option closest to your situation:'}</p>
        </div>

        <div class="diagnosis-options-grid">
          ${q.options.map(opt => `
            <button type="button" 
                    class="diagnosis-opt-btn ${userAnswers[q.id]?.id === opt.id ? 'is-selected' : ''}" 
                    data-opt-id="${opt.id}" 
                    data-opt-text="${opt.label[lang] || opt.label.ar}"
                    ${opt.branch ? `data-branch="${opt.branch}"` : ''}>
              <span class="opt-indicator"></span>
              <span class="opt-label">${opt.label[lang] || opt.label.ar}</span>
            </button>
          `).join('')}
        </div>

        <div class="diagnosis-footer">
          ${currentStepIndex > 0 ? `
            <button type="button" class="btn btn-secondary diagnosis-back-btn" id="quiz-back-btn">
              <i class="fa-solid fa-arrow-right"></i>
              <span>${lang === 'ar' ? 'السابق' : 'Back'}</span>
            </button>
          ` : '<div></div>'}

          <button type="button" class="btn btn-primary diagnosis-next-btn" id="quiz-next-btn" ${!userAnswers[q.id] ? 'disabled' : ''}>
            <span>${isLast ? (lang === 'ar' ? 'عرض النتيجة والتشخيص 🚀' : 'See Diagnosis 🚀') : (lang === 'ar' ? 'التالي' : 'Next')}</span>
            <i class="fa-solid fa-arrow-left"></i>
          </button>
        </div>
      </div>
    `;

    // Bind option click
    mount.querySelectorAll('.diagnosis-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        mount.querySelectorAll('.diagnosis-opt-btn').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');

        const optId = btn.getAttribute('data-opt-id');
        const optText = btn.getAttribute('data-opt-text');
        const branchAttr = btn.getAttribute('data-branch');

        if (branchAttr) {
          chosenBranch = branchAttr;
        }

        userAnswers[q.id] = { id: optId, text: optText };

        const nextBtn = document.getElementById('quiz-next-btn');
        if (nextBtn) nextBtn.disabled = false;
      });
    });

    // Next button
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!userAnswers[q.id]) return;
        if (isLast) {
          showDiagnosisResult(mount, userAnswers, chosenBranch);
        } else {
          currentStepIndex++;
          renderQuizStep();
        }
      });
    }

    // Back button
    const backBtn = document.getElementById('quiz-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) {
          currentStepIndex--;
          renderQuizStep();
        }
      });
    }
  }

  renderQuizStep();

  window.addEventListener('languagechange', () => {
    renderQuizStep();
  });
}

function showDiagnosisResult(mount, answers, branch) {
  const lang = getLanguage();
  fireSuccessConfetti();

  let titleAr = '';
  let titleEn = '';
  let descAr = '';
  let descEn = '';

  if (branch === 'new') {
    titleAr = 'تحتاج موقع جديد فائق السرعة متوافق مع الموبايل ومربوط بواتساب 🚀';
    titleEn = 'You need a fresh, high-speed mobile-first website synced with WhatsApp 🚀';
    descAr = 'بناءً على تفاصيل بيزنسك، أفضل استراتيجية هي بناء موقع نظيف وخفيف من الصفر يركز على سهولة الطلب والتصفح المريح، بدون تعقيدات منصات بطيئة وبأعلى كفاءة.';
    descEn = 'Based on your niche, building a sleek, lightweight website from scratch focused on seamless conversion is the best path to maximize sales without slow template bloat.';
  } else {
    // Existing site branch
    if (answers.pain_point?.id === 'slow_load' || answers.target_goal?.id === 'fix_speed') {
      titleAr = 'تحتاج صيانة فورية، تسريع أكواد وصور، وضبط تجاوب الموبايل ⚡';
      titleEn = 'You need instant bug fixing, speed optimization, and mobile tuning ⚡';
      descAr = 'موقعك الحالي بيخسر زبائن بسبب بطء التحميل أو عيوب الموبايل. نقدر نعمل فحص شامل ونصلح الأكواد ونرفع السرعة لـ 95+ بدون الحاجة لإعادة بنائه من الصفر.';
      descEn = 'Your current site is losing visitors due to loading delays or mobile bugs. We can audit, repair, and optimize speed without starting over from scratch.';
    } else {
      titleAr = 'تحتاج تجديد شامل للواجهة (Redesign) مع سلة واتساب ومظهر عصري 🎨';
      titleEn = 'You need a modern UI/UX redesign with direct WhatsApp orders 🎨';
      descAr = 'تحويل موقعك القديم لواجهة فخمة وعصرية تناسب معايير 2026 مع سلة طلبات وفاتورة واتساب فورية لرفع ثقة العميل وتحويل الزيارات لمبيعات حقيقية.';
      descEn = 'Upgrading your existing site into a contemporary, trust-building storefront with automated WhatsApp ordering will dramatically increase conversion.';
    }
  }

  // Format prefilled WhatsApp message
  const lines = [
    lang === 'ar' ? `📋 *نتيجة تشخيص موقعي مع 7P Studio:*` : `📋 *7P Studio Website Diagnosis Result:*`,
    `🎯 ${lang === 'ar' ? titleAr : titleEn}`,
    `\n📝 *إجابات التشخيص:*`
  ];

  Object.values(answers).forEach((ans, i) => {
    lines.push(`${i + 1}. ${ans.text}`);
  });

  lines.push(`\n---\nمساء الخير يا عمر ويا جاد، عملت اختبار التشخيص وحابب نتناقش في التفاصيل ونبدأ.`);

  const waUrl = `https://wa.me/201515047449?text=${encodeURIComponent(lines.join('\n'))}`;

  mount.innerHTML = `
    <div class="diagnosis-result-card chamfer-card">
      <div class="result-badge">
        <i class="fa-solid fa-circle-check"></i>
        <span>${lang === 'ar' ? 'اكتمل التشخيص بنجاح' : 'Diagnosis Complete'}</span>
      </div>

      <h3 class="result-title">${lang === 'ar' ? titleAr : titleEn}</h3>
      <p class="result-desc">${lang === 'ar' ? descAr : descEn}</p>

      <div class="result-checklist">
        <div class="check-item"><i class="fa-solid fa-bolt" style="color: var(--accent-cyan)"></i> <span>${lang === 'ar' ? 'فحص كامل للأداء والسرعة وتجاوب الشاشات' : 'Complete performance & mobile audit'}</span></div>
        <div class="check-item"><i class="fa-solid fa-mobile-screen" style="color: var(--accent-magenta)"></i> <span>${lang === 'ar' ? 'تنفيذ دقيق متوافق مع الموبايل 100%' : '100% responsive viewport guarantee'}</span></div>
        <div class="check-item"><i class="fa-brands fa-whatsapp" style="color: #25D366"></i> <span>${lang === 'ar' ? 'ربط مباشر لطلبات العملاء على الواتساب' : 'Direct WhatsApp customer conversion'}</span></div>
      </div>

      <div class="result-cta-row">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary result-wa-btn">
          <i class="fa-brands fa-whatsapp"></i>
          <span>${lang === 'ar' ? 'إرسال التشخيص لواتساب ومناقشة الحل' : 'Send Diagnosis to WhatsApp & Discuss'}</span>
        </a>

        <button type="button" class="btn btn-secondary" id="quiz-restart-btn">
          <i class="fa-solid fa-rotate-left"></i>
          <span>${lang === 'ar' ? 'إعادة الفحص' : 'Retake Quiz'}</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById('quiz-restart-btn')?.addEventListener('click', () => {
    initQuickDiagnosis();
  });
}
