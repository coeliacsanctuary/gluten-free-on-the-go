import { Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import React from "react";

export type LabelProps = {
  label: string;
  required?: boolean;
  children?: React.ReactNode;
};

export default function Label({
  label,
  required = false,
  children = undefined,
}: LabelProps) {
  return (
    <View style={{ gap: 1 }}>
      <Text style={{ color: Colors.primaryDark, fontWeight: 600 }}>
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
