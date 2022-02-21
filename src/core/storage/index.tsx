import { delayMs, errToStr } from '@utils';
import React, { createContext, FC, useContext, useEffect, useMemo, useState } from 'react';

import { api, isTransportBusArrOrUndef, isTransportRouteArrOrUndef, TransportBus, TransportRoute } from '../api';
import { Log } from '../log';
import { useWebScockets, WsMsg } from '../ws';
import { getStorageParam } from './utils';

const log = Log('core.storage');

interface StorageContext {
  buses: TransportBus[];
  routes: TransportRoute[];
}

const StorageContext = createContext<StorageContext>({
  buses: [],
  routes: [],
});

export const useStorage = () => useContext(StorageContext);

const busesStorage = getStorageParam('buses', isTransportBusArrOrUndef);
const routesStorage = getStorageParam('routes', isTransportRouteArrOrUndef);

export const StorageProvider: FC = ({ children }) => {
  const [storageLoaded, setStorageLoaded] = useState<boolean>(false);
  const [buses, setBuses] = useState<TransportBus[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);

  // Data updates

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (storageLoaded) updateLoadedData();
  }, [storageLoaded]);

  const loadFromStorage = async () => {
    try {
      log.debug('load from local storage');
      const storedRotues = await routesStorage.get();
      if (storedRotues) {
        log.debug('routes loaded');
        setRoutes(storedRotues);
      }
      const storedBuses = await busesStorage.get();
      if (storedBuses) {
        log.debug('buses loaded');
        setBuses(storedBuses);
      }
      log.debug('load from local storage done');
    } catch (err: unknown) {
      log.err('load from local storage err', { err: errToStr(err) });
    } finally {
      setStorageLoaded(true);
    }
  };

  const updateLoadedData = async () => {
    try {
      const localLoaded = Boolean(buses.length) && Boolean(routes.length);
      if (!localLoaded) {
        log.debug('local data not found, making full update');
        await makeFullUpdate();
      } else {
        log.debug('local data found, making partly update first');
        await makePartlyUpdate();
        log.debug('making a delay');
        await delayMs(3000);
        await makeFullUpdate();
      }
    } catch (err: unknown) {
      log.err('update data err', { err: errToStr(err) });
    }
  };

  const makeFullUpdate = async () => {
    try {
      log.debug('updating data');
      const [routes, buses] = await Promise.all([api.transport.routes(), api.transport.buses()]);
      log.debug('updating data done');
      setAndSaveRoutes(routes);
      setAndSaveBuses(buses);
    } catch (err: unknown) {
      log.err('updating data err', { err: errToStr(err) });
    }
  };

  const makePartlyUpdate = async () => {
    log.debug('get buses locations');
    const busesLocations = await api.transport.busesLocations();
    log.debug('get buses locations done');
    log.debug('updating buses locations');
    let newBuses = buses;
    for (const tid in busesLocations) {
      const [lat, lng, direction, speed] = busesLocations[tid];
      newBuses = newBuses.map(itm => (itm.tid === tid ? { ...itm, lat, lng, direction, speed } : itm));
    }
    setAndSaveBuses(newBuses);
    log.debug('updating buses locations done');
  };

  // WebSockets

  const [busesUpdate, setBusesUpdate] = useState<Partial<TransportBus>[] | undefined>();

  useWebScockets({
    onMessage: (msg: WsMsg) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (msg.type === 'buses') {
        log.debug('ws buses update');
        setBusesUpdate(msg.data);
      }
    },
  });

  useEffect(() => {
    if (!busesUpdate) return;
    const newBuses = buses.map(itm => {
      const update = busesUpdate.find(uitem => uitem.tid === itm.tid);
      return update ? { ...itm, ...update } : itm;
    });
    setAndSaveBuses(newBuses);
  }, [busesUpdate]);

  // Utils

  const setAndSaveRoutes = (val: TransportRoute[]) => {
    setRoutes(val);
    routesStorage.set(val);
  };

  const setAndSaveBuses = (val: TransportBus[]) => {
    setBuses(val);
    busesStorage.set(val);
  };

  const value = useMemo(() => ({ buses, routes }), [buses, routes]);

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};

export * from './utils';
