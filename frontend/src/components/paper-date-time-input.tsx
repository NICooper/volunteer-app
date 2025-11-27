import { View, StyleSheet } from 'react-native';
import SingleDatePickerInput from './paper-single-date-input';
import TimePickerInput, { Time } from './paper-time-input';
import React from 'react';
import { set } from 'date-fns';

export default function PaperDateTimeInput(props: { 
  value: DateTimeInputData,
  onChange: (datetime: DateTimeInputData) => void,
  singleDatePickerInputProps: Omit<React.ComponentProps<typeof SingleDatePickerInput>, 'value' | 'onChange'>,
  timePickerInputProps: Omit<React.ComponentProps<typeof TimePickerInput>, 'value' | 'onChange'>
}) {
  return (
    <View style={styles.dateAndTimeInputWrapper}>
      <View style={styles.datePickerInputWrapper}>
        <SingleDatePickerInput
          value={props.value?.date}
          onChange={(d?: Date) => {
            props.onChange({
              date: d,
              time: props.value?.time,
              dateTime: d && props.value?.time ? mergeDateAndTime(d, props.value.time) : undefined
            });
          }}
          {...props.singleDatePickerInputProps}
        />
      </View>
      <View style={styles.timePickerInputWrapper}>
        <TimePickerInput
          value={props.value?.time} 
          onChange={(t?: Time) => {
            props.onChange({
              date: props.value?.date,
              time: t,
              dateTime: props.value?.date && t ? mergeDateAndTime(props.value.date, t) : undefined
            });
          }}
          textInputProps={{ ...props.timePickerInputProps.textInputProps, disabled: !props.value?.date || props.timePickerInputProps.textInputProps?.disabled }}
          timePickerProps={props.timePickerInputProps.timePickerProps}
        />
      </View>
    </View>
  );
}

function mergeDateAndTime(date: Date, time: Time): Date {
  return set(date, { hours: time.hours, minutes: time.minutes, seconds: 0, milliseconds: 0 });
}

const styles = StyleSheet.create({
  dateAndTimeInputWrapper: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  datePickerInputWrapper: {
    width: '50%'
  },
  timePickerInputWrapper: {
    width: '45%'
  }
});

export function createDateTimeInputData(date: Date): DateTimeInputData {
  return {
    dateTime: date,
    date,
    time: { hours: date.getHours(), minutes: date.getMinutes() }
  };
}

export type DateTimeInputData = {
  dateTime?: Date;
  date?: Date;
  time?: Time;
};
