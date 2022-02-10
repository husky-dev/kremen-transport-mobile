/* eslint-disable no-console */
import { select, UnknownDict } from '@utils';

import { AppLogLevel, config } from './config';
import { addSentryBreadcumb, captureSentryMessage, SentrySeverity } from './sentry';

const logLevelToNum = (val: AppLogLevel): number =>
  select(val, {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  });

const logLevelToSymbol = (val: AppLogLevel): string =>
  select(val, {
    error: 'x',
    warn: '!',
    info: '+',
    debug: '-',
  });

export const Log = (m?: string) => {
  const level = logLevelToNum(config.log.level);

  interface LogOpt {
    level: AppLogLevel;
    msg: string;
    meta?: unknown;
  }

  const logWithOpt = (opt: LogOpt) => {
    if (level < logLevelToNum(opt.level)) return;
    const levelPrefix = `[${logLevelToSymbol(opt.level)}]`;
    const prefix = m ? `${levelPrefix}[${m}]` : levelPrefix;
    const msg = `${prefix}: ${opt.msg}`;
    switch (opt.level) {
      case 'info':
        return opt.meta ? console.info(msg, JSON.stringify(opt.meta)) : console.info(msg);
      case 'error':
        return opt.meta ? console.error(msg, JSON.stringify(opt.meta)) : console.error(msg);
      case 'warn':
        return opt.meta ? console.warn(msg, JSON.stringify(opt.meta)) : console.warn(msg);
      default:
        return opt.meta ? console.log(msg, JSON.stringify(opt.meta)) : console.log(msg);
    }
  };

  return {
    err: (msg: string, meta?: UnknownDict) => {
      captureSentryMessage(msg, SentrySeverity.Error, meta);
      logWithOpt({ msg, meta, level: 'error' });
    },
    warn: (msg: string, meta?: UnknownDict) => {
      captureSentryMessage(msg, SentrySeverity.Warning, meta);
      logWithOpt({ msg, meta, level: 'warn' });
    },
    info: (msg: string, meta?: UnknownDict) => {
      addSentryBreadcumb(msg, SentrySeverity.Info, meta);
      logWithOpt({ msg, meta, level: 'info' });
    },
    debug: (msg: string, meta?: UnknownDict) => {
      addSentryBreadcumb(msg, SentrySeverity.Debug, meta);
      logWithOpt({ msg, meta, level: 'debug' });
    },
    simple: (...args: unknown[]) => console.log(...args),
  };
};

export const log = Log();
