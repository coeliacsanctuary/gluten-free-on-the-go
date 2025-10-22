import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';

export default function HomeScreen() {
  return (
      <Card style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
      </Card>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
