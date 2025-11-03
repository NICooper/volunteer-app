import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {

  let user: { role: 'org' | 'volunteer' } | undefined = { role: 'org' };

  return (
    <GestureHandlerRootView>
      <PaperProvider>
        <Stack>
          <Stack.Protected guard={!user}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={user?.role === 'org'}>
            <Stack.Screen name="(org-tabs)" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={user?.role === 'volunteer'}>
            <Stack.Screen name="(volunteer-tabs)" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  )
}
