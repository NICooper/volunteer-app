import { NextFunction, Request, Response } from 'express';
import { CheckInOutModel } from '../models/check-in-out';
import { QrJson, User } from '@shared/db/schema-types';
import { addHours, addMinutes, isAfter, isBefore, subHours } from 'date-fns';
import { EventModel } from '../models/events';
import { ShiftVolunteerModel } from '../models/shift-volunteers';

export async function createQrCode(req: Request, res: Response, next: NextFunction) {
  try {
    const qrCodeData: {generatedBy: number, data: QrJson} = req.body;
    const expirationTime = addMinutes(new Date(), 5);

    if (!qrCodeData.generatedBy) {
      res.status(400).json({ message: 'generatedBy is required' });
      return;
    }

    if (qrCodeData.data.action === 'connect') {
      // TODO
    }
    else if (qrCodeData.data.action === 'checkin' || qrCodeData.data.action === 'checkout') {
      if (!qrCodeData.data.shiftId || !qrCodeData.data.eventId) {
        res.status(400).json({ message: 'shiftId and eventId are required for checkin/checkout QR codes' });
        return;
      }

      const eventRecord = await EventModel.getFullEventInfo({eventId: qrCodeData.data.eventId});
      
      if (!eventRecord || eventRecord.shiftId !== qrCodeData.data.shiftId) {
        res.status(400).json({ message: 'Event or shift not found' });
        return;
      }

      if (eventRecord.orgId !== qrCodeData.generatedBy) {
        res.status(403).json({ message: 'Not authorized to a generate QR code for this organization' });
        return;
      }

      const now = new Date();
      // Check that the current time is between one hour before the event start time and 
      // six hours after the event end time.
      if (isAfter(now, subHours(eventRecord.startTime, 1)) && isBefore(now, addHours(eventRecord.endTime, 6))) {
        
        const newQrCodeData = await CheckInOutModel.createCheckInOut({
          generatedBy: qrCodeData.generatedBy,
          expiresAt: expirationTime,
          data: {
            action: qrCodeData.data.action,
            shiftId: qrCodeData.data.shiftId,
            eventId: qrCodeData.data.eventId
          }
        });

        res.status(201).json(newQrCodeData);
      }
      
    } else {
      res.status(400).json({ message: 'Invalid QR code action' });
      return;
    }
  } catch (err) {
    next(err);
  }
}

export async function checkInOut(req: Request, res: Response, next: NextFunction) {
  try {
    const qrCodeId = req.params.code;

    const userId: User['id'] = req.body.userId;

    if (!userId) {
      res.status(400).json({ message: 'userId is required' });
      return;
    }
    
    const qrCodeRecord = await CheckInOutModel.checkInOut(qrCodeId);

    if (!qrCodeRecord || (qrCodeRecord.data.action !== 'checkin' && qrCodeRecord.data.action !== 'checkout')) {
      res.status(404).json({ message: 'Unknown QR code' });
      return;
    }

    // Check if the QR code is expired
    if (isAfter(new Date(), qrCodeRecord.expiresAt)) {
      res.status(410).json({ message: 'QR code has expired' });
      return;
    }
    
    // Check that the user is approved for the shift
    const shiftVolunteer = await ShiftVolunteerModel.getShiftVolunteer({
      shiftId: qrCodeRecord.data.shiftId,
      userId: userId
    });

    if (!shiftVolunteer || !shiftVolunteer.isApproved) {
      res.status(403).json({ message: 'User is not approved for this shift.' });
      return;
    }

    const workedEvent = await EventModel.getWorkedEvent({
      eventId: qrCodeRecord.data.eventId,
      userId: userId
    });

    // If checkin, check that the user isn't already checked in
    if (qrCodeRecord.data.action === 'checkin') {
      if (!workedEvent) {

        const newWorkedEvent = await EventModel.createWorkedEvent({
          eventId: qrCodeRecord.data.eventId,
          userId: userId,
          checkedInBy: qrCodeRecord.generatedBy,
          checkedInAt: new Date()
        });

        res.status(200).json(newWorkedEvent);
      }
      else {
        res.status(400).json({ message: 'User already checked in for this event' });
        return;
      }
    }
    // If checkout, check that the user is currently checked in and not already checked out
    else {
      if (workedEvent && !workedEvent.checkedOutAt) {

        const updatedWorkedEvent = await EventModel.checkOutWorkedEvent({
          eventId: qrCodeRecord.data.eventId,
          userId: userId,
          checkedOutBy: qrCodeRecord.generatedBy,
          checkedOutAt: new Date()
        });
        
        res.status(200).json(updatedWorkedEvent);
      }
      else {
        res.status(400).json({ message: 'User is not checked in or already checked out for this event' });
        return;
      }
    }

  } catch (err) {
    next(err);
  }
}
