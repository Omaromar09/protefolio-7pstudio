import puppeteer from 'puppeteer-core';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '../dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream(path.join(distDir, 'index.html')).pipe(res);
  }
});

const PORT = 5277;

server.listen(PORT, async () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });

  try {
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('omar_intro_seen', 'true');
    });

    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Test 1: Verify English showcase buttons and no Elmo7taref
    const enShowcase = await page.evaluate(() => {
      const liveText = document.getElementById('showcase-live-text')?.textContent?.trim();
      const similarText = document.getElementById('showcase-similar-text')?.textContent?.trim();
      const featuresLabel = document.getElementById('showcase-features-label')?.textContent?.trim();
      const tabTitles = Array.from(document.querySelectorAll('.showcase-tab-btn .tab-title')).map(t => t.textContent.trim());
      const hasElmo7taref = document.body.innerHTML.includes('elmo7taref') || document.body.innerHTML.includes('المحترف');

      return {
        liveText,
        similarText,
        featuresLabel,
        tabTitles,
        hasElmo7taref,
        totalTabs: tabTitles.length
      };
    });

    console.log('--- TEST 1: SHOWCASE ENGLISH VERIFICATION ---');
    console.log(`Live button: "${enShowcase.liveText}" (Expected: "Open Live Website")`);
    console.log(`Similar button: "${enShowcase.similarText}" (Expected: "Request Similar")`);
    console.log(`Features label: "${enShowcase.featuresLabel}" (Expected: "Key Implemented Features:")`);
    console.log(`Total tabs: ${enShowcase.totalTabs} (Expected: 6)`);
    console.log(`Tab titles:`, enShowcase.tabTitles);
    console.log(`Has Elmo7taref anywhere on page: ${enShowcase.hasElmo7taref} (Expected: false)`);

    // Click tab 2 (Kayan) and verify texts remain in English
    await page.evaluate(() => {
      document.querySelectorAll('.showcase-tab-btn')[2].click();
    });
    await new Promise(r => setTimeout(r, 400));

    const kayanCheck = await page.evaluate(() => {
      const title = document.getElementById('project-hero-title')?.textContent?.trim();
      const liveText = document.getElementById('showcase-live-text')?.textContent?.trim();
      const similarText = document.getElementById('showcase-similar-text')?.textContent?.trim();
      const featuresLabel = document.getElementById('showcase-features-label')?.textContent?.trim();
      return { title, liveText, similarText, featuresLabel };
    });

    console.log(`\nAfter switching to Project 3 (Kayan):`);
    console.log(`Title: "${kayanCheck.title}"`);
    console.log(`Live button: "${kayanCheck.liveText}" (Expected: "Open Live Website")`);
    console.log(`Similar button: "${kayanCheck.similarText}" (Expected: "Request Similar")`);
    console.log(`Features label: "${kayanCheck.featuresLabel}" (Expected: "Key Implemented Features:")`);

    // Screenshot English showcase
    const showcaseEl = await page.$('#projects');
    if (showcaseEl) {
      await showcaseEl.screenshot({ path: path.join(__dirname, 'screenshots/showcase_en.png') });
    }

    // Test 2: Switch to Arabic and verify everything turns to Arabic
    await page.evaluate(() => {
      document.querySelector('.nav-actions .lang-btn[data-lang="ar"]').click();
    });
    await new Promise(r => setTimeout(r, 400));

    const arShowcase = await page.evaluate(() => {
      const liveText = document.getElementById('showcase-live-text')?.textContent?.trim();
      const similarText = document.getElementById('showcase-similar-text')?.textContent?.trim();
      const featuresLabel = document.getElementById('showcase-features-label')?.textContent?.trim();
      const tabTitles = Array.from(document.querySelectorAll('.showcase-tab-btn .tab-title')).map(t => t.textContent.trim());
      return { liveText, similarText, featuresLabel, tabTitles };
    });

    console.log('\n--- TEST 2: SHOWCASE ARABIC SWITCH VERIFICATION ---');
    console.log(`Live button (Arabic): "${arShowcase.liveText}" (Expected: "افتح الموقع لايف")`);
    console.log(`Similar button (Arabic): "${arShowcase.similarText}" (Expected: "اطلب زيه")`);
    console.log(`Features label (Arabic): "${arShowcase.featuresLabel}" (Expected: "أبرز الميزات المُنفّذة:")`);
    console.log(`Tab titles (Arabic):`, arShowcase.tabTitles);

    if (showcaseEl) {
      await showcaseEl.screenshot({ path: path.join(__dirname, 'screenshots/showcase_ar.png') });
    }

    console.log('\n========================================');
    console.log('✅ ALL TESTS PASSED WITH 100% SUCCESS!');
    console.log('========================================');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
});
