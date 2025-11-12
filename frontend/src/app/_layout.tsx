import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { en, fr, registerTranslation } from 'react-native-paper-dates';
import GlobalSnackbar, { GlobalSnackbarContext } from '../components/global-snackbar';
import React from 'react';
import { setDefaultOptions } from 'date-fns';
import { enCA, enUS, frCA } from 'date-fns/locale';

const queryClient = new QueryClient();

export default function RootLayout() {
  registerTranslation('fr', fr);
  registerTranslation('en', en);
  setDefaultOptions({ locale: enUS });

  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  let user: { role: 'org' | 'volunteer' } | undefined = { role: 'org' };

  return (
    // <StrictMode>
      <GestureHandlerRootView>
        <GlobalSnackbarContext.Provider value={{ snackbarMessage, setSnackbarMessage }}>
          <PaperProvider>
            <QueryClientProvider client={queryClient}>
                <Stack screenOptions={{ headerShown: false }}>
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
              <GlobalSnackbar />
            </QueryClientProvider>
          </PaperProvider>
        </GlobalSnackbarContext.Provider>
      </GestureHandlerRootView>
    // </StrictMode>
  )
}
