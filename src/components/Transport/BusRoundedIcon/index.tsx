import { TransportType } from '@core/api';
import { ViewStyleProps } from '@styles';
import { Avatar } from 'native-base';
import React, { FC } from 'react';

import busIcon from './assets/bus.png';
import trolleybusIcon from './assets/trolleybus.png';

interface Props extends ViewStyleProps {
  size?: number;
  type: TransportType;
  backgroundColor?: string;
}

export const TransportBusRoundedIcon: FC<Props> = ({ style, type, size = 48, backgroundColor }) => {
  return (
    <Avatar
      style={style}
      size={`${size}px`}
      backgroundColor={backgroundColor}
      source={type === TransportType.Trolleybus ? trolleybusIcon : busIcon}
    />
  );
};

export type TransportBusRoundedIconProps = Props;
export default TransportBusRoundedIcon;
