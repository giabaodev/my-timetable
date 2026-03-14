import { type Subject, type SubjectColor } from "@/lib/timetable-data";
import { formatTimeRange } from "@/lib/date-utils";
import { MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const COLOR_MAP: Record<SubjectColor, { bg: string; border: string; text: string; badge: string }> =
  {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-l-blue-500",
      text: "text-blue-700 dark:text-blue-300",
      badge: "bg-blue-500",
    },
    violet: {
      bg: "bg-violet-50 dark:bg-violet-950/40",
      border: "border-l-violet-500",
      text: "text-violet-700 dark:text-violet-300",
      badge: "bg-violet-500",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-l-emerald-500",
      text: "text-emerald-700 dark:text-emerald-300",
      badge: "bg-emerald-500",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-l-amber-500",
      text: "text-amber-700 dark:text-amber-300",
      badge: "bg-amber-500",
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-l-rose-500",
      text: "text-rose-700 dark:text-rose-300",
      badge: "bg-rose-500",
    },
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-950/40",
      border: "border-l-cyan-500",
      text: "text-cyan-700 dark:text-cyan-300",
      badge: "bg-cyan-500",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-950/40",
      border: "border-l-orange-500",
      text: "text-orange-700 dark:text-orange-300",
      badge: "bg-orange-500",
    },
  };

interface SubjectCardProps {
  subject: Subject;
  startTime: string;
  endTime: string;
  notes?: string;
  /** Compact mode — used in week/month views */
  compact?: boolean;
}

export function SubjectCard({
  subject,
  startTime,
  endTime,
  notes,
  compact = false,
}: Readonly<SubjectCardProps>) {
  const colors = COLOR_MAP[subject.color];

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2 py-1 border-l-2 text-xs font-medium",
          colors.bg,
          colors.border,
          colors.text
        )}
      >
        <span className="truncate">{subject.shortName}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border-l-4 p-4 shadow-sm transition-all hover:shadow-md",
        colors.bg,
        colors.border
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className={cn("font-semibold text-sm leading-tight", colors.text)}>{subject.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{subject.teacher}</p>
        </div>
        <div className={cn("h-2.5 w-2.5 rounded-full shrink-0 mt-1", colors.badge)} />
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatTimeRange(startTime, endTime)}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{subject.room}</span>
        </div>
      </div>

      {notes && (
        <p className="mt-2 text-xs text-muted-foreground italic border-t border-border pt-2">
          {notes}
        </p>
      )}
    </div>
  );
}
