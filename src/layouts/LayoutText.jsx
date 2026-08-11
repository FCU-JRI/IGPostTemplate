import React from 'react';
import LogoDark from '../assets/JRI_LOGO.png';
import LogoLight from '../assets/JRI_LOGO_Light.png';

const LayoutText = ({ state, canvasRef, contentBoxRef }) => {
  return (
    <div id="export-canvas" className={`ig-post ${state.theme} layout-text ${state.fontFamily}`} ref={canvasRef}>
      
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
  );
};

export default LayoutText;
