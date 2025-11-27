import { StyleSheet, View } from 'react-native';
import { Appbar, Avatar, Button, Divider, List, Text, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchShift } from '@/src/queries/query-shift';
import { fetchEvents } from '@/src/queries/query-event';
import { UserContext } from '../../_layout';
import React from 'react';
import { createShiftVolunteer, fetchShiftVolunteer, updateShiftVolunteer } from '@/src/queries/query-shift-volunteer';
import { formatDateTimeInterval } from '@/src/utilities/date-formatting';
import ShiftStateSection from '@/src/components/volunteer/shift-state-section';
import { InsertShiftVolunteer, ShiftVolunteer } from '@shared/db/schema-types';
import { GlobalSnackbarContext } from '@/src/components/global-snackbar';
import { isEntirelyBeforeToday, isSometimeToday } from '@/src/utilities/period-filters';

export default function ShiftViewScreen() {
  const queryClient = useQueryClient();
  const { user } = React.useContext(UserContext);
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ shiftId: string }>();
  const { setSnackbarMessage } = React.useContext(GlobalSnackbarContext);

  const shiftId = parseInt(params.shiftId);

  const shiftQuery = useQuery({
    queryKey: ['shift', shiftId],
    queryFn: () => fetchShift(shiftId),
    staleTime: 60 * 1000
  });

  const shift = shiftQuery.data;

  const volunteersNeeded = shift ? Math.max(shift.numOpenings - shift.numApproved, 0) : 0;

  const shiftVolunteerQuery = useQuery({
    queryKey: ['shiftVolunteer', shiftId],
    queryFn: () => fetchShiftVolunteer({ shiftId, userId: user?.id! }),
    staleTime: 60 * 1000
  });

  const shiftVolunteer = shiftVolunteerQuery.data;

  const eventsQuery = useQuery({
    queryKey: ['events', shiftId],
    queryFn: () => fetchEvents(shiftId),
    staleTime: 60 * 1000
  });

  const events = eventsQuery.data?.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()) || [];

  const shiftVolunteerMutation = useMutation({
    mutationFn: ({sv, type}: {sv: InsertShiftVolunteer, type: 'create' | 'update'}) => {
      if (type === 'create') {
        return createShiftVolunteer(sv.shiftId, sv.userId, sv.formJson);
      }
      else {
        return updateShiftVolunteer(sv.shiftId, sv.userId, sv);
      }
    },
    onSuccess: (_: ShiftVolunteer) => {
      queryClient.invalidateQueries({ queryKey: ['shiftVolunteer', shiftId] });
      setSnackbarMessage('Shift volunteer saved');
      router.back();
    },
    onError: () => {
      setSnackbarMessage('Error: Could not save activity.');
    }
  });

  const hasShiftToday = shiftVolunteer && shiftVolunteer.isApproved
    && events.some(event => isSometimeToday(event.startTime, event.endTime));

  const hasNoMoreEvents = events.every(event => isEntirelyBeforeToday(event.endTime));

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={router.back} />
        <Appbar.Content title='Shift' />
      </Appbar.Header>
      {/* {shiftVolunteer?.isApproved && hasShiftToday &&(
        <>
          <View style={styles.scanWrapper}>
            <Button onPress={() => router.navigate({ pathname: `/volunteer/shift/check-in-cam`, params: { shiftId: params.shiftId } })} icon='qrcode-scan' mode='contained'>Check In/Out</Button>
            <Text style={styles.scanText} variant='bodyMedium'>To check in or out, scan the QR Code on the organizer's device.</Text>
          </View>
          <Divider style={styles.divider} />
        </>
      )} */}
      <ScrollView>
        <View style={styles.header}>
          <Avatar.Icon size={80} icon='account' style={{...styles.title, backgroundColor: theme.colors.tertiaryContainer}} />
          <Text variant='titleMedium' style={styles.title}>{shift?.orgName}</Text>
          <Text variant='titleLarge' style={styles.title}>{shift?.name}</Text>
          <Text variant='bodyMedium' style={styles.title}>{ volunteersNeeded } Volunteers Needed</Text>
        </View>
        <View style={styles.body}>
          {shift && <>
            <Text variant='bodyLarge' style={styles.title}>{ shift?.activityName }</Text>
            <Text variant='bodyMedium' style={styles.title}>{ shift?.location }</Text>
            <Divider style={styles.divider} />
            <Text variant='bodyMedium' style={styles.text}>{formatDateTimeInterval(shift.startTime, shift.endTime)}</Text>
            <Divider style={styles.divider} />
            { shift.description && shift.description !== '' && (
              <>
                <Text variant='bodyMedium' style={styles.text}>{ shift?.description }</Text>
                <Divider style={styles.divider} />
              </>
            ) }
          </>}
          <List.Section>
            { events.map(event => (
              <List.Item
                key={event.eventId}
                title={formatDateTimeInterval(event.startTime, event.endTime)}
                description={event.location ? `${event.location}` : ''}
                left={() => <List.Icon icon='calendar' />}
              />
            ))}
          </List.Section>
          <View style={styles.footer}>
            {!hasNoMoreEvents && (
              <ShiftStateSection
                shiftVolunteerQuery={shiftVolunteerQuery}
                onSignUpPress={() => shiftVolunteerMutation.mutate({sv: { shiftId, userId: user?.id! }, type: 'create'})}
                onCancelPress={() => {}}
                onWithdrawPress={() => {}}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8
  },
  scanWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8
  },
  scanText: {
    marginTop: 8,
    marginBottom: 4,
    width: '80%',
    textAlign: 'center'
  },
  body: {
    marginHorizontal: 16,
  },
  callout: {
    marginVertical: 10
  },
  title: {
    marginTop: 6,
    marginBottom: 4
  },
  text: {
    marginVertical: 3
  },
  divider: {
    marginVertical: 8
  },
  footer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 24
  }
});
