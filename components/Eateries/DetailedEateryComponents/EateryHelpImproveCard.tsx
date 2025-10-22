import { Text, View } from "react-native";
import Pill from "@/components/Pill";
import { Card } from "@/components/Card";
import { useEateryModals } from "@/context/eateryModalContext";

export type EateryHelpImproveCardProps = {
  eateryName: string;
};

export default function EateryHelpImproveCard({
  eateryName,
}: EateryHelpImproveCardProps) {
  const eateryModals = useEateryModals();

  return (
    <Card>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>
        Help us improve {eateryName}
      </Text>

      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <Pill
          theme="secondary"
          icon="star"
          bold
          clickHandler={() => eateryModals.openReviewEatery()}
        >
          Review
        </Pill>

        <Pill
          theme="secondary"
          icon="pencil"
          bold
          clickHandler={() => eateryModals.openSuggestEdits()}
        >
          Edit
        </Pill>

        <Pill
          theme="secondary"
          icon="flag"
          bold
          clickHandler={() => eateryModals.openReportEatery()}
        >
          Report
        </Pill>
      </View>
    </Card>
  );
}
