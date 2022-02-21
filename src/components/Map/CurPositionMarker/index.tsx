import { LatLng } from '@utils';
import React, { FC } from 'react';
import { MapEvent, Marker } from 'react-native-maps';

import pinCurPositionIcon from './assets/pinCurPosition.png';

interface Props {
  position: LatLng;
  zIndex?: number;
  onPress?: () => void;
}

export const CurPositionMarker: FC<Props> = ({ zIndex = 10, position, onPress }) => {
  const { lat, lng } = position;

  const handlePress = (e: MapEvent<{ action: 'marker-press'; id: string }>) => {
    e.stopPropagation();
    onPress && onPress();
  };
  return (
    <Marker
      style={{ zIndex, width: 38, height: 38 }}
      coordinate={{ latitude: lat, longitude: lng }}
      onPress={handlePress}
      anchor={{ x: 0.5, y: 1 }}
      stopPropagation
      zIndex={zIndex}
      image={pinCurPositionIcon}
    />
  );
};

export type CurPositionMarkerProps = Props;
export default CurPositionMarker;
