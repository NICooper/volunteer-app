import { Router } from 'express';
import { createShift, getShift, getShifts, updateShift } from '../controllers/shifts';

export const shiftsRouter = Router();

shiftsRouter.get('', getShifts);

shiftsRouter.post('', createShift);

shiftsRouter.get('/:id', getShift);

shiftsRouter.put('/:id', updateShift);
