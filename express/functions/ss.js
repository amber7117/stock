const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  // Read the URLs from the file
  const urls = fs.readFileSync('list.txt', 'utf-8').split('\n').filter(Boolean);

  // Create a browser instance
  const browser = await puppeteer.launch();

  for (const url of urls) {
    // Create a new page
    const page = await browser.newPage();

    // Set viewport width and height
    await page.setViewport({ width: 1280, height: 720 });

    // Open URL in current page
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Extract the filename from the URL
    const urlPath = new URL(url).pathname;
    const filename = urlPath.substring(urlPath.lastIndexOf('/') + 1) || 'index';
    const imagesFolder = path.join(__dirname, 'images');
    const screenshotPath = path.join(imagesFolder, `${filename}.jpg`);

    // Capture screenshot
    await page.screenshot({
      path: screenshotPath,
    });

    // Close the page
    await page.close();
  }

  // Close the browser instance
  await browser.close();
})();

