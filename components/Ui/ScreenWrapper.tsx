import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Platform } from "react-native";

export function ScreenWrapper({ ...otherProps }) {
  const insets = useSafeAreaInsets();
  console.log(insets);
  return (
    <SafeAreaView
      edges={[]}
      style={{
        flexDirection: "column",
        gap: 8,
        flex: 1,
        fontFamily: "Raleway_400Regular",
      }}
      {...otherProps}
    />
  );
}
