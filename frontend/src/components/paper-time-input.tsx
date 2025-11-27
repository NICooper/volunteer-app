import { format, getHours, getMinutes, set, startOfToday } from 'date-fns';
import React from 'react';
import { FocusEvent, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';

export default function TimePickerInput(props: {
  value?: Time,
  onChange: (time?: Time) => void,
  textInputProps: React.ComponentProps<typeof TextInput>,
  timePickerProps: Omit<React.ComponentProps<typeof TimePickerModal>, 'onDismiss' | 'onConfirm' | 'visible' | 'hours' | 'minutes'>
}) {
  const [visible, setVisible] = React.useState(false);

  return (
    <View>
      <TextInput
        value={props.value ? format(set(startOfToday(), props.value), 'p') : ''}
        mode='outlined'
        showSoftInputOnFocus={false}
        onFocus={(e: FocusEvent) => {
          setVisible(true);
          e.currentTarget.blur();
        }}
        right={<TextInput.Icon icon="clock-outline" />}
        {...props.textInputProps}
      />
      <TimePickerModal
        visible={visible}
        onDismiss={() => {
          props.onChange(props.value);
          setVisible(false);
        }}
        onConfirm={({ hours, minutes }: Time) => {
          props.onChange({ hours, minutes });
          setVisible(false);
        }}
        hours={ props.value ? props.value.hours : 0 }
        minutes={ props.value ? props.value.minutes : 0 }
        {...props.timePickerProps}
      />
    </View>
  );
}

export type Time = {
  hours: number;
  minutes: number;
}
