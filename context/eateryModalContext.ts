import { useContext, createContext } from "react";

type EateryModalsContextType = {
  openMap: () => void;
  closeMap: () => void;
  openSuggestEdits: () => void;
  closeSuggestEdits: () => void;
  openReportEatery: () => void;
  closeReportEatery: () => void;
  openOpeningTimes: () => void;
  closeOpeningTimes: () => void;
  openSealiacOverview: () => void;
  closeSealiacOverview: () => void;
  openReviewEatery: () => void;
  closeReviewEatery: () => void;
};

const EateryModalsContext = createContext<EateryModalsContextType>({
  openMap: () => {},
  closeMap: () => {},
  openSuggestEdits: () => {},
  closeSuggestEdits: () => {},
  openReportEatery: () => {},
  closeReportEatery: () => {},
  openOpeningTimes: () => {},
  closeOpeningTimes: () => {},
  openSealiacOverview: () => {},
  closeSealiacOverview: () => {},
  openReviewEatery: () => {},
  closeReviewEatery: () => {},
});

export const useEateryModals = () => useContext(EateryModalsContext);

export const EateryModalsProvider = EateryModalsContext.Provider;
