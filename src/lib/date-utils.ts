import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay as dfIsSameDay,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export type ViewMode = 'day' | 'week' | 'month';

// ─── Navigation helpers ───────────────────────────────────────────────────────

export function navigateDate(date: Date, view: ViewMode, direction: -1 | 1): Date {
  switch (view) {
    case 'day':
      return addDays(date, direction);
    case 'week':
      return addWeeks(date, direction);
    case 'month':
      return addMonths(date, direction);
  }
}

// ─── Range helpers ────────────────────────────────────────────────────────────

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
  return eachDayOfInterval({ start, end: addDays(start, 6) });
}

export function getMonthDays(date: Date): Date[] {
  // Fill a full 6-week grid (42 cells) so the calendar is uniform
  const monthStart = startOfMonth(date);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const monthEnd = endOfMonth(date);
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

// ─── Label helpers ────────────────────────────────────────────────────────────

export function getRangeLabel(date: Date, view: ViewMode): string {
  switch (view) {
    case 'day':
      return format(date, 'EEE d MMM yyyy');
    case 'week': {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const end = addDays(start, 6);
      if (format(start, 'MMM yyyy') === format(end, 'MMM yyyy')) {
        return `${format(start, 'd')}–${format(end, 'd MMM yyyy')}`;
      }
      return `${format(start, 'd MMM')} – ${format(end, 'd MMM yyyy')}`;
    }
    case 'month':
      return format(date, 'MMMM yyyy');
  }
}

// ─── Time helpers ─────────────────────────────────────────────────────────────

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatTime(startTime)} – ${formatTime(endTime)}`;
}

// ─── Date matching helpers ────────────────────────────────────────────────────

export function isSameDay(date: Date, isoDateStr: string): boolean {
  return dfIsSameDay(date, parseISO(isoDateStr));
}

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
