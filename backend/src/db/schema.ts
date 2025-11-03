import { pgTable, serial, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
  id: integer("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("pw_hash", { length: 255 }).notNull()
});

export const users = pgTable("users", {
  id: integer("id").primaryKey().references(() => accounts.id),
  username: varchar("username", { length: 255 }).notNull().unique()
});

export const organizations = pgTable("organizations", {
  id: integer("id").primaryKey().references(() => accounts.id),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }),
  website: varchar("website", { length: 255 }),
  orgLevelApproval: boolean("org_level_approval").notNull().default(false)
});

export const activities = pgTable("activities", {
  activityId: serial("activity_id").primaryKey(),
  orgId: integer("org_id").notNull().references(() => organizations.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 2000 }).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull()
});

export const shifts = pgTable("shifts", {
  shiftId: serial("shift_id").primaryKey(),
  activityId: integer("activity_id").notNull().references(() => activities.activityId),
  name: text("name").notNull(),
  description: varchar("description", { length: 2000 }).notNull(),
  numOpenings: integer("num_openings").notNull(),
  requireApproval: boolean("require_approval").default(false),
  questionnaireJson: jsonb("questionnaire_json")
});

export type InsertAccount = typeof accounts.$inferInsert;

export type InsertUser = typeof users.$inferInsert;

export type InsertOrganization = typeof organizations.$inferInsert;

export type InsertActivity = typeof activities.$inferInsert;

export type InsertShift = typeof shifts.$inferInsert;
