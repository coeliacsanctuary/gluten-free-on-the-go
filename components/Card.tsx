import { View, type ViewProps } from "react-native";
import { Colors } from "@/constants/Colors";

export type CardProps = ViewProps & {
  hideShadow?: boolean;
};

export function Card({ hideShadow, style, ...otherProps }: CardProps) {
  return (
    <View
      style={[
        {
          flexDirection: "column",
          gap: 8,
          backgroundColor: Colors.background,
          borderRadius: 8,
          padding: 12,
        },
        !hideShadow && {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
