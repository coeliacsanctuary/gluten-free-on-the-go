import { PropsWithChildren, useEffect, useState } from "react";
import mobileAds, { AdsConsent } from "react-native-google-mobile-ads";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { Platform } from "react-native";
import { AdsContext } from "@/context/adsContext";

export default function AdsContextProvider({ children }: PropsWithChildren) {
  const [isSdkInitialized, setIsSdkInitialized] = useState(false);
  const [canRequestAds, setCanRequestAds] = useState(false);
  const [formAvailable, setFormAvailable] = useState(false);

  // check consent status on app launch
  useEffect(() => {
    prepareConsentInfo();
  }, []);

  /**
   * 1. Request consent information update
   * 2. Check if user is in EEA (GDPR applies)
   * 3. Move forward based on consentInfo and gdprApplies:
   *      3a. If consent is not required, proceed to start SDK
   *      3b. If consent is obtained, check if the user is in the EEA (GDPR applies)
   *      if user is in EEA, call checkConsent(), else, proceed to start SDK
   *      3c. If consent status is REQUIRED or UNKNOWN, check if user is in EEA
   *      if user is in EEA, request GDPR form. Otherwise, present the US regulation     form if required/available
   */
  async function prepareConsentInfo() {
    const consentInfo = await AdsConsent.requestInfoUpdate();
    const gdprApplies = await AdsConsent.getGdprApplies();

    // check status of consent form, used in Settings to determine whether to display privacy options form
    const form = consentInfo.isConsentFormAvailable;
    setFormAvailable(form);
    if (consentInfo.status === "NOT_REQUIRED") {
      setCanRequestAds(true);
      startGoogleMobileAdsSDK();
    } else if (consentInfo.status === "OBTAINED") {
      if (gdprApplies) {
        checkConsentGDPR();
      } else {
        setCanRequestAds(true);
        startGoogleMobileAdsSDK();
      }
    } else {
      if (gdprApplies) {
        gatherConsentGDPR();
      } else {
        gatherConsentRegulatedUSState();
      }
    }
  }

  /** Present GDPR consent form, then go to checkConsentGDPR */
  async function gatherConsentGDPR() {
    await AdsConsent.gatherConsent()
      .then(checkConsentGDPR)
      .catch((error) => console.error("Consent gathering failed:", error));
  }

  /** Determine whether user can be shown ads at all based on their selection to:
   *      a. Store and Access Information on Device
   *      b. Basic consent for advertising
   *  If user has accepted basic ads, set canRequestAds to true and start SDK
   *  Otherwise, do not start SDK and leave canRequestAds false
   */
  async function checkConsentGDPR() {
    const consentInfo = await AdsConsent.getConsentInfo();
    const userChoices = await AdsConsent.getUserChoices();

    // manually check for at least basic consent before requesting ads
    const hasBasicConsent =
      userChoices.storeAndAccessInformationOnDevice &&
      userChoices.selectBasicAds;

    const finalCanRequestAds = consentInfo.canRequestAds && hasBasicConsent;

    setCanRequestAds(finalCanRequestAds);

    if (finalCanRequestAds) {
      startGoogleMobileAdsSDK();
    }
  }

  /** Use gatherConsent to show US Regulated State form if required, then start SDK */
  async function gatherConsentRegulatedUSState() {
    await AdsConsent.gatherConsent()
      .then(startGoogleMobileAdsSDK)
      .catch((error) => console.error("Consent gathering failed:", error));

    setCanRequestAds(true);
  }

  /** Called by startGoogleMobileAdsSDK. If user can receive ads at all, either by GDPR consent or local laws, request ATT tracking permissions on IOS */
  async function gatherATTConsentIOS() {
    const gdprApplies = await AdsConsent.getGdprApplies();
    const hasConsentForPurposeOne =
      gdprApplies && (await AdsConsent.getPurposeConsents()).startsWith("1");

    if (!gdprApplies || hasConsentForPurposeOne) {
      await requestTrackingPermissionsAsync();
    }
  }

  /** If user has consented to received ads at all or is allowed by local laws, request ATT on IOS and start the SDK */
  async function startGoogleMobileAdsSDK() {
    if (Platform.OS === "ios") {
      await gatherATTConsentIOS();
    }

    if (!isSdkInitialized) {
      await mobileAds().initialize();

      setIsSdkInitialized(true);
    }
  }

  /**
   * Used when user requests to update consent
   *  If user is in EEA (GDPR applies), show the GDPR consent form and then check consent status based on GDPR.
   *  Otherwise, show the US-Regulation tracking form.
   *
   *  Note: no need to implement ability to update ATT tracking info within the app, as Apple does not require it and users can do so in iPhone settings
   *
   */
  async function showPrivacyOptions() {
    const gdprApplies = await AdsConsent.getGdprApplies();

    if (gdprApplies) {
      await AdsConsent.showForm().then(checkConsentGDPR);
    } else {
      await AdsConsent.showForm();
    }
  }

  const contextValues = {
    isSdkInitialized,
    canRequestAds,
    formAvailable,
    showPrivacyOptions,
  };

  return (
    <AdsContext.Provider value={contextValues}>{children}</AdsContext.Provider>
  );
}
