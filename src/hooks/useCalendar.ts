"use client";

import { useState, useCallback } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  subMonths,
  subWeeks,
  format,
} from "date-fns";
import type { ViewMode } from "@/lib/types";

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewMode>("week");

  const goToday = useCallback(() => setCurrentDate(new Date()), []);

  const goNext = useCallback(() => {
    setCurrentDate((d) => {
      if (view === "day") return addDays(d, 1);
      if (view === "week") return addWeeks(d, 1);
      return addMonths(d, 1);
    });
  }, [view]);

  const goPrev = useCallback(() => {
    setCurrentDate((d) => {
      if (view === "day") return subDays(d, 1);
      if (view === "week") return subWeeks(d, 1);
      return subMonths(d, 1);
    });
  }, [view]);

  const goToDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const getDateRange = useCallback(() => {
    if (view === "day") {
      return { start: currentDate, end: currentDate };
    }
    if (view === "week") {
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 }),
      };
    }
    return {
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    };
  }, [view, currentDate]);

  const getTitle = useCallback(() => {
    if (view === "day") return format(currentDate, "EEEE, MMMM d, yyyy");
    if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      if (start.getMonth() === end.getMonth()) {
        return `${format(start, "MMM d")} – ${format(end, "d, yyyy")}`;
      }
      return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
    }
    return format(currentDate, "MMMM yyyy");
  }, [view, currentDate]);

  return {
    currentDate,
    view,
    setView,
    goToday,
    goNext,
    goPrev,
    goToDate,
    getDateRange,
    getTitle,
  };
}
