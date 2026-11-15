import puppeteer from 'puppeteer-core';

async function trace() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('request', req => {
    if (req.url().includes('projects') || req.resourceType() === 'image') {
      console.log('REQUEST:', req.method(), req.url());
    }
  });

  page.on('response', async res => {
    if (res.url().includes('projects') || res.request().resourceType() === 'image') {
      console.log('RESPONSE:', res.status(), res.url(), 'fromCache:', res.fromCache());
    }
  });

  page.on('requestfailed', req => {
    console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText);
  });

  console.log('Loading live site...');
  await page.goto('https://7pstudio.tech/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  console.log('\n--- CLICKING TAB 1 (FLOWERS) ---');
  await page.evaluate(() => {
    document.querySelectorAll('.showcase-tab-btn')[1].click();
  });
  await new Promise(r => setTimeout(r, 3000));

  console.log('\n--- CLICKING TAB 2 (FESTIVAL) ---');
  await page.evaluate(() => {
    document.querySelectorAll('.showcase-tab-btn')[2].click();
  });
  await new Promise(r => setTimeout(r, 3000));

  await browser.close();
}

trace().catch(console.error);
