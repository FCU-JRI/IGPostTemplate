export const cx = (...classes) => classes.filter(Boolean).join(' ');

export const getSharedStyles = (state, baseStyles) => {
  const fontStyle = state.fontFamily === 'font-sans' ? baseStyles.fontSans : baseStyles.fontSerif;
  const logoPosStyle = state.logoPosition === 'logo-bottom-left' ? baseStyles.logoBottomLeft : baseStyles.logoBottomRight;
  return { fontStyle, logoPosStyle };
};

// T2: Returns the compact CSS class when title is long (>9 chars)
export const getTitleClass = (title, baseStyles) => {
  return title.length > 9 ? baseStyles.mainTitleCompact : undefined;
};
