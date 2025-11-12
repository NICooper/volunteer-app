import { event } from 'jquery';
import { accounts, activities, organizations, shifts, users, events, shiftVolunteers } from '../../backend/src/db/schema';

export type Account = typeof accounts.$inferSelect;
export type InsertAccount = typeof accounts.$inferInsert;

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

export type Shift = typeof shifts.$inferSelect;
export type InsertShift = typeof shifts.$inferInsert;

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export type ShiftVolunteer = typeof shiftVolunteers.$inferSelect;
export type InsertShiftVolunteer = typeof shiftVolunteers.$inferInsert;

export type WorkedEvent = typeof workedEvents.$inferSelect;
export type InsertWorkedEvent = typeof workedEvents.$inferInsert;

export type ShiftOverview = Omit<Shift, 'questionnaireJson'> & { 
  activityName: string;
  location: string;
  startTime: Date;
  endTime: Date;
  numApproved: number;
  numPending: number;
};

export type ShiftVolunteerGeneral = Omit<ShiftVolunteer, 'createdAt' | 'updatedAt' | 'formJson'> & {
  username: string;
  numShiftsAtOrg: number;
};
