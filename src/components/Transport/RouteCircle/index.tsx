import { routeToColor, TransportRoute } from '@core/api';
import { clearRouteNumber } from '@core/utils';
import { colors, ColorsSet, ViewStyleProps } from '@styles';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props extends ViewStyleProps {
  route: TransportRoute;
  size?: number;
}

export const RouteCircle: FC<Props> = ({ style, route, size = 24 }) => {
  const text = clearRouteNumber(route.number);
  const colorsSet = routeToColor(route);
  const fontSize = basicFontSize(text);
  const styles = getStyles(size, colorsSet, fontSize);
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const basicFontSize = (text: string): number => {
  if (text.length === 1) {
    return 14;
  }
  if (text.length === 2) {
    return 12;
  }
  if (text.length === 3) {
    return 10;
  }
  if (text.length === 4) {
    return 10;
  }
  return 10;
};

const getStyles = (size: number, colorsSet: ColorsSet, fontSize: number) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: colorsSet.light,
    },
    text: {
      fontSize: fontSize * (size / 24),
      color: colors.white,
    },
  });

export type RouteCircleProps = Props;
export default RouteCircle;
