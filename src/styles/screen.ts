import { Dimensions } from 'react-native';

export const getScreenAspectRatio = () => {
  const screen = Dimensions.get('window');
  return screen.width / screen.height;
};
