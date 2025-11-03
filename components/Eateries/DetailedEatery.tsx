import { DetailedEatery as DetailedEateryType } from "@/types/eateries";
import { Platform, View } from "react-native";
import EateryHelpImproveCard from "@/components/Eateries/DetailedEateryComponents/EateryHelpImproveCard";
import EateryInfoCard from "@/components/Eateries/DetailedEateryComponents/EateryInfoCard";
import EateryLocationCard from "@/components/Eateries/DetailedEateryComponents/EateryLocationCard";
import EaterySealiacOverviewCard from "@/components/Eateries/DetailedEateryComponents/EaterySealiacOverviewCard";
import EateryIntroCard from "@/components/Eateries/DetailedEateryComponents/EateryIntroCard";
import EateryAdminReviewCard from "@/components/Eateries/DetailedEateryComponents/EateryAdminReviewCard";
import EateryVisitorImagesCard from "@/components/Eateries/DetailedEateryComponents/EateryVisitorImagesCard";
import EateryVisitorReviewsCard from "@/components/Eateries/DetailedEateryComponents/EateryVisitorReviewsCard";
import { Dispatch, SetStateAction, useState } from "react";
import { EateryModalsProvider } from "@/context/eateryModalContext";
import EateryDynamicMapModal from "@/modals/EateryDynamicMapModal";
import EateryOpeningTimesModal from "@/modals/EateryOpeningTimesModal";
import EaterySuggestEditModal from "@/modals/EaterySuggestEditsModal";
import EateryReportEateryModal from "@/modals/EateryReportModal";
import EaterySealiacOverviewWhatsThisModal from "@/modals/EaterySealiacOverviewWhatsThisModal";
import EateryReviewEateryModal from "@/modals/EateryReviewModal";
import EateryDetailsMenuSidebar from "@/sidebars/EateryDetailsMenuSidebar";
import EateryBranchListCard from "@/components/Eateries/DetailedEateryComponents/EateryBranchListCard";
import EateryDetailsNationwideBranchesSidebar from "@/sidebars/EateryDetailsNationwideBranchesSidebar";

export type DetailedEateryProps = {
  eatery: DetailedEateryType;
  eateryName: string;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  leaveReview?: string;
};

