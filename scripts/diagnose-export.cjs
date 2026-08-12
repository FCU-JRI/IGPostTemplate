const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const downloadPath = path.resolve(__dirname, 'downloads');
  if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Allow downloads
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });
  
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

  // Native screenshot
  const el = await page.$('#export-canvas');
  if (el) {
    await el.screenshot({ path: path.join(__dirname, 'downloads', 'native.png') });
  }

  // Click export
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const dlBtn = btns.find(b => b.textContent.includes('下載圖片'));
    if (dlBtn) dlBtn.click();
  });
  
  // Wait for file
  let exportedFile = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 500));
    const files = fs.readdirSync(downloadPath);
    const pngs = files.filter(f => f.startsWith('JRI_Post_') && f.endsWith('.png'));
    if (pngs.length > 0) {
      exportedFile = pngs[0];
      break;
    }
  }

  if (exportedFile) {
    console.log(`Success! File downloaded: ${exportedFile}`);
  } else {
    console.log('Failed to download.');
  }

  await browser.close();
})();
