import { ScrollView, Text, View } from "react-native";
import Sidebar from "@/sidebars/Sidebar";
import { EateryFilterItem, EateryFilters } from "@/types/eateries";
import { useEffect, useState } from "react";
import Button from "@/components/Form/Button";
import { Colors } from "@/constants/Colors";
import { withOpacity } from "@/helpers/helpers";
import CheckboxGroupField from "@/components/Form/CheckboxGroupField";

export type ExploreEateriesFilterSidebarProps = {
  open: boolean;
  onClose: () => void;
  filters: EateryFilters;
  onFiltersChanged: (filters: EateryFilters) => void;
};

export default function ExploreEateriesFilterSidebar({
  open,
  onClose,
  filters,
  onFiltersChanged,
}: ExploreEateriesFilterSidebarProps) {
  const [eateryTypeFilters, setEateryTypeFilters] = useState<
    EateryFilterItem[]
  >([]);

  const [venueTypeFilters, setVenueTypeFilters] = useState<EateryFilterItem[]>(
    [],
  );

  const [featureFilters, setFeatureFilters] = useState<EateryFilterItem[]>([]);

  useEffect(() => {
    setEateryTypeFilters(filters.categories);
    setVenueTypeFilters(filters.venueTypes);
    setFeatureFilters(filters.features);
  }, [filters]);

  const isFiltered = () => {
    const filters = [
      ...eateryTypeFilters.map((filter) => filter.checked),
      ...venueTypeFilters.map((filter) => filter.checked),
      ...featureFilters.map((filter) => filter.checked),
    ];

    return filters.includes(true);
  };

  const resetFilters = () => {
    setEateryTypeFilters(
      eateryTypeFilters.map((filter) => ({ ...filter, checked: false })),
    );

    setVenueTypeFilters(
      venueTypeFilters.map((filter) => ({ ...filter, checked: false })),
    );

    setFeatureFilters(
      featureFilters.map((filter) => ({ ...filter, checked: false })),
    );

    filtersChanged();
  };

  const filtersChanged = () => {
    onFiltersChanged({
      categories: eateryTypeFilters,
      venueTypes: venueTypeFilters,
      features: featureFilters,
    });
  };

  useEffect(() => {
    filtersChanged();
  }, [eateryTypeFilters, venueTypeFilters, featureFilters]);

  return (
    <Sidebar
      open={open}
      onClose={() => onClose()}
      backgroundColor={Colors.background}
    >
      <View style={{ backgroundColor: Colors.background }}>
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            justifyContent: "space-between",
            padding: 12,
            backgroundColor: withOpacity(Colors.text, 0.05),
            borderBottomWidth: 1,
            borderBottomColor: withOpacity(Colors.text, 0.1),
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 600 }}>Filter Eateries</Text>
          <Button
            disabled={!isFiltered()}
            size="small"
            clickHandler={() => resetFilters()}
          >
            Reset
          </Button>
        </View>

        <ScrollView>
          <CheckboxGroupField
            value={eateryTypeFilters}
            onChange={(filters) => setEateryTypeFilters([...filters])}
            label="Venue Category"
          />

          <CheckboxGroupField
            value={venueTypeFilters}
            onChange={(filters) => setVenueTypeFilters([...filters])}
            label="Venue Type"
          />

          <CheckboxGroupField
            value={featureFilters}
            onChange={(filters) => setFeatureFilters([...filters])}
            label="Special Features"
          />
        </ScrollView>
      </View>
    </Sidebar>
  );
}
