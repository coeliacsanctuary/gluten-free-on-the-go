import { Pressable, Text, View, ViewProps } from "react-native";
import { Colors } from "@/constants/Colors";
import { DefaultTheme } from "@/constants/DefaultTheme";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import { router } from "expo-router";

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
      style={{
        paddingHorizontal: 8,
        paddingBottom: 8,
        paddingTop: 6,
        backgroundColor: DefaultTheme.colors.primary,
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          gap: 12,
        }}
      >
        {showBackButton && (
          <Pressable style={{ paddingLeft: 4 }} onPress={() => router.back()}>
            <IconSymbol name="chevron.backward" color={Colors.text} size={18} />
          </Pressable>
        )}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            color: Colors.text,
            fontSize: 18,
            fontWeight: "600",
            lineHeight: 32,
          }}
        >
          {children}
        </Text>
      </View>

      {showSearchButton && (
        <Pressable
          style={{ paddingRight: 4 }}
          onPress={() => router.navigate("/(tabs)/explore")}
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
