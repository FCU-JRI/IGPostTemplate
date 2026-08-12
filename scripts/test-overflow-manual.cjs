const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5174/IGPostTemplate/');
  
  // Use page.type to simulate real typing
  await page.focus('textarea[placeholder*="內文"]');
  
  // Type 20 lines of text
  const textToType = Array(20).fill('這是一段測試文字用來撐開高度').join('\n');
  await page.keyboard.type(textToType, {delay: 5});
  
  await new Promise(r => setTimeout(r, 1000));
  
  const res = await page.evaluate(() => {
    const box = document.querySelector('.contentBox') || document.querySelector('[class*="contentBox"]');
    const warning = document.querySelector('#overflow-warning');
    return {
      sh: box ? box.scrollHeight : 0,
      ch: box ? box.clientHeight : 0,
      warning: !!warning,
      minH: window.getComputedStyle(box).minHeight
    };
  });
  
  console.log('Layout A:', res);
  await browser.close();
})();
