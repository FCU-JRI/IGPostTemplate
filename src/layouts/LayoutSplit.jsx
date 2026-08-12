import React from 'react';
import LogoDark from '../assets/JRI_LOGO.png';
import LogoLight from '../assets/JRI_LOGO_Light.png';
import baseStyles from './LayoutBase.module.css';
import { cx, getSharedStyles, getTitleClass } from '../utils/styleUtils';
import styles from './LayoutSplit.module.css';

const LayoutSplit = ({ state, canvasRef, contentBoxRef }) => {
  const { fontStyle, logoPosStyle } = getSharedStyles(state, baseStyles);
  const titleCompact = getTitleClass(state.title, baseStyles);

  // T6: When no image, collapse the image zone to a small strip with a placeholder
  const imageAreaStyle = state.image
    ? { backgroundImage: `url(${state.image})`, backgroundSize: `${state.zoom}%`, backgroundPosition: `${state.x}% ${state.y}%` }
    : { flex: '0 0 140px', backgroundImage: 'none' };

  return (
    <div id="export-canvas" className={cx(baseStyles.igPost, state.theme, fontStyle, styles.layoutRoot)} ref={canvasRef}>
      <div className={cx(baseStyles.postImage, styles.postImage)} id="render-image" style={imageAreaStyle}>
        {!state.image && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.3)', fontSize: '32px', letterSpacing: '1px' }}>
            📷 上傳圖片以套用此版型
          </div>
        )}
      </div>
      <div className={cx(baseStyles.contentBox, styles.contentBox)} ref={contentBoxRef}>
        {state.subtitle.trim() !== '' && (
          <div className={baseStyles.subtitleBadge} id="render-subtitle">{state.subtitle}</div>
        )}
        <h1 className={cx(baseStyles.mainTitle, titleCompact)} id="render-title">{state.title}</h1>
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

export default LayoutSplit;
