import { config } from '@core/config';
import { Log } from '@core/log';
import { StorageProvider } from '@core/storage';
import MapScreen from '@screens/Map';
import * as Sentry from '@sentry/react-native';
import { colors } from '@styles';
import { extendTheme, NativeBaseProvider } from 'native-base';
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import codePush, { DownloadProgress } from 'react-native-code-push';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const log = Log('app');

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

class AppWithCodePush extends PureComponent {
  codePushStatusDidChange(status: codePush.SyncStatus) {
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        return log.debug('checking for updates');
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        return log.info('downloading package');
      case codePush.SyncStatus.INSTALLING_UPDATE:
        return log.info('installing update');
      case codePush.SyncStatus.UP_TO_DATE:
        return log.debug('up-to-date');
      case codePush.SyncStatus.UPDATE_INSTALLED:
        return log.info('update installed');
    }
  }

  codePushDownloadDidProgress(progress: DownloadProgress) {
    log.debug('download progress', { total: progress.totalBytes, received: progress.receivedBytes });
  }

  render() {
    return <App />;
  }
}

export default Sentry.wrap(codePush(AppWithCodePush));
