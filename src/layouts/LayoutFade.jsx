import React from 'react';
import LayoutWrapper from './LayoutWrapper';
import styles from './LayoutFade.module.css';

const LayoutFade = ({ state, canvasRef, contentBoxRef }) => {
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
            <>
              <img 
                src={imgData.url} 
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover',
                  objectPosition: `${imgData.x}% ${imgData.y}%`,
                  transform: `scale(${imgData.zoom / 100})`
                }}
                alt="fade-bg"
              />
              <div className={styles.postImageOverlay} style={{ position: 'absolute', inset: 0 }} />
            </>
          )}
        </div>
      )}
    />
  );
};

export default LayoutFade;
