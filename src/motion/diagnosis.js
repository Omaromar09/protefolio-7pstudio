// ==========================================================================
// 7P STUDIO — QUICK DIAGNOSIS TOOL ("شخّص موقعك في دقيقة")
// 5-Question Lead Generation Quiz with Dynamic Recommendation & WhatsApp URL
// ==========================================================================

import { getLanguage } from '../utils/i18n.js';
import { fireSuccessConfetti } from '../utils/confetti.js';

const QUIZ_QUESTIONS = [
  {
    id: 'current_site',
    title: {
      ar: '1. هل عندك موقع حالياً لبيزنسك أو فكرتك؟',
      en: '1. Do you currently have a website for your business?'
    },
    options: [
      { id: 'none', label: { ar: 'معنديش خالص، وعايز أبدأ موقع جديد من الصفر 🚀', en: 'No, I want to build a brand new site from scratch 🚀' }, score: 'new' },
      { id: 'old', label: { ar: 'عندي موقع بس قديم وشكله مش بيجيب عملاء 📉', en: 'Yes, but it is outdated and does not convert 📉' }, score: 'revamp' },
      { id: 'buggy', label: { ar: 'عندي موقع بس بطيء وفيه مشاكل وباجات ⚠️', en: 'Yes, but it has bugs and slow performance ⚠️' }, score: 'fix' }
    ]
  },
  {
    id: 'mobile_friendly',
    title: {
      ar: '2. لما بتفتح الموقع من الموبايل، التجربة عاملة إزاي؟',
      en: '2. How does the site look and feel on mobile?'
    },
    options: [
      { id: 'broken', label: { ar: 'الكلام متلخبط وأزرار مش شغالة ومش متجاوب 📱❌', en: 'Broken layout, misaligned buttons, not responsive 📱❌' }, score: 'fix' },
      { id: 'average', label: { ar: 'شغال بالعافية بس مش مريح ولا سلس 😐', en: 'Barely works, clunky and uncomfortable 😐' }, score: 'revamp' },
      { id: 'new_needed', label: { ar: 'معنديش لسه وعايز أهم حاجة يكون صاروخ على الموبايل ⚡', en: 'Not built yet; I need a mobile-first speed rocket ⚡' }, score: 'new' }
    ]
  },
  {
    id: 'speed',
    title: {
      ar: '3. سرعة التحميل وتصفح الصفحات:',
      en: '3. Page load speed and loading times:'
    },
    options: [
      { id: 'very_slow', label: { ar: 'بطيء جداً والزبون بيمشي قبل ما يشوف المنتجات ⏳', en: 'Very slow, clients bounce before seeing anything ⏳' }, score: 'fix' },
      { id: 'acceptable', label: { ar: 'متوسط بس الصور تقيلة والأنيميشن بيقطّع 🐌', en: 'Moderate, but images are heavy and stuttering 🐌' }, score: 'revamp' },
      { id: 'rocket', label: { ar: 'عايز موقع بأعلى كفاءة يفتح في ثانية واحدة ⚡', en: 'I want an ultra-optimized site loading under 1.5s ⚡' }, score: 'new' }
    ]
  },
  {
    id: 'goal',
    title: {
      ar: '4. هدفك الأساسي من الموقع إيه؟',
      en: '4. What is your primary objective?'
    },
    options: [
      { id: 'ecommerce', label: { ar: 'متجر وسلة طلبات مباشرة على الواتساب 🛒', en: 'E-commerce store with direct WhatsApp checkout 🛒' }, score: 'store' },
      { id: 'lead_gen', label: { ar: 'صفحة هبوط تسويقية لزيادة العملاء والطلبات 🎯', en: 'High-converting landing page for lead generation 🎯' }, score: 'landing' },
      { id: 'corporate', label: { ar: 'موقع بيزنس / منيو / مساحة عمل وحجوزات 🏢', en: 'Corporate presence, QR menu, or booking hub 🏢' }, score: 'corporate' }
    ]
  },
  {
    id: 'assets',
    title: {
      ar: '5. هل جاهز باللوجو والصور والمحتوى؟',
      en: '5. Do you have your logo, photos, and copy ready?'
    },
    options: [
      { id: 'ready', label: { ar: 'جاهز تماماً باللوجو والتفاصيل ونقدر نبدأ فوراً ✅', en: 'Ready with logo and photos, let\'s launch immediately ✅' }, score: 'ready' },
      { id: 'partial', label: { ar: 'معايا فكرة وصور ومحتاج مساعدة في ترتيب المحتوى 📝', en: 'I have raw ideas, need guidance structuring copy 📝' }, score: 'assist' },
      { id: 'need_all', label: { ar: 'محتاج استوديو 7P يجهّز معايا كل التفاصيل من الألف للياء 🎨', en: 'Need 7P Studio to assist from concept to execution 🎨' }, score: 'full' }
    ]
  }
];

