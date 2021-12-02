import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';

export type Color = string;

export type Style = ViewStyle | ImageStyle | TextStyle;

export interface Styles {
  [key: string]: Style;
}

export type ViewStyleProp = StyleProp<ViewStyle>;

export interface ViewStyleProps {
  style?: ViewStyleProp;
}
