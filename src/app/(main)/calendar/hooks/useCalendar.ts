'use client';

import { useState, useCallback } from 'react';
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
} from 'date-fns';
import { ViewMode } from '@/constants/calendar';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewMode>(ViewMode.WEEK);

  const goToday = useCallback(() => setCurrentDate(new Date()), []);

  const goNext = useCallback(() => {
    setCurrentDate((d) => {
      if (view === ViewMode.DAY) return addDays(d, 1);
      if (view === ViewMode.WEEK) return addWeeks(d, 1);
      return addMonths(d, 1);
    });
  }, [view]);

  const goPrev = useCallback(() => {
    setCurrentDate((d) => {
      if (view === ViewMode.DAY) return subDays(d, 1);
      if (view === ViewMode.WEEK) return subWeeks(d, 1);
      return subMonths(d, 1);
    });
  }, [view]);

  const goToDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const getDateRange = useCallback(() => {
    if (view === ViewMode.DAY) {
      return { start: currentDate, end: currentDate };
    }
    if (view === ViewMode.WEEK) {
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
    if (view === ViewMode.DAY) return format(currentDate, 'EEEE, MMMM d, yyyy');
    if (view === ViewMode.WEEK) {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      if (start.getMonth() === end.getMonth()) {
        return `${format(start, 'MMM d')} – ${format(end, 'd, yyyy')}`;
      }
      return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
    }
    return format(currentDate, 'MMMM yyyy');
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
