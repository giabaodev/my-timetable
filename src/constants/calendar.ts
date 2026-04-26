export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface RecurrenceRule {
  type: RecurrenceType;
  daysOfWeek?: number[]; // 0=Sun…6=Sat, for 'custom'
  endDate?: string; // ISO date, optional
}

export type EventCategory = 'class' | 'personal' | 'reminder' | 'other';

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string; // ISO date "YYYY-MM-DD" (anchor date)
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  color: string; // hex
  category: EventCategory;
  recurrence: RecurrenceRule;
  notes?: string;
  createdAt: string;
  deletedOccurrences?: string[]; // ISO dates of deleted single occurrences
}

export enum ViewMode {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export const CALENDAR_VIEWS: { value: ViewMode; label: string }[] = [
  { value: ViewMode.DAY, label: 'Day' },
  { value: ViewMode.WEEK, label: 'Week' },
  { value: ViewMode.MONTH, label: 'Month' },
];

export const EVENT_COLORS = [
  '#C9A96E', // warm gold
  '#D97B6C', // warm coral
  '#7A9E7E', // sage green
  '#8B7EC8', // soft purple
  '#E8985E', // warm orange
  '#6B9EC4', // soft blue
] as const;

export const CATEGORY_OPTIONS: {
  value: EventCategory;
  label: string;
  emoji: string;
}[] = [
  { value: 'class', label: 'Class', emoji: '📚' },
  { value: 'personal', label: 'Personal', emoji: '🌿' },
  { value: 'reminder', label: 'Reminder', emoji: '⏰' },
  { value: 'other', label: 'Other', emoji: '✨' },
];

export const RECURRENCE_OPTIONS: { value: RecurrenceType; label: string }[] = [
  { value: 'none', label: 'Does not repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' },
];

export const DAYS_OF_WEEK = [
  {
    value: 'M',
    label: 'Mon',
  },
  {
    value: 'T',
    label: 'Tue',
  },
  {
    value: 'W',
    label: 'Wed',
  },
  {
    value: 'T',
    label: 'Thu',
  },
  {
    value: 'F',
    label: 'Fri',
  },
  {
    value: 'S',
    label: 'Sat',
  },
  {
    value: 'S',
    label: 'Sun',
  },
] as const;
