/* eslint-disable no-console */
import { AppLogLevel, config } from './config';

let enabled: boolean = true;
let colorized: boolean = false;
const minLevel: AppLogLevel = config.log.level;

export const setLogEnabled = (val: boolean) => {
  enabled = val;
};

export const setLogColorized = (val: boolean) => {
  colorized = val;
};

export const logLevelToSymbol = (level: AppLogLevel) => {
  switch (level) {
    case 'debug':
      return '-';
    case 'info':
      return '+';
    case 'warn':
      return '!';
    case 'error':
      return 'x';
    case 'trace':
      return '*';
    case 'time':
      return 'T';
  }
};

const levelToNum = (level: AppLogLevel) => {
  switch (level) {
    case 'error':
      return 0;
    case 'warn':
      return 1;
    case 'info':
      return 2;
    case 'debug':
      return 3;
    case 'trace':
      return 4;
    case 'time':
      return 5;
  }
};

interface LogColor {
  color: string;
  background?: string;
}

const logLevelToColor = (level: AppLogLevel): LogColor => {
  const defColor: LogColor = { color: '#000000' };
  switch (level) {
    case 'trace':
      return { color: '#a3a3a3' };
    case 'debug':
      return { color: '#51555A' };
    case 'info':
      return { color: '#FFFFFF', background: '#0022F5' };
    case 'warn':
      return { color: '#FFFFFF', background: '#FF9501' };
    case 'error':
      return { color: '#FFFFFF', background: '#FC2500' };
    default:
      return defColor;
  }
};

const logColorsToStr = ({ color, background }: LogColor) => {
  if (!background) {
    return `color: ${color}`;
  }
  return `background: ${background}; color: ${color}`;
};

const logPrefixData = (level: AppLogLevel, module: string): string[] => {
  const symbol = logLevelToSymbol(level);
  if (!colorized) {
    return [`[${symbol}][${module}]:`];
  }
  const colorStr = logColorsToStr(logLevelToColor(level));
  return [`%c[${symbol}][${module}]:`, colorStr];
};

export const Log = (m: string) => {
  const logWithLevel = (level: AppLogLevel, message: string, meta?: unknown) => {
    if (!enabled || levelToNum(level) > levelToNum(minLevel)) {
      return;
    }
    const prefix = logPrefixData(level, m);
    if (meta) {
      console.log(...prefix, message, JSON.stringify(meta));
    } else {
      console.log(...prefix, message);
    }
  };

  const trace = (message: string, meta?: unknown) => {
    logWithLevel('trace', message, meta);
  };

  const debug = (message: string, meta?: unknown) => {
    logWithLevel('debug', message, meta);
  };

  const info = (message: string, meta?: unknown) => {
    logWithLevel('info', message, meta);
  };

  const warn = (message: string, meta?: unknown) => {
    logWithLevel('warn', message, meta);
  };

  const err = (message: string, meta?: unknown) => {
    logWithLevel('error', message, meta);
  };

  const start = (marker: string) => {
    if (!enabled) {
      return;
    }
    console.time(`${logPrefixData('time', m).join(' ')} ${marker}`);
  };

  const end = (marker: string) => {
    if (!enabled) {
      return;
    }
    console.timeEnd(`${logPrefixData('time', m).join(' ')} ${marker}`);
  };

  return { trace, debug, info, warn, err, start, end };
};

export type LogHandler = ReturnType<typeof Log>;
