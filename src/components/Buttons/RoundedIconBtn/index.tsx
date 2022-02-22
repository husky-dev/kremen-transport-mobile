import { colors, ViewStyleProps } from '@styles';
import { select } from '@utils';
import React, { FC } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import busIcon from './assets/bus.png';
import locationIcon from './assets/location.png';
import minusIcon from './assets/minus.png';
import plusIcon from './assets/plus.png';
import menuIcon from './assets/menu.png';

interface Props extends ViewStyleProps {
  icon: RoundedIconBtnType;
  onPress?: () => void;
}

type RoundedIconBtnType = 'plus' | 'minus' | 'location' | 'bus' | 'menu';

export const RoundedIconBtn: FC<Props> = ({ style, icon, onPress }) => {
  const iconSrc = select(icon, {
    plus: plusIcon,
    minus: minusIcon,
    location: locationIcon,
    bus: busIcon,
    menu: menuIcon,
  });
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={styles.btn}>
        <Image style={styles.icon} source={iconSrc} />
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
