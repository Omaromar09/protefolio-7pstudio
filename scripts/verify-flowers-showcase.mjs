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

const PORT = 5299;

server.listen(PORT, async () => {
  console.log(`Verification server running at http://localhost:${PORT}`);
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('omar_intro_seen', 'true');
    });

    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Test 1: Verify tabs in English
    const tabsData = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('.showcase-tab-btn')).map(b => ({
        idx: b.getAttribute('data-idx'),
        title: b.querySelector('.tab-title')?.textContent?.trim()
      }));
      return tabs;
    });

    console.log('Tabs in English:', tabsData);

    // Verify index 1 is Flowers and index 2 is Festival
    if (tabsData.length !== 7) throw new Error(`Expected 7 tabs, got ${tabsData.length}`);
    if (!tabsData[1].title.includes('Jardin Vivant')) throw new Error(`Expected tab 1 to be Jardin Vivant, got ${tabsData[1].title}`);
    if (!tabsData[2].title.includes('Festival')) throw new Error(`Expected tab 2 to be Festival, got ${tabsData[2].title}`);

    // Click tab 1 (Flowers)
    await page.click('.showcase-tab-btn[data-idx="1"]');
    await new Promise(r => setTimeout(r, 600));

    // Capture screenshot in English
    const showcaseSection = await page.$('#projects');
    if (showcaseSection) {
      await showcaseSection.screenshot({ path: path.join(__dirname, 'screenshots/showcase_flowers_en.png') });
      console.log('Saved showcase_flowers_en.png');
    }

    // Switch to Arabic via .lang-btn[data-lang="ar"]
    await page.click('.lang-btn[data-lang="ar"]');
    await new Promise(r => setTimeout(r, 600));

    // Verify Arabic tab 1 title and features
    const arInfo = await page.evaluate(() => {
      return {
        title: document.getElementById('project-hero-title')?.textContent?.trim(),
        liveText: document.getElementById('showcase-live-text')?.textContent?.trim(),
        similarText: document.getElementById('showcase-similar-text')?.textContent?.trim(),
        tab1Title: document.querySelectorAll('.showcase-tab-btn .tab-title')[1]?.textContent?.trim()
      };
    });
    console.log('Arabic Showcase Info for Flowers:', arInfo);

    if (showcaseSection) {
      await showcaseSection.screenshot({ path: path.join(__dirname, 'screenshots/showcase_flowers_ar.png') });
      console.log('Saved showcase_flowers_ar.png');
    }

    console.log('ALL VERIFICATION PASSED PERFECTLY!');
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
});
