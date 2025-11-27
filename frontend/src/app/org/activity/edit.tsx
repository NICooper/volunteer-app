import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, TextInput, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrUpdateActivity, fetchActivity } from '@/src/queries/query-activity';
import { Activity, InsertActivity } from '@shared/db/schema-types';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalSnackbarContext } from '@/src/components/global-snackbar';
import { UserContext } from '../../_layout';
import SingleDatePickerInput from '@/src/components/paper-single-date-input';
import { startOfToday } from 'date-fns';

export default function ActivityEditScreen() {
  const queryClient = useQueryClient();
  const { user } = React.useContext(UserContext);
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { setSnackbarMessage } = React.useContext(GlobalSnackbarContext);
  const [activity, setActivity] = React.useState<InsertActivity>({ name: '', orgId: user?.id! });

  const params = useLocalSearchParams<{ activityId?: string }>();
  const activityId = params.activityId ? parseInt(params.activityId) : undefined;

  const isCreateMode = activityId === undefined;

  const activityQuery = useQuery({
    queryKey: ['activity', activityId],
    queryFn: () => fetchActivity(activityId!),
    staleTime: Infinity,
    enabled: !isCreateMode,
  });

  React.useEffect(() => {
    if (activityQuery.isSuccess && activityQuery.data) {
      setActivity(activityQuery.data);
    }
  }, [activityQuery.data]);

  const activityMutation = useMutation({
    mutationFn: (activity: InsertActivity) => createOrUpdateActivity(activity),
    onSuccess: (_: Activity) => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] });
      setSnackbarMessage('Activity saved');
      router.back();
    },
    onError: () => {
      setSnackbarMessage('Error: Could not save activity.');
    }
  });

  const isFormComplete = activity?.name && activity.name.trim().length > 0 && activity.startTime;

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={router.back} />
        <Appbar.Content title={`${isCreateMode ? 'Create Activity' : 'Edit Activity'}`} />
        <Appbar.Action icon='content-save' disabled={!isFormComplete} color={theme.colors.primary} 
          onPress={() => activityMutation.mutate({...activity, activityId}) }
        />
      </Appbar.Header>
      <ScrollView style={[styles.body, { paddingBottom: insets.bottom }]}>
        <TextInput label='Activity Name' mode='outlined' style={styles.input} value={activity?.name ?? ''} onChangeText={t => setActivity({...activity, name: t})}/>
        <TextInput label='Activity Description' mode='outlined' multiline={true} numberOfLines={6} style={styles.input} value={activity?.description ?? ''} onChangeText={t => setActivity({...activity, description: t})} />
        <View style={[styles.dateInputWrapper, styles.input]}>
          {/* <PaperDateTimeInput
            value={activity?.startTime ?? undefined}
            onChange={(date) => setActivity({...activity, startTime: date})}
            singleDatePickerInputProps={{ textInputProps: { label: 'Start Date' }, datePickerProps: { locale: 'en', validRange: {startDate: startOfToday(), endDate: activity.endTime ?? undefined} } }}
            timePickerInputProps={{ textInputProps: { label: 'Start Time' }, timePickerProps: { locale: 'en' } }}
          /> */}
          <SingleDatePickerInput
            textInputProps={{ label: 'Start Date' }}
            datePickerProps={{ locale: 'en', validRange: {startDate: startOfToday(), endDate: activity.endTime ?? undefined} }}
            value={activity.startTime ?? undefined}
            onChange={(d: Date | undefined) => setActivity({...activity, startTime: d ?? startOfToday()})}
          />
        </View>
        <View style={[styles.dateInputWrapper, styles.input]}>
          <SingleDatePickerInput
            textInputProps={{ label: 'End Date (optional)', disabled: !activity.startTime }}
            datePickerProps={{ locale: 'en', validRange: {startDate: activity.startTime ?? undefined} }}
            value={activity.endTime ?? undefined}
            onChange={(d: Date | undefined) => setActivity({...activity, endTime: d ?? startOfToday()})}
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
  dateInputWrapper: {
    height: 60
  },
  input: {
    marginVertical: 6
  }
});
