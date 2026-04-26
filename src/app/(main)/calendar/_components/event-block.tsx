"use client";

import type { ScheduleEvent } from "@/constants/calendar";
import { CATEGORY_OPTIONS } from "@/constants/calendar";

interface EventBlockProps {
  event: ScheduleEvent;
  date: string;
  onClick: (event: ScheduleEvent, date: string) => void;
  compact?: boolean;
}

export function EventBlock({
  event,
  date,
  onClick,
  compact,
}: Readonly<EventBlockProps>) {
  const cat = CATEGORY_OPTIONS.find((c) => c.value === event.category);

  if (compact) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick(event, date);
        }}
        className="flex items-center gap-1 w-full text-left text-[10px] leading-tight px-1 py-0.5 rounded truncate hover:opacity-80 transition-opacity"
        style={{ backgroundColor: event.color + "30", color: event.color }}
      >
        <span
          className="size-1.5 rounded-full shrink-0"
          style={{ backgroundColor: event.color }}
        />
        <span className="truncate font-medium">{event.title}</span>
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(event, date);
      }}
      className="absolute left-1 right-1 rounded-lg px-2 py-1 text-left text-[11px] leading-tight overflow-hidden cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all z-10"
      style={{
        backgroundColor: event.color + "25",
        borderLeft: `3px solid ${event.color}`,
        color: event.color,
      }}
      aria-label={`${event.title}, ${event.startTime} to ${event.endTime}`}
    >
      <div className="font-semibold truncate">
        {cat?.emoji} {event.title}
      </div>
      <div className="text-[10px] opacity-75">
        {event.startTime} – {event.endTime}
      </div>
    </button>
  );
}
