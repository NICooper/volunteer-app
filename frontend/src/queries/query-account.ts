import { OrgAccount, VolunteerAccount as UserAccount } from '@shared/db/schema-types';
import { apiUrl } from '../global';
import { authedFetch } from '../utilities/authed-fetch';

export async function fetchOrgAccount(orgId: number): Promise<OrgAccount> {
  const response = await authedFetch(`${apiUrl}/accounts/org/${orgId}`);
  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  const data = await response.json();

  return data;
}

export async function fetchUserAccount(userId: number): Promise<UserAccount> {
  const response = await authedFetch(`${apiUrl}/accounts/volunteer/${userId}`);
  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  const data = await response.json();

  return data;
}
