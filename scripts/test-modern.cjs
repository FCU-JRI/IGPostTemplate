const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1350 });

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

  // Test domToPng vs native screenshot
  const result = await page.evaluate(async () => {
    const el = document.querySelector('#export-canvas');
    const { domToPng, domToCanvas, domToSvg } = await import('/IGPostTemplate/node_modules/modern-screenshot/dist/index.js');
    
    const origTransform = el.parentElement.style.transform;
    el.parentElement.style.transform = 'scale(1)';
    await new Promise(r => setTimeout(r, 100));

    // Test with backgroundColor: null vs backgroundColor: '#09090b'
    const pngDefault = await domToPng(el, { scale: 1, width: 1080, height: 1350 });
    const pngTransparent = await domToPng(el, { scale: 1, backgroundColor: 'transparent', width: 1080, height: 1350 });
    const svgString = await domToSvg(el, { scale: 1, width: 1080, height: 1350 });

    el.parentElement.style.transform = origTransform;

    return { pngDefault, pngTransparent, svgString };
  });

  fs.writeFileSync('test_png_default.png', result.pngDefault.replace(/^data:image\/png;base64,/, ''), 'base64');
  fs.writeFileSync('test_png_transparent.png', result.pngTransparent.replace(/^data:image\/png;base64,/, ''), 'base64');
  fs.writeFileSync('test_svg.svg', result.svgString);
  console.log('Saved test files!');

  await browser.close();
})();
