import ShiftCard from '@/src/components/org/shift-card';
import { ScrollView, StyleSheet } from 'react-native';
import ListAccordion from '@/src/components/list-accordion';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { fetchFullShifts } from '@/src/queries/query-shift';
import { isEntirelyAfterToday, isEntirelyBeforeToday } from '@/src/utilities/period-filters';

export default function ShiftsScreen() {
  const insets = useSafeAreaInsets();

  const { data } = useQuery({
    queryKey: ['shifts'],
    queryFn: () => fetchFullShifts({ orgId: 1}), // TODO
    staleTime: 60 * 1000
  });

  const shifts = data || [];

  const todayShifts = shifts.filter(shift => 
    !isEntirelyAfterToday(shift.startTime) && !isEntirelyBeforeToday(shift.endTime)
  );

  const upcomingShifts = shifts.filter(shift => isEntirelyAfterToday(shift.startTime));

  const pastShifts = shifts.filter(shift => isEntirelyBeforeToday(shift.endTime));


  return (
    <ScrollView style={{ paddingTop: insets.top }}>
      <ListAccordion title="Today's Shifts" expanded={true} style={styles.list}>
        { todayShifts.length === 0
          ? <Text style={styles.emptyText}>There are no shifts today.</Text>
          : todayShifts.map((s) => (
            <ShiftCard key={s.shiftId} shift={s} onPress={() => router.push({pathname: '/org/shift/view', params: { shiftId: s.shiftId }})} />
          ))}
      </ListAccordion>
      { upcomingShifts.length > 0 &&
        <ListAccordion title='Upcoming Shifts' expanded={true} style={styles.list}>
          { upcomingShifts.map((s) => (
            <ShiftCard key={s.shiftId} shift={s} onPress={() => router.push({pathname: '/org/shift/view', params: { shiftId: s.shiftId }})} />
          ))}
        </ListAccordion>
      }
      { pastShifts.length > 0 &&
        <ListAccordion title='Past Shifts' style={styles.list}>
          { pastShifts.map((s) => (
            <ShiftCard key={s.shiftId} shift={s} onPress={() => router.push({pathname: '/org/shift/view', params: { shiftId: s.shiftId }})} />
          ))}
        </ListAccordion>
      }
    </ScrollView>
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
    padding: 16
  }
});
