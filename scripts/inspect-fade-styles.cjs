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

  // Hook domToPng inside Vite bundle to capture SVG
  const svgData = await page.evaluate(async () => {
    const el = document.querySelector('#export-canvas');
    // Let's inspect the style of all elements
    const styles = [];
    const walk = (node) => {
      if (node.nodeType === 1) {
        styles.push({
          tag: node.tagName,
          className: node.className,
          id: node.id,
          computedBg: window.getComputedStyle(node).backgroundColor,
          computedColor: window.getComputedStyle(node).color,
          computedBgImage: window.getComputedStyle(node).backgroundImage,
          rect: node.getBoundingClientRect(),
        });
        for (const child of node.children) walk(child);
      }
    };
    walk(el);
    return styles;
  });

  console.log('DOM Tree styles:', JSON.stringify(svgData, null, 2));

  await browser.close();
})();
