import { EventItemContent } from '../models/umbraco.models';

/** Sort callback: earliest start date first (events without a date go last). */
export function byStartDate(a: EventItemContent, b: EventItemContent): number {
  return toTime(a.properties.startDate) - toTime(b.properties.startDate);
}

/** An event is "upcoming" until it has ended (or started, if it has no end date). */
export function isUpcoming(event: EventItemContent, now = Date.now()): boolean {
  const end = event.properties.endDate ?? event.properties.startDate;
  return toTime(end) >= now;
}

/** True when start and end fall on the same calendar day (show one date + a time range). */
export function isSameDay(start?: string | null, end?: string | null): boolean {
  if (!start || !end) return true;
  return new Date(start).toDateString() === new Date(end).toDateString();
}

function toTime(value?: string | null): number {
  return value ? new Date(value).getTime() : Number.MAX_SAFE_INTEGER;
}
