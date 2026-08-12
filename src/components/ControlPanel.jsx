import React from 'react';
import styles from './ControlPanel.module.css';

const ControlPanel = ({ state, dispatch, handleExport, isExporting }) => {
  const handleChange = (field, value) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      zoom: 100,
      x: 50,
      y: 50
    }));
    dispatch({ type: 'UPDATE_FIELD', field: 'images', value: [...(state.images || []), ...newImages] });
    // Switch selection to the first newly uploaded image
    dispatch({ type: 'UPDATE_FIELD', field: 'selectedImageIndex', value: (state.images || []).length });
    // Reset file input so the same files can be selected again if needed
    e.target.value = '';
  };

  const handleRemoveImage = (e, indexToRemove) => {
    e.stopPropagation(); // Prevent selecting the image when clicking the remove button
    const newImages = (state.images || []).filter((_, index) => index !== indexToRemove);
    dispatch({ type: 'UPDATE_FIELD', field: 'images', value: newImages });
    
    // Adjust selected index if necessary
    if (state.selectedImageIndex >= newImages.length) {
      dispatch({ type: 'UPDATE_FIELD', field: 'selectedImageIndex', value: Math.max(0, newImages.length - 1) });
    } else if (state.selectedImageIndex === indexToRemove) {
      dispatch({ type: 'UPDATE_FIELD', field: 'selectedImageIndex', value: Math.max(0, indexToRemove - 1) });
    }
  };

  const handleImagePropChange = (prop, value) => {
    dispatch({ 
      type: 'UPDATE_IMAGE_PROP', 
      index: state.selectedImageIndex, 
      prop, 
      value: parseInt(value, 10) 
    });
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
          <option value="layout-gallery">H: 畫廊展示 (Adaptive Gallery)</option>
        </select>
      </div>

      {state.layout !== 'layout-text' && (
        <div className={styles.formGroup} id="image-upload-group">
          <label htmlFor="input-image">上傳圖片 (Images)</label>
          <input 
            type="file" 
            id="input-image" 
            accept="image/*" 
            multiple 
            className={styles.fileInput} 
            onChange={handleImageUpload} 
          />

          {state.images && state.images.length > 0 && (
            <div className={styles.imagePreviewList} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
              {state.images.map((imgData, index) => {
                const isSelected = index === state.selectedImageIndex;
                return (
                  <div 
                    key={index}
                    role="button"
                    tabIndex={0}
                    onClick={() => dispatch({ type: 'UPDATE_FIELD', field: 'selectedImageIndex', value: index })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        dispatch({ type: 'UPDATE_FIELD', field: 'selectedImageIndex', value: index });
                      }
                    }}
                    aria-label={`選取圖片 ${index + 1}`}
                    aria-pressed={isSelected}
                    style={{ 
                      position: 'relative', 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '6px', 
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: isSelected ? '3px solid var(--color-panel-accent)' : '1px solid var(--color-panel-border)',
                      boxShadow: isSelected ? '0 0 0 2px var(--color-panel-accent-transparent)' : 'none',
                      transition: 'transform 0.15s ease-out, border-color 0.15s ease-out, box-shadow 0.15s ease-out',
                      transform: isSelected ? 'translateY(-2px)' : 'none',
                      padding: 0,
                      background: 'none'
                    }}
                  >
                    <img src={imgData.url} alt={`preview-${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      type="button"
                      onClick={(e) => handleRemoveImage(e, index)}
                      style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, padding: 0 }}
                      title="移除圖片"
                      aria-label="移除圖片"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    {isSelected && (
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--color-panel-accent)', color: 'var(--color-panel-text)', fontSize: '10px', textAlign: 'center', padding: '2px 0' }}>
                        調整中
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {state.images && state.images.length > 0 && state.images[state.selectedImageIndex] && (
            <div className={styles.sliderGroup} style={{ marginTop: '20px', padding: '12px', background: 'var(--ig-bg)', borderRadius: '8px', border: '1px solid var(--ig-border)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--ig-text-muted)', marginBottom: '12px', fontWeight: '500' }}>
                目前控制: 圖片 {state.selectedImageIndex + 1}
              </div>
              <div className={styles.sliderItem}>
                <label htmlFor="input-zoom">縮放比例 ({state.images[state.selectedImageIndex].zoom}%)</label>
                <input type="range" id="input-zoom" min="100" max="300" value={state.images[state.selectedImageIndex].zoom} onChange={(e) => handleImagePropChange('zoom', e.target.value)} />
              </div>
              <div className={styles.sliderItem}>
                <label htmlFor="input-x">左右平移 ({state.images[state.selectedImageIndex].x}%)</label>
                <input type="range" id="input-x" min="0" max="100" value={state.images[state.selectedImageIndex].x} onChange={(e) => handleImagePropChange('x', e.target.value)} />
              </div>
              <div className={styles.sliderItem}>
                <label htmlFor="input-y">上下平移 ({state.images[state.selectedImageIndex].y}%)</label>
                <input type="range" id="input-y" min="0" max="100" value={state.images[state.selectedImageIndex].y} onChange={(e) => handleImagePropChange('y', e.target.value)} />
              </div>
            </div>
          )}
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
          <div id="shrink-notice" style={{ color: 'var(--color-panel-accent)', fontSize: '0.85rem', marginTop: '8px' }}>
            ℹ️ 字體已自動縮小以顯示全部文字。
          </div>
        )}
        {state.isOverflowing && (
          <div id="overflow-warning" style={{ color: 'var(--color-panel-danger)', fontSize: '0.85rem', marginTop: '8px' }}>
            ⚠️ 警告：文字過多，建議拆成兩頁輸入。
          </div>
        )}
      </div>

      <fieldset className={styles.formGroup} style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.5rem' }}>Logo 位置 (Logo Position)</legend>
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
      </fieldset>

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
