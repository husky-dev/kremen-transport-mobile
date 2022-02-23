import { RoundedIconBtn } from '@components/Buttons';
import { BusMarker, CurPositionMarker, RoutePath, StationMarker } from '@components/Map';
import { i18n, useLocation } from '@core';
import { defRoutePathColors, routeIdToColor, routeToColor, TransportStation } from '@core/api';
import { TransportBus, TransportRoute } from '@core/api/types';
import { config } from '@core/config';
import { coordinates } from '@core/consts';
import { defSelectedRouteIds } from '@core/data';
import { Log } from '@core/log';
import { getStorageParam, useStorage } from '@core/storage';
import { getScreenAspectRatio, mapCustomStyle, mapDarkStyle, ViewStyleProps } from '@styles';
import { errToStr, isMapRegion, isNumArrOrUndef, latLngToLatitudeLongitude, mapRegionToZoomLevel } from '@utils';
import { Actionsheet, useColorMode } from 'native-base';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import AboutModal from './components/AboutModal';

import MapBusInfo from './components/BusInfo';
import MapRoutesModal from './components/RotuesModal';
import MapStationInfo from './components/StationInfo';
import { routesToStatiosn } from './utils';

const log = Log('screens.Map');

type Props = ViewStyleProps;

const defLatitudeDelta = 0.1;
const latDeltaStep = 0.5;
const minLatDelta = 0.00156;
const maxLatDelta = 110;
const defLongitudeDelta = defLatitudeDelta * getScreenAspectRatio();

const selectedRoutesIdsStorage = getStorageParam('selectedRouteIds', isNumArrOrUndef);
const lastMapRegionStorage = getStorageParam('lastMapRegion', isMapRegion);

