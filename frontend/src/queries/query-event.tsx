import { Event } from '@shared/db/schema-types';

export async function fetchEvents(shiftId: number): Promise<Event[]> {
  const response = await fetch(`http://localhost:3000/events?shiftId=${shiftId}`);
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
