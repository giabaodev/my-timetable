"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CATEGORY_OPTIONS,
  RECURRENCE_OPTIONS,
  DAYS_OF_WEEK,
  type ScheduleEvent,
} from "@/lib/types";
import { Calendar, Clock, Tag, Repeat, FileText, Trash2 } from "lucide-react";

interface EventDetailSheetProps {
  event: ScheduleEvent | null;
  occurrenceDate: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
  onDeleteOccurrence: (id: string, date: string) => void;
  onDeleteThisAndFuture: (id: string, date: string) => void;
}

export function EventDetailSheet({
  event,
  occurrenceDate,
  open,
  onOpenChange,
  onDelete,
  onDeleteOccurrence,
  onDeleteThisAndFuture,
}: Readonly<EventDetailSheetProps>) {
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);

  if (!event) return null;

  const cat = CATEGORY_OPTIONS.find((c) => c.value === event.category);
  const recurrence = RECURRENCE_OPTIONS.find(
    (r) => r.value === event.recurrence.type,
  );
  const isRecurring = event.recurrence.type !== "none";

  const displayDate = occurrenceDate || event.date;

  const handleDelete = () => {
    if (isRecurring) {
      setShowDeleteOptions(true);
      return;
    }
    onDelete(event.id);
    onOpenChange(false);
    toast.success("Event deleted", { description: "Poof! It's gone 💨" });
  };

  const handleDeleteThis = () => {
    if (occurrenceDate) {
      onDeleteOccurrence(event.id, occurrenceDate);
    }
    onOpenChange(false);
    setShowDeleteOptions(false);
    toast.success("Occurrence deleted", {
      description: "Just this one — gone 💨",
    });
  };

  const handleDeleteAll = () => {
    onDelete(event.id);
    onOpenChange(false);
    setShowDeleteOptions(false);
    toast.success("All events deleted", {
      description: "The whole series is gone 💨",
    });
  };

  const handleDeleteFuture = () => {
    if (occurrenceDate) {
      onDeleteThisAndFuture(event.id, occurrenceDate);
    }
    onOpenChange(false);
    setShowDeleteOptions(false);
    toast.success("Future events deleted", {
      description: "This and future occurrences removed 💨",
    });
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setShowDeleteOptions(false);
      }}
    >
      <SheetContent
        side="right"
        className="bg-background border-border w-full sm:max-w-100"
      >
        <SheetHeader>
          <div className="flex items-center gap-2">
            <div
              className="size-3 rounded-full shrink-0"
              style={{ backgroundColor: event.color }}
            />
            <SheetTitle className="text-foreground text-lg">
              {event.title}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 text-sm text-foreground">
            <Calendar className="size-4 text-muted-foreground" />
            <span>{format(parseISO(displayDate), "EEEE, MMMM d, yyyy")}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-foreground">
            <Clock className="size-4 text-muted-foreground" />
            <span>
              {event.startTime} – {event.endTime}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-foreground">
            <Tag className="size-4 text-muted-foreground" />
            <span>
              {cat?.emoji} {cat?.label}
            </span>
          </div>

          {isRecurring && (
            <div className="flex items-center gap-3 text-sm text-foreground">
              <Repeat className="size-4 text-muted-foreground" />
              <span>
                {recurrence?.label}
                {event.recurrence.type === "custom" &&
                  event.recurrence.daysOfWeek && (
                    <span className="text-muted-foreground ml-1">
                      (
                      {event.recurrence.daysOfWeek
                        .map((d) => DAYS_OF_WEEK[d])
                        .join(", ")}
                      )
                    </span>
                  )}
              </span>
            </div>
          )}

          {event.notes && (
            <>
              <Separator className="bg-border" />
              <div className="flex gap-3 text-sm text-foreground">
                <FileText className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="whitespace-pre-wrap">{event.notes}</p>
              </div>
            </>
          )}
        </div>

        <Separator className="bg-border" />

        <SheetFooter className="pt-4">
          {showDeleteOptions ? (
            <div className="w-full space-y-2">
              <p className="text-sm text-muted-foreground text-center mb-3">
                This is a recurring event. What would you like to delete?
              </p>
              <Button
                variant="outline"
                onClick={handleDeleteThis}
                className="w-full border-border text-foreground"
              >
                Only this event
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteFuture}
                className="w-full border-border text-foreground"
              >
                This and future events
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAll}
                className="w-full"
              >
                All events in series
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowDeleteOptions(false)}
                className="w-full text-muted-foreground"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="w-full gap-2"
            >
              <Trash2 className="size-4" />
              Delete Event
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
