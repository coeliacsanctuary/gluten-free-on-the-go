import { ScreenWrapper } from "@/components/Ui/ScreenWrapper";
import { ScreenHeader } from "@/components/ScreenHeader";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ShopCtaCard } from "@/components/ShopCtaCard";
import React from "react";
import { WebsiteImageCard } from "@/components/WebsiteImageCard";
import { Card } from "@/components/Card";
import { Colors } from "@/constants/Colors";
import { CustomIcon, CustomIconProps } from "@/components/CustomIcon";
import { IconSymbol, IconSymbolName } from "@/components/Ui/IconSymbol";
import { baseUrl } from "@/constants/Http";
import { router } from "expo-router";
import { logScreen } from "@/services/analytics";

export default function MoreIndex() {
  logScreen("more");

  const links: ListItemProps[] = [
    {
      label: "About",
      icon: "info.circle",
      clickHandler: () => router.navigate("(tabs)/more/about"),
    },
    {
      label: "Contact",
      icon: "envelope.circle",
      clickHandler: () => Linking.openURL(baseUrl + "/contact"),
      borderBottom: false,
    },
  ];

  const socialLinks: ListItemProps[] = [
    {
      label: "Facebook",
      customIcon: "facebook",
      clickHandler: () =>
        Linking.openURL("https://www.facebook.com/coeliacsanctuary/"),
    },
    {
      label: "TikTok",
      customIcon: "tiktok",
      clickHandler: () =>
        Linking.openURL("https://www.tiktok.com/@coeliac.sanctuary"),
    },
    {
      label: "Instagram",
      customIcon: "instagram",
      clickHandler: () =>
        Linking.openURL("https://www.instagram.com/coeliacsanctuary"),
    },
    {
      label: "X (Twitter)",
      customIcon: "twitter",
      clickHandler: () => Linking.openURL("https://twitter.com/coeliacsanc"),
    },
    {
      label: "Blue Sky",
      customIcon: "bsky",
      clickHandler: () =>
        Linking.openURL(
          "https://bsky.app/profile/coeliacsanctuary.bsky.social",
        ),
      borderBottom: false,
    },
  ];

  return (
    <ScreenWrapper>
      <ScreenHeader>Coeliac Sanctuary - Gluten Free on the Go</ScreenHeader>

      <ScrollView
        style={[
          { paddingHorizontal: 8 },
          Platform.OS === "ios" && { marginBottom: 48 },
          Platform.OS === "android" && { marginBottom: 24 },
        ]}
      >
        <ShopCtaCard />

        <WebsiteImageCard />

        <Card style={{ padding: 0, gap: 0, marginVertical: 16 }}>
          {links.map((link) => (
            <ListItem key={link.label} {...link} />
          ))}
        </Card>

        <Card style={{ padding: 0, gap: 0 }}>
          {socialLinks.map((link) => (
            <ListItem key={link.label} {...link} />
          ))}
        </Card>
      </ScrollView>
    </ScreenWrapper>
  );
}

type ListItemProps = {
  label: string;
  icon?: IconSymbolName;
  customIcon?: CustomIconProps["name"];
  clickHandler: () => void;
  borderBottom?: boolean;
};

function ListItem({
  label,
  icon = undefined,
  customIcon = undefined,
  clickHandler,
  borderBottom = true,
}: ListItemProps) {
  return (
    <Pressable onPress={clickHandler}>
      <View
        style={{
          borderBottomWidth: borderBottom ? 1 : 0,
          borderBottomColor: Colors.primary,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingVertical: 8,
          paddingHorizontal: 12,
        }}
      >
        {!!icon && <IconSymbol name={icon} size={22} color={Colors.text} />}
        {!!customIcon && <CustomIcon name={customIcon} fill={Colors.text} />}
        <Text style={{ fontSize: 18 }}>{label}</Text>
      </View>
    </Pressable>
  );
}
