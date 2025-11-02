import { createContext } from "react";

export type AdsContextTypes = {
  isSdkInitialized: boolean;
  canRequestAds: boolean;
  formAvailable: boolean;
  showPrivacyOptions: () => void;
};

export const AdsContext = createContext<AdsContextTypes>({
  isSdkInitialized: false,
  canRequestAds: false,
  formAvailable: false,
  showPrivacyOptions: () => {},
});
