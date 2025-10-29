import { DetailedEatery } from "@/types/eateries";
import { Linking, Pressable, Text, View } from "react-native";
import { Card } from "@/components/Card";
import { ImageBackground } from "expo-image";
import { baseUrl } from "@/constants/Http";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useEateryModals } from "@/context/eateryModalContext";
import { EateryMap } from "@/components/Eateries/EateryMap";

export type EateryLocationCardProps = {
  eatery: DetailedEatery;
  eateryName: string;
};

export default function EateryLocationCard({
  eatery,
  eateryName,
}: EateryLocationCardProps) {
  const latLngString = eatery.branch
    ? `${eatery.branch.location.lat},${eatery.branch.location.lng}`
    : `${eatery.location.lat},${eatery.location.lng}`;

  const eateryModals = useEateryModals();

  return (
    <Card>
      <Text style={{ fontWeight: "600", fontSize: 18 }}>
        Where to find {eateryName}
      </Text>

      <EateryMap
        latlng={eatery.branch ? eatery.branch.location : eatery.location}
      />

      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <IconSymbol name="map" color={Colors.text} size={18} />
        <Text style={{ fontWeight: "600", fontSize: 12 }}>
          {eatery.branch
            ? eatery.branch.location.address
            : eatery.location.address}
        </Text>
      </View>

      {!!eatery.website && (
        <Pressable onPress={() => Linking.openURL(eatery.website as string)}>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <IconSymbol name="link" color={Colors.text} size={18} />
            <Text style={{ fontWeight: "600", fontSize: 12 }}>
              Visit Website
            </Text>
          </View>
        </Pressable>
      )}

      {!!eatery.phone && (
        <Pressable
          onPress={() =>
            Linking.openURL(`tel:${eatery.phone?.replace(/[^\d+]/g, "")}`)
          }
        >
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <IconSymbol name="smartphone" color={Colors.text} size={18} />
            <Text style={{ fontWeight: "600", fontSize: 12 }}>
              {eatery.phone}
            </Text>
          </View>
        </Pressable>
      )}
    </Card>
  );
}
