import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem('omar_intro_seen', 'true');
  });

  await page.goto('https://7pstudio.tech/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Take screenshot before click
  const frame = await page.$('.device-laptop-frame');
  await frame.screenshot({ path: 'scripts/screenshots/desktop-tab0.png' });

  // Click tab 1 (Flowers)
  await page.evaluate(() => {
    document.querySelectorAll('.showcase-tab-btn')[1].click();
  });
  await new Promise(r => setTimeout(r, 1200));

  await frame.screenshot({ path: 'scripts/screenshots/desktop-tab1.png' });

  // Click tab 2 (Festival)
  await page.evaluate(() => {
    document.querySelectorAll('.showcase-tab-btn')[2].click();
  });
  await new Promise(r => setTimeout(r, 1200));

  await frame.screenshot({ path: 'scripts/screenshots/desktop-tab2.png' });

  await browser.close();
}

main().catch(console.error);
