import React, { ReactElement, useEffect, useState } from "react";
import { LoaderCard } from "@/components/LoaderCard";
import { Card } from "@/components/Card";
import { NearbyEatery } from "@/types/eateries";
import { getNearbyPlacesRequest } from "@/requests/nearbyPlaces";
import EateryCard from "@/components/Eateries/EateryCard";
import { ActivityIndicator, FlatList, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { ShopCtaCard } from "@/components/ShopCtaCard";
import { AdCard } from "@/components/AdCard";
import { useCurrentLocation } from "@/hooks/useLocation";

export default function NearbyPlaces({
  ListHeaderComponent,
}: {
  ListHeaderComponent?: ReactElement;
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMorePages, setHasMorePages] = useState<boolean>(true);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyEatery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  const { latLng, error: locationError } = useCurrentLocation();

  if (locationError) {
    setError(
      "Sorry, we were unable to find your current location, please check your location settings and try again. If the problem persists, please try again later.",
    );
  }

  const getPlaces = () => {
    if (!latLng) {
      return;
    }

    getNearbyPlacesRequest(latLng, currentPage).then((response) => {
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
    getPlaces();
  }, [latLng]);

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

          {!loading && nearbyPlaces.length === 0 && (
            <Card>
              <Text style={{ fontSize: 16, paddingHorizontal: 16 }}>
                Sorry, we can&#39;t find any places nearby!
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

        if ((index + 1) % 10 === 0) {
          return (
            <>
              {card}
              <AdCard style={{ marginTop: 8 }} />
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
