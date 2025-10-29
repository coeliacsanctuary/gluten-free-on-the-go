import { DetailedEatery } from "@/types/eateries";
import { Linking, Pressable, Text, View } from "react-native";
import { Card } from "@/components/Card";
import { ImageBackground } from "expo-image";
import { baseUrl } from "@/constants/Http";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useEateryModals } from "@/context/eateryModalContext";
import { pluralise } from "@/helpers/helpers";
import Button from "@/components/Form/Button";

export type EateryBranchListCardProps = {
  eatery: DetailedEatery;
  eateryName: string;
};

export default function EateryBranchListCard({
  eatery,
  eateryName,
}: EateryBranchListCardProps) {
  const eateryModals = useEateryModals();

  return (
    <Card style={{ gap: 16 }}>
      <Text style={{ fontWeight: "600", fontSize: 18 }}>
        Where to find {eateryName}
      </Text>

      <Text style={{ fontSize: 16 }}>
        Our gluten free eating out guide currently features{" "}
        <Text style={{ fontWeight: 600 }}>
          {eatery.number_of_branches} {eateryName}
        </Text>{" "}
        {pluralise("restaurant", eatery.number_of_branches)} across the UK.
      </Text>

      <Button
        theme="secondary"
        bold
        clickHandler={() => eateryModals.openBranchSidebar()}
      >
        View Branches
      </Button>
    </Card>
  );
}
