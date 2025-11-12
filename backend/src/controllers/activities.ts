import { NextFunction, Request, Response } from 'express';
import { ActivityModel } from '../models/activities';

export async function getActivities(req: Request, res: Response, next: NextFunction) {
  try {
    const activityQuery = {
      orgId: req.query.orgId ? parseInt(req.query.orgId as string) : undefined
    };

    const activities = await ActivityModel.getActivities(activityQuery);
    res.status(200).json(activities);
  } catch (err) {
    next(err);
  }
}

export async function getActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const activityId = parseInt(req.params.id);

    const activities = await ActivityModel.getActivity(activityId);

    if (activities.length === 0) {
      res.status(404).json({ message: 'Activity not found' });
      return;
    }

    res.status(200).json(activities[0]);
  } catch (err) {
    next(err);
  }
}

export async function createActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const activityData = req.body;
    const newActivity = await ActivityModel.createActivity(activityData);

    res.status(201).json(newActivity);
  } catch (err) {
    next(err);
  }
}

export async function updateActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const activityData = req.body;
    const updatedActivity = await ActivityModel.updateActivity(activityData);

    res.status(200).json(updatedActivity);
  } catch (err) {
    next(err);
  }
}
