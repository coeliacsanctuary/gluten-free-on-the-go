import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import TabBarBackground from "@/components/Ui/TabBarBackground";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="nearby"
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
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
          title: "Recommend a Place",
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
