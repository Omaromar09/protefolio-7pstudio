import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4173;
const URL = `http://127.0.0.1:${PORT}/`;
const distDir = path.join(__dirname, '../dist');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

function startStaticServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURIComponent(req.url.split('?')[0]);
      if (reqPath === '/' || !reqPath) reqPath = '/index.html';
      const filePath = path.join(distDir, reqPath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': mimeTypes[ext] || 'application/octet-stream',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(fs.readFileSync(filePath));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
    });

    server.listen(PORT, '127.0.0.1', () => {
      console.log(`Static server listening on http://127.0.0.1:${PORT}/`);
      resolve(server);
    });
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const server = await startStaticServer();

  console.log('--- Launching Chrome via Puppeteer ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();

    // 1. Desktop Test
    console.log('--- Test 1: Desktop Viewport (1440x900) ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    // Capture Intro Screen (within first 1 second)
    await sleep(600);
    const screenshotDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

    const artifactDir = 'C:\\Users\\dell\\.gemini\\antigravity\\brain\\064a9473-5d94-42e7-b08c-4bfc339ab64b';

    await page.screenshot({ path: path.join(artifactDir, 'intro_desktop.png') });
    console.log('Captured intro_desktop.png');

    // Wait for intro to complete (3.2s + handoff = ~4s)
    await sleep(3500);

    // Capture Hero Section
    await page.screenshot({ path: path.join(artifactDir, 'hero_desktop.png') });
    console.log('Captured hero_desktop.png');

    // Scroll to #projects showcase
    await page.evaluate(() => {
      const proj = document.getElementById('projects');
      if (proj) proj.scrollIntoView({ behavior: 'instant' });
    });
    await sleep(600);

    // Test last project click bug!
    console.log('Testing last project tab click (index 6: لاونج إكس أو بلايستيشن)...');
    const scrollXBefore = await page.evaluate(() => window.scrollX || document.documentElement.scrollLeft);

    await page.evaluate(() => {
      document.querySelector('.showcase-tab-btn[data-idx="6"]')?.click();
    });
    await sleep(800);

    const scrollXAfter = await page.evaluate(() => window.scrollX || document.documentElement.scrollLeft);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    console.log(`ScrollX Before: ${scrollXBefore}, After: ${scrollXAfter}`);
    console.log(`ScrollWidth: ${scrollWidth}, ClientWidth: ${clientWidth}`);

    if (scrollXAfter === 0) {
      console.log('SUCCESS: Window did NOT shift horizontally on clicking the last project!');
    } else {
      console.error(`FAILURE: Window shifted horizontally by ${scrollXAfter}px!`);
    }

    await page.screenshot({ path: path.join(artifactDir, 'project6_desktop.png') });
    console.log('Captured project6_desktop.png');

    // 2. Mobile Test
    console.log('--- Test 2: Mobile Viewport (iPhone 14: 390x844) ---');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await mobilePage.goto(URL, { waitUntil: 'domcontentloaded' });

    // Skip intro
    await sleep(400);
    await mobilePage.evaluate(() => {
      document.getElementById('intro-skip')?.click();
    });
    console.log('Triggered #intro-skip on mobile');
    await sleep(900);

    const heroLayout = await mobilePage.evaluate(() => {
      const stage = document.querySelector('.stage');
      const headline = document.querySelector('.hero-title');
      const stageRect = stage ? stage.getBoundingClientRect() : null;
      const headRect = headline ? headline.getBoundingClientRect() : null;
      return {
        stageWidthRatio: stageRect ? (stageRect.width / window.innerWidth).toFixed(2) : null,
        stageIsAboveHeadline: stageRect && headRect ? stageRect.bottom <= headRect.top + 60 : null,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
      };
    });

    console.log('Mobile Hero Layout Check:', heroLayout);
    await mobilePage.screenshot({ path: path.join(artifactDir, 'hero_mobile.png') });
    console.log('Captured hero_mobile.png');

    // Scroll to showcase on mobile and click tab 6
    await mobilePage.evaluate(() => {
      const proj = document.getElementById('projects');
      if (proj) proj.scrollIntoView({ behavior: 'instant' });
    });
    await sleep(500);

    await mobilePage.evaluate(() => {
      document.querySelector('.showcase-tab-btn[data-idx="6"]')?.click();
    });
    await sleep(800);

    const mobileOverflow = await mobilePage.evaluate(() => {
      return {
        scrollX: window.scrollX || document.documentElement.scrollLeft,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: window.innerWidth,
        hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth
      };
    });
    console.log('Mobile Showcase Check:', mobileOverflow);

    await mobilePage.screenshot({ path: path.join(artifactDir, 'showcase_mobile_tab6.png') });
    console.log('Captured showcase_mobile_tab6.png');

    // Scroll to Estimator & Contact on mobile
    await mobilePage.evaluate(() => {
      const est = document.getElementById('estimator');
      if (est) est.scrollIntoView({ behavior: 'instant' });
    });
    await sleep(600);
    await mobilePage.screenshot({ path: path.join(artifactDir, 'estimator_contact_mobile.png') });
    console.log('Captured estimator_contact_mobile.png');

    console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Error during test execution:', err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
}

run();
