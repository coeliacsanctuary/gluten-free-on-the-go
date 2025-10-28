import { ReactElement, useEffect, useState } from "react";
import { LoaderCard } from "@/components/LoaderCard";
import { NationwideEatery } from "@/types/eateries";
import { FlatList } from "react-native";
import { getNationwideChainsRequest } from "@/requests/nationwideChains";
import NationwideEateryCard from "@/components/Eateries/NationwideEateryCard";

export default function NationwideChains({
  ListHeaderComponent,
}: {
  ListHeaderComponent?: ReactElement;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [nationwideChains, setNationwideChains] = useState<NationwideEatery[]>(
    [],
  );

  const getPlaces = () => {
    getNationwideChainsRequest().then((response) => {
      setNationwideChains(response.data.data);

      setLoading(false);
    });
  };

  useEffect(() => {
    getPlaces();
  }, []);

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
