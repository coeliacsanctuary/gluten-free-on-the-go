import {
  Pressable,
  View,
  Text,
  ViewProps,
  StyleSheet,
  ActivityIndicator,
  TextProps,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { withOpacity } from "@/helpers/helpers";

export type ButtonProps = ViewProps & {
  theme?: "primary" | "primaryLight" | "secondary";
  size?: "xs" | "small" | "medium" | "large";
  bold?: boolean;
  disabled?: boolean;
  loading?: boolean;
  clickHandler?: () => void;
  clickAttemptHandler?: () => void;
  textStyle?: TextProps["style"];
};

export default function Button({
  bold = false,
  disabled = false,
  theme = "primary",
  size = "medium",
  loading = false,
  clickHandler = () => undefined,
  clickAttemptHandler = () => undefined,
  style,
  textStyle = undefined,
  children,
}: ButtonProps) {
  const buttonStyles = StyleSheet.create({
    button: {
      width: "auto",
      alignItems: "center",
      position: "relative",
    },

    primary: { backgroundColor: Colors.primary },
    primaryLight: { backgroundColor: withOpacity(Colors.primaryLight, 0.5) },
    secondary: { backgroundColor: Colors.secondary },

    disabled: { opacity: 0.5 },

    xs: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
    },
    small: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 4,
    },
    medium: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 8,
    },
    large: {},
  });

  const textStyles = StyleSheet.create({
    primary: { color: Colors.text },
    primaryLight: { color: Colors.text },
    secondary: { color: Colors.text },

    xs: {},
    small: {},
    medium: { fontSize: 16 },
    large: {},
  });

  return (
    <Pressable
      onPress={() => (!disabled ? clickHandler() : clickAttemptHandler())}
    >
      <View
        style={[
          buttonStyles.button,
          buttonStyles[theme],
          buttonStyles[size],
          disabled && buttonStyles.disabled,
          style,
        ]}
      >
        <Text
          style={[
            textStyles[theme],
            textStyles[size],
            { fontWeight: bold ? 600 : 400 },
            loading && { opacity: 0 },
            textStyle,
          ]}
        >
          {children}
        </Text>
        <View
          style={[
            {
              width: "100%",
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
            },
            buttonStyles[size],
            loading ? { opacity: 1 } : { opacity: 0 },
          ]}
        >
          <ActivityIndicator
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
            size="small"
            color={Colors.text}
          />
        </View>
      </View>
    </Pressable>
  );
}
