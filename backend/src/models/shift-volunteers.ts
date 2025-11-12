import { Activity, ShiftVolunteer } from '@shared/db/schema-types';
import { eq, sql, SQL } from 'drizzle-orm';
import { activities, shifts, shiftVolunteers, users } from '../db/schema';
import { db } from '../db/setup';

export const ShiftVolunteerModel = {

  getShiftVolunteers: async (shiftVolunteersParams: Pick<ShiftVolunteer, 'shiftId'> & Pick<Activity, 'orgId'>) => {
    const filters: SQL[] = [];

    if (shiftVolunteersParams.orgId) { filters.push(eq(activities.orgId, shiftVolunteersParams.orgId)); }
    if (shiftVolunteersParams.shiftId) { filters.push(eq(shiftVolunteers.shiftId, shiftVolunteersParams.shiftId)); }

    const shiftVolunteersQuery = db.select({
        userId: shiftVolunteers.userId,
        shiftId: shiftVolunteers.shiftId,
        isApproved: shiftVolunteers.isApproved,
        username: users.username,
        numShiftsAtOrg: sql<number>`(
          SELECT COUNT(*) FROM ${shiftVolunteers} AS sv
          INNER JOIN ${shifts} AS s ON sv.shift_id = s.shift_id
          INNER JOIN ${activities} AS a ON s.activity_id = a.activity_id
          WHERE sv.user_id = ${shiftVolunteers.userId} AND a.org_id = ${shiftVolunteersParams.orgId}
        )`.mapWith(Number).as('numShiftsAtOrg')
      })
      .from(shiftVolunteers)
      .leftJoin(users, eq(shiftVolunteers.userId, users.id))
      .where(eq(shiftVolunteers.shiftId, shiftVolunteersParams.shiftId));
    
    return shiftVolunteersQuery;
  }
};
