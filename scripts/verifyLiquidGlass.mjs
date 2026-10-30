import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '../dist');
const screenshotsDir = path.join(__dirname, 'screenshots/liquid-glass');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

const PORT = 5199;
const URL = `http://localhost:${PORT}/`;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

server.listen(PORT, async () => {
  console.log(`Test server running at ${URL}`);

  try {
    const browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
    });

    // Helper to skip intro and settle
    async function preparePage(page) {
      await page.goto(URL, { waitUntil: 'networkidle2' });
      try {
        const skipBtn = await page.waitForSelector('#intro-skip', { timeout: 2000 });
        if (skipBtn) await skipBtn.click();
      } catch (e) {}
      await new Promise(r => setTimeout(r, 600));
    }

    // ------------------------------------------------------------------------
    // 1. DESKTOP AUDIT (1440x900) - DARK & LIGHT MODES
    // ------------------------------------------------------------------------
    console.log('--- STARTING 1440x900 DESKTOP SCREENSHOTS ---');
    const pageDesktop = await browser.newPage();
    await pageDesktop.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await preparePage(pageDesktop);

    const sections = [
      { id: 'hero', name: '01-hero' },
      { id: 'projects', name: '02-projects' },
      { id: 'comparison', name: '03-comparison' },
      { id: 'diagnosis', name: '04-diagnosis' },
      { id: 'services', name: '05-services' },
      { id: 'estimator', name: '06-estimator' },
      { id: 'trust', name: '07-trust' },
      { id: 'about', name: '08-about' },
      { id: 'process', name: '09-process' },
      { id: 'contact', name: '10-contact' }
    ];

    for (const theme of ['dark', 'light']) {
      console.log(`Capturing Desktop in ${theme.toUpperCase()} mode...`);
      await pageDesktop.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('omar_theme', t);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', t === 'dark' ? '#07060C' : '#F4F2FA');
      }, theme);

      await new Promise(r => setTimeout(r, 400));

      for (const sec of sections) {
        const el = await pageDesktop.$(`#${sec.id}`);
        if (el) {
          await pageDesktop.evaluate((sId) => {
            const target = document.getElementById(sId);
            if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
          }, sec.id);
          await new Promise(r => setTimeout(r, 350));
          await pageDesktop.screenshot({
            path: path.join(screenshotsDir, `desktop-${theme}-${sec.name}.png`)
          });
        }
      }

      // Capture Header Scrolled Pill
      await pageDesktop.evaluate(() => window.scrollTo(0, 500));
      await new Promise(r => setTimeout(r, 300));
      const navbarEl = await pageDesktop.$('.navbar');
      if (navbarEl) {
        await navbarEl.screenshot({
          path: path.join(screenshotsDir, `desktop-${theme}-navbar-pill.png`)
        });
      }

      // Capture Interactive Form Focus
      const formInput = await pageDesktop.$('#form-name');
      if (formInput) {
        await formInput.focus();
        await new Promise(r => setTimeout(r, 200));
        const contactCard = await pageDesktop.$('.contact-form-card');
        if (contactCard) {
          await contactCard.screenshot({
            path: path.join(screenshotsDir, `desktop-${theme}-form-focus.png`)
          });
        }
      }

      // Capture Privacy Modal
      await pageDesktop.evaluate(() => {
        const openBtn = document.getElementById('open-privacy-btn');
        if (openBtn) openBtn.click();
      });
      await new Promise(r => setTimeout(r, 350));
      await pageDesktop.screenshot({
        path: path.join(screenshotsDir, `desktop-${theme}-privacy-modal.png`)
      });
      await pageDesktop.evaluate(() => {
        const closeBtn = document.getElementById('close-privacy-btn');
        if (closeBtn) closeBtn.click();
      });
      await new Promise(r => setTimeout(r, 300));
    }

    // ------------------------------------------------------------------------
    // 2. MOBILE AUDIT (390x844) - DARK & LIGHT MODES
    // ------------------------------------------------------------------------
    console.log('--- STARTING 390x844 MOBILE SCREENSHOTS ---');
    const pageMobile = await browser.newPage();
    await pageMobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await preparePage(pageMobile);

    for (const theme of ['dark', 'light']) {
      console.log(`Capturing Mobile in ${theme.toUpperCase()} mode...`);
      await pageMobile.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('omar_theme', t);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', t === 'dark' ? '#07060C' : '#F4F2FA');
      }, theme);

      await new Promise(r => setTimeout(r, 400));

      for (const sec of sections) {
        await pageMobile.evaluate((sId) => {
          const target = document.getElementById(sId);
          if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
        }, sec.id);
        await new Promise(r => setTimeout(r, 350));
        await pageMobile.screenshot({
          path: path.join(screenshotsDir, `mobile-${theme}-${sec.name}.png`)
        });
      }

      // Capture Mobile Sticky Mini CTA Bar
      await pageMobile.evaluate(() => window.scrollTo(0, 900));
      await new Promise(r => setTimeout(r, 400));
      await pageMobile.screenshot({
        path: path.join(screenshotsDir, `mobile-${theme}-sticky-cta.png`)
      });

      // Capture Mobile Drawer
      await pageMobile.evaluate(() => {
        const toggle = document.getElementById('menu-toggle');
        if (toggle) toggle.click();
      });
      await new Promise(r => setTimeout(r, 400));
      await pageMobile.screenshot({
        path: path.join(screenshotsDir, `mobile-${theme}-nav-drawer.png`)
      });
      await pageMobile.evaluate(() => {
        const toggle = document.getElementById('menu-toggle');
        if (toggle) toggle.click();
      });
      await new Promise(r => setTimeout(r, 300));
    }

    // ------------------------------------------------------------------------
    // 3. LANGUAGE TOGGLE (EN LTR & AR RTL AUDIT)
    // ------------------------------------------------------------------------
    console.log('--- TESTING EN LTR TOGGLE & GRADIENT MIRRORING ---');
    const pageI18n = await browser.newPage();
    await pageI18n.setViewport({ width: 1440, height: 900 });
    await preparePage(pageI18n);

    // Click EN button
    await pageI18n.evaluate(() => {
      const enBtn = document.querySelector('.lang-btn[data-lang="en"]');
      if (enBtn) enBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    const isEn = await pageI18n.evaluate(() => document.documentElement.getAttribute('lang') === 'en' && document.documentElement.getAttribute('dir') === 'ltr');
    console.log(`Language toggle to EN verified: ${isEn}`);

    await pageI18n.screenshot({
      path: path.join(screenshotsDir, `desktop-en-ltr-hero.png`)
    });

    // Check rim angle in EN
    const rimAngle = await pageI18n.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--rim-angle').trim());
    console.log(`EN LTR Rim Light Angle: ${rimAngle} (expected 135deg)`);

    // Switch back to AR
    await pageI18n.evaluate(() => {
      const arBtn = document.querySelector('.lang-btn[data-lang="ar"]');
      if (arBtn) arBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    const rimAngleAr = await pageI18n.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--rim-angle').trim());
    console.log(`AR RTL Rim Light Angle: ${rimAngleAr} (expected 225deg)`);

    // ------------------------------------------------------------------------
    // 4. THEME PERSISTENCE & PRE-PAINT NO-FLASH AUDIT
    // ------------------------------------------------------------------------
    console.log('--- TESTING THEME PERSISTENCE & FIRST-PAINT FLASH ---');
    const pagePersist = await browser.newPage();
    await pagePersist.setViewport({ width: 1440, height: 900 });
    // First visit: verify default is dark
    await pagePersist.goto(URL, { waitUntil: 'domcontentloaded' });
    const initialTheme = await pagePersist.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`Default initial visit theme: "${initialTheme}" (expected "dark")`);

    // Switch to light mode
    await pagePersist.evaluate(() => {
      const toggle = document.getElementById('theme-toggle');
      if (toggle) toggle.click();
    });
    const switchedTheme = await pagePersist.evaluate(() => document.documentElement.getAttribute('data-theme'));
    const storedTheme = await pagePersist.evaluate(() => localStorage.getItem('omar_theme'));
    console.log(`After toggle: theme="${switchedTheme}", stored="${storedTheme}"`);

    // Reload and check theme before any script execution
    await pagePersist.reload({ waitUntil: 'domcontentloaded' });
    const reloadedTheme = await pagePersist.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`After reload: persisted theme="${reloadedTheme}" (expected "light", no flash!)`);

    // Reset back to dark
    await pagePersist.evaluate(() => {
      const toggle = document.getElementById('theme-toggle');
      if (toggle) toggle.click();
    });

    console.log('--- ALL VISUAL SCREENSHOTS AND VERIFICATIONS COMPLETE! ---');
    await browser.close();
  } catch (err) {
    console.error('Audit encountered error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
