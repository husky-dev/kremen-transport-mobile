import { colors, ViewStyleProps } from '@styles';
import React, { FC } from 'react';
import { ImageSourcePropType, StyleSheet, TouchableOpacity, View, Image } from 'react-native';

import plusIcon from './assets/plus.png';
import minusIcon from './assets/minus.png';
import locationIcon from './assets/location.png';

interface Props extends ViewStyleProps {
  icon: RoundedIconBtnType;
  onPress?: () => void;
}

type RoundedIconBtnType = 'plus' | 'minus' | 'location';

const getIcon = (icon: RoundedIconBtnType): ImageSourcePropType => {
  switch (icon) {
    case 'plus':
      return plusIcon;
    case 'minus':
      return minusIcon;
    case 'location':
      return locationIcon;
  }
};

export const RoundedIconBtn: FC<Props> = ({ style, icon, onPress }) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={styles.btn}>
        <Image style={styles.icon} source={getIcon(icon)} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {},
});

export type RoundedIconBtnProps = Props;
export default RoundedIconBtn;
