import { RoundedIconBtn } from '@components/Buttons';
import { BusMarker, RoutePath, StationMarker } from '@components/Map';
import { defRoutePathColors, routeIdToColor, routeToColor, TransportStation } from '@core/api';
import { TransportBus, TransportRoute } from '@core/api/types';
import { coordinates } from '@core/consts';
import { defSelectedRouteIds } from '@core/data';
import { Log } from '@core/log';
import { getStorageParam, useStorage } from '@core/storage';
import { getScreenAspectRatio, ViewStyleProps } from '@styles';
import { isNumArrOrUndef, latLngToLatitudeLongitude } from '@utils';
import { Actionsheet, Text } from 'native-base';
import React, { FC, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapRoutesModal from './components/RotuesModal';

import MapRoutesPanel from './components/RoutesPanel';
import { routesToStatiosn } from './utils';

const log = Log('screens.Map');

type Props = ViewStyleProps;

const defLatitudeDelta = 0.1;
const latDeltaStep = 0.5;
const minLatDelta = 0.00156;
const maxLatDelta = 110;
const defLongitudeDelta = defLatitudeDelta * getScreenAspectRatio();

const mapMarkerSize = 46;
const stationMarkerSize = Math.round(mapMarkerSize / 2.7);

const selectedRoutesIdsStorage = getStorageParam('selectedRouteIds', isNumArrOrUndef);

export const MapScreen: FC<Props> = ({ style }) => {
  const { buses, routes } = useStorage();
  const [region, setRegion] = useState<Region | undefined>();

  const [selectedBus, setSelectedBus] = useState<TransportBus | undefined>(undefined);
  const [selectedStationId, setSelectedStationId] = useState<number | undefined>(undefined);
  const [selectedRoutesIds, setSelectedRoutesIds] = useState<number[]>(defSelectedRouteIds);
  const [routesModalOpen, setRoutesModalOpen] = useState<boolean>(false);

  const mapRef = useRef<MapView>(null);

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
    // if (mapRef.current && region) {
    //   mapRef.current.animateToRegion({ ...region, latitude: item.lat, longitude: item.lng });
    // }
    setSelectedStationId(item.sid);
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

  const styles = getStyles(useSafeAreaInsets());

  return (
    <>
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
        <MapRoutesPanel style={styles.routesPanel} routes={routes} selected={selectedRoutesIds} />
        <View style={styles.controlsPanel}>
          <RoundedIconBtn style={styles.controlsPanelBtn} icon="bus" onPress={() => setRoutesModalOpen(true)} />
          <RoundedIconBtn style={styles.controlsPanelBtn} icon="plus" onPress={handleZoomInPress} />
          <RoundedIconBtn style={styles.controlsPanelBtn} icon="minus" onPress={handleZoomOutPress} />
          <RoundedIconBtn style={styles.controlsPanelBtn} icon="location" />
        </View>
      </View>
      <MapRoutesModal
        open={routesModalOpen}
        routes={routes}
        selected={selectedRoutesIds}
        onClose={() => setRoutesModalOpen(false)}
      />
      <Actionsheet isOpen={!!selectedStationId} onClose={() => setSelectedStationId(undefined)}>
        <Actionsheet.Content>
          <Text>{'Hello'}</Text>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

const getStyles = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {},
    map: {
      flex: 1,
      zIndex: 1,
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
    routesPanel: {
      zIndex: 2,
      position: 'absolute',
      top: 14 + insets.top,
      left: 14,
    },
  });

export type MapScreenProps = Props;
export default MapScreen;
