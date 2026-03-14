'use client';

import { format } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Flex } from '@/components/flex';
import { Button } from '@/components/ui/button';
import { useComboboxAnchor } from '@/components/ui/combobox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getRangeLabel, getWeekDays, ViewMode } from '@/lib/date-utils';

import { AddSchedulePopup } from './add-schedule-popup';

const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;
const DAY_LABELS: Record<string, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};
const DAY_FULL_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

function getRepeatLabel(days: string[]) {
  if (days.length === 0) return 'Select days';
  if (days.includes('every-day')) return 'Every day';
  if (days.length <= 3) return days.map((d) => DAY_LABELS[d]).join(', ');
  return `${days.length} days`;
}

interface TimetableHeaderProps {
  view: ViewMode;
  date: Date;
  onViewChange: (view: ViewMode) => void;
  onNavigate: (direction: -1 | 1) => void;
  onGoToday: () => void;
  onDateChange?: (date: Date) => void;
  onAddSchedule?: (payload: {
    subjectName: string;
    teacherName: string;
    startTime: string;
    startDate: string;
    endTime: string;
    endDate: string;
  }) => void;
}

export function TimetableHeader({
  view,
  date,
  onViewChange,
  onNavigate,
  onGoToday,
  onDateChange,
  onAddSchedule,
}: Readonly<TimetableHeaderProps>) {
  const rangeLabel = getRangeLabel(date, view);
  const weekDays = getWeekDays(date);

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
      <Flex direction="col" className="px-4 py-3 gap-3 max-w-5xl mx-auto">
        <Flex direction="col" className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* App title */}
          <Flex align="center" className="gap-2">
            <CalendarDays className="h-6 w-6 text-primary shrink-0" />
            <h1 className="text-xl font-bold tracking-tight">My Timetable</h1>
          </Flex>

          {/* Controls row */}
          <Flex align="center" wrap className="gap-2">
            {/* View selector */}
            <Select value={view} onValueChange={(v) => onViewChange(v as ViewMode)}>
              <SelectTrigger className="w-27.5 text-sm rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>

            {/* Today button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onGoToday}
              className="h-8 text-sm rounded-2xl"
            >
              Today
            </Button>

            {/* Add button */}
            <AddSchedulePopup />

            {/* Prev / label / Next */}
            <Flex align="center" className="gap-1 ml-auto sm:ml-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate(-1)}
                className="h-9 w-9 rounded-full"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-35 text-center px-1">{rangeLabel}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate(1)}
                className="h-9 w-9 rounded-full"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Flex>
          </Flex>
        </Flex>

        {/* Day chips row */}
        <Flex align="center" justify="between" className="overflow-x-auto pb-1">
          {weekDays.map((day) => {
            const isActive = day.toDateString() === date.toDateString();

            return (
              <Button
                key={day.toISOString()}
                type="button"
                size="sm"
                variant={isActive ? 'default' : 'ghost'}
                className="h-8 px-3 rounded-2xl text-xs font-medium shrink-0"
                onClick={() => onDateChange?.(day)}
              >
                {format(day, 'EEE')}
              </Button>
            );
          })}
        </Flex>
      </Flex>
    </header>
  );
}
