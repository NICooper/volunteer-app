import { and, eq, gte, lte, or, SQL } from 'drizzle-orm';
import { db } from '../db/setup';
import { Event, InsertWorkedEvent, WorkedEvent } from '@shared/db/schema-types';
import { activities, events, organizations, shifts, shiftVolunteers, workedEvents } from '../db/schema';
import { check } from 'drizzle-orm/gel-core';

export const EventModel = {
  
  getEvents: async (eventParams?: Partial<Pick<Event, 'shiftId'>>) => {
    const filters: SQL[] = [];

    if (eventParams?.shiftId) { filters.push(eq(events.shiftId, eventParams.shiftId)); }

    if (filters.length > 0) {
      return db.select().from(events).where(and(...filters));
    }
    
    return db.select().from(events);
  },

  getEvent: async (eventParams: Pick<Event, 'eventId'>) => {
    const event = await db.select()
      .from(events)
      .where(eq(events.eventId, eventParams.eventId))
      .limit(1);
    return event.length > 0 ? event[0] : undefined;
  },

  getVolunteersEvents: async (params: {
    userId?: WorkedEvent['userId'],
    shiftId?: Event['shiftId'],
    eventId?: Event['eventId'],
    from?: Date,
    to?: Date
  }) => {
    const filters: SQL[] = [];

    if (params.userId) { filters.push(eq(shiftVolunteers.userId, params.userId)); }
    if (params.shiftId) { filters.push(eq(events.shiftId, params.shiftId)); }
    if (params.eventId) { filters.push(eq(events.eventId, params.eventId)); }
    if (params.from) { filters.push(gte(events.endTime, params.from)); }
    if (params.to) { filters.push(lte(events.startTime, params.to)); }

    return db.select({
        eventId: events.eventId,
        shiftId: events.shiftId,
        description: events.description,
        location: events.location,
        startTime: events.startTime,
        endTime: events.endTime,
        name: shifts.name,
        activityId: shifts.activityId,
        activityName: activities.name,
        orgId: activities.orgId,
        orgName: organizations.name,
        orgProfilePhotoUrl: organizations.profilePhotoUrl,
        isApproved: shiftVolunteers.isApproved,
        checkedInAt: workedEvents.checkedInAt,
        checkedOutAt: workedEvents.checkedOutAt
      })
      .from(shiftVolunteers)
      .innerJoin(shifts, eq(shiftVolunteers.shiftId, shifts.shiftId))
      .innerJoin(events, eq(shiftVolunteers.shiftId, events.shiftId))
      .innerJoin(activities, eq(shifts.activityId, activities.activityId))
      .innerJoin(organizations, eq(activities.orgId, organizations.id))
      .leftJoin(workedEvents, and(
        eq(events.eventId, workedEvents.eventId)
      ))
      .where(and(...filters))
      .orderBy(events.startTime);
  },

  getFullEventInfo: async (eventParams: Pick<Event, 'eventId'>) => {
    const event = await db.select({
        eventId: events.eventId,
        shiftId: events.shiftId,
        description: events.description,
        location: events.location,
        startTime: events.startTime,
        endTime: events.endTime,
        name: shifts.name,
        activityId: shifts.activityId,
        activityName: activities.name,
        orgId: activities.orgId
      })
      .from(events)
      .leftJoin(shifts, eq(events.shiftId, shifts.shiftId))
      .leftJoin(activities, eq(shifts.activityId, activities.activityId))
      .where(eq(events.eventId, eventParams.eventId))
      .limit(1);
    return event.length > 0 ? event[0] : undefined;
  },

  getWorkedEvent: async (params: Pick<WorkedEvent, 'eventId' | 'userId'>) => {
    const workedEvent = await db.select()
      .from(workedEvents)
      .where(and(
        eq(workedEvents.eventId, params.eventId),
        eq(workedEvents.userId, params.userId)
      ))
      .limit(1);
    return workedEvent.length > 0 ? workedEvent[0] : undefined;
  },

  createWorkedEvent: async (workedEventData: InsertWorkedEvent) => {
    const [newWorkedEvent] = await db.insert(workedEvents)
      .values(workedEventData)
      .returning();
    return newWorkedEvent;
  },

  checkOutWorkedEvent: async (params: Pick<WorkedEvent, 'eventId' | 'userId' | 'checkedOutBy' | 'checkedOutAt'>) => {
    const [updatedWorkedEvent] = await db.update(workedEvents)
      .set({
        checkedOutBy: params.checkedOutBy,
        checkedOutAt: params.checkedOutAt
      })
      .where(and(
        eq(workedEvents.eventId, params.eventId),
        eq(workedEvents.userId, params.userId)
      ))
      .returning();
    return updatedWorkedEvent;
  }
};
