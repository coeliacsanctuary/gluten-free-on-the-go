import { Card } from "@/components/Card";
import { ScreenWrapper } from "@/components/Ui/ScreenWrapper";
import { ScreenHeader } from "@/components/ScreenHeader";
import NearbyPlaces from "@/components/Screens/NearbyPlaces";
import { Text, View } from "react-native";

export default function NearbyEateries() {
  return (
    <ScreenWrapper>
      <ScreenHeader>Coeliac Sanctuary - Gluten Free on the Go</ScreenHeader>
      <NearbyPlaces
        ListHeaderComponent={
          <>
            <View>
              <Card>
                <Text>
                  Thanks for using our Gluten Free On the Go app, our app
                  connects to the eating out guide on the Coeliac Sanctuary
                  website to display the locations of Gluten Free places to eat
                  near you. You can also search for locations around the UK and
                  Ireland to plan your next trip to the seaside, or your next
                  city break!
                </Text>

                <Text>
                  All of the places on Coeliac Sanctuary are recommended to us
                  by other people and are checked before they are added to our
                  app and website, but if you have a bad experience at a
                  location on our app, or if it no longer exists you can easily
                  report it to us through the app.
                </Text>
              </Card>
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
