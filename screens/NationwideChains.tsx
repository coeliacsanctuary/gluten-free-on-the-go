import { ReactElement, useEffect, useState } from "react";
import { LoaderCard } from "@/components/LoaderCard";
import { NationwideEatery } from "@/types/eateries";
import { FlatList } from "react-native";
import { getNationwideChainsRequest } from "@/requests/nationwideChains";
import NationwideEateryCard from "@/components/Eateries/NationwideEateryCard";
import { LatLng } from "@/types/types";
import * as Location from "expo-location";

export default function NationwideChains({
  ListHeaderComponent,
}: {
  ListHeaderComponent?: ReactElement;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [latlng, setLatLng] = useState<false | LatLng>();
  const [nationwideChains, setNationwideChains] = useState<NationwideEatery[]>(
    [],
  );

  const getPlaces = () => {
    getNationwideChainsRequest(latlng).then((response) => {
      setNationwideChains(response.data.data);

      setLoading(false);
    });
  };

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLatLng(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setLatLng({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    getPlaces();
  }, [latlng]);

  return (
    <FlatList
      ListHeaderComponent={
        <>
          {ListHeaderComponent}

          {loading && <LoaderCard />}
        </>
      }
      data={nationwideChains}
      contentContainerStyle={{
        paddingHorizontal: 8,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        paddingBottom: 24,
      }}
      renderItem={({ item }) => <NationwideEateryCard eatery={item} />}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}
