const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:5174/IGPostTemplate/');

  const layouts = ['layout-text', 'layout-split', 'layout-fade'];

  const longText = Array(100).fill('這是一段非常長非常長的測試文字，用來徹底塞爆。').join('\n');
  
  await page.evaluate((text) => {
    const textarea = document.querySelector('textarea[placeholder*="內文"]');
    if (textarea) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
      nativeInputValueSetter.call(textarea, text);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, longText);
  
  await new Promise(r => setTimeout(r, 500));

  for (const layout of layouts) {
    console.log('Testing layout:', layout);
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
    
    await new Promise(r => setTimeout(r, 800));
  }

  await browser.close();
})();
