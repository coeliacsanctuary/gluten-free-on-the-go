import {
  EateryBranchResource,
  NationwideEatery,
  SimpleEatery,
} from "@/types/eateries";
import { Card } from "@/components/Card";
import { Pressable, Text, View } from "react-native";
import StarRating from "@/components/Eateries/StarRating";
import Pill from "@/components/Pill";
import { Link, router } from "expo-router";
import { EateryMap } from "@/components/Eateries/EateryMap";
import Button from "@/components/Form/Button";

export type NearbyBranchCardProps = {
  branch: EateryBranchResource;
  clickHandler: () => void;
};

export default function NearbyBranchCard({
  branch,
  clickHandler,
}: NearbyBranchCardProps) {
  return (
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
          {branch.name}
        </Text>

        {branch.distance && branch.distance > 0 && (
          <Text>{branch.distance.toFixed(2)} miles away</Text>
        )}
      </View>

      <EateryMap latlng={branch.location} height={100} expandable={false} />

      <Text>{branch.location.address}</Text>

      <Button size="xs" theme="primaryLight" clickHandler={clickHandler}>
        Read more...
      </Button>
    </Card>
  );
}
