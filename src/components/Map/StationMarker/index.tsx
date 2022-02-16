import { TransportStation } from '@core/api';
// import { useColorMode } from 'native-base';
import React, { FC } from 'react';
import { Image } from 'react-native';
import { MapEvent, Marker } from 'react-native-maps';

interface Props {
  item: TransportStation;
  format?: 'png' | 'svg';
  zIndex?: number;
  opacity?: number;
  onPress?: () => void;
}

export const StationMarker: FC<Props> = ({ item, zIndex = 10, format = 'png', opacity = 1.0, onPress }) => {
  const { lat, lng } = item;
  const handlePress = (e: MapEvent<{ action: 'marker-press'; id: string }>) => {
    e.stopPropagation();
    onPress && onPress();
  };
  // const { colorMode: theme } = useColorMode();
  return (
    <Marker
      coordinate={{ latitude: lat, longitude: lng }}
      zIndex={zIndex}
      opacity={opacity}
      onPress={handlePress}
      icon={{ uri: 'https://api.kremen.dev/img/transport/station/pin?d=2&v=1', width: 20, height: 20 }}
    />
  );
};

export type StationMarkerProps = Props;
export default StationMarker;
