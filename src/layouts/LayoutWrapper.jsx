import React from 'react';
import LogoDark from '../assets/JRI_LOGO.png';
import LogoLight from '../assets/JRI_LOGO_Light.png';
import baseStyles from './LayoutBase.module.css';
import { cx, getSharedStyles, getTitleClass } from '../utils/styleUtils';

export const LayoutWrapper = ({ state, canvasRef, contentBoxRef, styles, renderImage }) => {
  const { fontStyle, logoPosStyle } = getSharedStyles(state, baseStyles);
  const titleCompact = getTitleClass(state.title, baseStyles);
  
  const bodyFontSize = state.bodyFontSize || 36;
  const hasContent = (state.title || '').trim() !== '' || (state.subtitle || '').trim() !== '' || (state.body || '').trim() !== '';

  return (
    <div id="export-canvas" className={cx(baseStyles.igPost, state.theme, fontStyle, styles.layoutRoot, !hasContent && baseStyles.noContent, !hasContent && styles.noContent)} ref={canvasRef}>
      {renderImage && renderImage()}
      
      {hasContent && (
        <div className={cx(baseStyles.contentBox, styles.contentBox)} ref={contentBoxRef}>
          {(state.subtitle || '').trim() !== '' && !state.subtitleHidden && (
            <div className={baseStyles.subtitleBadge} id="render-subtitle">{state.subtitle}</div>
          )}
        <h1 
          className={cx(baseStyles.mainTitle, titleCompact)} 
          id="render-title"
          style={{ fontSize: state.titleShrunk ? '56px' : undefined }}
        >
          {state.title}
        </h1>
        <p 
          className={baseStyles.bodyText} 
          id="render-body" 
          style={{ fontSize: `${bodyFontSize}px` }}
        >
          {state.body}
        </p>
      </div>
      )}

      <div className={cx(baseStyles.postFooter, logoPosStyle, styles.postFooter)} id="render-footer">
        <img 
          src={state.theme === 'theme-light' ? LogoLight : LogoDark} 
          alt="JRI Logo" 
          className={baseStyles.brandLogo} 
        />
      </div>
    </div>
  );
};

export default LayoutWrapper;
