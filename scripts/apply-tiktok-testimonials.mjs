import fs from 'node:fs';

// 1. Update src/styles/sections.css
let css = fs.readFileSync('src/styles/sections.css', 'utf8');

const targetCss = `.testimonial-stars {
  color: #F59E0B;
  display: flex;
  gap: 0.3rem;
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
}`;

const newCss = `.testimonial-card.is-tiktok-card:hover {
  border-color: rgba(254, 44, 85, 0.5);
  box-shadow: 0 12px 30px -10px rgba(254, 44, 85, 0.22);
}

.testimonial-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.testimonial-stars {
  color: #F59E0B;
  display: flex;
  gap: 0.3rem;
  font-size: 0.95rem;
  margin-bottom: 0;
}

.review-source-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
  line-height: 1.2;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  white-space: nowrap;
}

.review-source-badge.client {
  background: rgba(16, 185, 129, 0.12);
  color: #10B981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.review-source-badge.tiktok {
  background: rgba(254, 44, 85, 0.12);
  color: #FE2C55;
  border: 1px solid rgba(254, 44, 85, 0.35);
  text-decoration: none;
}

.review-source-badge.tiktok:hover {
  background: rgba(254, 44, 85, 0.22);
  border-color: #FE2C55;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(254, 44, 85, 0.25);
}

.testimonial-avatar.tiktok-ring {
  border-color: rgba(254, 44, 85, 0.45);
  background: rgba(254, 44, 85, 0.1);
  box-shadow: 0 0 10px rgba(254, 44, 85, 0.15);
}`;

css = css.replace(targetCss, newCss);
// In case of CRLF:
if (!css.includes('testimonial-top-row')) {
  css = css.replace(targetCss.replace(/\n/g, '\r\n'), newCss.replace(/\n/g, '\r\n'));
}
fs.writeFileSync('src/styles/sections.css', css, 'utf8');
console.log('Updated sections.css');

// 2. Update src/utils/i18n.js
let i18n = fs.readFileSync('src/utils/i18n.js', 'utf8');

// Arabic keys
i18n = i18n.replace(
  "testimonialsBadge: 'آراء العملاء',",
  "testimonialsBadge: 'آراء العملاء ومجتمع تيك توك',"
);
i18n = i18n.replace(
  "testimonialsTitle: 'كلام من <span class=\"highlight\">أصحاب المشاريع</span>',",
  "testimonialsTitle: 'كلام من <span class=\"highlight\">أصحاب المشاريع وفيديوهات تيك توك</span>',"
);
i18n = i18n.replace(
  "testimonialsDesc: 'تجارب حقيقية لعملاء اشتغلنا سوا وطلعنا بمواقع لايف ناجحة:',",
  "testimonialsDesc: 'تجارب حقيقية لعملاء نفذنا مشاريعهم، وتعليقات المتابعين على فيديوهات عرض الشغل على تيك توك:'"
);

// English keys
i18n = i18n.replace(
  "testimonialsBadge: 'Client Reviews',",
  "testimonialsBadge: 'Client & TikTok Reviews',"
);
i18n = i18n.replace(
  "testimonialsTitle: 'Words from <span class=\"highlight\">Business Owners</span>',",
  "testimonialsTitle: 'Words from <span class=\"highlight\">Clients & TikTok Community</span>',"
);
i18n = i18n.replace(
  "testimonialsDesc: 'Real feedback from partners we collaborated with to launch live digital experiences:',",
  "testimonialsDesc: 'Real feedback from partners we built websites for and authentic comments from our TikTok showcase videos:'"
);

fs.writeFileSync('src/utils/i18n.js', i18n, 'utf8');
console.log('Updated i18n.js');

// 3. Update index.html
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  '<span data-i18n="testimonialsBadge">آراء العملاء</span>',
  '<span data-i18n="testimonialsBadge">Client & TikTok Reviews</span>'
);
html = html.replace(
  '<h2 class="section-title" data-i18n="testimonialsTitle">\n              كلام من <span class="highlight">أصحاب المشاريع</span>\n            </h2>',
  '<h2 class="section-title" data-i18n="testimonialsTitle">\n              Words from <span class="highlight">Clients & TikTok Community</span>\n            </h2>'
);
html = html.replace(
  '<p class="section-desc" data-i18n="testimonialsDesc">\n              تجارب حقيقية لعملاء اشتغلنا سوا وطلعنا بمواقع لايف ناجحة:\n            </p>',
  '<p class="section-desc" data-i18n="testimonialsDesc">\n              Real feedback from partners we built websites for and authentic comments from our TikTok showcase videos:\n            </p>'
);

// In case CRLF:
html = html.replace(
  '<h2 class="section-title" data-i18n="testimonialsTitle">\r\n              كلام من <span class="highlight">أصحاب المشاريع</span>\r\n            </h2>',
  '<h2 class="section-title" data-i18n="testimonialsTitle">\r\n              Words from <span class="highlight">Clients & TikTok Community</span>\r\n            </h2>'
);
html = html.replace(
  '<p class="section-desc" data-i18n="testimonialsDesc">\r\n              تجارب حقيقية لعملاء اشتغلنا سوا وطلعنا بمواقع لايف ناجحة:\r\n            </p>',
  '<p class="section-desc" data-i18n="testimonialsDesc">\r\n              Real feedback from partners we built websites for and authentic comments from our TikTok showcase videos:\r\n            </p>'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated index.html');
