import { RoundedIconBtn } from '@components/Buttons';
import { BusMarker, RoutePath, StationMarker } from '@components/Map';
import {
  api,
  defRoutePathColors,
  isTransportBusArrOrUndef,
  isTransportRouteArrOrUndef,
  routeIdToColor,
  routeToColor,
  TransportStation,
} from '@core/api';
import { TransportBus, TransportRoute } from '@core/api/types';
import { coordinates } from '@core/consts';
import { Log } from '@core/log';
import { getStorageParam } from '@core/storage';
import { getScreenAspectRatio, ViewStyleProps } from '@styles';
import { errToStr, isNumArrOrUndef, latLngToLatitudeLongitude } from '@utils';
import React, { FC, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';

import { routesToStatiosn } from './utils';

const log = Log('screens.Map');

type Props = ViewStyleProps;

const defLatitudeDelta = 0.1;
const latDeltaStep = 0.5;
const minLatDelta = 0.00156;
const maxLatDelta = 110;
const defLongitudeDelta = defLatitudeDelta * getScreenAspectRatio();

const defSelectedRouteIds = [189, 188, 192, 187, 190, 191];

const mapMarkerSize = 46;
const stationMarkerSize = Math.round(mapMarkerSize / 2.7);

const busesStorage = getStorageParam('buses', isTransportBusArrOrUndef);
const routesStorage = getStorageParam('routes', isTransportRouteArrOrUndef);
const selectedRoutesIdsStorage = getStorageParam('selectedRouteIds', isNumArrOrUndef);

export const MapScreen: FC<Props> = ({ style }) => {
  const [buses, setBuses] = useState<TransportBus[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [region, setRegion] = useState<Region | undefined>();

  const [selectedBus, setSelectedBus] = useState<TransportBus | undefined>(undefined);
  const [selectedStationId, setSelectedStationId] = useState<number | undefined>(undefined);
  const [selectedRoutesIds, setSelectedRoutesIds] = useState<number[]>(defSelectedRouteIds);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    loadData();
    updateData();
  }, []);

  const loadData = async () => {
    try {
      log.debug('load data');
      const [loadedBuses, loadedRoutes, loadedSelectedRouteIds] = await Promise.all([
        busesStorage.get(),
        routesStorage.get(),
        selectedRoutesIdsStorage.get(),
      ]);
      log.debug('load data done');
      setRoutes(loadedRoutes || []);
      setBuses(loadedBuses || []);
      setSelectedRoutesIds(loadedSelectedRouteIds || defSelectedRouteIds);
    } catch (err: unknown) {
      log.err('load data err', { err: errToStr(err) });
    }
  };

  const updateData = async () => {
    try {
      log.debug('updating data');
      const [newRoutes, newBuses] = await Promise.all([api.routes(), api.buses()]);
      log.debug('updating data done', { routes: newRoutes.length, buses: newBuses.length });
      setRoutes(newRoutes);
      routesStorage.set(newRoutes);
      setBuses(newBuses);
      busesStorage.set(newBuses);
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
    if (mapRef.current && region) {
      mapRef.current.animateToRegion({ ...region, latitude: item.lat, longitude: item.lng });
    }
  };

  const handleStationMarkerPress = (item: TransportStation) => {
    log.debug('handle station marker press', { item });
    if (mapRef.current && region) {
      mapRef.current.animateToRegion({ ...region, latitude: item.lat, longitude: item.lng });
    }
  };

  const renderBusMarker = (item: TransportBus) => {
    const colors = routeIdToColor(item.rid, routes);
    let opacity = 1.0;
    let zIndex = 20;
    if (selectedBus) {
      if (selectedBus.rid !== item.rid) {
        opacity = 0.5;
      } else {
        zIndex = 21;
      }
    }
    return (
      <BusMarker
        key={`bus-${item.tid}`}
        item={item}
        colors={colors}
        size={mapMarkerSize}
        zIndex={zIndex}
        opacity={opacity}
        onPress={() => handleBusMarkerPress(item)}
      />
    );
  };

  const renderRoutePath = (item: TransportRoute) => {
    let colors = defRoutePathColors;
    let opacity = 0.5;
    let zIndex = 1;
    if (selectedBus) {
      if (selectedBus.rid === item.rid) {
        opacity = 1.0;
        zIndex = 2;
        colors = routeToColor(item);
      } else {
        opacity = 0.3;
        colors = defRoutePathColors;
      }
    }
    return <RoutePath key={`path-${item.rid}`} item={item} colors={colors} opacity={opacity} zIndex={zIndex} />;
  };

  const displayedRoutes = routes.filter(({ rid }) => selectedRoutesIds.includes(rid));
  const displayedBuses = buses.filter(({ rid }) => selectedRoutesIds.includes(rid));
  const displayedStations = routesToStatiosn(displayedRoutes);

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
        {displayedBuses.map(renderBusMarker)}
        {displayedRoutes.map(renderRoutePath)}
        {displayedStations.map(item => (
          <StationMarker
            key={`station-${item.rid}-${item.sid}`}
            item={item}
            zIndex={10}
            size={stationMarkerSize}
            onPress={() => handleStationMarkerPress(item)}
          />
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
