/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useState } from "react";
import { TIMETABLE_ENTRIES, SUBJECT_MAP, type TimetableEntry } from "@/lib/timetable-data";
import { isSameDay } from "@/lib/date-utils";
import { SubjectCard } from "./subject-card";
import { BookOpenCheck } from "lucide-react";
import { format } from "date-fns";

interface DayViewProps {
  readonly date: Date;
  readonly entries?: TimetableEntry[];
}

const START_HOUR = 7; // 07:00
const END_HOUR = 21; // 21:00
const HOUR_HEIGHT = 64; // px per hour

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function DayView({ date, entries }: DayViewProps) {
  const [currentMinutes, setCurrentMinutes] = useState<number | null>(null);

  const entriesForDay = useMemo(
    () =>
      (entries ?? TIMETABLE_ENTRIES)
        .filter((e) => isSameDay(date, e.date))
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [date]
  );

  const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  const totalMinutes = (END_HOUR - START_HOUR) * 60;
  const timelineHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

  useEffect(() => {
    if (!isToday) {
      setCurrentMinutes(null);
      return;
    }

    function updateNow() {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      setCurrentMinutes(minutes);
    }

    updateNow();
    const id = setInterval(updateNow, 60 * 1000);
    return () => clearInterval(id);
  }, [isToday]);

  if (entriesForDay.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
        <BookOpenCheck className="h-12 w-12 opacity-30" />
        <p className="text-base font-medium">
          {isToday ? "No classes today 🎉" : "No classes on this day"}
        </p>
        <p className="text-sm">Enjoy your free time!</p>
      </div>
    );
  }

  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  return (
    <div className="pb-6">
      <div className="flex gap-3">
        {/* Left: time axis */}
        <div className="w-14 sm:w-16 text-xs text-muted-foreground flex flex-col">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-16 flex items-start justify-end pr-1 select-none"
              style={{ minHeight: HOUR_HEIGHT }}
            >
              <span className="leading-none">
                {String(hour).padStart(2, "0")}
                <span className="opacity-70">:00</span>
              </span>
            </div>
          ))}
        </div>

        {/* Right: timeline with cards */}
        <div className="relative flex-1 border-l border-border">
          {/* Hour grid lines */}
          {hours.map((hour, index) => {
            const top = index * HOUR_HEIGHT;
            return (
              <div
                key={hour}
                className="absolute left-0 right-0 border-t border-dashed border-border/60"
                style={{ top }}
              />
            );
          })}

          {/* Current time indicator */}
          {isToday &&
            currentMinutes !== null &&
            currentMinutes >= START_HOUR * 60 &&
            currentMinutes <= END_HOUR * 60 && (
              <div
                className="absolute left-0 right-0 flex items-center pointer-events-none"
                style={{
                  top: ((currentMinutes - START_HOUR * 60) / totalMinutes) * timelineHeight,
                }}
              >
                <div className="w-2 h-2 rounded-full bg-rose-400 shadow-sm" />
                <div className="flex-1 h-px bg-rose-300 ml-1" />
              </div>
            )}

          {/* Course cards */}
          <div
            className="relative"
            style={{ height: timelineHeight, paddingTop: 2, paddingBottom: 8 }}
          >
            {entriesForDay.map((entry) => {
              const subject = SUBJECT_MAP[entry.subjectId];
              if (!subject) return null;

              const start = parseTimeToMinutes(entry.startTime);
              const end = parseTimeToMinutes(entry.endTime);

              const clampedStart = Math.max(start, START_HOUR * 60);
              const clampedEnd = Math.min(end, END_HOUR * 60);

              if (clampedEnd <= clampedStart) return null;

              const offsetMinutes = clampedStart - START_HOUR * 60;
              const durationMinutes = clampedEnd - clampedStart;

              const top = (offsetMinutes / totalMinutes) * timelineHeight;
              const height = (durationMinutes / totalMinutes) * timelineHeight;

              return (
                <div
                  key={entry.id}
                  className="absolute left-2 right-2 sm:left-3 sm:right-4"
                  style={{ top, height }}
                >
                  <div className="h-full flex items-stretch">
                    <SubjectCard
                      subject={subject}
                      startTime={entry.startTime}
                      endTime={entry.endTime}
                      notes={entry.notes}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
