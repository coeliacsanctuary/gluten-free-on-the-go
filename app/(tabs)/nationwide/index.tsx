import { ScreenWrapper } from "@/components/Ui/ScreenWrapper";
import { ScreenHeader } from "@/components/ScreenHeader";
import NationwideChains from "@/screens/NationwideChains";
import { Text } from "react-native";
import { Card } from "@/components/Card";
import { logScreen } from "@/services/analytics";

export default function NationwideEateries() {
  logScreen("nationwidePlaces");

  return (
    <ScreenWrapper>
      <ScreenHeader>Gluten Free Nationwide Chains</ScreenHeader>

      <NationwideChains
        ListHeaderComponent={
          <Card style={{ marginBottom: 8 }}>
            <Text>
              Here you can find a list of nationwide chains across the UK that
              offer gluten free options or have a full gluten free menu.
            </Text>
            <Text>
              Unfortunately, due to the number of branches some of these
              nationwide chains have, we are not always able to list all
              individual locations, and in cases where we do, any newer branches
              ones may be missing.
            </Text>
            <Text>
              Please check with eatery for up to date locations if you are
              unsure.
            </Text>
          </Card>
        }
      />
    </ScreenWrapper>
  );
}
