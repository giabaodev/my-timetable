import { ScheduleData } from '@/schemas/schedule';

export const DEFAULT_VALUES: ScheduleData = {
  subjectName: '',
  teacherName: '',
  startTime: '08:50',
  endTime: '10:50',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  dayRepeat: ['monday'],
  weekRepeat: ['monday'],
  monthRepeat: ['monday'],
};
