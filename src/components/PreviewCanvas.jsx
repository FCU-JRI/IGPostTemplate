import React, { useRef, useEffect, useState } from 'react';
import LayoutText from '../layouts/LayoutText';
import LayoutSplit from '../layouts/LayoutSplit';
import LayoutBg from '../layouts/LayoutBg';
import LayoutFade from '../layouts/LayoutFade';
import LayoutDuotone from '../layouts/LayoutDuotone';
import LayoutGlass from '../layouts/LayoutGlass';
import LayoutCaption from '../layouts/LayoutCaption';

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
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);
  const SpecificLayout = LAYOUT_COMPONENTS[state.layout];

  // Resize logic
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const padding = 40;
        const availableWidth = containerRef.current.clientWidth - padding * 2;
        const availableHeight = containerRef.current.clientHeight - padding * 2;
        const newScale = Math.min(availableWidth / 1080, availableHeight / 1080, 1);
        setScale(newScale);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check overflow when text or layout changes
  const contentBoxRef = useRef(null);
  useEffect(() => {
    if (contentBoxRef.current) {
      const isOverflowing = contentBoxRef.current.scrollHeight > contentBoxRef.current.clientHeight;
      checkOverflow(isOverflowing);
    }
  }, [state.title, state.body, state.subtitle, state.layout, state.theme, checkOverflow]);

  return (
    <main className="preview-panel" ref={containerRef}>
      <div 
        className="canvas-wrapper" 
        ref={wrapperRef}
        style={{ transform: `scale(${scale})` }}
      >
        {SpecificLayout && <SpecificLayout state={state} canvasRef={canvasRef} contentBoxRef={contentBoxRef} />}
      </div>
    </main>
  );
};

export default PreviewCanvas;
