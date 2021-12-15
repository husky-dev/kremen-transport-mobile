import { RouteCircle } from '@components/Transport';
import { TransportRoute } from '@core/api';
import { sortRoutes } from '@core/utils';
import { ViewStyleProps } from '@styles';
import { colorWithAlpha } from '@utils';
import { compact } from 'lodash';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

interface Props extends ViewStyleProps {
  routes: TransportRoute[];
  selected: number[];
}

export const MapRoutesPanel: FC<Props> = ({ style, routes, selected }) => {
  const selectedRoutes = sortRoutes(compact(selected.map(rid => routes.find(item => item.rid === rid))));
  return (
    <View style={[styles.container, style]}>
      <View style={styles.circlesWrap}>
        {selectedRoutes.map(route => (
          <RouteCircle key={route.rid} style={styles.circle} route={route} />
        ))}
      </View>
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
