import { NextFunction, Request, Response } from 'express';
import { ActivityModel } from '../models/activities';

export async function getActivities(req: Request, res: Response, next: NextFunction) {
  try {
    const activities = await ActivityModel.getAllActivities();
    res.status(200).json(activities);
  } catch (err) {
    next(err);
  }
}

export async function getActivitiesByOrg(req: Request, res: Response, next: NextFunction) {
  try {
    const orgId = parseInt(req.params.orgId);

    const activities = await ActivityModel.getActivitiesByOrg(orgId);
    res.status(200).json(activities);
  } catch (err) {
    next(err);
  }
}
