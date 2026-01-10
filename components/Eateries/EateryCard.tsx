import { SimpleEatery } from "@/types/eateries";
import { Card } from "@/components/Card";
import { Pressable, Text, View } from "react-native";
import StarRating from "@/components/Eateries/StarRating";
import Pill from "@/components/Pill";
import { Link } from "expo-router";

export type EateryCardProps = {
  eatery: SimpleEatery;
  basePath: "nearby" | "explore";
};

export default function EateryCard({ eatery, basePath }: EateryCardProps) {
  return (
    <Link
      asChild
      href={{
        pathname: `/(tabs)/${basePath}/eatery-details`,
        params: { id: eatery.id, branchId: eatery.branch_id },
      }}
    >
      <Pressable>
        <Card>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              gap: 8,
            }}
          >
            <Text
              style={{ fontWeight: "600", flexShrink: 1 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {eatery.title}
            </Text>

            {!!eatery.distance && eatery.distance > 0 && (
              <Text>{eatery.distance.toFixed(2)} miles away</Text>
            )}
          </View>

          <Text>{eatery.address}</Text>

          {eatery.number_of_ratings > 0 && (
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <StarRating rating={eatery.average_rating} showAll />
              <Text style={{ fontSize: 12 }}>
                from {eatery.number_of_ratings} reviews
              </Text>
            </View>
          )}

          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            {eatery.is_fully_gf && (
              <Pill theme="secondary" bold>
                100% GF
              </Pill>
            )}

            <Pill>{eatery.venueType}</Pill>

            {eatery.type === "Eatery" && <Pill>{eatery.cuisine}</Pill>}

            {eatery.average_expense && (
              <Pill>
                {`${"£".repeat(eatery.average_expense.value)} - ${eatery.average_expense.label}`}
              </Pill>
            )}
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}
