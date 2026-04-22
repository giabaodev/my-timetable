# My Timetable

A modern, responsive schedule management web app inspired by Google Calendar — built for Gen Z with a warm beige aesthetic.

## Features

- **Three calendar views**: Day, Week (default), and Month
- **Event creation**: Quick-add via time slots or FAB button with title, date, time pickers, color swatches, categories, and repeat options
- **Recurring events**: Daily, Weekly, Monthly, or Custom (specific days of week) — computed dynamically from rules
- **Event details**: Click any event to view details in a slide-out sheet
- **Smart deletion**: Delete single occurrence, this & future, or entire series for recurring events
- **Keyboard shortcuts**: `N` = new event, `T` = jump to today
- **Responsive design**: Desktop sidebar + tablet FAB + mobile bottom nav
- **Toast notifications**: Friendly confirmation messages on add/delete
- **Current time indicator**: Red line showing the current time in Day/Week views
- **localStorage persistence**: All data stored locally — no backend needed
- **Loading skeleton**: Smooth initial mount experience

## Tech Stack

- **Next.js** (App Router) + **React 19**
- **Bun** runtime
- **shadcn/ui** + **Radix UI** primitives
- **Tailwind CSS** v4
- **date-fns** for date math
- **sonner** for toast notifications

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Start production server
bun start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## localStorage Schema

All events are stored under the key `scheduleEvents` as a JSON array:

```ts
interface ScheduleEvent {
  id: string; // crypto.randomUUID()
  title: string;
  date: string; // "YYYY-MM-DD" (anchor date)
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  color: string; // hex color
  category: "class" | "personal" | "reminder" | "other";
  recurrence: {
    type: "none" | "daily" | "weekly" | "monthly" | "custom";
    daysOfWeek?: number[]; // 0=Sun…6=Sat (for 'custom')
    endDate?: string; // ISO date (optional)
  };
  notes?: string;
  createdAt: string; // ISO datetime
  deletedOccurrences?: string[]; // ISO dates of individually deleted occurrences
}
```

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Beige theme CSS variables
│   ├── layout.tsx           # Root layout with font + toaster
│   └── page.tsx             # Main entry point
├── components/
│   ├── CalendarApp.tsx      # Main orchestrator component
│   ├── calendar/
│   │   ├── CalendarHeader.tsx
│   │   ├── CurrentTimeIndicator.tsx
│   │   ├── DayView.tsx
│   │   ├── EventBlock.tsx
│   │   ├── MonthView.tsx
│   │   └── WeekView.tsx
│   ├── modals/
│   │   ├── AddEventModal.tsx
│   │   └── EventDetailSheet.tsx
│   ├── sidebar/
│   │   ├── CategoryLegend.tsx
│   │   └── MiniCalendar.tsx
│   └── ui/                  # shadcn components
├── hooks/
│   ├── useCalendar.ts       # Date navigation + view state
│   └── useEvents.ts         # CRUD + localStorage + recurrence
└── lib/
    ├── types.ts             # TypeScript types + constants
    └── utils.ts             # cn() utility
```

## Color Palette

| Role           | Hex       |
| -------------- | --------- |
| Background     | `#FAF7F2` |
| Card/Surface   | `#F5F0E8` |
| Accent         | `#E8DDD0` |
| Text Primary   | `#2C2416` |
| Text Secondary | `#7A6E5F` |
| CTA/Highlight  | `#C9A96E` |
| Danger         | `#D97B6C` |
| Border         | `#E0D8CC` |

## License

MIT
