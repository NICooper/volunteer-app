import BodyContainer from '@/src/components/body-container';
import { List, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import VolunteerCard from '@/src/components/org/volunteer-card';

export default function VolunteersScreen() {
  return (
    <BodyContainer>
      <List.Section style={styles.list}>
        <List.Subheader>
          <Text variant='titleLarge'>Current Activities</Text>
        </List.Subheader>
        <VolunteerCard props={{ name: "John Doe", shiftCount: 3 }} />
        <VolunteerCard props={{ name: "Jane Smith", shiftCount: 5 }} />
      </List.Section>
      <List.Section>
        <List.Subheader>
          <Text variant='titleLarge'>Past Activities</Text>
        </List.Subheader>
        <VolunteerCard props={{ name: "John Doe", shiftCount: 3 }} />
        <VolunteerCard props={{ name: "Jane Smith", shiftCount: 5 }} />
      </List.Section>
    </BodyContainer>
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
