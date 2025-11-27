import { Activity, InsertShiftVolunteer, ShiftVolunteer } from '@shared/db/schema-types';
import { and, eq, sql, SQL } from 'drizzle-orm';
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
  },

  getShiftVolunteer: async (shiftVolunteerParams: Pick<ShiftVolunteer, 'shiftId' | 'userId'>) => {
    const filters: SQL[] = [];
    
    filters.push(eq(shiftVolunteers.shiftId, shiftVolunteerParams.shiftId));
    filters.push(eq(shiftVolunteers.userId, shiftVolunteerParams.userId));

    const shiftVolunteer = await db.select({
        userId: shiftVolunteers.userId,
        shiftId: shiftVolunteers.shiftId,
        isApproved: shiftVolunteers.isApproved
      })
      .from(shiftVolunteers)
      .where(and(...filters))
      .limit(1);

    return shiftVolunteer.length > 0 ? shiftVolunteer[0] : undefined;
  },

  createShiftVolunteer: async (shiftVolunteerData: InsertShiftVolunteer) => {
    const newShiftVolunteer = await db.transaction(async (tx) => {
      const [shift] = await db.select().from(shifts).where(eq(shifts.shiftId, shiftVolunteerData.shiftId)).limit(1);

      shiftVolunteerData.isApproved = !shift.requireApproval;

      const [sv] = await tx.insert(shiftVolunteers)
        .values(shiftVolunteerData)
        .returning();
      return sv;
    });
    return newShiftVolunteer;
  },

  updateShiftVolunteer: async (shiftVolunteerData: Pick<ShiftVolunteer, 'shiftId' | 'userId'> & Partial<Omit<ShiftVolunteer, 'shiftId' | 'userId'>>) => {
    const [updatedShiftVolunteer] = await db.update(shiftVolunteers)
      .set(shiftVolunteerData)
      .where(and(
        eq(shiftVolunteers.shiftId, shiftVolunteerData.shiftId),
        eq(shiftVolunteers.userId, shiftVolunteerData.userId)
      ))
      .returning();
    return updatedShiftVolunteer;
  }

};
