import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

export function PaperAppBar({ title, actionOnPress, actionText, actionIcon }: PaperAppBarProps) {
  const router = useRouter();

  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={router.back} />
      <Appbar.Content title={title} />
      { actionText && <View style={styles.actionTextContainer}><Text onPress={ actionOnPress } >{ actionText }</Text></View> }
      { actionIcon && <Appbar.Action icon={ actionIcon } onPress={ actionOnPress } /> }
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  actionTextContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    marginRight: 12,
  }
});

type PaperAppBarProps = {
  title: string;
  actionIcon: string;
  actionText?: undefined;
  actionOnPress: () => void;
} | {
  title: string;
  actionIcon?: undefined;
  actionText: string;
  actionOnPress: () => void;
};
