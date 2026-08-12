/**
 * Shared test utilities for capturing layouts
 */

async function setField(page, selector, text) {
  await page.evaluate((sel, txt) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`Element not found: ${sel}`);
    const proto = el.tagName === 'TEXTAREA'
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    nativeSetter.call(el, txt);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, selector, text);
}

const PAGES = [
  {
    id: 'page1',
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
    id: 'page2',
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
    id: 'page3',
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

module.exports = {
  setField,
  PAGES
};
