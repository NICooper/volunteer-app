import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Avatar, Card} from 'react-native-paper';


export default function VolunteerCard({ props }: { props: any }) {
  return (
    <Card mode='outlined' style={styles.card}>
      <Card.Title
        title={props.name}
        subtitle={`Shifts: ${props.shiftCount}`}
        titleVariant='titleMedium'
        style={styles.content}
        subtitleVariant='bodySmall'
        left={() => <Avatar.Text label={props.name.charAt(0)} size={48} />}
        right={() => <MaterialCommunityIcons name="play" size={16} style={styles.arrow} />}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    marginHorizontal: 16
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
