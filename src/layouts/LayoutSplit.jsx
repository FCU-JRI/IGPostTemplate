import React from 'react';
import LayoutWrapper from './LayoutWrapper';
import styles from './LayoutSplit.module.css';

const LayoutSplit = ({ state, canvasRef, contentBoxRef }) => {
  const imageStyle = state.image ? { backgroundImage: `url(${state.image})` } : {};

  return (
    <LayoutWrapper 
      state={state} 
      canvasRef={canvasRef} 
      contentBoxRef={contentBoxRef} 
      styles={styles} 
      renderImage={() => (
        <div className={styles.postImage} id="render-image" style={imageStyle}>
          {!state.image && (
            <div className={styles.emptyImageState}>
              <span className={styles.emptyIcon}>📷</span>
              <span className={styles.emptyText}>上傳圖片以套用此版型</span>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default LayoutSplit;
