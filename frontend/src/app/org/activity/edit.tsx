import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, TextInput, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrUpdateActivity, fetchActivity } from '@/src/queries/query-activity';
import { Activity, InsertActivity } from '@shared/db/schema-types';
import { DatePickerInput } from 'react-native-paper-dates';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalSnackbarContext } from '@/src/components/global-snackbar';

export default function ActivityEditScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const today = new Date();

  const { setSnackbarMessage } = React.useContext(GlobalSnackbarContext);
  const [name, setName] = React.useState<string>();
  const [description, setDescription] = React.useState<string>();
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();

  const params = useLocalSearchParams<{ activityId?: string }>();
  const activityId = params.activityId ? parseInt(params.activityId) : undefined;

  const isCreateMode = activityId === undefined;

  const activityQuery = useQuery({
    queryKey: ['activity', activityId],
    queryFn: () => fetchActivity(activityId!),
    staleTime: Infinity,
    enabled: !isCreateMode
  });

  const activity =  activityQuery.data;

  const activityMutation = useMutation({
    mutationFn: (activity: InsertActivity) => createOrUpdateActivity(activity),
    onSuccess: (savedActivity: Activity) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] });
      setSnackbarMessage('Activity saved');
      router.back();
    },
    onError: () => {
      setSnackbarMessage('Error: Could not save activity.');
    }
  });

  if (activity) {
    if (name === undefined) {
      setName(activity.name);
    }
    if (description === undefined) {
      setDescription(activity.description || undefined);
    }
    if (startDate === undefined && activity.startTime) {
      setStartDate(activity.startTime);
    }
    if (endDate === undefined && activity.endTime) {
      setEndDate(activity.endTime);
    }
  }

  const isFormComplete = name && name.trim().length > 0 && startDate;

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={router.back} />
        <Appbar.Content title={`${isCreateMode ? 'Create Activity' : 'Edit Activity'}`} />
        <Appbar.Action icon='content-save' disabled={!isFormComplete} color={theme.colors.primary} 
          onPress={() => 
            activityMutation.mutate({
              activityId,
              name: name!.trim(),
              description: description?.trim() || '',
              startTime: startDate!,
              endTime: endDate || null,
              orgId: 1 // TODO
            })
          }
        />
      </Appbar.Header>
      <ScrollView style={[styles.body, { paddingBottom: insets.bottom }]}>
        <TextInput label='Activity Name' mode='outlined' style={styles.input} defaultValue={activity?.name ?? ''} onChangeText={t => setName(t)}/>
        <TextInput label='Activity Description' mode='outlined' multiline={true} numberOfLines={6} style={styles.input} defaultValue={activity?.description ?? ''} onChangeText={t => setDescription(t)} />
        <View style={[styles.datePickerInputWrapper, styles.input]}>
          <DatePickerInput
            locale='en'
            label='Start Date'
            mode='outlined'
            validRange={{startDate: today, endDate}}
            value={startDate}
            onEndEditing={(e) => {
              const text = e.nativeEvent.text;
              if (text.length < 10) {
                setStartDate(undefined);
                return;
              }
            }}
            onChange={(d: Date | undefined) => setStartDate(d ?? today)}
            inputMode='start'
          />
        </View>
        <View style={[styles.datePickerInputWrapper, styles.input]}>
          <DatePickerInput
            locale='en'
            label='End Date (optional)'
            mode='outlined'
            validRange={{startDate}}
            value={endDate}
            disabled={!startDate}
            onEndEditing={(e) => {
              const text = e.nativeEvent.text;
              if (text.length < 10) {
                setEndDate(undefined);
                return;
              }
            }}
            onChange={(d: Date | undefined) => setEndDate(d)}
            inputMode='start'
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16
  },
  datePickerInputWrapper: {
    height: 60
  },
  input: {
    marginVertical: 6
  }
});
