import { NextFunction, Request, Response } from 'express';
import { ActivityModel } from '../models/activities';
import { Activity, InsertActivity } from '@shared/db/schema-types';

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

    const activity = await ActivityModel.getActivity(activityId);

    if (!activity) {
      res.status(404).json({ message: 'Activity not found' });
      return;
    }

    res.status(200).json(activity);
  } catch (err) {
    next(err);
  }
}

export async function createActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const activityData: InsertActivity = req.body;
    activityData.startTime = activityData.startTime ? new Date(activityData.startTime) : null;
    activityData.endTime = activityData.endTime ? new Date(activityData.endTime) : null;

    const newActivity = await ActivityModel.createActivity(activityData);

    res.status(201).json(newActivity);
  } catch (err) {
    next(err);
  }
}

export async function updateActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const activityData: Activity = req.body;
    activityData.startTime = activityData.startTime ? new Date(activityData.startTime) : null;
    activityData.endTime = activityData.endTime ? new Date(activityData.endTime) : null;

    const updatedActivity = await ActivityModel.updateActivity(activityData);

    res.status(200).json(updatedActivity);
  } catch (err) {
    next(err);
  }
}
