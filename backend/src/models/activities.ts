import { db } from '../db/setup';
import { activities } from '../db/schema';
import { Activity } from '@shared/db/schema-types';
import { eq } from 'drizzle-orm';

export const ActivityModel = {
  
  getAllActivities: async () => {
    return db.select().from(activities);
  },

  getActivitiesByOrg: async (orgId: Activity['orgId']) => {
    return db.select().from(activities).where(eq(activities.orgId, orgId));
  }
};
