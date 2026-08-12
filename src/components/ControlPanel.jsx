import React from 'react';
import styles from './ControlPanel.module.css';

const ControlPanel = ({ state, dispatch, handleExport, isExporting }) => {
  const handleChange = (field, value) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    dispatch({ type: 'UPDATE_FIELD', field: 'image', value: url });
  };

  return (
    <aside className={styles.controlPanel}>
      <h2>編輯貼文內容</h2>

      <div className={styles.formGroup}>
        <label htmlFor="input-theme">色彩主題 (Color Theme)</label>
        <select
          id="input-theme"
          className={styles.selectInput}
          value={state.theme}
          onChange={(e) => handleChange('theme', e.target.value)}
        >
          <option value="theme-crimson">尊爵熾紅 (Crimson)</option>
          <option value="theme-light">極簡晨白 (Light)</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="input-font">字體選擇 (Font Family)</label>
        <select
          id="input-font"
          className={styles.selectInput}
          value={state.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
        >
          <option value="font-sans">現代黑體 (Noto Sans TC)</option>
          <option value="font-serif">典雅明體 (Noto Serif TC)</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="input-layout">版式選擇 (Layout Style)</label>
        <select
          id="input-layout"
          className={styles.selectInput}
          value={state.layout}
          onChange={(e) => handleChange('layout', e.target.value)}
        >
          <option value="layout-text">A: 純文字</option>
          <option value="layout-split">B: 上下圖文</option>
          <option value="layout-bg">C: 滿版底圖</option>
          <option value="layout-fade">D: 漸層羽化</option>
          <option value="layout-duotone">E: 雙色調</option>
          <option value="layout-glass">F: 懸浮玻璃</option>
          <option value="layout-caption">G: 底部註解 (Caption)</option>
        </select>
      </div>

      {state.layout !== 'layout-text' && (
        <div className={styles.formGroup} id="image-upload-group">
          <label htmlFor="input-image">上傳圖片 (Image)</label>
          <input type="file" id="input-image" accept="image/*" className={styles.fileInput} onChange={handleImageUpload} />

          <div className={styles.sliderGroup}>
            <div className={styles.sliderItem}>
              <label htmlFor="input-zoom">縮放比例</label>
              <input type="range" id="input-zoom" min="100" max="300" value={state.zoom} onChange={(e) => handleChange('zoom', e.target.value)} />
            </div>
            <div className={styles.sliderItem}>
              <label htmlFor="input-x">左右平移</label>
              <input type="range" id="input-x" min="0" max="100" value={state.x} onChange={(e) => handleChange('x', e.target.value)} />
            </div>
            <div className={styles.sliderItem}>
              <label htmlFor="input-y">上下平移</label>
              <input type="range" id="input-y" min="0" max="100" value={state.y} onChange={(e) => handleChange('y', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="input-title">大標題 (Title)</label>
        <textarea
          id="input-title"
          rows="2"
          placeholder="請輸入主標題..."
          value={state.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className={styles.textArea}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="input-subtitle">副標題 (Subtitle)</label>
        <input
          type="text"
          id="input-subtitle"
          placeholder="請輸入副標題..."
          value={state.subtitle}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          className={styles.textInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="input-body">內文 (Body text)</label>
        <textarea
          id="input-body"
          rows="6"
          placeholder="請輸入主要說明文字..."
          value={state.body}
          onChange={(e) => handleChange('body', e.target.value)}
          className={styles.textArea}
        />
        {state.bodyFontShrunk && !state.isOverflowing && (
          <div id="shrink-notice" style={{ color: '#60a5fa', fontSize: '0.85rem', marginTop: '8px' }}>
            ℹ️ 字體已自動縮小以顯示全部文字。
          </div>
        )}
        {state.isOverflowing && (
          <div id="overflow-warning" style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '8px' }}>
            ⚠️ 警告：文字過多，建議拆成兩頁輸入。
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>Logo 位置 (Logo Position)</label>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              name="logo-position"
              value="logo-bottom-left"
              checked={state.logoPosition === 'logo-bottom-left'}
              onChange={() => handleChange('logoPosition', 'logo-bottom-left')}
            /> 左下角
          </label>
          <label>
            <input
              type="radio"
              name="logo-position"
              value="logo-bottom-right"
              checked={state.logoPosition === 'logo-bottom-right'}
              onChange={() => handleChange('logoPosition', 'logo-bottom-right')}
            /> 右下角
          </label>
        </div>
      </div>

      <button id="btn-download" className={styles.btnPrimary} onClick={handleExport} disabled={isExporting}>
        {isExporting ? '正在產生圖片...' : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            下載 IG 貼文 (1080x1080)
          </>
        )}
      </button>
      <p className={styles.helpText}>提示: 畫面右側即為最終輸出的排版結果。</p>
    </aside>
  );
};

export default ControlPanel;
