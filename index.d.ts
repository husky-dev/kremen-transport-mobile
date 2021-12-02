declare module 'react-native-config' {
  export interface NativeConfig {
    APP_ENV?: string;
    APP_LOG_LEVEL?: string;
    GOOGLE_MAPS_API_KEY?: string;
  }
  export const Config: NativeConfig;
  export default Config;
}

declare module '*.png' {
  import { ImageRequireSource } from 'react-native';
  const content: ImageRequireSource;
  export default content;
}
