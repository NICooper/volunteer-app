import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ShiftVolunteerGeneral } from '@shared/db/schema-types';
import { StyleSheet } from 'react-native';
import { Avatar, Card} from 'react-native-paper';


export default function VolunteerCard({ shiftVolunteer, onPress }: { shiftVolunteer: ShiftVolunteerGeneral, onPress: () => void }) {
  return (
    <Card mode='outlined' style={styles.card} onPress={onPress}>
      <Card.Title
        title={shiftVolunteer.username}
        subtitle={`Shifts: ${shiftVolunteer.numShiftsAtOrg}`}
        titleVariant='titleMedium'
        style={styles.content}
        subtitleVariant='bodySmall'
        left={() => <Avatar.Text label={shiftVolunteer.username.charAt(0).toLocaleUpperCase()} size={48} />}
        right={() => <MaterialCommunityIcons name='play' size={16} style={styles.arrow} />}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    marginHorizontal: 0
  },
  content: {
    marginVertical: 4
  },
  title: {

  },
  subtitle: {

  },
  arrow: {
    marginRight: 8
  }
});
