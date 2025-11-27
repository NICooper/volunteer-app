import { Request, Response, NextFunction } from 'express';
import { VolunteerModel } from '../models/volunteers';

export async function getVolunteers(req: Request, res: Response, next: NextFunction) {
  try {
    const orgId = parseInt(req.query.orgId as string);

    const volunteers = await VolunteerModel.getVolunteers({ orgId });
    res.status(200).json(volunteers);
  } catch (err) {
    next(err);
  }
}