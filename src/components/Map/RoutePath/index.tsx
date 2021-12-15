import { TransportRoute } from '@core/api';
import { ColorsSet, withAlpha } from '@styles';
import React, { FC, useMemo } from 'react';
import { Polyline } from 'react-native-maps';

interface Props {
  item: TransportRoute;
  colors: ColorsSet;
  opacity?: number;
  zIndex?: number;
}

export const RoutePath: FC<Props> = ({ item, colors, opacity = 0.7, zIndex = 0 }) => {
  const path = item.path.map(([latitude, longitude]) => ({ latitude, longitude }));
  return useMemo(
    () => <Polyline coordinates={path} zIndex={zIndex} strokeWidth={3} strokeColor={withAlpha(colors.light, opacity)} />,
    [item.path, colors.light, opacity, zIndex],
  );
};

export type RoutePathProps = Props;
export default RoutePath;
