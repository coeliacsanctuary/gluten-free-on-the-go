import { adId } from "@/helpers/helpers";
import { ANDROID_BANNER_AD, IOS_BANNER_AD } from "@/constants/App";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import React, { useContext } from "react";
import { AdsContext } from "@/context/adsContext";

export function StickyFooterAd() {
  const { isSdkInitialized, canRequestAds } = useContext(AdsContext);

  if (!isSdkInitialized || !canRequestAds) {
    return null;
  }

  return (
    <BannerAd
      unitId={adId(IOS_BANNER_AD, ANDROID_BANNER_AD, TestIds.BANNER)}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
  );
}
