import z from 'zod';

export const Schedule = z.object({
  subjectName: z.string().min(1, 'Subject name is required'),
  teacherName: z.string().min(1, 'Teacher name is required'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  dayRepeat: z.array(z.string()).min(1, 'At least one day must be selected'),
  weekRepeat: z.array(z.string()).min(1, 'At least one week must be selected'),
  monthRepeat: z.array(z.string()).min(1, 'At least one month must be selected'),
});

export type ScheduleData = z.infer<typeof Schedule>;
