import { LatLng as GoogleLatLng } from 'react-native-maps';

interface LatLng {
  lat: number;
  lng: number;
}

export const latLngToLatitudeLongitude = (val: LatLng): GoogleLatLng => ({
  latitude: val.lat,
  longitude: val.lng,
});
