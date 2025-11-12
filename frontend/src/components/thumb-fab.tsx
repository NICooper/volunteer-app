import { StyleSheet } from 'react-native';
import { FAB, FABProps } from 'react-native-paper';

export default function ThumbFAB(props: FABProps & { pageHasNavBar?: boolean }) {
  return (
    <FAB
      style={{...styles.fab, marginBottom: props.pageHasNavBar ? 16 : 80}}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    marginRight: 16,
    right: 0,
    bottom: 0,
  },
});
