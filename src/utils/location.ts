import { LatLng as GoogleLatLng, Region } from 'react-native-maps';

interface LatLng {
  lat: number;
  lng: number;
}

export const latLngToLatitudeLongitude = (val: LatLng): GoogleLatLng => ({
  latitude: val.lat,
  longitude: val.lng,
});

export const mapRegionToZoom = (region: Region) => Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
