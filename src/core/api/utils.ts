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
