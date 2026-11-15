import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem('omar_intro_seen', 'true');
  });

  await page.goto('https://7pstudio.tech/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  console.log('--- Before click ---');
  let imgs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      id: img.id,
      className: img.className,
      src: img.src,
      currentSrc: img.currentSrc,
      naturalWidth: img.naturalWidth,
      parent: img.parentElement.tagName + '.' + img.parentElement.className
    }));
  });
  console.log(imgs);

  console.log('--- Clicking tab 1 (Flowers) ---');
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('.showcase-tab-btn');
    console.log('Tabs length:', tabs.length);
    tabs[1].click();
  });
  await new Promise(r => setTimeout(r, 1500));

  console.log('--- After click tab 1 ---');
  imgs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      id: img.id,
      className: img.className,
      src: img.src,
      currentSrc: img.currentSrc,
      naturalWidth: img.naturalWidth,
      parent: img.parentElement.tagName + '.' + img.parentElement.className
    }));
  });
  console.log(imgs);

  // Take screenshot of the exact laptop-screen-inner element
  const element = await page.$('.laptop-screen-inner');
  if (element) {
    await element.screenshot({ path: 'scripts/screenshots/laptop-element-tab1.png' });
    console.log('Took screenshot of .laptop-screen-inner');
  }

  // Also check if there is any other background-image or layer covering it!
  const screenStyles = await page.evaluate(() => {
    const screenInner = document.querySelector('.laptop-screen-inner');
    const screenImg = document.getElementById('mockup-screen-img');
    const glare = document.querySelector('.screen-glare');
    return {
      screenInnerStyle: screenInner ? {
        backgroundImage: window.getComputedStyle(screenInner).backgroundImage,
        backgroundColor: window.getComputedStyle(screenInner).backgroundColor,
      } : null,
      screenImgStyle: screenImg ? {
        opacity: window.getComputedStyle(screenImg).opacity,
        display: window.getComputedStyle(screenImg).display,
        visibility: window.getComputedStyle(screenImg).visibility,
        backgroundImage: window.getComputedStyle(screenImg).backgroundImage,
        src: screenImg.src,
        currentSrc: screenImg.currentSrc
      } : null,
      glareStyle: glare ? {
        backgroundImage: window.getComputedStyle(glare).backgroundImage,
        display: window.getComputedStyle(glare).display
      } : null
    };
  });
  console.log('Screen Styles:', screenStyles);

  await browser.close();
}

main().catch(console.error);
