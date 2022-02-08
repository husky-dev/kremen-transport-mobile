import { StorageProvider } from '@core/storage';
import MapScreen from '@screens/Map';
import React from 'react';
import { StyleSheet } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { config } from '@core/config';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { extendTheme, NativeBaseProvider, theme } from 'native-base';
import { colors } from '@styles';

Sentry.init({
  dsn: config.sentry.dsn,
  tracesSampleRate: 1.0,
});

export const App = () => {
  const theme = extendTheme({
    colors: {
      primary: colors.primary,
    },
    config: {
      initialColorMode: 'dark', // Changing initialColorMode to 'dark'
    },
  });
  return (
    <SafeAreaProvider>
      <StorageProvider>
        <NativeBaseProvider theme={theme}>
          <MapScreen style={styles.screen} />
        </NativeBaseProvider>
      </StorageProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
});

export default Sentry.wrap(App);
