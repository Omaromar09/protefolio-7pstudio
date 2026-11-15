import puppeteer from 'puppeteer-core';
async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://flowers-pi-two.vercel.app/', { waitUntil: 'networkidle0' });
  console.log('Page loaded, checking jv-intro...');
  for (let s = 1; s <= 10; s++) {
    await new Promise(r => setTimeout(r, 1000));
    const status = await page.evaluate(() => {
      const el = document.getElementById('jv-intro');
      if (!el) return 'REMOVED';
      const style = window.getComputedStyle(el);
      return { opacity: style.opacity, display: style.display, pointerEvents: style.pointerEvents };
    });
    console.log(`Second ${s}:`, status);
  }

  // Also check hero text classes after 10s
  const heroState = await page.evaluate(() => {
    const textWrap = document.querySelector('.relative.z-10.max-w-5xl');
    return textWrap ? textWrap.className : 'null';
  });
  console.log('Hero text state after 10s:', heroState);

  // Take screenshot
  await page.screenshot({ path: 'public/projects/flowers-preview-10s.jpg', quality: 92 });
  console.log('Saved flowers-preview-10s.jpg');
  await browser.close();
}
test();
