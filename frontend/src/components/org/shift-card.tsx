import { StyleSheet, View } from 'react-native';
import { Card, Text} from 'react-native-paper';


export default function ShiftCard({ props }: { props: any }) {
  return (
    <Card mode='outlined' style={styles.card}>
      <Card.Title
        title={props.shiftName}
        subtitle={props.activityName}
        titleVariant='titleMedium'
        subtitleVariant='bodyMedium'
      />
      <Card.Content style={styles.content}>
        <View style={styles.bodyLeft}>
          <Text variant='bodyMedium'>{props.locationName}</Text>
          <Text variant='bodyMedium'>{props.startDate}</Text>
          <Text variant='bodyMedium'>{`${props.startTime} - ${props.endTime}`}</Text>
        </View>
        <View style={styles.bodyRight}>
          <Text variant='bodyMedium' style={styles.bodyRightText}>Approved: {props.volunteersApprovedCount}</Text>
          <Text variant='bodyMedium' style={styles.bodyRightText}>Remaining: {props.volunteersRemainingCount}</Text>
          <Text variant='bodyMedium' style={styles.bodyRightText}>Pending: {props.volunteersPendingCount}</Text>
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
