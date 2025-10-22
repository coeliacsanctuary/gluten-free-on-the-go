import { ActivityIndicator, StyleSheet } from "react-native";
import { Card, CardProps } from "@/components/Card";
import { DefaultTheme } from "@/constants/DefaultTheme";

export function LoaderCard({ style, children }: CardProps) {
  const styles = StyleSheet.create({
    loaderWrapper: {
      paddingTop: 32,
      alignItems: "center",
      flexGrow: 1,
    },
  });

  return (
    <Card hideShadow style={[styles.loaderWrapper, style]}>
      <ActivityIndicator size="large" color={DefaultTheme.colors.primary} />
      {children}
    </Card>
  );
}
