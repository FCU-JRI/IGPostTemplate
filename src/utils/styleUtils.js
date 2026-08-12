export const cx = (...classes) => classes.filter(Boolean).join(' ');

export const getSharedStyles = (state, baseStyles) => {
  const fontStyle = state.fontFamily === 'font-sans' ? baseStyles.fontSans : baseStyles.fontSerif;
  const logoPosStyle = state.logoPosition === 'logo-bottom-left' ? baseStyles.logoBottomLeft : baseStyles.logoBottomRight;
  return { fontStyle, logoPosStyle };
};

export const MAX_TITLE_LENGTH_BEFORE_COMPACT = 9;

/**
 * Returns the compact title class if the title exceeds the character limit.
 * @param {string} title 
 * @param {object} baseStyles 
 * @returns {string|undefined}
 */
export const getTitleClass = (title, baseStyles) => {
  return title.length > MAX_TITLE_LENGTH_BEFORE_COMPACT ? baseStyles.mainTitleCompact : undefined;
};
