const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

async function runVerification() {
  console.log('--- STARTING COMPREHENSIVE SITE VERIFICATION ---');

  // 1. Start Vite preview server on port 4173
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], {
    cwd: path.join(__dirname, '..'),
    shell: true
  });

  // Wait 2.5s for server to start
  await new Promise(r => setTimeout(r, 2500));

  const consoleLogs = [];
  const consoleErrors = [];

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  try {
    const page = await browser.newPage();

    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(`[${msg.type()}] ${text}`);
      if (msg.type() === 'error') {
        consoleErrors.push(text);
      }
    });

    page.on('pageerror', err => {
      consoleErrors.push(err.toString());
    });

    console.log('Navigating to http://localhost:4173 ...');
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

    // Expose master timeline handle if not already exposed
    await page.evaluate(() => {
      // Clear session storage to force intro playback
      sessionStorage.clear();
    });

    // Reload with clean session
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

    console.log('Evaluating Master Intro scrub points...');

    // Function to pause and scrub timeline
    const timestamps = [0.5, 1.0, 1.5, 2.5, 3.3, 4.0, 4.6, 5.0, 5.5];

    for (const t of timestamps) {
      await page.evaluate((time) => {
        // Find GSAP timelines or global timeline
        const allTweens = window.gsap ? window.gsap.globalTimeline.getChildren(true, true, true) : [];
        if (window.gsap) {
          window.gsap.globalTimeline.pause();
          window.gsap.globalTimeline.seek(time);
        }
      }, t);

      const shotPath = path.join(screenshotsDir, `intro_${t.toFixed(1)}s.png`);
      await page.screenshot({ path: shotPath });
      console.log(`Captured screenshot at t = ${t.toFixed(1)}s -> ${shotPath}`);

      // At t = 5.0s: Confirm wheel stops on photo-2 with orange border & check badge
      if (t === 5.0) {
        const checkResult = await page.evaluate(() => {
          const targetCard = document.getElementById('intro-landing-card');
          const isSelected = targetCard ? targetCard.classList.contains('is-selected') : false;
          const badge = document.getElementById('intro-check-badge');
          const badgeScale = badge ? window.getComputedStyle(badge).transform : null;
          const imgSrc = targetCard ? targetCard.querySelector('img').getAttribute('src') : '';
          return { isSelected, badgeScale, imgSrc };
        });
        console.log(`>>> Verification at t = 5.00s:
  - Landing photo src: ${checkResult.imgSrc} (Expected: /photos/photo-2.webp)
  - Has 'is-selected' orange border class: ${checkResult.isSelected}
  - Check badge transform: ${checkResult.badgeScale}`);
      }
    }

    // Hand-off & Hero State at 6.0s
    await page.evaluate(() => {
      if (window.gsap) {
        window.gsap.globalTimeline.seek(6.0);
      }
    });
    await new Promise(r => setTimeout(r, 600));

    // Capture Hero in interactive state
    const heroShot = path.join(screenshotsDir, 'hero_interactive.png');
    await page.screenshot({ path: heroShot });
    console.log(`Captured Hero interactive state -> ${heroShot}`);

    // Verify Hero Counter
    const counterText = await page.evaluate(() => {
      const c = document.getElementById('photo-counter');
      return c ? c.textContent.trim() : '';
    });
    console.log(`Hero Counter text: "${counterText}" (Expected: "02 / 06")`);

    // Test Hero Wheel Up/Down buttons
    console.log('Testing wheel Down button click...');
    await page.click('#wheel-btn-down');
    await new Promise(r => setTimeout(r, 600));
    const counterAfterDown = await page.evaluate(() => {
      return document.getElementById('photo-counter').textContent.trim();
    });
    console.log(`Counter after Down click: "${counterAfterDown}" (Expected: "03 / 06")`);

    await page.click('#wheel-btn-up');
    await new Promise(r => setTimeout(r, 600));
    const counterAfterUp = await page.evaluate(() => {
      return document.getElementById('photo-counter').textContent.trim();
    });
    console.log(`Counter after Up click: "${counterAfterUp}" (Expected: "02 / 06")`);

    // Test Language Toggle (Arabic RTL -> English LTR)
    console.log('Testing Language Toggle to EN...');
    await page.click('#lang-toggle-btn');
    await new Promise(r => setTimeout(r, 300));
    const langStateEN = await page.evaluate(() => {
      return {
        dir: document.documentElement.dir,
        lang: document.documentElement.lang,
        h1: document.querySelector('.hero-title').textContent.trim()
      };
    });
    console.log(`Language EN state: dir=${langStateEN.dir}, lang=${langStateEN.lang}, H1="${langStateEN.h1}"`);

    console.log('Testing Language Toggle back to AR...');
    await page.click('#lang-toggle-btn');
    await new Promise(r => setTimeout(r, 300));
    const langStateAR = await page.evaluate(() => {
      return {
        dir: document.documentElement.dir,
        lang: document.documentElement.lang,
        h1: document.querySelector('.hero-title').textContent.trim()
      };
    });
    console.log(`Language AR state: dir=${langStateAR.dir}, lang=${langStateAR.lang}, H1="${langStateAR.h1}"`);

    // Test Skip Button
    console.log('Testing Skip Button fresh load...');
    await page.evaluate(() => sessionStorage.clear());
    await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 100)); // Within first frame

    const skipBtnVisible = await page.evaluate(() => {
      const btn = document.getElementById('skip-intro-btn');
      return btn && window.getComputedStyle(btn).display !== 'none';
    });
    console.log(`Skip Button visible from frame 1: ${skipBtnVisible}`);

    await page.click('#skip-intro-btn');
    await new Promise(r => setTimeout(r, 300));

    const skipResult = await page.evaluate(() => {
      const introStage = document.getElementById('intro-stage');
      const isIntroHidden = introStage.classList.contains('is-hidden') || window.getComputedStyle(introStage).display === 'none';
      const stored = sessionStorage.getItem('omar_intro_seen');
      return { isIntroHidden, stored };
    });
    console.log(`Skip Button action result: isIntroHidden=${skipResult.isIntroHidden}, sessionStorage=${skipResult.stored}`);

    // Section Screenshots
    console.log('Capturing section screenshots...');
    const sections = ['about', 'gallery', 'services', 'work', 'contact'];
    for (const secId of sections) {
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView();
      }, secId);
      await new Promise(r => setTimeout(r, 400));
      const secShot = path.join(screenshotsDir, `section_${secId}.png`);
      await page.screenshot({ path: secShot });
      console.log(`Captured Section #${secId} -> ${secShot}`);
    }

    // Mobile Viewport Test (375x812 iPhone)
    console.log('Testing Mobile Viewport (375x812)...');
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 400));
    const mobileHeroShot = path.join(screenshotsDir, 'mobile_hero.png');
    await page.screenshot({ path: mobileHeroShot });
    console.log(`Captured Mobile Hero -> ${mobileHeroShot}`);

    // Open Mobile Drawer
    await page.click('#mobile-menu-btn');
    await new Promise(r => setTimeout(r, 400));
    const mobileMenuShot = path.join(screenshotsDir, 'mobile_menu_open.png');
    await page.screenshot({ path: mobileMenuShot });
    console.log(`Captured Mobile Menu -> ${mobileMenuShot}`);

    // Console Errors Check
    console.log('--- CONSOLE AUDIT ---');
    console.log(`Total console logs: ${consoleLogs.length}`);
    console.log(`Total console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error('Console Errors Detected:', consoleErrors);
    } else {
      console.log('SUCCESS: ZERO console errors detected!');
    }

  } catch (err) {
    console.error('Verification failed with error:', err);
  } finally {
    await browser.close();
    previewProcess.kill();
    console.log('--- VERIFICATION COMPLETE ---');
  }
}

runVerification();
