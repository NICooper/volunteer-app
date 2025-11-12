import { Router } from 'express';
import { createActivity, getActivities, getActivity, updateActivity } from '../controllers/activities';

export const activitiesRouter = Router();

activitiesRouter.get('', getActivities);

activitiesRouter.post('', createActivity);

activitiesRouter.get('/:id', getActivity);

activitiesRouter.put('/:id', updateActivity);
