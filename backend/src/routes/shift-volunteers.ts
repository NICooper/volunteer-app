import { Router } from 'express';
import { createShiftVolunteer, getShiftVolunteer, getShiftVolunteers, updateShiftVolunteer } from '../controllers/shift-volunteers';

export const shiftVolunteersRouter = Router();

shiftVolunteersRouter.get('', getShiftVolunteers);

shiftVolunteersRouter.get('/:shiftId/:userId', getShiftVolunteer);

shiftVolunteersRouter.post('/:shiftId/:userId', createShiftVolunteer);

shiftVolunteersRouter.put('/:shiftId/:userId', updateShiftVolunteer);
