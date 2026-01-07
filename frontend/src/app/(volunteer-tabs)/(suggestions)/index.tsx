import ThumbFAB from '@/src/components/thumb-fab';
import ActivityCard from '@/src/components/org/activity-card';
import { StyleSheet, View } from 'react-native';
import { List, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from '@/src/queries/query-activity';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { isEntirelyBeforeToday } from '@/src/utilities/period-filters';
import { UserContext } from '../../_layout';
import React from 'react';

export default function ActivitiesScreen() {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const insets = useSafeAreaInsets();

  const { data } = useQuery({
    queryKey: ['activities'],
    queryFn: () => fetchActivities(user?.id!),
    staleTime: 60 * 1000
  });

  const activities = data || [];

  const currentActivities = activities.filter(a => !a.endTime || !isEntirelyBeforeToday(a.endTime));
  const pastActivities = activities.filter(a => a.endTime && isEntirelyBeforeToday(a.endTime));

  return (
    <>
      <ScrollView style={{ paddingTop: insets.top }}>
        
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16
  }
});
