import puppeteer from 'puppeteer-core';

async function testLive() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    page.on('console', msg => console.log('LIVE LOG:', msg.text()));
    page.on('pageerror', err => console.error('LIVE ERROR:', err.message));

    // Test mobile first (since user tests on mobile phone!)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('omar_intro_seen', 'true');
    });

    console.log('Navigating to live site...');
    await page.goto('https://7pstudio.tech/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));

    // Scroll to #projects
    await page.evaluate(() => {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 1000));

    const initialImgSrc = await page.$eval('#mockup-screen-img', el => el.src);
    console.log('Mobile Initial Screen Image Src:', initialImgSrc);

    // Let's screenshot project 0
    await page.screenshot({ path: 'scripts/screenshots/live-mobile-proj-0.png' });

    // Click tab 1 (Flowers)
    console.log('Clicking tab 1 on mobile...');
    await page.evaluate(() => {
      const tabs = document.querySelectorAll('.showcase-tab-btn');
      if (tabs[1]) tabs[1].click();
    });
    await new Promise(r => setTimeout(r, 1200));

    const tab1Info = await page.evaluate(() => {
      const img = document.getElementById('mockup-screen-img');
      const title = document.getElementById('project-hero-title')?.textContent.trim();
      return { src: img?.src, naturalWidth: img?.naturalWidth, title };
    });
    console.log('After Tab 1 Click:', tab1Info);
    await page.screenshot({ path: 'scripts/screenshots/live-mobile-proj-1.png' });

    // Click tab 2 (Festival)
    console.log('Clicking tab 2 on mobile...');
    await page.evaluate(() => {
      const tabs = document.querySelectorAll('.showcase-tab-btn');
      if (tabs[2]) tabs[2].click();
    });
    await new Promise(r => setTimeout(r, 1200));

    const tab2Info = await page.evaluate(() => {
      const img = document.getElementById('mockup-screen-img');
      const title = document.getElementById('project-hero-title')?.textContent.trim();
      return { src: img?.src, naturalWidth: img?.naturalWidth, title };
    });
    console.log('After Tab 2 Click:', tab2Info);
    await page.screenshot({ path: 'scripts/screenshots/live-mobile-proj-2.png' });

  } catch (e) {
    console.error('Live test error:', e);
  } finally {
    await browser.close();
  }
}

testLive();
