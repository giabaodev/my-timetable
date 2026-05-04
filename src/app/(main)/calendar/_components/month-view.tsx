'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns';
import { EventBlock } from './event-block';
import { getEventsForRange } from '@/app/(main)/calendar/hooks/useEvents';
import type { ScheduleEvent } from '@/constants/calendar';

interface MonthViewProps {
  currentDate: Date;
  events: ScheduleEvent[];
  onDateClick: (date: string) => void;
  onEventClick: (event: ScheduleEvent, date: string) => void;
}

const MAX_VISIBLE = 3;

export function MonthView({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}: Readonly<MonthViewProps>) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const eventMap = getEventsForRange(events, calendarStart, calendarEnd);

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="flex-1 flex flex-col overflow-auto p-2 sm:p-4">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {weekdays.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-medium text-muted-foreground uppercase tracking-wider py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr gap-px bg-border/50 rounded-xl overflow-hidden">
        {days.map((day) => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const dayEvents = eventMap.get(dayStr) || [];
          const inMonth = isSameMonth(day, currentDate);
          const today = isToday(day);
          const isExpanded = expandedDate === dayStr;

          return (
            <button
              type="button"
              key={dayStr}
              className={`bg-background p-1 sm:p-1.5 min-h-20 sm:min-h-25 cursor-pointer transition-colors hover:bg-card text-left ${
                inMonth ? '' : 'opacity-40'
              }`}
              onClick={() => {
                if (dayEvents.length > MAX_VISIBLE && !isExpanded) {
                  setExpandedDate(dayStr);
                } else if (isExpanded) {
                  setExpandedDate(null);
                } else {
                  onDateClick(dayStr);
                }
              }}
            >
              <div className="flex justify-center mb-1">
                <span
                  className={`text-xs sm:text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                    today ? 'bg-primary text-white' : 'text-foreground'
                  }`}
                >
                  {format(day, 'd')}
                </span>
              </div>

              <div className="space-y-0.5">
                {(isExpanded ? dayEvents : dayEvents.slice(0, MAX_VISIBLE)).map(
                  ({ event, date: d }) => (
                    <EventBlock
                      key={`${event.id}-${d}`}
                      event={event}
                      date={d}
                      onClick={onEventClick}
                      compact
                    />
                  )
                )}
                {!isExpanded && dayEvents.length > MAX_VISIBLE && (
                  <div className="text-[10px] text-muted-foreground pl-1 font-medium">
                    +{dayEvents.length - MAX_VISIBLE} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
