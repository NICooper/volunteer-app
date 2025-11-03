import BodyContainer from '@/src/components/body-container';
import ShiftCard from '@/src/components/org/shift-card';
import { StyleSheet } from 'react-native';
import ListAccordion from '@/src/components/list-accordion';

export default function ShiftsScreen() {
  return (
    <BodyContainer>
      <ListAccordion title="Today's Shifts" expanded={true} style={styles.list}>
        <ShiftCard props={{ shiftName: "Clean up park", activityName: "Beach Cleanup", locationName: "Santa Monica Beach", startDate: "2023-09-15", startTime: "09:00", endTime: "12:00", volunteersApprovedCount: 5, volunteersRemainingCount: 3, volunteersPendingCount: 2 }} />
        <ShiftCard props={{ shiftName: "Park Restoration", activityName: "Park Restoration", locationName: "Central Park", startDate: "2023-09-16", startTime: "10:00", endTime: "13:00", volunteersApprovedCount: 4, volunteersRemainingCount: 2, volunteersPendingCount: 1 }} />
      </ListAccordion> 
      <ListAccordion title="Upcoming Shifts" expanded={true} style={styles.list}>
        <ShiftCard props={{ shiftName: "Beach Cleanup", activityName: "Beach Cleanup", locationName: "Santa Monica Beach", startDate: "2023-09-15", startTime: "09:00", endTime: "12:00", volunteersApprovedCount: 5, volunteersRemainingCount: 3, volunteersPendingCount: 2 }} />
        <ShiftCard props={{ shiftName: "Park Restoration", activityName: "Park Restoration", locationName: "Central Park", startDate: "2023-09-16", startTime: "10:00", endTime: "13:00", volunteersApprovedCount: 4, volunteersRemainingCount: 2, volunteersPendingCount: 1 }} />
      </ListAccordion>
      <ListAccordion title="Past Shifts" style={styles.list}>
        <ShiftCard props={{ shiftName: "Beach Cleanup", activityName: "Beach Cleanup", locationName: "Santa Monica Beach", startDate: "2023-09-15", startTime: "09:00", endTime: "12:00", volunteersApprovedCount: 5, volunteersRemainingCount: 3, volunteersPendingCount: 2 }} />
        <ShiftCard props={{ shiftName: "Park Restoration", activityName: "Park Restoration", locationName: "Central Park", startDate: "2023-09-16", startTime: "10:00", endTime: "13:00", volunteersApprovedCount: 4, volunteersRemainingCount: 2, volunteersPendingCount: 1 }} />
      </ListAccordion>
    </BodyContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {

  }
});
