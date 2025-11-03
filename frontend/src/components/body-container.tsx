import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'

export default function BodyContainer({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
