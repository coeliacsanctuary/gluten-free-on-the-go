import React, { ReactElement, useEffect, useState } from "react";
import { LoaderCard } from "@/components/LoaderCard";
import { NationwideEatery } from "@/types/eateries";
import { FlatList } from "react-native";
import { getNationwideChainsRequest } from "@/requests/nationwideChains";
import NationwideEateryCard from "@/components/Eateries/NationwideEateryCard";
import { ShopCtaCard } from "@/components/ShopCtaCard";
import { useCurrentLocation } from "@/hooks/useLocation";

export default function NationwideChains({
  ListHeaderComponent,
}: {
  ListHeaderComponent?: ReactElement;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [nationwideChains, setNationwideChains] = useState<NationwideEatery[]>(
    [],
  );

  const { latLng } = useCurrentLocation();

  const getPlaces = () => {
    getNationwideChainsRequest(latLng).then((response) => {
      setNationwideChains(response.data.data);

      setLoading(false);
    });
  };

  useEffect(() => {
    getPlaces();
  }, [latLng]);

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
      renderItem={({ item, index }) => {
        const card = <NationwideEateryCard eatery={item} />;

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
      keyExtractor={(item) => item.id.toString()}
    />
  );
}
