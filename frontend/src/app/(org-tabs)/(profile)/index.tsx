import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Button, useTheme } from 'react-native-paper';
import { UserContext } from '../../_layout';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchOrgAccount } from '@/src/queries/query-account';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser } = React.useContext(UserContext);
  const theme = useTheme();

  const profile = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchOrgAccount(user?.id!),
    staleTime: 60 * 1000
  });

  const account = profile.data;

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={account?.name || 'Profile'} />
        <Appbar.Action icon='pencil-outline' onPress={() => router.navigate({ pathname: '/org/profile/edit' })} />
      </Appbar.Header>
      <View style={styles.logoutButtonContainer}>
        <Button mode="outlined"
          buttonColor={theme.colors.errorContainer}
          textColor={theme.colors.onErrorContainer}
          style={{ borderColor: theme.colors.errorContainer }}
          onPress={() => { setUser(undefined); }}
        >
          Logout
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  logoutButtonContainer: {
    alignItems: 'center',
    marginTop: 20
  }
});
