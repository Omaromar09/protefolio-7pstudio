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

    // Wait for 3D to lazy-load and render smoothly
    await page.mouse.move(700, 450);
    await new Promise(r => setTimeout(r, 2500));

    const outDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // 1. Dark Mode
    await page.screenshot({ path: path.join(outDir, 'hero-3d-new-dark.png') });
    console.log('Saved hero-3d-new-dark.png');

    // 2. Light Mode
    const themeBtn = await page.$('#theme-toggle');
    if (themeBtn) {
      await themeBtn.click();
      console.log('Clicked theme toggle button');
      await new Promise(r => setTimeout(r, 1500));
      await page.screenshot({ path: path.join(outDir, 'hero-3d-new-light.png') });
      console.log('Saved hero-3d-new-light.png');
    }

    await browser.close();
    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Error:', err);
  }
})();
