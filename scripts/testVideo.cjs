const puppeteer = require('../node_modules/puppeteer-core');
const path = require('path');

async function testVideo() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: 'new',
    args: ['--allow-file-access-from-files']
  });
  const page = await browser.newPage();
  const videoPath = 'file:///' + path.resolve('c:/Users/dell/Desktop/video.cb135564.mp4').replace(/\\/g, '/');
  await page.goto(videoPath);
  const duration = await page.evaluate(() => {
    const v = document.querySelector('video');
    return v ? v.duration : null;
  });
  console.log('Video duration:', duration);
  await browser.close();
}
testVideo().catch(e => console.error(e));
