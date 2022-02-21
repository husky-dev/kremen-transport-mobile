import { getTransportStationPinUri, TransportStation } from '@core/api';
import { ColorMode } from 'native-base';
import React, { FC } from 'react';
import { Image } from 'react-native';
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
      style={{ zIndex, width: 20, height: 20 }}
      coordinate={{ latitude: lat, longitude: lng }}
      opacity={opacity}
      onPress={handlePress}
      anchor={{ x: 0.5, y: 0.5 }}
      stopPropagation
      zIndex={zIndex}
      image={{ uri: iconUri }}
    />
  );
};

export type StationMarkerProps = Props;
export default StationMarker;
