import { getTransportBusPinUri, offlineColors, TransportBus, TransportRoute } from '@core/api';
import { clearRouteNumberTransportInfo } from '@core/utils';
import { ColorsSet } from '@styles';
import { ColorMode } from 'native-base';
import React, { FC } from 'react';
import { MapEvent, Marker } from 'react-native-maps';

interface Props {
  item: TransportBus;
  route?: TransportRoute;
  colors: ColorsSet;
  zIndex?: number;
  opacity?: number;
  theme?: ColorMode;
  onPress?: () => void;
}

export const BusMarker: FC<Props> = ({ item, colors, zIndex = 20, route, theme, opacity = 1.0, onPress }) => {
  const handlePress = (event: MapEvent<{ action: 'marker-press'; id: string }>) => {
    event.stopPropagation();
    onPress && onPress();
  };

  const { direction, type } = item;
  const number = route ? clearRouteNumberTransportInfo(route.number) : '-';
  const { light, dark } = item.offline ? offlineColors : colors;
  const iconUri = getTransportBusPinUri({ direction, number, light, dark, type, theme: theme ? theme : undefined });

  return (
    <Marker
      onPress={handlePress}
      coordinate={{ latitude: item.lat, longitude: item.lng }}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: 0.8 }}
      opacity={opacity}
      zIndex={zIndex}
      icon={{ uri: iconUri, width: 58, height: 46 }}
    />
  );
};

export type BusMarkerProps = Props;
export default BusMarker;
