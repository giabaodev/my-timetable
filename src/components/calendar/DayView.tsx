"use client";

import { useMemo, useEffect, useRef } from "react";
import { format, isSameDay } from "date-fns";
import { EventBlock } from "./EventBlock";
import { CurrentTimeIndicator } from "./CurrentTimeIndicator";
import { getEventsForRange } from "@/hooks/useEvents";
import type { ScheduleEvent } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 64; // px

interface DayViewProps {
  date: Date;
  events: ScheduleEvent[];
  onSlotClick: (date: string, time: string) => void;
  onEventClick: (event: ScheduleEvent, date: string) => void;
}

function getTimePosition(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h + m / 60) * HOUR_HEIGHT;
}

function getEventHeight(start: string, end: string): number {
  return Math.max(
    getTimePosition(end) - getTimePosition(start),
    HOUR_HEIGHT / 2,
  );
}

export function DayView({
  date,
  events,
  onSlotClick,
  onEventClick,
}: Readonly<DayViewProps>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateStr = format(date, "yyyy-MM-dd");

  const dayEvents = useMemo(() => {
    const map = getEventsForRange(events, date, date);
    return map.get(dateStr) || [];
  }, [events, date, dateStr]);

  const now = new Date();
  const isToday = isSameDay(date, now);
  const currentTimeTop = isToday
    ? (now.getHours() + now.getMinutes() / 60) * HOUR_HEIGHT
    : 0;

  useEffect(() => {
    if (scrollRef.current && isToday) {
      scrollRef.current.scrollTop = currentTimeTop - 200;
    }
  }, [isToday, currentTimeTop]);

  return (
    <ScrollArea className="flex-1 h-full">
      <div
        ref={scrollRef}
        className="relative overflow-auto h-[calc(100vh-8rem)]"
      >
        <div
          className="relative"
          style={{ height: HOURS.length * HOUR_HEIGHT }}
        >
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="absolute left-0 right-0 border-b border-[#E0D8CC]/50 flex"
              style={{ top: hour * HOUR_HEIGHT, height: HOUR_HEIGHT }}
            >
              <div className="w-16 shrink-0 pr-2 text-right text-[11px] text-[#7A6E5F] pt-[-4px] -translate-y-2">
                {hour === 0 ? "" : format(new Date(2000, 0, 1, hour), "h a")}
              </div>
              <button
                type="button"
                className="flex-1 cursor-pointer hover:bg-[#E8DDD0]/30 transition-colors border-none bg-transparent"
                onClick={() =>
                  onSlotClick(dateStr, `${String(hour).padStart(2, "0")}:00`)
                }
              />
            </div>
          ))}

          {isToday && (
            <div
              style={{
                top: currentTimeTop,
                position: "absolute",
                left: 56,
                right: 0,
              }}
            >
              <CurrentTimeIndicator />
            </div>
          )}

          {dayEvents.map(({ event, date: d }) => (
            <div
              key={`${event.id}-${d}`}
              className="absolute"
              style={{
                top: getTimePosition(event.startTime),
                height: getEventHeight(event.startTime, event.endTime),
                left: 64,
                right: 8,
              }}
            >
              <EventBlock event={event} date={d} onClick={onEventClick} />
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
