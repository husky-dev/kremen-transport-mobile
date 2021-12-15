import { StorageProvider } from '@core/storage';
import MapScreen from '@screens/Map';
import React from 'react';
import { StyleSheet } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { config } from '@core/config';
import { SafeAreaProvider } from 'react-native-safe-area-context';

Sentry.init({
  dsn: config.sentry.dsn,
  tracesSampleRate: 1.0,
});

export const App = () => {
  return (
    <SafeAreaProvider>
      <StorageProvider>
        <MapScreen style={styles.screen} />
      </StorageProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
});

export default Sentry.wrap(App);
