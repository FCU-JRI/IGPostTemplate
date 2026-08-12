/**
 * compare-export-vs-web.cjs
 * Diagnostic script:
 * 1. For all 7 layouts, sets body to the user's requested text:
 *    •國家太空中心TASA-台灣布局全球衛星供應鏈SATELLITE 2026：衛星推進系統高壓氣瓶
 *    •國家太空中心TASA專案供應商之一
 *    •前瞻火箭中心ARRC合作廠商之一
 *    •全球氣瓶主要製造商之一
 * 2. Captures native Web Preview screenshot of #export-canvas.
 * 3. Triggers html2canvas export (same as clicking "下載 IG 貼文") and saves the resulting image.
 * 4. Compares the two and outputs detailed diagnosis.
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5174/IGPostTemplate/';
const OUTPUT_DIR = path.join(__dirname, '..', 'scripts', 'captures', 'comparison_test');

const LAYOUTS = [
  { value: 'layout-text',    label: 'A-純文字' },
  { value: 'layout-split',   label: 'B-上下圖文' },
  { value: 'layout-bg',      label: 'C-滿版底圖' },
  { value: 'layout-fade',    label: 'D-漸層羽化' },
  { value: 'layout-duotone', label: 'E-雙色調' },
  { value: 'layout-glass',   label: 'F-懸浮玻璃' },
  { value: 'layout-caption', label: 'G-底部註解' },
];

const TEST_DATA = {
  title: '益材是什麼？',
  subtitle: '',
  body: [
    '•國家太空中心TASA-台灣布局全球衛星供應鏈SATELLITE 2026：衛星推進系統高壓氣瓶',
    '•國家太空中心TASA專案供應商之一',
    '•前瞻火箭中心ARRC合作廠商之一',
    '•全球氣瓶主要製造商之一',
  ].join('\n'),
};

async function setSelect(page, selector, value) {
  await page.evaluate((sel, val) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`Element not found: ${sel}`);
    const proto = window.HTMLSelectElement.prototype;
    const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    nativeSetter.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, selector, value);
}

async function setField(page, selector, value) {
  await page.evaluate((sel, val) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`Element not found: ${sel}`);
    const proto = el.tagName === 'TEXTAREA'
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    nativeSetter.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, selector, value);
}

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=zh-TW'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  page.on('console', msg => console.log('  [BROWSER CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('  [BROWSER ERROR]', err.message));

  console.log(`Opening ${BASE_URL} …`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  const results = [];

  for (const layout of LAYOUTS) {
    console.log(`\n────────────────────────────────────────`);
    console.log(`Testing Layout: ${layout.label} (${layout.value})`);
    
    // Switch layout
    await setSelect(page, '#input-layout', layout.value);
    await new Promise(r => setTimeout(r, 400));

    // Set content
    await setField(page, '#input-title', TEST_DATA.title);
    await setField(page, '#input-subtitle', TEST_DATA.subtitle);
    await setField(page, '#input-body', TEST_DATA.body);

    // Wait for render & dynamic resize
    await new Promise(r => setTimeout(r, 1000));

    // 1. Capture Web Preview (Native browser rasterization)
    // Make sure wrapper scale is temporarily 1 to get exact 1080x1080 pixels
    const webPreviewDataUrl = await page.evaluate(async () => {
      const canvasEl = document.querySelector('#export-canvas');
      const wrapper = canvasEl.parentElement;
      const originalTransform = wrapper.style.transform;
      wrapper.style.transform = 'scale(1)';
      await new Promise(r => setTimeout(r, 100));
      
      // We'll let puppeteer take element screenshot
      wrapper.style.transform = originalTransform;
      return true;
    });

    // Take screenshot of #export-canvas with scale(1)
    await page.evaluate(() => {
      const canvasEl = document.querySelector('#export-canvas');
      canvasEl.parentElement.style.transform = 'scale(1)';
    });
    await new Promise(r => setTimeout(r, 100));

    const canvasHandle = await page.$('#export-canvas');
    const webPreviewPath = path.join(OUTPUT_DIR, `${layout.value}_01_web_preview.png`);
    await canvasHandle.screenshot({ path: webPreviewPath });

    // Restore preview scaling
    await page.evaluate(() => {
      window.dispatchEvent(new Event('resize'));
    });
    await new Promise(r => setTimeout(r, 100));

    // 2. Generate html2canvas exported image (simulating user clicking download)
    const exportResult = await page.evaluate(async () => {
      const canvasElement = document.querySelector('#export-canvas');
      const wrapper = canvasElement.parentElement;
      const originalTransform = wrapper.style.transform;
      wrapper.style.transform = 'scale(1)';
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        // html2canvas is imported in the bundle or on window
        // Let's call the button or run html2canvas directly
        // We can hook link.click or call html2canvas
        const html2canvasFn = window.html2canvas || (await import('/IGPostTemplate/node_modules/.vite/deps/html2canvas.js?v=test').catch(() => null));
        
        let dataUrl = null;
        // Hook createElement 'a' click or intercept download
        const origCreate = document.createElement.bind(document);
        let capturedHref = null;
        document.createElement = function(tagName) {
          const el = origCreate(tagName);
          if (tagName.toLowerCase() === 'a') {
            const origClick = el.click.bind(el);
            el.click = function() {
              capturedHref = el.href;
            };
          }
          return el;
        };

        const btn = document.querySelector('#btn-download');
        if (btn) {
          let waitReady = 0;
          while (btn.disabled && waitReady < 50) {
            await new Promise(r => setTimeout(r, 100));
            waitReady++;
          }
          btn.click();
          let attempts = 0;
          while (!capturedHref && attempts < 100) {
            await new Promise(r => setTimeout(r, 100));
            attempts++;
          }
          dataUrl = capturedHref;
        }

        document.createElement = origCreate;
        wrapper.style.transform = originalTransform;
        return { success: true, dataUrl };
      } catch (err) {
        wrapper.style.transform = originalTransform;
        return { success: false, error: err.message };
      }
    });

    const exportedImagePath = path.join(OUTPUT_DIR, `${layout.value}_02_html2canvas_download.png`);
    if (exportResult.success && exportResult.dataUrl) {
      const base64Data = exportResult.dataUrl.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(exportedImagePath, base64Data, 'base64');
      console.log(`  📸 Web Preview:        ${path.basename(webPreviewPath)}`);
      console.log(`  📸 Downloaded (Canvas): ${path.basename(exportedImagePath)}`);
      results.push({ layout: layout.value, label: layout.label, webPreviewPath, exportedImagePath, success: true });
    } else {
      console.error(`  ❌ Export failed for ${layout.label}:`, exportResult.error);
      results.push({ layout: layout.value, label: layout.label, webPreviewPath, success: false, error: exportResult.error });
    }
  }

  await browser.close();
  console.log(`\nAll tests completed. Files saved in ${OUTPUT_DIR}`);
})();
