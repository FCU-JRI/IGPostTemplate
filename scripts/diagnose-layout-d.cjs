const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5174/IGPostTemplate/';
const OUTPUT_DIR = path.join(__dirname, '..', 'scripts', 'captures', 'diagnose_d');

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  page.on('console', msg => console.log('  [BROWSER CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('  [BROWSER ERROR]', err.message));

  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Switch to Layout D
  await page.evaluate(() => {
    const sel = document.querySelector('#input-layout');
    sel.value = 'layout-fade';
    sel.dispatchEvent(new Event('input', { bubbles: true }));
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await page.evaluate(() => {
    const title = document.querySelector('#input-title');
    title.value = '益材是什麼？';
    title.dispatchEvent(new Event('input', { bubbles: true }));
    title.dispatchEvent(new Event('change', { bubbles: true }));

    const body = document.querySelector('#input-body');
    body.value = '•國家太空中心TASA-台灣布局全球衛星供應鏈SATELLITE 2026：衛星推進系統高壓氣瓶\n•國家太空中心TASA專案供應商之一\n•前瞻火箭中心ARRC合作廠商之一\n•全球氣瓶主要製造商之一';
    body.dispatchEvent(new Event('input', { bubbles: true }));
    body.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await new Promise(r => setTimeout(r, 1000));

  // 1. Capture Web Preview
  await page.evaluate(() => {
    document.querySelector('#export-canvas').parentElement.style.transform = 'scale(1)';
  });
  await new Promise(r => setTimeout(r, 100));

  const canvasHandle = await page.$('#export-canvas');
  await canvasHandle.screenshot({ path: path.join(OUTPUT_DIR, 'web_preview.png') });

  // 2. Click Export Button and capture downloaded image
  const downloadedDataUrl = await page.evaluate(async () => {
    let capturedHref = null;
    const origCreate = document.createElement.bind(document);
    document.createElement = function(tagName) {
      const el = origCreate(tagName);
      if (tagName.toLowerCase() === 'a') {
        el.click = function() {
          capturedHref = el.href;
        };
      }
      return el;
    };

    const btn = document.querySelector('#btn-download');
    btn.click();

    let attempts = 0;
    while (!capturedHref && attempts < 100) {
      await new Promise(r => setTimeout(r, 100));
      attempts++;
    }

    document.createElement = origCreate;
    return capturedHref;
  });

  if (downloadedDataUrl) {
    const base64Data = downloadedDataUrl.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(path.join(OUTPUT_DIR, 'exported.png'), base64Data, 'base64');
    console.log('Export succeeded and saved to exported.png');
  } else {
    console.error('Export failed');
  }

  await browser.close();
})();
