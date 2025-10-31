import { Stack } from "expo-router";

export default function MoreStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="about" />
      <Stack.Screen name="website" />
    </Stack>
  );
}
