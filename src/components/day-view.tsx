"use client";

import { TIMETABLE_ENTRIES, SUBJECT_MAP } from "@/lib/timetable-data";
import { isSameDay } from "@/lib/date-utils";
import { SubjectCard } from "./subject-card";
import { BookOpenCheck } from "lucide-react";
import { format } from "date-fns";

interface DayViewProps {
  date: Date;
}

export function DayView({ date }: DayViewProps) {
  const entries = TIMETABLE_ENTRIES
    .filter((e) => isSameDay(date, e.date))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const isToday =
    format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  if (entries.length === 0) {
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

  return (
    <div className="flex flex-col gap-3 pb-6">
      {entries.map((entry) => {
        const subject = SUBJECT_MAP[entry.subjectId];
        if (!subject) return null;
        return (
          <SubjectCard
            key={entry.id}
            subject={subject}
            startTime={entry.startTime}
            endTime={entry.endTime}
            notes={entry.notes}
          />
        );
      })}
    </div>
  );
}
