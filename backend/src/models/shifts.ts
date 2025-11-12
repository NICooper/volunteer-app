import { db } from '../db/setup';
import { activities, events, shifts, shiftVolunteers } from '../db/schema';
import { Activity, InsertShift, Shift } from '@shared/db/schema-types';
import { and, eq, sql, SQL } from 'drizzle-orm';

export const ShiftModel = {

  getShifts: async (shiftParams?: Partial<Pick<Shift, 'activityId'>> & Partial<Pick<Activity, 'orgId'>>) => {
    const filters: SQL[] = [];

    if (shiftParams?.orgId) { filters.push(eq(activities.orgId, shiftParams.orgId)); }
    if (shiftParams?.activityId) { filters.push(eq(shifts.activityId, shiftParams.activityId)); }

    const activityShifts = db.$with('activityShifts').as(
      db.select({
        shiftId: shifts.shiftId,
        activityId: shifts.activityId,
        activityName: sql`${activities.name}`.as('activityName')
      }).from(activities)
      .innerJoin(shifts, eq(activities.activityId, shifts.activityId))
      .where(and(...filters))
    );

    const volunteerCounts = db.$with('volunteerCounts').as(
      db.select({
        shiftId: activityShifts.shiftId,
        activityId: activityShifts.activityId,
        activityName: activityShifts.activityName,
        numApproved: sql<number>`SUM(CASE WHEN ${shiftVolunteers.isApproved} = TRUE THEN 1 ELSE 0 END)`.mapWith(Number).as('numApproved'),
        numPending: sql<number>`SUM(CASE WHEN ${shiftVolunteers.isApproved} = FALSE THEN 1 ELSE 0 END)`.mapWith(Number).as('numPending')
      })
      .from(activityShifts)
      .leftJoin(shiftVolunteers, eq(activityShifts.shiftId, shiftVolunteers.shiftId))
      .groupBy(activityShifts.shiftId, activityShifts.activityId, activityShifts.activityName)
    );

    const fullShifts = db.with(activityShifts, volunteerCounts)
      .selectDistinctOn([volunteerCounts.shiftId], {
        shiftId: volunteerCounts.shiftId,
        activityId: volunteerCounts.activityId,
        name: shifts.name,
        description: shifts.description,
        numOpenings: shifts.numOpenings,
        requireApproval: shifts.requireApproval,
        activityName: volunteerCounts.activityName,
        numApproved: volunteerCounts.numApproved,
        numPending: volunteerCounts.numPending,
        startTime: sql`${events.startTime}`.as('startTime'),
        endTime: sql`${events.endTime}`.as('endTime'),
        location: sql`${events.location}`.as('location')
      })
      .from(volunteerCounts)
      .leftJoin(shifts, eq(volunteerCounts.shiftId, shifts.shiftId))
      .leftJoin(events, eq(volunteerCounts.shiftId, events.shiftId))
      .orderBy(volunteerCounts.shiftId, events.startTime);
    
    return fullShifts;
  },

  getShift: async (shiftId: number) => {
    return db.select()
      .from(shifts)
      .where(eq(shifts.shiftId, shiftId));
  },

  createShift: async (shiftData: InsertShift) => {
    const [newShift] = await db.insert(shifts)
      .values(shiftData)
      .returning();
    return newShift;
  },

  updateShift: async (shiftData: Shift) => {
    const [updatedShift] = await db.update(shifts)
      .set(shiftData)
      .where(eq(shifts.shiftId, shiftData.shiftId))
      .returning();
    return updatedShift;
  }

};
