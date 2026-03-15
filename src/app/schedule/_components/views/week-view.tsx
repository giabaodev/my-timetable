'use client';

import { format, isToday } from 'date-fns';

import { Flex } from '@/components/flex';
import { getWeekDays, isSameDay } from '@/lib/date-utils';
import { SUBJECT_MAP, TIMETABLE_ENTRIES, type TimetableEntry } from '@/lib/timetable-data';
import { cn } from '@/lib/utils';

import { SubjectCard } from './subject-card';

interface WeekViewProps {
  date: Date;
  onDaySelect?: (date: Date) => void;
  entries?: TimetableEntry[];
}

export function WeekView({ date, onDaySelect, entries }: Readonly<WeekViewProps>) {
  const days = getWeekDays(date);

  return (
    <div className="pb-6 space-y-3">
      {days.map((day) => {
        const dayEntries = (entries ?? TIMETABLE_ENTRIES)
          .filter((e) => isSameDay(day, e.date))
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        const today = isToday(day);

        return (
          <section
            key={day.toISOString()}
            className={cn(
              'rounded-2xl px-3 py-2 border border-border/60 bg-muted/40',
              today && 'border-primary/40 bg-primary/5'
            )}
          >
            {/* Day row header */}
            <Flex align="center" justify="between" className="gap-3">
              <Flex align="baseline" className="gap-2">
                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  {format(day, 'EEE')}
                </p>
                <p
                  className={cn(
                    'text-base font-bold leading-tight',
                    today ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {format(day, 'd MMM')}
                </p>
              </Flex>

              {today && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  Today
                </span>
              )}
            </Flex>

            {/* Entries list */}
            <Flex direction="col" className="mt-2 gap-1.5">
              {dayEntries.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-1.5">Free all day</p>
              ) : (
                dayEntries.map((entry) => {
                  const subject = SUBJECT_MAP[entry.subjectId];
                  if (!subject) return null;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      className="flex w-full items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-xl"
                      onClick={() => onDaySelect?.(day)}
                    >
                      <span className="text-[11px] font-medium text-muted-foreground w-16 shrink-0 text-right">
                        {entry.startTime}
                      </span>
                      <div className="flex-1">
                        <SubjectCard
                          subject={subject}
                          startTime={entry.startTime}
                          endTime={entry.endTime}
                          compact
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </Flex>
          </section>
        );
      })}
    </div>
  );
}
