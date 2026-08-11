import React from 'react';
import LogoDark from '../assets/JRI_LOGO.png';
import LogoLight from '../assets/JRI_LOGO_Light.png';
import baseStyles from './LayoutBase.module.css';
import { cx, getSharedStyles } from '../utils/styleUtils';
import styles from './LayoutText.module.css';

const LayoutText = ({ state, canvasRef, contentBoxRef }) => {
  const { fontStyle, logoPosStyle } = getSharedStyles(state, baseStyles);

  return (
    <div id="export-canvas" className={cx(baseStyles.igPost, state.theme, fontStyle, styles.layoutRoot)} ref={canvasRef}>
      <div className={cx(baseStyles.contentBox, styles.contentBox)} ref={contentBoxRef}>
        {state.subtitle.trim() !== '' && (
          <div className={baseStyles.subtitleBadge} id="render-subtitle">{state.subtitle}</div>
        )}
        <h1 className={baseStyles.mainTitle} id="render-title">{state.title}</h1>
        <p className={baseStyles.bodyText} id="render-body">{state.body}</p>
      </div>

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

export default LayoutText;
