import { NextFunction, Request, Response } from 'express';
import { ShiftModel } from '../models/shifts';
import { InsertEvent, InsertShift, Shift, Event } from '@shared/db/schema-types';

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

    const shifts = await ShiftModel.getShifts({ shiftId });

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
    const shiftData: { shift: InsertShift, event: InsertEvent } = req.body;
    shiftData.event.startTime = new Date(shiftData.event.startTime);
    shiftData.event.endTime = new Date(shiftData.event.endTime);
    await ShiftModel.createShift(shiftData);

    res.status(201);
  } catch (err) {
    next(err);
  }
}

export async function updateShift(req: Request, res: Response, next: NextFunction) {
  try {
    const shiftData: { shift: Shift, event: Event } = req.body;
    shiftData.event.startTime = new Date(shiftData.event.startTime);
    shiftData.event.endTime = new Date(shiftData.event.endTime);
    await ShiftModel.updateShift(shiftData);

    res.status(200);
  } catch (err) {
    next(err);
  }
}
