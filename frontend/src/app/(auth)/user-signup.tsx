import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { UserContext } from '../_layout';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { apiUrl } from '../../global';
import { parseJwtPayload, storeAccessJwt } from '../../utilities/jwt';
import { JwtPayload } from '@shared/types/jwt-payload';
import { GlobalSnackbarContext } from '../../components/global-snackbar';

export default function UserSignUpScreen() {
  const router = useRouter();
  const { user, setUser } = React.useContext(UserContext);
  const { setSnackbarMessage } = React.useContext(GlobalSnackbarContext);

  const [displayName, setDisplayName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const signUpMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(apiUrl + '/auth/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: displayName, email, password }),
      });

      if (!response.ok) {
        setSnackbarMessage('Failed to sign up.');
        throw new Error('Failed to sign up');
      }

      const authorizationHeader = response.headers.get('Authorization');
      if (!authorizationHeader) {
        setSnackbarMessage('Failed to sign up.');
        throw new Error('No authorization header in response');
      }

      const token = authorizationHeader.replace('Bearer ', '');
      await storeAccessJwt(token);
      const data = await parseJwtPayload<JwtPayload>(token);
      
      setUser({ id: data.sub, role: data.rol, expiration: new Date(data.exp * 1000) });
      // router.back();
      return data;
    },
    onSuccess: (data: JwtPayload) => {
      setUser({ id: data.sub, role: data.rol, expiration: new Date(data.exp * 1000) });
    },
    onError: (error) => {
      console.error('Error signing in:', error);
    }
  });

  const formComplete = displayName.length > 0 && email.length > 0 && password.length > 0;

  return (
    <SafeAreaView style={ styles.container }>
      {/* <Text variant="headlineMedium"></Text> */}
      {user && <Text>Signed in as {user.id}</Text>}
      <TextInput
        label="Display Name"
        mode='outlined'
        value={displayName}
        onChangeText={setDisplayName}
        autoComplete='username'
        inputMode='text'
        maxLength={200}
        style={styles.item}
      />
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
        disabled={!formComplete || signUpMutation.isPending}
        onPress={() => signUpMutation.mutate()}
      >
        Create an Account
      </Button>
      <Link href="/(auth)" style={styles.text}>
        <Text variant="bodyMedium" style={{ marginTop: 16, color: useTheme().colors.primary }}>Already have an account? Sign In</Text>
      </Link>
    </SafeAreaView>
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
  }
});
