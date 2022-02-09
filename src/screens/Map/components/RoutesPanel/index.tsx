import { RouteCircle } from '@components/Transport';
import { TransportRoute } from '@core/api';
import { sortRoutes } from '@core/utils';
import { ViewStyleProps } from '@styles';
import { colorWithAlpha, compact } from '@utils';
import { Box } from 'native-base';
import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props extends ViewStyleProps {
  routes: TransportRoute[];
  selected: number[];
  onPress?: () => void;
}

export const MapRoutesPanel: FC<Props> = ({ style, routes, selected, onPress }) => {
  const selectedRoutes = sortRoutes(compact(selected.map(rid => routes.find(item => item.rid === rid))));
  return (
    <Box style={[styles.container, style]} pb="5px" pt="5px" pl="2px" pr="2px" borderRadius={3}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.circlesWrap}>
          {selectedRoutes.map(route => (
            <RouteCircle key={route.rid} style={styles.circle} route={route} />
          ))}
        </View>
      </TouchableOpacity>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorWithAlpha('#ffffff', 0.7),
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
