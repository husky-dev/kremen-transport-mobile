import { colors, colorSetFromColor } from '@styles';
import { sortBy } from 'lodash';

import { TransportRoute } from './api';

const defRouteColors = colorSetFromColor(colors.back);

export const clearRouteNumber = (val: string): string => {
  let mod: string = val.replace(/^[ТT]/g, '');
  mod = mod.trim();
  mod = mod.toUpperCase();
  return mod;
};

export const routeToColor = (route?: TransportRoute) => (route && route.color ? colorSetFromColor(route.color) : defRouteColors);

export const sortRoutes = (arr: TransportRoute[]): TransportRoute[] =>
  sortBy(arr, route => {
    const match = /(\d+)(-([\w\W]+))*/g.exec(route.number);
    const base = 1000;
    if (!match) {
      return base * 100;
    }
    if (!match[3]) {
      return parseInt(match[0], 10) * base;
    }
    return parseInt(match[0], 10) * base + match[3].charCodeAt(0);
  });
