import { StyleSheet, Text, type TextProps } from "react-native";
import { Colors } from "@/constants/Colors";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "small";
};

/** @deprecated */
export function ThemedText({
  style,
  type = "default",
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        { color: Colors.text },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  small: {
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    paddingHorizontal: 16,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
