const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://localhost:5174/IGPostTemplate/');

  await page.focus('textarea');
  await page.keyboard.down('Meta');
  await page.keyboard.press('a');
  await page.keyboard.up('Meta');
  await page.keyboard.press('Backspace');
  
  const longText = Array(30).fill('這是一段非常長非常長的測試文字，用來徹底塞爆。').join('\n');
  await page.keyboard.type(longText, { delay: 1 });
  
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
  
  await new Promise(r => setTimeout(r, 1000));
  await browser.close();
})();
