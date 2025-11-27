import { format } from 'date-fns';
import React, { use, useCallback } from 'react';
import { FocusEvent, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { DatePickerModal, DatePickerModalSingleProps } from 'react-native-paper-dates';

export default function SingleDatePickerInput(props: {
  value?: Date,
  onChange: (date?: Date) => void,
  textInputProps: React.ComponentProps<typeof TextInput>,
  datePickerProps: Omit<DatePickerModalSingleProps, 'mode' | 'visible' | 'onDismiss' | 'onConfirm' | 'date'>
}) {
  const [visible, setVisible] = React.useState(false);

  return (
    <View>
      <TextInput
        value={props.value ? format(props.value, 'PP') : ''}
        mode='outlined'
        showSoftInputOnFocus={false}
        onFocus={(e: FocusEvent) => {
          setVisible(true);
          e.currentTarget.blur();
        }}
        right={<TextInput.Icon icon="calendar-outline" />}
        {...props.textInputProps}
      />
      <DatePickerModal
        mode='single'
        visible={visible}
        onDismiss={() => {
          props.onChange(props.value);
          setVisible(false);
        }}
        onConfirm={({ date: newDate }) => {
          props.onChange(newDate);
          setVisible(false);
        }}
        date={props.value}
        {...props.datePickerProps}
      />
    </View>
  );
}
