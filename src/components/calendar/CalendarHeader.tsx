"use client";

import { Button } from "@/components/ui/button";
import type { ViewMode } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";

interface CalendarHeaderProps {
  title: string;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const views: { value: ViewMode; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export function CalendarHeader({
  title,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
}: Readonly<CalendarHeaderProps>) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-[#E0D8CC]">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="text-xs font-medium"
        >
          Today
        </Button>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onPrev}
            aria-label="Previous"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onNext}
            aria-label="Next"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <h2 className="text-base font-semibold text-[#2C2416] sm:text-lg">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-[#E0D8CC] bg-[#F5F0E8] p-0.5">
          {views.map((v) => (
            <button
              key={v.value}
              onClick={() => onViewChange(v.value)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                view === v.value
                  ? "bg-white text-[#2C2416] shadow-sm"
                  : "text-[#7A6E5F] hover:text-[#2C2416]"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <UserMenu />
      </div>
    </div>
  );
}
