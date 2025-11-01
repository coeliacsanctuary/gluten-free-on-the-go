import { ScreenWrapper } from "@/components/Ui/ScreenWrapper";
import { ScreenHeader } from "@/components/ScreenHeader";
import RecommendAPlace from "@/screens/RecommendAPlace";
import { logScreen } from "@/services/analytics";

export default function Recommend() {
  logScreen("recommend");

  return (
    <ScreenWrapper>
      <ScreenHeader showBackButton={true}>Recommend A Place</ScreenHeader>

      <RecommendAPlace />
    </ScreenWrapper>
  );
}
