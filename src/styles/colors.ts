import { colorWithDarken } from '@utils';

export interface ColorsSet {
  light: string;
  dark: string;
}

const colorsCache: Record<string, ColorsSet> = {};

export const colorSetFromColor = (val: string): ColorsSet => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (colorsCache[val]) {
    return colorsCache[val];
  }
  colorsCache[val] = {
    light: val,
    dark: colorWithDarken(val, 0.5),
  };
  return colorsCache[val];
};

const base = {
  red: '#D8434E',
  green: '#4CAF50',
  blue: '#3E7FE8',
  white: '#fff',
  back: '#000',
  lightGrey: '#BDC3C7',
};

const named = {
  primary: '#3E7FE8',
};

export const colors = {
  ...base,
  ...named,
};
