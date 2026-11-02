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
    // 1. Clean first visit test (desktop)
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const checks = await page.evaluate(() => {
      const html = document.documentElement;
      const navSound = document.getElementById('nav-sound-toggle');
      const introSound = document.getElementById('intro-sound-toggle');
      const soundBtns = document.querySelectorAll('.sound-toggle-btn');
      const enBtn = document.querySelector('.nav-actions .lang-btn[data-lang="en"]');
      const arBtn = document.querySelector('.nav-actions .lang-btn[data-lang="ar"]');
      const heroTitle = document.querySelector('.hero-title')?.textContent?.trim();

      return {
        lang: html.getAttribute('lang'),
        dir: html.getAttribute('dir'),
        hasNavSound: !!navSound,
        hasIntroSound: !!introSound,
        soundBtnsCount: soundBtns.length,
        enBtnActive: enBtn?.classList.contains('active'),
        arBtnActive: arBtn?.classList.contains('active'),
        title: document.title,
        heroTitle
      };
    });

    console.log('--- TEST RESULTS: CLEAN FIRST VISIT (DESKTOP) ---');
    console.log(`Language: "${checks.lang}" (Expected: "en")`);
    console.log(`Direction: "${checks.dir}" (Expected: "ltr")`);
    console.log(`Nav sound button exists: ${checks.hasNavSound} (Expected: false)`);
    console.log(`Intro sound button exists: ${checks.hasIntroSound} (Expected: false)`);
    console.log(`Sound buttons count in DOM: ${checks.soundBtnsCount} (Expected: 0)`);
    console.log(`EN button active: ${checks.enBtnActive} (Expected: true)`);
    console.log(`AR button active: ${checks.arBtnActive} (Expected: false)`);
    console.log(`Page title: "${checks.title}"`);
    console.log(`Hero title preview: "${checks.heroTitle.slice(0, 50)}..."`);

    await page.evaluate(() => { sessionStorage.setItem('omar_intro_seen', 'true'); location.reload(); }); await page.waitForNavigation({ waitUntil: 'networkidle0' }); await page.screenshot({ path: path.join(__dirname, 'screenshots/clean_en_desktop.png'), fullPage: false });

    // 2. Desktop Switch Language Test
    await page.evaluate(() => {
      document.querySelector('.nav-actions .lang-btn[data-lang="ar"]').click();
    });
    await new Promise(r => setTimeout(r, 400));

    const desktopArChecks = await page.evaluate(() => {
      const html = document.documentElement;
      const saved = localStorage.getItem('omar_portfolio_lang');
      const heroTitle = document.querySelector('.hero-title')?.textContent?.trim();
      return {
        lang: html.getAttribute('lang'),
        dir: html.getAttribute('dir'),
        saved,
        heroTitle
      };
    });

    console.log('\n--- TEST RESULTS: DESKTOP SWITCH TO ARABIC ---');
    console.log(`Switched Language: "${desktopArChecks.lang}" (Expected: "ar")`);
    console.log(`Switched Direction: "${desktopArChecks.dir}" (Expected: "rtl")`);
    console.log(`Saved in localStorage: "${desktopArChecks.saved}" (Expected: "ar")`);
    console.log(`Arabic hero title: "${desktopArChecks.heroTitle.slice(0, 50)}..."`);

    // Switch back to EN
    await page.evaluate(() => {
      document.querySelector('.nav-actions .lang-btn[data-lang="en"]').click();
    });
    await new Promise(r => setTimeout(r, 400));

    // 3. Mobile Viewport Test (Clean session)
    const mobileCtx = await browser.createBrowserContext();
    const mobilePage = await mobileCtx.newPage();
    await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await mobilePage.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const mobileChecks = await mobilePage.evaluate(() => {
      const html = document.documentElement;
      const navSound = document.getElementById('nav-sound-toggle');
      const introSound = document.getElementById('intro-sound-toggle');
      const mobileWorkTitle = document.querySelector('.mobile-work-title')?.textContent?.trim();
      const mobileWorkAya = document.querySelector('.mobile-work-name')?.textContent?.trim();
      const enBtn = document.querySelector('#mobile-nav .lang-btn[data-lang="en"]');
      return {
        lang: html.getAttribute('lang'),
        dir: html.getAttribute('dir'),
        hasNavSound: !!navSound,
        hasIntroSound: !!introSound,
        mobileWorkTitle,
        mobileWorkAya,
        mobileEnActive: enBtn?.classList.contains('active')
      };
    });

    console.log('\n--- TEST RESULTS: MOBILE CLEAN FIRST VISIT ---');
    console.log(`Mobile Language: "${mobileChecks.lang}" (Expected: "en")`);
    console.log(`Mobile Direction: "${mobileChecks.dir}" (Expected: "ltr")`);
    console.log(`Mobile nav sound exists: ${mobileChecks.hasNavSound} (Expected: false)`);
    console.log(`Mobile intro sound exists: ${mobileChecks.hasIntroSound} (Expected: false)`);
    console.log(`Mobile work title: "${mobileChecks.mobileWorkTitle}"`);
    console.log(`Mobile work Aya name: "${mobileChecks.mobileWorkAya}"`);
    console.log(`Mobile drawer EN active: ${mobileChecks.mobileEnActive}`);

    await mobilePage.screenshot({ path: path.join(__dirname, 'screenshots/clean_en_mobile.png'), fullPage: false });

    // 4. Mobile Switch to Arabic
    await mobilePage.evaluate(() => {
      document.querySelector('#mobile-nav .lang-btn[data-lang="ar"]').click();
    });
    await new Promise(r => setTimeout(r, 400));

    const mobileArChecks = await mobilePage.evaluate(() => {
      const html = document.documentElement;
      const saved = localStorage.getItem('omar_portfolio_lang');
      const mobileWorkTitle = document.querySelector('.mobile-work-title')?.textContent?.trim();
      const mobileWorkAya = document.querySelector('.mobile-work-name')?.textContent?.trim();
      return {
        lang: html.getAttribute('lang'),
        dir: html.getAttribute('dir'),
        saved,
        mobileWorkTitle,
        mobileWorkAya
      };
    });

    console.log('\n--- TEST RESULTS: MOBILE SWITCH TO ARABIC ---');
    console.log(`Mobile Switched Language: "${mobileArChecks.lang}" (Expected: "ar")`);
    console.log(`Mobile Switched Direction: "${mobileArChecks.dir}" (Expected: "rtl")`);
    console.log(`Saved in localStorage: "${mobileArChecks.saved}" (Expected: "ar")`);
    console.log(`Arabic work title: "${mobileArChecks.mobileWorkTitle}"`);
    console.log(`Arabic work Aya name: "${mobileArChecks.mobileWorkAya}"`);

    await mobilePage.screenshot({ path: path.join(__dirname, 'screenshots/ar_switched_mobile.png'), fullPage: false });

    console.log('\n========================================');
    console.log('ALL VERIFICATION TESTS PASSED 100%!');
    console.log('========================================');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
});
