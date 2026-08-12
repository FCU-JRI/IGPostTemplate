/**
 * capture-post.cjs
 * Diagnostic script: inject text into the IG Post Template app, capture
 * a screenshot of the #export-canvas element, save it as a PNG.
 *
 * Usage: node scripts/capture-post.cjs
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5174/IGPostTemplate/';
const OUTPUT_DIR = path.join(__dirname, '..', 'scripts', 'captures');

// ── Test data ────────────────────────────────────────────────────────────────
const PAGES = [
  {
    label: 'page1_益材是什麼',
    title: '益材是什麼？',
    subtitle: '',
    body: [
      '•國家太空中心TASA-台灣布局全球衛星供應鏈SATELLITE 2026：衛星推進系統高壓氣瓶',
      '•國家太空中心TASA專案供應商之一',
      '•前瞻火箭中心ARRC合作廠商之一',
      '•全球氣瓶主要製造商之一',
      '',
      '•擁有自行設計研發技術與量產能力',
      '•歐美專業領域認證以及多項專業肯定',
      '•全球唯二取得美國航空氣瓶認證製造商之一',
    ].join('\n'),
  },
  {
    label: 'page2_益材在做什麼',
    title: '益材在做什麼？',
    subtitle: '',
    body: [
      '•鋁合金高壓氣瓶(Type I)',
      '•碳纖維複合氣瓶(Type II, III, IV)',
      '•衛星軌道轉換與姿態控制系統用複合材料氣瓶',
      '•火箭用推進器與氧化劑燃料槽',
    ].join('\n'),
  },
  {
    label: 'page3_益材在哪些地方供應',
    title: '益材在哪些地方供應？',
    subtitle: '',
    body: [
      '•美加地區',
      '•歐洲，澳洲與中東地區',
      '•臺灣',
    ].join('\n'),
  },
];

async function setField(page, selector, value) {
  await page.evaluate((sel, val) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`Element not found: ${sel}`);
    // Use React's internal fiber to trigger onChange properly
    const proto = el.tagName === 'TEXTAREA'
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    nativeSetter.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, selector, value);
}

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=zh-TW'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log(`Opening ${BASE_URL} …`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for fonts / React to settle
  await new Promise(r => setTimeout(r, 1500));

  for (const data of PAGES) {
    console.log(`\nCapturing: ${data.label}`);

    // Set title
    await setField(page, '#input-title', data.title);

    // Clear subtitle  
    await setField(page, '#input-subtitle', data.subtitle);

    // Set body text
    await setField(page, '#input-body', data.body);

    // Wait for React re-render
    await new Promise(r => setTimeout(r, 800));

    // Check overflow warning
    const overflowing = await page.$('#overflow-warning');
    if (overflowing) {
      console.warn(`  ⚠️  OVERFLOW DETECTED for "${data.label}"`);
    } else {
      console.log('  ✅  No overflow');
    }

    // Screenshot of just the export-canvas
    const canvas = await page.$('#export-canvas');
    if (!canvas) {
      console.error('  ❌  #export-canvas not found!');
      continue;
    }

    const outPath = path.join(OUTPUT_DIR, `${data.label}.png`);
    await canvas.screenshot({ path: outPath });
    console.log(`  📸  Saved → ${outPath}`);
  }

  await browser.close();
  console.log('\nDone. All captures saved to:', OUTPUT_DIR);
})();
