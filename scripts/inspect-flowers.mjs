import puppeteer from 'puppeteer-core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log('Launching browser to capture post-intro flowers site...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('https://flowers-pi-two.vercel.app/', { waitUntil: 'networkidle0', timeout: 35000 });

    console.log('Waiting for intro to complete...');
    await new Promise(r => setTimeout(r, 6500));

    // Capture desktop preview image
    const desktopPath = path.join(__dirname, '../public/projects/flowers-preview.jpg');
    await page.screenshot({ path: desktopPath, quality: 92, type: 'jpeg' });
    console.log('Saved desktop preview to:', desktopPath);

    // Capture mobile preview
    await page.setViewport({ width: 412, height: 915, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto('https://flowers-pi-two.vercel.app/', { waitUntil: 'networkidle0', timeout: 35000 });
    await new Promise(r => setTimeout(r, 6500));
    const mobilePath = path.join(__dirname, '../public/projects/flowers-mobile.jpg');
    await page.screenshot({ path: mobilePath, quality: 92, type: 'jpeg' });
    console.log('Saved mobile preview to:', mobilePath);

  } catch (err) {
    console.error('Inspection error:', err);
  } finally {
    await browser.close();
  }
}

run();
