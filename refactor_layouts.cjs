const fs = require('fs');
const path = require('path');

const layouts = [
  { name: 'LayoutText', css: '.contentBox { flex: 1; }', hasImage: false },
  { name: 'LayoutSplit', css: '.layoutRoot { padding: 0; gap: 0; }\n.postImage { flex: 1.2; width: 100%; background-size: cover; background-position: center; background-color: var(--ig-image-bg); }\n.contentBox { flex: 1; border: none; border-radius: 0; padding: 50px 80px 140px 80px; justify-content: center; }\n.postFooter { position: absolute; bottom: 50px; left: 80px; right: 80px; padding: 0; }', hasImage: true },
  { name: 'LayoutBg', css: '.layoutRoot { padding: 60px; }\n.postImage { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-size: cover; background-position: center; background-color: var(--ig-image-bg); z-index: 1; }\n.postImage::after { content: ""; position: absolute; inset: 0; background: rgba(0,0,0,0.35); }\n.contentBox { flex: 1; z-index: 2; background: var(--ig-glass-bg); backdrop-filter: blur(12px); border-color: var(--ig-glass-border); }\n.postFooter { z-index: 2; }', hasImage: true },
  { name: 'LayoutFade', css: '.layoutRoot { padding: 0; gap: 0; }\n.postImage { position: absolute; top: 0; left: 0; right: 0; height: 70%; background-size: cover; background-position: center; z-index: 1; }\n.postImage::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 0%, var(--ig-bg) 100%); }\n.contentBox { flex: 1; z-index: 2; background: transparent; border: none; margin-top: 40%; padding: 40px 80px 140px 80px; justify-content: flex-end; }\n.postFooter { position: absolute; bottom: 50px; left: 80px; right: 80px; padding: 0; z-index: 2; }', hasImage: true },
  { name: 'LayoutDuotone', css: '.layoutRoot { padding: 60px; background-color: var(--ig-duotone-bg); }\n.postImage { position: absolute; inset: 0; background-size: cover; background-position: center; z-index: 1; filter: grayscale(100%); mix-blend-mode: luminosity; opacity: 0.6; }\n.contentBox { flex: 1; z-index: 2; background: transparent; border: none; }\n.postFooter { z-index: 2; }', hasImage: true },
  { name: 'LayoutGlass', css: '.layoutRoot { padding: 0; justify-content: flex-end; }\n.postImage { position: absolute; inset: 0; background-size: cover; background-position: center; z-index: 1; }\n.contentBox { flex: none; z-index: 2; margin: 60px; margin-bottom: 160px; background: var(--ig-glass-bg); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid var(--ig-glass-border); border-radius: 40px; padding: 60px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }\n.postFooter { position: absolute; bottom: 60px; left: 80px; right: 80px; padding: 0; z-index: 2; }', hasImage: true },
  { name: 'LayoutCaption', css: '.layoutRoot { padding: 0; gap: 0; }\n.postImage { position: relative; flex: 1; width: 100%; background-size: cover; background-position: center; z-index: 1; }\n.contentBox { position: relative; flex: none; width: 100%; z-index: 2; background: var(--ig-content-bg); border: none; border-radius: 0; margin: 0; padding: 60px 80px 140px 80px; justify-content: flex-start; gap: 20px; box-shadow: 0 -10px 30px rgba(0,0,0,0.15); }\n.postFooter { position: absolute; bottom: 50px; left: 80px; right: 80px; padding: 0; z-index: 3; }', hasImage: true }
];

layouts.forEach(l => {
  fs.writeFileSync(path.join(__dirname, 'src', 'layouts', `${l.name}.module.css`), l.css);
  
  let jsx = `import React from 'react';
import LogoDark from '../assets/JRI_LOGO.png';
import LogoLight from '../assets/JRI_LOGO_Light.png';
import baseStyles from './LayoutBase.module.css';
import styles from './${l.name}.module.css';

const ${l.name} = ({ state, canvasRef, contentBoxRef }) => {
  const fontStyle = state.fontFamily === 'font-sans' ? baseStyles.fontSans : baseStyles.fontSerif;
  const logoPosStyle = state.logoPosition === 'logo-bottom-left' ? baseStyles.logoBottomLeft : baseStyles.logoBottomRight;
`;

  if (l.hasImage) {
    jsx += `
  const imageStyle = {
    backgroundImage: state.image ? \`url(\${state.image})\` : 'none',
    backgroundSize: \`\${state.zoom}%\`,
    backgroundPosition: \`\${state.x}% \${state.y}%\`
  };
`;
  }

  jsx += `
  return (
    <div id="export-canvas" className={\`\${baseStyles.igPost} \${state.theme} \${fontStyle} \${styles.layoutRoot || ''}\`} ref={canvasRef}>`;
    
  if (l.hasImage) {
    jsx += `
      <div className={\`\${baseStyles.postImage} \${styles.postImage || ''}\`} id="render-image" style={imageStyle}></div>`;
  }

  jsx += `
      <div className={\`\${baseStyles.contentBox} \${styles.contentBox || ''}\`} ref={contentBoxRef}>
        {state.subtitle.trim() !== '' && (
          <div className={baseStyles.subtitleBadge} id="render-subtitle">{state.subtitle}</div>
        )}
        <h1 className={baseStyles.mainTitle} id="render-title">{state.title}</h1>
        <p className={baseStyles.bodyText} id="render-body">{state.body}</p>
      </div>

      <div className={\`\${baseStyles.postFooter} \${logoPosStyle} \${styles.postFooter || ''}\`} id="render-footer">
        <img 
          src={state.theme === 'theme-light' ? LogoLight : LogoDark} 
          alt="JRI Logo" 
          className={baseStyles.brandLogo} 
        />
      </div>
    </div>
  );
};

export default ${l.name};
`;

  fs.writeFileSync(path.join(__dirname, 'src', 'layouts', `${l.name}.jsx`), jsx);
});
console.log('Layouts refactored!');
