import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export function ScreenWrapper({ ...otherProps }) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flexDirection: "column",
        gap: 8,
        flex: 1,
        fontFamily: "Raleway_400Regular",
        paddingBottom: insets.bottom,
      }}
      {...otherProps}
    />
  );
}
