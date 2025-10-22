import { Colors } from "@/constants/Colors";
import {
  DefaultTheme as RNDefaultTheme,
  Theme,
} from "@react-navigation/native";

export const DefaultTheme: Theme = {
  dark: false,
  colors: {
    primary: Colors.tint,
    background: Colors.appBackground,
    card: Colors.background,
    text: Colors.text,
    border: Colors.tint,
    notification: Colors.tint,
  },
  fonts: RNDefaultTheme.fonts,
};
