import { DetailedEatery } from "@/types/eateries";
import { Text } from "react-native";
import { Card } from "@/components/Card";
import EateryAverageRating from "@/components/Eateries/DetailedEateryComponents/EateryAverageRating";
import EateryIntroPills from "@/components/Eateries/DetailedEateryComponents/EateryIntroPills";

export type EateryIntroCardProps = {
  eatery: DetailedEatery;
  eateryName: string;
};

export default function EateryIntroCard({ eatery }: EateryIntroCardProps) {
  return (
    <Card>
      {eatery.reviews.number > 0 && !!eatery.reviews.average && (
        <EateryAverageRating review={eatery.reviews} />
      )}

      <Text>
        {eatery.venue_type}, {eatery.cuisine}
      </Text>

      <Text style={{ fontSize: 12 }}>
        {eatery.branch ? eatery.branch.town : eatery.town},{" "}
        {eatery.branch ? eatery.branch.county : eatery.county}
      </Text>

      {eatery.branch && (
        <Text style={{ fontWeight: 600, fontStyle: "italic" }}>
          Part of the {eatery.title} chain.
        </Text>
      )}

      <EateryIntroPills eatery={eatery} />
    </Card>
  );
}
