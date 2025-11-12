import { endOfToday, isAfter, isBefore, startOfToday } from 'date-fns';

export const isSometimeToday = (startDate: Date, endDate: Date) => 
  !isAfter(startDate, endOfToday()) && !isBefore(endDate, startOfToday());

export const isEntirelyBeforeToday = (endDate: Date) => 
  isBefore(endDate, startOfToday());

export const isEntirelyAfterToday = (startDate: Date) => 
  isAfter(startDate, endOfToday());
