import { withOpacity } from "@/helpers/helpers";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Accordion, AccordionProps } from "@/components/Accordion";
import { View } from "react-native";

export type EateryBranchDropdownProps = AccordionProps & {
  title: string;
  theme: "outer" | "inner";
  children: React.ReactNode;
};

export function EateryBranchDropdown({
  title,
  theme,
  children,
  wrapperStyles,
  headerLabelStyles,
  innerBackgroundStyles,
}: EateryBranchDropdownProps) {
  return (
    <Accordion
      title={title}
      wrapperStyles={[
        theme === "outer" && {
          backgroundColor: withOpacity(Colors.primaryLight, 0.5),
        },
        theme === "inner" && {
          borderBottomColor: Colors.primaryLight,
          borderBottomWidth: 1,
        },
        wrapperStyles,
      ]}
      headerChevronColor={Colors.primaryDark}
      headerLabelStyles={[
        {
          color: Colors.primaryDark,
          fontWeight: 600,
          fontSize: 16,
        },
        headerLabelStyles,
      ]}
      innerBackgroundStyles={[
        {
          backgroundColor: Colors.background,
        },
        theme === "inner" && { padding: 0 },
        innerBackgroundStyles,
      ]}
    >
      <View style={{ gap: 8 }}>{children}</View>
    </Accordion>
  );
}
