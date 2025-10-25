import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LoaderCard } from "@/components/LoaderCard";
import { Card } from "@/components/Card";
import {
  AppliedEateryFilters,
  EateryFilters,
  NearbyEatery,
} from "@/types/eateries";
import EateryCard from "@/components/Eateries/EateryCard";
import { ActivityIndicator, FlatList, View, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import TexInputField from "@/components/Form/TextInputField";
import Button from "@/components/Form/Button";
import { getExplorePlacesRequest } from "@/requests/explorePlaces";
import ExploreEateriesFilterSidebar from "@/sidebars/ExploreEateriesFilterSidebar";

export type ExploreProps = {
  setTitle: Dispatch<SetStateAction<string>>;
};

export default function Explore({ setTitle }: ExploreProps) {
  const [search, setSearch] = useState<string>("");
  const [searchValid, setSearchValid] = useState<boolean>(true);

  const [showFilterSidebar, setShowFilterSidebar] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMorePages, setHasMorePages] = useState<boolean>(false);

  const [appliedFilters, setAppliedFilters] = useState<AppliedEateryFilters>({
    category: [],
    venueType: [],
    feature: [],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const [places, setPlaces] = useState<NearbyEatery[]>([]);
  const [filters, setFilters] = useState<EateryFilters>();

  const [triggerSearch, setTriggerSearch] = useState<boolean>(false);

  const handleSearch = () => {
    if (search.length < 3) {
      setSearchValid(false);
    }

    setLoading(true);
    setError(undefined);
    setPlaces([]);
    setCurrentPage(1);
    setFilters(undefined);
    setHasMorePages(true);
    setAppliedFilters({
      category: [],
      venueType: [],
      feature: [],
    });

    setTitle(`Search results for "${search}"`);

    setTriggerSearch(true);
  };

  useEffect(() => {
    if (!triggerSearch) {
      return;
    }

    getPlaces();

    setTriggerSearch(false);
  }, [triggerSearch]);

  const getPlaces = () => {
    getExplorePlacesRequest(search, currentPage, appliedFilters).then(
      (response) => {
        setPlaces(
          currentPage === 1
            ? response.data.data.eateries.data
            : [...places!, ...response.data.data.eateries.data],
        );

        if (response.data.data.eateries.data.length === 0) {
          setError("Sorry, no places found!");
          setLoading(false);

          return;
        }

        if (filters === undefined) {
          setFilters(response.data.data.filters);
        }

        setHasMorePages(
          response.data.data.eateries.last_page >
            response.data.data.eateries.current_page,
        );

        setLoading(false);
      },
    );
  };

  const updateList = () => {
    if (hasMorePages && !loading) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (currentPage === 1 || !hasMorePages) {
      return;
    }

    getPlaces();
  }, [currentPage]);

  const handleFiltersChanged = (filters: EateryFilters) => {
    setAppliedFilters({
      category: filters.categories
        .filter((cat) => cat.checked)
        .map((cat) => cat.value),

      venueType: filters.venueTypes
        .filter((type) => type.checked)
        .map((type) => type.value),

      feature: filters.features
        .filter((feature) => feature.checked)
        .map((feature) => feature.value),
    });
  };

  useEffect(() => {
    if (showFilterSidebar) {
      return;
    }

    if (places.length === 0) {
      return;
    }

    setLoading(true);
    setPlaces([]);
    setCurrentPage(1);
    setTriggerSearch(true);
  }, [showFilterSidebar]);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          paddingHorizontal: 8,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TexInputField
          style={{ flex: 1, backgroundColor: Colors.background }}
          placeholder="Search..."
          iconSuffix="magnifyingglass"
          value={search}
          onChangeText={(text) => setSearch(text)}
          onEndEditing={() => handleSearch()}
        />

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Button
            size="xs"
            theme="secondary"
            disabled={!filters}
            clickHandler={() => setShowFilterSidebar(true)}
          >
            Filter
          </Button>

          <Button size="xs" theme="secondary">
            Map
          </Button>
        </View>
      </View>

      <FlatList
        ListHeaderComponent={
          <View style={{ gap: 16 }}>
            {!loading && places.length === 0 && !error && (
              <Card>
                <View style={{ paddingVertical: 32, gap: 16 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Where are you looking for places to eat?
                  </Text>

                  <Text style={{ textAlign: "center" }}>
                    Type your search location in the search bar at the top, or
                    switch to the map view
                  </Text>

                  {!searchValid && (
                    <Text
                      style={{
                        color: Colors.negative,
                        fontWeight: 600,
                        textAlign: "center",
                        fontSize: 12,
                      }}
                    >
                      Please enter at least three characters to search...
                    </Text>
                  )}

                  <Button>Map</Button>
                </View>
              </Card>
            )}

            {search !== "" && loading && (
              <LoaderCard>
                <Text style={{ fontSize: 16, paddingHorizontal: 16 }}>
                  Looking for places to eat...
                </Text>
              </LoaderCard>
            )}

            {!loading && error && (
              <Card>
                <Text
                  style={{
                    fontSize: 16,
                    paddingVertical: 16,
                    textAlign: "center",
                  }}
                >
                  {error}
                </Text>
              </Card>
            )}
          </View>
        }
        data={places}
        contentContainerStyle={{
          paddingHorizontal: 8,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          paddingBottom: 24,
        }}
        renderItem={({ item }) => (
          <EateryCard basePath="explore" eatery={item} />
        )}
        keyExtractor={(item) => item.key.toString()}
        onEndReached={() => updateList()}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          searchValid && search.length > 3 && hasMorePages && !loading ? (
            <ActivityIndicator
              size="large"
              style={{ marginVertical: 8 }}
              color={Colors.secondary}
            />
          ) : null
        }
      />

      {filters && (
        <ExploreEateriesFilterSidebar
          open={showFilterSidebar}
          onClose={() => setShowFilterSidebar(false)}
          filters={filters as EateryFilters}
          onFiltersChanged={handleFiltersChanged}
        />
      )}
    </>
  );
}
