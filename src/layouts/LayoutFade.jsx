import React from 'react';
import LayoutWrapper from './LayoutWrapper';
import styles from './LayoutFade.module.css';

const LayoutFade = ({ state, canvasRef, contentBoxRef }) => {
  const imageStyle = state.image ? { backgroundImage: `url(${state.image})` } : {};

  return (
    <LayoutWrapper 
      state={state} 
      canvasRef={canvasRef} 
      contentBoxRef={contentBoxRef} 
      styles={styles} 
      renderImage={() => (
        <div className={styles.postImage} id="render-image" style={imageStyle}>
          <div className={styles.postImageOverlay}></div>
        </div>
      )}
    />
  );
};

export default LayoutFade;
