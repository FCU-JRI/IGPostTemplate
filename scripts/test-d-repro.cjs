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
  
  await new Promise(r => setTimeout(r, 1500));
  
  const res = await page.evaluate(() => {
    const box = document.querySelector('.contentBox') || document.querySelector('[class*="contentBox"]');
    const warning = document.querySelector('#overflow-warning');
    const shrink = document.querySelector('#shrink-notice');
    return {
      sh: box ? box.scrollHeight : 0,
      ch: box ? box.clientHeight : 0,
      warning: !!warning,
      shrunk: !!shrink,
      fontSize: document.querySelector('#render-body') ? document.querySelector('#render-body').style.fontSize : 'unknown'
    };
  });
  
  console.log(`Layout D | Warning: ${res.warning} | Shrunk: ${res.shrunk} | font: ${res.fontSize} | sh: ${res.sh} | ch: ${res.ch}`);

  // Take screenshot of the export canvas
  const el = await page.$('#export-canvas');
  if (el) {
    await el.screenshot({ path: 'd_repro.png' });
  }

  await browser.close();
})();
