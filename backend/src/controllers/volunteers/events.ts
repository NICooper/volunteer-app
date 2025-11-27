import { NextFunction, Request, Response } from 'express';
import { EventModel } from '../../models/events';

export async function getVolunteersEvents(req: Request, res: Response, next: NextFunction) {
  try {
    let userId: number | undefined = undefined;
    if (req.params.userId) {
      userId = parseInt(req.params.userId);
    }

    const shiftId = req.query.shiftId ? parseInt(req.query.shiftId as string) : undefined;
    const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;

    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;

    const events = await EventModel.getVolunteersEvents({userId, shiftId, eventId, from, to});

    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching volunteer events:', err);
    next(err);
  }
}
