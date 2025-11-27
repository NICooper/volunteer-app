import { QrJson } from '@shared/db/schema-types';
import { generateKey } from 'crypto';
import { pgTable, primaryKey, uuid, serial, text, varchar, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const accounts = pgTable('accounts', {
  id: integer('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('pw_hash', { length: 255 }).notNull()
});

export const users = pgTable('users', {
  id: integer('id').primaryKey().references(() => accounts.id),
  username: varchar('username', { length: 255 }).notNull().unique()
});

export const organizations = pgTable('organisations', {
  id: integer('id').primaryKey().references(() => accounts.id),
  name: varchar('name', { length: 255 }).notNull().unique(),
  profilePhotoUrl: varchar('profile_photo_url', { length: 255 }),
  address: varchar('address', { length: 255 }),
  website: varchar('website', { length: 255 }),
  orgLevelApproval: boolean('org_level_approval').notNull().default(false)
});

export const activities = pgTable('activities', {
  activityId: serial('activity_id').primaryKey(),
  orgId: integer('org_id').notNull().references(() => organizations.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 2000 }),
  startTime: timestamp('start_time', { mode: 'date' }),
  endTime: timestamp('end_time', { mode: 'date' })
});

export const shifts = pgTable('shifts', {
  shiftId: serial('shift_id').primaryKey(),
  activityId: integer('activity_id').notNull().references(() => activities.activityId),
  name: text('name').notNull(),
  description: varchar('description', { length: 2000 }),
  numOpenings: integer('num_openings').notNull(),
  requireApproval: boolean('require_approval').default(false),
  questionnaireJson: jsonb('questionnaire_json')
});

export const events = pgTable('events', {
  eventId: serial('event_id').primaryKey(),
  shiftId: integer('shift_id').notNull().references(() => shifts.shiftId),
  description: varchar('description', { length: 2000 }),
  location: varchar('location', { length: 255 }),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull()
});

export const shiftVolunteers = pgTable('shift_volunteers', {
  userId: integer('user_id').notNull().references(() => users.id),
  shiftId: integer('shift_id').notNull().references(() => shifts.shiftId),
  isApproved: boolean('is_approved').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  formJson: jsonb('form_json')
}, (table) => [
  primaryKey({ columns: [table.userId, table.shiftId] })
]);

export const workedEvents = pgTable('worked_events', {
  userId: integer('user_id').notNull().references(() => users.id),
  eventId: integer('event_id').notNull().references(() => events.eventId),
  checkedInBy: integer('checked_in_by').notNull().references(() => accounts.id),
  checkedOutBy: integer('checked_out_by').references(() => accounts.id),
  checkedInAt: timestamp('checked_in_at').notNull(),
  checkedOutAt: timestamp('checked_out_at')
}, (table) => [
  primaryKey({ columns: [table.userId, table.eventId] })
]);

export const qrCodes = pgTable('qr_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  generatedBy: integer('generated_by').notNull().references(() => accounts.id),
  data: jsonb('data').notNull().$type<QrJson>(),
  expiresAt: timestamp('expires_at').notNull()
});

export const test = pgTable('test', {
  id: uuid('id').primaryKey().defaultRandom()
});
