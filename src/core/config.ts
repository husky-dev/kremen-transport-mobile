import { isStr } from '@utils';
import Config from 'react-native-config';
import pckg from '../../package.json';

export type AppLogLevel = 'error' | 'warn' | 'info' | 'debug';

export const isAppLogLevel = (val: unknown): val is AppLogLevel => isStr(val) && ['error', 'warn', 'info', 'debug'].includes(val);

export type AppEnv = 'prd' | 'dev';

export const isAppEnv = (val: unknown): val is AppEnv => isStr(val) && ['prd', 'dev'].includes(val);

interface AppConfig {
  env: AppEnv;
  version: string;
  log: {
    level: AppLogLevel;
  };
  sentry: {
    dsn: string;
    project: string;
  };
}

export const config: AppConfig = {
  env: isAppEnv(Config.APP_ENV) ? Config.APP_ENV : 'prd',
  version: pckg.version,
  log: {
    level: isAppLogLevel(Config.APP_LOG_LEVEL) ? Config.APP_LOG_LEVEL : 'error',
  },
  sentry: {
    dsn: Config.SENTRY_DSN || '',
    project: 'kremen-transport-mobile',
  },
};
