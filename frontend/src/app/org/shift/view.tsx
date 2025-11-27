import { StyleSheet, View } from 'react-native';
import { Appbar, Button, Divider, List, Text } from 'react-native-paper';
import ListAccordion from '@/src/components/list-accordion';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { useQuery } from '@tanstack/react-query';
import { fetchShift } from '@/src/queries/query-shift';
import { format, isSameDay, isToday } from 'date-fns';
import { fetchShiftVolunteers } from '@/src/queries/query-shift-volunteer';
import VolunteerCard from '@/src/components/org/volunteer-card';
import { fetchEvents } from '@/src/queries/query-event';
import { UserContext } from '../../_layout';
import React from 'react';
import { Event } from '@shared/db/schema-types';
import { isSometimeToday } from '@/src/utilities/period-filters';
import { formatDateTimeInterval } from '@/src/utilities/date-formatting';

export default function ShiftViewScreen() {
  const { user } = React.useContext(UserContext);
  const router = useRouter();
  const params = useLocalSearchParams<{ shiftId: string }>();

  const shiftId = parseInt(params.shiftId);

  const shiftQuery = useQuery({
    queryKey: ['shift', shiftId],
    queryFn: () => fetchShift(shiftId),
    staleTime: 60 * 1000
  });

  const shift = shiftQuery.data;

  const shiftVolunteersQuery = useQuery({
    queryKey: ['shiftVolunteers', shiftId],
    queryFn: () => fetchShiftVolunteers({ shiftId, orgId: user?.id! }),
    staleTime: 60 * 1000
  });

  const shiftVolunteers = shiftVolunteersQuery.data || [];

  const eventsQuery = useQuery({
    queryKey: ['events', shiftId],
    queryFn: () => fetchEvents(shiftId),
    staleTime: 60 * 1000
  });

  const events = eventsQuery.data?.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()) || [];
  const firstEvent = events.length > 0 ? events[0] : undefined;
  let lastEvent = events.length > 0 ? events[events.length - 1] : undefined;
  if (firstEvent && lastEvent && isSameDay(firstEvent.startTime, lastEvent.endTime)) {
    lastEvent = undefined;
  }

  const todayEvents = events.filter(event => isSometimeToday(event.startTime, event.endTime));

  const approvedShiftVolunteers = shiftVolunteers.filter(sv => sv.isApproved);
  const pendingShiftVolunteers = shiftVolunteers.filter(sv => !sv.isApproved);

  const now = new Date();

  // const eventsToday = events.filter(event => isToday(event.startTime) || isToday(event.endTime));
  // let currentEvent: Event | undefined;
  // if (eventsToday.length === 1) {
  //   currentEvent = eventsToday[0];
  // } else if (eventsToday.length > 1) {
  //   currentEvent = events.find;
  // }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={router.back} />
        <Appbar.Content title={shift ? shift.name : 'Shift'} />
        { shift &&
          <Appbar.Action icon='pencil-outline' onPress={() => router.navigate({ pathname: '/org/shift/edit', params: { shiftId, activityId: shift.activityId } })} />
        }
      </Appbar.Header>
      <ScrollView>
        {todayEvents.length > 0 && todayEvents.map(event => (
          <View key={event.eventId} style={styles.header}>
            <Text variant='titleMedium' style={styles.title}>{formatDateTimeInterval(event.startTime, event.endTime)}</Text>
            <View style={styles.buttonContainer}>
              <Button mode='contained' onPress={() => router.navigate(`/org/shift/check-in-qr?action=checkin&shiftId=${shiftId}&eventId=${event.eventId}`)}>Check In</Button>
              <Button mode='contained' onPress={() => router.navigate(`/org/shift/check-in-qr?action=checkout&shiftId=${shiftId}&eventId=${event.eventId}`)}>Check Out</Button>
            </View>
            <Divider style={styles.divider} />
          </View>
        ))}
        {/* <View style={styles.body}>
          
        </View> */}
        { approvedShiftVolunteers.length > 0 &&
          <ListAccordion title={`Approved Volunteers: ${approvedShiftVolunteers.length}`} enabled={pendingShiftVolunteers.length === 0}>
            <View style={styles.cardWrapper}>
              { approvedShiftVolunteers.map(sv => (
                <VolunteerCard key={sv.userId} shiftVolunteer={sv} onPress={() => {}} />
              ))}
            </View>
          </ListAccordion>
        }
        { pendingShiftVolunteers.length > 0 &&
          <ListAccordion title={`Pending Volunteers: ${pendingShiftVolunteers.length}`} enabled={true}>
            { pendingShiftVolunteers.map(sv => (
              <VolunteerCard key={sv.userId} shiftVolunteer={sv} onPress={() => {}} />
            ))}
          </ListAccordion>
        }
        <View style={styles.body}>
          {shift && <>
            {/* <Text variant='titleLarge' style={styles.title}>{ shift.name }</Text> */}
            <Text variant='titleMedium' style={styles.callout}>Volunteers needed: {shift?.numOpenings}</Text>
            <Divider style={styles.divider} />
            { firstEvent &&
              <Text variant='bodyMedium' style={styles.text}>{format(firstEvent.startTime, 'PP') + `${lastEvent ? ' - ' + format(lastEvent.endTime, 'PP') : ''}` }</Text>
            }
            { shift.description && (<>
              <Divider style={styles.divider} />
              <Text variant='bodyMedium' style={styles.text}>{ shift?.description }</Text>
            </>)}
          </>}
          <Divider style={styles.divider} />
          <List.Section>
            { events.map(event => (
              <List.Item
                key={event.eventId}
                title={
                  isSameDay(event.startTime, event.endTime)
                  ? format(event.startTime, 'PP') + ', ' + format(event.startTime, 'p') + ' - ' + format(event.endTime, 'p')
                  : format(event.startTime, 'PPp') + ' - ' + format(event.endTime, 'PPp')}
                description={event.location ? `${event.location}` : ''}
                left={() => <List.Icon icon='calendar' />}
              />
            ))}
          </List.Section>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16
  },
  body: {
    width: '100%',
    marginHorizontal: 16,
  },
  cardWrapper: {
    marginHorizontal: 16,
  },
  callout: {
    marginVertical: 10
  },
  title: {
    marginTop: 8,
    marginBottom: 4
  },
  text: {
    marginVertical: 3
  },
  divider: {
    marginVertical: 8
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 12
  }
});
