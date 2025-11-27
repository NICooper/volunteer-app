import { db } from '../db/setup';
import { activities, events, organizations, shifts, shiftVolunteers } from '../db/schema';
import { Activity, InsertEvent, InsertShift, Shift, Event } from '@shared/db/schema-types';
import { and, eq, sql, SQL } from 'drizzle-orm';

export const ShiftModel = {

  getShifts: async (shiftParams?: Partial<Pick<Shift, 'activityId' | 'shiftId'>> & Partial<Pick<Activity, 'orgId'>>) => {
    const filters: SQL[] = [];

    if (shiftParams?.orgId) { filters.push(eq(activities.orgId, shiftParams.orgId)); }
    if (shiftParams?.activityId) { filters.push(eq(shifts.activityId, shiftParams.activityId)); }
    if (shiftParams?.shiftId) { filters.push(eq(shifts.shiftId, shiftParams.shiftId)); }

    const activityShifts = db.$with('activityShifts').as(
      db.select({
        shiftId: shifts.shiftId,
        activityId: shifts.activityId,
        activityName: sql`${activities.name}`.as('activityName'),
        orgId: activities.orgId
      }).from(activities)
      .innerJoin(shifts, eq(activities.activityId, shifts.activityId))
      .where(and(...filters))
    );

    const volunteerCounts = db.$with('volunteerCounts').as(
      db.select({
        shiftId: activityShifts.shiftId,
        activityId: activityShifts.activityId,
        activityName: activityShifts.activityName,
        orgId: activityShifts.orgId,
        numApproved: sql<number>`SUM(CASE WHEN ${shiftVolunteers.isApproved} = TRUE THEN 1 ELSE 0 END)`.mapWith(Number).as('numApproved'),
        numPending: sql<number>`SUM(CASE WHEN ${shiftVolunteers.isApproved} = FALSE THEN 1 ELSE 0 END)`.mapWith(Number).as('numPending')
      })
      .from(activityShifts)
      .leftJoin(shiftVolunteers, eq(activityShifts.shiftId, shiftVolunteers.shiftId))
      .groupBy(activityShifts.shiftId, activityShifts.activityId, activityShifts.activityName, activityShifts.orgId)
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
        orgName: sql`${organizations.name}`.as('orgName'),
        numApproved: volunteerCounts.numApproved,
        numPending: volunteerCounts.numPending,
        startTime: sql`${events.startTime}`.as('startTime'),
        endTime: sql`${events.endTime}`.as('endTime'),
        location: sql`${events.location}`.as('location')
      })
      .from(volunteerCounts)
      .leftJoin(shifts, eq(volunteerCounts.shiftId, shifts.shiftId))
      .leftJoin(events, eq(volunteerCounts.shiftId, events.shiftId))
      .leftJoin(organizations, eq(volunteerCounts.orgId, organizations.id))
      .orderBy(volunteerCounts.shiftId, events.startTime);
    
    return fullShifts;
  },

  getShift: async (shiftParams: Pick<Shift, 'shiftId'>) => {
    return db.select({
      shiftId: shifts.shiftId,
      activityId: shifts.activityId,
      name: shifts.name,
      description: shifts.description,
      numOpenings: shifts.numOpenings,
      requireApproval: shifts.requireApproval,
      questionnaireJson: shifts.questionnaireJson,
      activityName: activities.name
    }).from(shifts)
      .leftJoin(activities, eq(shifts.activityId, activities.activityId))
      .where(eq(shifts.shiftId, shiftParams.shiftId));
  },

  createShift: async ({shift, event}: {shift: InsertShift, event: InsertEvent}) => {
    return db.transaction(async (tx) => {
      const insertedShift = await tx.insert(shifts).values(shift).returning({ shiftId: shifts.shiftId });
      event.shiftId = insertedShift[0].shiftId;
      await tx.insert(events).values(event);
    });
  },

  updateShift: async ({shift, event}: {shift: Shift, event: Event}) => {
    return db.transaction(async (tx) => {
      await tx.update(shifts)
        .set(shift)
        .where(eq(shifts.shiftId, shift.shiftId));

      await tx.update(events)
        .set(event)
        .where(eq(events.eventId, event.eventId));
    });
  }

};
