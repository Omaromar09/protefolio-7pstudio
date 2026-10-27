import puppeteer from 'puppeteer-core';
import path from 'node:path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:5173/';

async function runAudit() {
  console.log('--- STARTING REVAMP AUDIT ---');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  // 1. Desktop Test: 1440x900
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle2' });
  console.log('Page loaded at 1440x900');

  // Test Skip Intro
  const skipBtn = await page.$('#intro-skip');
  if (skipBtn) {
    console.log('Skipping intro...');
    await skipBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  // Check Hero CTAs & Proof Row
  const proofCards = await page.$$('.hero-proof-card');
  console.log(`Verified proof cards count: ${proofCards.length} (expected 4)`);

  // Test Project Showcase switching
  const tabs = await page.$$('.showcase-tab-btn');
  console.log(`Verified showcase tabs count: ${tabs.length} (expected 6)`);
  if (tabs.length >= 6) {
    // Switch to Rawnaq 3D demo tab (idx 5)
    await tabs[5].click();
    await new Promise(r => setTimeout(r, 600));
    const titleText = await page.$eval('#project-hero-title', el => el.textContent);
    console.log(`Showcase switched to: "${titleText.trim()}"`);

    const waSimilarHref = await page.$eval('#showcase-similar-btn', el => el.href);
    console.log(`WhatsApp 'اطلب زيه' URL: ${decodeURIComponent(waSimilarHref)}`);
  }

  // Test Before / After Slider handle presence
  const sliderHandle = await page.$('.ba-slider-handle');
  console.log(`Verified Before/After slider handle exists: ${!!sliderHandle}`);

  // Test Quick Diagnosis Quiz
  console.log('Testing Quick Diagnosis Quiz...');
  for (let q = 0; q < 5; q++) {
    const opts = await page.$$('.diagnosis-opt-btn');
    if (opts.length > 0) {
      await opts[0].click();
      await new Promise(r => setTimeout(r, 100));
      const nextBtn = await page.$('#quiz-next-btn');
      if (nextBtn) {
        await nextBtn.click();
        await new Promise(r => setTimeout(r, 200));
      }
    }
  }

  // Verify Diagnosis Result & WhatsApp Link
  const diagResultTitle = await page.$eval('.result-title', el => el.textContent).catch(() => null);
  console.log(`Diagnosis Result Generated: "${diagResultTitle?.trim()}"`);

  const diagWaHref = await page.$eval('.result-wa-btn', el => el.href).catch(() => null);
  if (diagWaHref) {
    console.log(`Diagnosis WhatsApp URL: ${decodeURIComponent(diagWaHref).slice(0, 150)}...`);
  }

  // Test Estimator HUD
  const estWaHref = await page.$eval('#hud-whatsapp-trigger', el => el.href);
  console.log(`Estimator WhatsApp URL: ${decodeURIComponent(estWaHref).slice(0, 150)}...`);

  // Test Language Switch to English
  console.log('Testing Language Switch to English...');
  const enBtn = await page.$('.lang-btn[data-lang="en"]');
  if (enBtn) {
    await enBtn.click();
    await new Promise(r => setTimeout(r, 400));
    const enHeroTitle = await page.$eval('.hero-title', el => el.textContent);
    console.log(`English Hero Title: "${enHeroTitle.trim().slice(0, 50)}..."`);
  }

  // Switch back to Arabic
  const arBtn = await page.$('.lang-btn[data-lang="ar"]');
  if (arBtn) {
    await arBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }

  // Take Desktop Screenshot
  await page.screenshot({ path: 'public/revamp-desktop.jpg', fullPage: false });
  console.log('Saved public/revamp-desktop.jpg');

  // 2. Mobile Test: 390x844
  console.log('Testing Mobile Viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => window.scrollTo(0, 800));
  await new Promise(r => setTimeout(r, 500));

  const stickyVisible = await page.$eval('.mobile-sticky-cta', el => el.classList.contains('is-visible'));
  console.log(`Mobile Sticky CTA bar is visible on scroll: ${stickyVisible}`);

  await page.screenshot({ path: 'public/revamp-mobile.jpg', fullPage: false });
  console.log('Saved public/revamp-mobile.jpg');

  await browser.close();

  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`Total Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Console errors encountered:', consoleErrors);
  } else {
    console.log('SUCCESS: ZERO console errors detected!');
  }
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
