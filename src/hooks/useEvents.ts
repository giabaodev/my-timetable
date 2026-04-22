"use client";

import { useState, useCallback, useEffect } from "react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  format,
  getDay,
  parseISO,
  startOfDay,
} from "date-fns";
import type { ScheduleEvent, RecurrenceRule } from "@/lib/types";

const STORAGE_KEY_PREFIX = "schedulr_events_";

function getStorageKey(userId?: string): string {
  return userId ? `${STORAGE_KEY_PREFIX}${userId}` : "scheduleEvents";
}

function generateId(): string {
  return crypto.randomUUID();
}

function loadEvents(userId?: string): ScheduleEvent[] {
  if (globalThis.window === undefined) return [];
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEvents(events: ScheduleEvent[], userId?: string) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(events));
}

/**
 * Generate occurrences of a recurring event within a date range.
 * Returns ISO date strings for each occurrence.
 */
function collectByStep(
  anchor: Date,
  effectiveEnd: Date,
  rangeStart: Date,
  deleted: Set<string>,
  step: (d: Date) => Date,
): string[] {
  const results: string[] = [];
  let current = anchor;
  const rangeStartDay = startOfDay(rangeStart);
  while (current <= effectiveEnd) {
    if (current >= rangeStartDay) {
      const dateStr = format(current, "yyyy-MM-dd");
      if (!deleted.has(dateStr)) results.push(dateStr);
    }
    current = step(current);
  }
  return results;
}

/**
 * Generate occurrences of a recurring event within a date range.
 */
export function getOccurrences(
  event: ScheduleEvent,
  rangeStart: Date,
  rangeEnd: Date,
): string[] {
  const anchorDate = parseISO(event.date);
  const rule: RecurrenceRule = event.recurrence;

  if (rule.type === "none") {
    const d = startOfDay(anchorDate);
    if (d >= startOfDay(rangeStart) && d <= startOfDay(rangeEnd)) {
      return [event.date];
    }
    return [];
  }

  const endDate = rule.endDate ? parseISO(rule.endDate) : rangeEnd;
  const effectiveEnd = endDate < rangeEnd ? endDate : rangeEnd;
  const deleted = new Set(event.deletedOccurrences || []);

  const stepMap: Record<string, (d: Date) => Date> = {
    daily: (d) => addDays(d, 1),
    weekly: (d) => addDays(d, 7),
    monthly: (d) => addMonths(d, 1),
  };

  if (rule.type in stepMap) {
    return collectByStep(
      anchorDate,
      effectiveEnd,
      rangeStart,
      deleted,
      stepMap[rule.type],
    );
  }

  if (rule.type === "custom" && rule.daysOfWeek) {
    const targetDays = new Set(rule.daysOfWeek);
    const intervalStart = new Date(
      Math.max(anchorDate.getTime(), rangeStart.getTime()),
    );
    const days = eachDayOfInterval({ start: intervalStart, end: effectiveEnd });
    return days
      .filter((day) => targetDays.has(getDay(day)))
      .map((day) => format(day, "yyyy-MM-dd"))
      .filter((dateStr) => !deleted.has(dateStr));
  }

  return [];
}

/** Expand all events into date-keyed occurrence map for a date range */
export function getEventsForRange(
  events: ScheduleEvent[],
  rangeStart: Date,
  rangeEnd: Date,
): Map<string, { event: ScheduleEvent; date: string }[]> {
  const map = new Map<string, { event: ScheduleEvent; date: string }[]>();

  for (const event of events) {
    const occurrences = getOccurrences(event, rangeStart, rangeEnd);
    for (const dateStr of occurrences) {
      const existing = map.get(dateStr) || [];
      existing.push({ event, date: dateStr });
      map.set(dateStr, existing);
    }
  }

  return map;
}

export function useEvents(userId?: string) {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setEvents(loadEvents(userId));
    setIsLoaded(true);
  }, [userId]);

  const persist = useCallback(
    (updated: ScheduleEvent[]) => {
      setEvents(updated);
      saveEvents(updated, userId);
    },
    [userId],
  );

  const addEvent = useCallback(
    (data: Omit<ScheduleEvent, "id" | "createdAt">) => {
      const newEvent: ScheduleEvent = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      const updated = [...events, newEvent];
      persist(updated);
      return newEvent;
    },
    [events, persist],
  );

  const deleteEvent = useCallback(
    (id: string) => {
      persist(events.filter((e) => e.id !== id));
    },
    [events, persist],
  );

  const deleteOccurrence = useCallback(
    (id: string, dateStr: string) => {
      persist(
        events.map((e) => {
          if (e.id !== id) return e;
          return {
            ...e,
            deletedOccurrences: [...(e.deletedOccurrences || []), dateStr],
          };
        }),
      );
    },
    [events, persist],
  );

  const deleteThisAndFuture = useCallback(
    (id: string, dateStr: string) => {
      persist(
        events.map((e) => {
          if (e.id !== id) return e;
          // Set the recurrence end date to the day before
          const endDate = format(addDays(parseISO(dateStr), -1), "yyyy-MM-dd");
          return {
            ...e,
            recurrence: { ...e.recurrence, endDate },
          };
        }),
      );
    },
    [events, persist],
  );

  return {
    events,
    isLoaded,
    addEvent,
    deleteEvent,
    deleteOccurrence,
    deleteThisAndFuture,
  };
}
