import { DetailedEatery, EateryReview } from "@/types/eateries";
import { Pressable, Text } from "react-native";
import { Card } from "@/components/Card";
import { useEffect, useState } from "react";
import { getAdminReview } from "@/requests/eateryReviews";
import { Colors } from "@/constants/Colors";
import { ucfirst, withOpacity } from "@/helpers/helpers";
import StarRating from "@/components/Eateries/StarRating";
import ImageGallery from "@/components/ImageGallery";
import { ReviewHeadingPill } from "@/components/Eateries/EateryReviewCard";

export type EateryAdminReviewCardPropsProps = {
  eatery: DetailedEatery;
  eateryName: string;
  showAllReviews: boolean;
};

export default function EateryAdminReviewCard({
  eatery,
  eateryName,
  showAllReviews,
}: EateryAdminReviewCardPropsProps) {
  const [loading, setLoading] = useState(true);
  const [hasReview, setHasReview] = useState(false);
  const [adminReview, setAdminReview] = useState<EateryReview>();

  const [displayFullReview, setDisplayFullReview] = useState(false);

  useEffect(() => {
    getAdminReview(eatery.id, eatery.branch?.id, showAllReviews)
      .then((response) => {
        setAdminReview(response.data.data);
        setHasReview(true);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setHasReview(false);
      });
  }, [showAllReviews]);

  if (loading || !hasReview || !adminReview) {
    return null;
  }

  const reviewBody = () => {
    let body = adminReview.body;

    if (body && body.length > 500 && !displayFullReview) {
      body = `${body.substring(0, body.indexOf(" ", 500))}...`;
    }

    return body;
  };

  return (
    <Card>
      <Text style={{ fontWeight: "600", fontSize: 16 }}>
        Alison's review of {eateryName}
      </Text>

      <ReviewHeadingPill>
        <Text style={{ fontWeight: "600" }}>My Rating</Text>
        <StarRating rating={adminReview.rating} size={16} showAll />
      </ReviewHeadingPill>

      <ReviewHeadingPill>
        <Text style={{ fontWeight: "600" }}>
          {"£".repeat(adminReview.expense.value)}
        </Text>
        <Text>{adminReview.expense.label}</Text>
      </ReviewHeadingPill>

      <ReviewHeadingPill>
        <Text style={{ fontWeight: "600" }}>Food</Text>
        <Text>{ucfirst(adminReview.food_rating)}</Text>
      </ReviewHeadingPill>

      <ReviewHeadingPill>
        <Text style={{ fontWeight: "600" }}>Service</Text>
        <Text>{ucfirst(adminReview.service_rating)}</Text>
      </ReviewHeadingPill>

      <Text>{reviewBody()}</Text>

      {!!adminReview.body &&
        adminReview.body.length > 500 &&
        !displayFullReview && (
          <Pressable onPress={() => setDisplayFullReview(true)}>
            <Text style={{ fontWeight: 600, color: Colors.primaryDark }}>
              Read my full review!
            </Text>
          </Pressable>
        )}

      <ImageGallery
        header={<Text style={{ fontWeight: 600 }}>My photos</Text>}
        images={adminReview.images}
        wrapperStyles={{
          borderColor: Colors.primary,
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: withOpacity(Colors.primaryLight, 0.5),
          padding: 8,
        }}
      />
    </Card>
  );
}
