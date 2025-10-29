import { ImageBackground, ImageBackgroundProps } from "expo-image";
import { baseUrl } from "@/constants/Http";
import { Pressable } from "react-native";
import { LatLng } from "@/types/types";
import { useEateryModals } from "@/context/eateryModalContext";

export type EateryMapProps = {
  latlng: LatLng;
  height?: number;
  style?: ImageBackgroundProps["style"];
  expandable?: boolean;
};

export function EateryMap({
  latlng,
  height = 350,
  style,
  expandable = true,
}: EateryMapProps) {
  const latLngString = `${latlng.lat},${latlng.lng}`;

  const eateryModals = useEateryModals();

  return (
    <Pressable
      onPress={() => (expandable ? eateryModals.openMap() : undefined)}
    >
      <ImageBackground
        style={[
          {
            width: "100%",
            backgroundPosition: "50% 50%",
            backgroundSize: "200%",
            backgroundRepeat: "no-repeat",
            height,
          },
          style,
        ]}
        source={`${baseUrl}/static/map/${latLngString}`}
      />
    </Pressable>
  );
}
