import { TransportStationIcon } from '@components/Transport';
import { api, TransportPrediction, TransportStation } from '@core/api';
import { Log } from '@core/log';
import { useStorage } from '@core/storage';
import { ViewStyleProps } from '@styles';
import { compact } from '@utils';
import { HStack, ScrollView, Spinner, Text, VStack } from 'native-base';
import React, { FC, useEffect, useState } from 'react';

import StationInfoPrediction from './components/Prediction';

const log = Log('screens.Map.StationInfo');

interface Props extends ViewStyleProps {
  item: TransportStation;
}

export const MapStationInfo: FC<Props> = ({ style, item }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | undefined>(undefined);
  const [predictions, setPredictions] = useState<TransportPrediction[]>([]);

  const { routes } = useStorage();

  useEffect(() => {
    updatePredictions();
    const updateHandler = setInterval(async () => updatePredictions(), 5000);
    return () => clearInterval(updateHandler);
  }, [item.sid]);

  const updatePredictions = async () => {
    try {
      setErr(undefined);
      setLoading(true);
      const data = await api.transport.stationPrediction(item.sid);
      setLoading(false);
      setPredictions(data);
    } catch (err: unknown) {
      setLoading(false);
      setErr('Помилка отримання даних');
    }
  };

  const renderPredictions = () => {
    if (loading && !predictions.length) return <Spinner accessibilityLabel="Отримання даних" color="primary.500" />;
    if (!loading && err) return <Text>{`Помилка завантаження даних`}</Text>;
    if (!loading && !predictions.length) return <Text>{`Дані відсутні`}</Text>;
    return compact(predictions.sort((a, b) => a.prediction - b.prediction).map(renderPrediction));
  };

  const renderPrediction = (itm: TransportPrediction) => {
    const route = routes.find(cur => cur.rid === itm.rid);
    if (!route) log.warn('unable to find route with id', { rid: itm.rid });
    return route ? <StationInfoPrediction key={itm.tid} item={itm} route={route} /> : null;
  };

  return (
    <HStack style={style} w="100%" space={3} pl="16px" pr="16px">
      <TransportStationIcon size={48} />
      <VStack mt="-5px">
        <Text
          _dark={{
            color: 'warmGray.50',
          }}
          color="coolGray.800"
          bold
        >
          {item.name}
        </Text>
        <ScrollView horizontal mt="6px" pt="4px" pb="4px">
          <HStack space={2}>{renderPredictions()}</HStack>
        </ScrollView>
      </VStack>
    </HStack>
  );
};

export type MapStationInfoProps = Props;
export default MapStationInfo;
