import { Router } from 'express';
import { createShift, getShift, getShifts, updateShift } from '../controllers/shifts';
import { jwtAuth } from '../services/jwt-auth';

export const shiftsRouter = Router();

shiftsRouter.get('', getShifts);

shiftsRouter.post('', jwtAuth, createShift);

shiftsRouter.get('/:id', getShift);

shiftsRouter.put('/:id', updateShift);
