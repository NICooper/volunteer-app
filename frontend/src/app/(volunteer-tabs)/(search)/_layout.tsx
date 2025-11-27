import { Stack } from 'expo-router';
import { Text, useTheme } from 'react-native-paper';

export default function ShiftLayout() {
  const theme = useTheme();

  return (
    <>
      {/* <Text>Shift Layout</Text> */}
      <Stack screenOptions={{ contentStyle: { backgroundColor: theme.colors.background }}}>
        <Stack.Screen name='index' options={{ headerShown: false}} />
      </Stack>
    </>
  );
}
