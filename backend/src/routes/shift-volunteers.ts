import { Router } from 'express';
import { getShiftVolunteers } from '../controllers/shift-volunteers';

export const shiftVolunteersRouter = Router();

shiftVolunteersRouter.get('', getShiftVolunteers);

// shiftVolunteersRouter.get('/:id', getShiftVolunteer);

// shiftVolunteersRouter.put('/:id', updateActivity);
