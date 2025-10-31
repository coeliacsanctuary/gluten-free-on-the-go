import { ScreenWrapper } from "@/components/Ui/ScreenWrapper";
import { ScreenHeader } from "@/components/ScreenHeader";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { BlogResource } from "@/types/blogs";
import { getBlogsRequest } from "@/requests/blogs";
import { Colors } from "@/constants/Colors";
import { Carousel } from "@/components/Carousel";
import { Image } from "expo-image";
import { RecipeResource } from "@/types/recipes";
import { getRecipesRequest } from "@/requests/recipes";
import { ShopCtaCard } from "@/components/ShopCtaCard";

export default function MoreIndex() {
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  const [blogs, setBlogs] = useState<BlogResource[]>([]);
  const [recipes, setRecipes] = useState<RecipeResource[]>([]);

  useEffect(() => {
    getBlogsRequest().then((response) => {
      setBlogs(response.data.data);
      setLoadingBlogs(false);
    });

    getRecipesRequest().then((response) => {
      setRecipes(response.data.data);
      setLoadingRecipes(false);
    });
  }, []);

  return (
    <ScreenWrapper>
      <ScreenHeader showBackButton>Latest on Coeliac Sanctuary</ScreenHeader>

      <ScrollView style={{ paddingHorizontal: 8, marginBottom: 24 }}>
        <View style={{ gap: 8 }}>
          <Card>
            <Text>
              Coeliac Sanctuary is more than just this eating out guide, over on
              the main Coeliac Sanctuary website I&#39;m regularly posting new
              blogs and recipes, tips on social media, and more.
            </Text>
            <Text>
              Why not checkout some of my latest blogs and recipes below!
            </Text>
          </Card>

          <Card>
            <Text style={{ fontWeight: 600, fontSize: 18 }}>Latest Blogs</Text>
            {loadingBlogs ? (
              <ActivityIndicator color={Colors.primary} size="large" />
            ) : (
              <Carousel
                items={blogs}
                itemRenderer={(item: BlogResource, index: number) => (
                  <Pressable
                    key={index}
                    style={{ gap: 8, maxWidth: "100%" }}
                    onPress={() => Linking.openURL(item.link)}
                  >
                    <Image
                      source={item.image}
                      style={{
                        width: "100%",
                        aspectRatio: 1.9,
                      }}
                      contentFit="cover"
                    />
                    <Text style={{ fontWeight: 600, fontSize: 16 }}>
                      {item.title}
                    </Text>
                    <Text>{item.description}</Text>
                    <Text style={{ fontSize: 12 }}>Published {item.date}</Text>
                  </Pressable>
                )}
              />
            )}
          </Card>

          <ShopCtaCard />

          <Card>
            <Text style={{ fontWeight: 600, fontSize: 18 }}>
              Latest Recipes
            </Text>
            {loadingRecipes ? (
              <ActivityIndicator color={Colors.primary} size="large" />
            ) : (
              <Carousel
                items={recipes}
                itemRenderer={(item: RecipeResource, index: number) => (
                  <Pressable
                    key={index}
                    style={{ gap: 8, maxWidth: "100%" }}
                    onPress={() => Linking.openURL(item.link)}
                  >
                    <Image
                      source={item.image}
                      style={{
                        width: "100%",
                        aspectRatio: 1.9,
                      }}
                      contentFit="cover"
                    />
                    <Text style={{ fontWeight: 600, fontSize: 16 }}>
                      {item.title}
                    </Text>
                    <Text>{item.description}</Text>
                    <Text style={{ fontSize: 12 }}>Published {item.date}</Text>
                  </Pressable>
                )}
              />
            )}
          </Card>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
