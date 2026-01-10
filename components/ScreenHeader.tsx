import { Platform, Pressable, Text, View, ViewProps } from "react-native";
import { Colors } from "@/constants/Colors";
import { DefaultTheme } from "@/constants/DefaultTheme";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import { router } from "expo-router";
import { logEvent } from "@/services/analytics";
import { moderateScale } from "react-native-size-matters";

export type ScreenHeaderProps = ViewProps & {
  showBackButton?: boolean;
  showSearchButton?: boolean;
  showHamburgerButton?: boolean;
  onHamburgerPress?: () => void;
};

export function ScreenHeader({
  showBackButton = false,
  showSearchButton = true,
  showHamburgerButton = false,
  onHamburgerPress = () => undefined,
  children,
}: ScreenHeaderProps) {
  if (showSearchButton && showHamburgerButton) {
    throw new Error("Cannot show both search and hamburger buttons");
  }

  if (showHamburgerButton && !onHamburgerPress) {
    throw new Error(
      "Cannot show hamburger button without onHamburgerPress handler",
    );
  }

  return (
    <View
      style={[
        {
          paddingHorizontal: 8,
          backgroundColor: DefaultTheme.colors.primary,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        },
        Platform.OS === "ios" && { paddingVertical: 8 },
        Platform.OS === "android" && { paddingVertical: 12 },
      ]}
    >
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          gap: 12,
        }}
      >
        {showBackButton && (
          <Pressable
            style={{ paddingLeft: 4 }}
            onPress={() => {
              logEvent({ type: "header-back-button" });

              router.back();
            }}
          >
            <IconSymbol
              name="chevron.backward"
              color={Colors.text}
              size={Platform.OS === "android" ? 26 : 18}
            />
          </Pressable>
        )}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            color: Colors.text,
            fontWeight: "600",
            lineHeight: moderateScale(24),
            fontSize: moderateScale(16, 0.25),
          }}
        >
          {children}
        </Text>
      </View>

      {showSearchButton && (
        <Pressable
          style={{ paddingRight: 4 }}
          onPress={() => {
            logEvent({ type: "header-search" });

            router.navigate("/(tabs)/explore");
          }}
        >
          <IconSymbol name="magnifyingglass" color={Colors.text} size={24} />
        </Pressable>
      )}

      {showHamburgerButton && (
        <Pressable
          style={{ paddingRight: 4 }}
          onPress={() => onHamburgerPress()}
        >
          <IconSymbol name="line.3.horizontal" color={Colors.text} size={24} />
        </Pressable>
      )}
    </View>
  );
}
