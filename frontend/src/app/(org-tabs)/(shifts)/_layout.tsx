import { Stack } from 'expo-router';
import { Text } from 'react-native-paper';

export default function ShiftLayout() {
  return (
    <>
      {/* <Text>Shift Layout</Text> */}
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false}} />
      </Stack>
    </>
  );
}
