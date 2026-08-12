const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5174/IGPostTemplate/');

  const layouts = [
    'layout-text',
    'layout-split',
    'layout-bg',
    'layout-fade',
    'layout-duotone',
    'layout-glass',
    'layout-caption'
  ];

  const longText = Array(20).fill('這是一段非常非常長的測試文字，用來把內文區塊塞爆。').join('\\n');
  
  // Set the text
  await page.evaluate((text) => {
    // Find a way to dispatch state to App, or simply fill the textarea if it exists
    const textarea = document.querySelector('textarea[placeholder*="內文"]');
    if (textarea) {
      textarea.value = text;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, longText);
  
  // Wait a bit for React to update
  await new Promise(r => setTimeout(r, 500));

  for (const layout of layouts) {
    // Change layout
    await page.evaluate((l) => {
      const selects = document.querySelectorAll('select');
      for (const sel of selects) {
        for (const opt of sel.options) {
          if (opt.value === l) {
            sel.value = l;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }
    }, layout);
    
    // Wait for resize and checkOverflow
    await new Promise(r => setTimeout(r, 500));
    
    const hasWarning = await page.evaluate(() => {
      return !!document.querySelector('#overflow-warning');
    });
    
    const { sh, ch } = await page.evaluate(() => {
      const box = document.querySelector('.contentBox') || document.querySelector('[class*="contentBox"]');
      return box ? { sh: box.scrollHeight, ch: box.clientHeight } : { sh: 0, ch: 0 };
    });
    
    console.log(`Layout: ${layout} | Warning: ${hasWarning} | scrollHeight: ${sh} | clientHeight: ${ch}`);
  }

  await browser.close();
})();
