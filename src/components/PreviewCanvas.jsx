import React, { useRef, useEffect } from 'react';
import LayoutText from '../layouts/LayoutText';
import LayoutSplit from '../layouts/LayoutSplit';
import LayoutBg from '../layouts/LayoutBg';
import LayoutFade from '../layouts/LayoutFade';
import LayoutDuotone from '../layouts/LayoutDuotone';
import LayoutGlass from '../layouts/LayoutGlass';
import LayoutCaption from '../layouts/LayoutCaption';
import styles from './PreviewCanvas.module.css';

const LAYOUT_COMPONENTS = {
  'layout-text': LayoutText,
  'layout-split': LayoutSplit,
  'layout-bg': LayoutBg,
  'layout-fade': LayoutFade,
  'layout-duotone': LayoutDuotone,
  'layout-glass': LayoutGlass,
  'layout-caption': LayoutCaption,
};

const PreviewCanvas = ({ state, canvasRef, wrapperRef, checkOverflow }) => {
  const contentBoxRef = useRef(null);

  // Resize logic
  useEffect(() => {
    const handleResize = () => {
      if (!wrapperRef.current) return;
      const panel = wrapperRef.current.parentElement;
      const panelWidth = panel.clientWidth;
      const panelHeight = panel.clientHeight;
      const padding = 80;
      
      const availableWidth = panelWidth - padding;
      const availableHeight = panelHeight - padding;
      
      const scale = Math.min(
        availableWidth / 1080,
        availableHeight / 1080,
        1
      );
      
      wrapperRef.current.style.transform = `scale(${scale})`;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [wrapperRef]);

  // Check overflow when text or layout changes
  useEffect(() => {
    if (contentBoxRef.current) {
      const isOverflowing = contentBoxRef.current.scrollHeight > contentBoxRef.current.clientHeight;
      checkOverflow(isOverflowing);
    }
  }, [state.title, state.body, state.subtitle, state.layout, state.theme, checkOverflow]);

  const SpecificLayout = LAYOUT_COMPONENTS[state.layout] || LayoutText;

  return (
    <main className={styles.previewPanel}>
      <div 
        className={styles.canvasWrapper} 
        ref={wrapperRef}
      >
        {SpecificLayout && <SpecificLayout state={state} canvasRef={canvasRef} contentBoxRef={contentBoxRef} />}
      </div>
    </main>
  );
};

export default PreviewCanvas;
