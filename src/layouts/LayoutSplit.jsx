import React from 'react';
import LayoutWrapper from './LayoutWrapper';
import styles from './LayoutSplit.module.css';

const LayoutSplit = ({ state, canvasRef, contentBoxRef }) => {
  const imgData = state.images?.[0];

  return (
    <LayoutWrapper 
      state={state} 
      canvasRef={canvasRef} 
      contentBoxRef={contentBoxRef} 
      styles={styles} 
      renderImage={() => (
        <div className={styles.postImage} id="render-image">
          {imgData && (
            <img 
              src={imgData.url} 
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: `${imgData.x}% ${imgData.y}%`,
                transformOrigin: `${imgData.x}% ${imgData.y}%`,
                transform: `scale(${imgData.zoom / 100})`
              }}
              alt="split-bg"
            />
          )}
          {!state.images?.[0] && (
            <div className={styles.emptyImageState} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--ig-text-muted)' }}>
              <span className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </span>
              <p style={{ marginTop: '10px' }}>請上傳圖片</p>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default LayoutSplit;
