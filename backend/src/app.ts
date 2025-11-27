import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { activitiesRouter } from './routes/activities';
import { shiftsRouter } from './routes/shifts';
import { shiftVolunteersRouter } from './routes/shift-volunteers';
import { eventsRouter } from './routes/events';
import { volunteersRouter } from './routes/volunteers';
import { accountsRouter } from './routes/accounts';
import { qrCodeRouter } from './routes/qr-codes';
import { orgsRouter } from './routes/orgs';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/activities', activitiesRouter);
app.use('/shifts', shiftsRouter);
app.use('/shiftVolunteers', shiftVolunteersRouter);
app.use('/events', eventsRouter);
app.use('/volunteers', volunteersRouter);
app.use('/accounts', accountsRouter);
app.use('/qr', qrCodeRouter);
app.use('/orgs', orgsRouter);

export default app;
