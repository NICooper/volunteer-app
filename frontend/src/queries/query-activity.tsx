import { Activity, InsertActivity } from '@shared/db/schema-types';

export async function fetchActivities(orgId: number): Promise<Activity[]> {
  const response = await fetch(`http://localhost:3000/activities?orgId=${orgId}`);
  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  const data = await response.json();
  data.forEach((activity: Activity) => {
    activity.startTime = activity.startTime ? new Date(activity.startTime) : null;
    activity.endTime = activity.endTime ? new Date(activity.endTime) : null;
  });

  return data;
}

export async function fetchActivity(activityId: number): Promise<Activity> {
  const response = await fetch(`http://localhost:3000/activities/${activityId}`);
  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  const data: Activity = await response.json();
  data.startTime = data.startTime ? new Date(data.startTime) : null;
  data.endTime = data.endTime ? new Date(data.endTime) : null;

  return data;
}

export async function createOrUpdateActivity(activity: InsertActivity) {
  const isCreateMode = !activity.activityId;

  const response = await fetch(`http://localhost:3000/activities${isCreateMode ? '' : `/${activity.activityId}`}`, {
    method: isCreateMode ? 'POST' : 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(activity)
  });
  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }
  return response.json();
};
