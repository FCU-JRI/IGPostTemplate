const puppeteer = require('puppeteer');
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

  // Select Layout D
  await page.evaluate(() => {
    const sel = document.querySelector('#input-layout');
    sel.value = 'layout-fade';
    sel.dispatchEvent(new Event('input', { bubbles: true }));
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 1000));

  // Let's click download and intercept the exact SVG or canvas modern-screenshot creates
  // Let's hook canvas.toDataURL or check how modern-screenshot creates the image
  const svgData = await page.evaluate(async () => {
    const el = document.querySelector('#export-canvas');
    
    // We can call domToPng with various options
    // Let's see what is inside exportImage.js
    // Let's check getBoundingClientRect vs scrollHeight
    return {
      elWidth: el.offsetWidth,
      elHeight: el.offsetHeight,
      elScrollWidth: el.scrollWidth,
      elScrollHeight: el.scrollHeight,
      boxOffsetHeight: el.querySelector('[class*="contentBox"]').offsetHeight,
      boxScrollHeight: el.querySelector('[class*="contentBox"]').scrollHeight,
      boxMarginTop: window.getComputedStyle(el.querySelector('[class*="contentBox"]')).marginTop,
    };
  });

  console.log('Layout D dimensions:', svgData);

  await browser.close();
})();
