import ShiftCard from '@/src/components/volunteer/shift-card';
import { ScrollView, StyleSheet } from 'react-native';
import { List, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { fetchFullShifts } from '@/src/queries/query-shift';
import { isEntirelyAfterToday, isEntirelyBeforeToday } from '@/src/utilities/period-filters';
import { UserContext } from '../../_layout';
import React from 'react';
import { DatePickerInput } from 'react-native-paper-dates';

export default function ShiftsScreen() {
  const { user } = React.useContext(UserContext);
  const insets = useSafeAreaInsets();

  const { data } = useQuery({
    queryKey: ['shifts'],
    queryFn: () => fetchFullShifts({}),
    staleTime: 60 * 1000
  });

  const shifts = data || [];

  return (
    <ScrollView style={{ paddingTop: insets.top }}>
      {/* <DatePickerInput
        locale='en'
        label='Select date'
        mode='outlined'
        validRange={{startDate: new Date()}}
        value={}

      /> */}
      <List.Section style={styles.list}>
        { shifts.length === 0
          ? <Text style={styles.emptyText}>No shifts found.</Text>
          : shifts.map((s) => (
            <ShiftCard key={s.shiftId} shift={s} onPress={() => router.push({pathname: '/volunteer/shift/view', params: { shiftId: s.shiftId }})} />
          ))}
      </List.Section>
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
