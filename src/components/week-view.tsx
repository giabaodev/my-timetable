"use client";

import { TIMETABLE_ENTRIES, SUBJECT_MAP } from "@/lib/timetable-data";
import { getWeekDays, isSameDay } from "@/lib/date-utils";
import { SubjectCard } from "./subject-card";
import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";

interface WeekViewProps {
  date: Date;
}

export function WeekView({ date }: WeekViewProps) {
  const days = getWeekDays(date);

  return (
    <div className="pb-6">
      {/* Horizontal scroll container on mobile */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex gap-3 min-w-max sm:min-w-0 sm:grid sm:grid-cols-7">
          {days.map((day) => {
            const entries = TIMETABLE_ENTRIES
              .filter((e) => isSameDay(day, e.date))
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            const today = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "flex flex-col gap-2 w-36 sm:w-auto rounded-xl p-2",
                  today
                    ? "bg-primary/5 ring-1 ring-primary/20"
                    : "bg-muted/40"
                )}
              >
                {/* Day header */}
                <div className="text-center pb-1 border-b border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {format(day, "EEE")}
                  </p>
                  <p
                    className={cn(
                      "text-lg font-bold leading-tight",
                      today ? "text-primary" : "text-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </p>
                </div>

                {/* Entries */}
                <div className="flex flex-col gap-1.5">
                  {entries.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-2 italic">
                      Free
                    </p>
                  ) : (
                    entries.map((entry) => {
                      const subject = SUBJECT_MAP[entry.subjectId];
                      if (!subject) return null;
                      return (
                        <SubjectCard
                          key={entry.id}
                          subject={subject}
                          startTime={entry.startTime}
                          endTime={entry.endTime}
                          compact
                        />
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
