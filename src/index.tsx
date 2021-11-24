import React from 'react';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

export const App = () => {
  return <MapView style={styles.container} />;
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
