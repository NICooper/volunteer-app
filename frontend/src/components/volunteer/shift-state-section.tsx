import { StyleSheet } from 'react-native';
import { ShiftVolunteer } from '@shared/db/schema-types';
import { UseQueryResult } from '@tanstack/react-query';
import { ActivityIndicator, Button, useTheme, Text } from 'react-native-paper';

export default function ShiftStateSection(props: {
  shiftVolunteerQuery: UseQueryResult<ShiftVolunteer | null>,
  onSignUpPress: () => void,
  onCancelPress: () => void,
  onWithdrawPress: () => void
}) {
  const theme = useTheme();

  if (props.shiftVolunteerQuery.isPending) {
    return <ActivityIndicator />;
  }

  const shiftVolunteer = props.shiftVolunteerQuery.data;

  if (!shiftVolunteer) {
    return (
      <Button
        mode='contained'
        buttonColor={theme.colors.primary}
        textColor={theme.colors.onPrimary}
        style={styles.button}
        onPress={props.onSignUpPress}
      >
        Sign Up
      </Button>
    );
  }

  if (shiftVolunteer.isApproved) {
    return (
      <>
        <Text variant='titleSmall' style={styles.text}>You are signed up for this shift.</Text>
        <Button
          mode='outlined'
          buttonColor={theme.colors.errorContainer}
          textColor={theme.colors.onErrorContainer}
          style={styles.button}
          onPress={props.onCancelPress}
        >
          Cancel Commitment
        </Button>
      </>
    );
  }

  return (
    <>
      <Text variant='titleSmall' style={styles.text}>Your request is pending approval.</Text>
      <Button
        mode='outlined'
        buttonColor={theme.colors.secondaryContainer}
        textColor={theme.colors.onSecondaryContainer}
        style={styles.button}
        onPress={props.onWithdrawPress}
      >
        Withdraw Request
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 8,
    marginBottom: 8
  },
  button: {
    marginTop: 8,
    marginBottom: 8
  }
});
