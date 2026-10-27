import fs from 'node:fs';
import path from 'node:path';

const FONTS_DIR = path.resolve('public/fonts');
if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

// Fonts to fetch:
// 1. Alexandria: 400, 600, 700, 800 (Arabic + Latin)
// 2. IBM Plex Sans Arabic: 400, 500, 600
// 3. Unbounded: 700, 900
// 4. JetBrains Mono: 400, 600

const families = [
  'Alexandria:wght@400;600;700;800',
  'IBM+Plex+Sans+Arabic:wght@400;500;600',
  'Unbounded:wght@700;900',
  'JetBrains+Mono:wght@400;600'
];

async function downloadFonts() {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${families.join('&family=')}&display=swap`;
  console.log('Fetching CSS from:', cssUrl);

  const res = await fetch(cssUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch CSS: ${res.statusText}`);
  }

  let css = await res.text();
  console.log('Got CSS, length:', css.length);

  // Parse font urls
  const fontUrlRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^\)]+)\)/g;
  let match;
  const urls = new Set();
  while ((match = fontUrlRegex.exec(css)) !== null) {
    urls.add(match[1]);
  }

  console.log(`Found ${urls.size} font files to download.`);
  let counter = 0;
  const urlToLocalMap = new Map();

  for (const fontUrl of urls) {
    const filename = path.basename(new URL(fontUrl).pathname);
    const destPath = path.join(FONTS_DIR, filename);
    if (!fs.existsSync(destPath)) {
      console.log(`Downloading ${filename}...`);
      const fontRes = await fetch(fontUrl);
      if (fontRes.ok) {
        const buffer = await fontRes.arrayBuffer();
        fs.writeFileSync(destPath, Buffer.from(buffer));
      } else {
        console.error(`Failed to download ${fontUrl}`);
      }
    }
    urlToLocalMap.set(fontUrl, `/fonts/${filename}`);
    counter++;
  }

  // Rewrite font URLs in CSS to local paths
  for (const [remoteUrl, localUrl] of urlToLocalMap.entries()) {
    css = css.replaceAll(remoteUrl, localUrl);
  }

  fs.writeFileSync('src/styles/fonts.css', css, 'utf-8');
  console.log('Wrote local src/styles/fonts.css with self-hosted fonts successfully!');
}

downloadFonts().catch(err => {
  console.error('Error downloading fonts:', err);
  process.exit(1);
});
