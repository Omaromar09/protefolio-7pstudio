const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

    // Skip intro
    try {
      await page.waitForSelector('#intro-skip', { timeout: 2500 });
      await page.click('#intro-skip');
    } catch (e) {}

    await new Promise(r => setTimeout(r, 2200));

    const outDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // 1. Dark Mode 3D Hero
    const heroCanvas = await page.$('#hero-3d-canvas');
    if (heroCanvas) {
      await heroCanvas.screenshot({ path: path.join(outDir, 'hero-3d-dark.png') });
      console.log('Saved hero-3d-dark.png');
    }

    // Full hero section in dark mode
    const heroSection = await page.$('#hero');
    if (heroSection) {
      await heroSection.screenshot({ path: path.join(outDir, 'hero-section-dark.png') });
      console.log('Saved hero-section-dark.png');
    }

    // 2. Toggle to Light Mode
    const themeBtn = await page.$('#theme-toggle');
    if (themeBtn) {
      await themeBtn.click();
      console.log('Clicked theme toggle button');
      await new Promise(r => setTimeout(r, 1500));

      if (heroCanvas) {
        await heroCanvas.screenshot({ path: path.join(outDir, 'hero-3d-light.png') });
        console.log('Saved hero-3d-light.png');
      }
      if (heroSection) {
        await heroSection.screenshot({ path: path.join(outDir, 'hero-section-light.png') });
        console.log('Saved hero-section-light.png');
      }
    }

    await browser.close();
    console.log('3D verification complete!');
  } catch (err) {
    console.error('3D verification failed:', err);
  }
})();
