'use client';

import { Button } from '@/components/ui/button';
import { DAYS_OF_WEEK } from '@/constants/calendar';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function MiniCalendar({
  selectedDate,
  onDateSelect,
}: Readonly<MiniCalendarProps>) {
  const [viewDate, setViewDate] = useState<Date>(selectedDate);
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  useEffect(() => {
    setViewDate(selectedDate);
  }, [selectedDate]);

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground">
          {format(selectedDate, 'MMMM yyyy')}
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
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d.label}
            className="text-center text-xs text-muted-foreground font-medium py-1"
          >
            {d.value}
          </div>
        ))}
        {days.map((day) => {
          const inMonth = isSameMonth(day, viewDate);
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);

          return (
            <Button
              variant="ghost"
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`rounded-full hover:bg-accent ${
                inMonth ? 'text-foreground' : 'text-muted-foreground/40'
              } ${
                selected ? 'bg-primary text-white pointer-events-none' : ''
              } ${today && !selected ? 'font-bold text-primary' : ''}`}
            >
              {format(day, 'd')}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
