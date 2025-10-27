import { Colors } from "@/constants/Colors";
import { withOpacity } from "@/helpers/helpers";
import { View, Text } from "react-native";
import React from "react";
import { IconSymbol } from "@/components/Ui/IconSymbol";

export type WarningProps = {
  faded?: boolean;
  noIcon?: boolean;
  children: React.ReactNode;
};

export function Warning({
  faded = false,
  noIcon = false,
  children,
}: WarningProps) {
  return (
    <View
      style={[
        {
          borderRadius: 4,
          borderWidth: 2,
          shadowColor: "#000",
          padding: 8,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 1,
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 4,
        },
        faded && {
          borderColor: withOpacity(Colors.negative, 0.2),
          backgroundColor: withOpacity(Colors.negativeDark, 0.05),
        },
        !faded && {
          borderColor: Colors.negativeDark,
          backgroundColor: withOpacity(Colors.negativeDark, 0.2),
        },
      ]}
    >
      {!noIcon && (
        <IconSymbol
          name="exclamationmark.triangle.fill"
          color={Colors.negative}
          size={32}
        />
      )}

      <View style={{ flex: 1, flexShrink: 1, flexWrap: "wrap" }}>
        {children}
      </View>
    </View>
  );
}
