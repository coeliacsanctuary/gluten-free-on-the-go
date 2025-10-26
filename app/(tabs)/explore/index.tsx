import { ScreenWrapper } from "@/components/Ui/ScreenWrapper";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useState } from "react";
import Explore from "@/screens/Explore";

export default function ExploreEateries() {
  const [title, setTitle] = useState<string>("");

  return (
    <ScreenWrapper>
      <ScreenHeader showSearchButton={false}>{title}</ScreenHeader>

      <Explore setTitle={setTitle} />
    </ScreenWrapper>
  );
}
