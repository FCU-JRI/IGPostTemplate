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

  // Select Layout D
  await page.evaluate(() => {
    const sel = document.querySelector('#input-layout');
    sel.value = 'layout-fade';
    sel.dispatchEvent(new Event('input', { bubbles: true }));
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 1000));

  // Check computed styles and bounding box of #export-canvas and its children
  const info = await page.evaluate(() => {
    const el = document.querySelector('#export-canvas');
    const img = document.querySelector('#render-image');
    const content = document.querySelector('.' + el.className.split(' ').find(c => c.includes('layoutRoot')));
    const box = el.querySelector('.' + el.className.split(' ').find(c => c.includes('contentBox')) || 'div');
    const footer = document.querySelector('#render-footer');

    return {
      elRect: el.getBoundingClientRect(),
      elScroll: { scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, offsetHeight: el.offsetHeight },
      imgRect: img ? img.getBoundingClientRect() : null,
      footerRect: footer ? footer.getBoundingClientRect() : null,
      parentTransform: el.parentElement.style.transform,
      computedBg: window.getComputedStyle(el).backgroundColor,
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
    };
  });

  console.log('DOM Info:', JSON.stringify(info, null, 2));

  // Let's test modern-screenshot options directly in the page
  const debugResult = await page.evaluate(async () => {
    const { domToPng, domToSvg } = await import('modern-screenshot');
    const el = document.querySelector('#export-canvas');
    const origTransform = el.parentElement.style.transform;
    el.parentElement.style.transform = 'scale(1)';
    await new Promise(r => setTimeout(r, 100));

    const svg = await domToSvg(el, { width: 1080, height: 1080, scale: 1 });
    el.parentElement.style.transform = origTransform;
    return { svgSnippet: svg.substring(0, 500), svgLength: svg.length, fullSvg: svg };
  });

  fs.writeFileSync(path.join(__dirname, 'debug_fade.svg'), debugResult.fullSvg);
  console.log('Saved debug_fade.svg');

  await browser.close();
})();
