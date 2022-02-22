import { DirectionIcon } from '@components/Transport';
import { i18n } from '@core';
import { api, getTransportStationPinUri, TransportPrediction, TransportStation } from '@core/api';
import { Log } from '@core/log';
import { useStorage } from '@core/storage';
import { ViewStyleProps } from '@styles';
import { compact } from '@utils';
import { HStack, ScrollView, Spinner, Text, VStack } from 'native-base';
import React, { FC, useEffect, useState } from 'react';
import { Image } from 'react-native';

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
      setErr(i18n({ uk: `Помилка завантаження даних`, ru: `Ошибка загрузки даных`, en: `Loading data error` }));
    }
  };

  const renderPredictions = () => {
    if (loading && !predictions.length) return <Spinner accessibilityLabel="Отримання даних" color="primary.500" />;
    if (!loading && err) return <Text>{err}</Text>;
    if (!loading && !predictions.length)
      return <Text>{i18n({ uk: `Дані відсутні`, ru: `Даные отсутствуют`, en: `No data` })}</Text>;
    return compact(predictions.sort((a, b) => a.prediction - b.prediction).map(renderPrediction));
  };

  const renderPrediction = (itm: TransportPrediction) => {
    const route = routes.find(cur => cur.rid === itm.rid);
    if (!route) log.warn('unable to find route with id', { rid: itm.rid });
    return route ? <StationInfoPrediction key={itm.tid} item={itm} route={route} /> : null;
  };

  return (
    <HStack style={style} w="100%" space={3} pl="16px" pr="16px">
      <Image style={{ width: 48, height: 48 }} source={{ uri: getTransportStationPinUri({ density: 5 }) }} />
      <VStack mt="-5px">
        <HStack alignItems="center">
          <DirectionIcon style={{ height: 12, width: 12 }} direction={!item.directionForward ? 'up' : 'down'} />
          <Text
            ml="5px"
            _dark={{
              color: 'warmGray.50',
            }}
            color="coolGray.800"
            bold
          >
            {item.name}
          </Text>
        </HStack>
        <ScrollView horizontal mt="6px" pt="4px" pb="4px">
          <HStack space={2}>{renderPredictions()}</HStack>
        </ScrollView>
      </VStack>
    </HStack>
  );
};

export type MapStationInfoProps = Props;
export default MapStationInfo;
