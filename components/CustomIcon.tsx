import { SvgProps } from "react-native-svg";
import React from "react";

// Import SVGs as React components
const icons: Record<string, React.FC<SvgProps>> = {
  "100-gluten-free": require("@/assets/icons/100-gluten-free.svg").default,
  "afternoon-tea": require("@/assets/icons/afternoon-tea.svg").default,
  attraction: require("@/assets/icons/attraction.svg").default,
  breakfast: require("@/assets/icons/breakfast.svg").default,
  bsky: require("@/assets/icons/bsky.svg").default,
  chinese: require("@/assets/icons/chinese.svg").default,
  eatery: require("@/assets/icons/eatery.svg").default,
  facebook: require("@/assets/icons/facebook.svg").default,
  "fish-and-chips": require("@/assets/icons/fish-and-chips.svg").default,
  "fodmap-friendly": require("@/assets/icons/fodmap-friendly.svg").default,
  "gluten-free-menu": require("@/assets/icons/gluten-free-menu.svg").default,
  hotel: require("@/assets/icons/hotel.svg").default,
  instagram: require("@/assets/icons/instagram.svg").default,
  marker: require("@/assets/icons/marker.svg").default,
  parking: require("@/assets/icons/parking.svg").default,
  pizza: require("@/assets/icons/pizza.svg").default,
  "place-to-sleep": require("@/assets/icons/place-to-sleep.svg").default,
  "pub-grub": require("@/assets/icons/pub-grub.svg").default,
  tiktok: require("@/assets/icons/tiktok.svg").default,
  twitter: require("@/assets/icons/twitter.svg").default,
  wifi: require("@/assets/icons/wifi.svg").default,
};

export type CustomIconProps = Omit<SvgProps, "width" | "height"> & {
  name: keyof typeof icons;
  width?: number;
  height?: number;
};

export function CustomIcon({
  name,
  width = 20,
  height = 20,
  ...rest
}: CustomIconProps) {
  const IconComponent = icons[name];

  if (IconComponent) {
    return <IconComponent width={width} height={height} {...rest} />;
  }

  return null;
}
