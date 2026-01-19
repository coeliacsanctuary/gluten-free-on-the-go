import { Card } from "@/components/Card";
import { ScreenWrapper } from "@/components/Ui/ScreenWrapper";
import { ScreenHeader } from "@/components/ScreenHeader";
import NearbyPlaces from "@/screens/NearbyPlaces";
import { Text, View } from "react-native";
import { logScreen } from "@/services/analytics";
import { Warning } from "@/components/Warning";
import React from "react";
import EateryWarningComponent from "@/components/EateryWarningComponent";

export default function NearbyEateries() {
  logScreen("nearby-places");

  return (
    <ScreenWrapper>
      <ScreenHeader>Coeliac Sanctuary - Gluten Free on the Go</ScreenHeader>
      <NearbyPlaces
        ListHeaderComponent={
          <>
            <View>
              <Card style={{ marginBottom: 8 }}>
                <Text>
                  Thanks for using our Gluten Free On the Go app, our app
                  connects to the eating out guide on the Coeliac Sanctuary
                  website to display the locations of Gluten Free places to eat
                  near you. You can also search for locations around the UK and
                  Ireland to plan your next trip to the seaside, or your next
                  city break!
                </Text>
              </Card>

              <EateryWarningComponent />
            </View>

            <Text
              style={{ fontWeight: 600, paddingHorizontal: 8, paddingTop: 8 }}
            >
              Nearby Places
            </Text>
          </>
        }
      />
    </ScreenWrapper>
  );
}
