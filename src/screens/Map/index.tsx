import { RoundedIconBtn } from '@components/Buttons';
import { BusMarker } from '@components/Map';
import { api } from '@core/api';
import { TransportBus, TransportRoute } from '@core/api/types';
import { coordinates } from '@core/consts';
import { Log } from '@core/log';
import { getScreenAspectRatio, ViewStyleProps } from '@styles';
import { errToStr, latLngToLatitudeLongitude, mapRegionToZoom } from '@utils';
import React, { FC, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';

const log = Log('screens.Map');

type Props = ViewStyleProps;

const defLatitudeDelta = 0.1;
const latDeltaStep = 0.5;
const minLatDelta = 0.00156;
const maxLatDelta = 110;
const defLongitudeDelta = defLatitudeDelta * getScreenAspectRatio();

export const MapScreen: FC<Props> = ({ style }) => {
  const [buses, setBuses] = useState<TransportBus[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [region, setRegion] = useState<Region | undefined>();

  const [selectedBus, setSelectedBus] = useState<TransportBus | undefined>(undefined);
  const [selectedStationId, setSelectedStationId] = useState<number | undefined>(undefined);
  const [displayedRoutes, setDisplayedRoutes] = useState<number[]>([189, 188, 192, 187, 190, 191]);

  const mapRef = useRef<MapView>(null);

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

  const handleZoomInPress = async () => {
    log.debug('handle zoom in press');
    if (!mapRef.current || !region) return;
    let newLatDelta = region.latitudeDelta * latDeltaStep;
    if (newLatDelta < minLatDelta) newLatDelta = minLatDelta;
    const newLngDelta = newLatDelta * getScreenAspectRatio();
    mapRef.current.animateToRegion({ ...region, latitudeDelta: newLatDelta, longitudeDelta: newLngDelta });
  };

  const handleZoomOutPress = () => {
    log.debug('handle zoom out press');
    if (!mapRef.current || !region) return;
    let newLatDelta = region.latitudeDelta / latDeltaStep;
    if (newLatDelta > maxLatDelta) newLatDelta = maxLatDelta;
    const newLngDelta = newLatDelta * getScreenAspectRatio();
    mapRef.current.animateToRegion({ ...region, latitudeDelta: newLatDelta, longitudeDelta: newLngDelta });
  };

  const handleBusMarkerPress = (item: TransportBus) => {
    log.debug('handle bus marker press', { item });
    setSelectedBus(item);
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          ...latLngToLatitudeLongitude(coordinates.kremen),
          latitudeDelta: defLatitudeDelta,
          longitudeDelta: defLongitudeDelta,
        }}
        loadingEnabled
        rotateEnabled={false}
        pitchEnabled={false}
        onPress={handleMapPress}
        onRegionChange={newRegion => setRegion(newRegion)}
      >
        {buses.map(itm => (
          <BusMarker key={itm.tid} item={itm} onPress={() => handleBusMarkerPress(itm)} />
        ))}
      </MapView>
      <View style={styles.controlsPanel}>
        <RoundedIconBtn style={styles.controlsPanelBtn} icon="plus" onPress={handleZoomInPress} />
        <RoundedIconBtn style={styles.controlsPanelBtn} icon="minus" onPress={handleZoomOutPress} />
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
