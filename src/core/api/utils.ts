import { colors, colorSetFromColor } from '@styles';
import { isArr, isNum, isStr, isUndef, isUnknownDict } from '@utils';

import { TransportBus, TransportRoute, TransportType } from '.';

export interface ApiReqOpt {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  data?: unknown;
  params?: ApiReqOptParams;
  timeout?: number;
}

export type ApiReqOptParams = Record<string, string | number | boolean | undefined>;

export class ApiError extends Error {
  public readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const apiReqOptParamsToStr = (opts: ApiReqOptParams): string => {
  let res: string = '';
  for (const key in opts) {
    const val = `${key}=${opts[key]}`;
    res = res.length ? `${res}&${val}` : val;
  }
  return res;
};

export const offlineColors = colorSetFromColor(colors.lightGrey);

export const routeIdToColor = (rid: number, routes: TransportRoute[]) => {
  const route = routes.find(itm => itm.rid === rid);
  return route ? routeToColor(route) : defRouteColors;
};

export const routeToColor = (route?: TransportRoute) => (route && route.color ? colorSetFromColor(route.color) : defRouteColors);

export const defRouteColors = colorSetFromColor(colors.primary);
export const defRoutePathColors = colorSetFromColor(colors.primary);

// Guards

export const isTransportRoute = (val: unknown): val is TransportRoute => isUnknownDict(val) && isNum(val.rid);

export const isTransportRouteArr = (val: unknown): val is TransportRoute[] =>
  isArr(val) && val.reduce<boolean>((memo, itm) => memo && isTransportRoute(itm), true);

export const isTransportRouteArrOrUndef = (val: unknown): val is TransportRoute[] | undefined =>
  isTransportRouteArr(val) || isUndef(val);

export const isTransportBus = (val: unknown): val is TransportBus => isUnknownDict(val) && isStr(val.tid);

export const isTransportBusArr = (val: unknown): val is TransportBus[] =>
  isArr(val) && val.reduce<boolean>((memo, itm) => memo && isTransportBus(itm), true);

export const isTransportBusArrOrUndef = (val: unknown): val is TransportBus[] | undefined =>
  isTransportBusArr(val) || isUndef(val);

export interface TransportBusPinIcon {
  version?: number;
  density?: number;
  light: string;
  dark: string;
  direction: number;
  number: string;
  type: TransportType;
  theme?: 'light' | 'dark';
}

export const getTransportBusPinUri = (icon: TransportBusPinIcon): string => {
  const { version = 1, direction, type, number, light, dark, density = 3, theme = 'light' } = icon;
  const parts: string[] = [
    `d=${density}`,
    `direction=${direction}`,
    `number=${encodeURIComponent(number)}`,
    `light=${encodeURIComponent(light)}`,
    `dark=${encodeURIComponent(dark)}`,
    `type=${type === TransportType.Bus ? 'bus' : 'trolleybus'}`,
    `theme=${theme}`,
    `v=${version}`,
  ];
  return `https://api.kremen.dev/img/transport/bus/pin?${parts.join('&')}`;
};

export interface TransportStationPinIcon {
  version?: number;
  density?: number;
  theme?: 'light' | 'dark';
}

export const getTransportStationPinUri = (icon: TransportStationPinIcon): string => {
  const { version = 1, density = 3, theme = 'light' } = icon;
  const parts: string[] = [`d=${density}`, `theme=${theme}`, `v=${version}`];
  return `https://api.kremen.dev/img/transport/station/pin?${parts.join('&')}`;
};
