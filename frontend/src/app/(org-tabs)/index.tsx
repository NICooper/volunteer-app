import BodyContainer from '@/src/components/body-container';
import CreateFAB from '@/src/components/create-fab';
import ActivityCard from '@/src/components/org/activity-card';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { List, Text } from 'react-native-paper';
import { Activity } from '@shared/db/schema-types';

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('http://localhost:3000/activities/1');
        const data = await response.json();
        setActivities(data);

      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <>
      <BodyContainer>
        <List.Section style={styles.list}>
          <List.Subheader>
            <Text variant='titleLarge'>Current Activities</Text>
          </List.Subheader>
          {!activities ? <Text>You don&apos;t have any current activities.</Text>
          : activities.map((a) => (
            <ActivityCard key={a.activityId} props={{ title: a.name, startDate: a.startTime, endDate: a.endTime }} />
          ))}
        </List.Section>
        <List.Section>
          <List.Subheader>
            <Text variant='titleLarge'>Past Activities</Text>
          </List.Subheader>
          <ActivityCard props={{ title: "First Item", startDate: "2023-01-01", endDate: "2023-01-02" }} />
          <ActivityCard props={{ title: "Second Item", startDate: "2023-01-01", endDate: "2023-01-02" }} />
        </List.Section>
      </BodyContainer>
      <CreateFAB />
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

  }
});
