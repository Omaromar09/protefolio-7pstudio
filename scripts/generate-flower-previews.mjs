import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function generatePreviews() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });

  // 1. Desktop Preview
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('https://flowers-pi-two.vercel.app/', { waitUntil: 'networkidle0' });
  console.log('Waiting 9.5s for desktop intro to clear...');
  await new Promise(r => setTimeout(r, 9500));
  await page.screenshot({ path: 'public/projects/flowers-preview.jpg', quality: 92, type: 'jpeg' });
  console.log('Saved public/projects/flowers-preview.jpg');

  // 2. Mobile Preview
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 412, height: 915, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await mobilePage.goto('https://flowers-pi-two.vercel.app/', { waitUntil: 'networkidle0' });
  console.log('Waiting 9.5s for mobile intro to clear...');
  await new Promise(r => setTimeout(r, 9500));
  await mobilePage.screenshot({ path: 'public/projects/flowers-mobile.jpg', quality: 92, type: 'jpeg' });
  console.log('Saved public/projects/flowers-mobile.jpg');

  await browser.close();
  console.log('Finished capturing flower previews!');
}

generatePreviews();
