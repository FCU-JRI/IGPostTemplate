import React from 'react';
import LayoutWrapper from './LayoutWrapper';
import styles from './LayoutText.module.css';

const LayoutText = ({ state, canvasRef, contentBoxRef }) => {
  return (
    <LayoutWrapper 
      state={state} 
      canvasRef={canvasRef} 
      contentBoxRef={contentBoxRef} 
      styles={styles} 
    />
  );
};

export default LayoutText;
