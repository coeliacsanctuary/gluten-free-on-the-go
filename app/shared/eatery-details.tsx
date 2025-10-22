import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenWrapper } from "@/components/Ui/ScreenWrapper";
import { ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { LoaderCard } from "@/components/LoaderCard";
import { DetailedEatery as DetailedEateryType } from "@/types/eateries";
import { getEateryDetailsRequest } from "@/requests/eateryDetails";
import DetailedEatery from "@/components/Eateries/DetailedEatery";

export default function EateryDetails() {
  const { id, branchId } = useLocalSearchParams<{
    id: string;
    branchId?: string;
  }>();
  const [loading, setLoading] = useState(true);

  const [eatery, setEatery] = useState<DetailedEateryType>();

  useEffect(() => {
    getEateryDetailsRequest(
      parseInt(id),
      branchId ? parseInt(branchId) : undefined,
    ).then((response) => {
      setEatery(response.data.data);
      setLoading(false);
    });
  }, []);

  const [eateryName, setEateryName] = useState<string>("");

  useEffect(() => {
    if (!eatery) {
      setEateryName("");

      return;
    }

    if (eatery.branch && eatery.branch.name) {
      setEateryName(eatery.branch.name);

      return;
    }

    setEateryName(eatery.title);
  }, [eatery]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ScreenWrapper>
      <ScreenHeader
        showBackButton
        showSearchButton={false}
        showHamburgerButton={!loading}
        onHamburgerPress={() => setSidebarOpen(true)}
      >
        {eateryName}
      </ScreenHeader>
      {loading || eatery === undefined ? (
        <LoaderCard style={{ marginTop: -8 }} />
      ) : (
        <>
          <ScrollView style={{ marginBottom: 24 }}>
            <DetailedEatery
              eatery={eatery}
              eateryName={eateryName}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </ScrollView>
        </>
      )}
    </ScreenWrapper>
  );
}
