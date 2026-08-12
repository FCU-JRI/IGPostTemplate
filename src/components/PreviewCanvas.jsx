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

  // T3: Shrink bodyText font-size until content fits or we hit min (28px).
  // Reports { isOverflowing, bodyFontSize, bodyFontShrunk } back to App.
  useEffect(() => {
    if (!contentBoxRef.current) return;

    const FONT_START = 42;
    const FONT_MIN = 28;
    const FONT_STEP = 2;

    // Reset to default first so we always measure from the top
    checkOverflow({ isOverflowing: false, bodyFontSize: FONT_START, bodyFontShrunk: false });

    // Use rAF to let the DOM settle after the reset before measuring
    const rafId = requestAnimationFrame(() => {
      const box = contentBoxRef.current;
      if (!box) return;

      let fontSize = FONT_START;
      let shrunk = false;

      // Apply and measure synchronously — box is already in the DOM
      const bodyEl = box.querySelector('#render-body');
      if (bodyEl) bodyEl.style.fontSize = `${fontSize}px`;

      while (box.scrollHeight > box.clientHeight && fontSize > FONT_MIN) {
        fontSize -= FONT_STEP;
        shrunk = true;
        if (bodyEl) bodyEl.style.fontSize = `${fontSize}px`;
      }

      const stillOverflowing = box.scrollHeight > box.clientHeight;
      checkOverflow({ isOverflowing: stillOverflowing, bodyFontSize: fontSize, bodyFontShrunk: shrunk });
    });

    return () => cancelAnimationFrame(rafId);
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
