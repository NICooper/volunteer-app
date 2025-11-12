import React from 'react';
import { Portal, Snackbar } from 'react-native-paper';

export const GlobalSnackbarContext = React.createContext({ snackbarMessage: '', setSnackbarMessage: (msg: string) => {} });

export default function GlobalSnackbar() {
  const [showing, setShowing] = React.useState(false);
  const { snackbarMessage, setSnackbarMessage } = React.useContext(GlobalSnackbarContext);
  if (snackbarMessage !== '' && !showing) {
    setShowing(true);
  }

  return (
    <Portal>
      <Snackbar
        visible={showing}
        duration={Snackbar.DURATION_SHORT}
        onDismiss={() => { setSnackbarMessage(''); setShowing(false); }}
      >
        {snackbarMessage}
      </Snackbar>
    </Portal>
  );
}
