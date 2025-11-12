import { Shift, ShiftOverview } from '@shared/db/schema-types';

export async function fetchFullShifts({ orgId, activityId }: {orgId?: number, activityId?: number}): Promise<ShiftOverview[]> {

  const queryArray = [];
  if (orgId) {
    queryArray.push(`orgId=${orgId}`);
  }
  if (activityId) {
    queryArray.push(`activityId=${activityId}`);
  }

  const query = queryArray.length > 0 ? `?${queryArray.join('&')}` : '';

  const response = await fetch(`http://localhost:3000/shifts${query}`);
  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  const data = await response.json();
  data.forEach((shift: ShiftOverview) => {
    shift.startTime = new Date(shift.startTime);
    shift.endTime = new Date(shift.endTime);
  });

  return data;
}

export async function fetchShift(shiftId: number): Promise<Shift> {
  const response = await fetch(`http://localhost:3000/shifts/${shiftId}`);
  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  const data: Shift = await response.json();

  return data;
}
