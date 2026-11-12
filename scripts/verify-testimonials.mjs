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
  '.jpeg': 'image/jpeg',
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

const PORT = 5678;

server.listen(PORT, async () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('omar_intro_seen', 'true');
    });

    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    // Scroll to testimonials
    await page.evaluate(() => {
      document.getElementById('testimonials')?.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 1000));

    const sectionVisible = await page.$eval('#testimonials', el => window.getComputedStyle(el).display !== 'none');
    console.log('Testimonials section display != none:', sectionVisible);

    const cardsCount = await page.$$eval('.testimonial-card', els => els.length);
    console.log('Testimonials card count:', cardsCount);

    const cardsData = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.testimonial-card')).map(card => ({
        name: card.querySelector('.testimonial-name')?.textContent.trim(),
        biz: card.querySelector('.testimonial-biz')?.textContent.trim(),
        badge: card.querySelector('.review-source-badge')?.textContent.trim(),
        quote: card.querySelector('.testimonial-quote')?.textContent.trim().slice(0, 45) + '...',
        hasAvatarImg: !!card.querySelector('.testimonial-avatar img')
      }));
    });
    console.log('Cards summary:\n', JSON.stringify(cardsData, null, 2));

    // Capture desktop screenshot
    const testimonialsElem = await page.$('#testimonials');
    if (testimonialsElem) {
      await testimonialsElem.screenshot({ path: 'scripts/screenshots/testimonials-desktop-en.png' });
    }

    // Switch to Arabic
    console.log('Switching to Arabic...');
    await page.evaluate(() => {
      const arBtn = document.getElementById('lang-toggle-btn') || document.querySelector('.lang-btn');
      if (arBtn) arBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    if (testimonialsElem) {
      await testimonialsElem.screenshot({ path: 'scripts/screenshots/testimonials-desktop-ar.png' });
    }

    // Test mobile view
    console.log('Testing mobile view...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await page.evaluate(() => {
      document.getElementById('testimonials')?.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 1000));

    const mobileElem = await page.$('#testimonials');
    if (mobileElem) {
      await mobileElem.screenshot({ path: 'scripts/screenshots/testimonials-mobile-ar.png' });
    }

    console.log('Verification completed successfully!');

  } catch (e) {
    console.error('Verification error:', e);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
});
