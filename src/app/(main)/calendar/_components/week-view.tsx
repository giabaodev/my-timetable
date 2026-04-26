'use client';

import { useEffect, useRef } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { EventBlock } from './event-block';
import { CurrentTimeIndicator } from './current-time-indicator';
import { getEventsForRange } from '@/hooks/useEvents';
import type { ScheduleEvent } from '@/constants/calendar';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 60;

function getTimePosition(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h + m / 60) * HOUR_HEIGHT;
}

function getEventHeight(start: string, end: string): number {
  return Math.max(
    getTimePosition(end) - getTimePosition(start),
    HOUR_HEIGHT / 2
  );
}

interface WeekViewProps {
  currentDate: Date;
  events: ScheduleEvent[];
  onSlotClick: (date: string, time: string) => void;
  onEventClick: (event: ScheduleEvent, date: string) => void;
}

export function WeekView({
  currentDate,
  events,
  onSlotClick,
  onEventClick,
}: Readonly<WeekViewProps>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const rangeStart = weekDays[0];
  const rangeEnd = weekDays[6];

  const now = new Date();
  const isThisWeek = weekDays.some((d) => isSameDay(d, now));
  const currentTimeTop = isThisWeek
    ? (now.getHours() + now.getMinutes() / 60) * HOUR_HEIGHT
    : 0;

  const eventMap = getEventsForRange(events, rangeStart, rangeEnd);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollTo = isThisWeek ? currentTimeTop - 200 : 8 * HOUR_HEIGHT;
      scrollRef.current.scrollTop = Math.max(0, scrollTo);
    }
  }, [isThisWeek, currentTimeTop]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Day headers */}
      <div className="flex border-b border-border shrink-0">
        <div className="w-14 shrink-0" />
        {weekDays.map((day) => {
          const today = isSameDay(day, now);
          return (
            <div
              key={day.toISOString()}
              className={`flex-1 text-center py-2 border-l border-border/50 ${
                today ? 'bg-primary/10' : ''
              }`}
            >
              <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
                {format(day, 'EEE')}
              </div>
              <div
                className={`text-lg font-semibold ${
                  today
                    ? 'bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto'
                    : 'text-foreground'
                }`}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div ref={scrollRef} className="flex-1 overflow-auto relative">
        <div
          className="relative flex"
          style={{ height: HOURS.length * HOUR_HEIGHT }}
        >
          {/* Time labels */}
          <div className="w-14 shrink-0 relative">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute left-0 right-0 text-right pr-2 text-[11px] text-muted-foreground -translate-y-2"
                style={{ top: hour * HOUR_HEIGHT }}
              >
                {hour === 0 ? '' : format(new Date(2000, 0, 1, hour), 'h a')}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day) => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const dayEvents = eventMap.get(dayStr) || [];
            const today = isSameDay(day, now);

            return (
              <div
                key={dayStr}
                className={`flex-1 relative border-l border-border/50 ${
                  today ? 'bg-primary/5' : ''
                }`}
              >
                {HOURS.map((hour) => (
                  <button
                    type="button"
                    key={hour}
                    className="absolute left-0 right-0 border-b border-border/30 cursor-pointer hover:bg-accent/30 transition-colors bg-transparent"
                    style={{ top: hour * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                    onClick={() =>
                      onSlotClick(dayStr, `${String(hour).padStart(2, '0')}:00`)
                    }
                  />
                ))}

                {today && (
                  <div
                    style={{
                      top: currentTimeTop,
                      position: 'absolute',
                      left: 0,
                      right: 0,
                    }}
                  >
                    <CurrentTimeIndicator />
                  </div>
                )}

                {dayEvents.map(({ event, date: d }) => (
                  <div
                    key={`${event.id}-${d}`}
                    className="absolute left-0.5 right-0.5"
                    style={{
                      top: getTimePosition(event.startTime),
                      height: getEventHeight(event.startTime, event.endTime),
                    }}
                  >
                    <EventBlock event={event} date={d} onClick={onEventClick} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
