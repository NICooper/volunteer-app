import { ShiftOverview } from '@shared/db/schema-types';
import { format } from 'date-fns/format';
import { StyleSheet, View } from 'react-native';
import { Card, Text} from 'react-native-paper';


export default function ShiftCard({ shift, onPress }: { shift: ShiftOverview, onPress: () => void }) {
  return (
    <Card mode='outlined' style={styles.card} onPress={onPress}>
      <Card.Title
        title={shift.name}
        subtitle={shift.activityName}
        titleVariant='titleMedium'
        subtitleVariant='bodyMedium'
      />
      <Card.Content style={styles.content}>
        <View style={styles.bodyLeft}>
          <Text variant='bodySmall'>{shift.location}</Text>
          <Text variant='bodySmall'>{format(shift.startTime, 'PP')}</Text>
          <Text variant='bodySmall'>{`${format(shift.startTime, 'p')} - ${format(shift.endTime, 'p')}`}</Text>
        </View>
        <View style={styles.bodyRight}>
          <Text variant='bodySmall' style={styles.bodyRightText}>Approved: {shift.numApproved}</Text>
          <Text variant='bodySmall' style={styles.bodyRightText}>Remaining: {Math.max(shift.numOpenings - shift.numApproved, 0)}</Text>
          <Text variant='bodySmall' style={styles.bodyRightText}>Pending: {shift.numPending}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    marginHorizontal: 16
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {

  },
  subtitle: {

  },
  bodyLeft: {
    // marginRight: 8
  },
  bodyRight: {
    
  },
  bodyRightText: {
    textAlign: 'right'
  }
});
