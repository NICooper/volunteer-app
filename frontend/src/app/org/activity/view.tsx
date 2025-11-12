import { StyleSheet, View } from 'react-native';
import { Appbar, Divider, Text } from 'react-native-paper';
import ListAccordion from '@/src/components/list-accordion';
import ShiftCard from '@/src/components/org/shift-card';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { Activity } from '@shared/db/schema-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchActivity } from '@/src/queries/query-activity';
import { fetchFullShifts } from '@/src/queries/query-shift';
import { format } from 'date-fns';
import { isEntirelyAfterToday, isEntirelyBeforeToday } from '@/src/utilities/period-filters';
import ThumbFAB from '@/src/components/thumb-fab';

export default function ActivityViewScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useLocalSearchParams<{ activityId: string }>();

  const activityId = parseInt(params.activityId);

  const activityQuery = useQuery({
    queryKey: ['activity', activityId],
    queryFn: () => fetchActivity(activityId),
    staleTime: 60 * 1000,
    initialData: () => {
      return queryClient.getQueryData<Activity[]>(['activities'])?.find(a => a.activityId === activityId);
    }
  });

  const activity = activityQuery.data;

  const shiftsQuery = useQuery({
    queryKey: ['activityShifts', activityId],
    queryFn: () => fetchFullShifts({ activityId }),
    staleTime: 60 * 1000
  });

  const shifts = shiftsQuery.data || [];

  const todayShifts = shifts.filter(shift => 
    !isEntirelyAfterToday(shift.startTime) && !isEntirelyBeforeToday(shift.endTime)
  );

  const upcomingShifts = shifts.filter(shift => isEntirelyAfterToday(shift.startTime));

  const pastShifts = shifts.filter(shift => isEntirelyBeforeToday(shift.endTime));

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={router.back} />
        <Appbar.Content title='Activity' />
        <Appbar.Action icon='pencil-outline' onPress={() => router.navigate({ pathname: '/org/activity/edit', params: { activityId } })} />
      </Appbar.Header>
      <ScrollView>
        <View style={styles.body}>
          {activity && <>
            <Text variant='titleLarge' style={styles.title}>{ activity.name }</Text>
            { activity.startTime && <Text style={styles.text}>From { format(activity.startTime, 'PP') }</Text> }
            { activity.endTime && <Text style={styles.text}>To { format(activity.endTime, 'PP') }</Text> }
            <Divider style={styles.divider} />
            <Text variant='bodyMedium' style={styles.text}>{ activity?.description }</Text>
          </>}
        </View>
        {todayShifts.length > 0 && <ListAccordion title="Today's Shifts" expanded={true}>
          {todayShifts.map(shift => (
            <ShiftCard key={shift.shiftId} shift={shift} onPress={() => router.push({pathname: '/org/shift/view', params: { shiftId: shift.shiftId }})} />
          ))}
        </ListAccordion>}
        {upcomingShifts.length > 0 && <ListAccordion title="Upcoming Shifts" expanded={true}>
          {upcomingShifts.map(shift => (
            <ShiftCard key={shift.shiftId} shift={shift} onPress={() => router.push({pathname: '/org/shift/view', params: { shiftId: shift.shiftId }})} />
          ))}
        </ListAccordion>}
        {pastShifts.length > 0 && <ListAccordion title="Past Shifts">
          {pastShifts.map(shift => (
            <ShiftCard key={shift.shiftId} shift={shift} onPress={() => router.push({pathname: '/org/shift/view', params: { shiftId: shift.shiftId }})} />
          ))}
        </ListAccordion>}
      </ScrollView>
      <ThumbFAB icon='plus' label='Create Shift' onPress={() => router.navigate({ pathname: '/org/shift/edit' })} />
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    width: '100%',
    marginHorizontal: 16,
    paddingBottom: 16
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
  }

});
