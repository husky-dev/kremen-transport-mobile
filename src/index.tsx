import { StorageProvider } from '@core/storage';
import MapScreen from '@screens/Map';
import React from 'react';
import { StyleSheet } from 'react-native';

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

export default App;
