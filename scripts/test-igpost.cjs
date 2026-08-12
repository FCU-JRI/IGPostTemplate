const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5174/IGPostTemplate/');

  const layouts = ['layout-text', 'layout-split', 'layout-fade'];

  // 100 lines
  const longText = Array(100).fill('這是一段非常長非常長的測試文字，用來徹底塞爆。').join('\\n');
  
  await page.evaluate((text) => {
    const textarea = document.querySelector('textarea[placeholder*="內文"]');
    if (textarea) {
      textarea.value = text;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, longText);
  
  await new Promise(r => setTimeout(r, 500));

  for (const layout of layouts) {
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
    
    const res = await page.evaluate(() => {
      const igPost = document.querySelector('.igPost') || document.querySelector('[class*="igPost"]');
      const box = document.querySelector('.contentBox') || document.querySelector('[class*="contentBox"]');
      return { 
        ig_sh: igPost ? igPost.scrollHeight : 0, 
        ig_ch: igPost ? igPost.clientHeight : 0,
        box_sh: box ? box.scrollHeight : 0,
        box_ch: box ? box.clientHeight : 0
      };
    });
    
    console.log(`Layout: ${layout} | igPost: sh=${res.ig_sh} ch=${res.ig_ch} | box: sh=${res.box_sh} ch=${res.box_ch}`);
  }

  await browser.close();
})();
