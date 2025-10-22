import { View, Text, Pressable } from "react-native";
import Sidebar from "@/sidebars/Sidebar";
import { IconSymbol, IconSymbolName } from "@/components/Ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { withOpacity } from "@/helpers/helpers";
import { useEateryModals } from "@/context/eateryModalContext";

export type EateryDetailsMenuSidebarProps = {
  open: boolean;
  onClose: () => void;
  onPress: (item: string) => void;
};

export default function EateryDetailsMenuSidebar({
  open,
  onClose,
  onPress,
}: EateryDetailsMenuSidebarProps) {
  const modalContext = useEateryModals();

  return (
    <Sidebar open={open} onClose={() => onClose()}>
      <View style={{ width: "100%", height: "100%" }}>
        <MenuItem label="Map" icon="map.fill" onPress={() => onPress("map")} />
        <MenuItem
          label="Review"
          icon="star.fill"
          onPress={() => onPress("review")}
        />
        <MenuItem
          label="Report"
          icon="flag.fill"
          onPress={() => onPress("report")}
        />
        <MenuItem label="Edit" icon="pencil" onPress={() => onPress("edit")} />
      </View>
    </Sidebar>
  );
}

function MenuItem({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: IconSymbolName;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          gap: 16,
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: withOpacity(Colors.background, 0.3),
          alignItems: "center",
        }}
      >
        <IconSymbol name={icon} color={Colors.background} size={30} />
        <Text
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: Colors.background,
            paddingTop: 4,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
