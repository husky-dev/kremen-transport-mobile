import { extendTheme } from 'native-base';
import { colors } from './colors';

export const theme = extendTheme({
  colors: {
    primary: colors.primary,
  },
  config: {
    initialColorMode: 'light', // Changing initialColorMode to 'dark'
  },
});
