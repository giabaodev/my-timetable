export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "custom";

export interface RecurrenceRule {
  type: RecurrenceType;
  daysOfWeek?: number[]; // 0=Sun…6=Sat, for 'custom'
  endDate?: string; // ISO date, optional
}

export type EventCategory = "class" | "personal" | "reminder" | "other";

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

export type ViewMode = "day" | "week" | "month";

export const EVENT_COLORS = [
  "#C9A96E", // warm gold
  "#D97B6C", // warm coral
  "#7A9E7E", // sage green
  "#8B7EC8", // soft purple
  "#E8985E", // warm orange
  "#6B9EC4", // soft blue
] as const;

export const CATEGORY_OPTIONS: {
  value: EventCategory;
  label: string;
  emoji: string;
}[] = [
  { value: "class", label: "Class", emoji: "📚" },
  { value: "personal", label: "Personal", emoji: "🌿" },
  { value: "reminder", label: "Reminder", emoji: "⏰" },
  { value: "other", label: "Other", emoji: "✨" },
];

export const RECURRENCE_OPTIONS: { value: RecurrenceType; label: string }[] = [
  { value: "none", label: "Does not repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom" },
];

export const DAYS_OF_WEEK = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;
