import MapScreen from '@screens/Map';
import React from 'react';
import { StyleSheet } from 'react-native';

export const App = () => {
  return <MapScreen style={styles.screen} />;
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
});

export default App;
