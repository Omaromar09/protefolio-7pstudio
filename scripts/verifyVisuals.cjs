const http = require('http');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');

// Simple static server for dist
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

const distDir = path.join(__dirname, '../dist');
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // SPA fallback
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

server.listen(5050, async () => {
  console.log('Static preview server running at http://localhost:5050');
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    await page.goto('http://localhost:5050', { waitUntil: 'networkidle2' });
    
    // Skip intro immediately to reveal portfolio
    try {
      await page.waitForSelector('#intro-skip', { timeout: 3000 });
      await page.click('#intro-skip');
    } catch (e) {
      // Intro might already be finished
    }

    await new Promise(r => setTimeout(r, 2000));

    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

    // 1. Hero with 3D logo & brand glow
    await page.screenshot({ path: path.join(screenshotsDir, 'preview-hero.png') });
    console.log('Saved preview-hero.png');

    // 2. Scroll to Estimator
    await page.evaluate(() => {
      const el = document.getElementById('estimator');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(screenshotsDir, 'preview-estimator.png') });
    console.log('Saved preview-estimator.png');

    // 3. Mobile View of Estimator & Projects
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.evaluate(() => {
      const el = document.getElementById('estimator');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(screenshotsDir, 'preview-estimator-mobile.png') });
    console.log('Saved preview-estimator-mobile.png');

    await browser.close();
  } catch (err) {
    console.error('Puppeteer verification failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
