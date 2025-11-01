import { ScreenWrapper } from "@/components/Ui/ScreenWrapper";
import { ScreenHeader } from "@/components/ScreenHeader";
import Map from "@/screens/Map";
import { useLocalSearchParams } from "expo-router";
import { logScreen } from "@/services/analytics";

export default function BrowseEateries() {
  const params = useLocalSearchParams<{
    search?: string;
    appliedFilters?: string;
  }>();

  logScreen("exploreMap", {
    search: params.search,
  });

  const search = params.search ? params.search : "";
  const appliedFilters = params.appliedFilters
    ? JSON.parse(params.appliedFilters)
    : undefined;

  return (
    <ScreenWrapper>
      <ScreenHeader showBackButton={true} showSearchButton={false}>
        Browse Places to Eat
      </ScreenHeader>

      <Map initialSearch={search} initialAppliedFilters={appliedFilters} />
    </ScreenWrapper>
  );
}
