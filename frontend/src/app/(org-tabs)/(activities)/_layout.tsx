import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function ActivityLayout() {
  const theme = useTheme();

  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: theme.colors.background }}}>
      <Stack.Screen name='index' options={{ headerShown: false}} />
    </Stack>
  );
}
