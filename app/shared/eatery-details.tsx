import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenWrapper } from "@/components/Ui/ScreenWrapper";
import { Platform, ScrollView } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { LoaderCard } from "@/components/LoaderCard";
import { DetailedEatery as DetailedEateryType } from "@/types/eateries";
import { getEateryDetailsRequest } from "@/requests/eateryDetails";
import DetailedEatery from "@/components/Eateries/DetailedEatery";
import { logScreen } from "@/services/analytics";
import { SessionContext } from "@/context/sessionContext";
import { ANDROID_SCREEN_AD, IOS_SCREEN_AD } from "@/constants/App";
import { useInterstitialAd } from "@/hooks/useInterstitialAd";
import { useStoreReview } from "@/hooks/useStoreReview";

export default function EateryDetails() {
  const { id, branchId, leaveReview } = useLocalSearchParams<{
    id: string;
    branchId?: string;
    leaveReview?: string;
  }>();

  const { eateryDetailsViewCount, incrementEateryDetailsViewCount } =
    useContext(SessionContext);

  useEffect(() => {
    incrementEateryDetailsViewCount();
    logScreen("eateryDetails", { id, branchId });
  }, [id, branchId]);

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

  const { triggerReviewCheck } = useStoreReview();

  const { showAd } = useInterstitialAd({
    iosAdId: IOS_SCREEN_AD,
    androidAdId: ANDROID_SCREEN_AD,
    keywords: ["gluten free", "coeliac"],
    viewCount: eateryDetailsViewCount,
    interval: 4,
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        showAd();
        triggerReviewCheck();
      };
    }, [showAd, triggerReviewCheck]),
  );

  const scrollView = useRef<ScrollView>(null);

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
        <ScrollView
          style={[
            Platform.OS === "ios" && { marginBottom: 24 },
            Platform.OS === "android" && { marginBottom: 0 },
          ]}
          ref={scrollView}
        >
          <DetailedEatery
            eatery={eatery}
            eateryName={eateryName}
            leaveReview={leaveReview}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            scrollView={scrollView}
          />
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}
