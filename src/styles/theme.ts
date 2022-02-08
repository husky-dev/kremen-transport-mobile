import { extendTheme } from 'native-base';
import { colors } from './colors';

export const theme = extendTheme({
  colors: {
    primary: colors.primary,
  },
  config: {
    initialColorMode: 'dark', // Changing initialColorMode to 'dark'
  },
});