export default function DetailedEatery({
  eatery,
  eateryName,
  sidebarOpen,
  setSidebarOpen,
  leaveReview,
}: DetailedEateryProps) {
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false);

  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const [showSuggestEditsModal, setSuggestEditsModal] =
    useState<boolean>(false);
  const [showReportEateryModal, setReportEateryModal] =
    useState<boolean>(false);
  const [showOpeningTimesModal, setShowOpeningTimesModal] =
    useState<boolean>(false);
  const [showSealiacOverviewModal, setShowSealiacOverviewModal] =
    useState<boolean>(false);
  const [showReviewEateryModal, setShowReviewEateryModal] = useState<boolean>(
    !!(leaveReview && parseInt(leaveReview) === 1),
  );

  const [showBranchListSidebar, setShowBranchListSidebar] =
    useState<boolean>(false);

  const modalSetters: Record<string, (value: boolean) => void> = {
    map: setShowMapModal,
    edit: setSuggestEditsModal,
    report: setReportEateryModal,
    review: setShowReviewEateryModal,
  };

  return (
    <EateryModalsProvider
      value={{
        openMap: () => setShowMapModal(true),
        closeMap: () => setShowMapModal(false),
        openSuggestEdits: () => setSuggestEditsModal(true),
        closeSuggestEdits: () => setSuggestEditsModal(false),
        openReportEatery: () => setReportEateryModal(true),
        closeReportEatery: () => setReportEateryModal(false),
        openOpeningTimes: () => setShowOpeningTimesModal(true),
        closeOpeningTimes: () => setShowOpeningTimesModal(false),
        openSealiacOverview: () => setShowSealiacOverviewModal(true),
        closeSealiacOverview: () => setShowSealiacOverviewModal(false),
        openReviewEatery: () => setShowReviewEateryModal(true),
        closeReviewEatery: () => setShowReviewEateryModal(false),
        openBranchSidebar: () => setShowBranchListSidebar(true),
        closeBranchSidebar: () => setShowBranchListSidebar(false),
      }}
    >
      <EateryDetailsMenuSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onPress={(item: string) => {
          const next = modalSetters[item];

          setSidebarOpen(false);
          setTimeout(() => next(true), 500);
        }}
      />

      <View
        style={[
          { paddingHorizontal: 8, gap: 8 },
          Platform.OS === "ios" && { marginBottom: 8 },
          Platform.OS === "android" && { marginBottom: 12 },
        ]}
      >
        <EateryIntroCard eatery={eatery} eateryName={eateryName} />

        <EateryHelpImproveCard eateryName={eateryName} />

        <EateryInfoCard eatery={eatery} eateryName={eateryName} />

        {(!eatery.is_nationwide || eatery.branch !== null) && (
          <EateryLocationCard eatery={eatery} eateryName={eateryName} />
        )}

        {eatery.is_nationwide &&
          eatery.branch === null &&
          eatery.number_of_branches > 0 && (
            <EateryBranchListCard eatery={eatery} eateryName={eateryName} />
          )}

        <EaterySealiacOverviewCard eatery={eatery} eateryName={eateryName} />

        <EateryAdminReviewCard
          eatery={eatery}
          eateryName={eateryName}
          showAllReviews={showAllReviews}
        />

        <EateryVisitorImagesCard
          eatery={eatery}
          eateryName={eateryName}
          showAllReviews={showAllReviews}
        />

        <EateryVisitorReviewsCard
          eatery={eatery}
          eateryName={eateryName}
          showAllReviews={showAllReviews}
          setShowAllReviews={setShowAllReviews}
        />
      </View>

      <EateryDynamicMapModal
        latLng={eatery.branch ? eatery.branch.location : eatery.location}
        eateryName={eateryName}
        eateryAddress={
          eatery.branch
            ? eatery.branch.location.address
            : eatery.location.address
        }
        open={showMapModal}
        onClose={() => setShowMapModal(false)}
      />

      <EaterySuggestEditModal
        eateryName={eateryName}
        eateryId={eatery.id}
        open={showSuggestEditsModal}
        onClose={() => setSuggestEditsModal(false)}
        onOpenReport={() => {
          setSuggestEditsModal(false);
          setReportEateryModal(true);
        }}
      />

      <EateryReportEateryModal
        eateryName={eateryName}
        eateryId={eatery.id}
        branchId={eatery.branch?.id}
        isNationwide={eatery.is_nationwide}
        open={showReportEateryModal}
        onClose={() => setReportEateryModal(false)}
      />

      <EateryOpeningTimesModal
        eateryName={eateryName}
        eateryId={eatery.id}
        open={showOpeningTimesModal}
        onClose={() => setShowOpeningTimesModal(false)}
      />

      <EaterySealiacOverviewWhatsThisModal
        eateryName={eateryName}
        open={showSealiacOverviewModal}
        onClose={() => setShowSealiacOverviewModal(false)}
      />

      <EateryReviewEateryModal
        eateryName={eateryName}
        eateryId={eatery.id}
        branchId={eatery.branch?.id}
        isNationwide={eatery.is_nationwide}
        open={showReviewEateryModal}
        onClose={() => setShowReviewEateryModal(false)}
      />

      {eatery.is_nationwide &&
        eatery.branch === null &&
        eatery.number_of_branches > 0 && (
          <EateryDetailsNationwideBranchesSidebar
            open={showBranchListSidebar}
            onClose={() => setShowBranchListSidebar(false)}
            id={eatery.id}
            eateryName={eateryName}
          />
        )}
    </EateryModalsProvider>
  );
}
