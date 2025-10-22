import { DetailedEatery, EateryRating, EateryReview } from "@/types/eateries";
import { Pressable, Text, View } from "react-native";
import { Card } from "@/components/Card";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { pluralise, withOpacity } from "@/helpers/helpers";
import StarRating from "@/components/Eateries/StarRating";
import { getReviewsRequest } from "@/requests/eateryReviews";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import Button from "@/components/Form/Button";
import { Checkbox } from "expo-checkbox";
import EateryReviewCard from "@/components/Eateries/EateryReviewCard";
import { useEateryModals } from "@/context/eateryModalContext";

export type EateryVisitorReviewsCardPropsProps = {
  eatery: DetailedEatery;
  eateryName: string;
  showAllReviews: boolean;
  setShowAllReviews: Dispatch<SetStateAction<boolean>>;
};

export default function EateryVisitorReviewsCard({
  eatery,
  eateryName,
  showAllReviews,
  setShowAllReviews,
}: EateryVisitorReviewsCardPropsProps) {
  const [loading, setLoading] = useState(true);

  const [average, setAverage] = useState<EateryRating>("0");
  const [total, setTotal] = useState<number>(0);
  const [reviews, setReviews] = useState<EateryReview[]>([]);

  const [ratingFilter, setRatingFilter] = useState<undefined | string>(
    undefined,
  );
  const [hideRatingsWithoutReviews, setHideRatingsWithoutReviews] =
    useState<boolean>(true);

  const [filteredReviews, setFilteredReviews] = useState<EateryReview[]>([]);

  useEffect(() => {
    setReviews([]);

    getReviewsRequest(eatery.id, eatery.branch?.id, showAllReviews)
      .then((response) => {
        setReviews(response.data.data.reviews);
        setAverage(response.data.data.average);
        setTotal(response.data.data.total);

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [showAllReviews]);

  useEffect(() => {
    let next = reviews;

    if (ratingFilter) {
      next = next.filter(
        (review) => parseInt(review.rating) === parseInt(ratingFilter),
      );
    }

    if (hideRatingsWithoutReviews) {
      next = next.filter((review) => !!review.body);
    }

    setFilteredReviews(next);
  }, [reviews, ratingFilter, hideRatingsWithoutReviews]);

  const filterableRatings = ["5", "4", "3", "2", "1"];

  const countForRating = (rating: string) => {
    return reviews.filter(
      (review) => parseInt(review.rating) === parseInt(rating),
    ).length;
  };

  const percentageForRating = (rating: string) => {
    if (!total) {
      return 0;
    }

    return parseInt(((countForRating(rating) / total) * 100).toFixed(0));
  };

  const eateryModals = useEateryModals();

  return (
    <Card>
      <Text style={{ fontWeight: "600", fontSize: 16 }}>
        Visitor reviews from {eateryName}
      </Text>

      <View
        style={{
          flexDirection: "row",
          gap: 4,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <StarRating rating={average} size={24} showAll />
        <Text>
          Based on {total} {pluralise("review", total)}
        </Text>
      </View>

      <RatingsBreakdown
        filterableRatings={filterableRatings}
        percentageForRating={percentageForRating}
        countForRating={countForRating}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
      />

      <View style={{ gap: 12, marginTop: 12 }}>
        <Text style={{ fontWeight: 600, fontSize: 16 }}>
          Share your thoughts
        </Text>

        <Text style={{ fontSize: 12, lineHeight: 18 }}>
          Have you visited{" "}
          <Text style={{ fontWeight: 600 }}>{eatery.title}</Text>? Share your
          experience with other people!
        </Text>

        <Button
          theme="primaryLight"
          bold
          clickHandler={() => eateryModals.openReviewEatery()}
        >
          Write a review
        </Button>
      </View>

      {reviews.length === 0 && (
        <Text style={{ marginTop: 18 }}>
          No reviews found, why not write one?
        </Text>
      )}

      {reviews.length > 0 && (
        <View
          style={{
            marginTop: 18,
            marginBottom: !!eatery.branch ? 4 : 18,
            backgroundColor: withOpacity(Colors.primaryLight, 0.3),
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: withOpacity(Colors.text, 0.8),
            }}
          >
            Hide ratings without a review
          </Text>

          <Checkbox
            value={hideRatingsWithoutReviews}
            onValueChange={setHideRatingsWithoutReviews}
            color={Colors.primary}
          />
        </View>
      )}

      {!!eatery.branch && (
        <View
          style={{
            marginBottom: 18,
            backgroundColor: withOpacity(Colors.primaryLight, 0.3),
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: withOpacity(Colors.text, 0.8),
            }}
          >
            Show reviews for all branches
          </Text>

          <Checkbox
            value={showAllReviews}
            onValueChange={setShowAllReviews}
            color={Colors.primary}
          />
        </View>
      )}

      {filteredReviews.length > 0 ? (
        <View style={{ gap: 16 }}>
          {filteredReviews.map((review) => (
            <EateryReviewCard
              review={review}
              showAllReviews={showAllReviews}
              key={review.published}
            />
          ))}
        </View>
      ) : (
        reviews.length > 0 && (
          <Text style={{ marginTop: 18 }}>
            No reviews found with the current filters.
          </Text>
        )
      )}
    </Card>
  );
}

function RatingsBreakdown({
  filterableRatings,
  percentageForRating,
  countForRating,
  ratingFilter,
  setRatingFilter,
}: {
  filterableRatings: string[];
  percentageForRating: (rating: string) => number;
  countForRating: (rating: string) => number;
  ratingFilter: undefined | string;
  setRatingFilter: Dispatch<SetStateAction<undefined | string>>;
}) {
  return (
    <View>
      {filterableRatings.map((rating) => (
        <Pressable
          key={rating}
          onPress={() =>
            rating === ratingFilter
              ? setRatingFilter(undefined)
              : setRatingFilter(rating)
          }
        >
          <View
            style={[
              {
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
                padding: 8,
                borderRadius: 8,
              },
              ratingFilter === rating && {
                backgroundColor: withOpacity(Colors.primaryLight, 0.3),
              },
            ]}
          >
            <Text style={{ fontSize: 12 }}>{rating}</Text>
            <IconSymbol name="star.fill" color={Colors.secondary} size={18} />

            <View
              style={{
                flex: 1,
                borderRadius: 16,
                height: 14,
                borderColor: Colors.appBackground,
                borderWidth: 1,
                backgroundColor: withOpacity(Colors.appBackground, 0.5),
              }}
            >
              <View
                style={{
                  height: 14,
                  backgroundColor: Colors.secondary,
                  borderRadius: 16,
                  width: `${percentageForRating(rating)}%`,
                }}
              ></View>
            </View>

            <Text style={{ width: 100, textAlign: "right", fontSize: 12 }}>
              <Text>{countForRating(rating)}</Text>
              <Text>({percentageForRating(rating)}%)</Text>
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
