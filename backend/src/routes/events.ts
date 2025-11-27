import { Router } from 'express';
import { getEvents, getFullEventInfo } from '../controllers/events';

export const eventsRouter = Router();

eventsRouter.get('', getEvents);

eventsRouter.get('/:eventId', getFullEventInfo);
