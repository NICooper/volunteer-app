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
import VolunteerCard from '@/src/components/org/volunteer-card';
import { fetchVolunteers } from '@/src/queries/query-volunteer';

export default function VolunteersScreen() {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const insets = useSafeAreaInsets();

  const { data } = useQuery({
    queryKey: ['volunteers'],
    queryFn: () => fetchVolunteers({ orgId: user?.id! }),
    staleTime: 60 * 1000
  });

  const volunteers = data || [];

  return (
    <>
      <ScrollView style={{ paddingTop: insets.top }}>
        <List.Section>
          {/* <List.Subheader>
            <Text variant='titleLarge'>Volunteers</Text>
          </List.Subheader> */}
          <View style={styles.listContainer}>
            { volunteers.map((v) => (
                <VolunteerCard key={v.userId} shiftVolunteer={v} onPress={() => {}} />
              ))}
          </View>
        </List.Section>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16
  }
});
