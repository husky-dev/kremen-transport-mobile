import { Log } from '@core/log';
import { delayMs } from '@utils';

import { TransportBus, TransportBusesLocations, TransportPrediction, TransportRoute } from './types';
import { ApiError, ApiReqOpt, apiReqOptParamsToStr } from './utils';

const log = Log('core.api');

export const getApiRoot = () => {
  return {
    url: 'https://api.kremen.dev/',
    ws: 'wss://api.kremen.dev',
  };
};

const getApi = () => {
  const apiConf = getApiRoot();

  const apiReq = async <T = unknown>(opt: ApiReqOpt): Promise<T> => {
    const { method = 'GET', path, data: reqData, params, retry = 0 } = opt;
    const paramsStr = params ? `?${apiReqOptParamsToStr(params)}` : '';
    const url = `${apiConf.url}${path}${paramsStr}`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const reqInit: RequestInit = { method, headers };
    if (reqData) {
      reqInit.body = JSON.stringify(reqData);
    }
    try {
      log.debug('req', { url, opt: reqInit });
      const resp = await fetch(url, reqInit);
      // log.debug('req done', { url, opt: reqInit });
      if (!resp.ok) {
        throw new ApiError(resp.statusText, resp.status);
      }
      const text = await resp.text();
      // log.trace('req resp text', { text });
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      if (!text) return undefined as unknown as T;

      const data = JSON.parse(text);
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return data as unknown as T;
    } catch (err: unknown) {
      const waitMs = 2 ** retry * 100;
      log.debug('datasource req err, retry', { url, waitMs });
      await delayMs(waitMs);
      return apiReq({ ...opt, retry: retry + 1 });
    }
  };

  return {
    transport: {
      routes: async (): Promise<TransportRoute[]> => apiReq<TransportRoute[]>({ path: `transport/routes?v=2` }),
      buses: async (): Promise<TransportBus[]> => apiReq<TransportBus[]>({ path: `transport/buses` }),
      busesLocations: async () => apiReq<TransportBusesLocations>({ path: `transport/buses/locations` }),
      stationPrediction: async (sid: number): Promise<TransportPrediction[]> =>
        apiReq<TransportPrediction[]>({ path: `transport/stations/${sid}/prediction` }),
    },
  };
};

export const api = getApi();

export * from './types';
export * from './utils';
