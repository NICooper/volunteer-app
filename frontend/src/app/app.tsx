import { Stack } from 'expo-router';
import { UserContext } from './_layout';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { View } from 'react-native';
import * as SystemUI from 'expo-system-ui';

export default function App() {
  const theme = useTheme();
  const { user } = React.useContext(UserContext);

  SystemUI.setBackgroundColorAsync(theme.colors.background);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background }}}>
      <Stack.Protected guard={!user}>
        <Stack.Screen name='login' options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={user?.role === 'org'}>
        <Stack.Screen name='(org-tabs)' options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={user?.role === 'volunteer'}>
        <Stack.Screen name='(volunteer-tabs)' options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}