import { Router } from 'express';
import { getActivities, getActivitiesByOrg } from '../controllers/activities';

export const activitiesRouter = Router();

activitiesRouter.get('', getActivities);

activitiesRouter.get('/:orgId', getActivitiesByOrg);
