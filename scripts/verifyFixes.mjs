import puppeteer from 'puppeteer-core';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';

const distDir = path.resolve('dist');
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

server.listen(5255, async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const outDir = path.resolve('scripts/screenshots');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // ==========================================
    // 1. MOBILE VERIFICATION (iPhone / Android)
    // ==========================================
    const pageMobile = await browser.newPage();
    await pageMobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await pageMobile.goto('http://localhost:5255/?skipIntro=true', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));

    // A. Mobile Hero
    await pageMobile.screenshot({ path: path.join(outDir, 'mobile-hero-fixed.png') });
    console.log('✓ Captured mobile-hero-fixed.png');

    // B. Mobile Estimator Step 1 & Sticky CTA
    await pageMobile.evaluate(() => {
      document.querySelector('#estimator')?.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 600));
    await pageMobile.screenshot({ path: path.join(outDir, 'mobile-estimator-fixed.png') });
    console.log('✓ Captured mobile-estimator-fixed.png');

    // C. Mobile Floating Dock Check (Check WhatsApp floating is hidden & BackToTop clean)
    const floatingDockMetrics = await pageMobile.evaluate(() => {
      const waContainer = document.querySelector('.floating-whatsapp-container');
      const waBtn = document.querySelector('.whatsapp-floating-btn');
      const backTop = document.querySelector('#floating-back-top');
      const stickyCta = document.querySelector('#mobile-sticky-cta');

      const isHidden = (el) => {
        if (!el) return true;
        const style = window.getComputedStyle(el);
        return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
      };

      return {
        waContainerHidden: isHidden(waContainer),
        waBtnHidden: isHidden(waBtn),
        backTopVisible: !isHidden(backTop),
        stickyCtaVisible: !isHidden(stickyCta)
      };
    });
    console.log('Floating Dock Mobile Metrics:', floatingDockMetrics);

    // ==========================================
    // 2. TABLET VERIFICATION (iPad 768x1024)
    // ==========================================
    const pageTablet = await browser.newPage();
    await pageTablet.setViewport({ width: 768, height: 1024, isMobile: false, hasTouch: true });
    await pageTablet.goto('http://localhost:5255/?skipIntro=true', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));

    await pageTablet.screenshot({ path: path.join(outDir, 'tablet-hero-fixed.png') });
    console.log('✓ Captured tablet-hero-fixed.png');

    await pageTablet.evaluate(() => {
      document.querySelector('#estimator')?.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 600));
    await pageTablet.screenshot({ path: path.join(outDir, 'tablet-estimator-fixed.png') });
    console.log('✓ Captured tablet-estimator-fixed.png');

    // Check horizontal scroll / overflow
    const overflowCheck = await pageMobile.evaluate(() => {
      return {
        docScrollWidth: document.documentElement.scrollWidth,
        windowWidth: window.innerWidth,
        hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth
      };
    });
    console.log('Mobile Overflow Check:', overflowCheck);

    await browser.close();
  } catch (err) {
    console.error('Verification failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
