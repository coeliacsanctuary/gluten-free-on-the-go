import {
  ActivityIndicator,
  Linking,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Sidebar from "@/sidebars/Sidebar";
import { Colors } from "@/constants/Colors";
import { pluralise, withOpacity } from "@/helpers/helpers";
import { useCallback, useContext, useEffect, useState } from "react";
import { EaterySummaryResource } from "@/types/eateries";
import { getEaterySummaryRequest } from "@/requests/eateryDetails";
import Pill from "@/components/Pill";
import RenderHtml from "react-native-render-html";
import StarRating from "@/components/Eateries/StarRating";
import Button from "@/components/Form/Button";
import { router, useFocusEffect } from "expo-router";
import { CustomIcon } from "@/components/CustomIcon";
import { logEvent } from "@/services/analytics";
import { useInterstitialAd } from "@/hooks/useInterstitialAd";
import { ANDROID_SCREEN_AD, IOS_SCREEN_AD } from "@/constants/App";
import { SessionContext } from "@/context/sessionContext";

export type ExploreEateriesDetailsSidebarProps = {
  onClose: () => void;
  eateryId?: number;
  branchId?: number;
};

export default function ExploreEateriesDetailsSidebar({
  onClose,
  eateryId,
  branchId = undefined,
}: ExploreEateriesDetailsSidebarProps) {
  const [loading, setLoading] = useState<boolean>(true);

  const [eatery, setEatery] = useState<EaterySummaryResource>();

  const loadEateryDetails = () => {
    if (!eateryId) {
      return;
    }

    getEaterySummaryRequest(eateryId, branchId)
      .then((response) => {
        setEatery(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        alert(
          "Sorry, there was an error loading the details for this place. Please try again later.",
        );
        onClose();
      });
  };

  const { mapSidebarViewCount, incrementMapSidebarViewCount } =
    useContext(SessionContext);

  useEffect(() => {
    if (eateryId === undefined) {
      setLoading(true);

      return;
    }

    logEvent({
      type: "map-place-details",
      metaData: { eateryId },
    });

    incrementMapSidebarViewCount();

    loadEateryDetails();
  }, [eateryId]);

  const { width } = useWindowDimensions();

  const icon = () => {
    if (eatery?.type === "Hotel / B&B") {
      return "hotel";
    }

    if (eatery?.type === "Attraction") {
      return "attraction";
    }

    return "eatery";
  };

  const { showAd, adLoaded } = useInterstitialAd({
    iosAdId: IOS_SCREEN_AD,
    androidAdId: ANDROID_SCREEN_AD,
    keywords: ["gluten free", "coeliac"],
    viewCount: mapSidebarViewCount,
    interval: 4,
    onClosedCallback: () => onClose(),
  });

  const closeSidebar = () => {
    showAd();

    if (!adLoaded) {
      onClose();
      return;
    }

    // just in case...
    setTimeout(() => onClose(), 6000);
  };

  return (
    <Sidebar
      open={!!eateryId}
      onClose={closeSidebar}
      backgroundColor={Colors.background}
      side="left"
    >
      <ScrollView style={{ backgroundColor: Colors.background }}>
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            justifyContent: "space-between",
            padding: 12,
            backgroundColor: withOpacity(Colors.text, 0.05),
            borderBottomWidth: 1,
            borderBottomColor: withOpacity(Colors.text, 0.1),
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 600 }}>Place Details</Text>
        </View>

        {loading || !eatery ? (
          <ActivityIndicator
            style={{ padding: 16 }}
            size="large"
            color={Colors.primary}
          />
        ) : (
          <View style={{ gap: 16, padding: 12 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: 600, fontSize: 24 }}>
                {eatery.title}
              </Text>

              <CustomIcon
                name={icon()}
                fill={Colors.primary}
                width={28}
                height={28}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 4,
              }}
            >
              <View style={{ gap: 2, flexShrink: 1 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: 600 }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {eatery.fullLocation}
                </Text>
                <Text style={{ fontSize: 14 }}>
                  <Text>{eatery.venueType}</Text>
                  {!!eatery.cuisine && <Text>, {eatery.cuisine}</Text>}
                </Text>
              </View>

              <View>
                <Pill
                  clickHandler={() => Linking.openURL(eatery.website as string)}
                  icon="link"
                  bold
                >
                  Visit Website
                </Pill>
              </View>
            </View>

            <View style={{ marginVertical: 16 }}>
              {eatery.type === "Attraction" ? (
                <View style={{ gap: 8 }}>
                  {eatery.restaurants.map((restuarant, index) => (
                    <View key={index}>
                      {restuarant.name !== "" && (
                        <Text style={{ fontWeight: 600 }}>
                          {restuarant.name}
                        </Text>
                      )}
                      <RenderHtml
                        contentWidth={width}
                        source={{ html: restuarant.info }}
                        tagsStyles={{
                          body: {
                            lineHeight: 20,
                          },
                          strong: {
                            fontWeight: "600",
                          },
                        }}
                      />
                    </View>
                  ))}
                </View>
              ) : (
                <RenderHtml
                  contentWidth={width}
                  source={{ html: eatery.info }}
                  tagsStyles={{
                    body: {
                      lineHeight: 20,
                    },
                    strong: {
                      fontWeight: "600",
                    },
                  }}
                />
              )}
            </View>

            <View style={{ gap: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: 600 }}>
                {eatery.location.address}
              </Text>
              {!!eatery.phone && (
                <Text style={{ fontSize: 14, fontWeight: 600 }}>
                  {eatery.phone}
                </Text>
              )}
            </View>

            {eatery.reviews.number > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Text>
                  <Text>Rated </Text>
                  <Text style={{ fontWeight: 600 }}>
                    {eatery.reviews.average} stars
                  </Text>
                  <Text> from </Text>
                  <Text style={{ fontWeight: 600 }}>
                    {eatery.reviews.number}{" "}
                    {pluralise("review", eatery.reviews.number)}
                  </Text>
                </Text>

                <StarRating rating={eatery.reviews.average} size={18} />
              </View>
            )}

            <Button
              theme="primaryLight"
              textStyle={{ textAlign: "center" }}
              clickHandler={() => {
                router.navigate({
                  pathname: `/(tabs)/explore/eatery-details`,
                  params: { id: eatery.id, branchId: eatery?.branchId },
                });
                onClose();
              }}
            >
              Read more about{" "}
              <Text style={{ fontWeight: 600 }}>{eatery.title}</Text>
              {eatery.reviews.number > 0
                ? " read experiences from other people"
                : " "}
              and leave your review.
            </Button>
          </View>
        )}
      </ScrollView>
    </Sidebar>
  );
}
