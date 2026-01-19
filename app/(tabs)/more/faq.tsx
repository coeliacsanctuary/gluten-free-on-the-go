import { ScreenWrapper } from "@/components/Ui/ScreenWrapper";
import { ScreenHeader } from "@/components/ScreenHeader";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { baseUrl } from "@/constants/Http";
import { withOpacity } from "@/helpers/helpers";
import { Colors } from "@/constants/Colors";
import { Checkbox } from "expo-checkbox";
import { hasConsented, logScreen, toggle } from "@/services/analytics";
import { APP_VERSION } from "@/constants/App";
import { AdsContext } from "@/context/adsContext";
import Button from "@/components/Form/Button";
import { Accordion } from "@/components/Accordion";

export default function MoreIndex() {
  const { showPrivacyOptions, formAvailable } = useContext(AdsContext);

  logScreen("about");

  const [allowAnalytics, setAllowAnalytics] = useState(true);

  useEffect(() => {
    hasConsented().then((result) => {
      setAllowAnalytics(result);
    });
  }, []);

  useEffect(() => {
    toggle(allowAnalytics);
  }, [allowAnalytics]);

  return (
    <ScreenWrapper>
      <ScreenHeader showBackButton>FAQ</ScreenHeader>

      <ScrollView
        style={[
          { paddingHorizontal: 8 },
          Platform.OS === "ios" && { marginBottom: 56 },
          Platform.OS === "android" && { marginBottom: 12 },
        ]}
      >
        <View style={{ gap: 8 }}>
          <Accordion title="How did you find all the places listed?">
            <Text>
              The vast majority of the places listed in the app and on the main
              Coeliac Sanctuary website were recommended by other people using
              the 'Recommend a Place' form on the app and website.
            </Text>
          </Accordion>

          <Accordion title="Why are there no locations near me?">
            <Text>
              My listings aren't 100% accurate and rely on people sending places
              they know about through the app or website, there still might be
              places around you where you can eat, if you find somewhere and
              have a positive experience, send it through the app so it can be
              added and others can find it too!
            </Text>
          </Accordion>

          <Accordion title="How can I add a place to the app?">
            <Text>
              Use the 'Recommend a Place' tab at the bottom, or through the
              website.
            </Text>
          </Accordion>

          <Accordion title="What happens after I submit a place to be added?">
            <Text>
              When a place is suggested to be added it gets sent to the admin
              area on my main website and placed in the queue of places to be
              added. I work through these as and when I can starting with the
              oldest first (I work part time, and also have a young child at
              home, so spare time is hard to come by!)
            </Text>
          </Accordion>

          <Accordion title="How long will it take for a place to be added?">
            <Text>
              I get a lot of place recommendations through every day and work
              through them as and when I can with the oldest first, typically it
              could take 2 - 4 weeks to be checked and added, but sometimes it
              can take longer.
            </Text>
          </Accordion>

          <Accordion title="How will I know when my suggestion has been added?">
            <Text>
              When a place is added via a recommendation, the person who sent
              the recommendation in will be sent an email to say there
              recommendation has been added, and inviting them to leave a review
              on the new listing.
            </Text>
          </Accordion>

          <Accordion title="How do you approve a place before it's listed?">
            <Text>
              Before a place is approved and added to the website and app, I
              search through publicly available information online, I check a
              listings website and menus, to look at their gluten free options,
              I check for reviews specially mentioning gluten free and
              procedures, I check social media, and if all the details suggest
              the place does gluten free and follows correct procedures, then
              the location is added.
            </Text>
          </Accordion>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
