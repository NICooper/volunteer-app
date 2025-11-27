import { InsertEvent, InsertShift, Shift, ShiftOverview } from '@shared/db/schema-types';
import { apiUrl } from '../global';

export async function fetchFullShifts({ orgId, activityId }: {orgId?: number, activityId?: number}): Promise<ShiftOverview[]> {

  const queryArray = [];
  if (orgId) {
    queryArray.push(`orgId=${orgId}`);
  }
  if (activityId) {
    queryArray.push(`activityId=${activityId}`);
  }

  const query = queryArray.length > 0 ? `?${queryArray.join('&')}` : '';

  const response = await fetch(`${apiUrl}/shifts${query}`);
  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  const data: ShiftOverview[] = await response.json();
  data.forEach((shift: ShiftOverview) => {
    shift.startTime = new Date(shift.startTime);
    shift.endTime = new Date(shift.endTime);
  });

  return data;
}

export async function fetchShift(shiftId: number): Promise<ShiftOverview> {
  const response = await fetch(`${apiUrl}/shifts/${shiftId}`);
  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  const data: ShiftOverview = await response.json();
  data.startTime = new Date(data.startTime);
  data.endTime = new Date(data.endTime);

  return data;
}

export async function createOrUpdateShift(shift: InsertShift, event: InsertEvent): Promise<Shift> {
  const isCreateMode = !shift.shiftId;

  const response = await fetch(
    `${apiUrl}/shifts${isCreateMode ? '' : `/${shift.shiftId}`}`, {
      method: isCreateMode ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ shift, event })
    }
  );

  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  return response.json();
}
