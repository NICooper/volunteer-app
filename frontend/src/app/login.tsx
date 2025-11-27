import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { UserContext } from './_layout';
import React from 'react';

export default function LoginScreen() {
  const { setUser } = React.useContext(UserContext);
  return (
    <View style={ styles.container }>
      <Text variant="headlineMedium">Dummy Login Page</Text>
      <Button mode="outlined" onPress={() => { setUser({ role: 'org', id: 1 }) }}>Org: 1</Button>
      <Button mode="outlined" onPress={() => { setUser({ role: 'volunteer', id: 2 }) }}>User: 2</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
