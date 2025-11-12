import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Activity } from '@shared/db/schema-types';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { format } from 'date-fns';

export default function ActivityCard(
  { activity, onPress }: { activity: Activity, onPress: () => void }
) {
  let datesString;
  if (activity.startTime) {
    datesString = 'From ' + format(activity.startTime, 'PP');
    
    if (activity.endTime) {
      datesString += '\n' + 'To ' + format(activity.endTime, 'PP');
    }
  }

  return (
    <Card mode='outlined' style={styles.card} onPress={onPress}>
      <Card.Title
        title={activity.name}
        subtitle={datesString}
        subtitleNumberOfLines={2}
        titleVariant='titleMedium'
        style={styles.content}
        subtitleVariant='bodySmall'
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
    marginVertical: 8
  },
  title: {

  },
  subtitle: {

  },
  arrow: {
    marginRight: 8
  }
});