export function initQuickDiagnosis() {
  const mount = document.getElementById('diagnosis-mount');
  if (!mount) return;

  let currentStep = 0;
  const userAnswers = {};

  function renderQuizStep() {
    const lang = getLanguage();
    const q = QUIZ_QUESTIONS[currentStep];
    const isLast = currentStep === QUIZ_QUESTIONS.length - 1;

    mount.innerHTML = `
      <div class="diagnosis-card chamfer-card">
        <div class="diagnosis-progress-bar">
          <div class="diagnosis-progress-fill" style="width: ${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%"></div>
        </div>

        <div class="diagnosis-header">
          <div class="diagnosis-step-pill">
            <span class="step-num numeral">${currentStep + 1}</span> / ${QUIZ_QUESTIONS.length}
          </div>
          <h3 class="diagnosis-question-title">${q.title[lang] || q.title.ar}</h3>
          <p class="diagnosis-question-sub">${lang === 'ar' ? 'اختر الإجابة الأقرب لوضعك الحالي:' : 'Select the option closest to your situation:'}</p>
        </div>

        <div class="diagnosis-options-grid">
          ${q.options.map(opt => `
            <button type="button" 
                    class="diagnosis-opt-btn ${userAnswers[q.id]?.id === opt.id ? 'is-selected' : ''}" 
                    data-opt-id="${opt.id}" 
                    data-opt-text="${opt.label[lang] || opt.label.ar}">
              <span class="opt-indicator"></span>
              <span class="opt-label">${opt.label[lang] || opt.label.ar}</span>
            </button>
          `).join('')}
        </div>

        <div class="diagnosis-footer">
          ${currentStep > 0 ? `
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

    // Bind option selection
    mount.querySelectorAll('.diagnosis-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        mount.querySelectorAll('.diagnosis-opt-btn').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');

        const optId = btn.getAttribute('data-opt-id');
        const optText = btn.getAttribute('data-opt-text');
        userAnswers[q.id] = { id: optId, text: optText };

        const nextBtn = document.getElementById('quiz-next-btn');
        if (nextBtn) nextBtn.disabled = false;
      });
    });

    // Next / Finish
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!userAnswers[q.id]) return;
        if (isLast) {
          showDiagnosisResult(mount, userAnswers);
        } else {
          currentStep++;
          renderQuizStep();
        }
      });
    }

    // Back
    const backBtn = document.getElementById('quiz-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (currentStep > 0) {
          currentStep--;
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

function showDiagnosisResult(mount, answers) {
  const lang = getLanguage();
  fireSuccessConfetti();

  // Determine diagnosis recommendation
  let titleAr = 'تحتاج موقع جديد فائق السرعة متوافق مع الموبايل 🚀';
  let titleEn = 'You need a fresh, high-speed mobile-first website 🚀';
  let descAr = 'بناءً على إجاباتك، أفضل خيار لبيزنسك هو بناء موقع عصري مربوط بواتساب وسريع التصفح لتفادي خسارة الزبائن وزيادة المبيعات.';
  let descEn = 'Based on your answers, building a modern, high-converting website synced with WhatsApp will maximize your sales and prevent client drops.';

  if (answers.current_site?.id === 'buggy' || answers.mobile_friendly?.id === 'broken') {
    titleAr = 'تحتاج صيانة فورية، تسريع أداء، وتعديل متجاوب للموبايل ⚡';
    titleEn = 'You need instant bug fixing, speed boosting, and mobile optimization ⚡';
    descAr = 'موقعك الحالي بيخسر زوار بسبب البطء أو عيوب الموبايل. نقدر نصلح الكود ونرفع سرعته ونظبط شكله بالكامل بدون الحاجة لإعادة بنائه من الصفر.';
    descEn = 'Your current site is leaking visitors due to bugs or slow load. We can repair and accelerate it without starting completely from scratch.';
  } else if (answers.goal?.id === 'ecommerce') {
    titleAr = 'تحتاج متجر إلكتروني خفيف بسلة طلبات وفاتورة واتساب 🛒';
    titleEn = 'You need an e-commerce catalog with instant WhatsApp orders 🛒';
    descAr = 'عرض المنتجات بطريقة شيك وسلسة مع إمكانية إرسال الأوردر والفاتورة مباشرة إلى واتساب متجرك هي أفضل وأسرع طريقة لتحقيق مبيعات حقيقية.';
    descEn = 'A lightweight catalog where customers place direct WhatsApp orders will dramatically improve checkout conversion.';
  }

  // Construct WhatsApp prefilled message
  const summaryLines = [
    lang === 'ar' ? `📋 *نتيجة تشخيص موقعي من 7P Studio:*` : `📋 *7P Studio Website Diagnosis Result:*`,
    `🎯 ${lang === 'ar' ? titleAr : titleEn}`,
    `\n📝 *إجابات التشخيص:*`,
    `1. حالة الموقع: ${answers.current_site?.text || ''}`,
    `2. تجربة الموبايل: ${answers.mobile_friendly?.text || ''}`,
    `3. السرعة: ${answers.speed?.text || ''}`,
    `4. الهدف: ${answers.goal?.text || ''}`,
    `5. الجاهزية: ${answers.assets?.text || ''}`,
    `\n---\nمساء الخير يا عمر ويا مصطفى، عملت اختبار التشخيص وحابب نتناقش في التنفيذ.`
  ];

  const waMsg = encodeURIComponent(summaryLines.join('\n'));
  const waUrl = `https://wa.me/201515047449?text=${waMsg}`;

  mount.innerHTML = `
    <div class="diagnosis-result-card chamfer-card">
      <div class="result-badge">
        <i class="fa-solid fa-circle-check"></i>
        <span>${lang === 'ar' ? 'اكتمل التشخيص بنجاح' : 'Diagnosis Complete'}</span>
      </div>

      <h3 class="result-title">${lang === 'ar' ? titleAr : titleEn}</h3>
      <p class="result-desc">${lang === 'ar' ? descAr : descEn}</p>

      <div class="result-checklist">
        <div class="check-item"><i class="fa-solid fa-bolt" style="color: var(--accent-cyan)"></i> <span>${lang === 'ar' ? 'فحص كامل للأداء والسرعة' : 'Complete performance & speed audit'}</span></div>
        <div class="check-item"><i class="fa-solid fa-mobile-screen" style="color: var(--accent-magenta)"></i> <span>${lang === 'ar' ? 'تجاوب بنسبة 100% على كافة الشاشات' : '100% responsive viewport guarantee'}</span></div>
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
