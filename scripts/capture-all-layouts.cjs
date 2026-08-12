/**
 * capture-all-layouts.cjs
 * Diagnostic script: tests ALL 7 layout variants with the heaviest
 * content (page1 — 8 bullets) to detect overflow / truncation issues
 * across every layout type.
 *
 * Results:
 *   - screenshots saved to scripts/captures/all-layouts/
 *   - pass/fail summary printed to stdout
 *   - exit code 1 if ANY layout fails
 *
 * Usage: node scripts/capture-all-layouts.cjs
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 5173;
const BASE_URL = `http://localhost:${PORT}/IGPostTemplate/`;
const OUTPUT_DIR = path.join(__dirname, '..', 'scripts', 'captures', 'all-layouts');

const { setField, PAGES } = require('./utils/test-helpers.cjs');

// All 7 layouts defined in Control Form
const LAYOUTS = [
  { value: 'layout-text',    label: 'A-純文字' },
  { value: 'layout-split',   label: 'B-上下圖文' },
  { value: 'layout-bg',      label: 'C-滿版底圖' },
  { value: 'layout-fade',    label: 'D-漸層羽化' },
  { value: 'layout-duotone', label: 'E-雙色調' },
  { value: 'layout-glass',   label: 'F-懸浮玻璃' },
  { value: 'layout-caption', label: 'G-底部註解' },
  { value: 'layout-gallery', label: 'H-畫廊展示' },
];

async function setSelect(page, selector, value) {
  await page.evaluate((sel, val) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`Element not found: ${sel}`);
    const proto = window.HTMLSelectElement.prototype;
    const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    nativeSetter.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, selector, value);
}

async function checkStatus(page) {
  const overflow = await page.$('#overflow-warning');
  const shrinkNotice = await page.$('#shrink-notice');
  // Also check the last bullet point is visible in the DOM for page1
  const lastBulletVisible = await page.evaluate(() => {
    const body = document.querySelector('#render-body');
    if (!body) return null;
    const text = body.textContent || '';
    return text.includes('全球唯二取得美國航空氣瓶認證製造商之一');
  });
  return {
    hasOverflowWarning: !!overflow,
    hasShrinkNotice: !!shrinkNotice,
    lastBulletVisible,
  };
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
  await new Promise(r => setTimeout(r, 1500));

  const results = [];

  for (const layout of LAYOUTS) {
    // Switch layout
    await setSelect(page, '#input-layout', layout.value);
    await new Promise(r => setTimeout(r, 400));

    for (const pd of PAGES) {
      const label = `${layout.label}__${pd.id}`;
      process.stdout.write(`\n[${label}] `);

      // Set content
      await setField(page, '#input-title', pd.title);
      await setField(page, '#input-subtitle', pd.subtitle);
      await setField(page, '#input-body', pd.body);

      // Wait for React + rAF shrink loop to settle
      await new Promise(r => setTimeout(r, 1000));

      const { hasOverflowWarning, hasShrinkNotice, lastBulletVisible } = await checkStatus(page);

      const isPage1 = pd.id === 'page1';
      const isConstrainedLayout = ['layout-split', 'layout-fade', 'layout-gallery'].includes(layout.value);

      let failed = false;
      let statusIcon = '✅ OK';

      if (isPage1 && isConstrainedLayout) {
        // We EXPECT an overflow warning here because 8 bullets physically cannot fit in ~45% height.
        if (!hasOverflowWarning) {
          failed = true;
          statusIcon = '❌ FAIL (Expected overflow warning, but got none!)';
        } else {
          statusIcon = '✅ (expected-overflow)';
        }
      } else {
        // Normal layouts should fit, or auto-shrink. If they overflow, it's a failure.
        failed = hasOverflowWarning || (isPage1 && !lastBulletVisible);
        if (failed) {
          statusIcon = '❌ FAIL';
        } else if (hasShrinkNotice) {
          statusIcon = '✅ (auto-shrunk)';
        }
      }

      console.log(statusIcon);
      if (hasOverflowWarning)  console.log('     → overflow-warning visible');
      if (hasShrinkNotice)     console.log('     → shrink-notice visible (font auto-shrunk)');
      if (isPage1 && !lastBulletVisible && !hasOverflowWarning) console.log('     → last bullet NOT in DOM text!');

      // Screenshot
      const canvas = await page.$('#export-canvas');
      if (canvas) {
        const outPath = path.join(OUTPUT_DIR, `${label}.png`);
        await canvas.screenshot({ path: outPath });
        console.log(`     → 📸 ${path.basename(outPath)}`);
      }

      results.push({ label, failed, hasOverflowWarning, hasShrinkNotice, lastBulletVisible });
    }
  }

  await browser.close();

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════');
  console.log('  DIAGNOSIS SUMMARY');
  console.log('═══════════════════════════════════════');
  const failures = results.filter(r => r.failed);
  if (failures.length === 0) {
    console.log('✅  All layouts × all pages pass.');
  } else {
    console.log(`❌  ${failures.length} failure(s) found:\n`);
    for (const f of failures) {
      console.log(`  • ${f.label}`);
      if (f.hasOverflowWarning)  console.log('      overflow-warning present');
      if (!f.lastBulletVisible && f.label.includes('page1'))
        console.log('      last bullet missing from DOM');
    }
  }

  process.exit(failures.length > 0 ? 1 : 0);
})();
