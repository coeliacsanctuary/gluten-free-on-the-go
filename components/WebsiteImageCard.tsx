import React, { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Image } from "expo-image";
import { Pressable, Text } from "react-native";
import { getWebsiteImageRequest } from "@/requests/website";
import { LoaderCard } from "@/components/LoaderCard";
import { router } from "expo-router";

export function WebsiteImageCard() {
  const [websiteImg, setWebsiteImg] = useState<string>();
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);

  useEffect(() => {
    getWebsiteImageRequest().then((response) => {
      setWebsiteImg(response.data.data);
    });
  }, []);

  if (!websiteImg) {
    return null;
  }

  return !websiteImg ? (
    <LoaderCard />
  ) : (
    <Pressable
      style={{ marginTop: 8 }}
      onPress={() => router.navigate("(tabs)/more/website")}
    >
      <Card>
        <Image
          source={websiteImg}
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
          See whats new on the Coeliac Sanctuary website!
        </Text>
      </Card>
    </Pressable>
  );
}
