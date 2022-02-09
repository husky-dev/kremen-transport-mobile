import { TransportRoute } from '@core/api';
import { ColorsSet } from '@styles';
import { colorWithAlpha } from '@utils';
import React, { FC } from 'react';
import { Polyline } from 'react-native-maps';

interface Props {
  item: TransportRoute;
  colors: ColorsSet;
  opacity?: number;
  zIndex?: number;
}

export const RoutePath: FC<Props> = ({ item, colors, opacity = 0.7, zIndex = 0 }) => {
  const path = item.path.map(([latitude, longitude]) => ({ latitude, longitude }));
  return <Polyline coordinates={path} zIndex={zIndex} strokeWidth={3} strokeColor={colorWithAlpha(colors.light, opacity)} />;
};

export type RoutePathProps = Props;
export default RoutePath;
