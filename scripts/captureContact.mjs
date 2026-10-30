import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2'
  };

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(data);
    }
  });
});

server.listen(5188, async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto('http://localhost:5188/', { waitUntil: 'networkidle2' });

    // Skip intro
    try {
      await page.waitForSelector('#intro-skip', { timeout: 2000 });
      await page.click('#intro-skip');
    } catch (e) {}

    await new Promise(r => setTimeout(r, 1500));

    // Scroll to contact section
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      const contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView({ behavior: 'instant', block: 'center' });
    });

    await new Promise(r => setTimeout(r, 1200));

    const outPath = path.join(__dirname, 'screenshots', 'liquid-glass', 'contact-dark-inspect.png');
    await page.screenshot({ path: outPath });
    console.log('Saved contact-dark-inspect.png');

    await browser.close();
    server.close();
  } catch (err) {
    console.error(err);
    server.close();
  }
});
