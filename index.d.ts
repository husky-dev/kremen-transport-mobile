declare module 'react-native-config' {
  export interface NativeConfig {
    APP_ENV?: string;
    GOOGLE_MAPS_API_KEY?: string;
  }
  export const Config: NativeConfig;
  export default Config;
}
