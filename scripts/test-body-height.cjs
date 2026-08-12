const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5174/IGPostTemplate/');

  const longText = Array(100).fill('這是一段非常長非常長的測試文字，用來徹底塞爆。').join('\\n');
  
  await page.evaluate((text) => {
    const textarea = document.querySelector('textarea[placeholder*="內文"]');
    if (textarea) {
      textarea.value = text;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, longText);
  
  await new Promise(r => setTimeout(r, 500));

  const res = await page.evaluate(() => {
    const bodyEl = document.querySelector('#render-body');
    const box = document.querySelector('.contentBox') || document.querySelector('[class*="contentBox"]');
    return {
      body_sh: bodyEl ? bodyEl.scrollHeight : 0,
      body_ch: bodyEl ? bodyEl.clientHeight : 0,
      body_bounds: bodyEl ? bodyEl.getBoundingClientRect().height : 0,
      box_sh: box ? box.scrollHeight : 0,
      box_ch: box ? box.clientHeight : 0,
    };
  });
  
  console.log(res);

  await browser.close();
})();
