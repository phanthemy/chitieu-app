const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Set a typical desktop viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // Serve the dist directory to take screenshot
    // Or just load the live URL since we deployed it.
    // The live URL isn't given explicitly, but I can use a local static server if needed.
    // I'll try to load the local file using file:// protocol.
    const fileUrl = 'file://' + path.resolve(__dirname, 'dist', 'index.html');
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    
    await page.screenshot({ path: path.join(__dirname, 'screenshot-desktop.png') });
    
    // Set a mobile viewport
    await page.setViewport({ width: 375, height: 812 });
    await page.screenshot({ path: path.join(__dirname, 'screenshot-mobile.png') });
    
    await browser.close();
    console.log('Screenshots saved as screenshot-desktop.png and screenshot-mobile.png');
  } catch (e) {
    console.error('Error taking screenshot:', e);
  }
})();
