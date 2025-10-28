import { Stack } from "expo-router";

export default function NationwideStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="eatery-details" />
    </Stack>
  );
}
