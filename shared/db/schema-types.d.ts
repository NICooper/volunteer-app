import { accounts, activities, organizations, shifts, users } from '../../backend/src/db/schema';

export type Account = typeof accounts.$inferSelect;

export type User = typeof users.$inferSelect;

export type Organization = typeof organizations.$inferSelect;

export type Activity = typeof activities.$inferSelect;

export type Shift = typeof shifts.$inferSelect;
