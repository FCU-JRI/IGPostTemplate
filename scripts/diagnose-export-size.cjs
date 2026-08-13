const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to app...');
  await page.goto('http://localhost:5173/IGPostTemplate/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Hook into the page to intercept the download URL
  await page.evaluateOnNewDocument(() => {
    window.lastDownloadUrl = null;
    const originalClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function() {
      if (this.download) {
        window.lastDownloadUrl = this.href;
      } else {
        originalClick.call(this);
      }
    };
  });
  
  // Need to reload to inject the hook
  await page.reload({ waitUntil: 'networkidle0' });

  console.log('Clicking export button...');
  // Find the button containing '下載 IG 貼文'
  const btns = await page.$$('button');
  let exportBtn = null;
  for (const b of btns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('下載 IG 貼文')) {
      exportBtn = b;
      break;
    }
  }

  if (!exportBtn) {
    console.error('Could not find export button');
    process.exit(1);
  }

  await exportBtn.click();
  
  // Wait for the data URL to be populated
  await page.waitForFunction('window.lastDownloadUrl !== null', { timeout: 10000 });
  const dataUrl = await page.evaluate(() => window.lastDownloadUrl);

  // Extract base64 and write to file to check size
  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
  const outPath = path.join(__dirname, 'test-export-size.png');
  fs.writeFileSync(outPath, base64Data, 'base64');
  console.log('Export captured.');

  // Read dimensions from PNG header
  // PNG signature: 8 bytes. IHDR chunk follows. Width/Height are at offsets 16 and 20.
  const buffer = fs.readFileSync(outPath);
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);

  console.log(`Exported Dimensions: ${width}x${height}`);
  if (width !== 1080 || height !== 1350) {
    console.error(`FAIL: Expected 1080x1350, got ${width}x${height}`);
    process.exit(1);
  }

  console.log('PASS: Export size matches expected 1080x1350.');
  await browser.close();
})();
