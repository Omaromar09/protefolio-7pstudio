const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    // Mobile iPhone 14 viewport
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

    // Skip intro
    try {
      await page.waitForSelector('#intro-skip', { timeout: 2500 });
      await page.click('#intro-skip');
    } catch (e) {}

    await new Promise(r => setTimeout(r, 2000));

    const outDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // 1. Mobile Hero View
    await page.screenshot({ path: path.join(outDir, 'mobile-01-hero.png') });
    console.log('Saved mobile-01-hero.png');

    // 2. Check for Horizontal Scroll / Overflow
    const overflowCheck = await page.evaluate(() => {
      const docW = document.documentElement.offsetWidth;
      const winW = window.innerWidth;
      const bodyScrollW = document.body.scrollWidth;
      const docScrollW = document.documentElement.scrollWidth;
      return {
        docW,
        winW,
        bodyScrollW,
        docScrollW,
        hasHorizontalOverflow: docScrollW > winW || bodyScrollW > winW
      };
    });
    console.log('Horizontal Overflow Check:', overflowCheck);

    // 3. Scroll to Projects and click first project
    await page.evaluate(() => {
      const projectsSec = document.getElementById('projects');
      if (projectsSec) projectsSec.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 1000));

    // Click project card 1 to open popover
    const projectCard = await page.$('.partner-card, .project-card, [data-project-id]');
    if (projectCard) {
      await projectCard.click();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(outDir, 'mobile-02-project-popover.png') });
      console.log('Saved mobile-02-project-popover.png');

      // Close the modal popover so we can view the rest of the page
      const closeBtn = await page.$('.popover-close-btn, #popover-close-btn, .popover-overlay');
      if (closeBtn) {
        await closeBtn.click();
        await new Promise(r => setTimeout(r, 600));
      }
    }

    // 4. Scroll to Estimator
    await page.evaluate(() => {
      const estimatorSec = document.getElementById('estimator');
      if (estimatorSec) estimatorSec.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outDir, 'mobile-03-estimator.png') });
    console.log('Saved mobile-03-estimator.png');

    // 5. Scroll to Footer / Social Links (TikTok, WhatsApp, Instagram)
    await page.evaluate(() => {
      const contactSec = document.getElementById('contact');
      if (contactSec) contactSec.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outDir, 'mobile-04-footer.png') });
    console.log('Saved mobile-04-footer.png');

    await browser.close();
    console.log('Mobile audit complete!');
  } catch (err) {
    console.error('Audit failed:', err);
  }
})();
