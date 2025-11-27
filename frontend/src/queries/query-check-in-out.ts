import { Account, InsertQrCode, QrCode, User, Event } from '@shared/db/schema-types';
import { apiUrl } from '../global';

export async function generateCheckInOutCode(action: 'checkin' | 'checkout', accountId: Account['id'], shiftId: Event['shiftId'], eventId: Event['eventId']): Promise<QrCode> {

  const checkInOutInfo: Omit<InsertQrCode, 'expiresAt'> = {
    generatedBy: accountId,
    data: {
      action,
      shiftId,
      eventId
    }
  };

  const response = await fetch(`${apiUrl}/qr/timeclock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(checkInOutInfo)
  });

  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  const responseData: QrCode = await response.json();

  return responseData;
}

export async function checkInOutWithCode(qrCodeId: string, user: Pick<User, 'id'>): Promise<QrCode> {
  const response = await fetch(`${apiUrl}/qr/timeclock/${qrCodeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId: user.id })
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Could not check in/out.');
    }
    else if (response.status === 403) {
      throw new Error('You are not approved for this shift.');
    }
    else if (response.status === 404) {
      throw new Error('QR code is not recognized.');
    }
    else if (response.status === 410) {
      throw new Error('QR code has expired.');
    }
    throw new Error('An error occurred while checking in/out.');
  }

  const responseData: QrCode = await response.json();

  return responseData;
}