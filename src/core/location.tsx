import { errToStr, LatLng } from '@utils';
import React, { createContext, FC, useContext, useEffect, useMemo, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation, { GeoPosition, GeoError } from 'react-native-geolocation-service';
import { i18n } from './i18n';

import { Log } from './log';

const log = Log('core.location');

interface LocationContext {
  hasLocationPermission: boolean;
  curPosition?: LatLng;
}

const LocationContext = createContext<LocationContext>({
  hasLocationPermission: false,
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider: FC = ({ children }) => {
  const [curPosition, setCurPosition] = useState<LatLng | undefined>();
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false);

  // Permissions

  useEffect(() => {
    if (Platform.OS === 'ios') reqIOSPermissions();
    if (Platform.OS === 'android') reqAndroidPermissions();
  }, []);

  const reqIOSPermissions = async () => {
    log.debug('request ios permissions');
    try {
      const perm = await Geolocation.requestAuthorization('whenInUse');
      if (perm === 'granted') setHasLocationPermission(true);
    } catch (err: unknown) {
      log.debug('request ios permissions err', { msg: errToStr(err) });
    }
  };

  const reqAndroidPermissions = async () => {
    log.debug('request android permissions');
    try {
      const perm = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        i18n({
          uk: {
            title: 'Місцезнаходження',
            message: 'Ваше місцезнаходження необхідне для відображення його на карті і зручності користування додатком',
            buttonNeutral: 'Запитати пізніше',
            buttonNegative: 'Скасувати',
            buttonPositive: 'Надати',
          },
          en: {
            title: 'Location',
            message: 'Your location is needed to display it on the map and ease use of the app',
            buttonNeutral: 'Ask later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Provide',
          },
          ru: {
            title: 'Местонахождение',
            message: 'Ваше местонахождение необходимо для отображения его на карте и удобства использования приложения',
            buttonNeutral: 'Запитати пізніше',
            buttonNegative: 'Скасувати',
            buttonPositive: 'Надати',
          },
        }),
      );
      if (perm === 'granted') return setHasLocationPermission(true);
    } catch (err: unknown) {
      log.debug('request android permissions err', { msg: errToStr(err) });
    }
  };

  // Position

  useEffect(() => {
    if (!hasLocationPermission) return;
    Geolocation.getCurrentPosition(
      (val: GeoPosition) => {
        log.debug('getting cur position done', { ...val });
        const { coords } = val;
        setCurPosition({ lat: coords.latitude, lng: coords.longitude });
      },
      (err: GeoError) => {
        log.err('getting cur position err', { ...err });
      },
    );
    const watchId = Geolocation.watchPosition(
      (val: GeoPosition) => {
        log.debug('new cur position', { ...val });
      },
      (err: GeoError) => {
        log.err('watching cur position err', { ...err });
      },
    );
    return () => Geolocation.clearWatch(watchId);
  }, [hasLocationPermission]);

  const value = useMemo(() => ({ hasLocationPermission, curPosition }), [hasLocationPermission, curPosition]);

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};
