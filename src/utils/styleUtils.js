export const cx = (...classes) => classes.filter(Boolean).join(' ');

export const getSharedStyles = (state, baseStyles) => {
  const fontStyle = state.fontFamily === 'font-sans' ? baseStyles.fontSans : baseStyles.fontSerif;
  const logoPosStyle = state.logoPosition === 'logo-bottom-left' ? baseStyles.logoBottomLeft : baseStyles.logoBottomRight;
  return { fontStyle, logoPosStyle };
};
