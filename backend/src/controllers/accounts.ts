import { NextFunction, Request, Response } from 'express';
import { AccountModel } from '../models/accounts';

export async function getOrgAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);

    const activities = await AccountModel.getOrgAccount(id);

    if (activities.length === 0) {
      res.status(404).json({ message: 'Activity not found' });
      return;
    }

    res.status(200).json(activities[0]);
  } catch (err) {
    next(err);
  }
}

export async function getVolunteerAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);

    const activities = await AccountModel.getVolunteerAccount(id);
    if (activities.length === 0) {
      res.status(404).json({ message: 'Activity not found' });
      return;
    }

    res.status(200).json(activities[0]);
  } catch (err) {
    next(err);
  }
}
