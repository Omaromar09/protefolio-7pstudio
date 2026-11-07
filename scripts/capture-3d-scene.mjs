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

const PORT = 5288;

server.listen(PORT, async () => {
  console.log(`Test server running at http://localhost:${PORT}`);
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

    // Wait for 3D canvas to initialize and render frames
    await page.waitForSelector('#hero-3d-canvas');
    await new Promise(r => setTimeout(r, 2500));

    // 1. Capture Full Hero in Dark Mode
    const heroSection = await page.$('#hero');
    if (heroSection) {
      await heroSection.screenshot({ path: path.join(__dirname, 'screenshots/new_3d_hero_dark.png') });
      console.log('Saved new_3d_hero_dark.png');
    }

    // 2. Capture Close-up of 3D Canvas in Dark Mode
    const heroWrap = await page.$('.hero-3d-wrap');
    if (heroWrap) {
      await heroWrap.screenshot({ path: path.join(__dirname, 'screenshots/new_3d_closeup_dark.png') });
      console.log('Saved new_3d_closeup_dark.png');
    }

    // 3. Switch to Light Mode
    await page.evaluate(() => {
      const themeBtn = document.getElementById('theme-toggle-btn');
      if (themeBtn) themeBtn.click();
      else {
        document.documentElement.setAttribute('data-theme', 'light');
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: 'light' } }));
      }
    });

    await new Promise(r => setTimeout(r, 1200));

    // 4. Capture Full Hero in Light Mode
    if (heroSection) {
      await heroSection.screenshot({ path: path.join(__dirname, 'screenshots/new_3d_hero_light.png') });
      console.log('Saved new_3d_hero_light.png');
    }

    // 5. Capture Close-up in Light Mode
    if (heroWrap) {
      await heroWrap.screenshot({ path: path.join(__dirname, 'screenshots/new_3d_closeup_light.png') });
      console.log('Saved new_3d_closeup_light.png');
    }

    console.log('All 3D screenshots captured successfully!');
  } catch (err) {
    console.error('Screenshot error:', err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
});
