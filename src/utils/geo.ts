import { Region } from 'react-native-maps';
import { isNum, isUnknownDict } from './types';

export interface LatLng {
  lat: number;
  lng: number;
}

export const isMapRegion = (val: unknown): val is Region =>
  isUnknownDict(val) && isNum(val.latitude) && isNum(val.longitude) && isNum(val.latitudeDelta) && isNum(val.longitudeDelta);
