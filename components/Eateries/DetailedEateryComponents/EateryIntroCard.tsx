import { DetailedEatery } from "@/types/eateries";
import { Text } from "react-native";
import { Card } from "@/components/Card";
import EateryAverageRating from "@/components/Eateries/DetailedEateryComponents/EateryAverageRating";
import EateryIntroPills from "@/components/Eateries/DetailedEateryComponents/EateryIntroPills";

export type EateryIntroCardProps = {
  eatery: DetailedEatery;
  eateryName: string;
  onReviewPress: () => void;
};

export default function EateryIntroCard({
  eatery,
  onReviewPress,
}: EateryIntroCardProps) {
  return (
    <Card>
      {eatery.reviews.number > 0 && !!eatery.reviews.average && (
        <EateryAverageRating review={eatery.reviews} />
      )}

      <Text>
        {!!eatery.cuisine
          ? `${eatery.venue_type}, ${eatery.cuisine}`
          : `${eatery.venue_type}`}
      </Text>

      {(eatery.town !== "Nationwide" || eatery.branch?.town) && (
        <Text style={{ fontSize: 12 }}>
          {eatery.branch ? eatery.branch.town : eatery.town},{" "}
          {eatery.branch ? eatery.branch.county : eatery.county}
        </Text>
      )}

      {eatery.branch && (
        <Text style={{ fontWeight: 600, fontStyle: "italic" }}>
          Part of the {eatery.title} chain.
        </Text>
      )}

      <EateryIntroPills eatery={eatery} onReviewPress={onReviewPress} />
    </Card>
  );
}
