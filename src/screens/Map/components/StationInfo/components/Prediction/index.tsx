import { TransportBusIcon } from '@components/Transport';
import { TransportPrediction, TransportRoute } from '@core/api';
import { clearRouteNumberTransportInfo } from '@core/utils';
import { ViewStyleProps } from '@styles';
import { numToTimeStr } from '@utils';
import { HStack, Text, VStack } from 'native-base';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

interface Props extends ViewStyleProps {
  item: TransportPrediction;
  route: TransportRoute;
}

export const StationInfoPrediction: FC<Props> = ({ style, item, route }) => {
  const { numStr, metric } = numToTimeStr(item.prediction);
  return (
    <VStack style={[styles.container, style]} space={1} alignItems="center">
      <HStack background={route.color} pl="6px" pr="6px" borderRadius={4} alignItems="center" justifyContent="space-between">
        <TransportBusIcon size={14} type={route.type} />
        <Text textAlign="center" fontSize="sm" ml="2px" bold>
          {clearRouteNumberTransportInfo(route.number).replace('-', '').toLowerCase()}
        </Text>
      </HStack>
      <Text fontSize="10px" bold>{`${numStr} ${metric}`}</Text>
    </VStack>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export type StationInfoPredictionProps = Props;
export default StationInfoPrediction;
