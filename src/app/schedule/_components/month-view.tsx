"use client";

import { TIMETABLE_ENTRIES, SUBJECT_MAP, type TimetableEntry } from "@/lib/timetable-data";
import { getMonthDays, isSameDay } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { format, isToday, isSameMonth } from "date-fns";

interface MonthViewProps {
  readonly date: Date;
  readonly onDayClick?: (day: Date) => void;
  readonly entries?: TimetableEntry[];
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthView({ date, onDayClick, entries }: Readonly<MonthViewProps>) {
  const days = getMonthDays(date);

  return (
    <div className="pb-6">
      {/* Day-of-week header */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-muted-foreground py-2 uppercase tracking-wide"
          >
            <span className="hidden sm:inline">{d}</span>
            <span className="sm:hidden">{d[0]}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {days.map((day) => {
          const dayEntries = (entries ?? TIMETABLE_ENTRIES)
            .filter((e) => isSameDay(day, e.date))
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          const isCurrentMonth = isSameMonth(day, date);
          const isDayToday = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDayClick?.(day)}
              className={cn(
                "group flex flex-col rounded-lg p-1 sm:p-2 min-h-16 sm:min-h-20 text-left transition-colors hover:bg-muted cursor-pointer",
                !isCurrentMonth && "opacity-40",
                isDayToday && "bg-primary/8 ring-1 ring-primary/30 hover:bg-primary/12"
              )}
            >
              {/* Day number */}
              <span
                className={cn(
                  "text-xs sm:text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full shrink-0",
                  isDayToday ? "bg-primary text-primary-foreground" : "text-foreground"
                )}
              >
                {format(day, "d")}
              </span>

              {/* Subject dots / pills */}
              <div className="mt-1 flex flex-col gap-0.5 w-full overflow-hidden">
                {dayEntries.slice(0, 2).map((entry) => {
                  const subject = SUBJECT_MAP[entry.subjectId];
                  if (!subject) return null;
                  return (
                    <SubjectDot key={entry.id} color={subject.color} name={subject.shortName} />
                  );
                })}
                {dayEntries.length > 2 && (
                  <span className="text-[10px] text-muted-foreground font-medium px-1">
                    +{dayEntries.length - 2} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const DOT_COLORS: Record<string, string> = {
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  cyan: "bg-cyan-500",
  orange: "bg-orange-500",
};

function SubjectDot({ color, name }: Readonly<{ color: string; name: string }>) {
  return (
    <div className="flex items-center gap-1 min-w-0">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full shrink-0",
          DOT_COLORS[color] ?? "bg-muted-foreground"
        )}
      />
      <span className="text-[10px] font-medium text-foreground truncate hidden sm:block">
        {name}
      </span>
    </div>
  );
}
