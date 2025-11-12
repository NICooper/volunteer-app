import { NextFunction, Request, Response } from 'express';
import { ShiftModel } from '../models/shifts';

export async function getShifts(req: Request, res: Response, next: NextFunction) {
  try {
    const shiftQuery = {
      activityId: req.query.activityId ? parseInt(req.query.activityId as string) : undefined,
      orgId: req.query.orgId ? parseInt(req.query.orgId as string) : undefined
    };

    const shifts = await ShiftModel.getShifts(shiftQuery);
    res.status(200).json(shifts);
  } catch (err) {
    next(err);
  }
}

export async function getShift(req: Request, res: Response, next: NextFunction) {
  try {
    const shiftId = parseInt(req.params.id);

    const shifts = await ShiftModel.getShift(shiftId);

    if (shifts.length === 0) {
      res.status(404).json({ message: 'Shift not found' });
      return;
    }

    res.status(200).json(shifts[0]);
  } catch (err) {
    next(err);
  }
}

export async function createShift(req: Request, res: Response, next: NextFunction) {
  try {
    const shiftData = req.body;
    const newShift = await ShiftModel.createShift(shiftData);

    res.status(201).json(newShift);
  } catch (err) {
    next(err);
  }
}

export async function updateShift(req: Request, res: Response, next: NextFunction) {
  try {
    const shiftData = req.body;
    const updatedShift = await ShiftModel.updateShift(shiftData);

    res.status(200).json(updatedShift);
  } catch (err) {
    next(err);
  }
}
