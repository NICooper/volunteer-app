import { Router } from 'express';
import { checkInOut, createQrCode } from '../controllers/qr-codes';

export const qrCodeRouter = Router();

qrCodeRouter.post('/timeclock', createQrCode);

qrCodeRouter.post('/timeclock/:code', checkInOut);

// qrCodeRouter.post('/connect', );

// qrCodeRouter.post('/connect/:code', );
