"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ViewMode, getRangeLabel, getWeekDays } from "@/lib/date-utils";
import { SelectItem as SelectItemType } from "@/types";
import { format } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Fragment, useState } from "react";
import { REPEAT_SCHEDULE } from "../constants/repeat-schedule";

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};
const DAY_FULL_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function getRepeatLabel(days: string[]) {
  if (days.length === 0) return "Select days";
  if (days.includes("every-day")) return "Every day";
  if (days.length <= 3) return days.map((d) => DAY_LABELS[d]).join(", ");
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
  const anchor = useComboboxAnchor();
  const [subjectName, setSubjectName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [startDate, setStartDate] = useState(format(date, "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(date, "yyyy-MM-dd"));
  const [repeat, setRepeat] = useState(true);
  const [repeatDays, setRepeatDays] = useState<string[]>(["monday"]);

  function handleRepeatDaysChange(newValues: string[]) {
    const hadEveryDay = repeatDays.includes("every-day");
    const hasEveryDay = newValues.includes("every-day");

    if (!hadEveryDay && hasEveryDay) {
      setRepeatDays(["every-day"]);
      return;
    }
    if (hadEveryDay && !hasEveryDay) {
      setRepeatDays([]);
      return;
    }
    const selectedDays = newValues.filter((v) => v !== "every-day");
    if (WEEKDAYS.every((d) => selectedDays.includes(d))) {
      setRepeatDays(["every-day"]);
    } else {
      setRepeatDays(selectedDays);
    }
  }

  function handleSubmit() {
    if (!onAddSchedule) {
      return;
    }
    onAddSchedule({
      subjectName: subjectName.trim(),
      teacherName: teacherName.trim(),
      startTime,
      startDate,
      endTime,
      endDate,
    });
    setSubjectName("");
    setTeacherName("");
    setStartTime("08:00");
    setEndTime("09:00");
    setStartDate(format(date, "yyyy-MM-dd"));
    setEndDate(format(date, "yyyy-MM-dd"));
    setRepeat(true);
    setRepeatDays(["monday"]);
  }

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="px-4 py-3 flex flex-col gap-3 max-w-5xl mx-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* App title */}
          <div className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary shrink-0" />
            <h1 className="text-xl font-bold tracking-tight">My Timetable</h1>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-2 flex-wrap">
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
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full ml-auto"
                  aria-label="Add schedule"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Add schedule</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Subject name</p>
                    <Input
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      placeholder="e.g. Mathematics"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Teacher name</p>
                    <Input
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      placeholder="e.g. Mr. Anderson"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Start time</p>
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Start day</p>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">End time</p>
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">End day</p>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="repeat"
                        checked={repeat}
                        onCheckedChange={(checked) => setRepeat(!!checked)}
                      />
                      <Label htmlFor="repeat">Repeat</Label>
                    </div>
                    {repeat && (
                      <Combobox
                        multiple
                        items={REPEAT_SCHEDULE}
                        value={repeatDays}
                        onValueChange={(values) => {
                          console.log(values);
                        }}
                        autoHighlight
                      >
                        <ComboboxChips ref={anchor} className="w-full max-w-xs">
                          <ComboboxValue>
                            {(values) => (
                              <Fragment>
                                {values.map((value: string) => (
                                  <ComboboxChip key={value}>{value}</ComboboxChip>
                                ))}
                              </Fragment>
                            )}
                          </ComboboxValue>
                          <ComboboxChipsInput placeholder="Select a framework" />
                        </ComboboxChips>
                        <ComboboxContent anchor={anchor}>
                          <ComboboxItem value="every-day">Every day</ComboboxItem>
                          <ComboboxSeparator />
                          <ComboboxList>
                            {(day: SelectItemType) => (
                              <ComboboxItem key={day.value} value={day}>
                                {day.label}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleSubmit}>
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Prev / label / Next */}
            <div className="flex items-center gap-1 ml-auto sm:ml-0">
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
            </div>
          </div>
        </div>

        {/* Day chips row */}
        <div className="flex items-center justify-between overflow-x-auto pb-1">
          {weekDays.map((day) => {
            const isActive = day.toDateString() === date.toDateString();

            return (
              <Button
                key={day.toISOString()}
                type="button"
                size="sm"
                variant={isActive ? "default" : "ghost"}
                className="h-8 px-3 rounded-2xl text-xs font-medium shrink-0"
                onClick={() => onDateChange?.(day)}
              >
                {format(day, "EEE")}
              </Button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
