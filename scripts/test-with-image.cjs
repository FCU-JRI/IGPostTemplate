const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto('http://localhost:5174/IGPostTemplate/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Switch to Layout D
  await page.evaluate(() => {
    const sel = document.querySelector('#input-layout');
    sel.value = 'layout-fade';
    sel.dispatchEvent(new Event('input', { bubbles: true }));
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Create a 500x500 test red/blue image as data URL
  const testImageData = await page.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = 500;
    c.height = 500;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(250, 250, 150, 0, Math.PI * 2);
    ctx.fill();
    return c.toDataURL('image/png');
  });

  // Test 1: WITH IMAGE
  console.log('Testing WITH image...');
  await page.evaluate((imgData) => {
    // Inject image into state by triggering file upload or direct dispatch if available
    // Let's set file input or mock FileReader
    // We can directly click or set the state via dispatch if accessible or find file input
    const fileInput = document.querySelector('#input-image');
    // We can also trigger react props or simulate file drop
  }, testImageData);

  // Let's find how image is set in ControlPanel
  // Let's inspect ControlPanel.jsx to see how image is uploaded
  await browser.close();
})();
