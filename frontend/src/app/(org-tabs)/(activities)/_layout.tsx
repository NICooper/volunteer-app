import { Stack } from 'expo-router';
import { Text } from 'react-native-paper';

export default function ActivityLayout() {
  return (
    // <>
      /* <Text>Activity Layout</Text> */
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false}} />
      </Stack>
    // </>
  );
}
