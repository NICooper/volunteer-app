import { Event, FullEventInfo, InsertEvent, VolunteerEventInfo } from '@shared/db/schema-types';
import { apiUrl } from '../global';

export async function fetchEvents(shiftId: number): Promise<Event[]> {
  const response = await fetch(`${apiUrl}/events?shiftId=${shiftId}`);
  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  const data = await response.json();
  data.forEach((event: Event) => {
    event.startTime = new Date(event.startTime);
    event.endTime = new Date(event.endTime);
  });

  return data;
}

export async function fetchFullEventInfo(eventId: number): Promise<FullEventInfo | undefined> {
  const response = await fetch(`${apiUrl}/events/${eventId}`);
  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  const data: FullEventInfo = await response.json();
  data.startTime = new Date(data.startTime);
  data.endTime = new Date(data.endTime);

  return data;
}

export async function createOrUpdateEvent(event: InsertEvent): Promise<Event> {
  const isCreateMode = !event.eventId;

  const response = await fetch(
    `${apiUrl}/events${isCreateMode ? '' : `/${event.eventId}`}`, {
      method: isCreateMode ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }
  );

  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  return response.json();
}

export async function fetchVolunteersEvents(params: {
  userId: number,
  shiftId?: number,
  eventId?: number,
  from?: Date,
  to?: Date
}) {
  const queryArray = [];
  if (params.shiftId) {
    queryArray.push(`shiftId=${params.shiftId}`);
  }
  if (params.eventId) {
    queryArray.push(`eventId=${params.eventId}`);
  }
  if (params.from) {
    queryArray.push(`from=${params.from.toISOString()}`);
  }
  if (params.to) {
    queryArray.push(`to=${params.to.toISOString()}`);
  }

  const query = queryArray.length > 0 ? `?${queryArray.join('&')}` : '';

  const response = await fetch(`${apiUrl}/volunteers/${params.userId}/events${query}`);
  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  const data: VolunteerEventInfo[] = await response.json();
  data.forEach((event) => {
    event.startTime = new Date(event.startTime);
    event.endTime = new Date(event.endTime);
    if (event.checkedInAt) {
      event.checkedInAt = new Date(event.checkedInAt);
    }
    if (event.checkedOutAt) {
      event.checkedOutAt = new Date(event.checkedOutAt);
    }
  });

  return data;
}

