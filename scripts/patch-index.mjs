import fs from 'node:fs';

let content = fs.readFileSync('index.html', 'utf8');

const targetFont = '<link rel="preload" href="/fonts/Qw3NZRtWPQCuHme67tEYUIx3Kh0PHR9N6YPO_-CRXMR5Kw.woff2" as="font" type="font/woff2" crossorigin />';
const prefetchTags = `${targetFont}

    <!-- Performance: Prefetch Project Showcase Images for Instant 0ms Switching -->
    <link rel="prefetch" as="image" href="/projects/flowers-preview.jpg" />
    <link rel="prefetch" as="image" href="/projects/festival-preview.jpg" />
    <link rel="prefetch" as="image" href="/projects/kayan-preview.jpg" />
    <link rel="prefetch" as="image" href="/projects/elveranda.jpg" />
    <link rel="prefetch" as="image" href="/projects/rawnaq-preview.jpg" />
    <link rel="prefetch" as="image" href="/projects/xops-preview.jpg" />`;

if (!content.includes('flowers-preview.jpg')) {
  content = content.replace(targetFont, prefetchTags);
}

// Also fix initial arrow icons in English LTR
content = content.replace(
  '<i class="fa-solid fa-chevron-right"></i>\n            </button>\n            <button type="button" class="arrow-btn" id="showcase-next-btn" aria-label="Next Project">\n              <i class="fa-solid fa-chevron-left"></i>',
  '<i class="fa-solid fa-chevron-left"></i>\n            </button>\n            <button type="button" class="arrow-btn" id="showcase-next-btn" aria-label="Next Project">\n              <i class="fa-solid fa-chevron-right"></i>'
);

// In case CRLF:
content = content.replace(
  '<i class="fa-solid fa-chevron-right"></i>\r\n            </button>\r\n            <button type="button" class="arrow-btn" id="showcase-next-btn" aria-label="Next Project">\r\n              <i class="fa-solid fa-chevron-left"></i>',
  '<i class="fa-solid fa-chevron-left"></i>\r\n            </button>\r\n            <button type="button" class="arrow-btn" id="showcase-next-btn" aria-label="Next Project">\r\n              <i class="fa-solid fa-chevron-right"></i>'
);

fs.writeFileSync('index.html', content, 'utf8');
console.log('Successfully patched index.html!');
