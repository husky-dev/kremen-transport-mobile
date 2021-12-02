import { TransportBus } from '@core/api';
import React, { FC } from 'react';
import { Marker } from 'react-native-maps';

interface Props {
  item: TransportBus;
  onPress?: () => void;
}

export const BusMarker: FC<Props> = ({ item, onPress }) => {
  return (
    <Marker
      onPress={onPress}
      coordinate={{ latitude: item.lat, longitude: item.lng }}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: 0.8 }}
    />
  );
};

export type BusMarkerProps = Props;
export default BusMarker;
