import { errToStr, isStr, TypeGuard } from '@utils';
import { Log } from './log';
import AsyncStorage from '@react-native-async-storage/async-storage';

const log = Log('core.storage');
const storeVersion = `v1`;

export const getStorageParam = <T = unknown>(rawKey: string, guard?: TypeGuard<T>) => {
  const key = `${storeVersion}:${rawKey}`;

  const get = async (): Promise<T | undefined> => {
    const valStr = await AsyncStorage.getItem(key);
    if (!isStr(valStr)) {
      return undefined;
    }
    try {
      const val = JSON.parse(valStr);
      if (guard) {
        if (guard(val)) {
          return val;
        } else {
          log.err(`wrong storage value format`, { key, val });
          return undefined;
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return val as unknown as T;
      }
    } catch (err: unknown) {
      log.err(`getting data err`, { err: errToStr(err) });
      return undefined;
    }
  };

  const set = async (val: T) => {
    const valStr = JSON.stringify(val);
    try {
      await AsyncStorage.setItem(key, valStr);
    } catch (err: unknown) {
      log.err('setting item err', { err: errToStr(err) });
    }
  };

  const remove = async () => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err: unknown) {
      log.err('removing item err', { err: errToStr(err) });
    }
  };

  return { get, set, remove };
};
