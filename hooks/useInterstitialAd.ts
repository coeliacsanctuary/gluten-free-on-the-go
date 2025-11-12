import { useEffect, useState, useCallback } from "react";
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import { Platform } from "react-native";
import { adId } from "@/helpers/helpers";
import { setStatusBarHidden } from "expo-status-bar";

type UseInterstitialAdOptions = {
  iosAdId: string;
  androidAdId: string;
  keywords?: string[];
  viewCount: number;
  showOnFirst?: boolean;
  interval?: number;
  onClosedCallback?: () => void;
  refreshTracker?: string | number | boolean;
};

export function useInterstitialAd({
  iosAdId,
  androidAdId,
  keywords = [],
  viewCount,
  showOnFirst = true,
  interval = 4,
  onClosedCallback = () => undefined,
  refreshTracker = undefined,
}: UseInterstitialAdOptions) {
  const [ad, setAd] = useState<InterstitialAd>();
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    const shouldShow =
      (showOnFirst && viewCount === 1) ||
      (interval > 0 && (viewCount - 1) % interval === 0);

    setAd(undefined);
    setAdLoaded(false);

    if (!shouldShow) {
      return;
    }

    const interstitial = InterstitialAd.createForAdRequest(
      adId(iosAdId, androidAdId, TestIds.INTERSTITIAL),
      { keywords },
    );

    const unsubLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => setAdLoaded(true),
    );

    const unsubOpened = interstitial.addAdEventListener(
      AdEventType.OPENED,
      () => {
        if (Platform.OS === "ios") {
          setStatusBarHidden(true);
        }
      },
    );

    const unsubClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log("closed");
        onClosedCallback();

        if (Platform.OS === "ios") {
          setStatusBarHidden(false);
        }
      },
    );

    interstitial.load();

    setAd(interstitial);

    return () => {
      unsubLoaded();
      unsubOpened();
      unsubClosed();
    };
  }, [viewCount, refreshTracker]);

  const showAd = useCallback(() => {
    if (ad && adLoaded) {
      try {
        ad.show();
      } catch (e) {
        //
      }
    }
  }, [ad, adLoaded]);

  return { showAd, adLoaded };
}
