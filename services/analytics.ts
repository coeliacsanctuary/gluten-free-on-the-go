import AsyncStorage from "@react-native-async-storage/async-storage";
import analytics from "@react-native-firebase/analytics";
import { APP_VERSION } from "@/constants/App";

export type AnalyticsEvent = {
  type: string;
  metaData?: Record<string, any>;
};

export const hasConsented = async () => {
  try {
    const value = await AsyncStorage.getItem("@allow-analytics");

    if (!value) {
      return true;
    }

    return value === "true";
  } catch (e: unknown) {
    return true;
  }
};

export const logScreen = async (
  screenName: string,
  metaData: AnalyticsEvent["metaData"] = {},
) => {
  return logEvent({
    type: "screen_view",
    metaData: {
      screen_name: screenName,
      ...metaData,
    },
  });
};

export const logEvent = async (event: AnalyticsEvent) => {
  if (!(await hasConsented())) {
    return Promise.resolve();
  }

  return analytics().logEvent(event.type, {
    appVersion: APP_VERSION,
    ...event.metaData,
  });
};

export const toggle = async (value: boolean) => {
  try {
    await AsyncStorage.setItem("@allow-analytics", value ? "true" : "false");

    await analytics().setAnalyticsCollectionEnabled(value);
  } catch (e: unknown) {
    // saving error
  }
};
