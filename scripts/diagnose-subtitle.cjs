const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto('http://localhost:5173/IGPostTemplate/', { waitUntil: 'networkidle0' });

  // Set Layout Fade
  await page.evaluate(() => {
    const sel = document.querySelector('#input-layout');
    sel.value = 'layout-fade';
    sel.dispatchEvent(new Event('input', { bubbles: true }));
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 500));

  // Set Title, Subtitle, Body
  await page.evaluate(() => {
    const title = document.querySelector('#input-title');
    title.value = '重要政策公告';
    title.dispatchEvent(new Event('input', { bubbles: true }));
    
    const subtitle = document.querySelector('#input-subtitle');
    subtitle.value = '最新消息發布';
    subtitle.dispatchEvent(new Event('input', { bubbles: true }));

    const body = document.querySelector('#input-body');
    body.value = '・國家太空中心TASA-台灣布局全球衛星供應鏈SATELLITE 2026：衛星推進系統高壓氣瓶\n・國家太空中心TASA專案供應商之一\n・前瞻火箭中心ARRC合作廠商之一\n・全球氣瓶主要製造商之一';
    body.dispatchEvent(new Event('input', { bubbles: true }));
  });

  await new Promise(r => setTimeout(r, 1000));

  // Check state
  const state = await page.evaluate(() => {
    const box = document.querySelector('.' + document.querySelector('#export-canvas').className.split(' ').find(c => c.includes('layoutRoot'))).querySelector('div:nth-child(2)');
    const title = document.querySelector('#render-title');
    const subtitle = document.querySelector('#render-subtitle');
    const body = document.querySelector('#render-body');
    const warning = document.querySelector('#overflow-warning');
    const notice = document.querySelector('#shrink-notice');

    return {
      boxScroll: box ? box.scrollHeight : null,
      boxClient: box ? box.clientHeight : null,
      titleSize: title ? window.getComputedStyle(title).fontSize : null,
      bodySize: body ? window.getComputedStyle(body).fontSize : null,
      subtitleVisible: subtitle ? window.getComputedStyle(subtitle).display !== 'none' : false,
      hasWarning: !!warning,
      hasNotice: !!notice
    };
  });

  console.log('State:', state);
  await browser.close();
})();
