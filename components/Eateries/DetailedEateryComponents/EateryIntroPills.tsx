import { DetailedEatery } from "@/types/eateries";
import { Linking, View, Text } from "react-native";
import Pill from "@/components/Pill";
import { useEateryModals } from "@/context/eateryModalContext";

export type EateryIntroPillsProps = {
  eatery: DetailedEatery;
  onReviewPress?: () => void;
};

export default function EateryIntroPills({
  eatery,
  onReviewPress,
}: EateryIntroPillsProps) {
  const eateryModals = useEateryModals();

  return (
    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
      {eatery.is_fully_gf && (
        <Pill theme="secondary" bold>
          100% GF
        </Pill>
      )}

      <Pill icon="map" clickHandler={() => eateryModals.openMap()} bold>
        Map
      </Pill>

      {!!eatery.website && (
        <Pill
          clickHandler={() => Linking.openURL(eatery.website as string)}
          icon="link"
          bold
        >
          Website
        </Pill>
      )}

      {!!eatery.phone && (
        <Pill
          clickHandler={() =>
            Linking.openURL(`tel:${eatery.phone?.replace(/[^\d+]/g, "")}`)
          }
          icon="smartphone"
          bold
        >
          Phone
        </Pill>
      )}

      {!!eatery.menu && (
        <Pill
          clickHandler={() => Linking.openURL(eatery.menu as string)}
          icon="menucard"
          bold
        >
          GF Menu
        </Pill>
      )}

      {!!eatery.reviews.expense && (
        <Pill clickHandler={onReviewPress} icon="wallet.bifold" bold>
          {`${"£".repeat(eatery.reviews.expense.value)} - ${eatery.reviews.expense.label}`}
        </Pill>
      )}

      {!!eatery.opening_times && (
        <Pill
          icon="clock"
          bold
          clickHandler={() => eateryModals.openOpeningTimes()}
        >
          {eatery.opening_times.is_open_now ? (
            <Text>Open, closes at {eatery.opening_times.today.closes}</Text>
          ) : (
            <Text>Currently closed</Text>
          )}
        </Pill>
      )}
    </View>
  );
}
