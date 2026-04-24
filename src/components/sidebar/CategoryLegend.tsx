"use client";

import { CATEGORY_OPTIONS } from "@/lib/types";

export function CategoryLegend() {
  return (
    <div className="p-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Categories
      </h3>
      <div className="space-y-1.5">
        {CATEGORY_OPTIONS.map((cat) => (
          <div
            key={cat.value}
            className="flex items-center gap-2 text-sm text-foreground"
          >
            <span className="text-base">{cat.emoji}</span>
            <span>{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
