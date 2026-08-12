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

const { setField, PAGES } = require('./utils/test-helpers.cjs');

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
