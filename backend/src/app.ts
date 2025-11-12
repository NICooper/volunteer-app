import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { activitiesRouter } from './routes/activities';
import { shiftsRouter } from './routes/shifts';
import { shiftVolunteers } from './db/schema';
import { shiftVolunteersRouter } from './routes/shift-volunteers';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/activities', activitiesRouter);
app.use('/shifts', shiftsRouter);
app.use('/shiftVolunteers', shiftVolunteersRouter);

export default app;
