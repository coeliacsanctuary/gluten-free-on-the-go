import { DetailedEatery } from "@/types/eateries";
import { Text, useWindowDimensions, View } from "react-native";
import { CustomIcon } from "@/components/CustomIcon";
import { Colors } from "@/constants/Colors";
import { Card } from "@/components/Card";
import RenderHtml from "react-native-render-html";

export type EateryInfoCardProps = {
  eatery: DetailedEatery;
  eateryName: string;
};

export default function EateryInfoCard({
  eatery,
  eateryName,
}: EateryInfoCardProps) {
  const { width } = useWindowDimensions();

  return (
    <Card>
      <Text style={{ fontWeight: "600", fontSize: 18 }}>
        Here's what we know about {eateryName}
      </Text>

      {eatery.type === "Attraction" ? (
        <View style={{ gap: 8 }}>
          {eatery.restaurants.map((restuarant) => (
            <View>
              {restuarant.name !== "" && (
                <Text style={{ fontWeight: 600 }}>{restuarant.name}</Text>
              )}
              <RenderHtml
                contentWidth={width}
                source={{ html: restuarant.info }}
                tagsStyles={{
                  body: {
                    lineHeight: 20,
                  },
                  strong: {
                    fontWeight: "600",
                  },
                }}
              />
            </View>
          ))}
        </View>
      ) : (
        <RenderHtml
          contentWidth={width}
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
      )}

      {eatery.features.length > 0 && (
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          {eatery.features.map((feature) => (
            <View
              key={feature.slug}
              style={{
                flexDirection: "row",
                gap: 2,
                alignItems: "center",
                flexShrink: 1,
              }}
            >
              <CustomIcon
                name={feature.slug}
                fill={Colors.primary}
                width={30}
                height={30}
              />
              <Text style={{ fontWeight: "600", lineHeight: 30 }}>
                {feature.name}
              </Text>
            </View>
          ))}
        </View>
      )}

      <Text style={{ fontSize: 12, fontStyle: "italic" }}>
        Last updated {eatery.last_updated_human}
      </Text>
    </Card>
  );
}
