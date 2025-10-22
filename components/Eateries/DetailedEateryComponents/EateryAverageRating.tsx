import { DetailedEatery } from "@/types/eateries";
import { Text, View } from "react-native";
import { pluralise } from "@/helpers/helpers";
import StarRating from "@/components/Eateries/StarRating";

export type EateryAverageRatingProps = {
  review: DetailedEatery["reviews"];
};

export default function EateryAverageRating({
  review,
}: EateryAverageRatingProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 16 }}>
        <Text>Rated </Text>
        <Text style={{ fontWeight: "600" }}>{review.average} stars</Text>
        <Text> from </Text>
        <Text style={{ fontWeight: "600" }}>
          {review.number} {pluralise("review", review.number)}
        </Text>
      </Text>
      <StarRating rating={review.average} showAll />
    </View>
  );
}
