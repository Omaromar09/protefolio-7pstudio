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

const PORT = 5588;

server.listen(PORT, async () => {
  console.log(`Verification server running at http://localhost:${PORT}`);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    page.on('console', msg => {
      const txt = msg.text();
      if (!txt.includes('warning X4122') && !txt.includes('THREE.Clock')) {
        console.log('PAGE:', txt);
      }
    });

    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('omar_intro_seen', 'true');
    });

    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    // Scroll to #projects
    await page.evaluate(() => {
      document.getElementById('projects')?.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 600));

    const results = [];

    for (let i = 0; i < 7; i++) {
      console.log(`\nTesting Project Tab ${i}...`);
      await page.evaluate((idx) => {
        const tabs = document.querySelectorAll('.showcase-tab-btn');
        if (tabs[idx]) tabs[idx].click();
      }, i);
      await new Promise(r => setTimeout(r, 600));

      const data = await page.evaluate(() => {
        const img = document.getElementById('mockup-screen-img');
        const urlText = document.getElementById('laptop-url-text')?.textContent.trim();
        const title = document.getElementById('project-hero-title')?.textContent.trim();
        const currNum = document.getElementById('project-curr-num')?.textContent.trim();
        return {
          title,
          urlText,
          currNum,
          src: img?.src,
          naturalWidth: img?.naturalWidth,
          naturalHeight: img?.naturalHeight
        };
      });

      console.log(`Project ${i} Info:`, data);
      results.push(data);

      const frame = await page.$('.device-laptop-frame');
      if (frame) {
        await frame.screenshot({ path: `scripts/screenshots/verified-proj-${i}.png` });
      }
    }

    console.log('\n--- Testing Next Button Navigation ---');
    await page.click('#showcase-next-btn');
    await new Promise(r => setTimeout(r, 600));
    const afterNext = await page.evaluate(() => ({
      title: document.getElementById('project-hero-title')?.textContent.trim(),
      currNum: document.getElementById('project-curr-num')?.textContent.trim(),
      src: document.getElementById('mockup-screen-img')?.src
    }));
    console.log('After Next Button click:', afterNext);

    console.log('\n--- Testing Mobile View (390px) & Touch Swipe ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await page.evaluate(() => {
      document.getElementById('projects')?.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 600));

    // Mobile screenshot on project 0
    await page.evaluate(() => {
      document.querySelectorAll('.showcase-tab-btn')[0].click();
    });
    await new Promise(r => setTimeout(r, 600));

    const mobileStage = await page.$('.showcase-mockup-stage');
    if (mobileStage) {
      await mobileStage.screenshot({ path: 'scripts/screenshots/verified-mobile-proj-0.png' });
    }

    // Touch swipe left on mobile
    console.log('Simulating Touch Swipe on Mobile...');
    await page.evaluate(() => {
      const shell = document.getElementById('showcase-shell');
      if (shell) {
        shell.dispatchEvent(new TouchEvent('touchstart', {
          touches: [{ clientX: 300, clientY: 400 }]
        }));
        shell.dispatchEvent(new TouchEvent('touchend', {
          changedTouches: [{ clientX: 100, clientY: 400 }]
        }));
      }
    });
    await new Promise(r => setTimeout(r, 700));

    const afterSwipe = await page.evaluate(() => ({
      title: document.getElementById('project-hero-title')?.textContent.trim(),
      currNum: document.getElementById('project-curr-num')?.textContent.trim(),
      src: document.getElementById('mockup-screen-img')?.src
    }));
    console.log('After Mobile Swipe:', afterSwipe);

    if (mobileStage) {
      await mobileStage.screenshot({ path: 'scripts/screenshots/verified-mobile-after-swipe.png' });
    }

    // Summary assertions
    const allImagesUnique = new Set(results.map(r => r.src)).size === 7;
    const allImagesLoaded = results.every(r => r.naturalWidth > 0);
    console.log('\n--- FINAL VERIFICATION RESULTS ---');
    console.log('All 7 images unique:', allImagesUnique);
    console.log('All 7 images successfully loaded (naturalWidth > 0):', allImagesLoaded);
    if (!allImagesUnique || !allImagesLoaded) {
      throw new Error('Verification failed: Images not unique or failed to load!');
    }
    console.log('ALL CHECKS PASSED WITH 100% SUCCESS!');

  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
});
