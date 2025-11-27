import { isSometimeToday } from '@/src/utilities/period-filters';
import { VolunteerEventInfo } from '@shared/db/schema-types';
import { format } from 'date-fns/format';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Text} from 'react-native-paper';

export default function EventCard({ event, onPress }: { event: VolunteerEventInfo, onPress: () => void }) {
  const router = useRouter();

  return (
    <Card mode='outlined' style={styles.card} onPress={onPress}>
      <Card.Title
        title={event.name}
        subtitle={event.orgName}
        titleVariant='titleMedium'
        subtitleVariant='bodyMedium'
        left={() => <Avatar.Text label={event.name.charAt(0).toLocaleUpperCase()} size={48} />}
      />
      <Card.Content style={styles.content}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <View style={styles.bodyLeft}>
            <Text variant='bodySmall'>{event.location}</Text>
            <Text variant='bodySmall'>{format(event.startTime, 'PP')}</Text>
            <Text variant='bodySmall'>{`${format(event.startTime, 'p')} - ${format(event.endTime, 'p')}`}</Text>
          </View>
          <View style={styles.bodyRight}>
            {event.checkedInAt && (
              <Text variant='bodySmall' style={styles.bodyRightText}>Checked In: {format(event.checkedInAt, 'p')}</Text>
            )}
            {event.checkedOutAt && (
              <Text variant='bodySmall' style={styles.bodyRightText}>Checked Out: {format(event.checkedOutAt, 'p')}</Text>
            )}
          </View>
        </View>
        <View style={styles.bottomRight}>
          {(!event.checkedInAt || !event.checkedOutAt) && 
            isSometimeToday(event.startTime, event.endTime) && (
             <Button
              mode='contained'
              icon='qrcode-scan'
              onPress={() => router.navigate('/volunteer/shift/check-in-cam')}
            >
              Scan to check in/out
            </Button>
          )}
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
  },
  bottomRight: {
    alignItems: 'flex-end'
  }
});
