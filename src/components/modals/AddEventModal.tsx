"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EVENT_COLORS,
  CATEGORY_OPTIONS,
  RECURRENCE_OPTIONS,
  DAYS_OF_WEEK,
  type EventCategory,
  type RecurrenceType,
  type ScheduleEvent,
} from "@/lib/types";

interface AddEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: Omit<ScheduleEvent, "id" | "createdAt">) => void;
  defaultDate?: string;
  defaultTime?: string;
}

const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    TIME_OPTIONS.push(
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    );
  }
}

export function AddEventModal({
  open,
  onOpenChange,
  onSave,
  defaultDate,
  defaultTime,
}: Readonly<AddEventModalProps>) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(
    defaultDate || format(new Date(), "yyyy-MM-dd"),
  );
  const [startTime, setStartTime] = useState(defaultTime || "09:00");
  const [endTime, setEndTime] = useState(
    defaultTime
      ? `${String(Math.min(23, Number.parseInt(defaultTime.split(":")[0]) + 1)).padStart(2, "0")}:${defaultTime.split(":")[1]}`
      : "10:00",
  );
  const [color, setColor] = useState(EVENT_COLORS[0]);
  const [category, setCategory] = useState<EventCategory>("class");
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setTitle("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setStartTime("09:00");
    setEndTime("10:00");
    setColor(EVENT_COLORS[0]);
    setCategory("class");
    setRecurrenceType("none");
    setCustomDays([]);
    setNotes("");
  };

  // Sync defaults when modal opens with new defaults
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      if (defaultDate) setDate(defaultDate);
      if (defaultTime) {
        setStartTime(defaultTime);
        const nextH = Math.min(
          23,
          Number.parseInt(defaultTime.split(":")[0]) + 1,
        );
        setEndTime(
          `${String(nextH).padStart(2, "0")}:${defaultTime.split(":")[1]}`,
        );
      }
    } else {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      date,
      startTime,
      endTime,
      color,
      category,
      recurrence: {
        type: recurrenceType,
        ...(recurrenceType === "custom" ? { daysOfWeek: customDays } : {}),
      },
      notes: notes.trim() || undefined,
    });

    resetForm();
    onOpenChange(false);
    toast.success("Got it! 🎉", {
      description: "Event added to your schedule",
    });
  };

  const toggleCustomDay = (day: number) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-[#FAF7F2] border-[#E0D8CC] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#2C2416] text-lg">
            New Event ✨
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-[#7A6E5F] text-xs">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's the plan?"
              className="bg-[#F5F0E8] border-[#E0D8CC] focus:border-[#C9A96E] text-[#2C2416] placeholder:text-[#7A6E5F]/50"
              autoFocus
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-[#7A6E5F] text-xs">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-[#F5F0E8] border-[#E0D8CC] text-[#2C2416]"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[#7A6E5F] text-xs">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="bg-[#F5F0E8] border-[#E0D8CC] text-[#2C2416]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#FAF7F2] border-[#E0D8CC] max-h-48">
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[#7A6E5F] text-xs">End Time</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="bg-[#F5F0E8] border-[#E0D8CC] text-[#2C2416]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#FAF7F2] border-[#E0D8CC] max-h-48">
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <Label className="text-[#7A6E5F] text-xs">Color</Label>
            <div className="flex gap-2">
              {EVENT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`size-8 rounded-full transition-all hover:scale-110 ${
                    color === c
                      ? "ring-2 ring-offset-2 ring-offset-[#FAF7F2]"
                      : ""
                  }`}
                  style={{
                    backgroundColor: c,
                    ...(color === c ? { ringColor: c } : {}),
                  }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-[#7A6E5F] text-xs">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as EventCategory)}
            >
              <SelectTrigger className="bg-[#F5F0E8] border-[#E0D8CC] text-[#2C2416]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#FAF7F2] border-[#E0D8CC]">
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.emoji} {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Repeat */}
          <div className="space-y-1.5">
            <Label className="text-[#7A6E5F] text-xs">Repeat</Label>
            <Select
              value={recurrenceType}
              onValueChange={(v) => setRecurrenceType(v as RecurrenceType)}
            >
              <SelectTrigger className="bg-[#F5F0E8] border-[#E0D8CC] text-[#2C2416]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#FAF7F2] border-[#E0D8CC]">
                {RECURRENCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {recurrenceType === "custom" && (
              <div className="flex gap-1 pt-2">
                {DAYS_OF_WEEK.map((day, i) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleCustomDay(i)}
                    className={`size-9 rounded-full text-xs font-medium transition-all ${
                      customDays.includes(i)
                        ? "bg-[#C9A96E] text-white"
                        : "bg-[#F5F0E8] text-[#7A6E5F] hover:bg-[#E8DDD0]"
                    }`}
                  >
                    {day.charAt(0)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-[#7A6E5F] text-xs">
              Notes (optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add some notes..."
              className="bg-[#F5F0E8] border-[#E0D8CC] text-[#2C2416] placeholder:text-[#7A6E5F]/50 min-h-[60px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="border-[#E0D8CC] text-[#7A6E5F]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim()}
            className="bg-[#C9A96E] text-white hover:bg-[#B89A5F]"
          >
            Save Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
