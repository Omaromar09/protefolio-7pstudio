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
  console.log('SERVER REQ:', req.url, '-> filePath exists?', fs.existsSync(filePath));
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream(path.join(distDir, 'index.html')).pipe(res);
  }
});

const PORT = 5499;

server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('omar_intro_seen', 'true');
    });

    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    const frame = await page.$('.device-laptop-frame');
    await frame.screenshot({ path: 'scripts/screenshots/local-tab0.png' });

    console.log('Clicking tab 1 (Flowers)...');
    await page.evaluate(() => {
      document.querySelectorAll('.showcase-tab-btn')[1].click();
    });
    await new Promise(r => setTimeout(r, 1500));
    await frame.screenshot({ path: 'scripts/screenshots/local-tab1.png' });

    console.log('Clicking tab 2 (Festival)...');
    await page.evaluate(() => {
      document.querySelectorAll('.showcase-tab-btn')[2].click();
    });
    await new Promise(r => setTimeout(r, 1500));
    await frame.screenshot({ path: 'scripts/screenshots/local-tab2.png' });

    console.log('Clicking tab 3 (Kayan)...');
    await page.evaluate(() => {
      document.querySelectorAll('.showcase-tab-btn')[3].click();
    });
    await new Promise(r => setTimeout(r, 1500));
    await frame.screenshot({ path: 'scripts/screenshots/local-tab3.png' });

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
});
