import { Request, Response, NextFunction } from 'express';
import { ShiftVolunteerModel } from '../models/shift-volunteers';

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
