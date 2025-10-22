import { DetailedEatery, EaterySealiacOverview } from "@/types/eateries";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Card } from "@/components/Card";
import { useEffect, useState } from "react";
import {
  postSealiacOverviewFeedbackRequest,
  getSealiacOverviewRequest,
} from "@/requests/eaterySealiacOverview";
import SealiacSeal from "@/components/SealiacSeal";
import { Colors } from "@/constants/Colors";
import { withOpacity } from "@/helpers/helpers";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import { useEateryModals } from "@/context/eateryModalContext";

export type EaterySealiacOverviewCardPropsProps = {
  eatery: DetailedEatery;
  eateryName: string;
};

export default function EaterySealiacOverviewCard({
  eatery,
  eateryName,
}: EaterySealiacOverviewCardPropsProps) {
  const [loading, setLoading] = useState(true);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<
    undefined | "up" | "down"
  >();
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
  const [hasOverview, setHasOverview] = useState(false);
  const [sealiacOverview, setSealiacOverview] =
    useState<EaterySealiacOverview>();

  useEffect(() => {
    getSealiacOverviewRequest(eatery.id, eatery.branch?.id)
      .then((response) => {
        setSealiacOverview(response.data.data);
        setHasOverview(true);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setHasOverview(false);
      });
  }, []);

  const eateryModals = useEateryModals();

  if (loading || !hasOverview || !sealiacOverview) {
    return null;
  }

  const submitFeedback = (rating: "up" | "down") => {
    setIsSubmittingFeedback(rating);

    postSealiacOverviewFeedbackRequest(eatery.id, rating).then(() => {
      setHasSubmittedFeedback(true);
      setIsSubmittingFeedback(undefined);
    });
  };

  return (
    <Card>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <SealiacSeal width={28} height={28} />
        <Text style={{ fontWeight: "600", fontSize: 20 }}>Sealiac Says...</Text>
      </View>
      <Text style={{ fontWeight: "600", fontSize: 16 }}>
        Here's what Sealiac the Seal thinks about eating out at {eateryName}
      </Text>

      {sealiacOverview.overview.map((line, index) => (
        <Text key={index} style={{ lineHeight: 18 }}>
          {line}
        </Text>
      ))}
      <View
        style={{
          height: 1,
          borderBottomColor: Colors.primaryDark,
          borderBottomWidth: 1,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable onPress={() => eateryModals.openSealiacOverview()}>
          <Text style={{ fontSize: 12, color: Colors.primaryDark }}>
            Whats this?
          </Text>
        </Pressable>

        {hasSubmittedFeedback ? (
          <View>
            <Text style={{ fontWeight: 600, color: Colors.positive }}>
              Thank you for submitting your feedback
            </Text>
          </View>
        ) : (
          <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            <Text
              style={{
                fontWeight: "600",
                fontSize: 12,
                color: withOpacity(Colors.text, 0.6),
              }}
            >
              Rate this overview
            </Text>

            {isSubmittingFeedback === "up" ? (
              <ActivityIndicator size="small" />
            ) : (
              <Pressable onPress={() => submitFeedback("up")}>
                <IconSymbol
                  name="hand.thumbsup.fill"
                  color={Colors.primaryDark}
                  size={14}
                />
              </Pressable>
            )}

            <Text
              style={{
                fontWeight: "600",
                fontSize: 12,
                color: withOpacity(Colors.text, 0.6),
              }}
            >
              /
            </Text>

            {isSubmittingFeedback === "down" ? (
              <ActivityIndicator size="small" />
            ) : (
              <Pressable onPress={() => submitFeedback("down")}>
                <IconSymbol
                  name="hand.thumbsdown.fill"
                  color={Colors.primaryDark}
                  size={14}
                />
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Card>
  );
}
