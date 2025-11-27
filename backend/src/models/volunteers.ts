import { Activity } from '@shared/db/schema-types';
import { count, eq, SQL } from 'drizzle-orm';
import { db } from '../db/setup';
import { activities, shifts, shiftVolunteers, users } from '../db/schema';

export const VolunteerModel = {

  getVolunteers: async (volunteersParams: Pick<Activity, 'orgId'>) => {
    const filters: SQL[] = [];

    // if (volunteersParams.orgId) { filters.push(eq(activities.orgId, volunteersParams.orgId)); }

    const volunteersQuery = db.selectDistinct({
            userId: users.id,
            username: users.username,
            numShiftsAtOrg: count().as('numShiftsAtOrg')
          })
          .from(activities)
          .innerJoin(shifts, eq(activities.activityId, shifts.activityId))
          .innerJoin(shiftVolunteers, eq(shifts.shiftId, shiftVolunteers.shiftId))
          .innerJoin(users, eq(shiftVolunteers.userId, users.id))
          .where(eq(activities.orgId, volunteersParams.orgId))
          .groupBy(users.id, users.username);
    
    return volunteersQuery;
  }
};
