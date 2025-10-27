import { ScreenWrapper } from "@/components/Ui/ScreenWrapper";
import { ScreenHeader } from "@/components/ScreenHeader";
import RecommendAPlace from "@/screens/RecommendAPlace";

export default function Recommend() {
  return (
    <ScreenWrapper>
      <ScreenHeader showBackButton={true}>Recommend A Place</ScreenHeader>

      <RecommendAPlace />
    </ScreenWrapper>
  );
}