export const MapScreen: FC<Props> = ({ style }) => {
  const { buses, routes } = useStorage();
  const [region, setRegion] = useState<Region>({
    ...latLngToLatitudeLongitude(coordinates.kremen),
    latitudeDelta: defLatitudeDelta,
    longitudeDelta: defLongitudeDelta,
  });
  const zoom = mapRegionToZoomLevel(region);
  const stationsDisplayed = zoom > 13.5;
  const busPinType = zoom < 13.5 ? 'circle' : 'with-label';

  const [configsLoaded, setConfigsLoaded] = useState<boolean>(false);
  const [curPostitionLoaded, setCurPostitionLoaded] = useState<boolean>(false);

  const [selectedBus, setSelectedBus] = useState<TransportBus | undefined>(undefined);
  const [selectedStationId, setSelectedStationId] = useState<number | undefined>(undefined);
  const [selectedRoutesIds, setSelectedRoutesIds] = useState<number[]>(defSelectedRouteIds);
  const [routesModalOpen, setRoutesModalOpen] = useState<boolean>(false);
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);

  const mapRef = useRef<MapView>(null);
  const { hasLocationPermission, curPosition } = useLocation();
  const { colorMode: theme } = useColorMode();

  useEffect(() => {
    (async () => {
      try {
        const storedSelectedRoutesIds = await selectedRoutesIdsStorage.get();
        if (storedSelectedRoutesIds) setSelectedRoutesIds(storedSelectedRoutesIds);
        const lastMapRegion = await lastMapRegionStorage.get();
        if (lastMapRegion) setRegion(lastMapRegion);
      } catch (err: unknown) {
        log.err('loading configs err', { msg: errToStr(err) });
      } finally {
        setConfigsLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!curPosition || curPostitionLoaded || !mapRef.current) return;
    const { lat, lng } = curPosition;
    mapRef.current.animateToRegion({ ...region, latitude: lat, longitude: lng });
    setCurPostitionLoaded(true);
  }, [curPosition]);

  // Map

  const handleMapPress = () => {
    log.debug('handle map press');
    setSelectedBus(undefined);
    setSelectedStationId(undefined);
  };

  const handleRegionChange = (region: Region) => {
    // log.debug('region change', { ...region });
    setRegion(region);
    lastMapRegionStorage.set(region);
  };

  const handleZoomInPress = async () => {
    log.debug('handle zoom in press');
    if (!mapRef.current) return;
    let newLatDelta = region.latitudeDelta * latDeltaStep;
    if (newLatDelta < minLatDelta) newLatDelta = minLatDelta;
    const newLngDelta = newLatDelta * getScreenAspectRatio();
    mapRef.current.animateToRegion({ ...region, latitudeDelta: newLatDelta, longitudeDelta: newLngDelta });
  };

  const handleZoomOutPress = () => {
    log.debug('handle zoom out press');
    if (!mapRef.current) return;
    let newLatDelta = region.latitudeDelta / latDeltaStep;
    if (newLatDelta > maxLatDelta) newLatDelta = maxLatDelta;
    const newLngDelta = newLatDelta * getScreenAspectRatio();
    mapRef.current.animateToRegion({ ...region, latitudeDelta: newLatDelta, longitudeDelta: newLngDelta });
  };

  const handleBusMarkerPress = (item: TransportBus) => {
    log.debug('handle bus marker press', { item });
    setSelectedBus(item);
    if (mapRef.current) {
      mapRef.current.animateToRegion({ ...region, latitude: item.lat, longitude: item.lng });
    }
  };

  const handleStationMarkerPress = (item: TransportStation) => {
    log.debug('handle station marker press', { item });
    setSelectedStationId(item.sid);
    if (mapRef.current) {
      mapRef.current.animateToRegion({ ...region, latitude: item.lat, longitude: item.lng });
    }
  };

  const handleCurPostionPress = () => {
    if (!hasLocationPermission) {
      return Alert.alert(
        i18n({ uk: 'Помилка', ru: 'Ошибка', en: 'Error' }),
        i18n({
          uk: 'Ви повині надати доступ до вашого місцезнаходження для використання цієї функції',
          ru: 'Вы должны предоставить доступ к вашему местоположению для использования этой функции',
          en: 'You should provide an access to your location to use this function',
        }),
      );
    }
    if (!curPosition || !mapRef.current) return;
    const { lat, lng } = curPosition;
    mapRef.current.animateToRegion({ ...region, latitude: lat, longitude: lng });
  };

  // Routes

  const handleSelectedRoutesChange = (ids: number[]) => {
    setSelectedRoutesIds(ids);
    selectedRoutesIdsStorage.set(ids);
  };

  // Render

  const renderBusMarker = (item: TransportBus) => {
    const colors = routeIdToColor(item.rid, routes);
    const route = routes.find(itm => itm.rid === item.rid);
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
        key={`bus-${busPinType}-${item.tid}`}
        item={item}
        route={route}
        colors={colors}
        zIndex={zIndex}
        opacity={opacity}
        theme={theme}
        pin={busPinType}
        onPress={() => handleBusMarkerPress(item)}
      />
    );
  };

  const renderStation = (item: TransportStation) => {
    if (!stationsDisplayed) return null;
    return (
      <StationMarker
        key={`station-${item.rid}-${item.sid}`}
        item={item}
        zIndex={10}
        theme={theme}
        onPress={() => handleStationMarkerPress(item)}
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
  const selectedStation = selectedStationId ? displayedStations.find(itm => itm.sid === selectedStationId) : undefined;

  const styles = getStyles(useSafeAreaInsets());
  const mapStyle = theme === 'dark' ? [...mapDarkStyle, ...mapCustomStyle] : mapCustomStyle;

  if (!configsLoaded) return null;

  return (
    <>
      <View style={[styles.container, style]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          customMapStyle={mapStyle}
          loadingEnabled
          rotateEnabled={false}
          pitchEnabled={false}
          onPress={handleMapPress}
          onRegionChange={handleRegionChange}
        >
          {displayedRoutes.map(renderRoutePath)}
          {displayedStations.map(renderStation)}
          {displayedBuses.map(renderBusMarker)}
          {hasLocationPermission && !!curPosition && <CurPositionMarker position={curPosition} />}
        </MapView>
        {/* <MapRoutesPanel
          style={styles.routesPanel}
          routes={routes}
          selected={selectedRoutesIds}
          onPress={() => setRoutesModalOpen(true)}
        /> */}
        <View style={styles.menuPanel}>
          <RoundedIconBtn style={styles.controlBtn} icon="menu" onPress={() => setAboutModalOpen(true)} />
        </View>
        <View style={styles.controlsPanel}>
          <RoundedIconBtn style={styles.controlBtn} icon="bus" onPress={() => setRoutesModalOpen(true)} />
          <RoundedIconBtn style={styles.controlBtn} icon="plus" onPress={handleZoomInPress} />
          <RoundedIconBtn style={styles.controlBtn} icon="minus" onPress={handleZoomOutPress} />
          <RoundedIconBtn style={styles.controlBtn} icon="location" onPress={handleCurPostionPress} />
        </View>
        {config.env === 'dev' && (
          <View style={styles.versionWrap}>
            <Text style={styles.versionText}>{`v${config.version}`}</Text>
          </View>
        )}
      </View>
      <MapRoutesModal
        open={routesModalOpen}
        routes={routes}
        selected={selectedRoutesIds}
        onSelectedChange={handleSelectedRoutesChange}
        onClose={() => setRoutesModalOpen(false)}
      />
      <AboutModal open={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
      <Actionsheet isOpen={!!selectedStationId} onClose={() => setSelectedStationId(undefined)}>
        <Actionsheet.Content>{!!selectedStation && <MapStationInfo item={selectedStation} />}</Actionsheet.Content>
      </Actionsheet>
      <Actionsheet isOpen={!!selectedBus} onClose={() => setSelectedBus(undefined)}>
        <Actionsheet.Content pl={8} pr={8}>
          <MapBusInfo item={selectedBus} route={routes.find(itm => itm.rid === selectedBus?.rid)} />
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
    menuPanel: {
      position: 'absolute',
      left: 14,
      zIndex: 2,
      top: 14 + insets.top,
    },
    controlsPanel: {
      position: 'absolute',
      right: 14,
      bottom: 24,
      top: 24,
      zIndex: 2,
      justifyContent: 'center',
    },
    controlBtn: {
      marginTop: 4,
      marginBottom: 4,
    },
    routesPanel: {
      zIndex: 2,
      position: 'absolute',
      top: 14 + insets.top,
      right: 14,
    },
    versionWrap: {
      bottom: insets.bottom + 10,
      justifyContent: 'center',
      left: 10,
      right: 10,
      flexDirection: 'row',
      position: 'absolute',
      zIndex: 100,
    },
    versionText: {
      fontSize: 12,
      fontWeight: 'bold',
    },
  });

export type MapScreenProps = Props;
export default MapScreen;
