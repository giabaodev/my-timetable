"use client";

import { ViewMode, getRangeLabel } from "@/lib/date-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface TimetableHeaderProps {
  view: ViewMode;
  date: Date;
  onViewChange: (view: ViewMode) => void;
  onNavigate: (direction: -1 | 1) => void;
  onGoToday: () => void;
}

export function TimetableHeader({
  view,
  date,
  onViewChange,
  onNavigate,
  onGoToday,
}: TimetableHeaderProps) {
  const rangeLabel = getRangeLabel(date, view);

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-w-5xl mx-auto">
        {/* App title */}
        <div className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary shrink-0" />
          <h1 className="text-xl font-bold tracking-tight">My Timetable</h1>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View selector */}
          <Select value={view} onValueChange={(v) => onViewChange(v as ViewMode)}>
            <SelectTrigger className="w-[110px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>

          {/* Today button */}
          <Button variant="outline" size="sm" onClick={onGoToday} className="h-9 text-sm">
            Today
          </Button>

          {/* Prev / label / Next */}
          <div className="flex items-center gap-1 ml-auto sm:ml-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate(-1)}
              className="h-9 w-9"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center px-1">{rangeLabel}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate(1)}
              className="h-9 w-9"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
