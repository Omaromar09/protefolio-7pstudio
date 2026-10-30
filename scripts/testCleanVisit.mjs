import puppeteer from 'puppeteer-core';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '../dist');

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    fs.createReadStream(filePath).pipe(res);
  } else {
    fs.createReadStream(path.join(distDir, 'index.html')).pipe(res);
  }
});

server.listen(5233, async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.goto('http://localhost:5233/', { waitUntil: 'domcontentloaded' });
  const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  const metaTheme = await page.evaluate(() => document.querySelector('meta[name="theme-color"]')?.getAttribute('content'));
  console.log(`VERIFICATION RESULT: Clean first-visit theme="${theme}", meta-theme-color="${metaTheme}"`);
  await browser.close();
  server.close();
  process.exit(0);
});
