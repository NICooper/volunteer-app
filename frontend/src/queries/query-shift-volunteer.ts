import { ShiftVolunteer, ShiftVolunteerGeneral } from '@shared/db/schema-types';
import { apiUrl } from '../global';

export async function fetchShiftVolunteers({ shiftId, orgId }: {shiftId: number, orgId: number}): Promise<ShiftVolunteerGeneral[]> {

  const queryArray = [];
  if (orgId) {
    queryArray.push(`orgId=${orgId}`);
  }
  if (shiftId) {
    queryArray.push(`shiftId=${shiftId}`);
  }

  const query = queryArray.length > 0 ? `?${queryArray.join('&')}` : '';

  const response = await fetch(`${apiUrl}/shiftVolunteers${query}`);
  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  return await response.json();
}

export async function fetchShiftVolunteer({ shiftId, userId }: {shiftId: number, userId: number}): Promise<ShiftVolunteer | null> {
  const response = await fetch(`${apiUrl}/shiftVolunteers/${shiftId}/${userId}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  return await response.json();
}

export async function createShiftVolunteer(shiftId: number, userId: number, formJson?: any): Promise<ShiftVolunteer> {
  const shiftVolunteerData: Partial<ShiftVolunteer> = {
    formJson: formJson || null
  };

  const response = await fetch(`${apiUrl}/shiftVolunteers/${shiftId}/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(shiftVolunteerData)
  });

  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  return await response.json();
}

export async function updateShiftVolunteer(shiftId: number, userId: number, shiftVolunteerData: Partial<ShiftVolunteer>): Promise<ShiftVolunteer> {
  const response = await fetch(`${apiUrl}/shiftVolunteers/${shiftId}/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(shiftVolunteerData)
  });

  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  return await response.json();
}
