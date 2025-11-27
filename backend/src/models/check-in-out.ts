import { InsertQrCode } from '@shared/db/schema-types';
import { db } from '../db/setup';
import { qrCodes } from '../db/schema';
import { eq } from 'drizzle-orm';

export const CheckInOutModel = {

  createCheckInOut: async (qrCodeData: InsertQrCode) => {
    const [generatedQrCodeData] = await db.insert(qrCodes)
      .values(qrCodeData)
      .returning();
    return generatedQrCodeData;
  },

  checkInOut: async (qrCodeId: string) => {
    const qrCodeRecord = await db.select()
    .from(qrCodes)
    .where(eq(qrCodes.id, qrCodeId))
    .limit(1);

    return qrCodeRecord[0];
  }

};
