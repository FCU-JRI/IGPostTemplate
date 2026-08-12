import React from 'react';
import LayoutWrapper from './LayoutWrapper';
import styles from './LayoutGlass.module.css';

const LayoutGlass = ({ state, canvasRef, contentBoxRef }) => {
  const imageStyle = state.image ? { backgroundImage: `url(${state.image})` } : {};

  return (
    <LayoutWrapper 
      state={state} 
      canvasRef={canvasRef} 
      contentBoxRef={contentBoxRef} 
      styles={styles} 
      renderImage={() => (
        <div className={styles.postImage} id="render-image" style={imageStyle}></div>
      )}
    />
  );
};

export default LayoutGlass;
