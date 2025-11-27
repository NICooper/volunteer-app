import { NextFunction, Request, Response } from 'express';
import { EventModel } from '../models/events';
import { Event } from '@shared/db/schema-types';

export async function getEvents(req: Request, res: Response, next: NextFunction) {
  try {
    let events: Event[] = [];
    if (req.query.shiftId) {
      const shiftId = parseInt(req.query.shiftId as string);

      events = await EventModel.getEvents({shiftId});
    }

    if (events.length === 0) {
      res.status(404).json({ message: 'Events for shift not found' });
      return;
    }

    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
}

export async function getFullEventInfo(req: Request, res: Response, next: NextFunction) {
  try {
    const eventId = parseInt(req.params.eventId);

    const event = await EventModel.getFullEventInfo({eventId});

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
}

export async function getWorkedEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const eventId = parseInt(req.params.eventId);
    const userId = parseInt(req.params.userId);

    const event = await EventModel.getWorkedEvent({eventId, userId});

    if (!event) {
      res.status(404).json({ message: 'Worked event not found' });
      return;
    }

    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
}
