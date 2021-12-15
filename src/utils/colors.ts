export const colorWithAlpha = (val: string, alpha: number) => {
  const [r, g, b] = hexToRgb(val);
  let alphaNum = alpha > 1 ? 1 : alpha;
  alphaNum = alpha < 0 ? 0 : alphaNum;
  return `rgba(${r}, ${g}, ${b}, ${alphaNum})`;
};

export const colorWithDarken = (val: string, ratio: number) => {
  const [r, g, b] = hexToRgb(val);
  return `rgb(${fixRgbColor(r - r * ratio)}, ${fixRgbColor(g - g * ratio)}, ${fixRgbColor(b - b * ratio)})`;
};

const fixRgbColor = (val: number) => {
  let modVal = Math.round(val);
  if (modVal < 0) modVal = 0;
  if (modVal > 255) modVal = 255;
  return modVal;
};

export const rgbToHex = (red: number, green: number, blue: number) => {
  const rgb = (red << 16) | (green << 8) | (blue << 0);
  return '#' + (0x1000000 + rgb).toString(16).slice(1);
};

export const hexToRgb = (hex: string) => {
  const normal = hex.toLowerCase().match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (normal) return normal.slice(1).map(e => parseInt(e, 16));

  const shorthand = hex.toLowerCase().match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  if (shorthand) return shorthand.slice(1).map(e => 0x11 * parseInt(e, 16));

  throw new Error(`Parsing hex color "${hex}" error`);
};
