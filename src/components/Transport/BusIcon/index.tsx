import { TransportType } from '@core/api';
import React, { FC } from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

import busIcon from './assets/bus.png';
import trolleybusIcon from './assets/trolleybus.png';

interface Props {
  style?: StyleProp<ImageStyle>;
  size?: number;
  type: TransportType;
}

export const TransportBusIcon: FC<Props> = ({ style, type, size = 48 }) => {
  return (
    <Image
      style={[{ width: size, height: size }, style]}
      source={type === TransportType.Bus ? busIcon : trolleybusIcon}
      resizeMode="cover"
    />
  );
};

export type TransportBusIconProps = Props;
export default TransportBusIcon;
