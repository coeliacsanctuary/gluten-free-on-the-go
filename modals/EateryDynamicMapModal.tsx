import { LatLng } from "@/types/types";
import Modal from "@/modals/Modal";
import { View, Text, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";

export type EateryDynamicMapProps = {
  eateryName: string;
  eateryAddress: string;
  latLng: LatLng;
  open: boolean;
  onClose: () => void;
};

export default function EateryDynamicMapModal({
  latLng,
  eateryName,
  eateryAddress,
  open,
  onClose,
}: EateryDynamicMapProps) {
  return (
    <Modal
      fullHeight
      open={open}
      onClose={() => onClose()}
      header={
        <Text style={{ fontSize: 12, fontWeight: 600, textAlign: "center" }}>
          {eateryName} - {eateryAddress}
        </Text>
      }
    >
      <View style={{ width: "100%", height: "100%" }}>
        <MapView
          zoomEnabled
          zoomControlEnabled
          showsUserLocation
          showsMyLocationButton
          provider="google"
          style={{ width: "100%", height: "100%" }}
          initialRegion={{
            latitude: latLng.lat,
            longitude: latLng.lng,
            latitudeDelta: 0.009,
            longitudeDelta:
              0.009 *
              (Dimensions.get("window").width /
                Dimensions.get("window").height),
          }}
        >
          <Marker
            coordinate={{ latitude: latLng.lat, longitude: latLng.lng }}
            title={eateryName}
          />
        </MapView>
      </View>
    </Modal>
  );
}
