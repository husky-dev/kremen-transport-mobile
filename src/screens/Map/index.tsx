import { RoundedIconBtn } from '@components/Buttons';
import { api } from '@core/api';
import { TransportBus, TransportRoute } from '@core/api/types';
import { coordinates } from '@core/consts';
import { Log } from '@core/log';
import { getScreenAspectRatio, ViewStyleProps } from '@styles';
import { errToStr, latLngToLatitudeLongitude } from '@utils';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

const log = Log('screens.Map');

type Props = ViewStyleProps;

const defLatitudeDelta = 0.1;
const defLongitudeDelta = defLatitudeDelta * getScreenAspectRatio();

export const MapScreen: FC<Props> = ({ style }) => {
  const [buses, setBuses] = useState<TransportBus[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);

  const [selectedBus, setSelectedBus] = useState<TransportBus | undefined>(undefined);
  const [selectedStationId, setSelectedStationId] = useState<number | undefined>(undefined);
  const [displayedRoutes, setDisplayedRoutes] = useState<number[]>([189, 188, 192, 187, 190, 191]);

  useEffect(() => {
    updateData();
  }, []);

  const updateData = async () => {
    try {
      log.debug('updating data');
      const [newRoutes, newBuses] = await Promise.all([api.routes(), api.buses()]);
      log.debug('updating data done', { routes: newRoutes.length, buses: newBuses.length });
      setBuses(newBuses);
      setRoutes(newRoutes);
    } catch (err: unknown) {
      log.err('updating data err', { err: errToStr(err) });
    }
  };

  const handleMapPress = () => {
    log.debug('handle map press');
    setSelectedBus(undefined);
    setSelectedStationId(undefined);
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...latLngToLatitudeLongitude(coordinates.kremen),
          latitudeDelta: defLatitudeDelta,
          longitudeDelta: defLongitudeDelta,
        }}
        rotateEnabled={false}
        pitchEnabled={false}
        onPress={handleMapPress}
      />
      <View style={styles.controlsPanel}>
        <RoundedIconBtn style={styles.controlsPanelBtn} icon="plus" />
        <RoundedIconBtn style={styles.controlsPanelBtn} icon="minus" />
        <RoundedIconBtn style={styles.controlsPanelBtn} icon="location" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  map: {
    flex: 1,
  },
  controlsPanel: {
    position: 'absolute',
    right: 14,
    bottom: 24,
    top: 24,
    zIndex: 2,
    justifyContent: 'center',
  },
  controlsPanelBtn: {
    marginTop: 4,
    marginBottom: 4,
  },
});

export type MapScreenProps = Props;
export default MapScreen;
