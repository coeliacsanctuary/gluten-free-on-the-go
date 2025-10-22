import { Stack } from "expo-router";

export default function NearbyStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="eatery-details" />
    </Stack>
  );
}
