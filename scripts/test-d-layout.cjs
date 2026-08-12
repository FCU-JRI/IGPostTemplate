const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174/IGPostTemplate/');

  // Use correct selector for textarea
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
  
  const res = await page.evaluate(() => {
    const box = document.querySelector('.contentBox') || document.querySelector('[class*="contentBox"]');
    const warning = document.querySelector('#overflow-warning');
    return {
      sh: box ? box.scrollHeight : 0,
      ch: box ? box.clientHeight : 0,
      warning: !!warning,
      jc: window.getComputedStyle(box).justifyContent,
      minH: window.getComputedStyle(box).minHeight
    };
  });
  
  console.log(`Layout D | Warning: ${res.warning} | scrollHeight: ${res.sh} | clientHeight: ${res.ch} | jc: ${res.jc} | minH: ${res.minH}`);

  await browser.close();
})();
