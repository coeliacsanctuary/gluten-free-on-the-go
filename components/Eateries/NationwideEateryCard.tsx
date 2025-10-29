import { NationwideEatery } from "@/types/eateries";
import { Card } from "@/components/Card";
import {
  Linking,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import StarRating from "@/components/Eateries/StarRating";
import Pill from "@/components/Pill";
import { Link } from "expo-router";
import RenderHtml from "react-native-render-html";
import Button from "@/components/Form/Button";
import { pluralise } from "@/helpers/helpers";

export type NationwideEateryCardProps = {
  eatery: NationwideEatery;
};

export default function NationwideEateryCard({
  eatery,
}: NationwideEateryCardProps) {
  const { width } = useWindowDimensions();

  return (
    <Link
      asChild
      href={{
        pathname: `/(tabs)/nationwide/eatery-details`,
        params: { id: eatery.id },
      }}
    >
      <Pressable>
        <Card style={{ gap: 16 }}>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              gap: 8,
            }}
          >
            <Text
              style={{ fontWeight: "600", flexShrink: 1, fontSize: 18 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {eatery.title}
            </Text>

            {!!eatery.website && (
              <Pill
                clickHandler={() => Linking.openURL(eatery.website as string)}
                icon="link"
                theme="secondary"
                bold
              >
                Website
              </Pill>
            )}
          </View>

          <RenderHtml
            contentWidth={width - 32}
            source={{ html: eatery.info }}
            tagsStyles={{
              body: {
                lineHeight: 20,
              },
              strong: {
                fontWeight: "600",
              },
            }}
          />

          {eatery.number_of_branches > 0 && (
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Pill theme="secondary">
                {eatery.number_of_branches}{" "}
                {pluralise("branch", eatery.number_of_branches)} listed
              </Pill>

              {eatery.nearby_branches > 0 && (
                <Pill theme="secondary">{eatery.nearby_branches} nearby</Pill>
              )}
            </View>
          )}

          <View
            style={[
              {
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                marginTop: -10,
              },
              eatery.number_of_branches === 0 && { marginTop: -10 },
            ]}
          >
            <Pill>{eatery.venueType}</Pill>

            {eatery.type === "Eatery" && <Pill>{eatery.cuisine}</Pill>}

            {eatery.average_expense && (
              <Pill>
                {`${"£".repeat(eatery.average_expense.value)} - ${eatery.average_expense.label}`}
              </Pill>
            )}
          </View>

          {eatery.number_of_ratings > 0 && (
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <StarRating rating={eatery.average_rating} showAll />
              <Text style={{ fontSize: 12 }}>
                from {eatery.number_of_ratings}{" "}
                {pluralise("review", eatery.number_of_ratings)}
              </Text>
            </View>
          )}

          <Button
            theme="primaryLight"
            textStyle={{ textAlign: "center" }}
            size="small"
          >
            Read more about{" "}
            <Text style={{ fontWeight: 600 }}>{eatery.title}</Text>
            {eatery.number_of_ratings > 0
              ? " read experiences from other people"
              : " "}
            and leave your review.
          </Button>
        </Card>
      </Pressable>
    </Link>
  );
}
