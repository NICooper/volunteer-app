import { Router } from 'express';
import { getOrganization } from '../controllers/orgs';

export const orgsRouter = Router();

orgsRouter.get('/:id', getOrganization);
