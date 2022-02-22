import React, { FC } from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';

import arrowDownIcon from './assets/arrowDown.png';
import arrowUpIcon from './assets/arrowUp.png';

interface Props {
  style?: StyleProp<ImageStyle>;
  direction: 'up' | 'down';
}

export const DirectionIcon: FC<Props> = ({ style, direction }) => {
  return (
    <Image style={[styles.container, style]} resizeMode="contain" source={direction === 'up' ? arrowUpIcon : arrowDownIcon} />
  );
};

const styles = StyleSheet.create({
  container: {},
});

export type DirectionIconProps = Props;
export default DirectionIcon;
