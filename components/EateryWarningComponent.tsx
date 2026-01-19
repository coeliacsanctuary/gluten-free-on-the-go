import { Text } from "react-native";
import { Warning, WarningProps } from "@/components/Warning";
import React from "react";
import { Accordion } from "@/components/Accordion";

export default function EateryWarningComponent(props: WarningProps) {
  return (
    <Warning {...props}>
      <Accordion
        backgroundColor="none"
        title="Always remember to check..."
        headerLabelStyles={{ fontWeight: 600, fontSize: 15 }}
        innerBackgroundStyles={{ padding: 0 }}
        iconSize={20}
      >
        <Text style={{ marginBottom: 8 }}>
          While we take every care to make sure our eating out guide is
          accurate, places can change without notice, we always recommend that
          you check ahead before making plans.
        </Text>

        <Text>
          All eateries are recommended by our website visitors, and before going
          live we check menus and reviews, but we do not vet or visit places to
          independently check them.
        </Text>
      </Accordion>
    </Warning>
  );
}
