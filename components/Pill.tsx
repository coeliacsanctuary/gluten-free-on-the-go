import { Pressable, Text, View, ViewProps } from "react-native";
import { Colors } from "@/constants/Colors";
import { withOpacity } from "@/helpers/helpers";
import { IconSymbol, IconSymbolName } from "@/components/Ui/IconSymbol";

export type PillProps = ViewProps & {
  icon?: IconSymbolName;
  theme?: "primary" | "secondary";
  bold?: boolean;
  clickHandler?: () => void;
};

export default function Pill({
  icon,
  theme,
  bold,
  clickHandler,
  children,
}: PillProps) {
  const color = () => {
    if (theme === "secondary") {
      return Colors.secondary;
    }

    return Colors.primary;
  };

  const content = (
    <View
      style={{
        backgroundColor: withOpacity(color(), 0.5),
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      {!!icon && <IconSymbol name={icon} color={Colors.text} size={16} />}
      <Text
        style={[{ fontSize: 12, lineHeight: 12 }, bold && { fontWeight: 600 }]}
      >
        {children}
      </Text>
    </View>
  );

  if (clickHandler) {
    return <Pressable onPress={clickHandler}>{content}</Pressable>;
  }

  return content;
}
