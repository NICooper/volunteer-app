import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Checkbox, TextInput, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InsertEvent, InsertShift, Shift } from '@shared/db/schema-types';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalSnackbarContext } from '@/src/components/global-snackbar';
import { createOrUpdateShift, fetchShift } from '@/src/queries/query-shift';
import { UserContext } from '../../_layout';
import PaperDateTimeInput, { createDateTimeInputData, DateTimeInputData } from '@/src/components/paper-date-time-input';
import { startOfToday } from 'date-fns';
import { fetchEvents } from '@/src/queries/query-event';

export default function ShiftEditScreen() {
  const queryClient = useQueryClient();
  const { user } = React.useContext(UserContext);
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { setSnackbarMessage } = React.useContext(GlobalSnackbarContext);

  const params = useLocalSearchParams<{ shiftId?: string, activityId: string }>();
  const shiftId = params.shiftId ? parseInt(params.shiftId) : undefined;
  const activityId = parseInt(params.activityId);

  const [shift, setShift] = React.useState<Omit<InsertShift, 'numOpenings'> & Partial<Pick<InsertShift, 'numOpenings'>>>({ name: '', numOpenings: 1, activityId });
  const [event, setEvent] = React.useState<Partial<Omit<InsertEvent, 'startTime' | 'endTime'>> & { startTime: DateTimeInputData, endTime: DateTimeInputData}>({startTime: {}, endTime: {}});

  const isCreateMode = shiftId === undefined;

  const shiftQuery = useQuery({
    queryKey: ['shift', shiftId],
    queryFn: () => fetchShift(shiftId!),
    staleTime: Infinity,
    enabled: !isCreateMode
  });

  React.useEffect(() => {
    if (shiftQuery.isSuccess && shiftQuery.data) {
      setShift(shiftQuery.data);
    }
  }, [shiftQuery.data]);

  const eventsQuery = useQuery({
    queryKey: ['events', shiftId],
    queryFn: () => fetchEvents(shiftId!),
    staleTime: Infinity,
    enabled: !isCreateMode
  });

  React.useEffect(() => {
    if (eventsQuery.isSuccess && eventsQuery.data) {
      const eventData = eventsQuery.data[0];
      setEvent({
        ...eventData,
        startTime: createDateTimeInputData(eventData.startTime),
        endTime: createDateTimeInputData(eventData.endTime)
      });
    }
  }, [eventsQuery.data]);

  const shiftMutation = useMutation({
    mutationFn: async ({shift, event}: {shift: InsertShift, event: InsertEvent}) => {
      return createOrUpdateShift(shift, event);
    },
    onSuccess: (_: Shift) => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['events', shiftId] });
      queryClient.invalidateQueries({ queryKey: ['shift', shiftId] });
      setSnackbarMessage('Shift saved');
      router.back();
    },
    onError: (e) => {
      console.error('Error saving shift:', e);
      setSnackbarMessage('Error: Could not save shift.');
    }
  });

  const isFormComplete = shift && shift.name.trim().length > 0 && shift.numOpenings && event?.startTime.dateTime && event?.endTime.dateTime && event.location && event.location.trim().length > 0;

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={router.back} />
        <Appbar.Content title={`${isCreateMode ? 'Create Shift' : 'Edit Shift'}`} />
        <Appbar.Action icon='content-save' disabled={!isFormComplete}
          onPress={() => shiftMutation.mutate({shift: { ...shift, shiftId, activityId, numOpenings: shift.numOpenings! }, event: {...event as InsertEvent, description: '', startTime: event.startTime.dateTime!, endTime: event.endTime.dateTime!}}) }
          color={theme.colors.primary} 
        />
      </Appbar.Header>
      <ScrollView style={[styles.body, { paddingBottom: insets.bottom }]}>
        <TextInput label='Shift Name' mode='outlined' style={styles.input} defaultValue={shift?.name ?? ''} onChangeText={t => setShift({...shift, name: t})}/>
        <TextInput label='Shift Description' mode='outlined' multiline={true} numberOfLines={6} style={styles.input} defaultValue={shift?.description ?? ''} onChangeText={t => setShift({...shift, description: t})} />
        <TextInput label='Number of Volunteers Needed' keyboardType='numeric' mode='outlined' style={styles.input} value={shift.numOpenings?.toString() ?? ''}
          onChangeText={t => { const n = parseInt(t); setShift({...shift, numOpenings: isNaN(n) ? undefined : n})}} />
        <Checkbox.Item label='Automatically Approve Volunteers?' status={!shift?.requireApproval ? 'checked' : 'unchecked'} onPress={() => setShift({...shift, requireApproval: !shift?.requireApproval})} style={styles.input} />
        <View style={styles.input}>
          <View style={styles.eventWrapper}>
            <PaperDateTimeInput
              value={event?.startTime}
              onChange={(dateTime) => setEvent({...event, startTime: dateTime})}
              singleDatePickerInputProps={{ textInputProps: { label: 'Start Date' }, datePickerProps: { locale: 'en', validRange: {startDate: startOfToday(), endDate: event?.endTime.date ?? undefined} } }}
              timePickerInputProps={{ textInputProps: { label: 'Start Time' }, timePickerProps: { locale: 'en' } }}
            />
            <PaperDateTimeInput
              value={event?.endTime}
              onChange={(dateTime) => setEvent({...event, endTime: dateTime})}
              singleDatePickerInputProps={{ textInputProps: { label: 'End Date' }, datePickerProps: { locale: 'en', validRange: {startDate: event?.startTime.date ?? startOfToday()} } }}
              timePickerInputProps={{ textInputProps: { label: 'End Time' }, timePickerProps: { locale: 'en' } }}
            />
            <TextInput label='Location' mode='outlined' style={styles.input} defaultValue={event?.location ?? ''} onChangeText={t => setEvent({...event, location: t})} />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16
  },
  eventWrapper: {
    marginVertical: 10
  },
  input: {
    marginVertical: 6
  }
});
