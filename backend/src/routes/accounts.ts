import { Router } from 'express';
import { getOrgAccount, getVolunteerAccount } from '../controllers/accounts';

export const accountsRouter = Router();

accountsRouter.get('/org/:id', getOrgAccount);

accountsRouter.get('/volunteer/:id', getVolunteerAccount);
