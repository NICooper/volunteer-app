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
  },

  getAccount: async (email: string) => {
    return db.select()
      .from(accounts)
      .where(eq(accounts.email, email))
      .limit(1);
  },

  createOrgAccount: async (accountData: { email: string, passwordHash: string, salt: string }, orgData: { name: string, profilePhotoUrl?: string, address?: string, website?: string }) => {
    const newOrgAccount = await db.transaction(async (tx) => {
      const [newAccount] = await tx.insert(accounts)
        .values(accountData)
        .returning();
      
      await tx.insert(organizations)
        .values({ ...orgData, id: newAccount.id })
        .returning();

      return newAccount.id;
    });
    
    return newOrgAccount;
  },

  createUserAccount: async (accountData: { email: string, passwordHash: string, salt: string }, userData: { username: string, profilePhotoUrl?: string }) => {
    const newOrgAccount = await db.transaction(async (tx) => {
      const [newAccount] = await tx.insert(accounts)
        .values(accountData)
        .returning();
      
      await tx.insert(users)
        .values({ ...userData, id: newAccount.id })
        .returning();

      return newAccount.id;
    });
    
    return newOrgAccount;
  }
}
