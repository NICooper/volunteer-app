import { NextFunction, Request, Response } from 'express';
import { OrgModel } from '../models/orgs';

export async function getOrganization(req: Request, res: Response, next: NextFunction) {
  try {
    const orgId = parseInt(req.params.id);

    const organization = await OrgModel.getOrganization(orgId);

    if (!organization) {
      res.status(404).json({ message: 'Organization not found' });
      return;
    }

    res.status(200).json(organization);
  } catch (err) {
    next(err);
  }
}
