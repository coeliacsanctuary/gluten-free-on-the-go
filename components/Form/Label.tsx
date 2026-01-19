import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import { Colors } from "@/constants/Colors";
import React from "react";

export type LabelProps = {
  label: string;
  required?: boolean;
  children?: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
};

export default function Label({
  label,
  required = false,
  children = undefined,
  textStyle = undefined,
  style = undefined,
}: LabelProps) {
  return (
    <View style={[{ gap: 1 }, style]}>
      <Text style={[{ color: Colors.primaryDark, fontWeight: 600 }, textStyle]}>
        {label}
        {required && (
          <Text
            style={{ fontSize: 12, fontWeight: 600, color: Colors.negative }}
          >
            *
          </Text>
        )}
      </Text>
      {children}
    </View>
  );
}
