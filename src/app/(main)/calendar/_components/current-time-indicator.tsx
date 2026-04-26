'use client';

export function CurrentTimeIndicator() {
  return (
    <div className="absolute left-0 right-0 z-20 pointer-events-none flex items-center">
      <div className="size-2.5 rounded-full bg-red-500 -ml-1.5 shrink-0" />
      <div className="h-0.5 w-full bg-red-500" />
    </div>
  );
}
