import { RouteCircle } from '@components/Transport';
import { TransportRoute } from '@core/api';
import { sortRoutes } from '@core/utils';
import { ViewStyleProps } from '@styles';
import { colorWithAlpha, compact } from '@utils';
import React, { FC } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

interface Props extends ViewStyleProps {
  routes: TransportRoute[];
  selected: number[];
  onPress?: () => void;
}

export const MapRoutesPanel: FC<Props> = ({ style, routes, selected, onPress }) => {
  const selectedRoutes = sortRoutes(compact(selected.map(rid => routes.find(item => item.rid === rid))));
  return (
    <View style={[styles.container, style]}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.circlesWrap}>
          {selectedRoutes.map(route => (
            <RouteCircle key={route.rid} style={styles.circle} route={route} />
          ))}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorWithAlpha('#ffffff', 0.7),
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 2,
    paddingRight: 2,
    borderRadius: 3,
  },
  circlesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  circle: {
    marginLeft: 4,
    marginRight: 4,
  },
});

export type MapRoutesPanelProps = Props;
export default MapRoutesPanel;
