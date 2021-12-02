import { colors, colorSetFromColor } from '@styles';
import { TransportRoute } from '.';

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

const defRouteColors = colorSetFromColor(colors.back);
