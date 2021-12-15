import { StorageProvider } from '@core/storage';
import MapScreen from '@screens/Map';
import React from 'react';
import { StyleSheet } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { config } from '@core/config';

Sentry.init({
  dsn: config.sentry.dsn,
  tracesSampleRate: 1.0,
});

export const App = () => {
  return (
    <StorageProvider>
      <MapScreen style={styles.screen} />
    </StorageProvider>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
});

export default Sentry.wrap(App);
