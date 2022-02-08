import TransportIcon from '@components/Transport/Icon';
import { TransportBus, TransportRoute } from '@core/api';
import { clearRouteNumber } from '@core/utils';
import { HStack, VStack, Text } from 'native-base';
import React, { FC } from 'react';

interface Props {
  item: TransportBus;
  route?: TransportRoute;
}

export const MapBusInfo: FC<Props> = ({ item, route }) => {
  return (
    <HStack w="100%" space={3} alignItems="center">
      <TransportIcon type={item.type} backgroundColor={route?.color} />
      <VStack>
        <Text
          _dark={{
            color: 'warmGray.50',
          }}
          color="coolGray.800"
          bold
        >
          {clearRouteNumber(item.name)}
        </Text>
        {!!route && (
          <Text
            color="coolGray.600"
            _dark={{
              color: 'warmGray.200',
            }}
            fontSize={12}
            numberOfLines={1}
          >
            {route.name}
          </Text>
        )}
      </VStack>
    </HStack>
  );
};

export type MapBusInfoProps = Props;
export default MapBusInfo;
