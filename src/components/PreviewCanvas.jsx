import React, { useRef, useEffect, useState } from 'react';
import LogoDark from '../assets/JRI_LOGO.png';
import LogoLight from '../assets/JRI_LOGO_Light.png';

const PreviewCanvas = ({ state, canvasRef, wrapperRef, checkOverflow }) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

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

  const imageStyle = {
    backgroundImage: state.image ? `url(${state.image})` : 'none',
    backgroundSize: `${state.zoom}%`,
    backgroundPosition: `${state.x}% ${state.y}%`
  };

  return (
    <main className="preview-panel" ref={containerRef}>
      <div 
        className="canvas-wrapper" 
        ref={wrapperRef}
        style={{ transform: `scale(${scale})` }}
      >
        <div id="export-canvas" className={`ig-post ${state.theme} ${state.layout} ${state.fontFamily}`} ref={canvasRef}>
          <div className="post-image" id="render-image" style={imageStyle}></div>
          
          <div className="content-box" ref={contentBoxRef}>
            {state.subtitle.trim() !== '' && (
              <div className="subtitle-badge" id="render-subtitle">{state.subtitle}</div>
            )}
            <h1 className="main-title" id="render-title">{state.title}</h1>
            <p className="body-text" id="render-body">{state.body}</p>
          </div>

          <div className={`post-footer ${state.logoPosition}`} id="render-footer">
            <img 
              src={state.theme === 'theme-light' ? LogoLight : LogoDark} 
              alt="JRI Logo" 
              className="brand-logo" 
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default PreviewCanvas;
