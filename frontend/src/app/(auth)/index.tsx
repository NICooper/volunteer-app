import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { UserContext } from '../_layout';
import React, { useEffect } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiUrl } from '../../global';
import { getAccessJwt, parseJwtPayload, storeAccessJwt } from '../../utilities/jwt';
import { JwtPayload } from '@shared/types/jwt-payload';
import { GlobalSnackbarContext } from '../../components/global-snackbar';

export default function SignInScreen() {
  const queryClient = useQueryClient();
  const { user, setUser } = React.useContext(UserContext);
  const insets = useSafeAreaInsets();
  const { setSnackbarMessage } = React.useContext(GlobalSnackbarContext);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  queryClient.invalidateQueries();  

  // On component mount, check for existing JWT and set user if found
  useEffect(() => {
    (async function() {
      const accessToken = await getAccessJwt();
      if (accessToken) {
        const payload = await parseJwtPayload<JwtPayload>(accessToken);
        setUser({ id: payload.sub, role: payload.rol, expiration: new Date(payload.exp * 1000) });
      }
    })();
  }, []);

  const signInMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(apiUrl + '/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setSnackbarMessage('Invalid email or password.');
        throw new Error('Failed to sign in');
      }

      const authorizationHeader = response.headers.get('Authorization');
      if (!authorizationHeader) {
        setSnackbarMessage('Could not sign in.');
        throw new Error('Failed to sign in');
      }

      const token = authorizationHeader.replace('Bearer ', '');
      await storeAccessJwt(token);
      const data = await parseJwtPayload<JwtPayload>(token);
      setUser({ id: data.sub, role: data.rol, expiration: new Date(data.exp * 1000) });
      return data;
    },
    onSuccess: (data: JwtPayload) => {
      setUser({ id: data.sub, role: data.rol, expiration: new Date(data.exp * 1000) });
    },
    onError: (error) => {
      setSnackbarMessage('Could not sign in.');
    }
  });

  return (
    
      <View style={{ ...styles.container, paddingTop: insets.top, marginLeft: insets.left, marginRight: insets.right, paddingBottom: insets.bottom }}>
        <Text variant="headlineMedium" style={styles.text}>App Communautaire</Text>
        {user && <Text>Signed in as {user.id}</Text>}
        <TextInput
          label="Email address"
          mode='outlined'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoComplete='email'
          inputMode='email'
          maxLength={200}
          style={styles.item}
        />
        <TextInput
          label="Password"
          secureTextEntry
          mode='outlined'
          value={password}
          onChangeText={setPassword}
          passwordRules=''
          autoComplete='password'
          inputMode='text'
          maxLength={50}
          style={styles.item}
        />
        <Button
          mode="contained"
          style={styles.item}
          onPress={() => { signInMutation.mutateAsync(); }}
          disabled={email.length === 0 || password.length === 0 || signInMutation.isPending}
        >
          Sign In
        </Button>
        <Link href="/user-signup" style={styles.text}>
          <Text variant="bodyMedium" style={{ marginTop: 16, color: useTheme().colors.primary }}>Don't have an account yet? Create an account.</Text>
        </Link>
        <Link href="/org-signup" style={styles.text}>
          <Text variant="bodySmall" style={{ marginTop: 16, color: useTheme().colors.primary }}>Create an account for your organization.</Text>
        </Link>
        {/* <View style={ styles.debugContainer }>
          <Text variant="headlineMedium">Dummy Login Page</Text>
          <Button mode="outlined" onPress={() => { setUser({ role: 'org', id: 1, expiration: new Date() }) }}>Org: 1</Button>
          <Button mode="outlined" onPress={() => { setUser({ role: 'user', id: 2, expiration: new Date() }) }}>User: 2</Button>
        </View> */}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    marginVertical: 12,
    width: '80%'
  },
  text: {
    alignSelf: 'center',
    marginVertical: 12
  },
  debugContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
