import { getTransportStationPinUri, TransportStation } from '@core/api';
import { ColorMode } from 'native-base';
import React, { FC } from 'react';
import { MapEvent, Marker } from 'react-native-maps';

interface Props {
  item: TransportStation;
  zIndex?: number;
  opacity?: number;
  theme?: ColorMode;
  onPress?: () => void;
}

export const StationMarker: FC<Props> = ({ item, zIndex = 10, opacity = 1.0, theme, onPress }) => {
  const { lat, lng } = item;
  const handlePress = (e: MapEvent<{ action: 'marker-press'; id: string }>) => {
    e.stopPropagation();
    onPress && onPress();
  };
  const iconUri = getTransportStationPinUri({ theme: theme ? theme : undefined });
  return (
    <Marker
      coordinate={{ latitude: lat, longitude: lng }}
      zIndex={zIndex}
      opacity={opacity}
      onPress={handlePress}
      icon={{ uri: iconUri, width: 20, height: 20 }}
    />
  );
};

export type StationMarkerProps = Props;
export default StationMarker;
