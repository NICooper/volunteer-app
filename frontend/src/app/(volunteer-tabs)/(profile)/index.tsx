import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Button, Text, useTheme } from 'react-native-paper';
import { UserContext } from '../../_layout';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchUserAccount } from '@/src/queries/query-account';
import { fetchVolunteersEvents } from '@/src/queries/query-event';
import { startOfToday } from 'date-fns';
import { isEntirelyAfterToday, isSometimeToday } from '@/src/utilities/period-filters';
import ListAccordion from '@/src/components/list-accordion';
import EventCard from '@/src/components/volunteer/event-card';
import { ScrollView } from 'react-native-gesture-handler';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser } = React.useContext(UserContext);
  const theme = useTheme();

  const profile = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchUserAccount(user?.id!),
    staleTime: 60 * 1000
  });

  const account = profile.data;

  const eventsQuery = useQuery({
    queryKey: ['events', user?.id],
    queryFn: () => fetchVolunteersEvents({ userId: user?.id!, from: startOfToday() }),
    staleTime: 60 * 1000
  });

  const events = eventsQuery.data || [];

  const todayEvents = events.filter(event => isSometimeToday(event.startTime, event.endTime));
  const upcomingEvents = events.filter(event => !isSometimeToday(event.startTime, event.endTime) && isEntirelyAfterToday(event.startTime));

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={account?.username || 'Profile'} />
        <Appbar.Action icon='pencil-outline'
          // onPress={() => router.navigate({ pathname: '/volunteer/profile/edit' })}
        />
      </Appbar.Header>
      <ScrollView>
        {todayEvents.length === 0
          ? <Text style={styles.emptyText}>You have no shifts today.</Text>
          : (
            <>
              <Text style={{ marginTop: 16, marginBottom: 12, marginLeft: 16, fontSize: 18, fontWeight: 'bold' }}>Today's Shifts</Text>
              {todayEvents.map((e) => (
                <EventCard key={e.eventId} event={e} onPress={() => router.push({pathname: '/volunteer/shift/view', params: { shiftId: e.shiftId }})} />
              ))}
            </>
          )
        }
        { upcomingEvents.length > 0 &&
          <ListAccordion title='Upcoming Shifts' expanded={true} style={styles.list}>
            { upcomingEvents.map((e) => (
              <EventCard key={e.eventId} event={e} onPress={() => router.push({pathname: '/volunteer/shift/view', params: { shiftId: e.shiftId }})} />
            ))}
          </ListAccordion>
        }
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
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {

  },
  emptyText: {
    paddingHorizontal: 28,
    paddingTop: 6,
    paddingBottom: 28,
  },
  logoutButtonContainer: {
    alignItems: 'center',
    marginTop: 20
  }
});
