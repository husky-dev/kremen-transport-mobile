import { LocationProvider } from '@core';
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

const cplog = Log('codepush');

Sentry.init({
  dsn: config.sentry.dsn,
  tracesSampleRate: 1.0,
  beforeSend: event => (config.env !== 'prd' ? null : event),
});

const App = () => {
  const theme = extendTheme({
    colors: {
      primary: colors.primary,
    },
    config: {
      initialColorMode: 'dark',
    },
  });
  return (
    <SafeAreaProvider>
      <StorageProvider>
        <LocationProvider>
          <NativeBaseProvider theme={theme}>
            <MapScreen style={styles.screen} />
          </NativeBaseProvider>
        </LocationProvider>
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
        return cplog.info('checking for updates');
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        return cplog.info('downloading package');
      case codePush.SyncStatus.INSTALLING_UPDATE:
        return cplog.info('installing update');
      case codePush.SyncStatus.UP_TO_DATE:
        return cplog.info('up-to-date');
      case codePush.SyncStatus.UPDATE_INSTALLED:
        return cplog.info('update installed');
    }
  }

  codePushDownloadDidProgress(progress: DownloadProgress) {
    cplog.debug('download progress', { total: progress.totalBytes, received: progress.receivedBytes });
  }

  render() {
    return <App />;
  }
}

export default Sentry.wrap(
  codePush({
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  })(AppWithCodePush),
);
