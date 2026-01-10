import { View, type ViewProps } from "react-native";
import { Colors } from "@/constants/Colors";
import { forwardRef } from "react";

export type CardProps = ViewProps & {
  hideShadow?: boolean;
};

export const Card = forwardRef<View, CardProps>(
  ({ hideShadow, style, ...otherProps }, ref) => {
    return (
      <View
        ref={ref}
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
  },
);

Card.displayName = "Card";
