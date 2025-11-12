import { db } from '../db/setup';
import { activities } from '../db/schema';
import { and, eq, SQL } from 'drizzle-orm';
import { Activity, InsertActivity } from '@shared/db/schema-types';

export const ActivityModel = {
  
  getActivities: async (activityParams?: Partial<Pick<Activity, 'orgId'>>) => {
    const filters: SQL[] = [];

    if (activityParams?.orgId) { filters.push(eq(activities.orgId, activityParams.orgId)); }

    if (filters.length > 0) {
      return db.select().from(activities).where(and(...filters));
    }
    
    return db.select().from(activities);
  },

  getActivity: async (activityId: number) => {
    return db.select()
      .from(activities)
      .where(eq(activities.activityId, activityId));
  },

  createActivity: async (activityData: InsertActivity) => {
    const [newActivity] = await db.insert(activities)
      .values(activityData)
      .returning();
    return newActivity;
  },

  updateActivity: async (activityData: Activity) => {
    const [updatedActivity] = await db.update(activities)
      .set(activityData)
      .where(eq(activities.activityId, activityData.activityId))
      .returning();
    return updatedActivity;
  }
};
