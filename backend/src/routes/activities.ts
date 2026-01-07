import { Router } from 'express';
import { createActivity, getActivities, getActivity, updateActivity } from '../controllers/activities';
import { jwtAuth } from '../services/jwt-auth';
import passport from 'passport';

export const activitiesRouter = Router();

activitiesRouter.get('', jwtAuth, getActivities);

activitiesRouter.post('', jwtAuth, createActivity);

activitiesRouter.get('/:id', jwtAuth, getActivity);

activitiesRouter.put('/:id', jwtAuth, updateActivity);
