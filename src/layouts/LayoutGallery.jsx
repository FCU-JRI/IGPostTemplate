import React from 'react';
import LayoutWrapper from './LayoutWrapper';
import styles from './LayoutGallery.module.css';

const LayoutGallery = ({ state, canvasRef, contentBoxRef }) => {
  const images = state.images || [];

  const renderGallery = () => {
    if (images.length === 0) {
      return (
        <div className={styles.galleryContainer}>
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </span>
            <span style={{ fontSize: '1rem', marginTop: '8px' }}>上傳 1~4 張圖片以套用此畫廊版型</span>
          </div>
        </div>
      );
    }

    // Determine grid class based on number of images
    let gridClass = styles.grid1;
    if (images.length === 2) gridClass = styles.grid2;
    if (images.length === 3) gridClass = styles.grid3;
    if (images.length >= 4) gridClass = styles.grid4;

    // Only render up to 4 images
    const displayImages = images.slice(0, 4);

    return (
      <div className={`${styles.galleryContainer} ${gridClass}`}>
        {displayImages.map((imgData, index) => (
          <div key={index} className={styles.galleryItem}>
            <img 
              src={imgData.url} 
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: imgData.objectFit || 'cover',
                objectPosition: `${imgData.x}% ${imgData.y}%`,
                transformOrigin: `${imgData.x}% ${imgData.y}%`,
                transform: `scale(${imgData.zoom / 100})`
              }}
              alt={`Gallery item ${index + 1}`}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <LayoutWrapper 
      state={state} 
      canvasRef={canvasRef} 
      contentBoxRef={contentBoxRef}
      styles={styles} 
      renderImage={renderGallery}
    />
  );
};

export default LayoutGallery;
