import { ScreenWrapper } from "@/components/Ui/ScreenWrapper";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import { Card } from "@/components/Card";
import { baseUrl } from "@/constants/Http";
import { withOpacity } from "@/helpers/helpers";
import { Colors } from "@/constants/Colors";
import { Checkbox } from "expo-checkbox";

export default function MoreIndex() {
  const [allowAnalytics, setAllowAnalytics] = useState(true);

  return (
    <ScreenWrapper>
      <ScreenHeader showBackButton>About</ScreenHeader>

      <ScrollView style={{ paddingHorizontal: 8, marginBottom: 24 }}>
        <View style={{ gap: 8 }}>
          <Card>
            <Text>
              Coeliac Sanctuary - Gluten Free On the Go can be used to find
              gluten free places to eat around the UK and Ireland, it connects
              to the eating out guide on the Coeliac Sanctuary website to
              display places around you using your GPS location, or to allow you
              to search for locations.
            </Text>
            <Text>
              All of the places on our Eating Out guide and this app are user
              contributed, but we do verify them before we add them to our
              database by checking the eateries website, menus and reviews to
              make sure they do offer gluten free options, but if yu do find a
              place we have listed that doesn&#39;t exist anymore or doesn&#39;t
              do gluten free, then you can report it to us through the app.
            </Text>
          </Card>

          <Card>
            <Text style={{ fontSize: 16, fontWeight: 600 }}>
              Alisons Reviews
            </Text>
            <Text>
              You may see some eateries on the app that have been reviewed
              personally by myself, this means that I have visited the
              establishment and written about my experiences, unfortunately, due
              to where we are based in the UK, reviewed places are limited and
              there may be none near your location.
            </Text>
          </Card>

          <Card>
            <Text style={{ fontSize: 16, fontWeight: 600 }}>
              Visitor Reviews and photos
            </Text>
            <Text>
              Through our app and website we give users the ability to leave
              places a review and rating of between 1 and 5 stars, users can
              also rate the food, service and expense, and upload upto 6 photos
              with their review, these are all approved before going live.
            </Text>
          </Card>

          <Card>
            <Text style={{ fontSize: 16, fontWeight: 600 }}>
              Nationwide Chains
            </Text>
            <Text>
              I list nationwide chains separately on our app and website because
              typically there are far too many branches to individually list in
              my guide, however, over time I hope to list more individual
              branches for different chains to make it easier to find, however
              this is a time consuming process.
            </Text>
            <Text>
              You can already see individual branch information for chains such
              as Bills, Brunning and Price Pubs, Lounges, for others, rely on
              the chains own branch location on their website.
            </Text>
          </Card>

          <Card>
            <Text style={{ fontSize: 16, fontWeight: 600 }}>
              Privacy and your data
            </Text>
            <Text>
              While the app require your GPS location to show eateries around
              you, it is not logged, nor associated with you, or used in any
              other way except to find gluten free places around you.
            </Text>
            <Text>
              All requests sent to the Coeliac Sanctuary server are sent over
              HTTPS and protected by an SSL Certificate
            </Text>
            <Text>
              The app collects anonymous analytical data to show us how users
              use this app, this is only what screens you access, your device
              model, and your operating system. if you&#39;d prefer to not share
              anonymous usage reports you can opt out below.
            </Text>

            <View
              style={{
                backgroundColor: withOpacity(Colors.primaryLight, 0.3),
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: withOpacity(Colors.text, 0.8),
                }}
              >
                I consent to anonymous usage reports.
              </Text>

              <Checkbox
                value={allowAnalytics}
                onValueChange={setAllowAnalytics}
                color={Colors.primary}
              />
            </View>

            <Pressable
              onPress={() => Linking.openURL(baseUrl + "/privacy-policy")}
            >
              <Text>
                You can view our Privacy Policy on our website by tapping here.
              </Text>
            </Pressable>
          </Card>

          <Text style={{ fontSize: 12 }}>
            App Version 4.0.0 alpha 1, published 1st November 2025
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
