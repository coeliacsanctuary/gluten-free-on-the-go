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
import { withOpacity } from "@/helpers/helpers";
import { Colors } from "@/constants/Colors";

export type SimpleBranchCardProps = {
  branch: EateryBranchResource;
  clickHandler: () => void;
};

export default function SimpleBranchCard({
  branch,
  clickHandler,
}: SimpleBranchCardProps) {
  return (
    <Card style={{ backgroundColor: withOpacity(Colors.primaryLight, 0.5) }}>
      <View>
        <Text
          style={{ fontWeight: "600", flexShrink: 1 }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {branch.full_name}
        </Text>
      </View>

      <Text>{branch.location.address}</Text>

      <Button size="xs" theme="secondary" clickHandler={clickHandler}>
        Read more...
      </Button>
    </Card>
  );
}
