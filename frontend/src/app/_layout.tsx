import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, useTheme } from 'react-native-paper';
import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { en, fr, registerTranslation } from 'react-native-paper-dates';
import GlobalSnackbar, { GlobalSnackbarContext } from '../components/global-snackbar';
import React from 'react';
import { setDefaultOptions } from 'date-fns';
import { enCA, enUS, frCA } from 'date-fns/locale';
import { AccountUser } from '../types/account-user';
import App from './app';

const queryClient = new QueryClient();
export const UserContext = React.createContext<{ user: AccountUser | undefined, setUser: (user: AccountUser | undefined) => void }>({ user: undefined, setUser: () => {} });

export default function RootLayout() {
  const theme = useTheme();
  registerTranslation('fr', fr);
  registerTranslation('en', en);
  setDefaultOptions({ locale: enUS });

  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [user, setUser] = React.useState<AccountUser | undefined>();

  return (
    // <StrictMode>
      <GestureHandlerRootView>
        <UserContext.Provider value={{ user, setUser }}>
          <GlobalSnackbarContext.Provider value={{ snackbarMessage, setSnackbarMessage }}>
            <PaperProvider>
              <QueryClientProvider client={queryClient}>
                <App />
                <GlobalSnackbar />
              </QueryClientProvider>
            </PaperProvider>
          </GlobalSnackbarContext.Provider>
        </UserContext.Provider>
      </GestureHandlerRootView>
    // </StrictMode>
  )
}
