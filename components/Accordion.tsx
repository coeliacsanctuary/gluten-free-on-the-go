import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  ViewProps,
  TextProps,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/Ui/IconSymbol";

export type AccordionProps = {
  title: string;
  children: React.ReactNode;
  wrapperStyles?: ViewProps["style"];
  headerLabelStyles?: TextProps["style"];
  headerChevronColor?: string;
  innerBackgroundStyles?: ViewProps["style"];
  iconSize?: number;
  backgroundColor?: string;
};

export function Accordion({
  children,
  title,
  wrapperStyles,
  headerLabelStyles,
  headerChevronColor = Colors.text,
  innerBackgroundStyles,
  backgroundColor = Colors.background,
  iconSize = 18,
}: AccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <View
      style={[
        {
          borderRadius: 8,
          padding: 8,
          backgroundColor,
        },
        wrapperStyles,
      ]}
    >
      <TouchableOpacity
        onPress={() => setOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={[headerLabelStyles]}>{title}</Text>

          <IconSymbol
            name="chevron.down"
            size={iconSize}
            color={headerChevronColor}
            style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
          />
        </View>
      </TouchableOpacity>

      {open && (
        <View style={[{ marginTop: 8, padding: 8 }, innerBackgroundStyles]}>
          {children}
        </View>
      )}
    </View>
  );
}
