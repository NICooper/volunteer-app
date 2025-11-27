import { Request, Response, NextFunction } from 'express';
import { ShiftVolunteerModel } from '../models/shift-volunteers';
import { ShiftVolunteer } from '@shared/db/schema-types';

export async function getShiftVolunteers(req: Request, res: Response, next: NextFunction) {
  try {
    const shiftId = parseInt(req.query.shiftId as string);
    const orgId = parseInt(req.query.orgId as string);

    const shiftVolunteers = await ShiftVolunteerModel.getShiftVolunteers({ shiftId, orgId });
    res.status(200).json(shiftVolunteers);
  } catch (err) {
    next(err);
  }
}

export async function getShiftVolunteer(req: Request, res: Response, next: NextFunction) {
  try {
    const shiftId = parseInt(req.params.shiftId);
    const userId = parseInt(req.params.userId);

    const shiftVolunteer = await ShiftVolunteerModel.getShiftVolunteer({ shiftId, userId });

    if (!shiftVolunteer) {
      res.status(404).json({ message: 'Shift volunteer not found' });
      return;
    }

    res.status(200).json(shiftVolunteer);
  } catch (err) {
    next(err);
  }
}

export async function createShiftVolunteer(req: Request, res: Response, next: NextFunction) {
  try {
    const shiftId = parseInt(req.params.shiftId);
    const userId = parseInt(req.params.userId);
    const { formJson } = req.body;

    const newShiftVolunteer = await ShiftVolunteerModel.createShiftVolunteer({
      shiftId,
      userId,
      createdAt: new Date(),
      formJson: formJson || null
    });

    res.status(201).json(newShiftVolunteer);
  } catch (err) {
    next(err);
  }
}

export async function updateShiftVolunteer(req: Request, res: Response, next: NextFunction) {
  try {
    const shiftId = parseInt(req.params.shiftId);
    const userId = parseInt(req.params.userId);
    const shiftVolunteerData: Partial<Omit<ShiftVolunteer, 'shiftId' | 'userId'>> = req.body;

    const updatedSV = await ShiftVolunteerModel.updateShiftVolunteer({...shiftVolunteerData, shiftId, userId });

    if (!updatedSV) {
      res.status(404).json({ message: 'Shift volunteer not found' });
      return;
    }

    res.status(200).json(updatedSV);
  } catch (err) {
    next(err);
  }
}
