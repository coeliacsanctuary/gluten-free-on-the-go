import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Platform } from "react-native";

export function ScreenWrapper({ ...otherProps }) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flexDirection: "column",
        gap: 8,
        flex: 1,
        fontFamily: "Raleway_400Regular",
        paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
      }}
      {...otherProps}
    />
  );
}
