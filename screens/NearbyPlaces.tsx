import React, { ReactElement, useEffect, useState } from "react";
import { LoaderCard } from "@/components/LoaderCard";
import { Card } from "@/components/Card";
import { LatLng } from "@/types/types";
import { NearbyEatery } from "@/types/eateries";
import * as Location from "expo-location";
import { getNearbyPlacesRequest } from "@/requests/nearbyPlaces";
import EateryCard from "@/components/Eateries/EateryCard";
import { ActivityIndicator, FlatList, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { ShopCtaCard } from "@/components/ShopCtaCard";

export default function NearbyPlaces({
  ListHeaderComponent,
}: {
  ListHeaderComponent?: ReactElement;
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMorePages, setHasMorePages] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyEatery[]>([]);
  const [latlng, setLatLng] = useState<LatLng>();
  const [error, setError] = useState<string>();

  const getPlaces = () => {
    if (!latlng) {
      return;
    }

    getNearbyPlacesRequest(latlng, currentPage).then((response) => {
      setNearbyPlaces(
        currentPage === 1
          ? response.data.data.data
          : [...nearbyPlaces!, ...response.data.data.data],
      );

      setHasMorePages(
        response.data.data.last_page > response.data.data.current_page,
      );

      setLoading(false);
    });
  };

  const updateList = () => {
    if (hasMorePages && !loading) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
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

  useEffect(() => {
    if (currentPage === 1 || !hasMorePages) {
      return;
    }

    getPlaces();
  }, [currentPage]);

  return (
    <FlatList
      ListHeaderComponent={
        <>
          {ListHeaderComponent}

          {loading && (
            <LoaderCard>
              <Text style={{ fontSize: 16, paddingHorizontal: 16 }}>
                Looking for places near you...
              </Text>
            </LoaderCard>
          )}

          {error && (
            <Card>
              <Text style={{ fontSize: 16, paddingHorizontal: 16 }}>
                {error}
              </Text>
            </Card>
          )}
        </>
      }
      data={nearbyPlaces}
      contentContainerStyle={{
        paddingHorizontal: 8,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        paddingBottom: 24,
      }}
      renderItem={({ item, index }) => {
        const card = <EateryCard basePath="nearby" eatery={item} />;

        if (index === 1) {
          return (
            <>
              {card}
              <ShopCtaCard />
            </>
          );
        }

        return card;
      }}
      keyExtractor={(item) => item.key.toString()}
      onEndReached={() => updateList()}
      onEndReachedThreshold={0.2}
      ListFooterComponent={
        hasMorePages && !loading ? (
          <ActivityIndicator
            size="large"
            style={{ marginVertical: 8 }}
            color={Colors.secondary}
          />
        ) : null
      }
    />
  );
}
