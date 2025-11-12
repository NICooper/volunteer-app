import { ShiftVolunteerGeneral } from '@shared/db/schema-types';

export async function fetchShiftVolunteers({ shiftId, orgId }: {shiftId: number, orgId: number}): Promise<ShiftVolunteerGeneral[]> {

  const queryArray = [];
  if (orgId) {
    queryArray.push(`orgId=${orgId}`);
  }
  if (shiftId) {
    queryArray.push(`shiftId=${shiftId}`);
  }

  const query = queryArray.length > 0 ? `?${queryArray.join('&')}` : '';

  const response = await fetch(`http://localhost:3000/shiftVolunteers${query}`);
  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  return await response.json();
}
