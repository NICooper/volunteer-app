import { eq } from 'drizzle-orm';
import { accounts, organizations, users } from '../db/schema';
import { db } from '../db/setup';

export const AccountModel = {
  getOrgAccount: async (id: number) => {
    return db.select({
      id: organizations.id,
      name: organizations.name,
      email: accounts.email,
      address: organizations.address,
      website: organizations.website,
      orgLevelApproval: organizations.orgLevelApproval
    })
      .from(organizations)
      .leftJoin(accounts, eq(organizations.id, accounts.id))
      .where(eq(organizations.id, id));
  },

  getVolunteerAccount: async (id: number) => {
    return db.select({
      id: users.id,
      username: users.username,
      email: accounts.email
    })
      .from(users)
      .leftJoin(accounts, eq(users.id, accounts.id))
      .where(eq(users.id, id));
  }
}
