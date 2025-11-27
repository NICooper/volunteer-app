import { eq } from 'drizzle-orm';
import { organizations } from '../db/schema';
import { db } from '../db/setup';

export const OrgModel = {

  getOrganization: async (orgId: number) => {
    const organization = await db.select({id: organizations.id})
      .from(organizations);
    return organization.length > 0 ? organization[0] : undefined;
  }

};
