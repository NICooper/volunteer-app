import { format, isSameDay } from 'date-fns';

export function formatDateTimeInterval(start: Date, end: Date): string {
  return isSameDay(start, end)
    ? format(start, 'PP') + ', ' + format(start, 'p') + ' - ' + format(end, 'p')
    : format(start, 'PPp') + ' - ' + format(end, 'PPp');
}
