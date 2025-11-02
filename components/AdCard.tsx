import { Card, CardProps } from "@/components/Card";
import { useContext, useEffect, useState } from "react";
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
  TestIds,
} from "react-native-google-mobile-ads";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { adId } from "@/helpers/helpers";
import { ANDROID_FEED_AD, IOS_FEED_AD } from "@/constants/App";
import { Colors } from "@/constants/Colors";
import { AdsContext } from "@/context/adsContext";

export function AdCard(props: CardProps) {
  const { isSdkInitialized, canRequestAds } = useContext(AdsContext);
  const [nativeAd, setNativeAd] = useState<NativeAd>();

  useEffect(() => {
    if (!isSdkInitialized || !canRequestAds) {
      return;
    }

    NativeAd.createForAdRequest(
      adId(IOS_FEED_AD, ANDROID_FEED_AD, TestIds.NATIVE),
    )
      .then(setNativeAd)
      .catch(console.error);
  }, []);

  if (!isSdkInitialized || !canRequestAds) {
    return null;
  }

  if (!nativeAd) {
    return null;
  }

  return (
    <Card {...props}>
      <NativeAdView nativeAd={nativeAd}>
        <Text
          style={{
            fontWeight: 600,
            color: Colors.primaryDark,
            marginBottom: 12,
          }}
        >
          Sponsored
        </Text>

        <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          {nativeAd.icon && (
            <NativeAsset assetType={NativeAssetType.ICON}>
              <Image
                source={{ uri: nativeAd.icon.url }}
                style={{ width: 24, height: 24 }}
              />
            </NativeAsset>
          )}

          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text style={{ fontSize: 18, fontWeight: 600 }}>
              {nativeAd.headline}
            </Text>
          </NativeAsset>
        </View>

        <NativeMediaView />
      </NativeAdView>
    </Card>
  );
}
