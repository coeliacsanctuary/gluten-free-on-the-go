import React, { useEffect, useState } from "react";
import { ShopCta } from "@/types/types";
import { getShopCtaRequest } from "@/requests/shopCta";
import { Card } from "@/components/Card";
import { Image } from "expo-image";
import { Linking, Pressable, Text } from "react-native";

export function ShopCtaCard() {
  const [cta, setCta] = useState<ShopCta>();
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);

  useEffect(() => {
    getShopCtaRequest().then((response) => {
      setCta(response.data.data);
    });
  }, []);

  if (!cta) {
    return null;
  }

  return (
    <Pressable
      style={{ marginTop: 8 }}
      onPress={() => Linking.openURL(cta.link)}
    >
      <Card>
        <Image
          source={cta.image}
          style={{
            width: "100%",
            aspectRatio: aspectRatio ?? 1,
          }}
          onLoad={(e) => {
            const { width, height } = e.source;
            setAspectRatio(width / height);
          }}
          contentFit="cover"
        />
        <Text
          style={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: 16,
            marginTop: 8,
          }}
        >
          {cta.text}
        </Text>
      </Card>
    </Pressable>
  );
}
