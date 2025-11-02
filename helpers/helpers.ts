import * as Device from "expo-device";
import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";

export const withOpacity = (hex: string, alpha: number) => {
  const clean = hex.replace("#", "");

  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;

  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const pluralise = (str: string, count: number): string => {
  if (count === 1) {
    return str;
  }

  if (str.endsWith("y")) {
    return str.replace(/y$/, "ies");
  }

  if (str.endsWith("ch")) {
    return `${str}es`;
  }

  return `${str}s`;
};

export const ucfirst = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const adId = (ios: string, android: string, test: string): string => {
  if (Device.isDevice) {
    if (Platform.OS === "android") {
      return android;
    }

    return ios;
  }

  return test;
};
