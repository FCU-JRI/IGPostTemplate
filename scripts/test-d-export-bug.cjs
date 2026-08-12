const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174/IGPostTemplate/');

  await page.focus('textarea');
  await page.keyboard.down('Meta');
  await page.keyboard.press('a');
  await page.keyboard.up('Meta');
  await page.keyboard.press('Backspace');
  
  const text = "•國家太空中心TASA-台灣布局全球衛星供應鏈SATELLITE 2026：衛星推進系統高壓氣瓶\n•國家太空中心TASA專案供應商之一\n•前瞻火箭中心ARRC合作廠商之一\n•全球氣瓶主要製造商之一";
  
  await page.evaluate((txt) => {
    const textarea = document.querySelector('textarea[placeholder*="內文"]');
    if (textarea) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
      nativeInputValueSetter.call(textarea, txt);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, text);
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    for (const sel of selects) {
      for (const opt of sel.options) {
        if (opt.value === 'layout-fade') {
          sel.value = 'layout-fade';
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  });
  
  await new Promise(r => setTimeout(r, 2000));

  // Take screenshot of the web preview (native browser render)
  const el = await page.$('#export-canvas');
  if (el) {
    await el.screenshot({ path: 'd_web_preview.png' });
  }

  // Trigger modern-screenshot export
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('下載圖片'));
    if (btn) btn.click();
  });
  
  // Wait for the download blob to be available in localStorage or generated image
  // Actually, let's just use modern-screenshot directly in the page to get the data URL
  const dataUrl = await page.evaluate(async () => {
    const canvas = document.querySelector('#export-canvas');
    if (!window.modernScreenshot) return null; // We might need to import it if it's not global
    // The App.jsx uses domToPng from 'modern-screenshot'
    // Let's just mock a click on the export button and intercept the download
    return new Promise(resolve => {
      // Intercept the download
      const originalCreateElement = document.createElement;
      document.createElement = function(tagName) {
        if (tagName.toLowerCase() === 'a') {
          const a = originalCreateElement.call(document, tagName);
          let href = '';
          Object.defineProperty(a, 'href', {
            set: function(val) { href = val; },
            get: function() { return href; }
          });
          a.click = function() { resolve(href); };
          return a;
        }
        return originalCreateElement.call(document, tagName);
      };
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('下載圖片'));
      if (btn) btn.click();
    });
  });

  if (dataUrl && dataUrl.startsWith('data:image/png;base64,')) {
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync('d_exported_image.png', base64Data, 'base64');
  }

  await browser.close();
})();
