import React from 'react';
import LogoDark from '../assets/JRI_LOGO.png';
import LogoLight from '../assets/JRI_LOGO_Light.png';
import baseStyles from './LayoutBase.module.css';
import { cx, getSharedStyles, getTitleClass } from '../utils/styleUtils';
import styles from './LayoutSplit.module.css';

const LayoutSplit = ({ state, canvasRef, contentBoxRef }) => {
  const { fontStyle, logoPosStyle } = getSharedStyles(state, baseStyles);
  const titleCompact = getTitleClass(state.title, baseStyles);

  const imageStyle = {
    backgroundImage: state.image ? `url(${state.image})` : 'none',
    backgroundSize: `${state.zoom}%`,
    backgroundPosition: `${state.x}% ${state.y}%`
  };

  return (
    <div id="export-canvas" className={cx(baseStyles.igPost, state.theme, fontStyle, styles.layoutRoot)} ref={canvasRef}>
      <div className={cx(baseStyles.postImage, styles.postImage)} id="render-image" style={imageStyle}></div>
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
