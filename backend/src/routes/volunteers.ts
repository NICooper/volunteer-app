import { Router } from 'express';
import { getVolunteers } from '../controllers/volunteers';
import { getVolunteersEvents } from '../controllers/volunteers/events';

export const volunteersRouter = Router();

volunteersRouter.get('', getVolunteers);

volunteersRouter.use('/:userId/events', getVolunteersEvents);
