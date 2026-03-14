"use client";

import { useState } from "react";
import { ViewMode, navigateDate, toISODate } from "@/lib/date-utils";
import { TIMETABLE_ENTRIES } from "@/lib/timetable-data";
import { TimetableHeader } from "@/app/schedule/_components/timetable-header";
import { DayView } from "./_components/day-view";
import { WeekView } from "./_components/week-view";
import { MonthView } from "./_components/month-view";

const INITIAL_DATE = new Date("2026-03-14T00:00:00.000Z");

export default function SchedulePage() {
  const [view, setView] = useState<ViewMode>("day");
  const [currentDate, setCurrentDate] = useState<Date>(INITIAL_DATE);
  const [extraEntries, setExtraEntries] = useState<typeof TIMETABLE_ENTRIES>([]);

  function handleNavigate(direction: -1 | 1) {
    setCurrentDate((prev) => navigateDate(prev, view, direction));
  }

  function handleGoToday() {
    const today = new Date();
    setCurrentDate(today);
    setView("day");
  }

  function handleViewChange(newView: ViewMode) {
    setView(newView);
  }

  // When user clicks a day in month view, drill down to day view
  function handleDayClick(day: Date) {
    setCurrentDate(day);
    setView("day");
  }

  function handleWeekDaySelect(day: Date) {
    setCurrentDate(day);
    setView("day");
  }

  function handleAddSchedule(payload: {
    subjectName: string;
    teacherName: string;
    startTime: string;
    startDate: string;
    endTime: string;
    endDate: string;
  }) {
    const id = `user-${extraEntries.length + 1}`;
    const date = toISODate(new Date(payload.startDate));
    setExtraEntries((prev) => [
      ...prev,
      {
        id,
        subjectId: "math",
        date,
        startTime: payload.startTime,
        endTime: payload.endTime,
      },
    ]);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TimetableHeader
        view={view}
        date={currentDate}
        onViewChange={handleViewChange}
        onNavigate={handleNavigate}
        onGoToday={handleGoToday}
        onDateChange={setCurrentDate}
        onAddSchedule={handleAddSchedule}
      />

      <main className="flex-1 px-4 pt-5 max-w-5xl mx-auto w-full">
        {view === "day" && (
          <DayView date={currentDate} entries={[...TIMETABLE_ENTRIES, ...extraEntries]} />
        )}
        {view === "week" && (
          <WeekView
            date={currentDate}
            onDaySelect={handleWeekDaySelect}
            entries={[...TIMETABLE_ENTRIES, ...extraEntries]}
          />
        )}
        {view === "month" && (
          <MonthView
            date={currentDate}
            onDayClick={handleDayClick}
            entries={[...TIMETABLE_ENTRIES, ...extraEntries]}
          />
        )}
      </main>
    </div>
  );
}
