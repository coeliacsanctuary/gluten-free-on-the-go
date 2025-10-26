import { ScreenWrapper } from "@/components/Ui/ScreenWrapper";
import { ScreenHeader } from "@/components/ScreenHeader";
import Map from "@/screens/Map";
import { useLocalSearchParams } from "expo-router";

export default function BrowseEateries() {
  const params = useLocalSearchParams<{
    search?: string;
    appliedFilters?: string;
  }>();

  const search = params.search ? params.search : "";
  const appliedFilters = params.appliedFilters
    ? JSON.parse(params.appliedFilters)
    : {};

  return (
    <ScreenWrapper>
      <ScreenHeader showBackButton={true} showSearchButton={false}>
        Browse Places to Eat
      </ScreenHeader>

      <Map initialSearch={search} initialAppliedFilters={appliedFilters} />
    </ScreenWrapper>
  );
}
