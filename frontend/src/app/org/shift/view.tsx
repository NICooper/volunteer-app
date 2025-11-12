import { StyleSheet, View } from 'react-native';
import { Appbar, Divider, Text } from 'react-native-paper';
import ListAccordion from '@/src/components/list-accordion';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchShift } from '@/src/queries/query-shift';
import { Shift } from '@shared/db/schema-types';
import { format } from 'date-fns';
import { fetchShiftVolunteers } from '@/src/queries/query-shift-volunteer';
import VolunteerCard from '@/src/components/org/volunteer-card';

export default function ShiftViewScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useLocalSearchParams<{ shiftId: string }>();

  const shiftId = parseInt(params.shiftId);

  const shiftQuery = useQuery({
    queryKey: ['shift', shiftId],
    queryFn: () => fetchShift(shiftId),
    staleTime: 60 * 1000,
    initialData: () => {
      return queryClient.getQueryData<Shift[]>(['shifts'])?.find(s => s.shiftId === shiftId);
    }
  });

  const shift = shiftQuery.data;

  const shiftVolunteersQuery = useQuery({
    queryKey: ['shiftVolunteers', shiftId],
    queryFn: () => fetchShiftVolunteers({ shiftId: shiftId, orgId: 1 }), // TODO
    staleTime: 60 * 1000
  });

  const shiftVolunteers = shiftVolunteersQuery.data || [];

  const approvedShiftVolunteers = shiftVolunteers.filter(sv => sv.isApproved);
  const pendingShiftVolunteers = shiftVolunteers.filter(sv => !sv.isApproved);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={router.back} />
        <Appbar.Content title='Shift' />
        <Appbar.Action icon='pencil-outline' onPress={() => router.navigate({ pathname: '/org/shift/edit', params: { shiftId } })} />
      </Appbar.Header>
      <ScrollView>
        <View style={styles.body}>
          <Text variant='titleMedium' style={styles.callout}>Volunteers needed: {shift?.numOpenings}</Text>
        </View>
          { approvedShiftVolunteers.length > 0 &&
            <ListAccordion title={`Approved Volunteers: ${approvedShiftVolunteers.length}`} enabled={pendingShiftVolunteers.length === 0}>
              { approvedShiftVolunteers.map(sv => (
                <VolunteerCard key={sv.userId} shiftVolunteer={sv} onPress={() => {}} />
              ))}
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
            <Text variant='titleLarge' style={styles.title}>{ shift.name }</Text>
            <Divider style={styles.divider} />
            {/* { shift.startTime && <Text variant='bodyMedium' style={styles.text}>From { format(shift.startTime, 'PPp') }</Text> }
            { shift.endTime && <Text variant='bodyMedium' style={styles.text}>To { format(shift.endTime, 'PPp') }</Text> }
            <Divider style={styles.divider} /> */}
            <Text variant='bodyMedium' style={styles.text}>{ shift?.description }</Text>
          </>}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    width: '100%',
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
  }
});
