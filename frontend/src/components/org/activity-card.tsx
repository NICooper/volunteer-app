import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';


export default function ActivityCard({ props }: { props: any }) {
  return (
    <Card mode='outlined' style={styles.card}>
      <Card.Title
        title={props.title}
        subtitle={props.startDate + '\n' + props.endDate}
        subtitleNumberOfLines={2}
        titleVariant='titleMedium'
        style={styles.content}
        subtitleVariant='bodySmall'
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
