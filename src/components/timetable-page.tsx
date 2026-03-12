"use client";

import { useState } from "react";
import { ViewMode, navigateDate } from "@/lib/date-utils";
import { TimetableHeader } from "./timetable-header";
import { DayView } from "./day-view";
import { WeekView } from "./week-view";
import { MonthView } from "./month-view";

export function TimetablePage() {
  const [view, setView] = useState<ViewMode>("day");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  function handleNavigate(direction: -1 | 1) {
    setCurrentDate((prev) => navigateDate(prev, view, direction));
  }

  function handleGoToday() {
    setCurrentDate(new Date());
  }

  function handleViewChange(newView: ViewMode) {
    setView(newView);
  }

  // When user clicks a day in month view, drill down to day view
  function handleDayClick(day: Date) {
    setCurrentDate(day);
    setView("day");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TimetableHeader
        view={view}
        date={currentDate}
        onViewChange={handleViewChange}
        onNavigate={handleNavigate}
        onGoToday={handleGoToday}
      />

      <main className="flex-1 px-4 pt-5 max-w-5xl mx-auto w-full">
        {view === "day" && <DayView date={currentDate} />}
        {view === "week" && <WeekView date={currentDate} />}
        {view === "month" && (
          <MonthView date={currentDate} onDayClick={handleDayClick} />
        )}
      </main>
    </div>
  );
}
