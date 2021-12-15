import { isStr } from '@utils';
import Config from 'react-native-config';

export type AppLogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'time';

export const isAppLogLevel = (val: unknown): val is AppLogLevel =>
  isStr(val) && ['error', 'warn', 'info', 'debug', 'trace', 'time'].includes(val);

export type AppEnv = 'production' | 'development';

export const isAppEnv = (val: unknown): val is AppEnv => isStr(val) && ['production', 'development'].includes(val);

interface AppConfig {
  env: AppEnv;
  log: {
    level: AppLogLevel;
  };
}

export const config: AppConfig = {
  env: isAppEnv(Config.APP_ENV) ? Config.APP_ENV : 'production',
  log: {
    level: isAppLogLevel(Config.APP_LOG_LEVEL) ? Config.APP_LOG_LEVEL : 'trace',
  },
};
