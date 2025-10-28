import { EateryReview } from "@/types/eateries";
import { View, Text, ViewProps } from "react-native";
import StarRating from "@/components/Eateries/StarRating";
import { Colors } from "@/constants/Colors";
import { ucfirst, withOpacity } from "@/helpers/helpers";
import ImageGallery from "@/components/ImageGallery";

export type EateryReviewCardProps = {
  review: EateryReview;
  showAllReviews: boolean;
};

export default function EateryReviewCard({
  review,
  showAllReviews,
}: EateryReviewCardProps) {
  return (
    <View
      style={{
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary,
        paddingBottom: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: 600 }}>
            {review.name ? review.name : "Anonymous"}
          </Text>
          <Text>{review.date_diff}</Text>
        </View>
        <StarRating rating={review.rating} showAll />
      </View>

      {review.body ? (
        <Text style={{ lineHeight: 22 }}>{review.body}</Text>
      ) : (
        <Text style={{ fontStyle: "italic" }}>
          Customer didn't leave a review with their rating
        </Text>
      )}

      {!!review.expense && (
        <ReviewHeadingPill>
          <Text style={{ fontWeight: "600" }}>
            {"£".repeat(review.expense.value)}
          </Text>
          <Text>{review.expense.label}</Text>
        </ReviewHeadingPill>
      )}

      {!!review.food_rating && (
        <ReviewHeadingPill>
          <Text style={{ fontWeight: "600" }}>Food</Text>
          <Text>{ucfirst(review.food_rating)}</Text>
        </ReviewHeadingPill>
      )}

      {!!review.service_rating && (
        <ReviewHeadingPill>
          <Text style={{ fontWeight: "600" }}>Service</Text>
          <Text>{ucfirst(review.service_rating)}</Text>
        </ReviewHeadingPill>
      )}

      {!!review.branch_name && !showAllReviews && (
        <ReviewHeadingPill>
          <Text style={{ fontWeight: "600" }}>Branch</Text>
          <Text>{review.branch_name}</Text>
        </ReviewHeadingPill>
      )}

      <ImageGallery images={review.images} />
    </View>
  );
}

export function ReviewHeadingPill(props: ViewProps) {
  return (
    <View
      style={{
        backgroundColor: withOpacity(Colors.primaryLight, 0.5),
        flexDirection: "row",
        gap: 8,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
      }}
      {...props}
    />
  );
}
