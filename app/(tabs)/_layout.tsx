import { router, Tabs, Href } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import TabBarBackground from "@/components/Ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const extraBottom = Platform.OS === "android" && insets.bottom === 0 ? 20 : 0;

  return (
    <Tabs
      initialRouteName="nearby"
      screenListeners={{
        tabPress: (e) => {
          const routeBits = e.target?.split("-");

          if (!routeBits) {
            return;
          }

          let found = false;

          while (!found) {
            if (routeBits[routeBits.length - 1].match(/\d+/)) {
              routeBits.pop();
            } else {
              found = true;
            }
          }

          const routeName = routeBits.join("-");

          if (!routeName) {
            return;
          }

          console.log({ routeName });

          e.preventDefault();

          router.replace(`/(tabs)/${routeName}` as Href);
        },
      }}
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: true,
        tabBarBackground: TabBarBackground,
        tabBarStyle: [
          {
            marginTop: 0,
            height: 56,
            paddingBottom: extraBottom,
          },
          Platform.OS === "ios" && { position: "absolute" },
        ],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: "Nearby",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="location.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="location.magnifyingglass"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="recommend-a-place"
        options={{
          title: "Recommend",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="fork.knife.circle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="nationwide"
        options={{
          title: "Nationwide",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="building.2.crop.circle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More...",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="ellipsis" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
