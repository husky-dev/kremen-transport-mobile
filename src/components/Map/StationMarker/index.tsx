import React, { FC, useMemo } from 'react';
import { StyleProp, ViewStyle, StyleSheet, View, Text } from 'react-native';
import { ViewStyleProps } from '@styles';
import { TransportStation } from '@core/api';
import Svg, { Circle, G } from 'react-native-svg';
import { Marker } from 'react-native-maps';

interface Props {
  item: TransportStation;
  size?: number;
  zIndex?: number;
  opacity?: number;
  onPress?: () => void;
}

const getIconCode = (size: number) => {
  const fill = '#5097D5';
  const stroke = '#FFFFFF';
  const strokeWidth = 1.5;
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10">
      <G stroke="none" strokeWidth={strokeWidth} fill="none" fill-rule="evenodd">
        <G fill={fill} stroke={stroke}>
          <Circle cx="5" cy="5" r={5 - strokeWidth / 2} />
        </G>
      </G>
    </Svg>
  );
};

export const StationMarker: FC<Props> = ({ item, size = 12, zIndex = 19, opacity = 1.0, onPress }) => {
  const { lat, lng } = item;
  return useMemo(
    () => (
      <Marker coordinate={{ latitude: lat, longitude: lng }} zIndex={zIndex} opacity={opacity} onPress={onPress}>
        {getIconCode(size)}
      </Marker>
    ),
    [lat, lng, opacity],
  );
};

export type StationMarkerProps = Props;
export default StationMarker;
