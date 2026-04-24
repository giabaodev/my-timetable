"use client";

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function MiniCalendar({
  selectedDate,
  onDateSelect,
}: Readonly<MiniCalendarProps>) {
  const [viewDate, setViewDate] = useState(selectedDate);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground">
          {format(viewDate, "MMMM yyyy")}
        </span>
        <div className="flex gap-0.5">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setViewDate(subMonths(viewDate, 1))}
            aria-label="Previous month"
          >
            <ChevronLeft className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setViewDate(addMonths(viewDate, 1))}
            aria-label="Next month"
          >
            <ChevronRight className="size-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0">
        {(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const).map(
          (d) => (
            <div
              key={d}
              className="text-center text-[10px] text-muted-foreground font-medium py-1"
            >
              {d.charAt(0)}
            </div>
          ),
        )}
        {days.map((day) => {
          const inMonth = isSameMonth(day, viewDate);
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`text-center text-[11px] py-1 rounded-full transition-all hover:bg-accent ${
                inMonth ? "text-foreground" : "text-muted-foreground/40"
              } ${
                selected ? "bg-primary text-white hover:bg-primary" : ""
              } ${today && !selected ? "font-bold text-primary" : ""}`}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
