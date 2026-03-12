// ─── Types ───────────────────────────────────────────────────────────────────

export type SubjectColor =
  | "blue"
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "cyan"
  | "orange";

export interface Subject {
  id: string;
  name: string;
  shortName: string;
  color: SubjectColor;
  teacher: string;
  room: string;
}

export interface TimetableEntry {
  id: string;
  subjectId: string;
  /** ISO date string YYYY-MM-DD */
  date: string;
  /** 24-hour "HH:MM" */
  startTime: string;
  /** 24-hour "HH:MM" */
  endTime: string;
  notes?: string;
}

// ─── Subjects ────────────────────────────────────────────────────────────────

export const SUBJECTS: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    shortName: "Math",
    color: "blue",
    teacher: "Mr. Anderson",
    room: "Room 101",
  },
  {
    id: "physics",
    name: "Physics",
    shortName: "Physics",
    color: "violet",
    teacher: "Dr. Chen",
    room: "Lab 2B",
  },
  {
    id: "english",
    name: "English Literature",
    shortName: "English",
    color: "emerald",
    teacher: "Ms. Patel",
    room: "Room 205",
  },
  {
    id: "history",
    name: "World History",
    shortName: "History",
    color: "amber",
    teacher: "Mr. Garcia",
    room: "Room 310",
  },
  {
    id: "cs",
    name: "Computer Science",
    shortName: "CS",
    color: "cyan",
    teacher: "Ms. Kim",
    room: "Lab 1A",
  },
  {
    id: "biology",
    name: "Biology",
    shortName: "Bio",
    color: "rose",
    teacher: "Dr. Williams",
    room: "Lab 3C",
  },
  {
    id: "art",
    name: "Visual Arts",
    shortName: "Art",
    color: "orange",
    teacher: "Ms. Lopez",
    room: "Studio 4",
  },
];

export const SUBJECT_MAP: Record<string, Subject> = Object.fromEntries(
  SUBJECTS.map((s) => [s.id, s])
);

// ─── Sample timetable entries (week of 2026-03-09 to 2026-03-15) ─────────────
// Current date context: 2026-03-12 (Thursday)

export const TIMETABLE_ENTRIES: TimetableEntry[] = [
  // Monday 2026-03-09
  { id: "e1", subjectId: "math", date: "2026-03-09", startTime: "08:00", endTime: "09:30" },
  { id: "e2", subjectId: "english", date: "2026-03-09", startTime: "09:45", endTime: "11:15" },
  { id: "e3", subjectId: "cs", date: "2026-03-09", startTime: "13:00", endTime: "14:30" },

  // Tuesday 2026-03-10
  { id: "e4", subjectId: "physics", date: "2026-03-10", startTime: "08:00", endTime: "09:30" },
  { id: "e5", subjectId: "biology", date: "2026-03-10", startTime: "10:00", endTime: "11:30" },
  { id: "e6", subjectId: "history", date: "2026-03-10", startTime: "13:00", endTime: "14:00" },
  { id: "e7", subjectId: "art", date: "2026-03-10", startTime: "14:15", endTime: "15:45" },

  // Wednesday 2026-03-11
  { id: "e8", subjectId: "math", date: "2026-03-11", startTime: "08:00", endTime: "09:30" },
  { id: "e9", subjectId: "cs", date: "2026-03-11", startTime: "10:00", endTime: "11:30" },
  { id: "e10", subjectId: "english", date: "2026-03-11", startTime: "13:00", endTime: "14:30" },

  // Thursday 2026-03-12 (today)
  { id: "e11", subjectId: "physics", date: "2026-03-12", startTime: "08:00", endTime: "09:30", notes: "Lab session — bring safety goggles" },
  { id: "e12", subjectId: "history", date: "2026-03-12", startTime: "10:00", endTime: "11:00" },
  { id: "e13", subjectId: "math", date: "2026-03-12", startTime: "13:00", endTime: "14:30", notes: "Quiz on Chapter 7" },
  { id: "e14", subjectId: "biology", date: "2026-03-12", startTime: "15:00", endTime: "16:00" },

  // Friday 2026-03-13
  { id: "e15", subjectId: "english", date: "2026-03-13", startTime: "09:00", endTime: "10:30" },
  { id: "e16", subjectId: "art", date: "2026-03-13", startTime: "11:00", endTime: "12:30" },
  { id: "e17", subjectId: "cs", date: "2026-03-13", startTime: "13:30", endTime: "15:00" },

  // Saturday 2026-03-14 (lighter day)
  { id: "e18", subjectId: "math", date: "2026-03-14", startTime: "09:00", endTime: "10:30", notes: "Extra revision session" },

  // Next week: Monday 2026-03-16
  { id: "e19", subjectId: "math", date: "2026-03-16", startTime: "08:00", endTime: "09:30" },
  { id: "e20", subjectId: "english", date: "2026-03-16", startTime: "09:45", endTime: "11:15" },
  { id: "e21", subjectId: "cs", date: "2026-03-16", startTime: "13:00", endTime: "14:30" },

  // Next week: Tuesday 2026-03-17
  { id: "e22", subjectId: "physics", date: "2026-03-17", startTime: "08:00", endTime: "09:30" },
  { id: "e23", subjectId: "biology", date: "2026-03-17", startTime: "10:00", endTime: "11:30" },

  // Next week: Wednesday 2026-03-18
  { id: "e24", subjectId: "history", date: "2026-03-18", startTime: "09:00", endTime: "10:00" },
  { id: "e25", subjectId: "art", date: "2026-03-18", startTime: "11:00", endTime: "12:30" },
];
