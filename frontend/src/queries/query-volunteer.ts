import { ShiftVolunteerGeneral } from '@shared/db/schema-types';
import { apiUrl } from '../global';

export async function fetchVolunteers({ orgId }: {orgId: number}): Promise<ShiftVolunteerGeneral[]> {

  const queryArray = [];
  if (orgId) {
    queryArray.push(`orgId=${orgId}`);
  }

  const query = queryArray.length > 0 ? `?${queryArray.join('&')}` : '';

  const response = await fetch(`${apiUrl}/volunteers${query}`);
  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  return await response.json();
}
