import { isBool, isErr, isNull, isNum, isStr, isUnknownDict, isFunc } from './types';

/**
 * Convert unknown error to string
 * @param err - Error, string, number or an object with `toString()` property
 */
export const errToStr = (err: unknown): string => {
  if (isErr(err)) {
    return err.message;
  }
  if (isStr(err)) {
    return err;
  }
  if (isNum(err) || isBool(err) || isNull(err)) {
    return `${err}`;
  }
  if (isUnknownDict(err) && isStr(err.message)) {
    return err.message;
  }
  if (isUnknownDict(err) && isFunc(err.toString)) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return err.toString();
  }
  return '';
};

export const numToTimeStr = (val: number): { numStr: string; metric: string } => {
  if (val < 60) {
    return { numStr: `${val}`, metric: 'с' };
  }
  const mins = Math.ceil(val / 60);
  return { numStr: `${mins}`, metric: 'хв' };
};
