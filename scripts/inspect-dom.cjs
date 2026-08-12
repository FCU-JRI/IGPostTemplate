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

  // Inspect the exact DOM elements inside #export-canvas
  const domDump = await page.evaluate(() => {
    const el = document.querySelector('#export-canvas');
    return {
      outerHTML: el.outerHTML,
      computedStyles: {
        canvasBg: window.getComputedStyle(el).backgroundColor,
        canvasHeight: window.getComputedStyle(el).height,
        canvasOverflow: window.getComputedStyle(el).overflow,
        contentBoxMarginTop: window.getComputedStyle(el.querySelector('[class*="contentBox"]')).marginTop,
        contentBoxBg: window.getComputedStyle(el.querySelector('[class*="contentBox"]')).backgroundColor,
        postImageHeight: window.getComputedStyle(el.querySelector('#render-image')).height,
        postImageBg: window.getComputedStyle(el.querySelector('#render-image')).backgroundImage,
      }
    };
  });

  console.log('Computed styles in Browser:');
  console.log(domDump.computedStyles);
  console.log('\nOuter HTML:');
  console.log(domDump.outerHTML);

  await browser.close();
})();
